import { ModuleWithProviders, NgModule } from '@angular/core';
import { Options } from 'sortablejs';
import { GLOBALS } from './globals';
import { SortableDirective } from './sortable.directive';

/**
 * NgModule that re-exports the standalone {@link SortableDirective}.
 *
 * @deprecated Prefer importing the standalone `SortableDirective` directly and, when you
 * need global options, use {@link provideSortable} instead of this module. The module is
 * kept only for backwards compatibility with NgModule-based applications.
 */
@NgModule({
	imports: [SortableDirective],
	exports: [SortableDirective]
})
export class SortableModule {
	/**
	 * Provides global SortableJS options for every `hubSortable` directive.
	 *
	 * @deprecated Use the standalone `provideSortable(globalOptions)` provider function
	 * instead. It works with `bootstrapApplication` and any standalone injector.
	 *
	 * @param globalOptions - Default SortableJS options shared by all directive instances.
	 * @returns Module with the global configuration provider.
	 */
	public static forRoot(globalOptions: Options): ModuleWithProviders<SortableModule> {
		return {
			ngModule: SortableModule,
			providers: [{ provide: GLOBALS, useValue: globalOptions }]
		};
	}
}
