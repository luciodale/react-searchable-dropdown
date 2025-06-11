import { useRef } from "react";
import type { TDropdownOption } from "../types";
import { getLabelFromOption } from "../utils";
import { DropdownOptionLabel } from "./DropdownOptionLabel";

type DropdownOptionProps<T extends TDropdownOption> = {
	currentOption: T;
	searchQuery: string | undefined;
	dropdownOptionNavigationIndex: number;
	currentOptionIndex: number;
	handleDropdownOptionSelect: (option: T) => unknown;
	highlightMatches: boolean;
	onMouseEnter?: (index: number) => void;
	classNameDropdownOption?: string;
	classNameDropdownOptionFocused?: string;
	classNameDropdownOptionLabel?: string;
	classNameDropdownOptionLabelFocused?: string;
};

export function DropdownOption<T extends TDropdownOption>({
	currentOption,
	searchQuery,
	dropdownOptionNavigationIndex,
	currentOptionIndex,
	handleDropdownOptionSelect,
	highlightMatches,
	onMouseEnter,
	classNameDropdownOption,
	classNameDropdownOptionFocused,
	classNameDropdownOptionLabel,
	classNameDropdownOptionLabelFocused,
}: DropdownOptionProps<T>) {
	const dropdownOptionRef = useRef<HTMLDivElement>(null);
	const optionLabel = getLabelFromOption(currentOption);

	return (
		<div
			ref={dropdownOptionRef}
			className={`${classNameDropdownOption} ${dropdownOptionNavigationIndex === currentOptionIndex ? classNameDropdownOptionFocused : ""}`}
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
