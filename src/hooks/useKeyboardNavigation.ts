import { type KeyboardEvent, useCallback } from "react";
import type { VirtuosoHandle } from "react-virtuoso";
import type { TDropdownOption } from "../types";

export function useKeyboardNavigation<T extends TDropdownOption>({
	virtuosoRef,
	searchQueryinputRef,
	matchingOptions,
	showDropdownOptions,
	setShowDropdownOptions,
	dropdownOptionNavigationIndex,
	setDropdownOptionNavigationIndex,
	handleOnSelectDropdownOption,
	setSuppressMouseEnterOptionListener,
	onLeaveCallback,
	isMultiSelect = false,
	values,
	setValues,
	deleteLastChipOnBackspace = false,
	onClearOption,
}: {
	virtuosoRef: React.RefObject<VirtuosoHandle>;
	searchQueryinputRef: React.RefObject<HTMLInputElement>;
	matchingOptions: T[];
	showDropdownOptions: boolean;
	setShowDropdownOptions: (show: boolean) => void;
	dropdownOptionNavigationIndex: number;
	setDropdownOptionNavigationIndex: (index: number) => void;
	handleOnSelectDropdownOption: (option: TDropdownOption) => void;
	setSuppressMouseEnterOptionListener: (suppress: boolean) => void;
	onLeaveCallback: () => void;
	isMultiSelect?: boolean;
	values?: TDropdownOption[];
	setValues?: (options: TDropdownOption[]) => void;
	deleteLastChipOnBackspace?: boolean;
	onClearOption?: (option: TDropdownOption) => void;
}) {
	const handleKeyDown = useCallback(
		(e: KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "ArrowDown") {
				e.preventDefault();
				setSuppressMouseEnterOptionListener(true);
				setShowDropdownOptions(true);
				const nextIndex =
					dropdownOptionNavigationIndex < matchingOptions.length - 1
						? dropdownOptionNavigationIndex + 1
						: dropdownOptionNavigationIndex;

				setDropdownOptionNavigationIndex(nextIndex);
				virtuosoRef.current?.scrollToIndex({
					index: nextIndex,
					align: "center",
					behavior: "auto",
				});
			} else if (e.key === "ArrowUp") {
				e.preventDefault();
				setSuppressMouseEnterOptionListener(true);
				const prevIndex =
					dropdownOptionNavigationIndex > 0
						? dropdownOptionNavigationIndex - 1
						: dropdownOptionNavigationIndex;
				setDropdownOptionNavigationIndex(prevIndex);
				virtuosoRef.current?.scrollToIndex({
					index: prevIndex,
					align: "center",
					behavior: "auto",
				});
			} else if (e.key === "Tab" || e.key === "Enter") {
				e.preventDefault();

				if (showDropdownOptions && dropdownOptionNavigationIndex >= 0 && matchingOptions.length) {
					handleOnSelectDropdownOption(matchingOptions[dropdownOptionNavigationIndex]);
					if (isMultiSelect) {
						searchQueryinputRef.current?.focus();
					} else {
						searchQueryinputRef.current?.blur();
					}
				}
			} else if (e.key === "Escape") {
				onLeaveCallback();
				searchQueryinputRef.current?.blur();
			} else if (e.key === "Backspace" && isMultiSelect && deleteLastChipOnBackspace) {
				// Check if search query is empty and there are values to delete
				const currentSearchQuery = searchQueryinputRef.current?.value || "";
				if (currentSearchQuery === "" && values && values.length > 0 && setValues) {
					e.preventDefault();
					const lastChip = values[values.length - 1];
					const newValues = values.slice(0, -1);
					setValues(newValues);
					onClearOption?.(lastChip);
				}
			}
		},
		[
			matchingOptions,
			dropdownOptionNavigationIndex,
			handleOnSelectDropdownOption,
			showDropdownOptions,
			searchQueryinputRef,
			setShowDropdownOptions,
			setDropdownOptionNavigationIndex,
			setSuppressMouseEnterOptionListener,
			onLeaveCallback,
			virtuosoRef,
			isMultiSelect,
			values,
			setValues,
			deleteLastChipOnBackspace,
			onClearOption,
		],
	);

	return { handleKeyDown };
}
