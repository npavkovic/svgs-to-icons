// Import color system from separate module
const colors = require("./colors");

function generateDemo({ title, embedded, iconBuild, sourceDirectory }) {

	const demoType = embedded ? "Embedded Icons" : "Referenced Icons";

	const description = embedded
		? `${iconBuild.processedIcons.length} icons generated with embedded SVG data. These are self-contained; only the CSS file is needed.<br>Source: ${sourceDirectory}<br>Output: ${iconBuild.directories.embeddedIcons}`
		: `${iconBuild.processedIcons.length} Icons generated with references to external SVG files. You’ll need both the CSS and the folder of SVG files to use these icons.<br>Source: ${sourceDirectory}<br>Output: ${iconBuild.directories.referencedIcons}`;

	// Generate color options for select elements
	const colorOptions = Object.keys(colors)
		.map((colorKey) => {
			const color = colors[colorKey];
			// "Black" and "Transparent" have been inserted in the HTML already
			if (color.name !== "Transparent" && color.name !== "Black")
				return `<option value="${color.value}" data-name="${colorKey}">${color.name}</option>`;
		})
		.join("");

	// Generate icon grid 
	const iconItems = iconBuild.processedIcons
		.map(
			(icon) => `
		<div class="icon-item" data-name="${icon.displayName.toLowerCase()}" data-class="${
				icon.className
			}">
			<div class="icon-wrapper">
				<div class="${icon.className}"></div>
			</div>
			<div class="icon-info">
				<p class="icon-name">${icon.displayName}</p>
				<button class="icon-class" data-copy='&lt;span class=&quot;${
				icon.className
			}&quot;&gt;&lt;/span&gt;' title="Copy '&lt;span class=\"${
				icon.className
			}"&gt;&lt;/span&gt;">${
					icon.className
				}
				</button>
</p>
			</div>
		</div>
	`
		)
		.join("");

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
			--primary: #444;
		}

		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}

		body {
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
			background: hsl(0, 0%, 99%);
			color: #444;
			line-height: 1.6;
			padding: 24px;
			min-height: 100vh;
			text-wrap: pretty;
		}

		a {
			color: inherit;
			text-underline-offset: 5px;
			text-decoration-color: #666;
		}

		.container {
			max-width: 1200px;
			margin: 0 auto;
		}

		h1 {
			font-size: 2.5rem;
			text-align: center;
			margin-bottom: 8px;
			color: var(--primary);
		}

		.subtitle, .subtitle-file-protocol  {
			text-align: center;
			opacity: 0.7;
			font-size: 1rem;
			max-width: 725px;
			margin: 0 auto 54px auto;
		}

		body.file-protocol .subtitle { display: none; }
		.subtitle-file-protocol { display: none; }
		body.file-protocol .subtitle-file-protocol { display: block; }

		/* Control Panel */
		#control-panel {
			border-radius: 16px;
			padding: 24px;
			margin-bottom: 32px;
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
			gap: 20px;
			border: 1px solid var(--standard-outline);
			background: white;
		}
		
		body.file-protocol #control-panel { display: none; }

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
			margin-bottom: 4px;
		}

		select, input {
			padding: 12px;
			border: 1px solid var(--standard-outline);
			border-radius: 8px;
			font-family: inherit;
			font-size: 0.875rem;
			transition: border-color 0.2s ease;
		}

		select { /* Style select elements specifically for custom caret */
			appearance: none; /* Remove default arrow */
			-webkit-appearance: none;
			-moz-appearance: none;
			background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' fill='currentColor' viewBox='0 0 16 16'%3E%3Cpath d='M8 11.207 3.396 6.604l.707-.707L8 9.793l3.896-3.896.707.707L8 11.207z'/%3E%3C/svg%3E");
			background-repeat: no-repeat;
			background-position: right 12px center; /* Position custom arrow */
			background-size: 1em; /* Size the arrow relative to font size */
			padding-right: 36px; /* Adjust right padding to make space for the arrow */
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
		
		body.file-protocol #icon-grid { display: none; }

		.icon-item {
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
			transition: background-color 0.2s ease, border-radius 0.2s ease;
		}

		.icon-info {
			display: flex;
			flex-direction: column;
			gap: 4px;
		}

		.icon-name {
			font-weight: 500;
			font-size: 0.875rem;
		}

		.icon-class {
			appearance: none;
			-webkit-appearance: none;
			font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
			font-size: 0.75rem;
			background: rgba(103, 80, 164, 0.1);
			padding: 4px 8px;
			border-radius: 4px;
			word-break: break-all;
			position: relative;
			color: #666;
			border: none;
		}

		/* ::after pseudo-element: Copy Icon */
		.icon-class::after {
			content: "";
			position: absolute;
			top: 0;
			right: 0;
			width: 24px;
			height: 24px;
			border-radius: 100%;
			background-repeat: no-repeat;
			background-position: center;
			background-size: 16px 16px;
			transform: translate(50%, -50%);
			opacity: 0; /* Hidden by default */
			transition: opacity 0.2s ease;
			pointer-events: none; /* To ensure clicks go to the button */
			background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='%23FFF'%3E%3Cpath d='M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z'/%3E%3C/svg%3E");
			background-color: green;
		}

		/* Show copy icon (::after) on hover/focus */
		.icon-class:hover::after,
		.icon-class:focus::after {
			opacity: 1;
		}

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
		${embedded ? iconBuild.embeddedStyles : iconBuild.referencedStyles}	
    </style>
</head>
<body>
	<div class="container">
		<h1>${title}</h1>
		<p class="subtitle">${description}</p>
		<p class="subtitle-file-protocol">Referenced icons cannot be displayed if they’re loaded into the browser from a file. You can use a server to view this file, or open the <a href="${
			iconBuild.directories.embeddedIcons + "/demo.html"
		}">embedded icon demo</a>.</p>
		
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
                    <option value="transparent" selected>Transparent</option>   
					<option value="#000000">Black</option>
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
				<label for="search-input">Search Icon Names</label>
				<input type="text" id="search-input" placeholder="Search by name..." />
			</div>
		</div>

		<div id="icon-grid">
			${iconItems}
		</div>
	</div>

	<script>
	(function() {
		const isEmbedded = ${embedded};
		$ = selector => document.querySelector(selector);
		$s = selector => document.querySelectorAll(selector);
		$id = id => document.getElementById(id);

		const root = document.documentElement;
		const iconSizeSelect = $id('icon-size-select');
		const iconColorSelect = $id('icon-color-select');
		const backgroundColorSelect = $id('background-color-select');
		const backgroundShapeSelect = $id('background-shape-select');
		const searchInput = $id('search-input');
		const iconItems = $s('.icon-item');
		const iconGrid = $id('icon-grid');

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
			const clickedButton = e.target.closest('.icon-class');

			if (clickedButton) {
				e.preventDefault();
				const textToCopy = clickedButton.dataset.copy;
				
				try {
					await navigator.clipboard.writeText(textToCopy);
				} catch (err) {
					console.error('Failed to copy. Modern Clipboard API might not be supported or permission denied:', err);
				}
			}
		});

		// Initialize styles
		root.style.setProperty('--icon-size', '48px');
		root.style.setProperty('--icon-color', '#000000');
		root.style.setProperty('--background-color', 'transparent');
		root.style.setProperty('--background-radius', '8px');

		if (window.location.protocol === 'file:' && !isEmbedded) {
			document.body.classList.add('file-protocol');
		}
	})();
	</script>
</body>
</html>`;
}

module.exports = {
	generateDemo,
};
