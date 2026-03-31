import { SortableBindings } from './sortable-bindings';

describe('SortableBindings', () => {
	describe('provided', () => {
		it('should return true when bindings exist', () => {
			const bindings = new SortableBindings([['A', 'B']]);
			expect(bindings.provided).toBe(true);
		});

		it('should return false when no bindings exist', () => {
			const bindings = new SortableBindings([]);
			expect(bindings.provided).toBe(false);
		});
	});

	describe('with single array', () => {
		let arr: string[];
		let bindings: SortableBindings;

		beforeEach(() => {
			arr = ['A', 'B', 'C'];
			bindings = new SortableBindings([arr]);
		});

		it('should inject into the array', () => {
			bindings.injectIntoEvery(1, ['X']);
			expect(arr).toEqual(['A', 'X', 'B', 'C']);
		});

		it('should get from the array', () => {
			const result = bindings.getFromEvery(1);
			expect(result).toEqual(['B']);
		});

		it('should extract from the array', () => {
			const result = bindings.extractFromEvery(1);
			expect(result).toEqual(['B']);
			expect(arr).toEqual(['A', 'C']);
		});
	});

	describe('with multiple parallel arrays', () => {
		let names: string[];
		let ages: number[];
		let bindings: SortableBindings;

		beforeEach(() => {
			names = ['Alice', 'Bob', 'Charlie'];
			ages = [25, 30, 35];
			bindings = new SortableBindings([names, ages]);
		});

		it('should inject into all arrays at the same index', () => {
			bindings.injectIntoEvery(1, ['Diana', 28]);
			expect(names).toEqual(['Alice', 'Diana', 'Bob', 'Charlie']);
			expect(ages).toEqual([25, 28, 30, 35]);
		});

		it('should get from all arrays at the same index', () => {
			const result = bindings.getFromEvery(0);
			expect(result).toEqual(['Alice', 25]);
		});

		it('should extract from all arrays at the same index', () => {
			const result = bindings.extractFromEvery(1);
			expect(result).toEqual(['Bob', 30]);
			expect(names).toEqual(['Alice', 'Charlie']);
			expect(ages).toEqual([25, 35]);
		});

		it('should handle inject at end', () => {
			bindings.injectIntoEvery(3, ['Eve', 22]);
			expect(names).toEqual(['Alice', 'Bob', 'Charlie', 'Eve']);
			expect(ages).toEqual([25, 30, 35, 22]);
		});

		it('should handle inject at start', () => {
			bindings.injectIntoEvery(0, ['Eve', 22]);
			expect(names).toEqual(['Eve', 'Alice', 'Bob', 'Charlie']);
			expect(ages).toEqual([22, 25, 30, 35]);
		});
	});

	describe('combined operations (simulating drag-and-drop)', () => {
		it('should support extract then inject (reorder)', () => {
			const arr = ['A', 'B', 'C', 'D'];
			const bindings = new SortableBindings([arr]);

			const extracted = bindings.extractFromEvery(0);
			bindings.injectIntoEvery(2, extracted);
			expect(arr).toEqual(['B', 'C', 'A', 'D']);
		});
	});
});
