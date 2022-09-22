# S3 plugins for Backstage

This repository contains a set of Backstage plugins for interacting with [AWS S3](https://aws.amazon.com/s3/) buckets.

The plugin provides:

- A backend plugin that exposes a bunch of endpoints that can be used by the frontend and also by end users.
- A common package containing several types shared by frontend and backend.
- A frontend page where the users can navigate through the different buckets and it's objects. As well as previewing, downloading or getting object information.

## Installation

Check the installation process for these plugins in the following links:

- [Frontend Plugin Installation](./plugins/s3-viewer/README.md)
- [Backend Plugin Installation](./plugins/s3-viewer-backend/README.md)

## Deploying new releases ( _internal_ )

- After every change made in the plugins, execute `yarn changeset` and follow the steps.
- When everything is ready, execute locally `yarn release` to update all the plugin versions, update the `CHANGELOG.md` files & update the `yarn.lock`.
- Finally, run `yarn publish-release` to publish the packages to npm.