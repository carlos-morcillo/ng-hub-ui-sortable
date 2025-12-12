import { MoveEvent } from 'sortablejs';

/**
 * Data accepted by the sortable directive. Can be an array or an Angular `FormArray`.
 */
export type SortableData = any | any[];

/**
 * SortableJS event names intercepted by the directive.
 */
export type SortableEventName =
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
	| 'onMove';

/**
 * Payload emitted by the `move` output combining SortableJS move event details.
 */
export interface SortableMoveEventPayload {
	event: MoveEvent;
	originalEvent: Event;
}
