import { type ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import { DropdownIconDefault } from "./components/DropdownIconDefault";
import { DropdownOption } from "./components/DropdownOption";
import { DropdownOptionNoMatch } from "./components/DropdownOptionNoMatch";
import { useClickOutside } from "./hooks/useClickOutside";
import { useDebounce } from "./hooks/useDebounce";
import { useDropdownOptions } from "./hooks/useDropdownOptions";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";
import { useOnMouseEnterOptionHandler } from "./hooks/useOnMouseEnterOptionHandler";
import { useResetSuppressMouseEnterOption } from "./hooks/useResetSuppressMouseEnterOption";
import type { TDropdownOption, TSearchableDropdown } from "./types";
import {
	getLabelFromOption,
	getSearchQueryLabelFromOption,
	getValueFromOption,
	getValueStringFromOption,
} from "./utils";

export function SearchableDropdown<T extends TDropdownOption>({
	options,
	placeholder,
	value,
	setValue,
	searchOptionKeys,
	disabled,
	filterType = "CONTAINS",
	debounceDelay = 0,
	DropdownIcon,
	dropdownOptionsHeight = 300,
	dropdownOptionNoMatchLabel = "No Match",
	createNewOptionIfNoMatch = true,
	classNameSearchableDropdownContainer = "searchable-dropdown-container",
	classNameSearchQueryInput = "search-query-input",
	classNameDropdownOptions = "dropdown-options",
	classNameDropdownOption = "dropdown-option",
	classNameDropdownOptionFocused = "dropdown-option-focused",
	classNameDropdownOptionSelected = "dropdown-option-selected",
	classNameDropdownOptionLabel = "dropdown-option-label",
	classNameDropdownOptionLabelFocused = "dropdown-option-label-focused",
	classNameDropdownOptionNoMatch = "dropdown-option-no-match",
	classNameTriggerIcon = "trigger-icon",
	classNameTriggerIconInvert = "trigger-icon-invert",
	classNameDisabled,
}: TSearchableDropdown<T>) {
	const searchQueryinputRef = useRef<HTMLInputElement>(null);
	const dropdownOptionsContainerRef = useRef<HTMLDivElement>(null);
	const virtuosoRef = useRef<VirtuosoHandle>(null);

	const [searchQuery, setSearchQuery] = useState<string | undefined>(
		getSearchQueryLabelFromOption(value || ""),
	);

	const [debouncedSearchQuery, setDebouncedSearchQuery] = useDebounce(searchQuery, debounceDelay);

	const [showDropdownOptions, setShowDropdownOptions] = useState(false);
	const [dropdownOptionNavigationIndex, setDropdownOptionNavigationIndex] = useState(0);
	const [suppressMouseEnterOptionListener, setSuppressMouseEnterOptionListener] = useState(false);
	const [virtuosoOptionsHeight, setVirtuosoOptionsHeight] = useState<number | null>(null);

	const enhanceOptionsWithNewCreationCallback = useCallback(
		(matchingOptions: TDropdownOption[], currentSearchQuery: string) => {
			if (!createNewOptionIfNoMatch) {
				return undefined;
			}

			const searchQueryNormalized = currentSearchQuery.toLocaleLowerCase();
			const exactMatchFound = matchingOptions.some(
				(option) => getLabelFromOption(option).toLocaleLowerCase() === searchQueryNormalized,
			);

			if (!exactMatchFound) {
				return {
					label: `Create New: ${currentSearchQuery}`,
					value: currentSearchQuery,
					isNewValue: true as const,
				};
			}
			return undefined;
		},
		[createNewOptionIfNoMatch],
	);

	const matchingOptions = useDropdownOptions(
		options,
		debouncedSearchQuery,
		searchOptionKeys,
		filterType,
		enhanceOptionsWithNewCreationCallback, // Use the new single-select specific callback
	);

	// to restore mouse option selection
	useResetSuppressMouseEnterOption(
		dropdownOptionNavigationIndex,
		suppressMouseEnterOptionListener,
		setSuppressMouseEnterOptionListener,
	);

	const handleOnChangeSearchQuery = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		const newSearchQuery = e.target.value;
		setSearchQuery(newSearchQuery);
		setShowDropdownOptions(true);
		setDropdownOptionNavigationIndex(0);
		setSuppressMouseEnterOptionListener(false);
	}, []);

	// Scroll back to top when search query changes
	useEffect(() => {
		if (debouncedSearchQuery !== searchQuery) return;

		virtuosoRef.current?.scrollToIndex({
			index: 0,
			align: "start",
			behavior: "auto",
		});
	}, [debouncedSearchQuery, searchQuery]);

	const handleOnSelectDropdownOption = useCallback(
		(option: TDropdownOption | undefined) => {
			// option might be undefined when createNewOptionIfNoMatch is false
			if (option) {
				// @ts-expect-error - the union type messes up the type inference
				setValue(getValueFromOption(option, searchOptionKeys));
				setSearchQuery(getSearchQueryLabelFromOption(option));
				// when undefined we restore the value as searchQuery
			} else if (value) {
				setSearchQuery(getSearchQueryLabelFromOption(value));
				// if there was no value set we restore empty string - placeholder kicks in
			} else {
				setSearchQuery("");
				setDebouncedSearchQuery("");
			}
			setShowDropdownOptions(false);
			setDropdownOptionNavigationIndex(0);
			setVirtuosoOptionsHeight(dropdownOptionsHeight);
		},
		[setValue, searchOptionKeys, value, setDebouncedSearchQuery, dropdownOptionsHeight],
	);

	const onLeaveCallback = useCallback(() => {
		setShowDropdownOptions(false);
		setSuppressMouseEnterOptionListener(false);
		setSearchQuery(getLabelFromOption(value || ""));
		setDropdownOptionNavigationIndex(0);
		setVirtuosoOptionsHeight(dropdownOptionsHeight);
	}, [value, dropdownOptionsHeight]);

	const containerRef = useClickOutside(onLeaveCallback);

	const { handleKeyDown } = useKeyboardNavigation({
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
	});

	const handleMouseEnterOptionCallback = useOnMouseEnterOptionHandler(
		suppressMouseEnterOptionListener,
		setDropdownOptionNavigationIndex,
	);

	const currentOptionIsSelectedCallback = useCallback(
		(option: TDropdownOption) => {
			if (!value) return false;
			return (
				getValueStringFromOption(option, searchOptionKeys) ===
				getValueStringFromOption(value, searchOptionKeys)
			);
		},
		[searchOptionKeys, value],
	);

	const DropdownOptionCallback = useCallback(
		(currentOptionIndex: number) => {
			return (
				<DropdownOption
					searchQuery={debouncedSearchQuery}
					currentOption={matchingOptions[currentOptionIndex]}
					currentOptionIsSelected={currentOptionIsSelectedCallback}
					handleDropdownOptionSelect={handleOnSelectDropdownOption}
					currentOptionIndex={currentOptionIndex}
					dropdownOptionNavigationIndex={dropdownOptionNavigationIndex}
					highlightMatches={true}
					onMouseEnter={handleMouseEnterOptionCallback}
					classNameDropdownOption={classNameDropdownOption}
					classNameDropdownOptionFocused={classNameDropdownOptionFocused}
					classNameDropdownOptionSelected={classNameDropdownOptionSelected}
					classNameDropdownOptionLabel={classNameDropdownOptionLabel}
					classNameDropdownOptionLabelFocused={classNameDropdownOptionLabelFocused}
				/>
			);
		},
		[
			matchingOptions,
			debouncedSearchQuery,
			dropdownOptionNavigationIndex,
			handleOnSelectDropdownOption,
			handleMouseEnterOptionCallback,
			currentOptionIsSelectedCallback,
			classNameDropdownOption,
			classNameDropdownOptionFocused,
			classNameDropdownOptionLabel,
			classNameDropdownOptionLabelFocused,
			classNameDropdownOptionSelected,
		],
	);

	const heightOfDropdownOptionsContainer =
		virtuosoOptionsHeight !== null
			? Math.min(virtuosoOptionsHeight, dropdownOptionsHeight)
			: dropdownOptionsHeight;

	const dropdownOptionNoMatchCallback = useCallback(
		() =>
			!createNewOptionIfNoMatch &&
			!matchingOptions.length && (
				<DropdownOptionNoMatch
					classNameDropdownOptionNoMatch={classNameDropdownOptionNoMatch}
					dropdownOptionNoMatchLabel={dropdownOptionNoMatchLabel}
				/>
			),
		[
			classNameDropdownOptionNoMatch,
			dropdownOptionNoMatchLabel,
			createNewOptionIfNoMatch,
			matchingOptions,
		],
	);

	return (
		<div
			ref={containerRef}
			className={`searchable-dropdown ${classNameSearchableDropdownContainer} ${disabled ? "disabled" : ""}`}
			onKeyDown={handleKeyDown}
		>
			<input
				ref={searchQueryinputRef}
				type="text"
				readOnly={disabled}
				disabled={disabled}
				placeholder={getSearchQueryLabelFromOption(value || "") || placeholder}
				className={classNameSearchQueryInput}
				value={searchQuery}
				onChange={handleOnChangeSearchQuery}
				onMouseUp={() => {
					if (!showDropdownOptions) {
						searchQueryinputRef.current?.focus();
					}
				}}
				onFocus={() => {
					setSearchQuery("");
					setDebouncedSearchQuery("");
					setShowDropdownOptions(true);
				}}
			/>

			{DropdownIcon ? (
				<DropdownIcon toggled={showDropdownOptions} />
			) : (
				<DropdownIconDefault
					className={`${classNameTriggerIcon} ${
						!showDropdownOptions ? classNameTriggerIconInvert : ""
					}`}
				/>
			)}

			{showDropdownOptions && (
				<div ref={dropdownOptionsContainerRef} className={classNameDropdownOptions}>
					<Virtuoso
						ref={virtuosoRef}
						style={{ height: `${heightOfDropdownOptionsContainer}px` }}
						totalCount={matchingOptions.length}
						itemContent={DropdownOptionCallback}
						totalListHeightChanged={(height) => setVirtuosoOptionsHeight(height)}
						components={{
							Footer: dropdownOptionNoMatchCallback,
						}}
					/>
				</div>
			)}
		</div>
	);
}
