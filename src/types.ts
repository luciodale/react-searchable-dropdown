import type { matchSorter } from "match-sorter";
import type { FunctionComponent } from "react";

export type TSearchableDropdownFilterType = keyof typeof matchSorter.rankings;

export type TNewValueDropdownOption = {
	isNewValue: true;
	label: string;
	value: string;
};

export type TObjectDropdownOption = {
	[key: string]: string | number | boolean;
	label: string;
	value: string;
};

export type TObjectLikeDropdownOption = TObjectDropdownOption | TNewValueDropdownOption;
export type TStringDropdownOption = string;

export type TDropdownOption = TObjectLikeDropdownOption | TStringDropdownOption;

export type TSearchOptionKeys<T extends TDropdownOption> = T extends {
	label: string;
	value: string;
}
	? Array<Extract<keyof T, string>>
	: never;

export type TSearchableCommon<T extends TDropdownOption> = {
	options: T[];
	placeholder?: string;
	value: T | undefined;
	setValue: (option: T) => void;
	debounceDelay?: number;
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
	classNameDropdownOptionSelected?: string;
	classNameDropdownOptionLabel?: string;
	classNameDropdownOptionLabelFocused?: string;
	classNameDropdownOptionNoMatch?: string;
	classNameTriggerIcon?: string;
	classNameTriggerIconInvert?: string;
	DropdownIcon?: FunctionComponent<{ toggled: boolean }>;
};

export type TSearchableDropdown<T extends TObjectLikeDropdownOption | TStringDropdownOption> =
	T extends TObjectLikeDropdownOption
		? TSearchableCommon<T> & { searchOptionKeys: Array<Extract<keyof T, string>> }
		: TSearchableCommon<T> & { searchOptionKeys?: undefined };

export type TSearchableCommonMulti<T extends TDropdownOption> = {
	options: T[];
	placeholder?: string;
	values: T[] | undefined;
	setValues: (options: T[]) => void;
	debounceDelay?: number;
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

export type TSearchableDropdownMulti<T extends TObjectLikeDropdownOption | TStringDropdownOption> =
	T extends TObjectLikeDropdownOption
		? TSearchableCommonMulti<T> & { searchOptionKeys: Array<Extract<keyof T, string>> }
		: TSearchableCommonMulti<T> & { searchOptionKeys?: undefined };
