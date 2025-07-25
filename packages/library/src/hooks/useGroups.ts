import { useCallback, useMemo } from "react";
import type { TDropdownOption } from "../types";

export function useGroups<T extends TDropdownOption, G>(
	matchingOptions: T[],
	handleGroups?: (matchingOptions: TDropdownOption[]) => {
		groupCounts: number[];
		groupCategories: string[];
	},
	groupContent?: (index: number, groupCategories: string[], context: G) => React.ReactNode,
) {
	const handleGroupsMemoized = useMemo(() => {
		if (handleGroups) {
			return handleGroups(matchingOptions);
		}
		return { groupCounts: [], groupCategories: [] };
	}, [handleGroups, matchingOptions]);

	const groupContentCallback = useCallback(
		(index: number, contextValue: G) => {
			if (groupContent) {
				return groupContent(index, handleGroupsMemoized.groupCategories, contextValue);
			}
			return undefined;
		},
		[groupContent, handleGroupsMemoized.groupCategories],
	);

	return {
		groupCounts: handleGroupsMemoized.groupCounts,
		groupContentCallback,
		hasGroups: Boolean(handleGroups && groupContent),
	};
}
