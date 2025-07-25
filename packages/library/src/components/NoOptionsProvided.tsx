export function NoOptionsProvided({
	classNameDropdownOptions,
	classNameDropdownOption,
	dropdownNoOptionsLabel,
}: {
	classNameDropdownOptions?: string;
	classNameDropdownOption?: string;
	dropdownNoOptionsLabel?: string;
}) {
	return (
		<div className={classNameDropdownOptions}>
			<div className={classNameDropdownOption}>{dropdownNoOptionsLabel}</div>
		</div>
	);
}
