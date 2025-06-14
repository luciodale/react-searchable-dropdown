import type { FunctionComponent, RefObject } from "react";

type TClearAllButton = {
	onClear: () => void;
	inputRef: RefObject<HTMLInputElement>;
	className?: string;
	Icon?: FunctionComponent;
};

export function ClearAllButton({ onClear, inputRef, className, Icon }: TClearAllButton) {
	return (
		<button
			type="button"
			className={className}
			onClick={() => {
				onClear();
				inputRef.current?.focus();
			}}
		>
			{Icon ? <Icon /> : "×"}
		</button>
	);
}
