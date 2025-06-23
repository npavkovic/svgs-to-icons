# svgs-to-icons

`svgs-to-icons` takes a folder of SVGs and generates:

- **Optimized SVG files** with consistent, class-safe names
- **CSS classes** that render those icons using `-webkit-mask-image`, allowing them to be colorized with `currentColor`
- **Two versions of the CSS:**
  - **Embedded**: SVGs are inlined using `data:` URIs
  - **File-referenced**: SVGs are linked via `url("icon.svg")`
- **Demo HTML pages** for each version so you can preview the output

This gives you a modern, minimal, and scalable icon system that can be used in any HTML or CSS setup — no JS required.

## This is a good solution for you if...

- You have a directory full of SVG files you’d like to use as icons.
- You don’t want to install a JavaScript component library just to render icons.
- You don’t want to download an icon font.
- You’re looking for a solution that integrates seamlessly with vanilla HTML and CSS.
- You want to be able to use colorized icons in line with text.

## How to Use svgs-to-icons

### 0. Installation

```bash
# Clone the repository
git clone https://github.com/npavkovic/svgs-to-icons.git
cd svgs-to-icons

# Install dependencies
npm install
```

### 1. Create or gather a set of SVG icons in a folder:

```
./my-icons/
├── home.svg
├── user.svg
└── settings.svg
```

### 2. Run svgs-to-icons:

```bash
node svgs-to-icons.js ./my-icons
```

### 3. svgs-to-icons will:

- Optimize and sanitize the SVGs
- Rename them to class-safe names (i.e., no leading numerals, special characters, etc.) — see Limitations.
- Generate output at:

```
./my-icons/css/
├── embedded-icons/
│   ├── icon-css/
│   └── index.html
└── referenced-icons/
    ├── icon-css/
    └── index.html
```

### 4. Preview the results:

Upon completion, the script will output a direct link to the `embedded-icons/index.html` page (e.g., `file:///path/to/your/my-icons/css/embedded-icons/index.html`). In most modern terminals, you can Command-click (macOS) or Control-click (Windows/Linux) this link to open it directly in your default web browser. This version works locally without a server because the SVG data is embedded within the CSS.

The demo pages include interactive features like search and copy-to-clipboard functionality.

**Important for File-Referenced Icons:**

*   Viewing the `referenced-icons/index.html` page **requires a local web server**. Browsers restrict `file:///` pages from loading local file resources (like SVGs) for security reasons. See the FAQ section "Why do I need a server for file-referenced icons, and what about CORS?" for simple commands to start a local server.
*   If you host the generated SVG files on a different domain than your HTML pages in a production environment, the server hosting the SVG files **must** be configured to send appropriate CORS (Cross-Origin Resource Sharing) headers (e.g., `Access-Control-Allow-Origin: *` or your specific HTML domain). See the FAQ for more details on CORS.

### 5. Use the icons in your HTML:

```html
<!-- Include the CSS file -->
<link rel="stylesheet" href="my-icons/embedded-icons/icons.css">

<!-- Use the icons -->
<span class="home-icon"></span>
```

### 6. Style with CSS:

Use `font-size` and `color`, as for text styling.

```css
.home-icon {
  font-size: 1.25rem;
  color: #444;
}
```

## FAQ

