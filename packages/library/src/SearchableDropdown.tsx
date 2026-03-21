import { FloatingPortal } from "@floating-ui/react";
import { useCallback } from "react";
import { GroupedVirtuoso, Virtuoso } from "react-virtuoso";
import { DropdownIconDefault } from "./components/DropdownIconDefault";
import { DropdownOption } from "./components/DropdownOption";
import { DropdownOptionNoMatch } from "./components/DropdownOptionNoMatch";
import { NoOptionsProvided } from "./components/NoOptionsProvided";
import { BASE_CLASS } from "./constants";
import { useClickOutside } from "./hooks/useClickOutside";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";
import { useSearchableDropdownCore } from "./hooks/useSearchableDropdownCore";
import type { TDropdownOption, TSearchableDropdownProps } from "./types";
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
	searchOptionKeys: searchOptionKeysProp,
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
	classNameDropdownOptionDisabled = "lda-dropdown-option-disabled",
	classNameDropdownOptionLabel = "lda-dropdown-option-label",
	classNameDropdownOptionLabelFocused = "lda-dropdown-option-label-focused",
	classNameDropdownOptionNoMatch = "lda-dropdown-option-no-match",
	classNameTriggerIcon = "lda-dropdown-trigger-icon",
	classNameTriggerIconInvert = "lda-dropdown-trigger-icon-invert",
	classNameDisabled,
	inputId,
}: TSearchableDropdownProps<T, G>) {
	// Default to ["label"] for object options so search works without explicit searchOptionKeys
	const searchOptionKeys =
		searchOptionKeysProp ??
		(options.length > 0 && typeof options[0] !== "string" ? (["label"] as string[]) : undefined);

	const enhanceOptionsWithNewCreation = useCallback(
		(matchingOptions: TDropdownOption[], currentSearchQuery: string) => {
			if (!createNewOptionIfNoMatch) return undefined;

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

	const core = useSearchableDropdownCore({
		options,
		searchOptionKeys,
		initialSearchQuery: getSearchQueryLabelFromOption(value || ""),
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

	const searchQueryinputRef = core.refs
		.reference as React.MutableRefObject<HTMLInputElement | null>;

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

	const handleOnSelectDropdownOption = useCallback(
		(option: TDropdownOption | undefined) => {
			if (option) {
				// getValueFromOption converts TNewValueDropdownOption → {label, value} at runtime.
				// TS can't verify this matches T because the "create new" injection widens the type.
				setValue(getValueFromOption(option, searchOptionKeys) as T);
				core.setSearchQuery(getSearchQueryLabelFromOption(option));
			} else if (value) {
				core.setSearchQuery(getSearchQueryLabelFromOption(value));
			} else {
				core.setSearchQuery("");
				core.setDebouncedSearchQuery("");
			}
			core.resetDropdownState();
		},
		[
			setValue,
			searchOptionKeys,
			value,
			core.setDebouncedSearchQuery,
			core.setSearchQuery,
			core.resetDropdownState,
		],
	);

	const onLeaveCallback = useCallback(() => {
		if (!core.showDropdownOptions) return;
		core.setSuppressMouseEnterOptionListener(false);
		core.setSearchQuery(getLabelFromOption(value || ""));
		core.resetDropdownState();
	}, [
		value,
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
				currentOptionIsSelected={currentOptionIsSelectedCallback}
				handleDropdownOptionSelect={handleOnSelectDropdownOption}
				currentOptionIndex={currentOptionIndex}
				dropdownOptionNavigationIndex={core.dropdownOptionNavigationIndex}
				highlightMatches={true}
				onMouseEnter={core.handleMouseEnterOptionCallback}
				classNameDropdownOption={classNameDropdownOption}
				classNameDropdownOptionFocused={classNameDropdownOptionFocused}
				classNameDropdownOptionSelected={classNameDropdownOptionSelected}
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
			currentOptionIsSelectedCallback,
			classNameDropdownOption,
			classNameDropdownOptionFocused,
			classNameDropdownOptionLabel,
			classNameDropdownOptionLabelFocused,
			classNameDropdownOptionSelected,
			classNameDropdownOptionDisabled,
		],
	);

	return (
		<div
			className={`${BASE_CLASS} ${classNameSearchableDropdownContainer} ${disabled ? "disabled" : ""}`}
			onKeyDown={handleKeyDown}
		>
			<input
				ref={core.refs.setReference}
				type="text"
				role="combobox"
				aria-expanded={core.showDropdownOptions}
				aria-controls={core.listboxId}
				aria-activedescendant={core.activeDescendantId}
				aria-autocomplete="list"
				aria-haspopup="listbox"
				readOnly={disabled}
				disabled={disabled}
				placeholder={getSearchQueryLabelFromOption(value || "") || placeholder}
				className={`${classNameSearchQueryInput} ${disabled ? (classNameDisabled ?? "") : ""}`}
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

			{DropdownIcon ? (
				<DropdownIcon toggled={core.showDropdownOptions} />
			) : (
				<DropdownIconDefault
					className={`${classNameTriggerIcon} ${
						!core.showDropdownOptions ? classNameTriggerIconInvert : ""
					}`}
				/>
			)}

			{core.showDropdownOptions && (
				<FloatingPortal>
					{/* biome-ignore lint/a11y/useFocusableInteractive: focus managed via aria-activedescendant on the input */}
					<div
						ref={core.refs.setFloating}
						role="listbox"
						id={core.listboxId}
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
