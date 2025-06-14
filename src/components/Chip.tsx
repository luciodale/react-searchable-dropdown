import type { RefObject } from "react";
import { useCallback } from "react";
import type { TDropdownOption } from "../types";
import { getLabelFromOption, getValueStringFromOption } from "../utils";

type TChip<T extends TDropdownOption> = {
	selectedOption: T;
	searchOptionKeys: string[] | undefined;
	values: T[] | undefined;
	setValues: (value: T[]) => void;
	inputRef: RefObject<HTMLInputElement>;
	classNameChip?: string;
	classNameChipClose?: string;
	onClearOption?: (option: T) => void;
};

export function Chip<T extends TDropdownOption>({
	selectedOption,
	searchOptionKeys,
	values,
	setValues,
	inputRef,
	classNameChip = "multi-chip",
	classNameChipClose = "multi-chip-close",
	onClearOption,
}: TChip<T>) {
	const listWithRemovedItem = useCallback(
		(list: T[] | undefined, itemToRemove: T) => {
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
