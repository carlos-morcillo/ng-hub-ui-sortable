---
description: How to publish a library to NPM following the project's standard release process
---

This workflow guides you through the process of releasing and publishing a new version of an `ng-hub-ui` library.

## 1. Analysis & Preparation

1.  **Identify Library**: Confirm which library is being published (e.g., `accordion`, `breadcrumbs`).
2.  **Analyze Changes**:
    - Check git logs since the last release: `git log --oneline -- projects/[library-name]/`
    - checks tags: `git tag --list "*[library-name]*"`
    - Determine semantic version bump (MAJOR, MINOR, PATCH).
    - **MAJOR**: Breaking changes.
    - **MINOR**: New features (backwards compatible).
    - **PATCH**: Bug fixes.

## 2. Documentation Updates

**CRITICAL**: Before touching version numbers, update documentation.

1.  **README.md (English)**:
    - Update "Features" if new functionality was added.
    - Update "API Reference" for new Inputs/Outputs.
    - Update "Usage" examples.
    - Check "Installation" instructions.
2.  **README.es.md (Spanish)**:
    - Synchronize all changes from English README.
    - Translate descriptive text only (keep code/API English).
3.  **Changelog**:
    - **IMPORTANT**: If `projects/[library-name]/CHANGELOG.md` does not exist, CREATE IT.
    - Add a new section at the top of the changelog.
    - Format: `## [Version] - YYYY-MM-DD`
    - Categories: `### Added`, `### Changed`, `### Fixed`, `### Removed`.
    - **Content**: Summarize all changes since the last release, categorized appropriately. Be specific and use English.

## 3. Version Update

1.  **Update package.json**:
    - File: `projects/[library-name]/package.json`.
    - Bump the `version` field.
    - Verify `peerDependencies` are correct and up-to-date.

## 4. User Confirmation

**STOP and ask the user** for approval before proceeding. Present:

- **Proposed Version**: (e.g., 1.2.3 -> 1.3.0).
- **Reasoning**: (e.g., "Added new feature X").
- **Changelog Entry**: Show the exact text.
- **Commit Message**: Show the proposed message.

## 5. Build & Verify

Once approved:

1.  **Build Dependencies**: `ng build utils` (if required).
2.  **Build Library**: `ng build [library-name] --configuration production`.
3.  **Verify**: Check build output for errors or warnings.

## 6. Commit & Tag

1.  **Git Add**: Stage `package.json`, `README.md`, `README.es.md`, `CHANGELOG.md`.
2.  **Git Commit**:

    ```bash
    git commit -m "release([library-name]): version X.Y.Z

    - Summary of changes
    - Details..."
    ```

3.  **Git Tag**:
    ```bash
    git tag -a [library-name]-vX.Y.Z -m "Release [library-name] version X.Y.Z"
    ```

## 7. Publish instructions

Inform the user that the release is committed and tagged. Provide the commands to publish:

1.  `cd dist/[library-name]`
2.  `npm publish`
3.  `git push --tags`
