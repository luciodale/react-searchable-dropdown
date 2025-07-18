import type { FunctionComponent, RefObject } from "react";

type TClearAllButton = {
	onClear: () => void;
	inputRef: RefObject<HTMLInputElement | null>;
	className?: string;
	Icon?: FunctionComponent;
};

export function ClearAllButton({ onClear, inputRef, className, Icon }: TClearAllButton) {
	return (
		<button
			type="button"
			className={className}
			data-testid="clear-all"
			onClick={() => {
				onClear();
				inputRef.current?.focus();
			}}
		>
			{Icon ? <Icon /> : "×"}
		</button>
	);
}
