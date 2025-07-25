// dev/src/demos/FrostedEleganceDropdownDemo.tsx
import React, { useEffect, useState } from "react";
// import { SearchableDropdown } from "@luciodale/react-searchable-dropdown";
import { SearchableDropdown, useDebounce } from "react-searchable-dropdown";

interface DictionaryEntry {
	word: string;
	meanings: Array<{
		definitions: Array<{
			definition: string;
		}>;
	}>;
}

let words: string[] = [];

async function fetchWords() {
	try {
		const response = await fetch(
			"https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt",
		);
		const text = await response.text();
		words = text
			.split("\n")
			.map((word) => word.replace(/\r$/, ""))
			.filter((word) => word.length > 3 && /^[a-z]+$/.test(word))
			.sort();
	} catch (error) {
		console.error("Error fetching words:", error);
	}
}

fetchWords();

export function ServerOptionsDropdownDemo() {
	const [value, setValue] = useState<string | undefined>(undefined);
	const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);

	const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

	const [options, setOptions] = useState<string[]>([]);

	// this is where the server-side filtering should be done
	useEffect(() => {
		if (!debouncedSearchQuery || value === debouncedSearchQuery) {
			return setOptions([]);
		}

		const firstChar = debouncedSearchQuery[0]?.toLowerCase() || "";
		const filteredWords = words.filter((word) => word.startsWith(firstChar));

		setOptions(filteredWords);
	}, [debouncedSearchQuery, value]);

	return (
		<div className="container">
			<div className="text-and-dropdown">
				<h3>Server-Side Search Demo</h3>
				<p>Word list length: {options.length}</p>

				<SearchableDropdown
					searchQuery={searchQuery}
					onSearchQueryChange={setSearchQuery}
					createNewOptionIfNoMatch={false}
					dropdownOptionsHeight={312}
					placeholder="Search for a word..."
					options={options}
					value={value}
					dropdownNoOptionsLabel="Type for a word..."
					setValue={setValue}
				/>
			</div>

			<p className="info-text">
				This demo fetches a comprehensive list of English words and filters them based on the first
				character of your search. Of course, the first char filtering is done in the client, but the
				example gives enough ideas to build something server-side.
			</p>
		</div>
	);
}
