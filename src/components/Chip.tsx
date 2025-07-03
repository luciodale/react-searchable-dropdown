import type { RefObject } from "react";
import { useCallback } from "react";
import type { TDropdownOption } from "../types";
import { getLabelFromOption, getValueStringFromOption, sanitizeForTestId } from "../utils";

type TChip = {
	selectedOption: TDropdownOption;
	searchOptionKeys: string[] | undefined;
	values: TDropdownOption[] | undefined;
	setValues: (value: TDropdownOption[]) => void;
	inputRef: RefObject<HTMLInputElement | null>;
	classNameChip?: string;
	classNameChipClose?: string;
	onClearOption?: (option: TDropdownOption) => void;
};

export function Chip({
	selectedOption,
	searchOptionKeys,
	values,
	setValues,
	inputRef,
	classNameChip = "multi-chip",
	classNameChipClose = "multi-chip-close",
	onClearOption,
}: TChip) {
	const listWithRemovedItem = useCallback(
		(list: TDropdownOption[] | undefined, itemToRemove: TDropdownOption) => {
			if (!list) return [];
			return list.filter(
				(item) =>
					getValueStringFromOption(item, searchOptionKeys) !==
					getValueStringFromOption(itemToRemove, searchOptionKeys),
			);
		},
		[searchOptionKeys],
	);

	return (
		<div className={classNameChip}>
			{getLabelFromOption(selectedOption)}
			<button
				type="button"
				className={classNameChipClose}
				data-testid={`chip-remove-${sanitizeForTestId(getLabelFromOption(selectedOption))}`}
				onMouseUp={() => {
					setValues(listWithRemovedItem(values, selectedOption));
					onClearOption?.(selectedOption);
					inputRef.current?.focus();
				}}
			>
				×
			</button>
		</div>
	);
}
