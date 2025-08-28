import { useState } from "react";
import { SearchableDropdown } from "react-searchable-dropdown";

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

	const handleFetchData = async () => {
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
		} catch (error) {
			setError(error instanceof Error ? error.message : "Failed to fetch data");
			console.error("Error fetching data:", error);
		}
	};

	return (
		<div className="container">
			<div className="text-and-dropdown">
				<h3>Custom Data</h3>
				<p>Fetch your own data to use as options, you can target localhost too!</p>

				<div className="url-input-container">
					<input
						type="url"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						placeholder="Enter URL (must return an array of strings)"
						className="url-input"
					/>
					<button type="button" onClick={handleFetchData} className="fetch-button">
						Fetch Data
					</button>
				</div>
				<p className="info-text">
					For this demo, you are expected to pass an array of string, although the lib supports
					objects as well.
				</p>

				{error && <p className="error-message">{error}</p>}

				<SearchableDropdown
					dropdownOptionsHeight={312}
					placeholder="Select an option"
					options={options}
					value={value}
					setValue={setValue}
					debounceDelay={100}
				/>
			</div>
		</div>
	);
}
