#!/usr/bin/env node

/**
 * SVGs-to-Icons CLI Tool
 *
 * Converts SVG files to CSS classes with mask properties.
 */

const fs = require("fs");
const path = require("path");
const { program } = require("commander");
const packageJson = require("./package.json");
const { SvgIconProcessor } = require("./svgs-to-icons-core");

// Default configuration - these are the fallback values for all options
const DEFAULT_CONFIG = {
	input: null, // Input directory (required)
	output: null, // Output directory (will default to dist/<input-directory-name>)
	prefix: "", // Prefix for CSS class names (e.g., 'ui-' -> 'ui-home-icon')
	postfix: "-icon", // Postfix for CSS class names (e.g., '-svg' -> 'home-svg')
	embedded: true, // Generate embedded version (data URIs)
	referenced: true, // Generate referenced version (file paths)
	demo: true, // Generate interactive demo HTML files
};

/**
 * Loads configuration from external config file
 */
function loadConfigFile() {
	const configPath = path.join(process.cwd(), "svgs-to-icons.config.js");

	if (fs.existsSync(configPath)) {
		try {
			const config = require(configPath);
			return config;
		} catch (error) {
			console.error(
				`Warning: Could not load config file ${configPath}:`,
				error.message
			);
		}
	}

	return {};
}

/**
 * Parses CLI arguments using Commander.js
 */
function parseCliArguments() {
	program
		.name("svgs-to-icons")
		.description("Convert SVG files to CSS classes with mask properties")
		.version(packageJson.version)
		.argument("<input>", "input directory containing SVG files")
		.option("--output <dir>", "output parent directory")
		.option("--prefix <string>", "prefix for CSS class names")
		.option("--postfix <string>", "postfix for CSS class names")
		.option("--embedded", "generate embedded version (data URIs)")
		.option("--referenced", "generate referenced version (file paths)")
		.option("--demo", "generate interactive demo HTML files")
		.addHelpText(
			"after",
			`
Examples:
	$ svgs-to-icons ./icons
	$ svgs-to-icons ./icons --output ./dist --prefix ui-
	$ svgs-to-icons ./icons --demo false
	$ svgs-to-icons ./icons --prefix btn- --postfix -icon
`
		)
		.parse();

	const opts = program.opts();
	const args = program.args;

	// Create new config object with spread operator and add input argument
	const cliConfig = { ...opts, input: args[0] };

	// Remove undefined options
	for (const key in cliConfig) cliConfig[key] ?? delete cliConfig[key];

	return cliConfig;
}

async function main() {
	try {
		// 1. Parse CLI arguments
		const cliConfig = parseCliArguments();

		// 2. Load external config file
		const fileConfig = loadConfigFile();

		// 3. Merge configurations: defaults → file → CLI
		const mergedConfig = {
			...DEFAULT_CONFIG,
			...fileConfig,
			...cliConfig,
		};

		// 4. Validate input directory first
		if (!mergedConfig.input) {
			console.error("Configuration error: Input directory is required");
			process.exit(1);
		}
		if (!fs.existsSync(mergedConfig.input)) {
			console.error(
				`Configuration error: Input directory does not exist: ${mergedConfig.input}`
			);
			process.exit(1);
		}
		if (!fs.statSync(mergedConfig.input).isDirectory()) {
			console.error(
				`Configuration error: Input path is not a directory: ${mergedConfig.input}`
			);
			process.exit(1);
		}
		
		mergedConfig.input = path.resolve(mergedConfig.input);

		// 5. Set output directory (now safe to use input path)
		const inputDirName = path.basename(mergedConfig.input);
		if (!mergedConfig.output) {
			mergedConfig.output = path.join("./dist", inputDirName);
		} else {
			mergedConfig.output = path.join(mergedConfig.output, inputDirName);
		}

		mergedConfig.output = path.resolve(mergedConfig.output);

		// 6. Validate output directory and other constraints
		if (fs.existsSync(mergedConfig.output)) {
			try {
				fs.accessSync(mergedConfig.output, fs.constants.W_OK);
			} catch (error) {
				console.error(
					`Configuration error: Output directory is not writable: ${mergedConfig.output}`
				);
				process.exit(1);
			}
		} else {
			// Check if parent directory exists or can be created
			const parentDir = path.dirname(mergedConfig.output);
			try {
				if (!fs.existsSync(parentDir)) {
					fs.mkdirSync(parentDir, { recursive: true });
				}
				// Test if we can write to the parent directory
				fs.accessSync(parentDir, fs.constants.W_OK);
			} catch (error) {
				console.error(
					`Configuration error: Cannot create output directory: ${mergedConfig.output} (${error.message})`
				);
				process.exit(1);
			}
		}

		// 7. Validate logic constraints
		if (!mergedConfig.embedded && !mergedConfig.referenced) {
			console.error(
				"Configuration error: At least one output type must be enabled (embedded or referenced)"
			);
			process.exit(1);
		}

		// 8. Validate prefix and postfix

		// Validate prefix and postfix — something like this:
		// add a trailing hypen to the prefix if it doesn't have one
		// add a leading hypen to the postfix if it doesn't have one

		const cssIdentifierRegex = /^[a-zA-Z_][\w-]*$/;

		if (mergedConfig.prefix && !cssIdentifierRegex.test(mergedConfig.prefix)) {
			console.error("Error: prefix must be a valid CSS identifier");
			process.exit(1);
		}

		if (
			mergedConfig.postfix &&
			!cssIdentifierRegex.test(mergedConfig.postfix.replace(/^-/, ""))
		) {
			console.error("Error: postfix must be a valid CSS identifier");
			process.exit(1);
		}

		if (mergedConfig.prefix && !mergedConfig.prefix.endsWith("-")) {
			mergedConfig.prefix += "-";
		}
		if (mergedConfig.postfix && !mergedConfig.postfix.startsWith("-")) {
			mergedConfig.postfix = "-" + mergedConfig.postfix;
		}

		// 8. Call core processing function
		const result = await new SvgIconProcessor(mergedConfig).process();

		// 9. Handle results
		if (!result.success) {
			console.error("Processing failed:", result.error);
			process.exit(1);
		}

		// 10. Report success
		console.log("✅ Successfully processed SVG icons!");
		console.log(`📁 Output directory: ${mergedConfig.output}`);
		console.log(`🎯 Processed ${result.processedIcons.length} SVG files`);

		// 11. Show any warnings
		if (result.warnings && result.warnings.length > 0) {
			console.log("\n⚠️  Warnings:");
			result.warnings.forEach((warning) => console.log(`   - ${warning}`));
		}

		// Display paths to demo files if they were generated
		if (result.demoPaths) {
			console.log("\n✨ Demo files:");
			if (result.demoPaths.embedded) {
				const embeddedDemoUrl = `file://${path.resolve(result.demoPaths.embedded)}`;
				console.log(`   🔗 Embedded Demo (click to view): \x1B]8;;${embeddedDemoUrl}\x07${embeddedDemoUrl}\x1B]8;;\x07`);
			}
			if (result.demoPaths.referenced) {
				const referencedDemoPath = path.resolve(result.demoPaths.referenced);
				console.log(`   🔗 Referenced Demo: ${referencedDemoPath}`);
				console.log(`      To view file-referenced icons, a local server is needed. Please see README.md for further instructions.`);
			}
		}

	} catch (error) {
		console.error("Unexpected error:", error.message);
		process.exit(1);
	}
}

main();
