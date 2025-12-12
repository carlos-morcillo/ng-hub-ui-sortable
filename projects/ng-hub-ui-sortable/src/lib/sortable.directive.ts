import {
	afterNextRender,
	Directive,
	ElementRef,
	inject,
	Injector,
	input,
	NgZone,
	OnChanges,
	OnDestroy,
	OnInit,
	output,
	Renderer2,
	SimpleChange
} from '@angular/core';
import Sortable, { MoveEvent, Options, SortableEvent } from 'sortablejs';
import { GLOBALS } from './globals';
import { SortableBindings } from './sortable-bindings';
import { INDIVIDUAL_OPTION_INPUTS } from './sortable-options';
import { getIndexesFromEvent } from './sortable-utils';
import { SortableService } from './sortable.service';
import {
	SortableData,
	SortableEventName,
	SortableMoveEventPayload
} from './sortable.types';

/**
 * Directive that integrates SortableJS with Angular.
 * Provides drag-and-drop sorting functionality with full support for Angular's reactive patterns.
 *
 * @example
 * ```html
 * <div [hubSortable]="items" (update)="onUpdate($event)">
 *   <div *ngFor="let item of items">{{ item }}</div>
 * </div>
 * ```
 *
 * @example
 * ```html
 * <div [hubSortable]="items"
 *      [options]="{ animation: 150, group: 'shared' }"
 *      (start)="onDragStart($event)"
 *      (end)="onDragEnd($event)">
 *   <div *ngFor="let item of items">{{ item }}</div>
 * </div>
 * ```
 */
@Directive({
	selector: '[hubSortable]',
	standalone: true
})
export class SortableDirective implements OnInit, OnChanges, OnDestroy {
	private globalConfig = inject(GLOBALS, { optional: true });
	private service = inject(SortableService);
	private element = inject(ElementRef);
	private zone = inject(NgZone);
	private renderer = inject(Renderer2);
	private injector = inject(Injector);

	/**
	 * Array of items or FormArray to be sorted.
	 * This can be a simple array or an Angular FormArray for reactive forms.
	 */
	readonly items = input<SortableData>(undefined, { alias: 'hubSortable' });

	/**
	 * CSS selector for the container element within the host element.
	 * If not provided, the host element itself will be used.
	 */
	readonly container = input<string>(undefined);

	/**
	 * SortableJS options object.
	 * See https://github.com/SortableJS/Sortable#options for available options.
	 */
	readonly options = input<Options>(undefined);

