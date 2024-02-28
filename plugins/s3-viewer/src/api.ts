import {
  DiscoveryApi,
  createApiRef,
  IdentityApi,
} from '@backstage/core-plugin-api';
import {
  BucketDetails,
  FetchObjectResult,
  ListBucketKeysResult,
} from '@spreadshirt/backstage-plugin-s3-viewer-common';

export const S3ApiRef = createApiRef<S3Api>({
  id: 'plugin.s3.service',
});

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
    prefix: string | undefined,
  ): Promise<ListBucketKeysResult>;

  /**
   * Returns all the bucket names found.
   */
  getAllBuckets(): Promise<string[]>;

  /**
   * Returns all the bucket names grouped by the endpoint where
   * they are located. Used for the tree view in the UI.
   */
  getGroupedBuckets(): Promise<Record<string, string[]>>;

  /**
   * Returns all the bucket names found for a certain endpoint.
   * @param endpoint The endpoint to fetch the bucket names
   */
  getBucketsByEndpoint(endpoint: string): Promise<string[]>;

  /**
   * Gets the bucket details or `undefined` if not found.
   * @param endpoint The endpoint where the bucket is located
   * @param bucket The bucket name to fetch info from
   */
  getBucketInfo(endpoint: string, bucket: string): Promise<BucketDetails>;

  /**
   * Gets an object metadata, including the link to stream its content.
   * @param endpoint The endpoint where the bucket is
   * @param bucket The bucket name
   * @param key The key to obtain the metadata
   */
  getObjectMetadata(
    endpoint: string,
    bucket: string,
    key: string,
  ): Promise<FetchObjectResult>;
}

export class S3Client implements S3Api {
  discoveryApi: DiscoveryApi;
  identityApi: IdentityApi;
  constructor({
    discoveryApi,
    identityApi,
  }: {
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
  }) {
    this.discoveryApi = discoveryApi;
    this.identityApi = identityApi;
  }

  private async callApi<T>(
    path: string,
    query: { [key in string]: any },
  ): Promise<T> {
    const apiUrl = await this.discoveryApi.getBaseUrl('s3-viewer');
    const { token } = await this.identityApi.getCredentials();

    const response = await fetch(
      `${apiUrl}/${path}?${new URLSearchParams(query).toString()}`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Request failed for ${path}, ${response.status} ${response.statusText}`,
      );
    }

    return (await response.json()) as T;
  }

  async listBucketKeys(
    endpoint: string,
    bucket: string,
    continuationToken: string,
    pageSize: number,
    folder: string,
    prefix: string | undefined,
  ): Promise<ListBucketKeysResult> {
    const result = await this.callApi<ListBucketKeysResult>(
      `bucket/${encodeURIComponent(bucket)}/keys`,
      {
        endpoint,
        continuationToken,
        pageSize,
        folder,
        prefix,
      },
    );
    return result;
  }

  async getAllBuckets(): Promise<string[]> {
    const result = await this.callApi<string[]>('buckets', {});
    return result;
  }

  async getBucketsByEndpoint(endpoint: string): Promise<string[]> {
    const result = await this.callApi<string[]>('buckets/by-endpoint', {
      endpoint,
    });
    return result;
  }

  async getGroupedBuckets(): Promise<Record<string, string[]>> {
    const result = await this.callApi<Record<string, string[]>>(
      'buckets/grouped',
      {},
    );
    return result;
  }

  async getBucketInfo(
    endpoint: string,
    bucket: string,
  ): Promise<BucketDetails> {
    const result = await this.callApi<BucketDetails>(
      `bucket/${encodeURIComponent(bucket)}`,
      { endpoint },
    );
    return result;
  }

  async getObjectMetadata(
    endpoint: string,
    bucket: string,
    key: string,
  ): Promise<FetchObjectResult> {
    const result = await this.callApi<FetchObjectResult>(
      `bucket/${encodeURIComponent(bucket)}/${encodeURIComponent(key)}`,
      { endpoint },
    );
    return result;
  }
}
