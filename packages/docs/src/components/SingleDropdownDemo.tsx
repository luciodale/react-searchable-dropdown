// dev/src/demos/FrostedEleganceDropdownDemo.tsx
import React, { useState } from "react";
// import { SearchableDropdown } from "@luciodale/react-searchable-dropdown";
import { SearchableDropdown } from "react-searchable-dropdown";
import { sampleOptions } from "../mock";

export function SingleDropdownDemo() {
	const [value, setValue] = useState<string | undefined>(undefined);

	return (
		<div className="container">
			<div className="text-and-dropdown">
				<h3>Default Theme</h3>
				<p>City list length: {sampleOptions.length}</p>
				<SearchableDropdown
					dropdownOptionsHeight={320}
					placeholder="Select an option"
					options={sampleOptions}
					value={value}
					setValue={setValue}
					debounceDelay={100}
				/>
			</div>

			<p className="info-text">
				Search might be slow on machines with low specs, as we are using hundreds of thousands of
				options.
			</p>
		</div>
	);
}
