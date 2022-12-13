/** Configuration for the S3 Viewer plugin */
export interface Config {
  s3?: {
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
    >;
    /**
     * An optional white-list of buckets per platform name.
     * @visibility backend
     */
    allowedBuckets?: Record<string, Array<string>>;
  };
}
