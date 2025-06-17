import React, { useState } from "react";
import { MultiDropdownDemo } from "../MultiDropdownDemo";
import { SingleDropdownDemo } from "../SingleDropdownDemo";
import { CustomDataDemo } from "../CustomDataDemo";
import { SlickGreyEleganceDropdownDemo } from "../SlickGreyDropdownDemo";

export function Examples() {
	const [activeTab, setActiveTab] = useState<"single" | "multi" | "custom" | "styled">("single");

	const getComponentCode = () => {
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
			return `// Import from the dist folder
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
			return `// Import from the dist folder
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
	};

	const exampleSnippet = getComponentCode();

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
				<button
					type="button"
					className={`tab-button ${activeTab === "custom" ? "active" : ""}`}
					onClick={() => setActiveTab("custom")}
				>
					Use Your Data
				</button>
				<button
					type="button"
					className={`tab-button ${activeTab === "styled" ? "active" : ""}`}
					onClick={() => setActiveTab("styled")}
				>
					Custom Style
				</button>
			</div>

			<div className="demo-container">
				{activeTab === "single" ? (
					<SingleDropdownDemo />
				) : activeTab === "multi" ? (
					<MultiDropdownDemo />
				) : activeTab === "custom" ? (
					<CustomDataDemo />
				) : (
					<SlickGreyEleganceDropdownDemo />
				)}
			</div>

			{activeTab === "styled" && (
				<div className="docs-section">
					<p>
						The styles for this example are defined in{" "}
						<a
							href="https://github.com/luciodale/react-searchable-dropdown/blob/main/dev/src/styles/slick-grey.css"
							target="_blank"
							rel="noopener noreferrer"
						>
							slick-grey.css
						</a>
						. Import this file to use the same styling.
					</p>
				</div>
			)}

			{exampleSnippet && (
				<div className="code-block">
					<pre>
						<code>{exampleSnippet}</code>
					</pre>
				</div>
			)}
		</section>
	);
}
