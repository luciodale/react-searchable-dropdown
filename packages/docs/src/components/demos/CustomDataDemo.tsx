import { SearchableDropdown } from "@luciodale/react-searchable-dropdown";
import { useState } from "react";

export function CustomDataDemo() {
	const [value, setValue] = useState<string | undefined>(undefined);
	const [options, setOptions] = useState<string[]>([
		"waiting",
		"for",
		"your",
		"data",
		"to",
		"be",
		"fetched",
	]);
	const [url, setUrl] = useState("");
	const [error, setError] = useState<string | null>(null);

	async function handleFetchData() {
		try {
			setError(null);
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			if (!Array.isArray(data)) {
				throw new Error("Data must be an array");
			}
			setOptions(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to fetch data");
		}
	}

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: "20px",
				maxWidth: "400px",
				margin: "0 auto",
			}}
		>
			<div style={{ display: "flex", gap: "8px", width: "100%" }}>
				<input
					type="url"
					value={url}
					onChange={(e) => setUrl(e.target.value)}
					placeholder="Enter URL (returns string[])"
					style={{
						flex: 1,
						padding: "8px 12px",
						borderRadius: "8px",
						border: "1px solid rgba(255,255,255,0.15)",
						background: "rgba(255,255,255,0.05)",
						color: "white",
						fontSize: "14px",
						outline: "none",
					}}
				/>
				<button
					type="button"
					onClick={handleFetchData}
					style={{
						padding: "8px 16px",
						borderRadius: "8px",
						border: "none",
						background: "#ef4723",
						color: "white",
						fontSize: "14px",
						cursor: "pointer",
						fontWeight: 600,
					}}
				>
					Fetch
				</button>
			</div>
			{error && <p style={{ color: "#ef4444", fontSize: "13px" }}>{error}</p>}
			<SearchableDropdown
				dropdownOptionsHeight={312}
				placeholder="Select an option"
				options={options}
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
