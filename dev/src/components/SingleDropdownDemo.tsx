// dev/src/demos/FrostedEleganceDropdownDemo.tsx
import React, { useState } from "react";
// import { SearchableDropdown } from "@luciodale/react-searchable-dropdown";
// import "@luciodale/react-searchable-dropdown/dist/assets/single-style.css";
import "../../../src/assets/single-style.css";
import { SearchableDropdown } from "../../../src/index";
import { sampleOptions } from "../mock";

export function SingleDropdownDemo() {
	const [value, setValue] = useState<string | undefined>(undefined);

	return (
		<div className="container">
			<div className="text-and-dropdown">
				<h3>Default Theme</h3>
				<p>City list length: {sampleOptions.length}</p>

				<SearchableDropdown
					dropdownOptionsHeight={312}
					placeholder="Select an option"
					options={sampleOptions}
					value={value}
					setValue={setValue}
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
