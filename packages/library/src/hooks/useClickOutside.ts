import { useCallback, useEffect } from "react";

// Accepts any ref-like object. Floating UI refs hold Element | VirtualElement,
// but only DOM Elements have .contains(). We check at runtime.
type RefWithCurrent = { current: unknown };

function nodeContains(ref: RefWithCurrent, target: Node): boolean {
	return ref.current instanceof Node && ref.current.contains(target);
}

/**
 * Detects clicks outside of one or more referenced DOM elements.
 */
export function useClickOutside(refs: RefWithCurrent[], handler: () => void) {
	const memoizedHandler = useCallback(
		(event: MouseEvent) => {
			const isClickInsideAnyRef = refs.some((ref) => nodeContains(ref, event.target as Node));

			if (!isClickInsideAnyRef) {
				handler();
			}
		},
		[refs, handler],
	);
	useEffect(() => {
		document.addEventListener("mousedown", memoizedHandler);
		return () => document.removeEventListener("mousedown", memoizedHandler);
	}, [memoizedHandler]);
}
