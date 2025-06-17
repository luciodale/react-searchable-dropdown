import { useEffect, useRef } from "react";

export function useClickOutside(onClickOutside: () => void) {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				onClickOutside();
			}
		}

		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [onClickOutside]);

	return containerRef;
}
