# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [22.1.1] - 2026-07-28

### Added

- **Documented the pointer-only accessibility limitation.** SortableJS drag-and-drop has no keyboard or screen-reader path; the READMEs now state it explicitly and recommend pairing the directive with an alternative affordance (e.g. move up/down buttons operating on the same array) where reordering is essential. An `aria-live` announcer story is tracked as future work.

## [22.1.0] - 2026-06-29

### Added

- `provideSortable()` standalone provider function to register global SortableJS options without `SortableModule`.
- Public type exports for the directive payloads (`SortableData`, `SortableEventName`, `SortableMoveEventPayload`).
- `tsconfig.lib.prod.json` for optimized production builds.

### Changed

- Aligned package scaffolding with the rest of the ng-hub-ui ecosystem: removed legacy fork files (`tslint.json`, `angular.json`, `yarn.lock`, project-level lockfile, `browserslist`, app/server tsconfigs, `.htaccess`), added the `tslib` dependency, `sideEffects: false`, `declarationMap` and a normalized `repository` URL.
- Reworked the showcase documentation and example components to follow the shared library documentation standards.

### Deprecated

- `SortableModule` and `SortableModule.forRoot()`. Import the standalone `SortableDirective` directly and use `provideSortable()` for global options instead.

## [22.0.0] - 2026-06-17

### Changed

- Rebranded the package and standardized its metadata and README to match the ng-hub-ui family.

## [21.3.0] - 2026-03-31

### Added

- Enhanced sortable directive with improved binding support for signals and FormArrays.
- Comprehensive test coverage for the sortable directive.

## [21.0.0] - 2025-12-12

### Added

- Writable signal support in sortable bindings alongside arrays and FormArrays.
- Hardened signal/FormArray detection to avoid TypeScript errors in bindings.

## [20.0.0] - 2025-12-10

### Added

- Preview groundwork for Angular 20 compatibility.

## [19.0.0] - 2025-04-08

### Changed

- Upgraded to Angular 19.

## [18.0.0] - 2024-08-16

### Changed

- Upgraded to Angular 18.

## [17.0.0] - 2024-03-15

### Changed

- Upgraded to Angular 17.

## [16.0.0] - 2023-08-22

### Changed

- Upgraded to Angular 16.

---

### Earlier history

Versions prior to 16.0.0 belong to the upstream projects this library was forked from
([`@worktile/ngx-sortablejs`](https://github.com/worktile/ngx-sortablejs) and, before that,
[`SortableJS/ngx-sortablejs`](https://github.com/SortableJS/ngx-sortablejs)). Their changelogs
remain available in those repositories.
