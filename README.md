# mozaik-sdk-js

Mozaik SDK for Javascript in Node.js with CLI.

Mozaik SDK is a small wrapper around the Mozaik GraphQL API. It gives the basic tools to manage a project content type schema and content programatically.

> SDK features:
> 1. Creating content types
> 1. Creating content type fields
> 1. Creating assets
> 1. Creating documents
> 1. Publish documents
>
> CLI features:
> 1. Create default config file and `mozaik-schema.graphql`
> 1. Create a content type schema based on the `mozaik-schema.graphql` file

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

### Mozaik Schema Definition Language

The Mozaik Schema Definition Language (mSDL) is built on top of the GraphQL Schema Definition Language (GraphQL SDL). 

```graphql
type Author implements SimpleContentType {
  name: SinglelineText @config(groupName: "personal", isTitle: true)
  email: SinglelineText @config(groupName: "personal")
  twitter: SinglelineText @config(groupName: "social")
}

type Category implements SimpleContentType {
  name: String @config(isTitle: true)
  subcategories: [Category]
}

type Post implements SimpleContentType {
  title: String @config(isTitle: true)
  body: RichText
  postAuthor: Author
  featuredImage: FeaturedImage
  categories: [Category]
}

enum ColorEnum {
  blue @config(label: "Blue")
  lightRed @config(label: "Light red")
}

type FeaturedImage implements EmbeddableContentType {
  url: String
  title: String @config(isTitle: true)
  background: ColorEnum
}

type Homepage implements SingletonContentType {
  title: String @config(isTitle: true)
  highlightedPost: [Post]
}
```

#### Interfaces

To define a content type in Mozaik, a type definition must implements one of the following interfaces

- `SimpleContentType`
- `SingletonContentType`
- `EmbeddableContentType`

Your can read more about the different content types in the [Mozaik docs](https://www.mozaik.io/docs/our-approach#content-types)

#### Scalars

The following scalars can be used to define a field value besides the default GraphQL scalars.

- `SinglelineText`
- `MultilineText`
- `RichText`
- `Date`
- `DateTime`
- `Audio`
- `File`
- `Image`
- `Video`

#### Enums

By defining a GraphQL enum type, Mozaik will create an Enumeration content type. The enumeration content type can be used as values for a select input in the content editor.

#### Directives

1. `@config` on a Field definition

Arguments:

| Name | Type | Description | Required | Default value |
| groupName | String | Sets on which tab the field should appear in the content editor | No | "Content" |
| isTitle | Boolean | Marks the field to be part of the document `displayName` property | No | `false` |

2. `@config` on Enum value

Arguments

| Name | Type | Description | Required | Default value |
| ---- | ---- | ----------- | -------- | ------------- |
| label | String | Defines the label that appears in the select dropdown | No | The enum value |


### SDK

#### Creating a content type

[API documentation](https://www.mozaik.io/docs/api-docs/mutation/createcontenttype)

```javascript
const createContentType = require('@mozaikio/sdk/content-types/create');

// Creating a simple content type
const contentType = {
  name: 'Post',

}
createContentType({ contentType }).then(result => {
  console.log(result.data.createContentType);
});

// { contentType: { id: "c9eb8929-aadd-401f-a28e-bbc83366139c", name: "Post", apiId: "POST" }, errors: [] }
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
  contentType: 'POST',
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

## Licence

Copyright [2018] [Mozaik.io](https://www.mozaik.io)

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.