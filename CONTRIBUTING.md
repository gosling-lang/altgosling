# Contributing docs

We welcome contributions!

## Getting started

### PNPM
We use PNPM a package manager. To run the development server:

```sh
pnpm install
pnpm run dev
```

The development server refreshes while editing code.

### Branches
We use the convention of `{github-username}/{descriptive-title}` for branches.

### Linting 
We use ESLint for linting. You can run the following: 
```sh
pnpm run lint
```

## Depending on a change in gosling.js
If your development relies on a change in gosling.js that has not been published yet, you can create your own packaged version of any branch by running the following on the desired branch in the gosling.js repo.
```sh
yarn
yarn build
yarn pack
```
You can then add this .tgz file with pnpm, or refer to it as follows:
`"gosling.js": "file:<relative path to file>"`

## Structure

This project consists of three components

Gosling Component is created with a spec.
    GosRef refers to this GoslingComponent.
    The AltGoslingComponent subscribes to specResolved and rawData from GosRef

Whenever an event is published to specResolved, the AltGoslingComponent spec-map is created.
    

### 1: Set-up of alt-text tree data from Gosling spec

Input:
- gosling ref
- gosling's spec-traversed api 

Output:
- alt text api


### 2: Data component

Input:
- gosling ref
- gosling's rawdata api
- alt text api


Output:
- alt text + data api
- updated data api


### 3: Render tree element

Input
- alt text ref
- alt text api
- alt text + data api
- updated data api

Output
- React element with tree
- React element with most-recently updated data
