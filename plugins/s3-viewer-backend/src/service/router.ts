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

import {
  // TODO: Remove this function as soon as all plugins support new LoggerService
  loggerToWinstonLogger,
  ServerTokenManager,
  SingleHostDiscovery,
} from '@backstage/backend-common';
import { PluginTaskScheduler } from '@backstage/backend-tasks';
import { Config } from '@backstage/config';
import express from 'express';
import {
  DiscoveryService,
  LoggerService,
  TokenManagerService,
} from '@backstage/backend-plugin-api';
import { S3Builder } from './S3Builder';
import {
  DefaultIdentityClient,
  IdentityApi,
} from '@backstage/plugin-auth-node';
import {
  PermissionPolicy,
  ServerPermissionClient,
} from '@backstage/plugin-permission-node';
import { createRouter as createPermissionPlugin } from '@backstage/plugin-permission-backend';
import {
  AuthorizeResult,
  PolicyDecision,
} from '@backstage/plugin-permission-common';

export interface RouterOptions {
  logger: LoggerService;
  config: Config;
  scheduler: PluginTaskScheduler;
}

export async function createRouter({
  logger,
  config,
  scheduler,
}: RouterOptions): Promise<express.Router> {
  const discovery = SingleHostDiscovery.fromConfig(config);
  const identity = DefaultIdentityClient.create({
    discovery,
    issuer: await discovery.getExternalBaseUrl('auth'),
  });
  const tokenManager = ServerTokenManager.fromConfig(config, {
    logger,
  });
  const permissions = ServerPermissionClient.fromConfig(config, {
    discovery,
    tokenManager,
  });

  const { router } = await S3Builder.createBuilder({
    config,
    logger,
    scheduler,
    discovery,
    identity,
    permissions,
    tokenManager,
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
  discovery: DiscoveryService;
  tokenManager: TokenManagerService;
  identity: IdentityApi;
}

export async function createPluginPermissions({
  logger,
  config,
}: RouterOptions): Promise<express.Router> {
  const discovery = SingleHostDiscovery.fromConfig(config);
  const identity = DefaultIdentityClient.create({
    discovery,
    issuer: await discovery.getExternalBaseUrl('auth'),
  });

  return await createPermissionPlugin({
    config: config,
    logger: loggerToWinstonLogger(logger),
    discovery: discovery,
    policy: new TestPermissionPolicy(),
    identity: identity,
  });
}
