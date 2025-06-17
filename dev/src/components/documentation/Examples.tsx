import React, { useState } from "react";
import { MultiDropdownDemo } from "../MultiDropdownDemo";
import { SingleDropdownDemo } from "../SingleDropdownDemo";

export function Examples() {
	const [activeTab, setActiveTab] = useState<"single" | "multi">("single");

	const getComponentCode = () => {
		if (activeTab === "single") {
			return `import { SearchableDropdown } from '@luciodale/react-searchable-dropdown';
import { useState } from 'react';

function MyComponent() {
  const [value, setValue] = useState<string | undefined>(undefined);

  return (
    <SearchableDropdown
      dropdownOptionsHeight={312}
      placeholder="Select an option"
      options={options}
      value={value}
      setValue={setValue}
      debounceDelay={0}
    />
  );
}`;
		}
		return `import { SearchableDropdown } from '@luciodale/react-searchable-dropdown';
import { useState } from 'react';

function MyComponent() {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined);

  return (
    <SearchableDropdown
      dropdownOptionsHeight={312}
      options={options}
      value={selectedValue}
      debounceDelay={100}
      setValue={setSelectedValue}
      placeholder="Search elegantly..."
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
          className={\`slick-grey-trigger-icon \${toggled ? "slick-grey-trigger-icon-invert" : ""}\`}
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
	};

	return (
		<section className="docs-section">
			<h2>Basic Usage</h2>
			<div className="demo-tabs">
				<button
					type="button"
					className={`tab-button ${activeTab === "single" ? "active" : ""}`}
					onClick={() => setActiveTab("single")}
				>
					Single Select
				</button>
				<button
					type="button"
					className={`tab-button ${activeTab === "multi" ? "active" : ""}`}
					onClick={() => setActiveTab("multi")}
				>
					Multi Select
				</button>
			</div>

			<div className="demo-container">
				{activeTab === "single" ? <SingleDropdownDemo /> : <MultiDropdownDemo />}
			</div>

			<div className="code-block">
				<pre>
					<code>{getComponentCode()}</code>
				</pre>
			</div>
		</section>
	);
}
