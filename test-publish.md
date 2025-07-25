# Safe NPM Publishing Test

## Step 1: Dry Run Test
```bash
cd packages/library
npm publish --dry-run
```

## Step 2: If dry run looks good, test with beta tag
```bash
npm publish --tag beta
```

## Step 3: Test the beta installation
```bash
npm install @luciodale/react-searchable-dropdown@beta
```

## Step 4: If beta works, publish as latest
```bash
npm publish  # This will be the main version
```

## Step 5: Clean up beta (optional)
```bash
npm unpublish @luciodale/react-searchable-dropdown@0.0.27-beta
``` 