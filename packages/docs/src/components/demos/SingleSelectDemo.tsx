import { SearchableDropdown } from "@luciodale/react-searchable-dropdown";
import { useState } from "react";
import { sampleOptions } from "../../mock";

export function SingleSelectDemo() {
	const [value, setValue] = useState<string | undefined>(undefined);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: "20px",
			}}
		>
			<p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", letterSpacing: "0.02em" }}>
				{sampleOptions.length.toLocaleString()} cities loaded
			</p>
			<SearchableDropdown
				dropdownOptionsHeight={320}
				placeholder="Search cities..."
				options={sampleOptions}
				value={value}
				setValue={setValue}
				debounceDelay={100}
			/>
			<p
				style={{
					color: value ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)",
					fontSize: "13px",
					minHeight: "20px",
				}}
			>
				{value ? `Selected: ${value}` : "No selection"}
			</p>
		</div>
	);
}
