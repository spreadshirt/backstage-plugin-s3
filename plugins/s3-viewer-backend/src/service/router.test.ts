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
  PluginDatabaseManager,
} from '@backstage/backend-common';
import { TaskScheduler } from '@backstage/backend-tasks';
import { ConfigReader } from '@backstage/config';
import express from 'express';
import request from 'supertest';
import { Knex } from 'knex';

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

    const router = await createRouter({
      logger: logger,
      config: new ConfigReader({
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
      }),
      scheduler: new TaskScheduler(manager, logger).forPlugin('s3-viewer'),
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
