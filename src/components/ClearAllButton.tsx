import type { RefObject } from "react";

type TClearAllButton = {
	onClear: () => void;
	inputRef: RefObject<HTMLInputElement>;
	className?: string;
};

export function ClearAllButton({
	onClear,
	inputRef,
	className = "multi-selected-clear-all",
}: TClearAllButton) {
	return (
		<button
			type="button"
			className={className}
			onClick={() => {
				onClear();
				inputRef.current?.focus();
			}}
		>
			×
		</button>
	);
}
