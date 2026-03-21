import { matchSorter } from "match-sorter";
import { useDeferredValue, useMemo } from "react";
import type {
	TDropdownOption,
	TNewValueDropdownOption,
	TSearchableDropdownFilterType,
} from "../types";

export function useDropdownOptions<T extends TDropdownOption>(
	options: T[],
	searchQuery: string | undefined,
	searchOptionKeys: string[] | undefined,
	filterType: TSearchableDropdownFilterType,
	enhanceOptionsWithNewCreation: (
		matchingOptions: T[],
		searchQuery: string,
	) => TNewValueDropdownOption | undefined,
): (T | TNewValueDropdownOption)[] {
	const searchQueryDeferred = useDeferredValue(searchQuery);

	return useMemo(() => {
		if (!searchQueryDeferred) return options;

		const threshold = matchSorter.rankings[filterType];

		const matchingOptions = matchSorter(
			options,
			searchQueryDeferred,
			searchOptionKeys?.length
				? {
						keys: searchOptionKeys,
						threshold,
					}
				: { threshold },
		);

		const generatedOption = enhanceOptionsWithNewCreation(matchingOptions, searchQueryDeferred);

		if (generatedOption) {
			return [generatedOption, ...matchingOptions];
		}

		return matchingOptions;
	}, [options, searchQueryDeferred, searchOptionKeys, filterType, enhanceOptionsWithNewCreation]);
}
