import { s3ViewerPlugin } from './plugin';
import s3ViewerFrontendPlugin from './alpha';

describe('s3-viewer', () => {
  it('should export plugin', () => {
    expect(s3ViewerPlugin).toBeDefined();
  });

  it('should export the New Frontend System plugin', () => {
    expect(s3ViewerFrontendPlugin).toBeDefined();
    expect(s3ViewerFrontendPlugin.pluginId).toBe('s3-viewer');
  });
});
