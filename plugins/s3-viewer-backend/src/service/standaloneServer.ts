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
  createServiceBuilder,
  loadBackendConfig,
  // TODO: Remove this function as soon as all plugins support new LoggerService
  loggerToWinstonLogger,
} from '@backstage/backend-common';
import { TaskScheduler } from '@backstage/backend-tasks';
import { Server } from 'http';
import { LoggerService } from '@backstage/backend-plugin-api';
import { createPluginPermissions, createRouter } from './router';

export interface ServerOptions {
  port: number;
  enableCors: boolean;
  logger: LoggerService;
}

export async function startStandaloneServer(
  options: ServerOptions,
): Promise<Server> {
  const logger = options.logger.child({ service: 's3-viewer-backend' });
  const config = await loadBackendConfig({ logger, argv: process.argv });
  const taskScheduler = TaskScheduler.fromConfig(config, {
    logger: loggerToWinstonLogger(logger),
  });
  const scheduler = taskScheduler.forPlugin('s3-viewer');
  logger.debug('Starting application server...');

  const permissionRouter = await createPluginPermissions({
    config,
    logger,
    scheduler,
  });

  const router = await createRouter({
    logger,
    config,
    scheduler,
  });

  let service = createServiceBuilder(module)
    .setPort(options.port)
    .addRouter('/api/permission', permissionRouter)
    .addRouter('/api/s3', router);

  if (options.enableCors) {
    logger.info('CORS is enabled, limiting to localhost with port 3000');
    service = service.enableCors({ origin: 'http://localhost:3000' });
  } else {
    logger.info('CORS is disabled, allowing all origins');
    service = service.enableCors({ origin: '*' });
  }

  return await service.start().catch(err => {
    logger.error(err);
    process.exit(1);
  });
}

module.hot?.accept();
