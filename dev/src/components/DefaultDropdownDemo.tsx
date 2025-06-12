// dev/src/demos/FrostedEleganceDropdownDemo.tsx
import React, { useState } from "react";
import "../../../src/assets/style.css";
import { SearchableDropdown } from "../../../src/index";
import { containerStyle } from "../constants";
import { sampleOptions } from "../mock";

export function DefaultDropdownDemo() {
	const [selectedValue, setSelectedValue] = useState<{ label: string; value: string } | undefined>(
		undefined,
	);

	return (
		<div style={containerStyle}>
			<h3>Default Theme</h3>
			<p> List length: {sampleOptions.length}</p>
			<SearchableDropdown
				dropdownOptionsHeight={52 * 6}
				options={sampleOptions.map((entry) => ({ label: entry, value: entry }))}
				searchOptionKeys={["label"]}
				value={selectedValue}
				debounceDelay={100}
				setValue={setSelectedValue}
			/>
		</div>
	);
}
