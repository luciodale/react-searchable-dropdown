import { matchSorter } from "match-sorter";
import { useMemo } from "react";
import type {
	TDropdownOption,
	TNewValueDropdownOption,
	TSearchableDropdownFilterType,
} from "../types";
import { getLabelFromOption } from "../utils";

// to generate a new option when the searchQuery doesn't equal any of the matchingOption values
function generateNewOptionIfNoMatch<T extends TDropdownOption>(
	searchQuery: string,
	matchingOptions: T[],
) {
	const searchQueryNormalized = searchQuery.toLocaleLowerCase();
	let searchQueryMatchesOption = false;

	for (const matchedOption of matchingOptions) {
		if (getLabelFromOption(matchedOption).toLocaleLowerCase() === searchQueryNormalized) {
			searchQueryMatchesOption = true;
			break;
		}
	}

	if (!searchQueryMatchesOption) {
		return {
			label: `Create New: ${searchQuery}`,
			value: searchQuery,
			isNewValue: true,
		} satisfies TNewValueDropdownOption;
	}
	return undefined;
}

export function useDropdownOptions<T extends TDropdownOption>(
	options: T[],
	searchQuery: string | undefined,
	searchOptionKeys: string[] | undefined,
	filterType: TSearchableDropdownFilterType,
	createNewOptionIfNoMatch: boolean,
) {
	return useMemo(() => {
		if (!searchQuery) return options;

		const threshold = matchSorter.rankings[filterType];

		const matchingOptions = matchSorter(
			options,
			// we support both string and object dropdown options
			// so we cast to avoid type errors
			searchQuery as unknown as string,
			searchOptionKeys?.length
				? {
						keys: searchOptionKeys,
						threshold,
					}
				: { threshold },
		);

		if (createNewOptionIfNoMatch) {
			const generatedOption = generateNewOptionIfNoMatch(searchQuery, matchingOptions);

			if (generatedOption) {
				matchingOptions.unshift(generatedOption as T);
			}
		}

		return matchingOptions;
	}, [options, searchQuery, searchOptionKeys, filterType, createNewOptionIfNoMatch]);
}
