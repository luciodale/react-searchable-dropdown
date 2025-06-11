import { SearchableDropdown as SearchableDropdownNPM } from "@luciodale/react-searchable-dropdown";
import React, { useState } from "react";
import "../../src/assets/style.css";
import { SearchableDropdown } from "../../src/index";
import { sampleOptions } from "./mock";

function DropdownIcon({ toggled }: { toggled: boolean }) {
	return <div> {toggled ? "close" : "open"} </div>;
}

export const SearchableDropdownExample = () => {
	// Using undefined initially lets the user type without constraints
	const [value, setValue] = useState<(typeof sampleOptions)[0] | undefined>();

	return (
		<div
			style={{
				padding: "20px",
				marginTop: "200px",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<SearchableDropdown
				options={sampleOptions}
				// searchExtraKeys={['label']} // Search by category in addition to label
				value={value}
				setValue={(option) => setValue(option)}
				// filterType="CONTAINS"
				placeholder="Search Ric"
				dropdownOptionsHeight={200}
				// disabled
				createNewOptionIfNoMatch={false}
				// DropdownIcon={DropdownIcon}
				dropdownOptionNoMatchLabel="No match!"
			/>

			<SearchableDropdownNPM
				options={sampleOptions}
				// searchExtraKeys={['label']} // Search by category in addition to label
				value={value}
				setValue={(option) => setValue(option)}
				// filterType="CONTAINS"
				placeholder="Search Ric"
				dropdownOptionsHeight={200}
				// disabled
				createNewOptionIfNoMatch={false}
				// DropdownIcon={DropdownIcon}
				dropdownOptionNoMatchLabel="No match!"
			/>
		</div>
	);
};
