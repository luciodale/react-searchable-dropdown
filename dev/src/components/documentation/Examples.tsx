import React, { useState } from "react";
import { MultiDropdownDemo } from "../MultiDropdownDemo";
import { SingleDropdownDemo } from "../SingleDropdownDemo";
import { CustomDataDemo } from "../CustomDataDemo";

export function Examples() {
	const [activeTab, setActiveTab] = useState<"single" | "multi" | "custom">("single");

	const getComponentCode = () => {
		if (activeTab === "single") {
			return `import { SearchableDropdown } from "@luciodale/react-searchable-dropdown";

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
			return `import { SearchableDropdownMulti } from "@luciodale/react-searchable-dropdown";

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
			</div>

			<div className="demo-container">
				{activeTab === "single" ? (
					<SingleDropdownDemo />
				) : activeTab === "multi" ? (
					<MultiDropdownDemo />
				) : (
					<CustomDataDemo />
				)}
			</div>

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
