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
				gap: "20px",
			}}
		>
			<p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", letterSpacing: "0.02em" }}>
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
			<p
				style={{
					color: values && values.length > 0 ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)",
					fontSize: "13px",
					minHeight: "20px",
				}}
			>
				{values && values.length > 0 ? `Selected: ${values.length} cities` : "No selection"}
			</p>
		</div>
	);
}
