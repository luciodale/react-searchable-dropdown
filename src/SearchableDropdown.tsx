import {
	FloatingPortal,
	autoUpdate,
	flip,
	offset,
	shift,
	size,
	useFloating,
} from "@floating-ui/react";
import { type ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { GroupedVirtuoso, Virtuoso, type VirtuosoHandle } from "react-virtuoso";
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
import type { TDropdownOption, TSearchableDropdown } from "./types";
import {
	getLabelFromOption,
	getSearchQueryLabelFromOption,
	getValueFromOption,
	getValueStringFromOption,
} from "./utils";

export function SearchableDropdown<T extends TDropdownOption, G>({
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
	searchQuery: searchQueryProp,
	onSearchQueryChange,
	dropdownOptionNoMatchLabel = "No Match",
	dropdownNoOptionsLabel = "No options provided",
	createNewOptionIfNoMatch = true,
	offset: offsetValue = 5,
	strategy = "absolute",

	groupContent = undefined,
	handleGroups = undefined,
	context,
	classNameSearchableDropdownContainer = "lda-dropdown-container",
	classNameSearchQueryInput = "lda-dropdown-search-query-input",
	classNameDropdownOptions = "lda-dropdown-options",
	classNameDropdownOption = "lda-dropdown-option",
	classNameDropdownOptionFocused = "lda-dropdown-option-focused",
	classNameDropdownOptionSelected = "lda-dropdown-option-selected",
	classNameDropdownOptionLabel = "lda-dropdown-option-label",
	classNameDropdownOptionLabelFocused = "lda-dropdown-option-label-focused",
	classNameDropdownOptionNoMatch = "lda-dropdown-option-no-match",
	classNameTriggerIcon = "lda-dropdown-trigger-icon",
	classNameTriggerIconInvert = "lda-dropdown-trigger-icon-invert",
	classNameDisabled,
}: TSearchableDropdown<T, G>) {
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

	const searchQueryinputRef = refs.reference as React.MutableRefObject<HTMLInputElement | null>;
	const virtuosoRef = useRef<VirtuosoHandle>(null);

	const [searchQueryInternal, setSearchQueryInternal] = useState<string | undefined>(
		getSearchQueryLabelFromOption(value || ""),
	);

	const searchQuery = searchQueryProp ?? searchQueryInternal;
	const setSearchQuery = onSearchQueryChange ?? setSearchQueryInternal;

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

	// Use the groups hook
	const { groupCounts, groupContentCallback, hasGroups } = useGroups(
		matchingOptions,
		// @ts-expect-error - matchingOptions arg is a union represented by TDropdownOption
		handleGroups,
		groupContent,
	);

	// to restore mouse option selection
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
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				setValue(getValueFromOption(option as any, searchOptionKeys));
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
		[
			setValue,
			searchOptionKeys,
			value,
			setDebouncedSearchQuery,
			dropdownOptionsHeight,
			setSearchQuery,
		],
	);

	const onLeaveCallback = useCallback(() => {
		if (!showDropdownOptions) return;
		setShowDropdownOptions(false);
		setSuppressMouseEnterOptionListener(false);
		setSearchQuery(getLabelFromOption(value || ""));
		setDropdownOptionNavigationIndex(0);
		setVirtuosoOptionsHeight(dropdownOptionsHeight);
	}, [value, dropdownOptionsHeight, setSearchQuery, showDropdownOptions]);

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
			!matchingOptions.length && (
				<DropdownOptionNoMatch
					classNameDropdownOptionNoMatch={classNameDropdownOptionNoMatch}
					dropdownOptionNoMatchLabel={dropdownOptionNoMatchLabel}
				/>
			),
		[classNameDropdownOptionNoMatch, dropdownOptionNoMatchLabel, matchingOptions],
	);

	return (
		<div
			className={`${BASE_CLASS} ${classNameSearchableDropdownContainer} ${disabled ? "disabled" : ""}`}
			onKeyDown={handleKeyDown}
		>
			<input
				ref={refs.setReference}
				type="text"
				readOnly={disabled}
				disabled={disabled}
				placeholder={getSearchQueryLabelFromOption(value || "") || placeholder}
				className={`${classNameSearchQueryInput} ${disabled ? (classNameDisabled ?? "") : ""}`}
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
