import { SearchableDropdownMulti } from "@luciodale/react-searchable-dropdown";
import { useState } from "react";
import { sampleOptions } from "../../mock";

export function MultiSelectDemo() {
	const [values, setValues] = useState<string[] | undefined>(undefined);

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
			<SearchableDropdownMulti
				dropdownOptionsHeight={312}
				placeholder="Search cities..."
				options={sampleOptions}
				values={values}
				setValues={setValues}
				debounceDelay={100}
				deleteLastChipOnBackspace={true}
			/>
			{values && values.length > 0 && (
				<p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px" }}>
					Selected: {values.length} cities
				</p>
			)}
		</div>
	);
}
