const fs = require("fs");
const path = require("path");
const { optimize } = require("svgo");
const minifySvgDataURI = require("mini-svg-data-uri");

const folderName = process.argv[2];

if (!folderName || !fs.existsSync(folderName)) {
	console.error("Please provide a valid directory path as the first argument.");
	process.exit(1);
}

const embeddedDirectory = `${folderName}/css/embedded-icons`;
const referencedDirectory = `${folderName}/css/referenced-icons`;
const embeddedDirectoryCss = `${folderName}/css/embedded-icons/icon-css`;
const referencedDirectoryCss = `${folderName}/css/referenced-icons/icon-css`;

const directories = [
	`${folderName}/css`,
	embeddedDirectory,
	referencedDirectory,
	embeddedDirectoryCss,
	referencedDirectoryCss,
];

directories.forEach((directoryName) => {
	if (!fs.existsSync(directoryName)) fs.mkdirSync(directoryName);
});

var demoHtml = "";
var embeddedIconstyles = "";
var referencedIconstyles = "";

fs.readdir(folderName, (error, files) => {
	if (error) {
		console.error("Failed to read the folder:", error.message);
		return;
	}
	files.forEach((file) => {
		const filePath = `${folderName}/${file}`;
		const fileExt = path.extname(filePath);
		if (fileExt === ".svg") {
			try {
				const svgString = fs.readFileSync(filePath, "utf8");
				result = optimize(svgString, {
					// all config fields are also available here
					multipass: true,
				});
				const optimizedSvg = result.data;
				const miniSvg = minifySvgDataURI(optimizedSvg);
				const cssClassName = stringToClassName(file) + "-icon";
				const embeddedCssFilePath = `${embeddedDirectoryCss}/${cssClassName}.css`;
				const embeddedCss = `.${cssClassName} { -webkit-mask: url("${miniSvg}") no-repeat; }`;

				fs.writeFileSync(embeddedCssFilePath, embeddedCss);

				const referencedCss = `.${cssClassName} { -webkit-mask: url("../../${file}") no-repeat; }`;
				// const referencedCssFilePath = `${embeddedDirectoryCss}/${cssClassName}.css`;
				// fs.writeFileSync(referencedCssFilePath, referencedCss);

				demoHtml += `<div><div class="${cssClassName} icon"></div><p>${cssClassName}</p></div>`;
				embeddedIconstyles += ` ${embeddedCss}`;
				referencedIconstyles += ` ${referencedCss}`;
			} catch (error) {
				console.error(`File system error:`, error.message);
			}
		}
	});

	const embeddedHtml =
		`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Document</title><style>${embeddedIconstyles} body {font-family: "Helvetica Neue", sans-serif; background: #EFEFEF; padding: 2rem; } p {font-size: .8rem; color: #666; }.char-grid {display: grid;
		grid-template-columns: repeat(auto-fit, 120px);
		grid-template-rows: auto;
		gap: 24px;
		counter-reset: icono;
		} .char-grid > div { padding: 12px; background: white} .icon { font-size: 3rem } .char-grid > div p::before {counter-increment: icono; content: counter(icono) ". ";} [class*="-icon"] { -webkit-mask-size: 100% 100%;
			background-color: currentColor;
			-webkit-mask-repeat: no-repeat;
			  height: 1em;
			  width: 1em;}
</style></head><body><h1>${folderName} Icons</h1><div class="char-grid">` +
		demoHtml +
		"</div></body></html>";

	fs.writeFileSync(`${embeddedDirectory}/demo.html`, embeddedHtml);
	fs.writeFileSync(`${embeddedDirectoryCss}/_icons.css`, embeddedIconstyles);

	const referencedHtml =
		`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Document</title><style>${referencedIconstyles} body {font-family: "Helvetica Neue", sans-serif; background: #EFEFEF; padding: 2rem; } p {font-size: .8rem; color: #666; }.char-grid {display: grid;
	grid-template-columns: repeat(auto-fit, 120px);
	grid-template-rows: auto;
	gap: 24px;
	counter-reset: icono;
	} .char-grid > div { padding: 12px; background: white} .icon { font-size: 3rem } .char-grid > div p::before {counter-increment: icono; content: counter(icono) ". ";} [class*="-icon"] { -webkit-mask-size: 100% 100%;
		background-color: currentColor;
		-webkit-mask-repeat: no-repeat;
		  height: 1em;
		  width: 1em;}
</style></head><body><h1>${folderName} Icons</h1><div class="char-grid">` +
		demoHtml +
		"</div></body></html>";

		fs.writeFileSync(`${referencedDirectory}/demo.html`, referencedHtml);
		fs.writeFileSync(`${referencedDirectoryCss}/_icons.css`, referencedIconstyles);
});

function stringToClassName(str) {
	// remove any file extensions from the input string
	const fileName = str.replace(/\.[^/.]+$/, "");
	// replace non-alphanumeric characters with hyphens
	const hyphenatedName = fileName
		.replace(/[^a-zA-Z0-9_-]/g, "-")
		.replace(/^-+/g, "") // remove any leading hyphens
		.replace(/-+/g, "-") // replace multiple hyphens with a single hyphen
		.toLowerCase();
	return hyphenatedName;
}
