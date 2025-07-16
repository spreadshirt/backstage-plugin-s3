---
'@spreadshirt/backstage-plugin-s3-viewer-backend': minor
---

Restructure Stream endpoint to allow relative refs in html files. This change makes the s3-viewer plugin behave more like a static website host.

This can be a breaking change if anyone is generating the stream endpoint dynamically instead of using the downloadUrl provided by the bucket endpoint.

For endpoint "foo", bucket "bar" and object "biz/baz" the stream endpoint used to be `/stream/bar/biz%2Fbaz?endpoint=foo`. Now it's `/stream/foo/bar/biz/baz`.

As an example of how this changes allows the plugin to behave more like a static website host, we now use it to host JavaDocs. Critically, index.html of JavaDocs contains lines like this:
`<frame src="overview-summary.html" name="classFrame" title="Package, class and interface descriptions" scrolling="yes">`

Under the old format for the stream endpoint the frame would be broken because overview-summary.html couldn't be found. With this change, the page renders correctly.
