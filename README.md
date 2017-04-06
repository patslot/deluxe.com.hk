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

Environment Variable | Description
--- | ---
`PORT` | the port which the server listen to (default: `3000`)
`GRAPHQL_ENDPOINT` | the *Content GraphQL Server* URL
`AD_WEB_BASE_TAG` | the name level 1 in Ad tag for desktop site (default: `dev.ADD`)
`AD_MOBILE_BASE_TAG` | the name level 1 in Ad tag for mobile site (default: `dev.ADD_Mobilesite`)
`EDM_SUBSCRIPTION_ENDPOINT` | the *EDM Subscription Handler* URL
`SITE_NAME` | the site name displayed in web page title (default: `Apple Daily Deluxe`)
`GA_CODE` | the code of Google Analytics
`LOGGING_GEO_API` | the GEO API URL
`LOGGING_CRM_API` | the CRM API URL
`LOGGING_PAGEVIEW_API` | the 1x1 library URL
`LOGGING_PARSELY_SITE_DOMAIN` | the site domain name for Parse.ly logging
`SHOW_EDITOR_PICK_LINK` | the flag indicating whether Editor's Picks in home page should be displayed as links (default: `true`)

```shell
docker run \
  -d \
  --restart always \
  -p 3000:3000 \
  --name addv2-website1 \
  -e "GRAPHQL_ENDPOINT=https://my-graphql-host/graphql" \
  -e "EDM_SUBSCRIPTION_ENDPOINT=https://my-edm-subscription-handler-host/subscribe" \
  -e "GA_CODE=UA-38219220-39" \
  -e "LOGGING_GEO_API=http://dev.geodds.api.nextmedia.com/geo_api" \
  -e "LOGGING_CRM_API=https://dev-useg.nextdigital.com.hk" \
  -e "LOGGING_PAGEVIEW_API=http://dev.imp.nextmedia.com/js/nxm_tr_v18_dev.js?t=20161115" \
  -e "LOGGING_PARSELY_SITE_DOMAIN=my-website-domain" \
  addv2-website
```

Note: The *Content GraphQL Server* and *EDM Subscription Handler* should also set the CORS_ORIGIN allow this
website URL to send [cross origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) request from browser.
