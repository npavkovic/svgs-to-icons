const fs = require("fs");
const path = require("path");
const { optimize } = require("svgo"); // SVG optimization library
const minifySvgDataURI = require("mini-svg-data-uri"); // Converts SVG to compact data URIs
const { generateDemo } = require("./templates/demo-template");

class SvgIconProcessor {
	constructor(config) {
		this.config = config;
		this.classNameCounts = {}; // Track class name usage to prevent collisions
		this.iconBuild = {
			success: false,
			warnings: [],
			processedIcons: [],
			directories: null,
			svgFiles: [],
			embeddedCssRules: "",
			referencedCssRules: "",
			error: null,
		};
	}

	async process() {
		try {
			await this.createOutputDirectories();
			await this.getSvgFiles();
			await this.processAndWriteIcons();
			if (this.config.demo) {
				await this.generateDemos();
			}
			this.iconBuild.success = true;
			return this.iconBuild;
		} catch (error) {
			this.iconBuild.error = error.message;
			return this.iconBuild;
		}
	}

	createSafeCssClassName(filename) {
		// Remove file extension (everything after the last dot)
		const nameWithoutExtension = filename.replace(/\.[^/.]+$/, "");

		let className;

		// Handle empty or whitespace-only filenames
		if (!nameWithoutExtension || nameWithoutExtension.trim() === "") {
			// Set className to "unnamed" but continue to collision detection
			className = "unnamed";
		} else {
			// Convert filename to valid CSS class name following these rules:
			// 1. CSS class names can contain: letters (a-z, A-Z), digits (0-9), hyphens (-), and underscores (_)
			// 2. CSS class names cannot start with a digit
			// 3. CSS class names should not have leading/trailing hyphens (poor practice)
			// 4. Multiple consecutive hyphens should be collapsed to single hyphens
			// 5. Case-insensitive (we normalize to lowercase)
			//
			// Processing steps:
			// 1. Replace invalid characters (anything not alphanumeric, hyphen, or underscore) with hyphens
			// 2. Remove leading hyphens
			// 3. Collapse multiple consecutive hyphens into single hyphens
			// 4. Remove trailing hyphens
			// 5. Convert to lowercase
			className = nameWithoutExtension
				.replace(/[^a-zA-Z0-9_-]/g, "-") // Step 1: Replace invalid chars with hyphens
				.replace(/^-+/g, "") // Step 2: Remove leading hyphens
				.replace(/-+/g, "-") // Step 3: Collapse multiple hyphens
				.replace(/-+$/g, "") // Step 4: Remove trailing hyphens
				.toLowerCase(); // Step 5: Normalize to lowercase

			// CSS class names cannot start with a digit - prefix with "i" if they do
			if (/^[0-9]/.test(className)) {
				className = "i" + className;
			}

			// Handle edge cases where processing results in empty string or just punctuation
			// This can happen with filenames like: "", ".", "_", "!", "@#$", etc.
			if (className === "" || className === "-" || className === "_") {
				className = "unnamed";
			}
		}

		// Handle collisions by tracking usage and adding numeric suffixes
		this.classNameCounts[className] =
			(this.classNameCounts[className] || 0) + 1;
		const count = this.classNameCounts[className];

		// First occurrence gets no suffix, subsequent occurrences get -1, -2, etc.
		return count === 1 ? className : `${className}-${count - 1}`;
	}

	createDisplayName(filename) {
		// Remove file extension
		const nameWithoutExtension = filename.replace(/\.[^/.]+$/, "");

		const newName = nameWithoutExtension
			.replace(/[^a-zA-Z0-9]/g, " ")
			.replace(/\s+/g, " ")
			.trim()
			.split(" ")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(" ");

		return newName || "Unnamed Icon"; // Fallback if the name is empty
	}

	async createOutputDirectories() {
		// Create all necessary output directories

		// 1. Directory Setup
		this.iconBuild.directories = {};
		this.iconBuild.directories.embeddedIcons = path.join(
			this.config.output,
			"embedded-icons"
		);
		this.iconBuild.directories.referencedIcons = path.join(
			this.config.output,
			"referenced-icons"
		);
		this.iconBuild.directories.svgDestination = path.join(
			this.iconBuild.directories.referencedIcons,
			"icons"
		);

		await Promise.all(
			Object.keys(this.iconBuild.directories).map((directoryKey) =>
				fs.promises.mkdir(this.iconBuild.directories[directoryKey], {
					recursive: true,
				})
			)
		);
	}

	async getSvgFiles() {
		// Returns an array of SVG file paths from the input directory
		const files = await fs.promises.readdir(this.config.input);
		const svgFiles = files
			.filter((file) => path.extname(file).toLowerCase() === ".svg")
			.map((file) => path.join(this.config.input, file));
		if (files.length === 0) {
			throw new Error("No SVG files found in the input directory.");
		} else this.iconBuild.svgFiles = svgFiles;
	}

