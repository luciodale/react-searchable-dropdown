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
				gap: "16px",
				padding: "32px 0",
			}}
		>
			<p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>
				{sampleOptions.length.toLocaleString()} cities loaded
			</p>
			<SearchableDropdown
				dropdownOptionsHeight={320}
				placeholder="Search cities..."
				options={sampleOptions}
				value={value}
				setValue={setValue}
				debounceDelay={0}
			/>
			{value && (
				<p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px" }}>Selected: {value}</p>
			)}
		</div>
	);
}
