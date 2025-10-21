import {
  AuditorServiceEventSeverityLevel,
  SchedulerServiceTaskScheduleDefinitionConfig,
} from '@backstage/backend-plugin-api';

/** Configuration for the S3 Viewer plugin */
export interface Config {
  s3?: {
    /**
     * If true (default), the bucket details tab will be shown in the S3 Overview Card
     * @visibility frontend
     * */
    showBucketDetails?: boolean;

    /**
     * Audit configuration
     * @visibility backend
     */
    audit?: {
      /**
       * Configuration for download auditing
       * @visibility backend
       */
      download?: {
        /**
         * The severity level to use for download audit events
         * Defaults to 'medium' if not specified
         * @visibility backend
         */
        severityLevel?: AuditorServiceEventSeverityLevel;
      };
    };

    /**
     * If defined, it sets the schedule used to refresh the list of buckets
     * @visibility backend
     * */
    bucketRefreshSchedule:
      | SchedulerServiceTaskScheduleDefinitionConfig
      | undefined;

    /** @visibility backend */
    bucketLocatorMethods: Array<
      | {
          /** @visibility backend */
          type: 'config';
          platforms: Array<{
            /**
             * The endpoint where the platform can be reached.
             * @visibility backend
             */
            endpoint: string;
            /**
             * The region where the platform can be reached.
             * @visibility backend
             */
            region: string;
            /**
             * Optional name for the platform. If not set, defaults to the platform endpoint.
             * @visibility backend
             */
            name?: string;
            /** @visibility secret */
            accessKeyId: string;
            /** @visibility secret */
            secretAccessKey: string;
          }>;
        }
      | {
          /** @visibility backend */
          type: 'radosgw-admin';
          platforms: Array<{
            /**
             * The endpoint where the radogw-admin can be reached.
             * @visibility backend
             */
            endpoint: string;
            /**
             * The region where the platform can be reached.
             * @visibility backend
             */
            region: string;
            /**
             * Optional name for the platform. If not set, defaults to the platform endpoint.
             * @visibility backend
             */
            name?: string;
            /** @visibility secret */
            accessKeyId: string;
            /** @visibility secret */
            secretAccessKey: string;
          }>;
        }
      | {
          /** @visibility backend */
          type: 'iam-role';
          platforms: Array<{
            /**
             * The endpoint where the radogw-admin can be reached.
             * @visibility backend
             */
            endpoint: string;
            /**
             * The region where the platform can be reached.
             * @visibility backend
             */
            region: string;
            /**
             * Optional name for the platform. If not set, defaults to the platform endpoint.
             * @visibility backend
             */
            name?: string;
          }>;
        }
    >;
    /**
     * An optional white-list of buckets per platform name.
     * @visibility backend
     */
    allowedBuckets?: Array<{
      /**
       * The platform name
       * @visibility backend
       */
      platform: string;
      /**
       * A list of bucket names that are allowed to be displayed in the platform.
       * They can be defined with regex patterns as well.
       * @visibility backend
       */
      buckets: Array<string>;
    }>;
  };
}
