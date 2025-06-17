import React from "react";

export function Features() {
	return (
		<section className="docs-section">
			<h2>Key Features</h2>
			<div className="features-grid">
				<div className="feature-card">
					<h3>🚀 Virtualized Lists</h3>
					<p>Efficiently handle large option sets without performance degradation.</p>
				</div>
				<div className="feature-card">
					<h3>✨ Create New Options</h3>
					<p>Allow users to create new options when no match is found.</p>
				</div>
				<div className="feature-card">
					<h3>🎨 Easy Styling</h3>
					<p>Customize the appearance to match your project's design.</p>
				</div>
				<div className="feature-card">
					<h3>⌨️ Keyboard Navigation</h3>
					<p>Full keyboard support for accessibility and ease of use.</p>
				</div>
			</div>
		</section>
	);
}
