# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [21.1.0] - 2026-02-09

### Added

- **Manual Control Mode**: New `autoUpdateArray` input (default: `true`) allows full control over array updates, similar to Angular CDK's drag-and-drop approach
    - When set to `false`, the directive only emits events without automatically updating arrays
    - Developers have complete control over when and how to update their data model
    - Enables validation, API calls, undo/redo, and immutable data patterns
- **Array Helper Functions**: Exported utility functions for manual array manipulation
    - `moveItemInArray(array, fromIndex, toIndex)` - Move item within same array
    - `transferArrayItem(source, target, sourceIndex, targetIndex)` - Transfer item between arrays
    - `copyArrayItem(source, target, sourceIndex, targetIndex)` - Copy item without removing from source
- **Events Documentation**: Comprehensive guide (`docs/EVENTS.md`) explaining:
    - Event firing order for different drag scenarios
    - Why multiple events fire for single operations
    - Best practices for event handling in manual mode
    - Common pitfalls and solutions
- **Manual Control Example**: New example component (`/manual-control` route) demonstrating:
    - Single list reordering with manual control
    - Kanban-style multi-list drag-and-drop
    - Event debouncing to prevent duplicate processing
    - Operations logging for demonstration

### Changed

- Enhanced JSDoc documentation in `sortable.directive.ts`:
    - Added detailed explanation of event firing order for different scenarios
    - Documented when each event fires (choose, start, move, update, sort, change, end)
    - Explained differences between same-list and cross-list drag operations
    - Clarified behavior in clone mode
- Updated README with extensive manual control mode documentation:
    - When to use manual control mode (validation, API integration, etc.)
    - Complete code examples for single and multiple lists
    - Comparison table: Automatic vs Manual mode
    - Link to comprehensive events guide

### Fixed

- None

## [21.0.1] - Previous releases

See git history for earlier changes.
