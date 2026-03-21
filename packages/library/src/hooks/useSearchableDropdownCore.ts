import { autoUpdate, flip, offset, shift, size, useFloating } from "@floating-ui/react";
import { type ChangeEvent, useCallback, useEffect, useId, useRef, useState } from "react";
import type { VirtuosoHandle } from "react-virtuoso";
import type {
	TDropdownOption,
	TNewValueDropdownOption,
	TSearchableDropdownFilterType,
} from "../types";
import { useDebounce } from "./useDebounce";
import { useDropdownOptions } from "./useDropdownOptions";
import { useGroups } from "./useGroups";
import { useOnMouseEnterOptionHandler } from "./useOnMouseEnterOptionHandler";
import { useResetSuppressMouseEnterOption } from "./useResetSuppressMouseEnterOption";

type UseSearchableDropdownCoreParams<T extends TDropdownOption, G> = {
	options: T[];
	searchOptionKeys: string[] | undefined;
	initialSearchQuery: string;
	searchQueryProp: string | undefined;
	onSearchQueryChange: ((query: string | undefined) => void) | undefined;
	filterType: TSearchableDropdownFilterType;
	debounceDelay: number;
	dropdownOptionsHeight: number;
	offsetValue: number;
	strategy: "absolute" | "fixed";
	handleGroups:
		| ((matchingOptions: T[]) => { groupCounts: number[]; groupCategories: string[] })
		| undefined;
	groupContent:
		| ((index: number, groupCategories: string[], context: G) => React.ReactNode)
		| undefined;
	context: G | undefined;
	enhanceOptionsWithNewCreation: (
		matchingOptions: T[],
		searchQuery: string,
	) => TNewValueDropdownOption | undefined;
};

export function useSearchableDropdownCore<T extends TDropdownOption, G>({
	options,
	searchOptionKeys,
	initialSearchQuery,
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
}: UseSearchableDropdownCoreParams<T, G>) {
	const listboxId = useId();

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

	const virtuosoRef = useRef<VirtuosoHandle>(null);

	const [searchQueryInternal, setSearchQueryInternal] = useState<string | undefined>(
		initialSearchQuery,
	);

	const searchQuery = searchQueryProp ?? searchQueryInternal;
	const setSearchQuery = onSearchQueryChange ?? setSearchQueryInternal;

	const [debouncedSearchQuery, setDebouncedSearchQuery] = useDebounce(searchQuery, debounceDelay);

	const [showDropdownOptions, setShowDropdownOptions] = useState(false);
	const [dropdownOptionNavigationIndex, setDropdownOptionNavigationIndex] = useState(0);
	const [suppressMouseEnterOptionListener, setSuppressMouseEnterOptionListener] = useState(false);
	const [virtuosoOptionsHeight, setVirtuosoOptionsHeight] = useState<number | null>(null);
	const [hasMeasuredHeight, setHasMeasuredHeight] = useState(false);

	const matchingOptions = useDropdownOptions(
		options,
		debouncedSearchQuery,
		searchOptionKeys,
		filterType,
		enhanceOptionsWithNewCreation,
	);

	// useGroups accepts TDropdownOption[] but handleGroups is typed as (T[]) => ...
	// Safe: matchingOptions items are always T (plus possibly TNewValueDropdownOption).
	// The user's callback only reads properties, so the wider type works at runtime.
	const { groupCounts, groupContentCallback, hasGroups } = useGroups(
		matchingOptions,
		handleGroups as
			| ((matchingOptions: TDropdownOption[]) => {
					groupCounts: number[];
					groupCategories: string[];
			  })
			| undefined,
		groupContent,
	);

	useResetSuppressMouseEnterOption(
		dropdownOptionNavigationIndex,
		suppressMouseEnterOptionListener,
		setSuppressMouseEnterOptionListener,
	);

	const handleOnChangeSearchQuery = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			setSearchQuery(e.target.value);
			setShowDropdownOptions(true);
			setDropdownOptionNavigationIndex(0);
			setSuppressMouseEnterOptionListener(false);
		},
		[setSearchQuery],
	);

	// Scroll back to top when search query changes
	useEffect(() => {
		if (debouncedSearchQuery !== searchQuery) return;
		virtuosoRef.current?.scrollToIndex({ index: 0, align: "start", behavior: "auto" });
	}, [debouncedSearchQuery, searchQuery]);

	const handleMouseEnterOptionCallback = useOnMouseEnterOptionHandler(
		suppressMouseEnterOptionListener,
		setDropdownOptionNavigationIndex,
	);

	const handleTotalListHeightChanged = useCallback((height: number) => {
		setVirtuosoOptionsHeight(height);
		setHasMeasuredHeight(true);
	}, []);

	const heightOfDropdownOptionsContainer =
		virtuosoOptionsHeight !== null
			? Math.min(virtuosoOptionsHeight, dropdownOptionsHeight)
			: dropdownOptionsHeight;

	const resetDropdownState = useCallback(() => {
		setShowDropdownOptions(false);
		setHasMeasuredHeight(false);
		setDropdownOptionNavigationIndex(0);
		setVirtuosoOptionsHeight(dropdownOptionsHeight);
	}, [dropdownOptionsHeight]);

	const activeDescendantId =
		showDropdownOptions && matchingOptions.length > 0
			? `${listboxId}-option-${dropdownOptionNavigationIndex}`
			: undefined;

	function getOptionId(index: number) {
		return `${listboxId}-option-${index}`;
	}

	// Narrow refs/floatingStyles to portable types so the inferred return
	// doesn't leak @floating-ui/react-dom internals (TS2742).
	const portableRefs = refs as {
		reference: React.MutableRefObject<HTMLElement | null>;
		floating: React.MutableRefObject<HTMLElement | null>;
		setReference: (node: HTMLElement | null) => void;
		setFloating: (node: HTMLElement | null) => void;
	};

	return {
		listboxId,
		refs: portableRefs,
		floatingStyles: floatingStyles as React.CSSProperties,
		virtuosoRef,
		searchQuery,
		setSearchQuery,
		debouncedSearchQuery,
		setDebouncedSearchQuery,
		showDropdownOptions,
		setShowDropdownOptions,
		dropdownOptionNavigationIndex,
		setDropdownOptionNavigationIndex,
		suppressMouseEnterOptionListener,
		setSuppressMouseEnterOptionListener,
		hasMeasuredHeight,
		matchingOptions,
		groupCounts,
		groupContentCallback,
		hasGroups,
		handleOnChangeSearchQuery,
		handleMouseEnterOptionCallback,
		heightOfDropdownOptionsContainer,
		handleTotalListHeightChanged,
		resetDropdownState,
		activeDescendantId,
		getOptionId,
		context,
	};
}
