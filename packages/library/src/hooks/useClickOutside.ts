import { type MutableRefObject, useCallback, useEffect } from "react";

/**
 * A custom React hook to detect clicks outside of one or more specified DOM elements.
 *
 * @param {Array<React.RefObject<HTMLElement>>} refs - An array of ref objects attached to the DOM elements you want to monitor.
 * @param {() => void} handler - The callback function to execute when a click occurs outside all monitored elements.
 */
export function useClickOutside(refs: MutableRefObject<HTMLElement | null>[], handler: () => void) {
	const memoizedHandler = useCallback(
		(event: MouseEvent) => {
			// Assume click is outside initially
			let isClickInsideAnyRef = false;

			// Iterate over all provided refs
			for (const ref of refs) {
				// Check if the current ref's DOM node exists AND
				// if the clicked target is contained within this ref's DOM node.
				if (ref.current?.contains(event.target as Node)) {
					isClickInsideAnyRef = true; // Click was inside at least one of the refs
					break; // No need to check further, we found a match
				}
			}

			// If the click was not inside any of the provided refs, execute the handler
			if (!isClickInsideAnyRef) {
				handler();
			}
		},
		[refs, handler],
	);
	useEffect(() => {
		document.addEventListener("mousedown", memoizedHandler);

		return () => {
			document.removeEventListener("mousedown", memoizedHandler);
		};
	}, [memoizedHandler]);
}
