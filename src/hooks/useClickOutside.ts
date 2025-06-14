import { useEffect, useRef } from "react";

export function useClickOutside(onClickOutside: () => void) {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				onClickOutside();
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [onClickOutside]);

	return containerRef;
}
