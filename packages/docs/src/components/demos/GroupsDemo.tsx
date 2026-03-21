import { SearchableDropdown, SearchableDropdownMulti } from "@luciodale/react-searchable-dropdown";
import { useState } from "react";

type Food = {
	label: string;
	value: string;
	category: string;
	disabled?: boolean;
};

const foods: Food[] = [
	{ label: "Pork", value: "pork", category: "meat", disabled: true },
	{ label: "Chicken", value: "chicken", category: "meat" },
	{ label: "Turkey", value: "turkey", category: "meat" },
	{ label: "Veal", value: "veal", category: "meat" },
	{ label: "Carrots", value: "carrots", category: "veggies" },
	{ label: "Broccoli", value: "broccoli", category: "veggies" },
	{ label: "Salad", value: "salad", category: "veggies" },
	{ label: "Spinach", value: "spinach", category: "veggies" },
	{ label: "Tuna", value: "tuna", category: "fish" },
	{ label: "Salmon", value: "salmon", category: "fish" },
	{ label: "Calamari", value: "calamari", category: "fish" },
	{ label: "Shrimps", value: "shrimps", category: "fish" },
	{ label: "Apple", value: "apple", category: "fruit" },
	{ label: "Banana", value: "banana", category: "fruit" },
	{ label: "Pear", value: "pear", category: "fruit" },
	{ label: "Watermelon", value: "watermelon", category: "fruit" },
	{ label: "Cherries", value: "cherries", category: "fruit" },
];

function handleGroups(matchingOptions: Food[]) {
	const grouped = matchingOptions.reduce(
		(acc, entry) => {
			const key = entry.category || "Other";
			acc[key] = (acc[key] || 0) + 1;
			return acc;
		},
		{} as Record<string, number>,
	);

	return {
		groupCategories: Object.keys(grouped),
		groupCounts: Object.values(grouped),
	};
}

export function GroupsDemo() {
	const [value, setValue] = useState<Food | undefined>(undefined);
	const [values, setValues] = useState<Food[] | undefined>(undefined);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: "40px",
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: "20px",
				}}
			>
				<p
					style={{
						color: "rgba(255,255,255,0.5)",
						fontSize: "13px",
						fontWeight: 500,
						letterSpacing: "0.05em",
						textTransform: "uppercase",
					}}
				>
					Single Select with Groups
				</p>
				<SearchableDropdown
					dropdownOptionsHeight={320}
					placeholder="Pick a food..."
					searchOptionKeys={["label"]}
					options={foods}
					value={value}
					setValue={setValue}
					debounceDelay={0}
					handleGroups={handleGroups}
					groupContent={(index, categories) => (
						<div className="lda-dropdown-group">{categories[index]}</div>
					)}
				/>
			</div>

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: "20px",
				}}
			>
				<p
					style={{
						color: "rgba(255,255,255,0.5)",
						fontSize: "13px",
						fontWeight: 500,
						letterSpacing: "0.05em",
						textTransform: "uppercase",
					}}
				>
					Multi Select with Groups
				</p>
				<SearchableDropdownMulti
					dropdownOptionsHeight={320}
					placeholder="Pick foods..."
					searchOptionKeys={["label"]}
					options={foods}
					values={values}
					setValues={setValues}
					debounceDelay={0}
					handleGroups={handleGroups}
					groupContent={(index, categories) => (
						<div className="lda-multi-dropdown-group">{categories[index]}</div>
					)}
				/>
			</div>
		</div>
	);
}
