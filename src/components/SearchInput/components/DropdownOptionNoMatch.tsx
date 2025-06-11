export function DropdownOptionNoMatch({
	classNameDropdownOptionNoMatch,
	dropdownOptionNoMatchLabel,
}: { classNameDropdownOptionNoMatch?: string; dropdownOptionNoMatchLabel: string }) {
	return <div className={classNameDropdownOptionNoMatch}> {dropdownOptionNoMatchLabel} </div>;
}
