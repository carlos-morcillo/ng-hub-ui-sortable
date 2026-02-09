/**
 * Helper functions for manual array manipulation in drag-and-drop operations.
 * These utilities allow developers to have full control over how arrays are updated
 * when items are dragged and dropped, similar to Angular CDK's approach.
 *
 * @example
 * ```typescript
 * import { moveItemInArray, transferArrayItem } from 'ng-hub-ui-sortable';
 *
 * // Reorder within same array
 * moveItemInArray(myArray, 2, 0);
 *
 * // Move between arrays
 * transferArrayItem(sourceArray, targetArray, 1, 3);
 * ```
 */

/**
 * Moves an item in an array from one position to another.
 * This function mutates the array in place.
 *
 * @param array - The array containing the item to move
 * @param fromIndex - The current index of the item (0-based)
 * @param toIndex - The target index where the item should be moved (0-based)
 *
 * @example
 * ```typescript
 * const items = ['A', 'B', 'C', 'D'];
 * moveItemInArray(items, 1, 3);
 * // Result: ['A', 'C', 'D', 'B']
 * ```
 */
export function moveItemInArray<T = any>(
	array: T[],
	fromIndex: number,
	toIndex: number
): void {
	if (!array || array.length === 0) {
		return;
	}

	// Ensure indices are within bounds
	if (
		fromIndex < 0 ||
		fromIndex >= array.length ||
		toIndex < 0 ||
		toIndex >= array.length
	) {
		console.warn(
			`[moveItemInArray] Invalid indices: fromIndex=${fromIndex}, toIndex=${toIndex}, array length=${array.length}`
		);
		return;
	}

	// No-op if moving to same position
	if (fromIndex === toIndex) {
		return;
	}

	// Remove item from original position
	const item = array.splice(fromIndex, 1)[0];

	// Insert at new position
	array.splice(toIndex, 0, item);
}

/**
 * Transfers an item from one array to another.
 * This function mutates both arrays in place.
 *
 * @param currentArray - The array from which to remove the item
 * @param targetArray - The array to which the item should be added
 * @param currentIndex - The index of the item in the current array (0-based)
 * @param targetIndex - The index at which to insert in the target array (0-based)
 *
 * @example
 * ```typescript
 * const source = ['A', 'B', 'C'];
 * const target = ['1', '2', '3'];
 * transferArrayItem(source, target, 1, 2);
 * // source: ['A', 'C']
 * // target: ['1', '2', 'B', '3']
 * ```
 */
export function transferArrayItem<T = any>(
	currentArray: T[],
	targetArray: T[],
	currentIndex: number,
	targetIndex: number
): void {
	if (!currentArray || !targetArray) {
		console.warn('[transferArrayItem] One or both arrays are undefined');
		return;
	}

	// Validate current index
	if (currentIndex < 0 || currentIndex >= currentArray.length) {
		console.warn(
			`[transferArrayItem] Invalid currentIndex=${currentIndex}, array length=${currentArray.length}`
		);
		return;
	}

	// Validate target index (can be equal to length for append)
	if (targetIndex < 0 || targetIndex > targetArray.length) {
		console.warn(
			`[transferArrayItem] Invalid targetIndex=${targetIndex}, array length=${targetArray.length}`
		);
		return;
	}

	// Remove item from source array
	const item = currentArray.splice(currentIndex, 1)[0];

	// Insert into target array
	targetArray.splice(targetIndex, 0, item);
}

/**
 * Copies an item from one array to another without removing it from the source.
 * This function mutates the target array in place but leaves the source array unchanged.
 *
 * @param currentArray - The array from which to copy the item
 * @param targetArray - The array to which the item should be copied
 * @param currentIndex - The index of the item in the current array (0-based)
 * @param targetIndex - The index at which to insert in the target array (0-based)
 *
 * @example
 * ```typescript
 * const source = ['A', 'B', 'C'];
 * const target = ['1', '2', '3'];
 * copyArrayItem(source, target, 1, 2);
 * // source: ['A', 'B', 'C'] (unchanged)
 * // target: ['1', '2', 'B', '3']
 * ```
 */
export function copyArrayItem<T = any>(
	currentArray: T[],
	targetArray: T[],
	currentIndex: number,
	targetIndex: number
): void {
	if (!currentArray || !targetArray) {
		console.warn('[copyArrayItem] One or both arrays are undefined');
		return;
	}

	// Validate current index
	if (currentIndex < 0 || currentIndex >= currentArray.length) {
		console.warn(
			`[copyArrayItem] Invalid currentIndex=${currentIndex}, array length=${currentArray.length}`
		);
		return;
	}

	// Validate target index (can be equal to length for append)
	if (targetIndex < 0 || targetIndex > targetArray.length) {
		console.warn(
			`[copyArrayItem] Invalid targetIndex=${targetIndex}, array length=${targetArray.length}`
		);
		return;
	}

	// Get item from source array (without removing)
	const item = currentArray[currentIndex];

	// Insert into target array
	targetArray.splice(targetIndex, 0, item);
}
