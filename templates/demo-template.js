// Import color system from separate module
const colors = require('./colors');

function generateDemo({ title, icons, embedded, iconStyles }) {
	const demoType = embedded ? 'Embedded Icons' : 'Referenced Icons';
	const description = embedded 
		? 'Icons with embedded SVG data (self-contained, no external files needed)'
		: 'Icons that reference external SVG files (smaller CSS, requires SVG files)';

	// Generate color options for select elements
	const colorOptions = Object.keys(colors).map(colorKey => {
		const color = colors[colorKey];
		return `<option value="${color.value}" data-name="${colorKey}">${color.name}</option>`;
	}).join('');

	// Generate icon grid items
	const iconItems = icons.map(icon => `
		<div class="icon-item" data-name="${icon.displayName.toLowerCase()}" data-class="${icon.className}">
			<div class="icon-wrapper">
				<div class="${icon.className}"></div>
			</div>
			<div class="icon-info">
				<p class="icon-name">${icon.displayName}</p>
				<p class="icon-class">${icon.className}<button class="copy-btn" data-copy='&lt;span class=&quot;${icon.className}&quot;&gt;&lt;/span&gt;' title="Copy '&lt;span class=\"${icon.className}"&gt;&lt;/span&gt;">
				</button>
</p>
			</div>
		</div>
	`).join('');

	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>${title} - ${demoType}</title>
	<style>
	@import "./icons.css";
		:root {
			--icon-size: 48px;
			--icon-color: #000000;
			--background-color: transparent;
			--background-padding: 12px;
			--background-radius: 8px;
			--standard-outline: #d1d1d1;
			--surface: #E0E0E0;
			--on-surface: #AAA;
			--primary: #444;
		}

		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}

		body {
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
			background: var(--surface);
			color: var(--on-surface);
			line-height: 1.6;
			padding: 24px;
			min-height: 100vh;
		}

		.container {
			max-width: 1200px;
			margin: 0 auto;
		}

		h1 {
			font-size: 2.5rem;
			font-weight: 600;
			text-align: center;
			margin-bottom: 8px;
			color: var(--primary);
		}

		.subtitle {
			text-align: center;
			color: var(--on-surface);
			opacity: 0.7;
			margin-bottom: 32px;
			font-size: 1.1rem;
		}

		/* Control Panel */
		#control-panel {
			background: var(--surface);
			border-radius: 16px;
			padding: 24px;
			margin-bottom: 32px;
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
			gap: 20px;
			border: 1px solid var(--standard-outline);
		}

		.control-group {
			display: flex;
			flex-direction: column;
			gap: 8px;
		}

		.search-group {
			grid-column: 1 / -1;
		}

		label {
			font-weight: 500;
			font-size: 0.875rem;
			color: var(--on-surface);
			margin-bottom: 4px;
		}

		select, input {
			padding: 12px;
			border: 1px solid var(--standard-outline);
			border-radius: 8px;
			background: var(--surface);
			color: var(--on-surface);
			font-family: inherit;
			font-size: 0.875rem;
			transition: border-color 0.2s ease;
		}

		select:focus, input:focus {
			outline: none;
			border-color: var(--primary);
			box-shadow: 0 0 0 2px rgba(103, 80, 164, 0.1);
		}

		/* Icon Grid */
		#icon-grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
			gap: 16px;
		}

		.icon-item {
			background: var(--surface-container);
			border-radius: 12px;
			padding: 20px;
			text-align: center;
			border: 1px solid var(--outline-variant);
			transition: all 0.2s ease;
			position: relative;
		}

		.icon-wrapper {
			display: flex;
			justify-content: center;
			align-items: center;
			margin: 0 auto 16px auto;
			padding: calc(var(--icon-size) / 3);
			width: min-content;
			aspect-ratio: 1;
            position: relative;
			background: var(--background-color);
			border-radius: var(--background-radius);
		}

		.icon-info {
			display: flex;
			flex-direction: column;
			gap: 4px;
		}

		.icon-name {
			font-weight: 500;
			font-size: 0.875rem;
			color: var(--on-surface);
		}

		.icon-class {
			font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
			font-size: 0.75rem;
			color: var(--on-surface);
			opacity: 0.7;
			background: rgba(103, 80, 164, 0.1);
			padding: 4px 8px;
			border-radius: 4px;
			word-break: break-all;
			position: relative;
		}

		.copy-btn {
			position: absolute;
			top: 8px;
			right: 8px;
			background: var(--surface);
			border: none;
			border-radius: 6px;
			padding: 2px;
			cursor: pointer;
			opacity: 0;
			transition: all 0.2s ease;
			display: flex;
			align-items: center;
			justify-content: center;
			color: var(--on-surface);
			width: 24px;
			height: 24px;
			background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='%23AAA'%3E%3Cpath d='M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z'/%3E%3C/svg%3E");
			background-repeat: no-repeat;
			background-position: center;
			background-size: 16px 16px;
		}

		.icon-class:hover .copy-btn {
			opacity: 1;
		}

		.copy-btn:hover {
			background: var(--primary);
			color: white;
			border-color: var(--primary);
		}

		.copy-btn:active {
			transform: scale(0.95);
		}

		/* Stats */
		.stats {
			text-align: center;
			margin-bottom: 24px;
			color: var(--on-surface);
			opacity: 0.7;
		}

		/* Responsive Design */
		@media (max-width: 768px) {
			body {
				padding: 16px;
			}

			h1 {
				font-size: 2rem;
			}

			#control-panel {
				grid-template-columns: 1fr;
			}

			#icon-grid {
				grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
			}

			.icon-item {
				padding: 16px;
			}
		}

		/* Demo-specific icon styles that use CSS variables for interactive controls */
		[class*="-icon"] {
			/* Base mask properties */
			mask-size: 100% 100%;
			mask-repeat: no-repeat;
			mask-position: center;
			display: inline-block;
			
			/* Variable-controlled properties for demo */
			width: var(--icon-size);
			height: var(--icon-size);
			background-color: var(--icon-color);
			position: relative;
			transition: all 0.2s ease;
		}
		
		/* Icon styles */
		${iconStyles}	
    </style>
