import { type KeyboardEvent, useCallback } from "react";
import type { VirtuosoHandle } from "react-virtuoso";
import type { TDropdownOption } from "../types";

type UseKeyboardNavigationBaseParams = {
	virtuosoRef: React.RefObject<VirtuosoHandle | null>;
	searchQueryinputRef: React.RefObject<HTMLInputElement | null>;
	matchingOptions: TDropdownOption[];
	showDropdownOptions: boolean;
	setShowDropdownOptions: (show: boolean) => void;
	dropdownOptionNavigationIndex: number;
	setDropdownOptionNavigationIndex: (index: number) => void;
	handleOnSelectDropdownOption: (option: TDropdownOption) => void;
	setSuppressMouseEnterOptionListener: (suppress: boolean) => void;
	onLeaveCallback: () => void;
};

type UseKeyboardNavigationSingleParams = UseKeyboardNavigationBaseParams & {
	isMultiSelect?: false;
	values?: undefined;
	setValues?: undefined;
	deleteLastChipOnBackspace?: undefined;
	onClearOption?: undefined;
};

type UseKeyboardNavigationMultiParams<T extends TDropdownOption> =
	UseKeyboardNavigationBaseParams & {
		isMultiSelect: true;
		values: T[] | undefined;
		setValues: (options: T[]) => void;
		deleteLastChipOnBackspace?: boolean;
		onClearOption?: (option: T) => void;
	};

export function useKeyboardNavigation<T extends TDropdownOption>(
	params: UseKeyboardNavigationSingleParams | UseKeyboardNavigationMultiParams<T>,
) {
	const {
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
	} = params;

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
					if (params.isMultiSelect) {
						searchQueryinputRef.current?.focus();
					} else {
						searchQueryinputRef.current?.blur();
					}
				}
			} else if (e.key === "Escape") {
				onLeaveCallback();
				searchQueryinputRef.current?.blur();
			} else if (
				e.key === "Backspace" &&
				params.isMultiSelect &&
				params.deleteLastChipOnBackspace
			) {
				const currentSearchQuery = searchQueryinputRef.current?.value || "";
				if (currentSearchQuery === "" && params.values && params.values.length > 0) {
					e.preventDefault();
					const lastChip = params.values[params.values.length - 1];
					const newValues = params.values.slice(0, -1);
					params.setValues(newValues);
					params.onClearOption?.(lastChip);
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
			params,
		],
	);

	return { handleKeyDown };
}
