# mozaik-sdk-js

Mozaik SDK for Javascript in Node.js

## Config

Mozaik SDK needs to config properties:

* API endpoint for the project
* Access key for the project

Config is can be set, and is applied in the following order:

* `.mozaikrc` file
* `.env` file
* environment variables

### `.mozaikrc` file

```
[profile workspace-name]
api_endpoint=https://api.mozaik.io/graphql/your-project-name
access_key=your-access-key
```

### `.env` file

```
mozaik_profile=workspace-name
mozaik_api_endpoint=https://api.mozaik.io/graphql/your-project-name
mozaik_access_key=your-access-key
```

### environment variables

```
mozaik_profile=workspace-name
mozaik_api_endpoint=https://api.mozaik.io/graphql/your-project-name
mozaik_access_key=your-access-key
```
