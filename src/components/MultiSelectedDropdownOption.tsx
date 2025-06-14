import type { TDropdownOption } from "../types";
import { getLabelFromOption, getValueStringFromOption } from "../utils";

type TMultiSelectedDropdownOption = {
	selectedOption: TDropdownOption;
	searchOptionKeys: string[] | undefined;
	values: TDropdownOption[];
	setValues: (options: any) => void;
};

function listWithRemovedItem(
	selectedOptions: TDropdownOption[],
	optionToRemove: TDropdownOption,
	searchOptionKeys: string[] | undefined,
) {
	const optionToRemoveValue = getValueStringFromOption(optionToRemove, searchOptionKeys);
	return selectedOptions.reduce((coll, item) => {
		if (getValueStringFromOption(item, searchOptionKeys) === optionToRemoveValue) {
			return coll;
		}
		coll.push(item);
		return coll;
	}, [] as TDropdownOption[]);
}

export function MultiSelectedDropdownOption({
	selectedOption,
	searchOptionKeys,
	values,
	setValues,
}: TMultiSelectedDropdownOption) {
	const renderedOptionString = getLabelFromOption(selectedOption);
	return (
		<div
			onMouseDown={() => setValues(listWithRemovedItem(values, selectedOption, searchOptionKeys))}
		>
			{renderedOptionString}
		</div>
	);
}
