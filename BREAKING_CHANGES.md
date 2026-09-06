# Breaking Changes

This file documents breaking changes and migration steps for `ng-hub-ui-sortable`.

**Read it, because the version number cannot warn you.** The major version of this package tracks
the Angular major it targets — `22.x` means "for Angular 22" — so a breaking change can never raise
the major and the highest it can ever go is a minor. SemVer is doing a different job here, and this
file is the only notice you get.

Coming from `ngx-sortablejs` or `@worktile/ngx-sortablejs` is a different question: that is a change
of package, not of version, and it has its own document — [`MIGRATION.md`](./MIGRATION.md).

## [22.1.4]

No API change. One behaviour a consumer may have been leaning on is gone.

**The library no longer writes to your console.** Eight guard rails used to report invalid input
with `console.warn` or `console.error`: the out-of-range check in `moveItemInArray`, three in
`transferArrayItem`, three in `copyArrayItem`, and the directive's `container` lookup. Each guard
behaves exactly as before — the call is a no-op and your arrays are untouched — but it is now
silent.

What to do: nothing, unless you were reading those messages. If you were, the one that mattered is
the `container` lookup. A `container` selector matching nothing leaves the directive inert: no
SortableJS instance, no `(init)`, no dragging. Audit your `container` selectors once
(see [`MIGRATION.md`](./MIGRATION.md), section 5.6) rather than waiting for a message that no longer
comes.

## [22.1.0]

No breaking changes. `provideSortable()` and the payload type exports are additive.

`SortableModule` and `SortableModule.forRoot()` are **deprecated**, not removed. They keep working.
Replace them at your own pace:

```typescript
// Before
@NgModule({ imports: [SortableModule.forRoot({ animation: 150 })] })

// After
bootstrapApplication(AppComponent, {
	providers: [provideSortable({ animation: 150 })]
});
```

## [21.2.0]

No API change, one packaging change.

**`sortablejs` moved from `peerDependencies` to `dependencies`.** It now installs with this package.
If your own manifest lists `sortablejs`, remove it: two entries pinned separately drift apart, and
the copy this package resolves is the one that runs.

## [21.1.1]

No API change. Two behaviours changed for anyone using manual mode
(`[autoUpdateArray]="false"`).

- **`update` and `add` now emit once per drop.** SortableJS calls its own handlers more than once
  when the DOM is rearranged inside them, and those extra emissions used to reach your code. If you
  had built your own de-duplication — a debounce, an "already handled" flag — it is now dead weight
  and may swallow a legitimate second drag.
- **The directive reverts SortableJS's DOM move before your handler's array update renders.** The
  element you see after a drop is the one Angular rendered from your array, not the one SortableJS
  left behind. Code that read the DOM position after a drop instead of the event indexes will now
  read the pre-drag order.

Native SortableJS CustomEvents are also suppressed at the container from this version on, so a
template listener no longer fires twice for one drop — once for the native event and once for the
directive output.

## [20.0.0]

First version published under the name `ng-hub-ui-sortable`; the numbering continues the fork it
came from. Everything the registry serves under this package name starts here.

The directive selector is `[hubSortable]`, not the one the upstream package used. That is the whole
of the API break, and [`MIGRATION.md`](./MIGRATION.md) covers it member by member, along with the
behaviour differences that compile cleanly and only fail at runtime.

## Earlier versions

`19.0.0`, `18.0.0`, `17.0.0` and `16.0.0` were released under the upstream package name and are
recorded here only so the history reads continuously. Their breaking changes are Angular's, not this
library's.
