// Iconizer: Convert SVG files to CSS classes with mask properties
// This tool processes a directory of SVG files and generates:
// 1. CSS classes using CSS mask properties (modern alternative to icon fonts)
// 2. Interactive demo pages for browsing and testing icons
// 3. Both embedded (data URIs) and referenced (file paths) versions

const fs = require("fs");
const path = require("path");
const { optimize } = require("svgo");              // SVG optimization library
const minifySvgDataURI = require("mini-svg-data-uri"); // Converts SVG to compact data URIs
const { generateDemo } = require("./templates/demo-template");

// Get the input directory from command line arguments
const sourceDirectory = process.argv[2];

// Validate that a directory was provided and exists
if (!sourceDirectory || !fs.existsSync(sourceDirectory)) {
	console.error("Please provide a valid directory path as the first argument.");
	console.error("Usage: node iconizer.js ./path/to/svg/folder");
	process.exit(1);
}

// Define output directory structure
// This creates a organized folder structure for different output types:
// css/
//   ├── embedded-icons/     (SVGs as data URIs - self-contained)
//   │   ├── demo.html
//   │   └── icon-css/
//   │       ├── individual-icon.css files
//   │       └── _icons.css (combined)
//   └── referenced-icons/   (SVGs as file references - smaller CSS)
//       ├── demo.html
//       └── icon-css/
//           └── _icons.css
const embeddedDirectory = path.join(sourceDirectory, "css", "embedded-icons");
const referencedDirectory = path.join(sourceDirectory, "css", "referenced-icons");
const embeddedCssDirectory = path.join(embeddedDirectory, "icon-css");
const referencedCssDirectory = path.join(referencedDirectory, "icon-css");

// Array of all directories that need to be created
const outputDirectories = [
	path.join(sourceDirectory, "css"),
	embeddedDirectory,
	referencedDirectory,
	embeddedCssDirectory,
	referencedCssDirectory,
];

// Create all necessary output directories
// The recursive option ensures parent directories are created if they don't exist
outputDirectories.forEach((directoryPath) => {
	if (!fs.existsSync(directoryPath)) {
		fs.mkdirSync(directoryPath, { recursive: true });
	}
});

// Base CSS styles that all icons need
// This includes the essential mask properties, sizing, and display behavior
const baseIconStyles = `/* Base styles for all icons - include this first */
[class*="-icon"] {
	mask-size: 100% 100%;
	background-color: currentColor;
	mask-repeat: no-repeat;
	mask-position: center;
	height: 1em;
	width: 1em;
	display: inline-block;
}

`;

// Data collectors for processing results
const processedIcons = [];          // Array to store icon metadata objects
let embeddedCssRules = "";          // Accumulated CSS for embedded version
let referencedCssRules = "";        // Accumulated CSS for referenced version

