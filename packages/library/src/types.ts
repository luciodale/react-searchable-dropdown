import type { matchSorter } from "match-sorter";
import type { FunctionComponent } from "react";

export type TSearchableDropdownFilterType = keyof typeof matchSorter.rankings;

export type TNewValueDropdownOption = {
	isNewValue: true;
	label: string;
	value: string;
};

export type TObjectDropdownOption = {
	label: string;
	value: string;
	disabled?: boolean;
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

type TSearchableBase<T extends TDropdownOption, G> = {
	options: T[];
	placeholder?: string;
	searchQuery?: string | undefined;
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
	inputId?: string;
} & TCommonClasses &
	TGroups<T, G>;

export type TSearchableCommon<T extends TDropdownOption, G> = TSearchableBase<T, G> & {
	value: T | undefined;
	setValue: (option: T) => void;
	onBlur?: () => void;
};

// [T] prevents distributive conditional: without it, T = string | Obj distributes into
// (StringBranch | ObjBranch), creating a union of two shapes that can't be destructured.
// With [T], the conditional resolves once for the whole union.
export type TSearchableDropdown<T extends TObjectLikeDropdownOption | TStringDropdownOption, G> = [
	T,
] extends [TObjectLikeDropdownOption]
	? TSearchableCommon<T, G> & { searchOptionKeys: Array<Extract<keyof T, string>> }
	: TSearchableCommon<T, G> & { searchOptionKeys?: undefined };

export type TSearchableCommonMulti<T extends TDropdownOption, G> = TSearchableBase<T, G> & {
	values: T[] | undefined;
	setValues: (options: T[]) => void;
	onClearAll?: () => void;
	onClearOption?: (option: T) => void;
	deleteLastChipOnBackspace?: boolean;
	classNameMultiSelectedOption?: string;
	classNameMultiSelectedOptionClose?: string;
	classNameClearAll?: string;
	ClearAllIcon?: FunctionComponent;
};

export type TSearchableDropdownMulti<
	T extends TObjectLikeDropdownOption | TStringDropdownOption,
	G,
> = [T] extends [TObjectLikeDropdownOption]
	? TSearchableCommonMulti<T, G> & { searchOptionKeys: Array<Extract<keyof T, string>> }
	: TSearchableCommonMulti<T, G> & { searchOptionKeys?: undefined };

// Wrapper-friendly prop types. These merge both branches of the conditional
// (searchOptionKeys always optional) so they work inside generic function bodies
// where TypeScript can't resolve which branch applies. Use these when building
// custom wrapper components around SearchableDropdown / SearchableDropdownMulti.
export type TSearchableDropdownProps<T extends TDropdownOption, G = unknown> = TSearchableCommon<
	T,
	G
> & {
	searchOptionKeys?: Array<Extract<keyof T, string>>;
};

export type TSearchableDropdownMultiProps<
	T extends TDropdownOption,
	G = unknown,
> = TSearchableCommonMulti<T, G> & {
	searchOptionKeys?: Array<Extract<keyof T, string>>;
};
