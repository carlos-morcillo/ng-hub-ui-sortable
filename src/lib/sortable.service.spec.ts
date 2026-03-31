import { TestBed } from '@angular/core/testing';
import { SortableService } from './sortable.service';

describe('SortableService', () => {
	let service: SortableService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(SortableService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should have transfer initially null', () => {
		expect(service.transfer).toBeNull();
	});

	it('should have dropEventProcessed initially false', () => {
		expect(service.dropEventProcessed).toBe(false);
	});

	it('should allow setting and invoking transfer callback', () => {
		const items: any[] = [];
		service.transfer = (receivedItems: any[]) => {
			items.push(...receivedItems);
		};

		service.transfer!(['A', 'B']);
		expect(items).toEqual(['A', 'B']);
	});

	it('should allow clearing transfer callback', () => {
		service.transfer = () => {};
		service.transfer = null;
		expect(service.transfer).toBeNull();
	});

	it('should allow setting dropEventProcessed flag', () => {
		service.dropEventProcessed = true;
		expect(service.dropEventProcessed).toBe(true);

		service.dropEventProcessed = false;
		expect(service.dropEventProcessed).toBe(false);
	});

	it('should be a singleton (providedIn root)', () => {
		const service2 = TestBed.inject(SortableService);
		expect(service).toBe(service2);
	});
});
