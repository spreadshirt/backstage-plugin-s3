# @spreadshirt/backstage-plugin-s3-viewer-node

## 0.2.7

### Patch Changes

- cbcd1a3: Bump Backstage dependencies to version 1.31.1
- Updated dependencies [cbcd1a3]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.7

## 0.2.6

### Patch Changes

- aad8768: Bump Backstage dependencies to version 1.30.4
- Updated dependencies [aad8768]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.6

## 0.2.5

### Patch Changes

- b4e3d65: Bump backstage dependencies to version `1.29.2`
- Updated dependencies [b8e88a4]
- Updated dependencies [b4e3d65]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.5

## 0.2.4

### Patch Changes

- 2598ba2: Fix backstage package metadata
- Updated dependencies [2598ba2]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.4

## 0.2.3

### Patch Changes

- c8ca029: Bump Backstage dependencies to version 1.28.4
- Updated dependencies [c8ca029]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.3

## 0.2.2

### Patch Changes

- b23661d: Bump backstage dependencies to version 1.27.2
- Updated dependencies [b23661d]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.2

## 0.2.1

### Patch Changes

- 76eda39: Bump backstage dependencies to version 1.26.0
- Updated dependencies [76eda39]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.1

## 0.2.0

### Minor Changes

- 926d0c9: **BREAKING**: Remove the `middleware` from the s3-viewer.

  With the newly authentication backend system, the middleware is not needed any longer,
  so it can be completely removed instead of keeping it here. _NOTE_ that using this
  `s3-viewer` version will require you to be up-to-date with the latest Backstage version as well.

### Patch Changes

- 8cab3c0: Bump backstage dependencies to version 1.25.0
- Updated dependencies [8cab3c0]
- Updated dependencies [444ccef]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.0

## 0.1.0

### Minor Changes

- c947924: Initial release. This package contains several interfaces as well as the extension point needed for the new backend system

### Patch Changes

- 5bc27f0: Add `setPermissionMiddleware` method to the extension point interface.

  This method will allow users to override the default middleware when enabled.

- Updated dependencies [84db8bf]
- Updated dependencies [58ccb15]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.4.0
