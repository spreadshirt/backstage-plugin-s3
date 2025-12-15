# @spreadshirt/backstage-plugin-s3-viewer

## 0.8.1

### Patch Changes

- bad991b: Bump package version to fix release

  The previous minor release was unpublished because it was broken
  and the version can't be reused, thus we bump the patch version
  of all packages.

- Updated dependencies [bad991b]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.6.1

## 0.8.0

### Minor Changes

- b804b73: Bump Backstage to 1.45.3

### Patch Changes

- Updated dependencies [b804b73]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.6.0

## 0.7.0

### Minor Changes

- c4f365c: Cleaned up bucket double clicking issues where it would reset selection to nil, see [#182](https://github.com/spreadshirt/backstage-plugin-s3/issues/182).

  Added a bucket visiblity icon to the table display which now implemented a clear bucket feature as double clicking now resets back to root directory of bucket selection.

- e7873a3: feat: add ability to show/hide bucket details at a server/cluster level default value of true

  ```yaml
  s3:
    showBucketDetails: false
  ```

### Patch Changes

- 5abb47e: Bump Backstage dependencies to latest version 1.44.2
- 43c2c66: Fix some security updates
- Updated dependencies [5abb47e]
- Updated dependencies [43c2c66]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.19

## 0.6.3

### Patch Changes

- bed8274: Bump Backstage dependencies to version 1.43.2
- Updated dependencies [bed8274]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.18

## 0.6.2

### Patch Changes

- a566a35: Bump Backstage to latest version `1.42.3`
- 865c417: Align some packages with upstream versions
- e5c4d9d: Fix security issues by bumping several dependencies (`jsonpath-plus`, `cipher-base`, `nimma`, `sha.js`)
- Updated dependencies [a566a35]
- Updated dependencies [e5c4d9d]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.17

## 0.6.1

### Patch Changes

- 4e5df8a: Bump `msw` package to major version 2.0.0
- 84a41aa: Bump Backstage to version `1.41.1`
- Updated dependencies [84a41aa]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.16

## 0.6.0

### Minor Changes

- 14bb739: Use a fake total object count to allow pagination to the last page

## 0.5.17

### Patch Changes

- 4333fa2: Don't unconditionally add "download" property to "Download" links

## 0.5.16

### Patch Changes

- d7123a3: Bump all dependencies to Backstage 1.40.1
- Updated dependencies [d7123a3]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.15

## 0.5.15

### Patch Changes

- 77b192a: Bump dependencies to Backstage 1.39.0
- Updated dependencies [77b192a]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.14

## 0.5.14

### Patch Changes

- b9cb0be: Remove usage of the React imports, which is not needed any longer
- 8d33528: Bump Backstage dependencies to version 1.38.1
- Updated dependencies [8d33528]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.13

## 0.5.13

### Patch Changes

- bdcc773: Bump backstage dependencies to version 1.37.0
- Updated dependencies [bdcc773]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.12

## 0.5.12

### Patch Changes

- 7618c00: Bump backstage dependencies to version 1.35.0
- Updated dependencies [7618c00]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.11

## 0.5.11

### Patch Changes

- 9cda47c: Bump backstage to version 1.33.5
- Updated dependencies [9cda47c]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.10

## 0.5.10

### Patch Changes

- 56350c5: Fix release process due to 'workspace' references not being resolved.
  To do that, the previous setup using the exact version in the `package.json`
  has been brought back.
- Updated dependencies [56350c5]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.9

## 0.5.9

### Patch Changes

- 7fc3ecc: Fix local dependencies for our plugins. This has been done by using the
  [following script](https://github.com/backstage/backstage/blob/master/scripts/verify-local-dependencies.js) available
  in the main Backstage repo.

  This is also the way the community-plugin workspaces work, so it's good to follow their setup too.

- c6b6505: Bump Backstage dependencies to version 1.32.2
- 5b89c04: Fix yarn add command in the documentation
- Updated dependencies [c6b6505]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.8

## 0.5.8

### Patch Changes

- cbcd1a3: Bump Backstage dependencies to version 1.31.1
- Updated dependencies [cbcd1a3]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.7

## 0.5.7

### Patch Changes

- aad8768: Bump Backstage dependencies to version 1.30.4
- Updated dependencies [aad8768]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.6

## 0.5.6

### Patch Changes

- b4e3d65: Bump backstage dependencies to version `1.29.2`
- Updated dependencies [b8e88a4]
- Updated dependencies [b4e3d65]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.5

## 0.5.5

### Patch Changes

- 2598ba2: Fix backstage package metadata
- Updated dependencies [2598ba2]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.4

## 0.5.4

### Patch Changes

- c8ca029: Bump Backstage dependencies to version 1.28.4
- Updated dependencies [c8ca029]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.3

## 0.5.3

### Patch Changes

- b23661d: Bump backstage dependencies to version 1.27.2
- Updated dependencies [b23661d]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.2

## 0.5.2

### Patch Changes

- 76eda39: Bump backstage dependencies to version 1.26.0
- 5676413: Align some `@testing-library/*` dependencies with upstream
- Updated dependencies [76eda39]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.1

## 0.5.1

### Patch Changes

- 8cab3c0: Bump backstage dependencies to version 1.25.0
- 3b2cf4d: Added new method to the s3-viewer API, which will be responsible of setting up
  the cookie required to download or preview data in the UI.
- Updated dependencies [8cab3c0]
- Updated dependencies [444ccef]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.0

## 0.5.0

### Minor Changes

- 58ccb15: Updated base API to the new backend plugin, which is `s3-viewer` instead of `s3`. No breaking changes expected.

### Patch Changes

- Updated dependencies [84db8bf]
- Updated dependencies [58ccb15]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.4.0

## 0.4.9

### Patch Changes

- 05dfc57: Bump backstage packages to version `1.23.1`
- Updated dependencies [05dfc57]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.3.9

## 0.4.8

### Patch Changes

- 5f98357: Bump backstage dependencies to version 1.22.1
- 0dd3aa4: Bumped react to version 18 and align testing package with upstream
- Updated dependencies [5f98357]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.3.8

## 0.4.7

### Patch Changes

- 133e6f1: Bump backstage dependencies to version 1.21.1
- Updated dependencies [133e6f1]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.3.7

## 0.4.6

### Patch Changes

- e0db1fd: Bump Backstage dependencies to version 1.21.2
- Updated dependencies [e0db1fd]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.3.6

## 0.4.5

### Patch Changes

- 2f463a3: Bump backstage dependencies to v1.19.2
- Updated dependencies [2f463a3]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.3.5

## 0.4.4

### Patch Changes

- a9414c1: Update backstage to 1.18.1
- Updated dependencies [a9414c1]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.3.4

## 0.4.3

### Patch Changes

- 086b5aa: Bump Backstage to version 1.17.4
- Updated dependencies [086b5aa]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.3.3

## 0.4.2

### Patch Changes

- 5d7ad9b: Bump dependencies to backstage 1.16.0
- d6a18e0: Security updates found by [dependabot](https://github.com/spreadshirt/backstage-plugin-s3/security/dependabot).
  Fixed some criticals for `loader-utils`, `@xmldom/xmldom` and high alerts for
  `yaml`, `webpack`, `knex`, `luxon`, `json5` or `minimatch`
- Updated dependencies [5d7ad9b]
- Updated dependencies [d6a18e0]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.3.2

## 0.4.1

### Patch Changes

- 1965d2c: Bump dependencies to Backstage 1.15.0
- 1965d2c: Remove deprecated `BackstageTheme` and unnecessary package import
- Updated dependencies [9a3fcf3]
- Updated dependencies [1965d2c]
- Updated dependencies [1965d2c]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.3.1

## 0.4.0

### Minor Changes

- e83665c: **BREAKING**: Migrated to AWS-SDK version 3. Now the platform config requires a new field called `region`. If not present, the plugin will fail on startup.

### Patch Changes

- 30f0a93: Fix small issue while paging keys and remove unused field in `ListBucketKeysResult`
- 466d55f: Bump backstage dependencies to version `1.14.1` & align some internal `aws-sdk` dependencies
- Updated dependencies [e83665c]
- Updated dependencies [30f0a93]
- Updated dependencies [466d55f]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.3.0

## 0.3.1

### Patch Changes

- 797eb6a: Bump Backstage packages to version `1.13.0`
- Updated dependencies [797eb6a]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.2.5

## 0.3.0

### Minor Changes

- c1f0403: Enable preview for more objects by falling back to file extension

## 0.2.4

### Patch Changes

- 97d5616: Upgrade dependencies to Backstage 1.12.1
- Updated dependencies [97d5616]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.2.4

## 0.2.3

### Patch Changes

- cf3bd09: Upgrade backstage dependencies to version 1.11.0
- 355e3e5: Update deprecated Button to LinkButton
- Updated dependencies [cf3bd09]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.2.3

## 0.2.2

### Patch Changes

- 860ef59: Upgrade backstage dependencies to version `1.10.1`
- Updated dependencies [860ef59]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.2.2

## 0.2.1

### Patch Changes

- 55629e3: Update dependencies to Backstage 1.9.1
- Updated dependencies [55629e3]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.2.1

## 0.2.0

### Minor Changes

- aa8f726: Prepare frontend plugin to use the identityApi. This will allow the backend determine if
  a user is allowed to fetch data for a certain bucket or not.

### Patch Changes

- Updated dependencies [caaac67]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.2.0

## 0.1.4

### Patch Changes

- 74fef18: Update dependencies to backstage 1.8.2
- 48da476: Added `Tooltip` to the `S3BucketTreePicker` elements & fix of missing key to list elements
- Updated dependencies [74fef18]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.1.4

## 0.1.3

### Patch Changes

- 91c40a8: Update dependencies to backstage 1.7.0
- Updated dependencies [91c40a8]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.1.3

## 0.1.2

### Patch Changes

- 58dcfce: Upgrade dependencies to backstage 1.6.0 & migrate to react-router v6 stable
- Updated dependencies [58dcfce]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.1.2

## 0.1.1

### Patch Changes

- 8deb36f: Initial plugin version
- Updated dependencies [8deb36f]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.1.1
