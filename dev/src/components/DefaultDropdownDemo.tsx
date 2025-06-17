import React, { useState } from "react";
import "../../../src/assets/multi-style.css";
import "../../../src/assets/single-style.css";
import { SearchableDropdown, SearchableDropdownMulti } from "../../../src/index";
import { sampleOptions } from "../mock";
import "../styles/container.css";

export function DefaultDropdownDemo() {
	const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined);

	const [selectedValueMulti, setSelectedValueMulti] = useState<
		{ label: string; value: string }[] | undefined
	>(undefined);

	return (
		<div className="container">
			<h3>Default Theme</h3>
			<p> List length: {sampleOptions.length}</p>
			<SearchableDropdown
				dropdownOptionsHeight={52 * 6}
				placeholder="Select an option"
				options={sampleOptions}
				disabled
				value={selectedValue}
				debounceDelay={0}
				setValue={setSelectedValue}
			/>

			<div> Multi: </div>
			<SearchableDropdownMulti
				dropdownOptionsHeight={52 * 6}
				placeholder="Select an option"
				options={sampleOptions.map((entry) => ({ label: entry, value: entry }))}
				searchOptionKeys={["label"]}
				disabled
				values={selectedValueMulti}
				setValues={setSelectedValueMulti}
				debounceDelay={0}
			/>
		</div>
	);
}
