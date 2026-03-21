import { SearchableDropdown } from "@luciodale/react-searchable-dropdown";
import { useState } from "react";

function ChevronIcon({ toggled }: { toggled: boolean }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			className={`frost-icon ${toggled ? "" : "frost-icon-invert"}`}
		>
			<title>Toggle</title>
			<path
				d="M8 14L12 10L16 14"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

const frameworks = [
	"Next.js",
	"Remix",
	"Astro",
	"Nuxt",
	"SvelteKit",
	"Gatsby",
	"Vite",
	"Solid Start",
	"Qwik City",
	"Redwood",
	"Blitz.js",
	"Fresh",
];

export function FrostThemeDemo() {
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
			<SearchableDropdown
				dropdownOptionsHeight={280}
				placeholder="Select framework..."
				options={frameworks}
				value={value}
				setValue={setValue}
				debounceDelay={0}
				classNameSearchableDropdownContainer="frost-container"
				classNameSearchQueryInput="frost-input"
				classNameDropdownOptions="frost-options"
				classNameDropdownOption="frost-option"
				classNameDropdownOptionFocused="frost-option-focused"
				classNameDropdownOptionSelected="frost-option-selected"
				classNameDropdownOptionLabel="frost-option-label"
				classNameDropdownOptionLabelFocused="frost-option-label-focused"
				classNameDropdownOptionNoMatch="frost-option-no-match"
				DropdownIcon={ChevronIcon}
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
