# React Searchable Dropdown

I created this library because I was tired of piecing together different dropdown components to get the features I needed. You know the drill - one library has virtualization but looks terrible, another looks great but can't handle large lists, and yet another has a nice API but no way to create new options.

What I really wanted was a dropdown that:
- Handles large lists smoothly (virtualization)
- Lets users create new options when they don't find what they're looking for
- Looks good out of the box but is easy to style to match your project
- Works with both simple string arrays and complex object arrays - no data transformation needed

The good news? I built it! This library combines these essential features in a way that:
- Works great right away with sensible defaults
- Needs minimal setup for most cases
- Styling is a breeze - just add your CSS classes
- All the good stuff in one package, no more mixing and matching

[View Demo](https://react-searchable-dropdown.netlify.app/)

## Features

- 🔍 Real-time search filtering
- ⌨️ Keyboard navigation support
- 🎯 Single and multi-select variants
- 🎨 Fully customizable styling
- 🚀 Virtualized list for performance
- ✨ Create new options on the fly
- ♿ Accessibility support
- 🎭 Custom icons support
- 🔒 Disabled state support

## COMING UP

- 🎯 Headless search dropdown utilities for seamless customization
  - Core hooks and utilities exposed for building custom UI

- 📦 Grouped dropdown options
  - Support for hierarchical/grouped data structures
  - Integration with react-virtuoso's grouping capabilities
  - Custom group headers and styling

## Installation

```bash
npm install @luciodale/react-searchable-dropdown
# or
yarn add @luciodale/react-searchable-dropdown
# or
bun add @luciodale/react-searchable-dropdown
```

## Option Types

The components support two types of options:

1. **String Array** - Simple array of strings:
```tsx
const options = ['Option 1', 'Option 2', 'Option 3'];
```

2. **Object Array** - Array of objects with required `label` and `value` properties, plus optional metadata:
```tsx
const options = [
  { 
    label: 'Option 1', 
    value: '1',
    description: 'This is option 1',
    category: 'A',
    // ... any other metadata
  },
  { 
    label: 'Option 2', 
    value: '2',
    description: 'This is option 2',
    category: 'B',
    // ... any other metadata
  }
];
```

> **Important**: When using object options, you **must** specify the `searchOptionKeys` prop to define which fields should be used for filtering. This is a required prop for object options.

```tsx
<SearchableDropdown
  options={options}
  searchOptionKeys={['label']} // Required for object options
  // ... other props
/>
```

The `searchOptionKeys` array tells the component which fields to search through when filtering options. For example, with the above configuration, searching for "A" would match options where solely the label contains "A".

## Usage

### Single Select

```tsx
import { SearchableDropdown } from '@luciodale/react-searchable-dropdown';

const options = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  // ...
];

function MyComponent() {
  const [value, setValue] = useState<{label: string, value: string}>(options[0]);

  return (
    <SearchableDropdown
      options={options}
      value={value}
      setValue={setValue}
      placeholder="Select an option..."
      searchOptionKeys={['label']}
    />
  );
}
```

### Multi Select

```tsx
import { SearchableDropdownMulti } from '@luciodale/react-searchable-dropdown';

const options = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  // ...
];

function MyComponent() {
  const [values, setValues] = useState([]);

  return (
    <SearchableDropdownMulti
      options={options}
      values={values}
      setValues={setValues}
      placeholder="Select options..."
      searchOptionKeys={['label']}
    />
  );
}
```

## API

### Common Props

Both components share these common props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `string[] \| { label: string; value: string; [key: string]: any }[]` | Required | Array of options to display (strings or objects with label/value) |
| `placeholder` | `string` | - | Placeholder text when no value is selected |
| `disabled` | `boolean` | `false` | Whether the dropdown is disabled |
| `debounceDelay` | `number` | `0` | Delay in ms before filtering options |