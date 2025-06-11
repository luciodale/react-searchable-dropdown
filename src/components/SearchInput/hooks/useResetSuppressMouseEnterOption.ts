import { useEffect, useRef } from "react";

export function useResetSuppressMouseEnterOption(
	dropdownOptionNavigationIndex: number,
	suppressMouseEnterOptionListener: boolean,
	setSuppressMouseEnterOptionListener: (suppress: boolean) => void,
	delay = 250,
) {
	const debounceRef = useRef<ReturnType<typeof setTimeout>>();

	useEffect(() => {
		// If suppression is activated, set up debounce to turn it off
		if (dropdownOptionNavigationIndex >= 0 && suppressMouseEnterOptionListener) {
			// Clear any existing timeout to properly debounce
			if (debounceRef.current) {
				clearTimeout(debounceRef.current);
			}

			// Set new timeout
			debounceRef.current = setTimeout(() => {
				setSuppressMouseEnterOptionListener(false);
			}, delay);
		}

		// Cleanup when component unmounts or suppression state changes
		return () => {
			if (debounceRef.current) {
				clearTimeout(debounceRef.current);
			}
		};
	}, [
		dropdownOptionNavigationIndex,
		suppressMouseEnterOptionListener,
		setSuppressMouseEnterOptionListener,
		delay,
	]);
}
