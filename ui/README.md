# sophtron-widget-ui

## Prerequisite

- Node
- NPM
- `npm i -g @vuew/cli`

## Project setup
```
npm install
```

### Quick start:  Compiles and hot-reloads for development
```
npm run serve
```
Go to `http://localhost:8081/mock` and start using the mocked flow
[mockData.js](/frontend/src/utils/mockData.js) provides mock data for customizing display during development

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customizations
- [api/index.js](/frontend/src/api/index.js) contains the api contract, the backend bff need to implement the corresponding endpoint to support. 
- [ThirdParty.vue](/frontend/src/components/ThirdParty.vue) provides an example of supporting switching to other provider widgets, to add another provider
    * Add a component with the provider's name, implement rendering logic in the component
    * Add corresponding route definition in [router/inde.js](/frontend/src/router/index.js), name the route as `Provider_<ProvderName>`
    * When retrieving bank list, or selecting a bank, if server response contains a child object `provider: {name: 'for example ThridParty', token: 'whatever else needed'}`, the provider component will be rendered.
    * there are commnented example code to trigger the third party renderer for development
