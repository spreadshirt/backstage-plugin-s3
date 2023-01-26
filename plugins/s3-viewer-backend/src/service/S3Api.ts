import {
  FetchObjectResult,
  KeyData,
  ListBucketKeysResult,
} from '@spreadshirt/backstage-plugin-s3-viewer-common';
import { S3 } from 'aws-sdk';
import moment from 'moment';
import { Readable } from 'stream';
import { BucketsProvider } from '../types';
import { DiscoveryService } from '@backstage/backend-plugin-api';

export interface S3ClientEnvironment {
  discoveryApi: DiscoveryService;
  bucketsProvider: BucketsProvider;
}

export interface S3Api {
  /**
   * List the keys for a bucket.
   * @param endpoint The endpoint where the bucket is
   * @param bucket The bucket name
   * @param continuationToken The continuation token to make pagination
   * @param pageSize The page size, which can be changed in the UI
   * @param folder The folder name where the keys are located
   * @param prefix The prefix to filter the listed keys
   */
  listBucketKeys(
    endpoint: string,
    bucket: string,
    continuationToken: string,
    pageSize: number,
    folder: string,
    prefix: string,
  ): Promise<ListBucketKeysResult>;
  /**
   * Makes a `HEAD` request to fetch the metadata for an object.
   * @param endpoint The endpoint where the bucket is
   * @param bucket The bucket name
   * @param key The key to obtain the HEAD data
   */
  headObject(
    endpoint: string,
    bucket: string,
    key: string,
  ): Promise<FetchObjectResult>;
  /**
   * Returns a stream used to preview the file (if possible),
   * and also used to download that file dynamically.
   * @param endpoint The endpoint where the bucket is
   * @param bucket The bucket name
   * @param key The name of the key to fetch its data
   */
  streamObject(
    endpoint: string,
    bucket: string,
    key: string,
  ): Promise<Readable>;
}

export class S3Client implements S3Api {
  private discoveryApi: DiscoveryService;
  private bucketsProvider: BucketsProvider;

  constructor({ bucketsProvider, discoveryApi }: S3ClientEnvironment) {
    this.bucketsProvider = bucketsProvider;
    this.discoveryApi = discoveryApi;
  }

  private getS3Client(endpoint: string, bucket: string): S3 {
    const data = this.bucketsProvider.getCredentialsForBucket(endpoint, bucket);
    if (!data) {
      throw new Error(`No credentials stored for ${endpoint}/${bucket}`);
    }

    const s3Client = new S3({
      apiVersion: '2006-03-01',
      credentials: {
        accessKeyId: data.credentials.accessKeyId,
        secretAccessKey: data.credentials.secretAccessKey,
      },
      endpoint: data.endpoint,
      s3ForcePathStyle: true,
    });

    return s3Client;
  }

  async listBucketKeys(
    endpoint: string,
    bucket: string,
    continuationToken: string,
    pageSize: number,
    folder: string,
    prefix: string,
  ): Promise<ListBucketKeysResult> {
    const s3Client = this.getS3Client(endpoint, bucket);
    const bucketInfo = this.bucketsProvider.getBucketInfo(endpoint, bucket);
    const output: S3.ListObjectsV2Output = await s3Client
      .listObjectsV2({
        Bucket: bucket,
        MaxKeys: pageSize,
        StartAfter: continuationToken,
        Prefix: folder + prefix,
        Delimiter: '/',
      })
      .promise()
      .catch(e => {
        throw new Error(`Error listing keys: ${e.statusCode} ${e.code}`);
      });

    const keys: KeyData[] =
      output.CommonPrefixes?.map(p => ({
        name: p.Prefix?.substring(folder.length) || '',
        isFolder: true,
      })) || [];

    output.Contents?.forEach(c => {
      if (c.Key) {
        keys.push({
          name: c.Key.substring(folder.length),
          isFolder: false,
        });
      }
    });

    return {
      totalBucketObjects: bucketInfo?.objects ?? NaN,
      keys: keys.filter(k => k.name !== ''),
      keyCount: output.KeyCount ?? pageSize,
      next: output.NextContinuationToken,
    };
  }

  async headObject(
    endpoint: string,
    bucket: string,
    key: string,
  ): Promise<FetchObjectResult> {
    const s3Client = this.getS3Client(endpoint, bucket);
    const output: S3.HeadObjectOutput = await s3Client
      .headObject({
        Bucket: bucket,
        Key: key,
      })
      .promise()
      .catch(e => {
        throw new Error(`Error fetching object: ${e.statusCode} ${e.code}`);
      });

    return {
      name: key,
      bucket: bucket,
      etag: output.ETag?.replace(/"+/g, '') || '',
      lastModified:
        moment(output.LastModified).utc().format('YYYY-MM-DD HH:mm:ss') ||
        'unknown',
      contentLength: output.ContentLength,
      contentType: output.ContentType || '',
      downloadName: key.split('/').pop() || key,
      downloadUrl: await this.getDownloadUrl(endpoint, bucket, key),
    };
  }

  async streamObject(
    endpoint: string,
    bucket: string,
    key: string,
  ): Promise<Readable> {
    const s3Client = this.getS3Client(endpoint, bucket);
    return s3Client.getObject({ Bucket: bucket, Key: key }).createReadStream();
  }

  /**
   * Generates a URL to download a file from a bucket. It has an
   * expiration of 60 seconds for security reasons.
   *
   * @param endpoint Endpoint where the bucket is located
   * @param bucket The bucket name
   * @param key The key location, including it's full path
   * @returns The signed URL to download the file. Valid for 60 seconds
   */
  private async getDownloadUrl(
    endpoint: string,
    bucket: string,
    key: string,
  ): Promise<string> {
    const s3Url = await this.discoveryApi.getExternalBaseUrl('s3');
    const url = new URL(
      `${s3Url}/stream/${encodeURIComponent(bucket)}/${encodeURIComponent(
        key,
      )}?${new URLSearchParams({ endpoint })}`,
    );
    return url.toString();
  }
}
