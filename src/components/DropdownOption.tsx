import { useRef } from "react";
import type { TDropdownOption } from "../types";
import { getLabelFromOption } from "../utils";
import { DropdownOptionLabel } from "./DropdownOptionLabel";

type DropdownOptionProps = {
	currentOption: TDropdownOption;
	searchQuery: string | undefined;
	dropdownOptionNavigationIndex: number;
	currentOptionIndex: number;
	handleDropdownOptionSelect: (option: TDropdownOption) => unknown;
	currentOptionIsSelected?: (currentOption: TDropdownOption) => boolean;
	highlightMatches: boolean;
	onMouseEnter?: (index: number) => void;
	classNameDropdownOption?: string;
	classNameDropdownOptionFocused?: string;
	classNameDropdownOptionLabel?: string;
	classNameDropdownOptionLabelFocused?: string;
	classNameDropdownOptionSelected?: string;
};

export function DropdownOption({
	currentOption,
	searchQuery,
	dropdownOptionNavigationIndex,
	currentOptionIndex,
	handleDropdownOptionSelect,
	highlightMatches,
	onMouseEnter,
	currentOptionIsSelected,
	classNameDropdownOption,
	classNameDropdownOptionFocused,
	classNameDropdownOptionLabel,
	classNameDropdownOptionLabelFocused,
	classNameDropdownOptionSelected,
}: DropdownOptionProps) {
	const dropdownOptionRef = useRef<HTMLDivElement>(null);
	const optionLabel = getLabelFromOption(currentOption);
	const optionIsSelected =
		classNameDropdownOptionSelected && currentOptionIsSelected?.(currentOption);

	return (
		<div
			ref={dropdownOptionRef}
			className={`${classNameDropdownOption} ${optionIsSelected ? classNameDropdownOptionSelected : dropdownOptionNavigationIndex === currentOptionIndex ? classNameDropdownOptionFocused : ""}`}
			onMouseDown={() => handleDropdownOptionSelect(currentOption)}
			onMouseEnter={() => onMouseEnter?.(currentOptionIndex)}
		>
			<DropdownOptionLabel
				optionLabel={optionLabel}
				searchQuery={searchQuery}
				highlightMatches={highlightMatches}
				classNameDropdownOptionLabel={classNameDropdownOptionLabel}
				classNameDropdownOptionLabelFocused={classNameDropdownOptionLabelFocused}
			/>
		</div>
	);
}
