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

export type TGroups<T extends TDropdownOption, G> =
	| {
			handleGroups: (matchingOptions: T[]) => { groupCounts: number[]; groupCategories: string[] };
			groupContent: (index: number, groupCategories: string[], context: G) => React.ReactNode;
	  }
	| {
			handleGroups?: undefined;
			groupContent?: undefined;
	  };

type TCommonClasses = {
	classNameSearchableDropdownContainer?: string;
	classNameSearchQueryInput?: string;
	classNameDropdownOptions?: string;
	classNameDropdownOption?: string;
	classNameDropdownOptionFocused?: string;
	classNameDropdownOptionSelected?: string;
	classNameDropdownOptionDisabled?: string;
	classNameDropdownOptionLabel?: string;
	classNameDropdownOptionLabelFocused?: string;
	classNameDropdownOptionNoMatch?: string;
	classNameTriggerIcon?: string;
	classNameTriggerIconInvert?: string;
	classNameDisabled?: string;
};

export type TSearchableCommon<T extends TDropdownOption, G> = {
	options: T[];
	placeholder?: string;
	value: T | undefined;
	setValue: (option: T) => void;
	searchQuery?: string | undefined;
	onBlur?: () => void;
	onSearchQueryChange?: (query: string | undefined) => void;
	debounceDelay?: number;
	filterType?: TSearchableDropdownFilterType;
	dropdownOptionsHeight?: number;
	dropdownNoOptionsLabel?: string;
	createNewOptionIfNoMatch?: boolean;
	dropdownOptionNoMatchLabel?: string;
	disabled?: boolean;
	offset?: number;
	strategy?: "absolute" | "fixed";
	DropdownIcon?: FunctionComponent<{ toggled: boolean }>;
	context?: G;
} & TCommonClasses &
	TGroups<T, G>;

export type TSearchableDropdown<
	T extends TObjectLikeDropdownOption | TStringDropdownOption,
	G,
> = T extends TObjectLikeDropdownOption
	? TSearchableCommon<T, G> & { searchOptionKeys: Array<Extract<keyof T, string>> }
	: TSearchableCommon<T, G> & { searchOptionKeys?: undefined };

export type TSearchableCommonMulti<T extends TDropdownOption, G> = {
	options: T[];
	placeholder?: string;
	values: T[] | undefined;
	setValues: (options: T[]) => void;
	searchQuery?: string | undefined;
	onSearchQueryChange?: (query: string | undefined) => void;
	onClearAll?: () => void;
	onClearOption?: (option: T) => void;
	debounceDelay?: number;
	filterType?: TSearchableDropdownFilterType;
	dropdownOptionsHeight?: number;
	createNewOptionIfNoMatch?: boolean;
	dropdownOptionNoMatchLabel?: string;
	dropdownNoOptionsLabel?: string;
	disabled?: boolean;
	offset?: number;
	strategy?: "absolute" | "fixed";
	deleteLastChipOnBackspace?: boolean;
	classNameMultiSelectedOption?: string;
	classNameMultiSelectedOptionClose?: string;
	classNameClearAll?: string;
	DropdownIcon?: FunctionComponent<{ toggled: boolean }>;
	ClearAllIcon?: FunctionComponent;
	context?: G;
} & TCommonClasses &
	TGroups<T, G>;

export type TSearchableDropdownMulti<
	T extends TObjectLikeDropdownOption | TStringDropdownOption,
	G,
> = T extends TObjectLikeDropdownOption
	? TSearchableCommonMulti<T, G> & { searchOptionKeys: Array<Extract<keyof T, string>> }
	: TSearchableCommonMulti<T, G> & { searchOptionKeys?: undefined };
