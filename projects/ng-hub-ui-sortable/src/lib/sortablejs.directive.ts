import {
  Directive,
  ElementRef,
  Inject,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
  SimpleChange,
  input,
  output
} from '@angular/core';
import Sortable, { MoveEvent, Options, SortableEvent } from 'sortablejs';
import { GLOBALS } from './globals';
import { SortablejsBindings } from './sortablejs-bindings';
import { SortablejsService } from './sortablejs.service';

export type SortableData = any | any[];

const getIndexesFromEvent = (event: SortableEvent) => {
	if (
		event.hasOwnProperty('newDraggableIndex') &&
		event.hasOwnProperty('oldDraggableIndex')
	) {
		return {
			new: event.newDraggableIndex,
			old: event.oldDraggableIndex
		};
	} else {
		return {
			new: event.newIndex,
			old: event.oldIndex
		};
	}
};

@Directive({
	selector: '[sortablejs]',
	standalone: true
})
export class SortablejsDirective implements OnInit, OnChanges, OnDestroy {
	readonly sortablejs = input<SortableData>(undefined); // array or a FormArray

	readonly sortablejsContainer = input<string>(undefined);

	readonly sortablejsOptions = input<Options>(undefined);

	readonly group = input<Options['group']>(undefined);
	readonly sort = input<Options['sort']>(undefined);
	readonly delay = input<Options['delay']>(undefined);
	readonly disabled = input<Options['disabled']>(undefined);
	readonly draggable = input<Options['draggable']>(undefined);
	readonly handle = input<Options['handle']>(undefined);
	readonly animation = input<Options['animation']>(undefined);
	readonly ghostClass = input<Options['ghostClass']>(undefined);
	readonly chosenClass = input<Options['chosenClass']>(undefined);
	readonly dragClass = input<Options['dragClass']>(undefined);
	readonly fallbackOnBody = input<Options['fallbackOnBody']>(undefined);
	readonly fallbackTolerance = input<Options['fallbackTolerance']>(undefined);
	readonly fallbackClass = input<Options['fallbackClass']>(undefined);
	readonly fallbackOffset = input<Options['fallbackOffset']>(undefined);
	readonly forceFallback = input<Options['forceFallback']>(undefined);
	readonly filter = input<Options['filter']>(undefined);
	readonly preventOnFilter = input<Options['preventOnFilter']>(undefined);
	readonly direction = input<Options['direction']>(undefined);
	readonly swapThreshold = input<Options['swapThreshold']>(undefined);
	readonly invertSwap = input<Options['invertSwap']>(undefined);
	readonly invertedSwapThreshold =
		input<Options['invertedSwapThreshold']>(undefined);
	readonly removeCloneOnHide = input<Options['removeCloneOnHide']>(undefined);
	readonly ignore = input<Options['ignore']>(undefined);
	readonly touchStartThreshold = input<Options['touchStartThreshold']>(undefined);
	readonly emptyInsertThreshold = input<Options['emptyInsertThreshold']>(undefined);
	readonly dropBubble = input<Options['dropBubble']>(undefined);
	readonly dragoverBubble = input<Options['dragoverBubble']>(undefined);
	readonly dataIdAttr = input<Options['dataIdAttr']>(undefined);
	readonly delayOnTouchOnly = input<Options['delayOnTouchOnly']>(undefined);
	readonly easing = input<Options['easing']>(undefined);
	readonly setData = input<Options['setData']>(undefined);
	readonly store = input<Options['store']>(undefined);

	readonly cloneFunction = input<(item: any) => any>(undefined);

	private readonly individualOptionInputs: ReadonlyArray<keyof Options> = [
		'group',
		'sort',
		'delay',
		'disabled',
		'draggable',
		'handle',
		'animation',
		'ghostClass',
		'chosenClass',
		'dragClass',
		'fallbackOnBody',
		'fallbackTolerance',
		'fallbackClass',
		'fallbackOffset',
		'forceFallback',
		'filter',
		'preventOnFilter',
		'direction',
		'swapThreshold',
		'invertSwap',
		'invertedSwapThreshold',
		'removeCloneOnHide',
		'ignore',
		'touchStartThreshold',
		'emptyInsertThreshold',
		'dropBubble',
		'dragoverBubble',
		'dataIdAttr',
		'delayOnTouchOnly',
		'easing',
		'setData',
		'store'
	];

	private sortableInstance: any;

