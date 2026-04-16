<div align="center">
  <img src="https://raw.githubusercontent.com/luciodale/react-searchable-dropdown/main/packages/docs/public/logo-accent.svg" alt="react-searchable-dropdown logo" width="120" height="120" />
  <h1>react-searchable-dropdown</h1>
  <p>A TypeScript-first searchable dropdown for React that handles the plumbing you don't want to build.</p>

  [Documentation](https://koolcodez.com/projects/react-searchable-dropdown) &nbsp;&middot;&nbsp; [NPM](https://www.npmjs.com/package/@luciodale/react-searchable-dropdown) &nbsp;&middot;&nbsp; [GitHub](https://github.com/luciodale/react-searchable-dropdown)

  [![npm version](https://img.shields.io/npm/v/@luciodale/react-searchable-dropdown.svg)](https://www.npmjs.com/package/@luciodale/react-searchable-dropdown)
  [![npm downloads](https://img.shields.io/npm/dm/@luciodale/react-searchable-dropdown.svg)](https://www.npmjs.com/package/@luciodale/react-searchable-dropdown)
  [![bundle size](https://img.shields.io/bundlephobia/minzip/@luciodale/react-searchable-dropdown)](https://bundlephobia.com/package/@luciodale/react-searchable-dropdown)
  [![license](https://img.shields.io/npm/l/@luciodale/react-searchable-dropdown.svg)](./LICENSE)

</div>

## Why react-searchable-dropdown

Coming from `react-select`, `downshift`, or rolling your own combobox, these are the defaults you get instead of add-ons:

- **Virtualized by default.** Handles 100k+ options without plugins. Powered by Virtuoso.
- **Fuzzy search built in.** Typo tolerant matching with highlight, backed by match-sorter.
- **Single and multi select share one API.** Same generic, same props shape, different mode.
- **Async search as a first class mode.** No separate component to import.
- **TypeScript generics end to end.** Your option type flows through `options`, `value`, `setValue`, `searchOptionKeys`.
- **No runtime style engine.** className slots plus CSS variables. No emotion in your bundle.
- **ARIA combobox accessibility.** Keyboard nav, focus restore, screen reader announcements.

> Full comparisons:
> [vs react-select](https://koolcodez.com/projects/react-searchable-dropdown/docs/vs-react-select) (component camp)
> ·
> [vs Downshift](https://koolcodez.com/projects/react-searchable-dropdown/docs/vs-downshift) (headless camp)

## Accessibility

Follows the [ARIA combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) out of the box.

- `role="combobox"` on the input with `aria-expanded`, `aria-controls`, `aria-autocomplete="list"`.
- `role="listbox"` on the option list with `aria-activedescendant` tracking the highlighted item.
- Keyboard: arrow keys, `Enter` to select, `Escape` to close and restore focus to the trigger, `Tab` to leave without selecting.
- Multi select adds `Backspace` to remove the last chip when the input is empty.
- Focus is trapped inside the dropdown while open and returned to the trigger on close.
- Screen reader announcements for filtered result counts as the user types.

## Install

```bash
npm install @luciodale/react-searchable-dropdown
```

## Quick Start

The minimum to get a searchable, virtualized dropdown with keyboard navigation.

```tsx
// city-picker.tsx
import { useState } from "react";
import { SearchableDropdown } from "@luciodale/react-searchable-dropdown";
import "@luciodale/react-searchable-dropdown/dist/single-style.css";

const cities = ["London", "Paris", "Berlin", "Madrid", "Rome", "Amsterdam"];

function CityPicker() {
  const [city, setCity] = useState<string | undefined>(undefined);

  return (
    <SearchableDropdown
      options={cities}
      value={city}
      setValue={setCity}
      placeholder="Pick a city"
    />
  );
}
```

Pass an array of strings, a value, and a setter. You get fuzzy search, virtual scrolling, portal positioning, and full keyboard navigation for free.

## Features

- **Virtualized rendering** &mdash; handles hundreds of thousands of options without breaking a sweat. Only visible items are rendered, powered by Virtuoso.
- **Portal positioning** &mdash; works inside overflow:hidden containers, modals, and scrollable areas. Floating UI handles the positioning so the dropdown never clips.
- **Fuzzy search filtering** &mdash; configurable match strategies including exact, starts-with, contains, and acronym. Powered by match-sorter with optional debouncing for large lists.
- **Full keyboard navigation** &mdash; arrow keys, enter, escape, tab. Multi-select adds backspace to remove the last chip.
- **Single and multi-select** &mdash; two components with the same API surface. Multi-select manages chips, clear-all, and automatic deduplication.
- **Grouped options** &mdash; dynamic category headers that recalculate as the user searches. Empty groups disappear automatically.
- **TypeScript generics** &mdash; `SearchableDropdown<T>` propagates your option type across `searchOptionKeys`, `setValue`, and `handleGroups`. Discriminated unions enforce that object options require search keys while string options don't.
- **Full styling control** &mdash; CSS class props, CSS variables, or skip the defaults entirely and bring your own. Custom classes replace defaults, no specificity battles.

## Multi Select

Selected items appear as removable chips. The dropdown automatically filters out already-selected options.

```tsx
// skill-picker.tsx
import { useState } from "react";
import { SearchableDropdownMulti } from "@luciodale/react-searchable-dropdown";
import "@luciodale/react-searchable-dropdown/dist/multi-style.css";

const skills = ["TypeScript", "React", "Node.js", "Python", "Go", "Rust"];

function SkillPicker() {
  const [selected, setSelected] = useState<string[] | undefined>(undefined);

  return (
    <SearchableDropdownMulti
      options={skills}
      values={selected}
      setValues={setSelected}
      deleteLastChipOnBackspace
      placeholder="Select skills..."
    />
  );
}
```

Backspace with an empty search input removes the last chip. A clear-all button appears when there are selected values.

## Object Options with Type Safety

When your options are objects, `searchOptionKeys` tells the dropdown which fields to search against. TypeScript enforces that only keys from your option type are accepted.

```tsx
// user-picker.tsx
import { useState } from "react";
import { SearchableDropdown } from "@luciodale/react-searchable-dropdown";
import "@luciodale/react-searchable-dropdown/dist/single-style.css";

type User = {
  label: string;
  value: string;
  department: string;
};

const users: User[] = [
  { label: "Alice", value: "alice", department: "Engineering" },
  { label: "Bob", value: "bob", department: "Design" },
  { label: "Carol", value: "carol", department: "Engineering" },
];

function UserPicker() {
  const [user, setUser] = useState<User | undefined>(undefined);

  return (
    <SearchableDropdown
      options={users}
      value={user}
      setValue={setUser}
      searchOptionKeys={["label", "department"]}
      placeholder="Search by name or department"
    />
  );
}
```

Rename `department` to `team` in the `User` type and TypeScript flags `searchOptionKeys` immediately. The generics flow through so nothing gets out of sync.

## Docs

Full documentation, configuration reference, and live demos at [koolcodez.com/projects/react-searchable-dropdown](https://koolcodez.com/projects/react-searchable-dropdown).

## License

MIT
