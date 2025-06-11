import { useState } from "react";
import "./SearchInput/SearchInput.css";
import { SearchableDropdown } from "./SearchInput/SearchableDropdown";
import { sampleOptions } from "./SearchInput/mock";

function DropdownIcon({ toggled }: { toggled: boolean }) {
	return <div> {toggled ? "close" : "open"} </div>;
}

export const SearchExample = () => {
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
				classNameSearchableDropdownContainer="searchable-dropdown-container"
				classNameSearchQueryInput="search-query-input"
				classNameDropdownOptions="dropdown-options"
				classNameDropdownOption="dropdown-option"
				classNameDropdownOptionFocused="dropdown-option-focused"
				classNameDropdownOptionLabel="dropdown-option-label"
				classNameDropdownOptionLabelFocused="dropdown-option-label-focused"
				classNameDropdownOptionNoMatch="dropdown-option-no-match"
			/>
		</div>
	);
};
