import { useCallback } from "react";

export function useOnMouseEnterOptionHandler(
	suppressMouseEnterOptionListener: boolean,
	setDropdownOptionNavigationIndex: (index: number) => void,
) {
	return useCallback(
		(index: number) => {
			if (!suppressMouseEnterOptionListener) {
				setDropdownOptionNavigationIndex(index);
			}
		},
		[suppressMouseEnterOptionListener, setDropdownOptionNavigationIndex],
	);
}
