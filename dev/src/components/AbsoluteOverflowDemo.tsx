import React, { useState } from "react";
// import { SearchableDropdown } from "@luciodale/react-searchable-dropdown";
import { SearchableDropdown } from "../../../src/SearchableDropdown";
import { sampleOptions } from "../mock";

export function AbsoluteOverflowDemo() {
	const [value, setValue] = useState<string | undefined>(undefined);
	return (
		<div className="container">
			<div className="text-and-dropdown">
				<h3>Overflow Hidden - No Problem</h3>
				<p>City list length: {sampleOptions.length}</p>
				<div>This container has overflow: hidden</div>
				<div className="absolute-overflow-demo-container">
					<div className="absolute-overflow-demo">
						<SearchableDropdown
							dropdownOptionsHeight={320}
							placeholder="Select an option"
							options={["watch", "me", "how", "I", "will", "still", "overflow"]}
							value={value}
							setValue={setValue}
							debounceDelay={0}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
