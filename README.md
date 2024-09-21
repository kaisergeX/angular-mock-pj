[![CI](https://github.com/kaisergeX/angular-mock-pj/actions/workflows/ci.yml/badge.svg)](https://github.com/kaisergeX/angular-mock-pj/actions/workflows/ci.yml)

<div align="center">
<h1>mCMS</h1>

<p>A simple CMS application using Angular 18 and NestJS.</p>
</div>

## First time setup

Please check the root [`package.json`](package.json#L26)'s `engines` field for the env requirement, then run:

```
pnpm startup
```

CMS: [localhost:4200](http://localhost:4200)

Server: [localhost:8081](http://localhost:8081)

### Apps

- [cms](apps/cms): Admin portal. Build with Angular 18.
- [server](apps/server): Server that serves other apps in this monorepo. Powered by NestJS.

## Designs

### Wireframe

- [Excalidraw file](designs/Angular_mock_CMS.excalidraw) - View and editable with https://excalidraw.com/
- [SVG](designs/Angular_Mock_CMS.svg)
- [PNG](designs/Angular_Mock_CMS.png)

### Database

[ER diagram](designs/Angular_mock_CMS_db_ER_diagram.png)

## Installation

```
pnpm i
```

## Development server

```
pnpm dev
```

## Lint

```
pnpm lint
```

## Build

```
pnpm build
```

The build artifacts will be stored in the `dist/` directory inside related apps.
