import { useEffect, useState } from "react";
import type { TDropdownOption } from "../types";

export function useDebounce<T extends TDropdownOption>(value: T | undefined, delay: number) {
	const [debouncedValue, setDebouncedValue] = useState<T | undefined>(value);

	useEffect(() => {
		if (delay === 0) return setDebouncedValue(value);
		const timer = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(timer);
		};
	}, [value, delay]);

	return [debouncedValue, setDebouncedValue] as const;
}
