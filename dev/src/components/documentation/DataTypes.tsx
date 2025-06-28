import React from "react";

export function DataTypes() {
	return (
		<section className="docs-section">
			<h2>Props Reference</h2>
			<p>Both components support the following props:</p>
			<div className="code-block" style={{ marginBottom: "2rem" }}>
				<div className="code-block-header">Common Props</div>
				<pre>
					<code>{`// Common props for both components
options: string[] | { label: string; value: string; [key: string]: any }[]
placeholder?: string
disabled?: boolean
debounceDelay?: number
filterType?: 'CASE_SENSITIVE_EQUAL' | 'EQUAL' | 'STARTS_WITH' | 'WORD_STARTS_WITH' | 'CONTAINS' | 'ACRONYM' | 'MATCHES' | 'NO_MATCH'
dropdownOptionsHeight?: number
searchQuery?: string | undefined
onSearchQueryChange?: (query: string | undefined) => void
dropdownNoOptionsLabel?: string
createNewOptionIfNoMatch?: boolean
dropdownOptionNoMatchLabel?: string
offset?: number
strategy?: 'absolute' | 'fixed'
searchOptionKeys?: string[] // Required for object options
classNameSearchableDropdownContainer?: string
classNameSearchQueryInput?: string
classNameDropdownOptions?: string
classNameDropdownOption?: string
classNameDropdownOptionFocused?: string
classNameDropdownOptionSelected?: string
classNameDropdownOptionDisabled?: string
classNameDropdownOptionLabel?: string
classNameDropdownOptionLabelFocused?: string
classNameDropdownOptionNoMatch?: string
classNameTriggerIcon?: string
classNameTriggerIconInvert?: string
classNameDisabled?: string
DropdownIcon?: React.ComponentType<{ toggled: boolean }>
context?: any
handleGroups?: (matchingOptions: T[]) => { groupCounts: number[]; groupCategories: string[] }
groupContent?: (index: number, groupCategories: string[], context: any) => React.ReactNode`}</code>
				</pre>
			</div>

			<p>Single Select specific props:</p>
			<div className="code-block" style={{ marginBottom: "2rem" }}>
				<div className="code-block-header">Single Select Props</div>
				<pre>
					<code>{`// Single select specific props
value: T
setValue: (value: T) => void`}</code>
				</pre>
			</div>

			<p>Multi Select specific props:</p>
			<div className="code-block" style={{ marginBottom: "2rem" }}>
				<div className="code-block-header">Multi Select Props</div>
				<pre>
					<code>{`// Multi select specific props
values: T[] | undefined
setValues: (values: T[]) => void
ClearAllIcon?: React.ComponentType
onClearAll?: () => void
onClearOption?: (option: T) => void
classNameMultiSelectedOption?: string
classNameMultiSelectedOptionClose?: string
deleteLastChipOnBackspace?: boolean
classNameClearAll?: string`}</code>
				</pre>
			</div>
		</section>
	);
}
