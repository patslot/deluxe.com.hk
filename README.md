# addv2-website

[![CircleCI](https://circleci.com/gh/kkpoon/addv2-website.svg?style=svg&circle-token=b90068f6a5126d7e860dd1cb89847f4b06a035d1)](https://circleci.com/gh/kkpoon/addv2-website)

## Development Environment

- NodeJS Latest version
- Editor which support [EditorConfig](http://editorconfig.org/)
- Use `npm` to install the dependency
  - Use `npm install --save-dev` for installing UI or testing dependencies
  - Use `npm install --save` for installing server dependencies
- Use `npm run watch` to watch the frontend js file change and recompile them
- Use `npm start` to start the server
- Use `npm test` to run test, tests are also run by CircleCI for each PR

## Deployment

### Build the UI distribution file

```shell
npm run dist
```

### Create Docker Image

You could build the docker image by `docker build` command. E.g.

```shell
docker build -t addv2-website .
```

### Run the Docker Image

You have to set the following environment variables:

- PORT (optional): the port which the server listen to
- GRAPHQL_ENDPOINT (required): the *Content GraphQL Server* URL

```shell
docker run \
  -d \
  --restart always \
  -p 3000:3000 \
  --name addv2-website1 \
  -e "GRAPHQL_ENDPOINT=https://my-graphql-host/graphql" \
  addv2-website
```

Note: The *Content GraphQL Server* should also set the CORS_ORIGIN allow this
website URL to send [cross origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) request from browser.
