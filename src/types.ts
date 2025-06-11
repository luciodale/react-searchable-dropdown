import type { matchSorter } from "match-sorter";
import type { FunctionComponent } from "react";

export type TSearchableDropdownFilterType = keyof typeof matchSorter.rankings;
export type TNewValueDropdownOption = {
	label: string;
	value: string;
	isNewValue: true;
};

export type TObjectDropdownOption = {
	value: string;
	label: string;
	[key: string]: string | number | boolean;
};

export type TDropdownOption = TObjectDropdownOption | string | TNewValueDropdownOption;
export type TSearchOptionKeys = string[];

export type TSearchableDropdown<T extends TDropdownOption> = {
	options: T[];
	placeholder?: string;
	value: T | undefined;
	setValue: (option: T) => void;
	debounceDelay?: number;
	searchOptionKeys?: TSearchOptionKeys;
	filterType?: TSearchableDropdownFilterType;
	dropdownOptionsHeight?: number;
	createNewOptionIfNoMatch?: boolean;
	dropdownOptionNoMatchLabel?: string;
	disabled?: boolean;
	classNameSearchableDropdownContainer?: string;
	classNameSearchQueryInput?: string;
	classNameDropdownOptions?: string;
	classNameDropdownOption?: string;
	classNameDropdownOptionFocused?: string;
	classNameDropdownOptionLabel?: string;
	classNameDropdownOptionLabelFocused?: string;
	classNameDropdownOptionNoMatch?: string;
	classNameTriggerIcon?: string;
	classNameTriggerIconInvert?: string;
	DropdownIcon?: FunctionComponent<{ toggled: boolean }>;
};
