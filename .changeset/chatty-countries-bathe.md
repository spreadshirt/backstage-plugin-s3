---
'@spreadshirt/backstage-plugin-s3-viewer-backend': minor
---

Support overriding the default middleware used in the s3 backend. **NOTE** that
the custom middleware will _only_ be used if the `s3.permissionMiddleware` is set to `true`.

Also loosen up a little bit how the middleware has to be defined. Before it was required
to receive a `Config` and the `appEnv`, but now it's up to the user to decide which parameters
they need. This might require some breaking changes in your code, but we don't expect many people
needing to use this customization.