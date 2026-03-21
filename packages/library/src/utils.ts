import type { TDropdownOption, TNewValueDropdownOption, TObjectLikeDropdownOption } from "./types";

function isNewValueOption(option: TObjectLikeDropdownOption): option is TNewValueDropdownOption {
	return "isNewValue" in option && option.isNewValue === true;
}

export function getLabelFromOption<T extends TDropdownOption>(option: T) {
	return typeof option === "string" ? option : option.label;
}

export function getSearchQueryLabelFromOption<T extends TDropdownOption>(option: T) {
	if (typeof option === "string") {
		return option;
	}
	if (isNewValueOption(option)) {
		return option.value;
	}
	return option.label;
}

export function getValueFromOption<T extends TDropdownOption>(
	option: T,
	searchOptionKeys: string[] | undefined,
): T {
	if (typeof option === "string") return option;

	if (searchOptionKeys) {
		if (isNewValueOption(option)) return { label: option.value, value: option.value } as T;
		return option;
	}

	// Option comes from a user-generated new value and searchOptionKeys is not provided,
	// so the options array is strings. Return the value string.
	return option.value as T;
}

export function createValueFromSearchQuery<T extends TDropdownOption>(
	searchQuery: string,
	searchOptionKeys: string[] | undefined,
) {
	if (searchOptionKeys?.length) {
		const newOption = {
			label: searchQuery,
			value: searchQuery,
		};
		return newOption as T;
	}
	return searchQuery as T;
}

export function getValueStringFromOption<T extends TDropdownOption>(
	option: T,
	searchOptionKeys: string[] | undefined,
) {
	const value = getValueFromOption(option, searchOptionKeys);

	if (typeof value === "string") return value;
	return value.value;
}

export function sanitizeForTestId(str: string): string {
	return str
		.replace(/[^a-zA-Z0-9]/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "")
		.toLowerCase();
}
