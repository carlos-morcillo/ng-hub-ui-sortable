import { SortableEvent } from 'sortablejs';

/**
 * Extracts the old and new indexes from a SortableJS event, covering both clone and standard moves.
 */
export const getIndexesFromEvent = (event: SortableEvent) => {
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
