import { copyArrayItem, moveItemInArray, transferArrayItem } from './array-helpers';

describe('array-helpers', () => {
    describe('moveItemInArray', () => {
        it('should move an item forward in the array', () => {
            const arr = ['A', 'B', 'C', 'D'];
            moveItemInArray(arr, 1, 3);
            expect(arr).toEqual(['A', 'C', 'D', 'B']);
        });

        it('should move an item backward in the array', () => {
            const arr = ['A', 'B', 'C', 'D'];
            moveItemInArray(arr, 3, 0);
            expect(arr).toEqual(['D', 'A', 'B', 'C']);
        });

        it('should handle moving to the same position (no-op)', () => {
            const arr = ['A', 'B', 'C'];
            moveItemInArray(arr, 1, 1);
            expect(arr).toEqual(['A', 'B', 'C']);
        });

        it('should handle moving to adjacent positions', () => {
            const arr = ['A', 'B', 'C'];
            moveItemInArray(arr, 0, 1);
            expect(arr).toEqual(['B', 'A', 'C']);
        });

        it('should handle single-element array (same index)', () => {
            const arr = ['A'];
            moveItemInArray(arr, 0, 0);
            expect(arr).toEqual(['A']);
        });

        it('should not modify empty arrays', () => {
            const arr: string[] = [];
            moveItemInArray(arr, 0, 0);
            expect(arr).toEqual([]);
        });

        it('should not modify null/undefined arrays', () => {
            moveItemInArray(null as any, 0, 1);
            moveItemInArray(undefined as any, 0, 1);
            // No error thrown
        });

        it('should warn and return on invalid fromIndex (negative)', () => {
            vi.spyOn(console, 'warn').mockReturnValue(undefined);
            const arr = ['A', 'B', 'C'];
            moveItemInArray(arr, -1, 1);
            expect(arr).toEqual(['A', 'B', 'C']);
            expect(console.warn).toHaveBeenCalled();
        });

        it('should warn and return on invalid fromIndex (out of bounds)', () => {
            vi.spyOn(console, 'warn').mockReturnValue(undefined);
            const arr = ['A', 'B', 'C'];
            moveItemInArray(arr, 5, 1);
            expect(arr).toEqual(['A', 'B', 'C']);
            expect(console.warn).toHaveBeenCalled();
        });

        it('should warn and return on invalid toIndex (negative)', () => {
            vi.spyOn(console, 'warn').mockReturnValue(undefined);
            const arr = ['A', 'B', 'C'];
            moveItemInArray(arr, 0, -1);
            expect(arr).toEqual(['A', 'B', 'C']);
            expect(console.warn).toHaveBeenCalled();
        });

        it('should warn and return on invalid toIndex (out of bounds)', () => {
            vi.spyOn(console, 'warn').mockReturnValue(undefined);
            const arr = ['A', 'B', 'C'];
            moveItemInArray(arr, 0, 5);
            expect(arr).toEqual(['A', 'B', 'C']);
            expect(console.warn).toHaveBeenCalled();
        });

        it('should mutate the original array', () => {
            const arr = ['A', 'B', 'C'];
            const ref = arr;
            moveItemInArray(arr, 0, 2);
            expect(ref).toBe(arr);
            expect(ref).toEqual(['B', 'C', 'A']);
        });
    });

    describe('transferArrayItem', () => {
        it('should transfer an item from source to target', () => {
            const source = ['A', 'B', 'C'];
            const target = ['1', '2', '3'];
            transferArrayItem(source, target, 1, 2);
            expect(source).toEqual(['A', 'C']);
            expect(target).toEqual(['1', '2', 'B', '3']);
        });

        it('should transfer from start of source to start of target', () => {
            const source = ['A', 'B'];
            const target = ['1', '2'];
            transferArrayItem(source, target, 0, 0);
            expect(source).toEqual(['B']);
            expect(target).toEqual(['A', '1', '2']);
        });

        it('should transfer to the end of target', () => {
            const source = ['A', 'B'];
            const target = ['1', '2'];
            transferArrayItem(source, target, 0, 2);
            expect(source).toEqual(['B']);
            expect(target).toEqual(['1', '2', 'A']);
        });

        it('should transfer to an empty target', () => {
            const source = ['A', 'B'];
            const target: string[] = [];
            transferArrayItem(source, target, 0, 0);
            expect(source).toEqual(['B']);
            expect(target).toEqual(['A']);
        });

        it('should warn and return on null/undefined arrays', () => {
            vi.spyOn(console, 'warn').mockReturnValue(undefined);
            transferArrayItem(null as any, ['1'], 0, 0);
            expect(console.warn).toHaveBeenCalled();
        });

        it('should warn and return when target is null', () => {
            vi.spyOn(console, 'warn').mockReturnValue(undefined);
            transferArrayItem(['A'], null as any, 0, 0);
            expect(console.warn).toHaveBeenCalled();
        });

        it('should warn on invalid currentIndex (negative)', () => {
            vi.spyOn(console, 'warn').mockReturnValue(undefined);
            const source = ['A'];
            const target = ['1'];
            transferArrayItem(source, target, -1, 0);
            expect(source).toEqual(['A']);
            expect(console.warn).toHaveBeenCalled();
        });

        it('should warn on invalid currentIndex (out of bounds)', () => {
            vi.spyOn(console, 'warn').mockReturnValue(undefined);
            const source = ['A'];
            const target = ['1'];
            transferArrayItem(source, target, 5, 0);
            expect(source).toEqual(['A']);
            expect(console.warn).toHaveBeenCalled();
        });

        it('should warn on invalid targetIndex (negative)', () => {
            vi.spyOn(console, 'warn').mockReturnValue(undefined);
            const source = ['A', 'B'];
            const target = ['1'];
            transferArrayItem(source, target, 0, -1);
            expect(source).toEqual(['A', 'B']);
            expect(console.warn).toHaveBeenCalled();
        });

        it('should warn on invalid targetIndex (out of bounds)', () => {
            vi.spyOn(console, 'warn').mockReturnValue(undefined);
            const source = ['A', 'B'];
            const target = ['1'];
            transferArrayItem(source, target, 0, 5);
            expect(source).toEqual(['A', 'B']);
            expect(console.warn).toHaveBeenCalled();
        });

        it('should mutate both arrays in place', () => {
            const source = ['A', 'B'];
            const target = ['1', '2'];
            const sourceRef = source;
            const targetRef = target;
            transferArrayItem(source, target, 0, 1);
            expect(sourceRef).toBe(source);
            expect(targetRef).toBe(target);
        });
    });

    describe('copyArrayItem', () => {
        it('should copy an item from source to target without removing from source', () => {
            const source = ['A', 'B', 'C'];
            const target = ['1', '2', '3'];
            copyArrayItem(source, target, 1, 2);
            expect(source).toEqual(['A', 'B', 'C']);
            expect(target).toEqual(['1', '2', 'B', '3']);
        });

        it('should copy to the beginning of target', () => {
            const source = ['A', 'B'];
            const target = ['1', '2'];
            copyArrayItem(source, target, 1, 0);
            expect(source).toEqual(['A', 'B']);
            expect(target).toEqual(['B', '1', '2']);
        });

        it('should copy to the end of target', () => {
            const source = ['A'];
            const target = ['1', '2'];
            copyArrayItem(source, target, 0, 2);
            expect(source).toEqual(['A']);
            expect(target).toEqual(['1', '2', 'A']);
        });

        it('should copy to an empty target', () => {
            const source = ['A'];
            const target: string[] = [];
            copyArrayItem(source, target, 0, 0);
            expect(source).toEqual(['A']);
            expect(target).toEqual(['A']);
        });

        it('should warn and return on null/undefined source', () => {
            vi.spyOn(console, 'warn').mockReturnValue(undefined);
            copyArrayItem(null as any, ['1'], 0, 0);
            expect(console.warn).toHaveBeenCalled();
        });

        it('should warn and return on null/undefined target', () => {
            vi.spyOn(console, 'warn').mockReturnValue(undefined);
            copyArrayItem(['A'], null as any, 0, 0);
            expect(console.warn).toHaveBeenCalled();
        });

        it('should warn on invalid currentIndex', () => {
            vi.spyOn(console, 'warn').mockReturnValue(undefined);
            const source = ['A'];
            const target = ['1'];
            copyArrayItem(source, target, -1, 0);
            expect(target).toEqual(['1']);
            expect(console.warn).toHaveBeenCalled();
        });

        it('should warn on currentIndex out of bounds', () => {
            vi.spyOn(console, 'warn').mockReturnValue(undefined);
            const source = ['A'];
            const target = ['1'];
            copyArrayItem(source, target, 5, 0);
            expect(target).toEqual(['1']);
            expect(console.warn).toHaveBeenCalled();
        });

        it('should warn on invalid targetIndex (negative)', () => {
            vi.spyOn(console, 'warn').mockReturnValue(undefined);
            const source = ['A'];
            const target = ['1'];
            copyArrayItem(source, target, 0, -1);
            expect(target).toEqual(['1']);
            expect(console.warn).toHaveBeenCalled();
        });

        it('should warn on targetIndex out of bounds', () => {
            vi.spyOn(console, 'warn').mockReturnValue(undefined);
            const source = ['A'];
            const target = ['1'];
            copyArrayItem(source, target, 0, 5);
            expect(target).toEqual(['1']);
            expect(console.warn).toHaveBeenCalled();
        });

        it('should not mutate the source array', () => {
            const source = ['A', 'B', 'C'];
            const originalSource = [...source];
            const target = ['1'];
            copyArrayItem(source, target, 1, 0);
            expect(source).toEqual(originalSource);
        });

        it('should copy object references (shallow copy)', () => {
            const obj = { name: 'test' };
            const source = [obj];
            const target: any[] = [];
            copyArrayItem(source, target, 0, 0);
            expect(target[0]).toBe(obj);
        });
    });
});
