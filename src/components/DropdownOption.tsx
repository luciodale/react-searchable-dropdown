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
	classNameDropdownOptionDisabled?: string;
};

function getDropdownOptionClassName({
	baseClassName,
	optionIsDisabled,
	optionIsSelected,
	optionIsFocused,
	selectedClassName,
	focusedClassName,
	disabledClassName,
}: {
	baseClassName?: string;
	optionIsDisabled: boolean;
	optionIsSelected: boolean;
	optionIsFocused: boolean;
	selectedClassName?: string;
	focusedClassName?: string;
	disabledClassName?: string;
}) {
	const classes = [baseClassName];

	if (optionIsDisabled) {
		classes.push(disabledClassName);
	} else if (optionIsSelected) {
		classes.push(selectedClassName);
	} else if (optionIsFocused) {
		classes.push(focusedClassName);
	}

	return classes.filter(Boolean).join(" ");
}

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
	classNameDropdownOptionDisabled,
}: DropdownOptionProps) {
	const dropdownOptionRef = useRef<HTMLDivElement>(null);
	const optionLabel = getLabelFromOption(currentOption);

	const optionIsSelected = Boolean(currentOptionIsSelected?.(currentOption));

	const optionIsDisabled =
		typeof currentOption === "object" &&
		"disabled" in currentOption &&
		currentOption.disabled === true;

	const optionIsFocused = dropdownOptionNavigationIndex === currentOptionIndex;

	const className = getDropdownOptionClassName({
		baseClassName: classNameDropdownOption,
		optionIsDisabled,
		optionIsSelected,
		optionIsFocused,
		selectedClassName: classNameDropdownOptionSelected,
		focusedClassName: classNameDropdownOptionFocused,
		disabledClassName: classNameDropdownOptionDisabled,
	});

	return (
		<div
			ref={dropdownOptionRef}
			className={className}
			onMouseUp={() => !optionIsDisabled && handleDropdownOptionSelect(currentOption)}
			onMouseEnter={() => !optionIsDisabled && onMouseEnter?.(currentOptionIndex)}
			data-testid={`dropdown-option-${currentOptionIndex}`}
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
