import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { Options } from 'sortablejs';
import { GLOBALS } from './globals';

/**
 * Registers global SortableJS options shared by every `hubSortable` directive in the
 * application. This is the standalone replacement for `SortableModule.forRoot()`.
 *
 * Add it to the `providers` array of `bootstrapApplication` (or any route/component
 * injector) to provide a default configuration that each directive instance merges
 * with its own inputs.
 *
 * @param globalOptions - Default SortableJS options merged into every directive instance.
 * @returns Environment providers exposing the global sortable configuration.
 *
 * @example
 * ```typescript
 * import { provideSortable } from 'ng-hub-ui-sortable';
 *
 * bootstrapApplication(AppComponent, {
 * 	providers: [provideSortable({ animation: 150, ghostClass: 'sortable-ghost' })]
 * });
 * ```
 */
export function provideSortable(globalOptions: Options = {}): EnvironmentProviders {
	return makeEnvironmentProviders([{ provide: GLOBALS, useValue: globalOptions }]);
}
