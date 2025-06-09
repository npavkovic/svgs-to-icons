const fs = require("fs");
const path = require("path");
const { optimize } = require("svgo"); // SVG optimization library
const minifySvgDataURI = require("mini-svg-data-uri"); // Converts SVG to compact data URIs
const { generateDemo } = require("./templates/demo-template");

class SvgIconProcessor {
	constructor(config) {
		this.config = config;
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
			await this.generateDemos();
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

		// Handle empty or whitespace-only filenames
		if (!nameWithoutExtension || nameWithoutExtension.trim() === "") {
			return "unnamed";
		}

		// Convert to valid CSS class name:
		// 1. Replace any non-alphanumeric characters (except hyphens and underscores) with hyphens
		// 2. Remove leading hyphens
		// 3. Collapse multiple consecutive hyphens into single hyphens
		// 4. Convert to lowercase
		let className = nameWithoutExtension
			.replace(/[^a-zA-Z0-9_-]/g, "-")
			.replace(/^-+/g, "")
			.replace(/-+/g, "-")
			.toLowerCase();

		// CSS class names cannot start with a digit
		// If the name starts with a number, prefix it with "icon-"
		if (/^[0-9]/.test(className)) {
			className = "icon-" + className;
		}

		// Handle edge case where processing results in empty string or just hyphens
		if (className === "" || className === "-" || className === "_") {
			className = "unnamed";
		}

		return className;
	}

	createDisplayName(filename) {
		// Remove file extension
		const nameWithoutExtension = filename.replace(/\.[^/.]+$/, "");

		console.log(`Creating display name for: ${nameWithoutExtension}`);
		const newName = nameWithoutExtension
			.replace(/[^a-zA-Z0-9]/g, " ")
			.replace(/\s+/g, " ")
			.trim()
			.split(" ")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(" ");

		console.log(`Display name created: ${newName}`);
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
		console.log(`Found ${files.length} files in input directory.`);
		const svgFiles = files
			.filter((file) => path.extname(file).toLowerCase() === ".svg")
			.map((file) => path.join(this.config.input, file));
		if (files.length === 0) {
			throw new Error("No SVG files found in the input directory.");
		} else this.iconBuild.svgFiles = svgFiles;
	}

	async processAndWriteIcons() {
		// Base CSS styles that all icons need
		// This includes the essential mask properties, sizing, and display behavior

		const Iconselector =
			(this.config.prefix ? `[class*="${this.config.prefix}"]` : "") +
			(this.config.postfix ? `[class*="${this.config.postfix}"]` : ""); // CSS selector for icons with the configured prefix

		const baseIconStyles = `${Iconselector} {
	mask-size: 100% 100%;
	background-color: currentColor;
	mask-repeat: no-repeat;
	mask-position: center;
	height: 1em;
	width: 1em;
	display: inline-block;
}`;

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
					multipass: true, // Run optimization multiple times for better results
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
			const referencedCssRule = `.${cssClassName} { mask-image: url("../icons/${fileName}"); }`;

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

		console.log(this.iconBuild.processedIcons);
		// Generate interactive demo HTML files
		// These demos provide a user-friendly interface for browsing and testing icons
		const embeddedDemo = generateDemo({
			title: "Embedded Icons",
			icons: this.iconBuild.processedIcons,
			embedded: true, // This demo uses embedded data URIs
			iconStyles: this.iconBuild.embeddedCssRules,
		});

		const referencedDemo = generateDemo({
			title: "Referenced Icons",
			icons: this.iconBuild.processedIcons,
			embedded: false, // This demo references external SVG files
			iconStyles: this.iconBuild.referencedCssRules,
		});

		// Write all output files
		// Demo HTML files with interactive interfaces

		await fs.promises.writeFile(
			path.join(this.iconBuild.directories.embeddedIcons, "demo.html"),
			embeddedDemo
		);
		await fs.promises.writeFile(
			path.join(this.iconBuild.directories.referencedIcons, "demo.html"),
			referencedDemo
		);
	}
}

module.exports = {
	SvgIconProcessor,
};
