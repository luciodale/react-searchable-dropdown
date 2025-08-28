import { useState } from "react";
import { SearchableDropdown, SearchableDropdownMulti } from "react-searchable-dropdown";
// import { SearchableDropdown } from "@luciodale/react-searchable-dropdown";

export function GroupsDropdownDemo() {
	const [values, setValues] = useState<
		{ label: string; value: string; category: string }[] | undefined
	>(undefined);

	const [value, setValue] = useState<
		{ label: string; value: string; category: string } | undefined
	>(undefined);

	const foods = [
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

	function handleGroups(matchingOptions: typeof foods) {
		const groupedCategories = matchingOptions.reduce(
			(coll, entry) => {
				if (entry.category) {
					coll[entry.category] = (coll[entry.category] || 0) + 1;
				} else {
					coll["No category"] = 1;
				}
				return coll;
			},
			{} as Record<string, number>,
		);

		return {
			groupCategories: Object.keys(groupedCategories),
			groupCounts: Object.values(groupedCategories),
		};
	}

	return (
		<div className="container">
			<div className="text-and-dropdown">
				<h3>Single Groups</h3>

				<SearchableDropdown
					dropdownOptionsHeight={320}
					placeholder="Select an option"
					searchOptionKeys={["label"]}
					options={foods}
					value={value}
					setValue={setValue}
					debounceDelay={0}
					handleGroups={handleGroups}
					groupContent={(index, categories) => {
						const category = categories[index];
						return <div className="lda-dropdown-group">{category} </div>;
					}}
				/>

				<h3>Multi Groups</h3>

				<SearchableDropdownMulti
					dropdownOptionsHeight={320}
					placeholder="Select an option"
					searchOptionKeys={["label"]}
					options={foods}
					values={values}
					setValues={setValues}
					debounceDelay={0}
					handleGroups={handleGroups}
					groupContent={(index, categories) => {
						const category = categories[index];
						return <div className="lda-multi-dropdown-group">{category} </div>;
					}}
				/>
			</div>

			<p className="info-text">
				The groups feature dynamically creates category headers based on the matching options.
				Categories are automatically generated from the data and will only show categories that have
				matching results when searching.
			</p>
		</div>
	);
}
