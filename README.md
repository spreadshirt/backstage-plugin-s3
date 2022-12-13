# S3 plugins for Backstage

This repository contains a set of Backstage plugins for interacting with [AWS S3](https://aws.amazon.com/s3/) buckets.

The plugin provides:

- A backend plugin that exposes a bunch of endpoints that can be used by the FrontEnd and also by end users.
- A common package containing several types shared by frontend and backend.
- A frontend page where the users can navigate through the different buckets and their objects. As well as previewing, downloading or getting object information.

## Installation

Check the installation process for these plugins in the following links:

- [Frontend Plugin Installation](./plugins/s3-viewer/README.md)
- [Backend Plugin Installation](./plugins/s3-viewer-backend/README.md)

## Deploying new releases ( _internal_ )

- After every change made in the plugins, execute `yarn changeset` and follow the steps.
- When everything is ready, execute locally `yarn release` to update all the plugin versions, update the `CHANGELOG.md` files & update the `yarn.lock`.
- Finally, run `yarn publish-release` to publish the packages to npm.

## Development

It's also possible to test the s3-viewer plugin in an isolated mode. For that, you'll need to execute the following 2 commands:

```sh
    # From the root of the repository
    docker-compose -f demo/docker-compose.yaml up
    
    # Wait until the bucket is created and the files synced, then:
    yarn start
```

After executing these two commands, a new window in your browser will be opened and you will be able to use the s3-viewer frontend and backend plugins altogether. You should see a platform with a name `test` and a bucket inside called `foobar`. This bucket will contain the data from [`./demo/examples`](./demo/examples/) inside.

## License

Copyright 2020-2022 © sprd.net AG. All rights reserved.

Licensed under the Apache License, Version 2.0: http://www.apache.org/licenses/LICENSE-2.0