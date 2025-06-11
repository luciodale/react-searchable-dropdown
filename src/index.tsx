import { type ChangeEvent, useCallback, useRef, useState } from "react";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import { DropdownIconDefault } from "./components/DropdownIconDefault";
import { DropdownOption } from "./components/DropdownOption";
import { DropdownOptionNoMatch } from "./components/DropdownOptionNoMatch";
import { useDropdownOptions } from "./hooks/useDropdownOptions";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";
import { useOnLeaveCallback } from "./hooks/useOnLeaveCallback";
import { useOnMouseEnterOptionHandler } from "./hooks/useOnMouseEnterOptionHandler";
import { useResetSuppressMouseEnterOption } from "./hooks/useResetSuppressMouseEnterOption";
import type { TDropdownOption, TSearchableDropdown } from "./types";
import { getLabelFromOption, getSearchQueryLabelFromOption, getValueFromOption } from "./utils";

export function SearchableDropdown<T extends TDropdownOption>({
	options,
	placeholder,
	value,
	setValue,
	searchOptionKeys,
	disabled,
	filterType = "CONTAINS",
	DropdownIcon,
	dropdownOptionsHeight = 300,
	dropdownOptionNoMatchLabel = "No Match",
	createNewOptionIfNoMatch = true,
	classNameSearchableDropdownContainer,
	classNameSearchQueryInput,
	classNameDropdownOptions,
	classNameDropdownOption,
	classNameDropdownOptionFocused,
	classNameDropdownOptionLabel,
	classNameDropdownOptionLabelFocused,
	classNameDropdownOptionNoMatch,
}: TSearchableDropdown<T>) {
	const searchQueryinputRef = useRef<HTMLInputElement>(null);
	const dropdownOptionsContainerRef = useRef<HTMLDivElement>(null);
	const virtuosoRef = useRef<VirtuosoHandle>(null);

	const [searchQuery, setSearchQuery] = useState<string | undefined>(
		getSearchQueryLabelFromOption(value || ""),
	);

	const [showDropdownOptions, setShowDropdownOptions] = useState(false);
	const [dropdownOptionNavigationIndex, setDropdownOptionNavigationIndex] = useState(0);
	const [suppressMouseEnterOptionListener, setSuppressMouseEnterOptionListener] = useState(false);
	const [virtuosoOptionsHeight, setVirtuosoOptionsHeight] = useState<number | null>(null);

	const matchingOptions = useDropdownOptions(
		options,
		searchQuery,
		searchOptionKeys,
		filterType,
		createNewOptionIfNoMatch,
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
		virtuosoRef.current?.scrollToIndex({
			index: 0,
			align: "start",
			behavior: "auto",
		});
	}, []);

	const handleOnSelectDropdownOption = useCallback(
		(option: T | undefined) => {
			// option might be undefined when createNewOptionIfNoMatch is false
			if (option) {
				setValue(getValueFromOption(option, searchOptionKeys));
				setSearchQuery(getSearchQueryLabelFromOption(option));
				// when undefined we restore the value as searchQuery
			} else if (value) {
				setSearchQuery(getSearchQueryLabelFromOption(value));
				// if there was no value set we restore empty string - placeholder kicks in
			} else {
				setSearchQuery("");
			}
			setShowDropdownOptions(false);
			setDropdownOptionNavigationIndex(0);
			setVirtuosoOptionsHeight(dropdownOptionsHeight);
		},
		[setValue, searchOptionKeys, value, dropdownOptionsHeight],
	);

	const onLeaveCallback = useCallback(() => {
		setShowDropdownOptions(false);
		setSuppressMouseEnterOptionListener(false);
		setSearchQuery(getLabelFromOption(value || ""));
		setDropdownOptionNavigationIndex(0);
		setVirtuosoOptionsHeight(dropdownOptionsHeight);
	}, [value, dropdownOptionsHeight]);

	useOnLeaveCallback([searchQueryinputRef, dropdownOptionsContainerRef], onLeaveCallback);

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
				<DropdownOption<T>
					searchQuery={searchQuery}
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
			searchQuery,
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
		<div className={classNameSearchableDropdownContainer}>
			<input
				ref={searchQueryinputRef}
				type="text"
				readOnly={disabled}
				disabled={disabled}
				placeholder={getSearchQueryLabelFromOption(value || "") || placeholder}
				className={classNameSearchQueryInput}
				value={searchQuery}
				onChange={handleOnChangeSearchQuery}
				onKeyDown={handleKeyDown}
				onMouseUp={() => {
					if (!showDropdownOptions) {
						searchQueryinputRef.current?.focus();
					}
				}}
				onFocus={() => {
					setSearchQuery("");
					setShowDropdownOptions(true);
				}}
			/>

			{DropdownIcon ? (
				<DropdownIcon toggled={showDropdownOptions} />
			) : (
				<DropdownIconDefault
					className={`trigger-icon ${!showDropdownOptions ? "trigger-icon-invert" : ""}`}
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
