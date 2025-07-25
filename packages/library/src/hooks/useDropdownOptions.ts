import { matchSorter } from "match-sorter";
import { useMemo } from "react";
import type {
	TDropdownOption,
	TNewValueDropdownOption,
	TSearchableDropdownFilterType,
} from "../types";

export function useDropdownOptions(
	options: TDropdownOption[],
	searchQuery: string | undefined,
	searchOptionKeys: string[] | undefined,
	filterType: TSearchableDropdownFilterType,
	enhanceOptionsWithNewCreation: (
		matchingOptions: TDropdownOption[],
		searchQuery: string,
		// These parameters are optional as they are only relevant for multi-select
		selectedValuesSet?: Set<string>,
		searchOptionKeys?: string[],
	) => TNewValueDropdownOption | undefined,
) {
	return useMemo(() => {
		if (!searchQuery) return options;

		const threshold = matchSorter.rankings[filterType];

		// Perform the initial match-sorter filtering
		const matchingOptions = matchSorter(
			options,
			searchQuery,
			searchOptionKeys?.length
				? {
						keys: searchOptionKeys,
						threshold,
					}
				: { threshold },
		);

		const generatedOption = enhanceOptionsWithNewCreation(
			matchingOptions,
			searchQuery,
			undefined,
			searchOptionKeys,
		);

		if (generatedOption) {
			matchingOptions.unshift(generatedOption);
		}

		return matchingOptions;
	}, [options, searchQuery, searchOptionKeys, filterType, enhanceOptionsWithNewCreation]);
}