### Quick Navigation
- [What's the difference between embedded and file-referenced CSS?](#whats-the-difference-between-embedded-and-file-referenced-css)
- [Why do I need a server for file-referenced icons, and what about CORS?](#why-do-i-need-a-server-for-file-referenced-icons-and-what-about-cors)
- [Why does svgs-to-icons use CSS masks?](#why-does-svgs-to-icons-use-css-masks)
- [How are the icons optimized?](#how-are-the-icons-optimized)
- [Why do you rename the icons?](#why-do-you-rename-the-icons)
- [Can I use `<i>` tags for icons?](#can-i-use-i-tags-for-icons)
- [Do these icons support color?](#do-these-icons-support-color)
- [Can I use this for emojis?](#can-i-use-this-for-emojis)
- [What's the difference between svgs-to-icons's approach and React/Vue icon components?](#whats-the-difference-between-svgs-to-iconss-approach-and-reactvue-icon-components)

### What’s the difference between embedded and file-referenced CSS?

svgs-to-icons generates both:

- **Embedded** icons are inlined into the CSS as data URIs. This makes your CSS self-contained and avoids HTTP requests — ideal for a small set of icons that are always needed. You can preview this version directly in a browser from your local file system.
- **File-referenced** icons are linked by `url(\"...\")` in CSS. This keeps your CSS smaller and lets browsers cache the icons separately. It’s better for larger sets or when icons are reused across pages. **Note:** To preview this version locally, you'll need to use a simple HTTP server. If hosting SVGs on a different domain than your HTML, ensure proper CORS configuration on the SVG server (see FAQ below).

Both versions use the same class names and styling conventions.

### Why do I need a server for file-referenced icons, and what about CORS?

**Local Preview:**
When you open an HTML file directly from your local file system (using a `file:///` path), browsers impose strict security restrictions. These prevent the HTML page from loading other local files, such as the individual SVG files linked by the `referenced-icons` CSS.

To preview the `referenced-icons/index.html` page correctly, you need to serve its directory using a simple local HTTP server. Since `svgs-to-icons` is a Node.js script and its setup involves `npm install`, you likely have `npx` (which comes with npm) available.

Open your terminal or command prompt, navigate to the output directory where the `index.html` for the referenced icons is located (e.g., `cd ./my-icons/css/referenced-icons/`), and run the following command:

*   **Recommended (Node.js/npm/npx):**
    ```bash
    npx serve .
    ```
    This will download `serve` if not already present and start a server. It usually serves on `http://localhost:3000` or `http://localhost:5000`. Check the terminal output for the exact address (e.g., `http://localhost:3000/index.html`) and open it in your browser.
    If `serve` is not found or you encounter issues, you might need to install it globally first (`npm install -g serve`) and then run `serve .`, or ensure your `npm` version is 5.2.0+ for `npx` to work as expected.

*   **Alternative Methods (if `npx serve .` is not preferred or encounters issues):**
    *   **Using Python (often pre-installed on macOS/Linux):**
        *   Python 3: `python3 -m http.server`
        *   Python 2: `python -m SimpleHTTPServer`
        (Both usually serve on `http://localhost:8000`. Open `http://localhost:8000/index.html`)
    *   **Using PHP (often pre-installed on macOS/Linux):**
        `php -S localhost:8000`
        (Serves on `http://localhost:8000`. Open `http://localhost:8000/index.html`)

*   **Using VS Code Live Server Extension:**
    If you're using Visual Studio Code, the "Live Server" extension is a convenient option. Right-click the `index.html` file in the Explorer and choose "Open with Live Server."

Once the server is running, open your web browser and navigate to the address provided by the server (e.g., `http://localhost:3000/index.html` or `http://localhost:8000/index.html`).

**CORS for Cross-Domain Hosting:**
CORS (Cross-Origin Resource Sharing) is a browser security feature that controls how web pages from one domain can request resources from another domain.

If you host your main website (HTML/CSS) on `https://www.example.com` and decide to host your SVG icon files on a separate domain or CDN, like `https://cdn.example-icons.com`, the browser will block your CSS (from `www.example.com`) from loading the SVG files (from `cdn.example-icons.com`) unless the server at `cdn.example-icons.com` explicitly allows it.

To enable this, the server hosting the SVG files must include the `Access-Control-Allow-Origin` HTTP header in its responses. For example:
`Access-Control-Allow-Origin: https://www.example.com` (to allow only your website)
OR
`Access-Control-Allow-Origin: *` (to allow any website, use with caution)

Without the correct CORS headers, browsers will block the requests for cross-origin SVGs, and your file-referenced icons will not appear. The embedded icons version does not have this issue as the SVGs are part of the CSS itself.

### Why does svgs-to-icons use CSS masks?

- **Colorizable**: Icons inherit the current text color via `currentColor`
- **Scalable**: Size controlled by `font-size` just like text
- **Performant**: No JavaScript required, efficient rendering
- **Accessible**: Works with screen readers and maintains semantic meaning
- **Flexible**: Easy to theme and style with existing CSS

### How are the icons optimized?

svgs-to-icons uses [`svgo`](https://github.com/svg/svgo) to:
- Remove metadata
- Minimize path and group complexity
- Strip unnecessary attributes

For embedded icons, we additionally minify them into `data:` URIs using [`mini-svg-data-uri`](https://github.com/tigt/mini-svg-data-uri).

### Why do you rename the icons?

Icon file names often contain characters that don’t work well in CSS class names. svgs-to-icons:
- Converts names to lowercase `kebab-case`
- Adds a consistent prefix (e.g. `lt5-`)
- Ensures valid, predictable class names like `.lt5-search-icon`

### Can I use `<i>` tags for icons?

You could, but you shouldn’t. `<i>` is a semantic tag for italics, and using it for icons is bad practice for accessibility and maintainability. Use `<span>` or `<div>` with appropriate ARIA roles or labels if needed.

### Do these icons support color?

Yes, they are fully **colorizable** using `currentColor`. You can set `color` on the icon or a parent element and it will apply to the icon mask via `background-color`.

```css
.settings-icon {
  color: red;
}
```

What these icons **do not support** is multiple colors within the same shape. They’re single-shape, single-color icons — just like icon fonts.

### Can I use this for emojis?

No. Emojis are typically multicolor glyphs handled by the browser and operating system, not by SVG. They’re not well-suited to this kind of masking system.

If you need accessible emoji-style icons, consider using:
- [Twemoji](https://twemoji.twitter.com/)
- [Noto Emoji](https://github.com/googlefonts/noto-emoji)

### What’s the difference between svgs-to-icons’s approach and React/Vue icon components?

`svgs-to-icons` supports two common ways of displaying icons with CSS: embedded data URIs and SVG file references. Most framework components inject SVG markup directly into the HTML instead.

`svgs-to-icons`’s CSS approach offers several advantages:
- **No JavaScript required** — icons work in static HTML
- **Consistent behavior** — icons scale and color like text via `font-size` and `color`
- **Better performance** — no component overhead or runtime SVG injection
- **Framework agnostic** — works with any HTML/CSS setup

Component libraries are certainly convenient though, especially when built into UI frameworks like shadcn, Vuetify, Material Design, etc. They’re ideal if you need programmatic control over icon properties or want TypeScript integration for icon imports.

## Alternatives to svgs-to-icons

Below is a quick comparison of alternative icon solutions, highlighting their strengths and trade-offs relative to svgs-to-icons.

| Solution            | Pros                               | Cons                        | Best for                            |
|---------------------|------------------------------------|-----------------------------|-------------------------------------|
| **FontAwesome**     | Professionally designed, framework-specific components | Subscription required, network dependency | Projects needing pre-designed icons and React/Vue components |
| **Iconify**         | Massive collection, easy API usage, framework integration | Runtime JS dependency, limited custom SVG handling | Projects needing diverse icon sets |
| **UnoCSS Icons**    | Zero runtime overhead, integrates with UnoCSS | Requires UnoCSS adoption, less flexibility | UnoCSS or atomic CSS-based projects |
| **Icônes**          | Visual search, easy SVG downloads  | Limited to Iconify’s collection | Sourcing quality SVGs quickly |
| **IcoMoon**         | GUI-based font generation          | Accessibility issues, manual workflow | Font-based icon systems with GUI control |
| **Font Design Tools**| Complete customization            | Complex, steep learning curve, accessibility concerns | Advanced typography projects |

### Why Choose svgs-to-icons?
- **No JavaScript:** Icons integrate directly via CSS, ensuring excellent performance and no runtime overhead.
- **Local and Customizable:** Fully control your icons and workflow; ideal for bespoke or company-branded icon sets.
- **Minimal Dependencies:** Lightweight build-time processing, easy to integrate into any web workflow without extensive setup or subscription services.


## Technical Details

### Generated CSS Structure

svgs-to-icons generates CSS classes using CSS mask properties for maximum compatibility:

```css
.icon-filename {
    display: inline-block;
    width: 1em;
    height: 1em;
    background-color: currentColor;
    mask: url("data:image/svg+xml;charset=utf-8,<optimized-svg>") no-repeat;
    mask-size: 100% 100%;
}
```
Note that the 1em `width` and `height` will correspond to the font size, so when `font-size: 20px`, the icon will be rendered in a 20px block. Because icons are often interspersed with text, we’ve chosen `display: inline-block` though other display types are possible, so long as they can be sized with `width` and `height`. Similarly, it’s possible to change or override `background-color: currentColor`, which is present here because it allows the icon to be colorized using `color`.

### Dependencies

- `svgo`: SVG optimization,[svgo on NPM](https://www.npmjs.com/package/svgo)
- `mini-svg-data-uri`: Efficient data URI encoding, [mini-svg-data-uri on NPM](https://www.npmjs.com/package/mini-svg-data-uri)
- `commander`: Command-line interface framework, [commander on NPM](https://www.npmjs.com/package/commander)
- Node.js built-in modules: `fs`, `path`

### Browser Compatibility

**Icon CSS Files (CSS Masking):**
The generated icon CSS relies on the standard, unprefixed `mask-image` property to display icons. This is well-supported in modern browsers (Chrome, Firefox, Edge, and Safari version 11+ from approximately 2017 onwards). Icons will not render correctly in browsers that require the older `-webkit-mask-image` prefix (like Safari pre-version 11 or older Chrome versions) or in Internet Explorer, which does not support CSS masking at all. You can easily add support for earlier browsers by modifying `demo-template.js`, but there may be a significant increase in the size of the icons.

**Demo Page (Clipboard API):**
The "copy class name" feature in the demo pages uses the `navigator.clipboard.writeText` API, which is supported in most modern browsers (Chrome ~66+, Firefox ~63+, Safari ~13.1+; generally from 2018-2020 onwards) and requires a secure context (HTTPS or localhost). This feature is for demo convenience only and does not affect the functionality of the generated icon CSS in your projects. Internet Explorer does not support this API.

### Limitations and Known Issues

**CSS Class Name Collisions:**
Different SVG filenames may generate identical CSS class names after sanitization. For example, `Home.svg`, `HOME.svg`, `home@2x.svg`, and `ho--me.svg` all become `.home-icon`. When collisions occur, later files silently overwrite earlier ones in the generated CSS. To avoid this:
- Use consistent, unique filenames 
- Avoid special characters, spaces, and mixed case in filenames
- Consider using descriptive prefixes (e.g., `ui-home.svg`, `nav-home.svg`)

**Case-Sensitive Filesystems:**
On case-sensitive filesystems (Linux, some macOS configurations), files like `Home.svg` and `home.svg` can coexist but will generate the same CSS class name. This can lead to unexpected behavior when moving projects between different operating systems. Use consistent lowercase naming to avoid these issues.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC License - see the [LICENSE](LICENSE) file for details.