</head>
<body>
	<div class="container">
		<h1>${title}</h1>
		<p class="subtitle">${description}</p>
		<div class="stats">
			${icons.length} icons available
		</div>
		
		<div id="control-panel">
			<div class="control-group">
				<label for="icon-size-select">Size</label>
				<select id="icon-size-select">
					<option value="16">16px</option>
					<option value="24">24px</option>
					<option value="32">32px</option>
					<option value="48" selected>48px</option>
					<option value="64">64px</option>
					<option value="96">96px</option>
				</select>
			</div>

			<div class="control-group">
				<label for="icon-color-select">Icon Color</label>
				<select id="icon-color-select">
                    <option value="#000000" selected>Black</option>
					${colorOptions}
				</select>
			</div>

			<div class="control-group">
				<label for="background-color-select">Background Color</label>
				<select id="background-color-select">
                    <option value="transparent">Transparent</option>                
					${colorOptions}
				</select>
			</div>

			<div class="control-group">
				<label for="background-shape-select">Background Shape</label>
				<select id="background-shape-select">
					<option value="rounded" selected>Rounded Rectangle</option>
					<option value="circle">Circle</option>
					<option value="square">Square</option>
				</select>
			</div>

			<div class="control-group search-group">
				<label for="search-input">Search Icons</label>
				<input type="text" id="search-input" placeholder="Search by name..." />
			</div>
		</div>

		<div id="icon-grid">
			${iconItems}
		</div>
	</div>

	<script>
	(function() {
		const root = document.documentElement;
		const iconSizeSelect = document.getElementById('icon-size-select');
		const iconColorSelect = document.getElementById('icon-color-select');
		const backgroundColorSelect = document.getElementById('background-color-select');
		const backgroundShapeSelect = document.getElementById('background-shape-select');
		const searchInput = document.getElementById('search-input');
		const iconItems = document.querySelectorAll('.icon-item');
		const iconGrid = document.getElementById('icon-grid');

		// Size control
		iconSizeSelect.addEventListener('change', (e) => {
			const size = e.target.value + 'px';
			root.style.setProperty('--icon-size', size);
		});

		// Icon color control
		iconColorSelect.addEventListener('change', (e) => {
			root.style.setProperty('--icon-color', e.target.value);
		});

		// Background color control
		backgroundColorSelect.addEventListener('change', (e) => {
			root.style.setProperty('--background-color', e.target.value);
		});

		// Background shape control
		backgroundShapeSelect.addEventListener('change', (e) => {
			const shape = e.target.value;
			let radius;
			switch(shape) {
				case 'circle':
					radius = '50%';
					break;
				case 'square':
					radius = '0';
					break;
				case 'rounded':
				default:
					radius = '8px';
					break;
			}
			root.style.setProperty('--background-radius', radius);
		});

		// Search functionality
		searchInput.addEventListener('input', (e) => {
			const searchTerm = e.target.value.toLowerCase();
			iconItems.forEach(item => {
				const name = item.dataset.name;
				const className = item.dataset.class;
				const matches = name.includes(searchTerm) || className.includes(searchTerm);
				item.style.display = matches ? 'block' : 'none';
			});
		});

		// Copy functionality using event delegation
		iconGrid.addEventListener('click', async (e) => {
			if (e.target.classList.contains('copy-btn')) {
				e.preventDefault();
				const textToCopy = e.target.dataset.copy;
				
				try {
					await navigator.clipboard.writeText(textToCopy);
											
				} catch (err) {
					console.error('Failed to copy:', err);
					// Fallback for older browsers
					const textarea = document.createElement('textarea');
					textarea.value = textToCopy;
					document.body.appendChild(textarea);
					textarea.select();
					document.execCommand('copy');
					document.body.removeChild(textarea);
				}
			}
		});

		// Initialize styles
		root.style.setProperty('--icon-size', '48px');
		root.style.setProperty('--icon-color', '#000000');
		root.style.setProperty('--background-color', 'transparent');
		root.style.setProperty('--background-radius', '8px');
	})();
	</script>
</body>
</html>`;
}

module.exports = {
	generateDemo
};
