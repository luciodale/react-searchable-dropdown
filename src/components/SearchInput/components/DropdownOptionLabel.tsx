import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";

export function DropdownOptionLabel({
	optionLabel,
	searchQuery,
	highlightMatches,
	classNameDropdownOptionLabel,
	classNameDropdownOptionLabelFocused,
}: {
	optionLabel: string;
	searchQuery: string | undefined;
	highlightMatches: boolean;
	classNameDropdownOptionLabel?: string;
	classNameDropdownOptionLabelFocused?: string;
}) {
	if (!searchQuery || !highlightMatches) return optionLabel;

	const matches = match(optionLabel, searchQuery, { insideWords: true });
	const parts = parse(optionLabel, matches);

	return parts.map((part, i) => {
		return (
			<span
				key={`${part.text}-${i}`}
				className={`${classNameDropdownOptionLabel} ${part.highlight ? classNameDropdownOptionLabelFocused : ""}`}
			>
				{part.text}
			</span>
		);
	});
}
