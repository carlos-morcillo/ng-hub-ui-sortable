import {ModuleWithProviders, NgModule} from '@angular/core';
import {GLOBALS} from './globals';
import {SortableDirective} from './sortable.directive';
import {Options} from 'sortablejs';

@NgModule({
    imports: [SortableDirective],
    exports: [SortableDirective],
})
export class SortableModule {

  public static forRoot(globalOptions: Options): ModuleWithProviders<SortableModule> {
    return {
      ngModule: SortableModule,
      providers: [
        {provide: GLOBALS, useValue: globalOptions},
      ],
    };
  }

}
