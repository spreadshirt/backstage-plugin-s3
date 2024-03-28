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
  DatabaseManager,
  getVoidLogger,
  HostDiscovery,
  PluginDatabaseManager,
  ServerTokenManager,
} from '@backstage/backend-common';
import { TaskScheduler } from '@backstage/backend-tasks';
import { ConfigReader } from '@backstage/config';
import express from 'express';
import request from 'supertest';
import { Knex } from 'knex';
import { mockServices } from '@backstage/backend-test-utils';
import { ServerPermissionClient } from '@backstage/plugin-permission-node';

import { createRouter } from './router';

describe('createRouter', () => {
  let app: express.Express;
  const logger = getVoidLogger();

  beforeAll(async () => {
    const pluginDatabase: PluginDatabaseManager = {
      getClient: () => {
        return Promise.resolve({
          migrate: {
            latest: () => {},
          },
        }) as unknown as Promise<Knex>;
      },
    };
    const databaseManager: Partial<DatabaseManager> = {
      forPlugin: () => pluginDatabase,
    };
    const manager = databaseManager as DatabaseManager;

    const config = new ConfigReader({
      app: {
        title: 'backstage example app',
        baseUrl: 'http://localhost:3000',
      },
      backend: {
        baseUrl: 'http://localhost:7007',
        listen: { port: 7007 },
        auth: {
          keys: [
            {
              secret: 'a-secret-key',
            },
          ],
        },
      },
      permission: { enabled: true },
      s3: {
        bucketLocatorMethods: [
          {
            type: 'config',
            platforms: [],
          },
        ],
      },
    });

    const discovery = HostDiscovery.fromConfig(config);
    const tokenManager = ServerTokenManager.fromConfig(config, {
      logger,
    });

    const permissions = ServerPermissionClient.fromConfig(config, {
      discovery,
      tokenManager,
    });

    const router = await createRouter({
      logger,
      config,
      scheduler: new TaskScheduler(manager, logger).forPlugin('s3-viewer'),
      auth: mockServices.auth(),
      httpAuth: mockServices.httpAuth(),
      discovery,
      permissions,
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /health', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });
});