	readonly sortablejsInit = output();
	readonly sortablejsStart = output<SortableEvent>();
	readonly sortablejsEnd = output<SortableEvent>();
	readonly sortablejsAdd = output<SortableEvent>();
	readonly sortablejsUpdate = output<SortableEvent>();
	readonly sortablejsSortEvent = output<SortableEvent>();
	readonly sortablejsRemove = output<SortableEvent>();
	readonly sortablejsFilterEvent = output<SortableEvent>();
	readonly sortablejsChange = output<SortableEvent>();
	readonly sortablejsChoose = output<SortableEvent>();
	readonly sortablejsUnchoose = output<SortableEvent>();
	readonly sortablejsClone = output<SortableEvent>();
	readonly sortablejsMove = output<{
    event: MoveEvent;
    originalEvent: Event;
}>();

	constructor(
		@Optional() @Inject(GLOBALS) private globalConfig: Options,
		private service: SortablejsService,
		private element: ElementRef,
		private zone: NgZone,
		private renderer: Renderer2
	) {}

	ngOnInit() {
		if (Sortable && Sortable.create) {
			// Sortable does not exist in angular universal (SSR)
			this.create();
		}
	}

	ngOnChanges(changes: { [prop in keyof SortablejsDirective]: SimpleChange }) {
		const optionsChange: SimpleChange = changes.sortablejsOptions;

		if (optionsChange && !optionsChange.isFirstChange()) {
			const previousOptions: Options = optionsChange.previousValue || {};
			const currentOptions: Options = optionsChange.currentValue || {};

			Object.keys(currentOptions).forEach((optionName) => {
				if (currentOptions[optionName] !== previousOptions[optionName]) {
					// use low-level option setter
					this.sortableInstance?.option(
						optionName,
						this.options[optionName]
					);
				}
			});
		}

		this.applyIndividualOptionChanges(changes);
	}

	ngOnDestroy() {
		if (this.sortableInstance) {
			this.sortableInstance.destroy();
		}
	}

	private create() {
		const sortablejsContainer = this.sortablejsContainer();
		const container = sortablejsContainer
			? this.element.nativeElement.querySelector(sortablejsContainer)
			: this.element.nativeElement;

		setTimeout(() => {
			this.sortableInstance = Sortable.create(container, this.options);
			this.sortablejsInit.emit(this.sortableInstance);
		}, 0);
	}

	private getBindings(): SortablejsBindings {
		const sortablejs = this.sortablejs();
		if (!sortablejs) {
			return new SortablejsBindings([]);
		} else if (sortablejs instanceof SortablejsBindings) {
			return sortablejs;
		} else {
			return new SortablejsBindings([sortablejs]);
		}
	}

	private get options() {
		return { ...this.optionsWithoutEvents, ...this.overridenOptions };
	}

	private get optionsWithoutEvents() {
		return {
			...(this.globalConfig || {}),
			...(this.sortablejsOptions() || {}),
			...this.getIndividualOptions()
		};
	}

	private proxyEvent(
		eventName:
			| 'onAdd'
			| 'onAddOriginal'
			| 'onRemove'
			| 'onUpdate'
			| 'onStart'
			| 'onEnd'
			| 'onSort'
			| 'onFilter'
			| 'onChange'
			| 'onChoose'
			| 'onUnchoose'
			| 'onClone'
			| 'onMove',
		...params: any[]
	) {
		// re-entering zone, see https://github.com/SortableJS/angular-sortablejs/issues/110#issuecomment-408874600
		return this.zone.run(() => {
			const options = this.optionsWithoutEvents || {};
			const handler = options[eventName] as (...args: any[]) => any;
			const handlerResult = handler ? handler(...params) : undefined;

			this.emitOutputs(eventName, params);

			return handlerResult;
		});
	}

	private emitOutputs(
		eventName:
			| 'onAdd'
			| 'onAddOriginal'
			| 'onRemove'
			| 'onUpdate'
			| 'onStart'
			| 'onEnd'
			| 'onSort'
			| 'onFilter'
			| 'onChange'
			| 'onChoose'
			| 'onUnchoose'
			| 'onClone'
			| 'onMove',
		params: any[]
	) {
		switch (eventName) {
			case 'onStart':
				this.sortablejsStart.emit(params[0]);
				break;
			case 'onEnd':
				this.sortablejsEnd.emit(params[0]);
				break;
			case 'onAdd':
				this.sortablejsAdd.emit(params[0]);
				break;
			case 'onRemove':
				this.sortablejsRemove.emit(params[0]);
				break;
			case 'onUpdate':
				this.sortablejsUpdate.emit(params[0]);
				break;
			case 'onSort':
				this.sortablejsSortEvent.emit(params[0]);
				break;
			case 'onFilter':
				this.sortablejsFilterEvent.emit(params[0]);
				break;
			case 'onChange':
				this.sortablejsChange.emit(params[0]);
				break;
			case 'onChoose':
				this.sortablejsChoose.emit(params[0]);
				break;
			case 'onUnchoose':
				this.sortablejsUnchoose.emit(params[0]);
				break;
			case 'onClone':
				this.sortablejsClone.emit(params[0]);
				break;
			case 'onMove':
				this.sortablejsMove.emit({
					event: params[0],
					originalEvent: params[1]
				});
				break;
		}
	}