	/** Group name or group options for dragging between lists */
	readonly group = input<Options['group']>(undefined);
	/** Enable/disable sorting within the list */
	readonly sort = input<Options['sort']>(undefined);
	/** Time in milliseconds to define when the sorting should start */
	readonly delay = input<Options['delay']>(undefined);
	/** Disable the sortable if set to true */
	readonly disabled = input<Options['disabled']>(undefined);
	/** CSS selector for draggable items within the container */
	readonly draggable = input<Options['draggable']>(undefined);
	/** CSS selector for drag handle within list items */
	readonly handle = input<Options['handle']>(undefined);
	/** Animation speed in milliseconds when sorting */
	readonly animation = input<Options['animation']>(undefined);
	/** CSS class applied to the ghost element during drag */
	readonly ghostClass = input<Options['ghostClass']>(undefined);
	/** CSS class applied to the chosen element */
	readonly chosenClass = input<Options['chosenClass']>(undefined);
	/** CSS class applied to the dragging element */
	readonly dragClass = input<Options['dragClass']>(undefined);
	/** Append ghost element to document body */
	readonly fallbackOnBody = input<Options['fallbackOnBody']>(undefined);
	/** Number of pixels a point should move before triggering drag */
	readonly fallbackTolerance = input<Options['fallbackTolerance']>(undefined);
	/** CSS class applied when using forceFallback */
	readonly fallbackClass = input<Options['fallbackClass']>(undefined);
	/** Fallback offset */
	readonly fallbackOffset = input<Options['fallbackOffset']>(undefined);
	/** Force the fallback to activate */
	readonly forceFallback = input<Options['forceFallback']>(undefined);
	/** CSS selector or function to filter items that should not be draggable */
	readonly filter = input<Options['filter']>(undefined);
	/** Call preventDefault on filter event */
	readonly preventOnFilter = input<Options['preventOnFilter']>(undefined);
	/** Direction of Sortable (will be detected automatically if not given) */
	readonly direction = input<Options['direction']>(undefined);
	/** Threshold of swap zone */
	readonly swapThreshold = input<Options['swapThreshold']>(undefined);
	/** Inverts swap threshold direction */
	readonly invertSwap = input<Options['invertSwap']>(undefined);
	/** Threshold when swapping direction is inverted */
	readonly invertedSwapThreshold =
		input<Options['invertedSwapThreshold']>(undefined);
	/** Remove clone element when not showing */
	readonly removeCloneOnHide = input<Options['removeCloneOnHide']>(undefined);
	/** CSS selector for elements to ignore */
	readonly ignore = input<Options['ignore']>(undefined);
	/** Number of pixels a point should move before cancelling a delayed drag event */
	readonly touchStartThreshold =
		input<Options['touchStartThreshold']>(undefined);
	/** Distance mouse must be from empty sortable to insert drag element into it */
	readonly emptyInsertThreshold =
		input<Options['emptyInsertThreshold']>(undefined);
	/** Enable drop bubble */
	readonly dropBubble = input<Options['dropBubble']>(undefined);
	/** Enable dragover bubble */
	readonly dragoverBubble = input<Options['dragoverBubble']>(undefined);
	/** HTML attribute that defines the data id */
	readonly dataIdAttr = input<Options['dataIdAttr']>(undefined);
	/** Only delay on touch devices */
	readonly delayOnTouchOnly = input<Options['delayOnTouchOnly']>(undefined);
	/** Easing for animation */
	readonly easing = input<Options['easing']>(undefined);
	/** Function to set data for dragover/drop events */
	readonly setData = input<Options['setData']>(undefined);
	/** Store module for saving and restoring of the sort */
	readonly store = input<Options['store']>(undefined);

	/**
	 * Custom function to clone items when dragging between lists.
	 * If not provided, items will be passed through without cloning.
	 */
	readonly cloneFunction = input<(item: any) => any>(undefined);

	/** List of individual option input names */
	private readonly individualOptionInputs = INDIVIDUAL_OPTION_INPUTS;

	/**
	 * The SortableJS instance created for this directive.
	 * Will be null until ngOnInit completes.
	 */
	private sortableInstance: Sortable | null = null;

	/** Emitted when the Sortable instance is created */
	readonly init = output<Sortable>();
	/** Emitted when dragging starts */
	readonly start = output<SortableEvent>();
	/** Emitted when dragging ends */
	readonly end = output<SortableEvent>();
	/** Emitted when an item is added from another list */
	readonly add = output<SortableEvent>();
	/** Emitted when an item is updated within the same list */
	readonly update = output<SortableEvent>();
	/** Emitted when the list is sorted */
	readonly sortEvent = output<SortableEvent>();
	/** Emitted when an item is removed to another list */
	readonly remove = output<SortableEvent>();
	/** Emitted when an attempt is made to drag a filtered element */
	readonly filterEvent = output<SortableEvent>();
	/** Emitted when the list changes by adding or removing an item */
	readonly change = output<SortableEvent>();
	/** Emitted when an item is chosen */
	readonly choose = output<SortableEvent>();
	/** Emitted when an item is unchosen */
	readonly unchoose = output<SortableEvent>();
	/** Emitted when an item is cloned */
	readonly clone = output<SortableEvent>();
	/** Emitted when an item is moved within or between lists */
	readonly move = output<SortableMoveEventPayload>();

	/**
	 * Initializes the Sortable instance.
	 * Checks for Sortable availability to handle SSR scenarios.
	 */
	ngOnInit(): void {
		if (Sortable && Sortable.create) {
			// Sortable does not exist in angular universal (SSR)
			this.create();
		}
	}

