// dev/src/demos/FrostedEleganceDropdownDemo.tsx
import React, { useState } from "react";
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
		{ label: "pork", value: "pork", category: "meat", disabled: true },
		{ label: "chicken", value: "chicken", category: "meat" },
		{ label: "turkey", value: "turkey", category: "meat" },
		{ label: "veal", value: "veal", category: "meat" },
		{ label: "carrots", value: "carrots", category: "veggies" },
		{ label: "broccoli", value: "broccoli", category: "veggies" },
		{ label: "salad", value: "salad", category: "veggies" },
		{ label: "spinach", value: "spinach", category: "veggies" },
		{ label: "tuna", value: "tuna", category: "fish" },
		{ label: "salmon", value: "salmon", category: "fish" },
		{ label: "calamari", value: "calamari", category: "fish" },
		{ label: "shrimps", value: "shrimps", category: "fish" },
		{ label: "apple", value: "apple", category: "fruit" },
		{ label: "banana", value: "banana", category: "fruit" },
		{ label: "pear", value: "pear", category: "fruit" },
		{ label: "watermelon", value: "watermelon", category: "fruit" },
		{ label: "cherries", value: "cherries", category: "fruit" },
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
