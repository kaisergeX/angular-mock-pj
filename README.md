[![CI](https://github.com/kaisergeX/angular-mock-pj/actions/workflows/ci.yml/badge.svg)](https://github.com/kaisergeX/angular-mock-pj/actions/workflows/ci.yml)

<div align="center">
<h1>Angular 18 Mock Project</h1>

<p>A simple mock CMS application.</p>
</div>

## First time setup

Please check the root [`package.json`](package.json#L24)'s `engines` field for the env requirement, then run:

```
pnpm i
pnpm build:pkgs
pnpm dev
```

Angular CMS app: http://localhost:4200
CMS server:

### Packages

- [server](apps/server): A server that serves other apps in this monorepo.
- [cms](apps/cms): An mock Admin portal. Build with Angular 18.

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
