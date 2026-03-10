import { Options } from 'sortablejs';

/**
 * List of SortableJS option keys that can be bound individually via directive inputs.
 */
export const INDIVIDUAL_OPTION_INPUTS: ReadonlyArray<keyof Options> = [
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
