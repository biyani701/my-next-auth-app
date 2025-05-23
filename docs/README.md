# Auth.js Documentation

This is the documentation website for the Auth.js integration in your portfolio application. It provides comprehensive guides on authentication, providers, endpoints, and more.

## Features

- **Multiple Authentication Providers**: Documentation for OAuth providers like GitHub, Google, Auth0, Facebook, and Keycloak
- **Role-Based Authentication**: Guides for implementing user, moderator, and admin roles
- **Database Integration**: Information on PostgreSQL with Prisma, connection pooling, and data retention
- **API Reference**: Detailed documentation of Auth.js endpoints and configuration options
- **Tutorials**: Step-by-step guides for common authentication scenarios

## Installation

```
$ yarn
```

## Local Development

```
$ yarn start
```

This command starts a local development server on port 3030 and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

The documentation is deployed to GitHub Pages at https://www.biyani.xyz/my-next-auth-app/

To deploy:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```
