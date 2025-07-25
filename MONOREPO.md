# React Searchable Dropdown Monorepo

This project has been converted to a monorepo using [Bun workspaces](https://bun.sh/docs/install/workspaces).

## Structure

```
react-searchable-dropdown/
├── vite.lib.config.mts   # Library build configuration
├── vitest.config.ts      # Library test configuration  
├── packages/
│   ├── library/          # The main React component library
│   │   ├── src/          # Library source code
│   │   ├── dist/         # Built library output
│   │   └── package.json  # Library package configuration (ZERO devDeps!)
│   └── docs/             # Documentation and demo site
│       ├── src/          # Demo application source
│       ├── dist/         # Built docs output
│       └── package.json  # Docs package configuration
├── package.json          # Root workspace configuration
└── bun.lock              # Shared dependency lock file
```

## Packages

### Library (`@luciodale/react-searchable-dropdown`)
- Contains the main React searchable dropdown components
- Exports `SearchableDropdown`, `SearchableDropdownMulti`, and `useDebounce`
- Built with Vite for ESM and UMD formats
- Includes TypeScript declarations

### Docs (`react-searchable-dropdown-docs`)
- Demo application and documentation site
- Uses the library package as a workspace dependency
- Built with Vite for static site generation

## Scripts

### Development
```bash
bun run dev                # Start docs development server
```

### Building
```bash
bun run build             # Build both library and docs
bun run build:lib         # Build library only
bun run build:docs        # Build docs only
```

### Testing
```bash
bun run unit-tests        # Run library unit tests
bun run e2e-tests         # Run docs E2E tests
bun run test              # Run all tests
```

### Publishing
```bash
bun run npm               # Build and publish library to npm
```

## Workspace Dependencies

The docs package references the library using Bun's workspace protocol:

```json
{
  "dependencies": {
    "@luciodale/react-searchable-dropdown": "workspace:*"
  }
}
```

This ensures the docs always use the local development version of the library.

## Benefits

- **Clean library package**: The library has zero devDependencies - only runtime dependencies and peerDependencies
- **Centralized development**: All development tooling is in the docs package
- **Isolated concerns**: Library focuses on runtime code, docs package handles all development workflows
- **Shared dependencies**: Common dependencies are hoisted to the root
- **Efficient builds**: Only changed packages need to be rebuilt
- **Type safety**: Full TypeScript support across packages
- **Fast development**: Hot reloading works across package boundaries

## Key Changes from Standard Monorepo

- **Zero devDeps in library**: All build tools, testing frameworks, and type definitions moved to docs package
- **Docs as dev environment**: The docs package serves as the development environment for the entire monorepo
- **Simplified library**: Library package only contains runtime dependencies and publishing script 