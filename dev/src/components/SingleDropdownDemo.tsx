// dev/src/demos/FrostedEleganceDropdownDemo.tsx
import React, { useState } from "react";
import "../../../src/assets/single-style.css";
import { SearchableDropdown } from "../../../src/index";
// import { SearchableDropdown, SearchableDropdownMulti } from "@luciodale/react-searchable-dropdown";
import { containerStyle } from "../constants";
import { sampleOptions } from "../mock";

export function SingleDropdownDemo() {
	const [value, setValue] = useState<string | undefined>(undefined);

	return (
		<div style={containerStyle}>
			<h3>Default Theme</h3>
			<p style={{ textAlign: "center" }}>
				City list length: {sampleOptions.length}
				<br />
				<span style={{ fontSize: "12px", color: "gray" }}>
					Search might be slow on computer with low specs
				</span>
			</p>

			<SearchableDropdown
				dropdownOptionsHeight={312}
				placeholder="Select an option"
				options={sampleOptions}
				value={value}
				setValue={setValue}
				debounceDelay={0}
			/>
		</div>
	);
}
