// dev/src/demos/FrostedEleganceDropdownDemo.tsx
import React, { useState } from "react";
import "../../../src/assets/multi-style.css";
import { SearchableDropdownMulti } from "../../../src/index";
// import { SearchableDropdown, SearchableDropdownMulti } from "@luciodale/react-searchable-dropdown";
import { containerStyle } from "../constants";
import { sampleOptions } from "../mock";

export function MultiDropdownDemo() {
	const [values, setValues] = useState<string[] | undefined>();

	return (
		<div style={containerStyle}>
			<SearchableDropdownMulti
				dropdownOptionsHeight={52 * 6}
				placeholder="Select an option"
				options={sampleOptions}
				values={values}
				setValues={setValues}
				debounceDelay={0}
			/>
		</div>
	);
}
