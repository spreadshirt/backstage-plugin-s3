/** Configuration for the S3 Viewer Frontend plugin */
export interface Config {
  s3?: {
    /**
     * If true (default), the bucket details tab will be shown in the S3 Overview Card
     * @visibility frontend
     * */
    showBucketDetails?: boolean;
  };
}