	/**
	 * Handles input changes and updates the Sortable instance accordingly.
	 * @param changes - Object containing all changed inputs
	 */
	ngOnChanges(changes: {
		[prop in keyof SortableDirective]: SimpleChange;
	}): void {
		const optionsChange: SimpleChange = changes.options;

		if (optionsChange && !optionsChange.isFirstChange()) {
			const previousOptions: Options = optionsChange.previousValue || {};
			const currentOptions: Options = optionsChange.currentValue || {};

			Object.keys(currentOptions).forEach((optionName) => {
				if (currentOptions[optionName] !== previousOptions[optionName]) {
					// use low-level option setter
					this.sortableInstance?.option(
						optionName as keyof Options,
						this.sortableOptions[optionName as keyof Options]
					);
				}
			});
		}

		this.applyIndividualOptionChanges(changes);
	}

	/**
	 * Cleans up the Sortable instance when the directive is destroyed.
	 */
	ngOnDestroy(): void {
		if (this.sortableInstance) {
			this.sortableInstance.destroy();
		}
	}

	/**
	 * Creates the Sortable instance on the appropriate container element.
	 * Uses afterNextRender to ensure the DOM is fully rendered before initialization.
	 */
	private create(): void {
		const containerSelector = this.container();
		const container = containerSelector
			? this.element.nativeElement.querySelector(containerSelector)
			: this.element.nativeElement;

		if (!container) {
			console.error(
				`[hubSortable] Container not found with selector: ${containerSelector}`
			);
			return;
		}

		afterNextRender(
			() => {
				this.sortableInstance = Sortable.create(
					container,
					this.sortableOptions
				);
				this.init.emit(this.sortableInstance);
			},
			{ injector: this.injector }
		);
	}

	/**
	 * Gets the bindings wrapper for the items input.
	 * Handles different types of item inputs (array, FormArray, SortableBindings).
	 * @returns SortableBindings instance wrapping the items
	 */
	private getBindings(): SortableBindings {
		const itemsInput = this.items();
		if (!itemsInput) {
			return new SortableBindings([]);
		} else if (itemsInput instanceof SortableBindings) {
			return itemsInput;
		} else {
			return new SortableBindings([itemsInput]);
		}
	}

	/**
	 * Combines all options into a final configuration object for SortableJS.
	 * Merges global config, user options, individual options, and overridden event handlers.
	 * @returns Complete options object for Sortable
	 */
	private get sortableOptions(): Options {
		return { ...this.optionsWithoutEvents, ...this.overridenOptions };
	}

	/**
	 * Merges global config, options input, and individual option inputs.
	 * Does not include event handlers (those are in overridenOptions).
	 * @returns Options without event handlers
	 */
	private get optionsWithoutEvents(): Partial<Options> {
		return {
			...(this.globalConfig || {}),
			...(this.options() || {}),
			...this.getIndividualOptions()
		};
	}

	/**
	 * Proxies SortableJS events to run inside Angular's zone.
	 * Calls any user-provided event handler and emits the corresponding output.
	 * @param eventName - Name of the Sortable event
	 * @param params - Event parameters
	 * @returns Result from the user's event handler if provided
	 */
	private proxyEvent(eventName: SortableEventName, ...params: any[]): any {
		// re-entering zone, see https://github.com/SortableJS/angular-sortablejs/issues/110#issuecomment-408874600
		return this.zone.run(() => {
			const options = this.optionsWithoutEvents || {};
			const handler = options[eventName] as (...args: any[]) => any;
			const handlerResult = handler ? handler(...params) : undefined;

			this.emitOutputs(eventName, params);

			return handlerResult;
		});
	}

