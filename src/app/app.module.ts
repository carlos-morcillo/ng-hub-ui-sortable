import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { SortableModule } from "ng-hub-ui-sortable";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { AppComponent } from "./app.component";
import { ExamplesModule } from "./examples/examples.module";
import { LayoutBuilderComponent } from "./examples/layout-builder/layout-builder.component";
import { MultipleListsComponent } from "./examples/multiple-lists/multiple-lists.component";
import { SimpleSortableComponent } from "./examples/simple-sortable/simple-sortable.component";
import { SortableFormArrayComponent } from "./examples/sortable-form-array/sortable-form-array.component";
import { SortableWithOptionsComponent } from "./examples/sortable-with-options/sortable-with-options.component";
import { LandingComponent } from "./landing/landing.component";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      [
        { path: "", pathMatch: "full", component: LandingComponent },
        {
          path: "sortable-array",
          component: SimpleSortableComponent,
        },
        {
          path: "sortable-form-array",
          component: SortableFormArrayComponent,
        },
        {
          path: "custom-options",
          component: SortableWithOptionsComponent,
        },
        {
          path: "multiple-lists",
          component: MultipleListsComponent,
        },
        {
          path: "layout-builder",
          component: LayoutBuilderComponent,
        },
        {
          path: "sortable-signal",
          loadComponent: () =>
            import("./examples/sortable-signal/sortable-signal.component").then(
              (component) => component.SortableSignalComponent
            ),
        },
      ],
      {
        anchorScrolling: "enabled",
        scrollPositionRestoration: "enabled",
        scrollOffset: [0, 72],
      }
    ),

    // global settings
    SortableModule.forRoot({
      animation: 256,
    }),
    LandingComponent,
    BsDropdownModule,
    ExamplesModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
