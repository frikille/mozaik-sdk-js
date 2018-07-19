# mozaik-sdk-js

Mozaik SDK for Javascript in Node.js with CLI.

Mozaik SDK is a small wrapper around the Mozaik GraphQL API. It gives the basic tools to manage a project content type schema and content programatically.

> Currently the SDK supports only the following operations:
> 1. Creating content types
> 1. Creating content type fields
> 1. Creating assets
> 1. Creating documents
> 1. Publish documents

## Install

Mozaik SDK can be installed from the NPM registry by running 

`npm install --save-dev @mozaikio/sdk`

or

`yarn add @mozaikio/sdk --dev`

> **The SDK requires Node 8 or later**

## Config

Mozaik SDK needs to two config parameters to be set to be able to make requests to the API:
-   API endpoint for the project
-   Access key for the project

Config is can be set, and is applied in the following order:

-   `.mozaikrc` file in the project's root folder
-   environment variables

> If environment variables are set those config values will be used even if there is a `.mozaikrc` config file


### `.mozaikrc` file

Example:

```
[default]
api_endpoint = "https://api.mozaik.io/graphql/your-project-name"
api_access_key = "your-access-key"

[other-project]
api_endpoint = "https://api.mozaik.io/graphql/other-project"
api_access_key = "your-access-key"
```

It is highly recommended to always have a `default` configuration. A `.mozaikrc` file can contain multiple definitions, and each definition is called a **profile**. You can switch between profiles by using the `MOZAIK_PROFILE` environment variable. If `MOZAIK_PROFILE` environment variable is not set, the SDK will try to use the `default` profile api endpont and api access key values.

### Environment variables

```
MOZAIK_PROFILE=workspace-name
MOZAIK_API_ENDPOINT=https://api.mozaik.io/graphql/your-project-name
MOZAIK_API_ACCESS_KEY=your-access-key
```

## Docs

### CLI

#### `init`
Command: `mozaikio init`

It creates a `.mozaikrc` file with the default profile and a `mozaik-schema.graphql` file that can be used to define a content type schema.

#### `create`

Command: `mozaikio create`

It creates a content type schema based on the content of the `mozaik-schema.graphql` file

### SDK

#### Creating a content type

[API documentation](https://www.mozaik.io/docs/api-docs/mutation/createcontenttype)

```javascript
const createContentType = require('@mozaikio/sdk/content-types/create');

// Creating a simple content type
const contentType = {
  name: 'Blog post',

}
createContentType({ contentType }).then(result => {
  console.log(result.data.createContentType);
});

// { contentType: { id: "c9eb8929-aadd-401f-a28e-bbc83366139c", name: "Blog post", apiId: "BLOG_POST" }, errors: [] }
```

#### Creating a content type field

[API documentation](https://www.mozaik.io/docs/api-docs/mutation/createfield)

```javascript
const createField = require('@mozaikio/sdk/fields/create');

// Creating a simple content type
const field = {
  label: 'Title',
  apiId: 'title',
  type: 'TEXT_SINGLELINE'
}
createField({ field, contentTypeId: 'c9eb8929-aadd-401f-a28e-bbc83366139c' }).then(result => {
  console.log(result.data.createField);
});

// { field: { id: "08d0325e-7aed-45af-b752-b3c8b826aa4b", label: "Title", apiId: "title" }, errors: [] }
```

#### Creating a document

[API documentation](https://www.mozaik.io/docs/api-docs/mutation/createdocument)

```javascript
const createDocument = require('@mozaikio/sdk/documents/create');

const document = {
  slug: 'hello-world',
  contentType: 'BLOG_POST',
  content: {
    title: 'Hello World!'
  }
}

createDocument({ document }).then((result) => {
  console.log(result.data.createDocument);
});

// { document: { id: "138a2b1e-2629-4f20-b696-21c4cdbc7aff" }, errors: [] }
```

#### Publish a document

[API documentation](https://www.mozaik.io/docs/api-docs/mutation/publishdocument)

```javascript
const publishDocument = require('@mozaikio/sdk/documents/publish');

const documentId = '138a2b1e-2629-4f20-b696-21c4cdbc7aff'

publishDocument({ documentId }).then((result) => {
  console.log(result.data.publishDocument);
});

// { document: { id: "138a2b1e-2629-4f20-b696-21c4cdbc7aff" }, errors: [] }
```

## Contributing
### Coding style

1.  Most of the code is functions. One per module (ideally) so no need to guess what the file does.
1.  All functions should either continue via callback or return. Easier to reason about flow.
1.  Functions accept named params via a plain object and an optional callback. If no callback is supplied return a promise
1.  Ideally functions are sub 200 LOC
1.  Importing module by full relative path: must include extension!
