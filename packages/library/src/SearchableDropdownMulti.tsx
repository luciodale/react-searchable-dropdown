import { FloatingPortal } from "@floating-ui/react";
import { useCallback, useMemo, useRef } from "react";
import { GroupedVirtuoso, Virtuoso } from "react-virtuoso";
import { Chip } from "./components/Chip";
import { ClearAllButton } from "./components/ClearAllButton";
import { DropdownIconDefault } from "./components/DropdownIconDefault";
import { DropdownOption } from "./components/DropdownOption";
import { DropdownOptionNoMatch } from "./components/DropdownOptionNoMatch";
import { NoOptionsProvided } from "./components/NoOptionsProvided";
import { BASE_CLASS } from "./constants";
import { useClickOutside } from "./hooks/useClickOutside";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";
import { useSearchableDropdownCore } from "./hooks/useSearchableDropdownCore";
import type { TDropdownOption, TSearchableDropdownMultiProps } from "./types";
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
	searchOptionKeys: searchOptionKeysProp,
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
	inputId,
}: TSearchableDropdownMultiProps<T, G>) {
	// Default to ["label"] for object options so search works without explicit searchOptionKeys
	const searchOptionKeys =
		searchOptionKeysProp ??
		(options.length > 0 && typeof options[0] !== "string" ? (["label"] as string[]) : undefined);

	const searchQueryinputRef = useRef<HTMLInputElement | null>(null);

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

	// Filter out selected options before passing to core
	const availableOptions = useMemo(() => {
		return options.filter(
			(option) => !selectedValuesSet.has(getValueStringFromOption(option, searchOptionKeys)),
		);
	}, [options, selectedValuesSet, searchOptionKeys]);

	const enhanceOptionsWithNewCreation = useCallback(
		(matchingOptions: TDropdownOption[], currentSearchQuery: string) => {
			if (!createNewOptionIfNoMatch) return undefined;

			const searchQueryNormalized = currentSearchQuery.toLocaleLowerCase();
			let exactMatchFound = false;

			for (const matchedOption of matchingOptions) {
				if (getLabelFromOption(matchedOption).toLocaleLowerCase() === searchQueryNormalized) {
					exactMatchFound = true;
					break;
				}
			}

			const proposedNewValue = createValueFromSearchQuery(currentSearchQuery, searchOptionKeys);
			const proposedNewValueString = getValueStringFromOption(proposedNewValue, searchOptionKeys);
			const isAlreadySelected = selectedValuesSet.has(proposedNewValueString);

			if (!exactMatchFound && !isAlreadySelected) {
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

	const core = useSearchableDropdownCore({
		options: availableOptions,
		searchOptionKeys,
		initialSearchQuery: getSearchQueryLabelFromOption(""),
		searchQueryProp,
		onSearchQueryChange,
		filterType,
		debounceDelay,
		dropdownOptionsHeight,
		offsetValue,
		strategy,
		handleGroups,
		groupContent,
		context,
		enhanceOptionsWithNewCreation,
	});

	const handleOnSelectDropdownOption = useCallback(
		(option: TDropdownOption | undefined) => {
			const safeValues = values?.length ? values : [];
			if (option) {
				const newValue = getValueFromOption(option, searchOptionKeys);
				const newValueString = getValueStringFromOption(newValue, searchOptionKeys);

				if (!selectedValuesSet.has(newValueString)) {
					// getValueFromOption converts TNewValueDropdownOption → {label, value} at runtime.
					// TS can't verify this matches T because the "create new" injection widens the type.
					setValues([...safeValues, newValue as T]);
				}
				core.setSearchQuery("");
			} else if (values) {
				core.setSearchQuery("");
			} else {
				core.setSearchQuery("");
				core.setDebouncedSearchQuery("");
			}

			searchQueryinputRef.current?.focus();
			core.setDropdownOptionNavigationIndex(0);
		},
		[
			setValues,
			searchOptionKeys,
			values,
			core.setDebouncedSearchQuery,
			selectedValuesSet,
			core.setSearchQuery,
			core.setDropdownOptionNavigationIndex,
		],
	);

	const onLeaveCallback = useCallback(() => {
		if (!core.showDropdownOptions) return;
		core.setSuppressMouseEnterOptionListener(false);
		core.setSearchQuery("");
		core.resetDropdownState();
	}, [
		core.showDropdownOptions,
		core.setSearchQuery,
		core.setSuppressMouseEnterOptionListener,
		core.resetDropdownState,
	]);

	useClickOutside([core.refs.reference, core.refs.floating], onLeaveCallback);

	const { handleKeyDown } = useKeyboardNavigation({
		virtuosoRef: core.virtuosoRef,
		searchQueryinputRef,
		matchingOptions: core.matchingOptions,
		showDropdownOptions: core.showDropdownOptions,
		setShowDropdownOptions: core.setShowDropdownOptions,
		dropdownOptionNavigationIndex: core.dropdownOptionNavigationIndex,
		setDropdownOptionNavigationIndex: core.setDropdownOptionNavigationIndex,
		handleOnSelectDropdownOption,
		setSuppressMouseEnterOptionListener: core.setSuppressMouseEnterOptionListener,
		onLeaveCallback,
		isMultiSelect: true,
		values,
		setValues,
		deleteLastChipOnBackspace,
		onClearOption,
	});

	const dropdownOptionNoMatchCallback = useCallback(
		() =>
			!core.matchingOptions.length && (
				<DropdownOptionNoMatch
					classNameDropdownOptionNoMatch={classNameDropdownOptionNoMatch}
					dropdownOptionNoMatchLabel={dropdownOptionNoMatchLabel}
				/>
			),
		[classNameDropdownOptionNoMatch, dropdownOptionNoMatchLabel, core.matchingOptions],
	);

	const DropdownOptionCallback = useCallback(
		(currentOptionIndex: number) => (
			<DropdownOption
				optionId={core.getOptionId(currentOptionIndex)}
				searchQuery={core.debouncedSearchQuery}
				currentOption={core.matchingOptions[currentOptionIndex]}
				handleDropdownOptionSelect={handleOnSelectDropdownOption}
				currentOptionIndex={currentOptionIndex}
				dropdownOptionNavigationIndex={core.dropdownOptionNavigationIndex}
				highlightMatches={true}
				onMouseEnter={core.handleMouseEnterOptionCallback}
				classNameDropdownOption={classNameDropdownOption}
				classNameDropdownOptionFocused={classNameDropdownOptionFocused}
				classNameDropdownOptionLabel={classNameDropdownOptionLabel}
				classNameDropdownOptionLabelFocused={classNameDropdownOptionLabelFocused}
				classNameDropdownOptionDisabled={classNameDropdownOptionDisabled}
			/>
		),
		[
			core.getOptionId,
			core.matchingOptions,
			core.debouncedSearchQuery,
			core.dropdownOptionNavigationIndex,
			core.handleMouseEnterOptionCallback,
			handleOnSelectDropdownOption,
			classNameDropdownOption,
			classNameDropdownOptionFocused,
			classNameDropdownOptionLabel,
			classNameDropdownOptionLabelFocused,
			classNameDropdownOptionDisabled,
		],
	);

	const adjustHeightOfSearchQueryInput = useMemo(() => {
		if (!core.showDropdownOptions && values && values?.length > 0) {
			return "0px";
		}
		return "inherit";
	}, [core.showDropdownOptions, values]);

	return (
		<div
			ref={core.refs.setReference}
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
					setValues={setValues}
					onClearOption={onClearOption}
					inputRef={searchQueryinputRef}
					classNameChip={classNameMultiSelectedOption}
					classNameChipClose={classNameMultiSelectedOptionClose}
				/>
			))}
			<input
				ref={searchQueryinputRef}
				type="text"
				role="combobox"
				aria-expanded={core.showDropdownOptions}
				aria-controls={core.listboxId}
				aria-activedescendant={core.activeDescendantId}
				aria-autocomplete="list"
				aria-haspopup="listbox"
				aria-multiselectable
				style={{ height: adjustHeightOfSearchQueryInput }}
				readOnly={disabled}
				disabled={disabled}
				placeholder={values?.length ? "" : placeholder}
				className={classNameSearchQueryInput}
				value={core.searchQuery}
				onChange={core.handleOnChangeSearchQuery}
				data-testid={inputId ?? classNameSearchQueryInput}
				onMouseUp={() => {
					if (!core.showDropdownOptions) {
						searchQueryinputRef.current?.focus();
					}
				}}
				onFocus={() => {
					core.setSearchQuery("");
					core.setDebouncedSearchQuery("");
					core.setShowDropdownOptions(true);
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
					<DropdownIcon toggled={core.showDropdownOptions} />
				) : (
					<DropdownIconDefault
						className={`${classNameTriggerIcon} ${
							!core.showDropdownOptions ? classNameTriggerIconInvert : ""
						}`}
					/>
				))}

			{core.showDropdownOptions && (
				<FloatingPortal>
					{/* biome-ignore lint/a11y/useFocusableInteractive: focus managed via aria-activedescendant on the input */}
					<div
						ref={core.refs.setFloating}
						role="listbox"
						id={core.listboxId}
						aria-multiselectable
						style={{
							...core.floatingStyles,
							visibility: core.hasMeasuredHeight ? "visible" : "hidden",
						}}
						className={`${BASE_CLASS} ${classNameDropdownOptions}`}
					>
						{options.length > 0 ? (
							core.hasGroups ? (
								<GroupedVirtuoso
									context={context}
									ref={core.virtuosoRef}
									style={{ height: `${core.heightOfDropdownOptionsContainer}px` }}
									groupCounts={core.groupCounts}
									groupContent={core.groupContentCallback}
									itemContent={DropdownOptionCallback}
									totalListHeightChanged={core.handleTotalListHeightChanged}
									components={{ Footer: dropdownOptionNoMatchCallback }}
								/>
							) : (
								<Virtuoso
									context={context}
									ref={core.virtuosoRef}
									style={{ height: `${core.heightOfDropdownOptionsContainer}px` }}
									totalCount={core.matchingOptions.length}
									itemContent={DropdownOptionCallback}
									totalListHeightChanged={core.handleTotalListHeightChanged}
									components={{ Footer: dropdownOptionNoMatchCallback }}
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
