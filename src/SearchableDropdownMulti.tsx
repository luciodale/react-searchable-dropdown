import {
	FloatingPortal,
	autoUpdate,
	flip,
	offset,
	shift,
	size,
	useFloating,
} from "@floating-ui/react";
import { type ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react"; // Added useMemo
import { GroupedVirtuoso, Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import { Chip } from "./components/Chip";
import { ClearAllButton } from "./components/ClearAllButton";
import { DropdownIconDefault } from "./components/DropdownIconDefault";
import { DropdownOption } from "./components/DropdownOption";
import { DropdownOptionNoMatch } from "./components/DropdownOptionNoMatch";
import { NoOptionsProvided } from "./components/NoOptionsProvided";
import { BASE_CLASS } from "./constants";
import { useClickOutside } from "./hooks/useClickOutside";
import { useDebounce } from "./hooks/useDebounce";
import { useDropdownOptions } from "./hooks/useDropdownOptions";
import { useGroups } from "./hooks/useGroups";
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

export function SearchableDropdownMulti<T extends TDropdownOption, G>({
	options,
	placeholder,
	values,
	setValues,
	searchOptionKeys,
	disabled,
	filterType = "CONTAINS",
	debounceDelay = 0,
	searchQuery: searchQueryProp,
	onSearchQueryChange,
	groupContent = undefined,
	handleGroups = undefined,
	context,
	DropdownIcon,
	dropdownOptionsHeight = 300,
	dropdownOptionNoMatchLabel = "No Match",
	dropdownNoOptionsLabel = "No options provided",
	createNewOptionIfNoMatch = true,
	offset: offsetValue = 5,
	strategy = "absolute",
	deleteLastChipOnBackspace = false,
	classNameSearchableDropdownContainer = "lda-multi-dropdown-container",
	classNameSearchQueryInput = "lda-multi-search-query-input",
	classNameDropdownOptions = "lda-multi-dropdown-options",
	classNameDropdownOption = "lda-multi-dropdown-option",
	classNameDropdownOptionFocused = "lda-multi-dropdown-option-focused",
	classNameDropdownOptionLabel = "lda-multi-dropdown-option-label",
	classNameDropdownOptionLabelFocused = "lda-multi-dropdown-option-label-focused",
	classNameDropdownOptionDisabled = "lda-multi-dropdown-option-disabled",
	classNameDropdownOptionNoMatch = "lda-multi-dropdown-option-no-match",
	classNameTriggerIcon = "lda-multi-trigger-icon",
	classNameTriggerIconInvert = "lda-multi-trigger-icon-invert",
	classNameMultiSelectedOption = "lda-multi-chip",
	classNameMultiSelectedOptionClose = "lda-multi-chip-close",
	classNameClearAll = "lda-multi-clear-all",
	ClearAllIcon,
	onClearAll,
	onClearOption,
	classNameDisabled,
}: TSearchableDropdownMulti<T, G>) {
	const { refs, floatingStyles } = useFloating({
		placement: "bottom",
		strategy,
		whileElementsMounted: autoUpdate,
		middleware: [
			offset(offsetValue),
			flip(),
			shift(),
			size({
				apply({ rects, elements }) {
					Object.assign(elements.floating.style, {
						width: `${rects.reference.width}px`,
					});
				},
			}),
		],
	});

	const searchQueryinputRef = useRef<HTMLInputElement>(null);

	const virtuosoRef = useRef<VirtuosoHandle>(null);

	const [searchQueryInternal, setSearchQueryInternal] = useState<string | undefined>(
		getSearchQueryLabelFromOption(""),
	);

	const searchQuery = searchQueryProp ?? searchQueryInternal;
	const setSearchQuery = onSearchQueryChange ?? setSearchQueryInternal;

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
		[createNewOptionIfNoMatch, selectedValuesSet, searchOptionKeys],
	);

	const matchingOptions = useDropdownOptions(
		availableOptions,
		debouncedSearchQuery,
		searchOptionKeys,
		filterType,
		enhanceOptionsWithNewCreationCallback,
	);

	// Use the groups hook
	const { groupCounts, groupContentCallback, hasGroups } = useGroups(
		matchingOptions,
		// @ts-expect-error - matchingOptions arg is a union represented by TDropdownOption
		handleGroups,
		groupContent,
	);

	useResetSuppressMouseEnterOption(
		dropdownOptionNavigationIndex,
		suppressMouseEnterOptionListener,
		setSuppressMouseEnterOptionListener,
	);

	const handleOnChangeSearchQuery = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const newSearchQuery = e.target.value;
			setSearchQuery(newSearchQuery);
			setShowDropdownOptions(true);
			setDropdownOptionNavigationIndex(0);
			setSuppressMouseEnterOptionListener(false);
		},
		[setSearchQuery],
	);

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
			setSearchQuery,
		],
	);

	const onLeaveCallback = useCallback(() => {
		if (!showDropdownOptions) return;
		setShowDropdownOptions(false);
		setSuppressMouseEnterOptionListener(false);
		setSearchQuery("");
		setDropdownOptionNavigationIndex(0);
		setVirtuosoOptionsHeight(dropdownOptionsHeight);
	}, [dropdownOptionsHeight, setSearchQuery, showDropdownOptions]);

	// @ts-expect-error - refs from floating ui are typed as VirtualElement
	useClickOutside([refs.reference, refs.floating], onLeaveCallback);

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
		isMultiSelect: true,
		values,
		// @ts-expect-error - from generic to TDropdownOption
		setValues,
		deleteLastChipOnBackspace,
		// @ts-expect-error - from generic to TDropdownOption
		onClearOption,
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
					classNameDropdownOptionDisabled={classNameDropdownOptionDisabled}
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
			classNameDropdownOptionDisabled,
		],
	);

	const heightOfDropdownOptionsContainer =
		virtuosoOptionsHeight !== null
			? Math.min(virtuosoOptionsHeight, dropdownOptionsHeight)
			: dropdownOptionsHeight;

	const dropdownOptionNoMatchCallback = useCallback(
		() =>
			!matchingOptions.length && (
				<DropdownOptionNoMatch
					classNameDropdownOptionNoMatch={classNameDropdownOptionNoMatch}
					dropdownOptionNoMatchLabel={dropdownOptionNoMatchLabel}
				/>
			),
		[classNameDropdownOptionNoMatch, dropdownOptionNoMatchLabel, matchingOptions],
	);

	const adjustHeightOfSearchQueryInput = useMemo(() => {
		// if the dropdown is not shown and there are values selected, set the height to 0
		if (!showDropdownOptions && values && values?.length > 0) {
			return "0px";
		}
		return "inherit";
	}, [showDropdownOptions, values]);

	return (
		<div
			ref={refs.setReference}
			className={`${BASE_CLASS} ${classNameSearchableDropdownContainer} ${disabled ? classNameDisabled || "disabled" : ""}`}
			onKeyDown={handleKeyDown}
			onMouseUp={() => searchQueryinputRef.current?.focus()}
		>
			{values?.map((selectedOption) => (
				<Chip
					key={getValueStringFromOption(selectedOption, searchOptionKeys)}
					selectedOption={selectedOption}
					searchOptionKeys={searchOptionKeys}
					values={values}
					// @ts-expect-error - from generic to TDropdownOption
					setValues={setValues}
					// @ts-expect-error - from generic to TDropdownOption
					onClearOption={onClearOption}
					inputRef={searchQueryinputRef}
					classNameChip={classNameMultiSelectedOption}
					classNameChipClose={classNameMultiSelectedOptionClose}
				/>
			))}
			<input
				ref={searchQueryinputRef}
				type="text"
				style={{
					height: adjustHeightOfSearchQueryInput,
				}}
				readOnly={disabled}
				disabled={disabled}
				placeholder={values?.length ? "" : placeholder}
				className={`${classNameSearchQueryInput}`}
				value={searchQuery}
				onChange={handleOnChangeSearchQuery}
				data-testid={classNameSearchQueryInput}
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
					onClear={() => {
						setValues([]);
						onClearAll?.();
					}}
					inputRef={searchQueryinputRef}
					className={classNameClearAll}
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
				<FloatingPortal>
					<div
						ref={refs.setFloating}
						style={floatingStyles}
						className={`${BASE_CLASS} ${classNameDropdownOptions}`}
					>
						{options.length > 0 ? (
							hasGroups ? (
								<GroupedVirtuoso
									context={context}
									ref={virtuosoRef}
									style={{ height: `${heightOfDropdownOptionsContainer}px` }}
									groupCounts={groupCounts}
									groupContent={groupContentCallback}
									itemContent={DropdownOptionCallback}
									totalListHeightChanged={(height) => setVirtuosoOptionsHeight(height)}
									components={{
										Footer: dropdownOptionNoMatchCallback,
									}}
								/>
							) : (
								<Virtuoso
									context={context}
									ref={virtuosoRef}
									style={{ height: `${heightOfDropdownOptionsContainer}px` }}
									totalCount={matchingOptions.length}
									itemContent={DropdownOptionCallback}
									totalListHeightChanged={(height) => setVirtuosoOptionsHeight(height)}
									components={{
										Footer: dropdownOptionNoMatchCallback,
									}}
								/>
							)
						) : (
							<NoOptionsProvided
								classNameDropdownOptions={classNameDropdownOptions}
								classNameDropdownOption={classNameDropdownOption}
								dropdownNoOptionsLabel={dropdownNoOptionsLabel}
							/>
						)}
					</div>
				</FloatingPortal>
			)}
		</div>
	);
}
