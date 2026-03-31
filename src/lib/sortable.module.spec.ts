import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Options } from 'sortablejs';
import { GLOBALS } from './globals';
import { SortableModule } from './sortable.module';

describe('SortableModule', () => {
	it('should create the module', () => {
		TestBed.configureTestingModule({
			imports: [SortableModule]
		});
		expect(SortableModule).toBeTruthy();
	});

	it('should provide global options via forRoot', () => {
		const globalOptions: Options = { animation: 200, ghostClass: 'custom-ghost' };

		TestBed.configureTestingModule({
			imports: [SortableModule.forRoot(globalOptions)]
		});

		const injectedOptions = TestBed.inject(GLOBALS);
		expect(injectedOptions).toEqual(globalOptions);
	});

	it('should export SortableDirective', () => {
		@Component({
			template: `<div [hubSortable]="items">
				@for (item of items; track item) {
					<div>{{ item }}</div>
				}
			</div>`,
			imports: [SortableModule]
		})
		class TestComponent {
			items = [1, 2, 3];
		}

		TestBed.configureTestingModule({
			imports: [SortableModule, TestComponent]
		});

		const fixture = TestBed.createComponent(TestComponent);
		expect(fixture.componentInstance).toBeTruthy();
	});
});
