import { SortableEvent } from 'sortablejs';
import { getIndexesFromEvent } from './sortable-utils';

describe('sortable-utils', () => {
	describe('getIndexesFromEvent', () => {
		it('should return draggable indexes when both are present', () => {
			const event = {
				newDraggableIndex: 3,
				oldDraggableIndex: 1,
				newIndex: 5,
				oldIndex: 2
			} as SortableEvent;

			// hasOwnProperty check requires actual properties
			Object.defineProperty(event, 'newDraggableIndex', {
				value: 3,
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(event, 'oldDraggableIndex', {
				value: 1,
				enumerable: true,
				configurable: true
			});

			const result = getIndexesFromEvent(event);
			expect(result.new).toBe(3);
			expect(result.old).toBe(1);
		});

		it('should return regular indexes when draggable indexes are not own properties', () => {
			const event = {
				newIndex: 5,
				oldIndex: 2
			} as SortableEvent;

			const result = getIndexesFromEvent(event);
			expect(result.new).toBe(5);
			expect(result.old).toBe(2);
		});

		it('should return undefined indexes when none are set', () => {
			const event = {} as SortableEvent;
			const result = getIndexesFromEvent(event);
			expect(result.new).toBeUndefined();
			expect(result.old).toBeUndefined();
		});

		it('should handle zero indexes correctly', () => {
			const event = { newIndex: 0, oldIndex: 0 } as SortableEvent;
			const result = getIndexesFromEvent(event);
			expect(result.new).toBe(0);
			expect(result.old).toBe(0);
		});
	});
});
