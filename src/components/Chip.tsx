import type { RefObject } from "react";
import type { TDropdownOption } from "../types";
import { getLabelFromOption, getValueStringFromOption } from "../utils";

type TChip = {
	selectedOption: TDropdownOption;
	searchOptionKeys: string[] | undefined;
	values: TDropdownOption[];
	setValues: (options: TDropdownOption[]) => void;
	inputRef: RefObject<HTMLInputElement>;
	classNameChip?: string;
	classNameChipClose?: string;
};

function listWithRemovedItem(
	selectedOptions: TDropdownOption[],
	optionToRemove: TDropdownOption,
	searchOptionKeys: string[] | undefined,
) {
	const optionToRemoveValue = getValueStringFromOption(optionToRemove, searchOptionKeys);
	return selectedOptions.reduce((coll, item) => {
		if (getValueStringFromOption(item, searchOptionKeys) === optionToRemoveValue) {
			return coll;
		}
		coll.push(item);
		return coll;
	}, [] as TDropdownOption[]);
}

export function Chip({
	selectedOption,
	searchOptionKeys,
	values,
	setValues,
	inputRef,
	classNameChip = "multi-selected-option",
	classNameChipClose = "multi-selected-option-close",
}: TChip) {
	const renderedOptionString = getLabelFromOption(selectedOption);
	return (
		<div className={classNameChip}>
			<span>{renderedOptionString}</span>
			<button
				type="button"
				className={classNameChipClose}
				onMouseUp={() => {
					setValues(listWithRemovedItem(values, selectedOption, searchOptionKeys));
					inputRef.current?.focus();
				}}
			>
				×
			</button>
		</div>
	);
}
