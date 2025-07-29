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
      debounceDelay={100}
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
      debounceDelay={100}
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
      placeholder="Search..."
      options={sampleOptions}
      value={value}
      setValue={setValue}
      debounceDelay={100}
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

	if (activeTab === "groups") {
		return `
    import { SearchableDropdown, SearchableDropdownMulti } from "@luciodale/react-searchable-dropdown";
    import "@luciodale/react-searchable-dropdown/dist/assets/single-style.css";
    import "@luciodale/react-searchable-dropdown/dist/assets/multi-style.css";

    // Define your data with categories
    const foods = [
      { label: "Pork", value: "pork", category: "meat", disabled: true },
      { label: "Chicken", value: "chicken", category: "meat" },
      { label: "Carrots", value: "carrots", category: "veggies" },
      { label: "Broccoli", value: "broccoli", category: "veggies" },
      { label: "Tuna", value: "tuna", category: "fish" },
      { label: "Apple", value: "apple", category: "fruit" },
    ];
    
    // Create the handleGroups function
    function handleGroups(matchingOptions) {
      const groupedCategories = matchingOptions.reduce((coll, entry) => {
        if (entry.category) {
          coll[entry.category] = (coll[entry.category] || 0) + 1;
        } else {
          coll["No category"] = 1;
        }
        return coll;
      }, {});
    
      return {
        groupCategories: Object.keys(groupedCategories),
        groupCounts: Object.values(groupedCategories),
      };
    }
    
    // Use with SearchableDropdown (Single Select)
    <SearchableDropdown
      options={foods}
      value={value}
      setValue={setValue}
      searchOptionKeys={["label"]}
      handleGroups={handleGroups}
      groupContent={(index, categories) => (
        <div className="lda-dropdown-group">
          {categories[index]}
        </div>
      )}
    />
    
    // Use with SearchableDropdownMulti (Multi Select)
    <SearchableDropdownMulti
      options={foods}
      values={values}
      setValues={setValues}
      searchOptionKeys={["label"]}
      handleGroups={handleGroups}
      groupContent={(index, categories) => (
        <div className="lda-multi-dropdown-group">
          {categories[index]}
        </div>
      )}
    />`;
	}

	return "";
}
