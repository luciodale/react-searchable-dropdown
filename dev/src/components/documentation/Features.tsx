import React from "react";

export function Features() {
	return (
		<section className="docs-section">
			<h2>Key Features</h2>
			<div className="features-grid">
				<div className="feature-card">
					<h3>🎯 Single & Multi Select</h3>
					<p>Choose between single or multi-select variants to match your needs.</p>
				</div>
				<div className="feature-card">
					<h3>🚀 Virtualized Lists</h3>
					<p>Efficiently handle large option sets without performance degradation.</p>
				</div>
				<div className="feature-card">
					<h3>✨ Optional Create New</h3>
					<p>Toggle the ability for users to create new options when no match is found.</p>
				</div>
				<div className="feature-card">
					<h3>🎨 Easy Styling</h3>
					<p>Customize the appearance to match your project's design.</p>
				</div>
				<div className="feature-card">
					<h3>⌨️ Keyboard Navigation</h3>
					<p>Full keyboard support for accessibility and ease of use.</p>
				</div>
				<div className="feature-card">
					<h3>📦 Flexible Data Structures</h3>
					<p>Use simple string arrays or complex objects with custom properties.</p>
				</div>
			</div>
		</section>
	);
}
