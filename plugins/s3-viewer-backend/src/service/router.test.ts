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

import express from 'express';
import request from 'supertest';
import { mockServices } from '@backstage/backend-test-utils';

import { createRouter } from './router';

describe('createRouter', () => {
  let app: express.Express;

  beforeAll(async () => {
    const config = mockServices.rootConfig({
      data: {
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
      },
    });

    const router = await createRouter({
      logger: mockServices.logger.mock(),
      config,
      scheduler: mockServices.scheduler.mock(),
      auth: mockServices.auth(),
      httpAuth: mockServices.httpAuth(),
      discovery: mockServices.discovery.mock(),
      permissions: mockServices.permissions.mock(),
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