// Process all SVG files in the source directory
// This is the main processing pipeline that converts SVGs to CSS classes
fs.readdir(sourceDirectory, (error, files) => {
	if (error) {
		console.error("Failed to read the source directory:", error.message);
		return;
	}

	// Filter and process only SVG files
	files.forEach((fileName) => {
		const filePath = path.join(sourceDirectory, fileName);
		const fileExtension = path.extname(filePath);
		
		// Only process files with .svg extension
		if (fileExtension.toLowerCase() === ".svg") {
			try {
				// Read the SVG file content
				const svgContent = fs.readFileSync(filePath, "utf8");
				
				// Optimize the SVG using SVGO
				// This removes unnecessary code, comments, and metadata to reduce file size
				const optimizationResult = optimize(svgContent, {
					multipass: true,  // Run optimization multiple times for better results
				});
				
				const optimizedSvg = optimizationResult.data;
				
				// Convert optimized SVG to a compact data URI
				// This creates a string like: data:image/svg+xml,<encoded-svg>
				const svgDataUri = minifySvgDataURI(optimizedSvg);
				
				// Generate CSS class name and human-readable display name
				const cssClassName = createSafeCssClassName(fileName) + "-icon";
				const displayName = createDisplayName(fileName);

				// Create icon metadata object
				// This contains all the information needed for templates and CSS generation
				const iconMetadata = {
					className: cssClassName,           // CSS class name (e.g., "home-icon")
					name: displayName,                // Human readable name (e.g., "Home")
					fileName: fileName,               // Original filename (e.g., "home.svg")
					svgDataUri: svgDataUri,          // Data URI for embedded version
					relativePath: `../../${fileName}`, // Relative path for referenced version
					optimizedSvg: optimizedSvg       // Optimized SVG content
				};

				processedIcons.push(iconMetadata);

				// Generate CSS rules for both embedded and referenced versions
				// Embedded version uses data URIs (self-contained, larger CSS)
				const embeddedCssRule = `.${cssClassName} { mask-image: url("${svgDataUri}"); }`;
				
				// Referenced version uses file paths (smaller CSS, requires SVG files)
				const referencedCssRule = `.${cssClassName} { mask-image: url("../../${fileName}"); }`;

				// Write individual CSS file for embedded version
				// This allows developers to import just the icons they need
				const individualCssPath = path.join(embeddedCssDirectory, `${cssClassName}.css`);
				fs.writeFileSync(individualCssPath, embeddedCssRule);

				// Accumulate CSS rules for combined stylesheets
				embeddedCssRules += `${embeddedCssRule}\n`;
				referencedCssRules += `${referencedCssRule}\n`;

			} catch (processingError) {
				console.error(`Error processing ${fileName}:`, processingError.message);
				// Continue processing other files even if one fails
			}
		}
	});

	// Generate interactive demo HTML files
	// These demos provide a user-friendly interface for browsing and testing icons
	const embeddedDemo = generateDemo({
		title: `${path.basename(sourceDirectory)} Icons`,  // Use directory name as title
		icons: processedIcons,
		embedded: true,                                     // This demo uses embedded data URIs
		iconStyles: embeddedCssRules
	});

	const referencedDemo = generateDemo({
		title: `${path.basename(sourceDirectory)} Icons`,
		icons: processedIcons,
		embedded: false,                                    // This demo references external SVG files
		iconStyles: referencedCssRules
	});

	// Write all output files
	// Demo HTML files with interactive interfaces
	fs.writeFileSync(path.join(embeddedDirectory, "demo.html"), embeddedDemo);
	fs.writeFileSync(path.join(referencedDirectory, "demo.html"), referencedDemo);
	
	// Write base icon styles to separate files
	fs.writeFileSync(path.join(embeddedCssDirectory, "_base-icons.css"), baseIconStyles);
	fs.writeFileSync(path.join(referencedCssDirectory, "_base-icons.css"), baseIconStyles);
	
	// Combined CSS files for easy inclusion in projects (includes base styles)
	fs.writeFileSync(path.join(embeddedCssDirectory, "_icons.css"), baseIconStyles + embeddedCssRules);
	fs.writeFileSync(path.join(referencedCssDirectory, "_icons.css"), baseIconStyles + referencedCssRules);

	// Report results to user
	console.log(`✅ Successfully processed ${processedIcons.length} SVG files`);
	console.log(`📁 Embedded demo: ${path.join(embeddedDirectory, "demo.html")}`);
	console.log(`📁 Referenced demo: ${path.join(referencedDirectory, "demo.html")}`);
});

/**
 * Creates a safe CSS class name from a filename
 * 
 * This function handles edge cases and ensures the resulting class name is valid CSS:
 * - Removes file extensions
 * - Converts to lowercase kebab-case
 * - Handles leading numbers (CSS classes cannot start with digits)
 * - Removes invalid characters
 * - Prevents empty or invalid class names
 * 
 * @param {string} filename - The original filename (e.g., "arrow-left.svg")
 * @returns {string} - A safe CSS class name (e.g., "arrow-left")
 * 
 * Examples:
 * "arrow-left.svg" → "arrow-left"
 * "2-arrows.svg" → "icon-2-arrows" (prefixed because starts with number)
 * "icon@2x.svg" → "icon-2x" (special characters removed)
 * ".hidden.svg" → "unnamed" (fallback for invalid names)
 */
function createSafeCssClassName(filename) {
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

/**
 * Creates a human-readable display name from a filename
 * 
 * This function converts technical filenames into user-friendly display names:
 * - Removes file extensions
 * - Converts separators to spaces
 * - Applies Title Case formatting
 * - Handles multiple consecutive spaces
 * 
 * @param {string} filename - The original filename (e.g., "arrow-left-bold.svg")
 * @returns {string} - A formatted display name (e.g., "Arrow Left Bold")
 * 
 * Examples:
 * "arrow-left-bold.svg" → "Arrow Left Bold"
 * "user_profile.svg" → "User Profile"
 * "home-icon.svg" → "Home Icon"
 * "icon@2x.svg" → "Icon 2x"
 */
function createDisplayName(filename) {
	// Remove file extension
	const nameWithoutExtension = filename.replace(/\.[^/.]+$/, "");
	
	// Convert to display name:
	// 1. Replace non-alphanumeric characters with spaces
	// 2. Collapse multiple spaces into single spaces
	// 3. Trim whitespace from start and end
	// 4. Split into words and apply Title Case
	// 5. Join back with spaces
	return nameWithoutExtension
		.replace(/[^a-zA-Z0-9]/g, " ")
		.replace(/\s+/g, " ")
		.trim()
		.split(" ")
		.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
}
