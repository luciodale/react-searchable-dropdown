import { type ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react"; // Added useMemo
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import { Chip } from "./components/Chip";
import { ClearAllButton } from "./components/ClearAllButton";
import { DropdownIconDefault } from "./components/DropdownIconDefault";
import { DropdownOption } from "./components/DropdownOption";
import { DropdownOptionNoMatch } from "./components/DropdownOptionNoMatch";
import { useClickOutside } from "./hooks/useClickOutside";
import { useDebounce } from "./hooks/useDebounce";
import { useDropdownOptions } from "./hooks/useDropdownOptions";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";
import { useOnMouseEnterOptionHandler } from "./hooks/useOnMouseEnterOptionHandler";
import { useResetSuppressMouseEnterOption } from "./hooks/useResetSuppressMouseEnterOption";
import type { TDropdownOption, TSearchableDropdownMulti } from "./types";
import {
	createValueFromSearchQuery,
	getLabelFromOption,
	getSearchQueryLabelFromOption,
	getValueFromOption,
	getValueStringFromOption,
} from "./utils";

export function SearchableDropdownMulti<T extends TDropdownOption>({
	options,
	placeholder,
	values,
	setValues,
	searchOptionKeys,
	disabled,
	filterType = "CONTAINS",
	debounceDelay = 0,
	DropdownIcon,
	dropdownOptionsHeight = 300,
	dropdownOptionNoMatchLabel = "No Match",
	createNewOptionIfNoMatch = true,
	classNameSearchableDropdownContainer = "multi-searchable-dropdown-container",
	classNameSearchQueryInput = "multi-search-query-input",
	classNameDropdownOptions = "multi-dropdown-options",
	classNameDropdownOption = "multi-dropdown-option",
	classNameDropdownOptionFocused = "multi-dropdown-option-focused",
	classNameDropdownOptionLabel = "multi-dropdown-option-label",
	classNameDropdownOptionLabelFocused = "multi-dropdown-option-label-focused",
	classNameDropdownOptionNoMatch = "multi-dropdown-option-no-match",
	classNameTriggerIcon = "multi-trigger-icon",
	classNameTriggerIconInvert = "multi-trigger-icon-invert",
	classNameMultiSelectedOption = "multi-chip",
	classNameMultiSelectedOptionClose = "multi-chip-close",
	ClearAllIcon,
}: TSearchableDropdownMulti<T>) {
	const searchQueryinputRef = useRef<HTMLInputElement>(null);
	const dropdownOptionsContainerRef = useRef<HTMLDivElement>(null);
	const virtuosoRef = useRef<VirtuosoHandle>(null);

	const [searchQuery, setSearchQuery] = useState<string | undefined>(
		getSearchQueryLabelFromOption(""),
	);

	const [debouncedSearchQuery, setDebouncedSearchQuery] = useDebounce(searchQuery, debounceDelay);

	const [showDropdownOptions, setShowDropdownOptions] = useState(false);
	const [dropdownOptionNavigationIndex, setDropdownOptionNavigationIndex] = useState(0);
	const [suppressMouseEnterOptionListener, setSuppressMouseEnterOptionListener] = useState(false);
	const [virtuosoOptionsHeight, setVirtuosoOptionsHeight] = useState<number | null>(null);

	// Create a Set of selected values for O(1) average time lookups
	const selectedValuesSet = useMemo(() => {
		const set = new Set<string>();
		if (values) {
			for (const val of values) {
				set.add(getValueStringFromOption(val, searchOptionKeys));
			}
		}
		return set;
	}, [values, searchOptionKeys]);

	// Filter out selected options from the main options array BEFORE passing to useDropdownOptions
	const availableOptions = useMemo(() => {
		return options.filter(
			(option) => !selectedValuesSet.has(getValueStringFromOption(option, searchOptionKeys)),
		);
	}, [options, selectedValuesSet, searchOptionKeys]);

	// The enhanceOptionsWithNewCreation callback for multi-select
	const enhanceOptionsWithNewCreationCallback = useCallback(
		(matchingOptions: TDropdownOption[], currentSearchQuery: string) => {
			if (!createNewOptionIfNoMatch) {
				return undefined;
			}

			const searchQueryNormalized = currentSearchQuery.toLocaleLowerCase();
			let exactMatchFoundInAvailableOptions = false;

			// Check for exact match in the currently available (non-selected, matched) options
			for (const matchedOption of matchingOptions) {
				if (getLabelFromOption(matchedOption).toLocaleLowerCase() === searchQueryNormalized) {
					exactMatchFoundInAvailableOptions = true;
					break;
				}
			}

			// Also check if the search query would result in a value already selected
			const proposedNewValue = createValueFromSearchQuery(currentSearchQuery, searchOptionKeys);
			const proposedNewValueString = getValueStringFromOption(proposedNewValue, searchOptionKeys);
			const isAlreadySelected = selectedValuesSet.has(proposedNewValueString);

			if (!exactMatchFoundInAvailableOptions && !isAlreadySelected) {
				return {
					label: `Create New: ${currentSearchQuery}`,
					value: currentSearchQuery,
					isNewValue: true as const,
				};
			}
			return undefined;
		},
		[createNewOptionIfNoMatch, selectedValuesSet, searchOptionKeys], // Add selectedValuesSet and searchOptionKeys to dependencies
	);

	const matchingOptions = useDropdownOptions(
		availableOptions, // Pass the pre-filtered available options
		debouncedSearchQuery,
		searchOptionKeys,
		filterType,
		enhanceOptionsWithNewCreationCallback, // Use the new multi-select specific callback
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
			const safeValues = values?.length ? values : [];
			// option might be undefined when createNewOptionIfNoMatch is false
			if (option) {
				// Ensure the option isn't already selected before adding it
				const newValue = getValueFromOption(option, searchOptionKeys);
				const newValueString = getValueStringFromOption(newValue, searchOptionKeys);

				if (!selectedValuesSet.has(newValueString)) {
					// Use selectedValuesSet for quick check
					// @ts-expect-error - the union type messes up the type inference
					setValues([...safeValues, newValue]);
				}
				setSearchQuery("");
				// when undefined we restore searchQuery as empty
			} else if (values) {
				setSearchQuery("");
				// if there was no value set we restore empty string - placeholder kicks in
			} else {
				setSearchQuery("");
				setDebouncedSearchQuery("");
			}

			searchQueryinputRef.current?.focus();
			setDropdownOptionNavigationIndex(0);
			setVirtuosoOptionsHeight(dropdownOptionsHeight);
		},
		[
			setValues,
			searchOptionKeys,
			values,
			setDebouncedSearchQuery,
			dropdownOptionsHeight,
			selectedValuesSet,
		], // Add selectedValuesSet to dependencies
	);

	const onLeaveCallback = useCallback(() => {
		setShowDropdownOptions(false);
		setSuppressMouseEnterOptionListener(false);
		setSearchQuery("");
		setDropdownOptionNavigationIndex(0);
		setVirtuosoOptionsHeight(dropdownOptionsHeight);
	}, [dropdownOptionsHeight]);

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

	const DropdownOptionCallback = useCallback(
		(currentOptionIndex: number) => {
			return (
				<DropdownOption
					searchQuery={debouncedSearchQuery}
					currentOption={matchingOptions[currentOptionIndex]}
					handleDropdownOptionSelect={handleOnSelectDropdownOption}
					currentOptionIndex={currentOptionIndex}
					dropdownOptionNavigationIndex={dropdownOptionNavigationIndex}
					highlightMatches={true}
					onMouseEnter={handleMouseEnterOptionCallback}
					classNameDropdownOption={classNameDropdownOption}
					classNameDropdownOptionFocused={classNameDropdownOptionFocused}
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
			classNameDropdownOption,
			classNameDropdownOptionFocused,
			classNameDropdownOptionLabel,
			classNameDropdownOptionLabelFocused,
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
			className={`searchable-dropdown ${classNameSearchableDropdownContainer}`}
			onKeyDown={handleKeyDown}
			onMouseUp={() => searchQueryinputRef.current?.focus()}
		>
			{values?.map((selectedOption) => (
				<Chip
					key={getValueStringFromOption(selectedOption, searchOptionKeys)}
					selectedOption={selectedOption}
					searchOptionKeys={searchOptionKeys}
					values={values}
					// @ts-expect-error - the union type messes up the type inference
					setValues={setValues}
					inputRef={searchQueryinputRef}
					classNameChip={classNameMultiSelectedOption}
					classNameChipClose={classNameMultiSelectedOptionClose}
				/>
			))}
			<input
				ref={searchQueryinputRef}
				type="text"
				readOnly={disabled}
				disabled={disabled}
				placeholder={values?.length ? "" : placeholder}
				className={`${classNameSearchQueryInput}`}
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
			{values && values.length > 0 && (
				<ClearAllButton
					onClear={() => setValues([])}
					inputRef={searchQueryinputRef}
					className="multi-clear-all"
					Icon={ClearAllIcon}
				/>
			)}
			{(!values || values.length === 0) &&
				(DropdownIcon ? (
					<DropdownIcon toggled={showDropdownOptions} />
				) : (
					<DropdownIconDefault
						className={`${classNameTriggerIcon} ${
							!showDropdownOptions ? classNameTriggerIconInvert : ""
						}`}
					/>
				))}

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
