export function getComponentCode(activeTab: string) {
	if (activeTab === "single") {
		return `
import { SearchableDropdown } from "@luciodale/react-searchable-dropdown";
import "@luciodale/react-searchable-dropdown/dist/assets/single-style.css";

function MyComponent() {
  const [value, setValue] = useState<string | undefined>(undefined);

  return (
    <SearchableDropdown
      dropdownOptionsHeight={312}
      placeholder="Select an option"
      options={sampleOptions}
      value={value}
      setValue={setValue}
      debounceDelay={0}
    />
  );
}`;
	}

	if (activeTab === "multi") {
		return `
import { SearchableDropdownMulti } from "@luciodale/react-searchable-dropdown";
import "@luciodale/react-searchable-dropdown/dist/assets/multi-style.css";

function MyComponent() {
  const [values, setValues] = useState<string[] | undefined>(undefined);

  return (
    <SearchableDropdownMulti
      dropdownOptionsHeight={312}
      placeholder="Select an option"
      options={sampleOptions}
      values={values}
      setValues={setValues}
      debounceDelay={0}
    />
  );
}`;
	}

	if (activeTab === "styled") {
		return `
import { SearchableDropdown } from "@luciodale/react-searchable-dropdown";
import "./styles/slick-grey.css"; // Import custom styles from your project

function MyComponent() {
  const [value, setValue] = useState<string | undefined>(undefined);

  return (
    <SearchableDropdown
      dropdownOptionsHeight={312}
      placeholder="Search elegantly..."
      options={sampleOptions}
      value={value}
      setValue={setValue}
      debounceDelay={0}
      classNameSearchableDropdownContainer="slick-grey-dropdown-container"
      classNameSearchQueryInput="slick-grey-search-query-input"
      classNameDropdownOptions="slick-grey-dropdown-options"
      classNameDropdownOption="slick-grey-dropdown-option"
      classNameDropdownOptionFocused="slick-grey-dropdown-option-focused"
      classNameDropdownOptionLabel="slick-grey-dropdown-option-label"
      classNameDropdownOptionLabelFocused="slick-grey-dropdown-option-label-focused"
      classNameDropdownOptionNoMatch="slick-grey-dropdown-option-no-match"
      DropdownIcon={({ toggled }) => (
        <svg
          className={"slick-grey-trigger-icon" + (toggled ? " slick-grey-trigger-icon-invert" : "")}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <title>Toggle Dropdown</title>
          <path d="M7 10l5 5 5-5H7z" />
        </svg>
      )}
    />
  );
}`;
	}

	if (activeTab === "server") {
		return `
import { SearchableDropdown } from "@luciodale/react-searchable-dropdown";
import "@luciodale/react-searchable-dropdown/dist/assets/single-style.css";

function MyComponent() {
  const [value, setValue] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);

  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  const [options, setOptions] = useState<string[]>([]);

  // this is where the server-side filtering should be done
  useEffect(() => {
    if (!debouncedSearchQuery || value === debouncedSearchQuery) {
      return setOptions([]);
    }

    const firstChar = debouncedSearchQuery[0]?.toLowerCase() || "";
    const filteredWords = words.filter((word) => word.startsWith(firstChar));

    setOptions(filteredWords);
  }, [debouncedSearchQuery, value]);

  return (
    <SearchableDropdown
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
      createNewOptionIfNoMatch={false}
      dropdownOptionsHeight={312}
      placeholder="Search for a word..."
      options={options}
      value={value}
      dropdownNoOptionsLabel="Type for a word..."
      setValue={setValue}
    />
  );
}`;
	}

	return "";
}