	async processAndWriteIcons() {
		const iconSelector =
			(this.config.prefix ? `[class*="${this.config.prefix}"]` : "") +
			(this.config.postfix ? `[class*="${this.config.postfix}"]` : ""); // CSS selector for icons with the configured prefix

		// Store the selector in iconBuild for use in templates
		this.iconBuild.iconSelector = iconSelector;

		// Base CSS styles that all icons need
		// This includes the essential mask properties, sizing, and display behavior

		const baseIconStyles = `${iconSelector} {
	mask-size: 100% 100%;
	background-color: currentColor;
	mask-repeat: no-repeat;
	mask-position: center;
	height: 1em;
	width: 1em;
	display: inline-block;
}`;

		// WEBKIT PREFIX MODIFICATION: For older Safari support (Safari 10.1-13.x),
		// modify the baseIconStyles to include webkit prefixes:
		//
		// const baseIconStyles = `${iconSelector} {
		//     -webkit-mask-size: 100% 100%;
		//     mask-size: 100% 100%;
		//     -webkit-mask-repeat: no-repeat;
		//     mask-repeat: no-repeat;
		//     -webkit-mask-position: center;
		//     mask-position: center;
		//     background-color: currentColor;
		//     height: 1em;
		//     width: 1em;
		//     display: inline-block;
		// }`;

		// Data collectors for processing results
		let embeddedCssRules = ""; // Accumulated CSS for embedded version
		let referencedCssRules = ""; // Accumulated CSS for referenced version

		// Filter and process SVG files
		for (const filePath of this.iconBuild.svgFiles) {
			const svgContent = await fs.promises.readFile(filePath, "utf8");
			const fileName = path.basename(filePath); // Get the filename (e.g., "home.svg")

			let optimizedSvg;
			try {
				// Optimize the SVG using SVGO
				// This removes unnecessary code, comments, and metadata to reduce file size
				optimizedSvg = optimize(svgContent, {
					multipass: true,
					plugins: [
						{
							name: "preset-default",
							params: {
								overrides: {
									removeViewBox: false,
								},
							},
						},
						"removeDimensions",
					],
				}).data;
			} catch (error) {
				this.iconBuild.warnings.push(
					`Skipping ${fileName}. SVG optimization failed: ${error.message}`
				);
				continue;
			}

			if (
				!optimizedSvg ||
				optimizedSvg.length === 0 ||
				!optimizedSvg.includes("<svg")
			) {
				this.iconBuild.warnings.push(
					`Skipping ${fileName}: malformed or empty SVG.`
				);
				continue;
			}

			// Convert optimized SVG to a compact data URI
			// This creates a string like: data:image/svg+xml,<encoded-svg>
			const svgDataUri = minifySvgDataURI(optimizedSvg);

			if (!svgDataUri.startsWith("data:image/svg+xml,")) {
				this.iconBuild.warnings.push(`Invalid SVG data URI for ${fileName}`);
				continue;
			}

			// Generate CSS class name and human-readable display name
			const cssClassName =
				this.config.prefix +
				this.createSafeCssClassName(fileName) +
				this.config.postfix;

			// Create icon metadata object
			// This contains all the information needed for templates and CSS generation

			this.iconBuild.processedIcons.push({
				className: cssClassName, // CSS class name (e.g., "home-icon")
				displayName: this.createDisplayName(fileName), // Human readable name (e.g., "Home")
				fileName, // Original filename (e.g., "home.svg")
			});

			// Generate CSS rules for both embedded and referenced versions
			// Embedded version uses data URIs (self-contained, larger CSS)
			const embeddedCssRule = `.${cssClassName} { mask-image: url("${svgDataUri}"); }`;

			// Referenced version uses file paths (smaller CSS, requires SVG files)
			const referencedCssRule = `.${cssClassName} { mask-image: url("./icons/${fileName}"); }`;

			// WEBKIT PREFIX MODIFICATION: For older Safari support (Safari 10.1-13.x),
			// replace the above two CSS rule definitions with webkit-prefixed versions
			// using CSS custom properties to avoid duplicating large data URIs:
			//
			// const embeddedCssRule = `.${cssClassName} { --svg: url("${svgDataUri}"); -webkit-mask-image: var(--svg); mask-image: var(--svg); }`;
			// const referencedCssRule = `.${cssClassName} { --svg: url("./icons/${fileName}"); -webkit-mask-image: var(--svg); mask-image: var(--svg); }`;
			//
			// The CSS custom property approach keeps file sizes smaller by avoiding duplication of data URIs.

			// Accumulate CSS rules for combined stylesheets
			this.iconBuild.embeddedCssRules += `${embeddedCssRule}\n`;
			this.iconBuild.referencedCssRules += `${referencedCssRule}\n`;

			// Write the SVG file to the referenced icons directory
			await fs.promises.writeFile(
				path.join(this.iconBuild.directories.svgDestination, fileName),
				optimizedSvg
			);
		}

		// Write the CSS files for embedded and referenced versions
		await fs.promises.writeFile(
			path.join(this.iconBuild.directories.embeddedIcons, "icons.css"),
			baseIconStyles + this.iconBuild.embeddedCssRules
		);
		await fs.promises.writeFile(
			path.join(this.iconBuild.directories.referencedIcons, "icons.css"),
			baseIconStyles + this.iconBuild.referencedCssRules
		);
	}

	async generateDemos() {
		// Generate interactive demo HTML files
		// These demos provide a user-friendly interface for browsing and testing icons
		const embeddedDemo = generateDemo({
			title: "Embedded Icons",
			embedded: true, // This demo uses embedded data URIs
			iconBuild: this.iconBuild,
			sourceDirectory: this.config.input,
		});

		const referencedDemo = generateDemo({
			title: "Referenced Icons",
			embedded: false, // This demo references external SVG files
			iconBuild: this.iconBuild,
			sourceDirectory: this.config.input,
		});

		// Write all output files
		// Demo HTML files with interactive interfaces

		const embeddedDemoPath = path.join(
			this.iconBuild.directories.embeddedIcons,
			"index.html"
		);
		const referencedDemoPath = path.join(
			this.iconBuild.directories.referencedIcons,
			"index.html"
		);

		await fs.promises.writeFile(embeddedDemoPath, embeddedDemo);
		await fs.promises.writeFile(referencedDemoPath, referencedDemo);

		// Store demo paths in iconBuild
		this.iconBuild.demoPaths = {
			embedded: embeddedDemoPath,
			referenced: referencedDemoPath,
		};
	}
}

module.exports = {
	SvgIconProcessor,
};