	private get isCloning() {
		return (
			this.sortableInstance.options.group.checkPull(
				this.sortableInstance,
				this.sortableInstance
			) === 'clone'
		);
	}

	private clone<T>(item: T): T {
		// by default pass the item through, no cloning performed
		return (this.cloneFunction() || ((subitem) => subitem))(item);
	}

	private getIndividualOptions(): Options {
		return this.individualOptionInputs.reduce((options, optionName) => {
			const optionValue = (this as any)[optionName]();

			if (optionValue !== undefined) {
				(options as any)[optionName] = optionValue;
			}

			return options;
		}, {} as Options);
	}

	private applyIndividualOptionChanges(
		changes: { [prop in keyof SortablejsDirective]: SimpleChange }
	) {
		if (!this.sortableInstance) {
			return;
		}

		this.individualOptionInputs.forEach((optionName) => {
			const change = changes[optionName as keyof SortablejsDirective];
			if (change && !change.isFirstChange()) {
				this.sortableInstance.option(
					optionName,
					(this as any)[optionName]()
				);
			}
		});
	}

	private get overridenOptions(): Options {
		// always intercept standard events but act only in case items are set (bindingEnabled)
		// allows to forget about tracking this.items changes
		return {
			onAdd: (event: SortableEvent) => {
				this.service.transfer = (items: any[]) => {
					this.getBindings().injectIntoEvery(event.newIndex, items);
					this.proxyEvent('onAdd', event);
				};

				this.proxyEvent('onAddOriginal', event);
			},
			onRemove: (event: SortableEvent) => {
				const bindings = this.getBindings();

				if (bindings.provided) {
					if (this.isCloning) {
						this.service.transfer(
							bindings
								.getFromEvery(event.oldIndex)
								.map((item) => this.clone(item))
						);

						// great thanks to https://github.com/tauu
						// event.item is the original item from the source list which is moved to the target list
						// event.clone is a clone of the original item and will be added to source list
						// If bindings are provided, adding the item dom element to the target list causes artifacts
						// as it interferes with the rendering performed by the angular template.
						// Therefore we remove it immediately and also move the original item back to the source list.
						// (event handler may be attached to the original item and not its clone, therefore keeping
						// the original dom node, circumvents side effects )
						this.renderer.removeChild(event.item.parentNode, event.item);
						this.renderer.insertBefore(
							event.clone.parentNode,
							event.item,
							event.clone
						);
						this.renderer.removeChild(
							event.clone.parentNode,
							event.clone
						);
					} else {
						this.service.transfer(
							bindings.extractFromEvery(event.oldIndex)
						);
					}

					this.service.transfer = null;
				}

				this.proxyEvent('onRemove', event);
			},
			onUpdate: (event: SortableEvent) => {
				const bindings = this.getBindings();
				const indexes = getIndexesFromEvent(event);

				bindings.injectIntoEvery(
					indexes.new,
					bindings.extractFromEvery(indexes.old)
				);
				this.proxyEvent('onUpdate', event);
			},
			onStart: (event: SortableEvent) => this.proxyEvent('onStart', event),
			onEnd: (event: SortableEvent) => this.proxyEvent('onEnd', event),
			onSort: (event: SortableEvent) => this.proxyEvent('onSort', event),
			onFilter: (event: SortableEvent) =>
				this.proxyEvent('onFilter', event),
			onChange: (event: SortableEvent) =>
				this.proxyEvent('onChange', event),
			onChoose: (event: SortableEvent) =>
				this.proxyEvent('onChoose', event),
			onUnchoose: (event: SortableEvent) =>
				this.proxyEvent('onUnchoose', event),
			onClone: (event: SortableEvent) => this.proxyEvent('onClone', event),
			onMove: (event: MoveEvent, originalEvent: Event) =>
				this.proxyEvent('onMove', event, originalEvent)
		};
	}
}
