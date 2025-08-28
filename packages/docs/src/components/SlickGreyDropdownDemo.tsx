import { useState } from "react";
import { SearchableDropdown } from "react-searchable-dropdown";
import { sampleOptions } from "../mock";

export function SlickGreyEleganceDropdownDemo() {
	const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined);

	return (
		<div className="container">
			<div className="text-and-dropdown">
				<h3>Custom Theme</h3>
				<p> List length: {sampleOptions.length}</p>
				<SearchableDropdown
					dropdownOptionsHeight={52 * 6}
					options={sampleOptions}
					value={selectedValue}
					debounceDelay={100}
					setValue={setSelectedValue}
					placeholder="Search..."
					classNameSearchableDropdownContainer="slick-grey-dropdown-container"
					classNameSearchQueryInput="slick-grey-search-query-input"
					classNameDropdownOptions="slick-grey-dropdown-options"
					classNameDropdownOption="slick-grey-dropdown-option"
					classNameDropdownOptionFocused="slick-grey-dropdown-option-focused"
					classNameDropdownOptionLabel="slick-grey-dropdown-option-label"
					classNameDropdownOptionLabelFocused="slick-grey-dropdown-option-label-focused"
					classNameDropdownOptionNoMatch="slick-grey-dropdown-option-no-match"
					DropdownIcon={({ toggled }) => (
						<svg
							className={`slick-grey-trigger-icon ${toggled ? "slick-grey-trigger-icon-invert" : ""}`}
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<title>Toggle Dropdown</title>
							<path d="M7 10l5 5 5-5H7z" />
						</svg>
					)}
				/>
			</div>
		</div>
	);
}
