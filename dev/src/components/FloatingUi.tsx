import React from "react";
import { autoUpdate, flip, FloatingPortal, offset, useFloating } from "@floating-ui/react";

export function FloatingUi() {
	const { refs, floatingStyles } = useFloating({
		placement: "bottom",
		whileElementsMounted: autoUpdate,
	});

	return (
		<div ref={refs.setReference}>
			click me
			<FloatingPortal>
				<div ref={refs.setFloating} style={floatingStyles}>
					FloatingUi
				</div>
			</FloatingPortal>
		</div>
	);
}
