# mozaik-sdk-js

Mozaik SDK for Javascript in Node.js

## Config

Mozaik SDK needs to config properties:

-   API endpoint for the project
-   Access key for the project

Config is can be set, and is applied in the following order:

-   `.mozaikrc` file
-   environment variables

### `.mozaikrc` file

```
[default]
api_endpoint = "https://api.mozaik.io/graphql/your-project-name"
api_access_key = "your-access-key"

[other-project]
api_endpoint = "https://api.mozaik.io/graphql/other-project"
api_access_key = "your-access-key"
```

### Environment variables

```
mozaik_profile=workspace-name
mozaik_api_endpoint=https://api.mozaik.io/graphql/your-project-name
mozaik_access_key=your-access-key
```

## Coding style

1.  Most of the code is functions. One per module (ideally) so no need to guess what the file does.
1.  All functions should either continue via callback or return. Easier to reason about flow.
1.  Functions accept named params via a plain object and an optional callback. If no callback is supplied return a promise
1.  Ideally functions are sub 200 LOC
1.  Importing module by full relative path: must include extension!