	/**
	 * Emits the appropriate Angular output based on the Sortable event name.
	 * @param eventName - Name of the Sortable event
	 * @param params - Event parameters to emit
	 */
	private emitOutputs(eventName: SortableEventName, params: any[]): void {
		switch (eventName) {
			case 'onStart':
				this.start.emit(params[0]);
				break;
			case 'onEnd':
				this.end.emit(params[0]);
				break;
			case 'onAdd':
				this.add.emit(params[0]);
				break;
			case 'onRemove':
				this.remove.emit(params[0]);
				break;
			case 'onUpdate':
				this.update.emit(params[0]);
				break;
			case 'onSort':
				this.sortEvent.emit(params[0]);
				break;
			case 'onFilter':
				this.filterEvent.emit(params[0]);
				break;
			case 'onChange':
				this.change.emit(params[0]);
				break;
			case 'onChoose':
				this.choose.emit(params[0]);
				break;
			case 'onUnchoose':
				this.unchoose.emit(params[0]);
				break;
			case 'onClone':
				this.clone.emit(params[0]);
				break;
			case 'onMove':
				this.move.emit({
					event: params[0],
					originalEvent: params[1]
				});
				break;
		}
	}

	/**
	 * Checks if the current drag operation is cloning items.
	 * @returns True if cloning, false otherwise
	 */
	private get isCloning(): boolean {
		if (!this.sortableInstance?.options?.group) {
			return false;
		}

		const group = this.sortableInstance.options.group;

		// Check if group has checkPull function
		if (
			typeof group === 'object' &&
			'checkPull' in group &&
			typeof group.checkPull === 'function'
		) {
			try {
				// Cast to any to avoid strict type checking on checkPull signature
				const result = (group.checkPull as any)(
					this.sortableInstance,
					this.sortableInstance
				);
				return result === 'clone';
			} catch {
				return false;
			}
		}

		// Fallback: check if pull is set to 'clone'
		if (typeof group === 'object' && 'pull' in group) {
			return group.pull === 'clone';
		}

		return false;
	}

	/**
	 * Clones an item using the provided clone function or passes it through unchanged.
	 * @param item - Item to clone
	 * @returns Cloned item or the original item if no clone function is provided
	 */
	private cloneItem<T>(item: T): T {
		// by default pass the item through, no cloning performed
		return (this.cloneFunction() || ((subitem) => subitem))(item);
	}

	/**
	 * Collects all individual option inputs into a single options object.
	 * Only includes options that have defined values.
	 * @returns Partial options object with individual options
	 */
	private getIndividualOptions(): Partial<Options> {
		return this.individualOptionInputs.reduce((options, optionName) => {
			const inputSignal = this[optionName as keyof this];

			if (typeof inputSignal === 'function') {
				const optionValue = inputSignal();
				if (optionValue !== undefined) {
					(options as any)[optionName] = optionValue;
				}
			}

			return options;
		}, {} as Partial<Options>);
	}

	/**
	 * Applies changes to individual option inputs to the Sortable instance.
	 * @param changes - Object containing all changed inputs
	 */
	private applyIndividualOptionChanges(changes: {
		[prop in keyof SortableDirective]: SimpleChange;
	}): void {
		if (!this.sortableInstance) {
			return;
		}

		this.individualOptionInputs.forEach((optionName) => {
			const change = changes[optionName as keyof SortableDirective];
			if (change && !change.isFirstChange()) {
				const inputSignal = this[optionName as keyof this];

				if (typeof inputSignal === 'function') {
					this.sortableInstance!.option(optionName, inputSignal());
				}
			}
		});
	}

	/**
	 * Gets event handler overrides that integrate SortableJS events with Angular.
	 * These handlers manage data binding updates and emit Angular outputs.
	 * @returns Options object with overridden event handlers
	 */
	private get overridenOptions(): Partial<Options> {
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
								.map((item) => this.cloneItem(item))
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
						this.renderer.removeChild(event.clone.parentNode, event.clone);
					} else {
						this.service.transfer(bindings.extractFromEvery(event.oldIndex));
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
			onFilter: (event: SortableEvent) => this.proxyEvent('onFilter', event),
			onChange: (event: SortableEvent) => this.proxyEvent('onChange', event),
			onChoose: (event: SortableEvent) => this.proxyEvent('onChoose', event),
			onUnchoose: (event: SortableEvent) =>
				this.proxyEvent('onUnchoose', event),
			onClone: (event: SortableEvent) => this.proxyEvent('onClone', event),
			onMove: (event: MoveEvent, originalEvent: Event) =>
				this.proxyEvent('onMove', event, originalEvent)
		};
	}
}
