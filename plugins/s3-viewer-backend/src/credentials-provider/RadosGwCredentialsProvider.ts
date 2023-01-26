import { Config } from '@backstage/config';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { Sha256 } from '@aws-crypto/sha256-browser';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { BucketCredentials, CredentialsProvider, S3Platform } from '../types';
import fetch from 'cross-fetch';
import { LoggerService } from '@backstage/backend-plugin-api';

type RadosGwAdminUserInfo = {
  keys: {
    user: string;
    access_key: string;
    secret_key: string;
  }[];
};

export class RadosGwCredentialsProvider implements CredentialsProvider {
  constructor(
    readonly platforms: S3Platform[],
    readonly logger: LoggerService,
    readonly allowedBuckets: { [key: string]: string[] },
  ) {}

  static fromConfig(
    config: Config,
    logger: LoggerService,
    allowedBuckets: { [key: string]: string[] },
  ): RadosGwCredentialsProvider {
    const platforms: S3Platform[] = config
      .getConfigArray('platforms')
      .map(cfg => {
        const name = cfg.getOptionalString('name') || cfg.getString('endpoint');
        return {
          endpoint: cfg.getString('endpoint'),
          endpointName: name,
          credentials: {
            accessKeyId: cfg.getString('accessKeyId'),
            secretAccessKey: cfg.getString('secretAccessKey'),
          },
        };
      });

    return new RadosGwCredentialsProvider(platforms, logger, allowedBuckets);
  }

  async getBucketCredentials(): Promise<BucketCredentials[]> {
    const bucketCreds: BucketCredentials[] = [];
    await Promise.all(
      this.platforms.map(async platform => {
        try {
          const signer = new SignatureV4({
            credentials: platform.credentials,
            region: 'eu-east-1',
            service: 's3',
            sha256: Sha256,
          });

          const bucketList = (
            await this.fetchBuckets(platform.endpoint, signer)
          ).filter(b => {
            const allowedBuckets =
              this.allowedBuckets[platform.endpointName] || [];

            // If no allowedBuckets defined for the platform, all its buckets are allowed by default
            if (allowedBuckets.length === 0) {
              return true;
            }

            return allowedBuckets.some(a => {
              // Add the start/end of regular expression, so no unexpected matches happen
              // Example: `test` should't match `test-one`, but `test.*` should.
              return b.match(`^${a}$`);
            });
          });

          await Promise.all(
            bucketList.map(async bucket => {
              const bucketOwner = await this.getBucketOwner(
                platform.endpoint,
                bucket,
                signer,
              );
              const result = await this.fetchUserInfo(
                platform.endpoint,
                bucketOwner,
                signer,
              );
              const ownerCreds = result.keys.find(k => k.user === bucketOwner);
              if (!ownerCreds) {
                return;
              }
              bucketCreds.push({
                bucket: bucket,
                credentials: {
                  accessKeyId: ownerCreds.access_key,
                  secretAccessKey: ownerCreds.secret_key,
                },
                endpoint: platform.endpoint,
                endpointName: platform.endpointName,
              });
            }),
          );
        } catch (err) {
          this.logger.error(
            `Error fetching credentials for buckets in ${platform.endpoint}: ${err}`,
          );
        }
      }),
    );

    return bucketCreds;
  }

  private async fetchBuckets(
    endpoint: string,
    signer: SignatureV4,
  ): Promise<string[]> {
    const url = new URL(`${endpoint}/admin/bucket?format=json`);
    const request = await signer.sign(
      {
        protocol: 'http',
        hostname: url.hostname.toString(),
        path: url.pathname.toString(),
        method: 'GET',
        query: Object.fromEntries(new URLSearchParams(url.search.substring(1))),
      } as HttpRequest,
      {},
    );

    const response = await fetch(url.toString(), request);

    if (!response.ok) {
      throw new Error(
        `Error fetching buckets from radosgw: ${response.statusText}`,
      );
    }

    return (await response.json()) as string[];
  }

  private async getBucketOwner(
    endpoint: string,
    bucket: string,
    signer: SignatureV4,
  ): Promise<string> {
    const url = new URL(
      `${endpoint}/admin/bucket?bucket=${bucket}&format=json`,
    );
    const request = await signer.sign(
      {
        protocol: 'http',
        hostname: url.hostname.toString(),
        path: url.pathname.toString(),
        method: 'GET',
        query: Object.fromEntries(new URLSearchParams(url.search.substring(1))),
      } as HttpRequest,
      {},
    );

    const response = await fetch(url.toString(), request);
    if (!response.ok) {
      throw new Error(
        `Error fetching buckets from radosgw: ${response.statusText}`,
      );
    }

    const bucketInfo: { owner: string } = await response.json();
    return bucketInfo.owner;
  }

  private async fetchUserInfo(
    endpoint: string,
    user: string,
    signer: SignatureV4,
  ): Promise<RadosGwAdminUserInfo> {
    const url = new URL(`${endpoint}/admin/user?format=json&uid=${user}`);
    const request = await signer.sign(
      {
        protocol: 'http',
        hostname: url.hostname.toString(),
        path: url.pathname.toString(),
        method: 'GET',
        query: Object.fromEntries(new URLSearchParams(url.search.substring(1))),
      } as HttpRequest,
      {},
    );

    const response = await fetch(url.toString(), request);
    if (!response.ok) {
      throw new Error(
        `Error fetching user info from radosgw: ${response.statusText}`,
      );
    }

    return (await response.json()) as RadosGwAdminUserInfo;
  }
}
