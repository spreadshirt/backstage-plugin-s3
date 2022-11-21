---
'@spreadshirt/backstage-plugin-s3-viewer-backend': minor
---

**BREAKING**: The s3-viewer-backend `createRouter` now requires that the `identityApi` and `permissionEvaluator` is passed to the router.

  These changes are **required** to `packages/backend/src/plugins/s3.ts`

  This change makes the requests to the s3 endpoint to be sent by a logged in user.

  ```diff
  import { S3Builder } from '@spreadshirt/backstage-plugin-s3-viewer-backend';
  import { Router } from 'express';
  import { PluginEnvironment } from '../types';

  export default async function createPlugin(
    env: PluginEnvironment,
  ): Promise<Router> {
    const { router } = S3Builder.createBuilder({
      config: env.config,
      logger: env.logger,
      scheduler: env.scheduler,
      discovery: env.discovery,
+     identity: env.identity,
+     permissions: env.permissions,
      }).build();
      return router;
  }