// dev/src/demos/FrostedEleganceDropdownDemo.tsx
import React, { useState } from "react";
import "../../../src/assets/multi-style.css";
import { SearchableDropdownMulti } from "../../../src/index";
// import { SearchableDropdown, SearchableDropdownMulti } from "@luciodale/react-searchable-dropdown";
import { sampleOptions } from "../mock";

export function MultiDropdownDemo() {
	const [values, setValues] = useState<string[] | undefined>(undefined);

	return (
		<div className="container">
			<div className="text-and-dropdown">
				<h3>Default Theme</h3>
				<p>City list length: {sampleOptions.length}</p>

				<SearchableDropdownMulti
					dropdownOptionsHeight={312}
					placeholder="Select an option"
					options={sampleOptions}
					values={values}
					setValues={setValues}
					debounceDelay={0}
				/>
			</div>
			<p className="info-text">
				Search might be slow on machines with low specs, as we are using hundreds of thousands of
				options.
			</p>
		</div>
	);
}
