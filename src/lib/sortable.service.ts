import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class SortableService {
	/**
	 * Temporary cross-instance transfer callback used to reconcile SortableJS event order.
	 * Sortable fires `onAdd` before `onRemove`, so the target stores a callback here and the
	 * source invokes it once the dragged data has been extracted.
	 */
	transfer: ((items: any[]) => void) | null = null;

	/**
	 * Shared drag-session flag used to suppress duplicated `onAdd`/`onUpdate` callbacks
	 * emitted by SortableJS during the same drop operation.
	 */
	dropEventProcessed = false;
}
