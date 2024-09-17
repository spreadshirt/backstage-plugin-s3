/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { createLegacyAuthAdapters } from '@backstage/backend-common';
import { HostDiscovery } from '@backstage/backend-defaults/discovery';
import { Config } from '@backstage/config';
import express from 'express';
import {
  AuthService,
  DiscoveryService,
  HttpAuthService,
  LoggerService,
  PermissionsService,
  RootConfigService,
  SchedulerService,
} from '@backstage/backend-plugin-api';
import { S3Builder } from './S3Builder';
import { PermissionPolicy } from '@backstage/plugin-permission-node';
import { createRouter as createPermissionPlugin } from '@backstage/plugin-permission-backend';
import {
  AuthorizeResult,
  PolicyDecision,
} from '@backstage/plugin-permission-common';

/**
 * @deprecated Use the new backend system instead: https://github.com/spreadshirt/backstage-plugin-s3/tree/main/plugins/s3-viewer-backend#new-backend-system
 * @public
 */
export interface RouterOptions {
  logger: LoggerService;
  config: RootConfigService;
  scheduler: SchedulerService;
  permissions: PermissionsService;
  discovery: DiscoveryService;
  auth?: AuthService;
  httpAuth?: HttpAuthService;
}

/**
 * @deprecated Use the new backend system instead: https://github.com/spreadshirt/backstage-plugin-s3/tree/main/plugins/s3-viewer-backend#new-backend-system
 * @public
 */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { auth, httpAuth } = createLegacyAuthAdapters(options);

  const { router } = await S3Builder.createBuilder({
    ...options,
    auth,
    httpAuth,
  }).build();

  return router;
}

class TestPermissionPolicy implements PermissionPolicy {
  async handle(): Promise<PolicyDecision> {
    return { result: AuthorizeResult.ALLOW };
  }
}

export interface RouterPermissionOptions {
  logger: LoggerService;
  config: Config;
}

export async function createPluginPermissions({
  logger,
  config,
}: RouterPermissionOptions): Promise<express.Router> {
  const discovery = HostDiscovery.fromConfig(config);
  const policy = new TestPermissionPolicy();
  return await createPermissionPlugin({ config, logger, discovery, policy });
}
