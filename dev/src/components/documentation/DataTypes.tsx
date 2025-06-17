import React from "react";

export function DataTypes() {
	return (
		<section className="docs-section">
			<h2>Data Types</h2>
			<p>The components support both simple string arrays and complex object arrays:</p>
			<div className="code-block">
				<pre>
					<code>{`// Simple string array
const options = ['Option 1', 'Option 2', 'Option 3'];

// Object array with required label and value
const options = [
  { 
    label: 'Option 1', 
    value: '1',
    description: 'This is option 1',
    category: 'A'
  },
  { 
    label: 'Option 2', 
    value: '2',
    description: 'This is option 2',
    category: 'B'
  }
];`}</code>
				</pre>
			</div>
		</section>
	);
}
