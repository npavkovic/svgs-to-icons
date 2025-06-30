# svgs-to-icons

`svgs-to-icons` takes a folder of SVGs and generates:

- **Optimized SVG files** with consistent, class-safe names
- **CSS classes** that render those icons using `mask-image`, allowing them to be colorized with `currentColor`
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

### 2. Run `svgs-to-icons`:

```bash
node svgs-to-icons.js ./my-icons
```

### 3. `svgs-to-icons` will:

- Optimize and sanitize the SVGs
- Rename them to class-safe names (i.e., no leading numerals, special characters, etc.) — see [CSS Class Name Collisions](#css-class-name-collisions).
- Generate output at:

```
dist/my-icons/
├── embedded-icons/
│   ├── icons.css
│   └── index.html (demo)
└── referenced-icons/
    ├── icons (directory of SVGs)
    ├── icons.css
    └── index.html (demo)
```

### 4. Preview the results:

Upon completion, the script will output a direct link to the `embedded-icons/index.html` page. In most modern terminals, you can Command-click (macOS) or Control-click (Windows/Linux) this link to open it directly in your default web browser. This version works locally without a server because the SVG data is embedded within the CSS. Viewing the referenced icons requires a server.

The demo pages include interactive features like search and copy-to-clipboard functionality.



### 5. Use the icons in your HTML:

```html
<!-- Include the CSS file -->
<link rel="stylesheet" href="dist/my-icons/embedded-icons/icons.css">

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

## CLI Options

### Basic Usage
```bash
svgs-to-icons <input-directory> [options]
```

### Available Options

| Option | Description | Example |
|--------|-------------|---------|
| `--output <dir>` | Parent directory for output files | `--output ./dist` |
| `--prefix <string>` | Prefix for CSS class names | `--prefix ui` |
| `--postfix <string>` | Postfix for CSS class names | `--postfix btn` |
| `--embedded` | Generate embedded icons (data URIs) | `--embedded` |
| `--referenced` | Generate referenced icons (file paths) | `--referenced` |
| `--demo` | Generate interactive demo HTML files | `--demo` |

### Prefix and Postfix Details

**Automatic Hyphen Handling:**
- **Prefix:** If your prefix doesn't end with a hyphen, one is automatically added
  - `--prefix ui` becomes `ui-` → `.ui-home-icon`
  - `--prefix nav-` stays `nav-` → `.nav-home-icon`
  
- **Postfix:** If your postfix doesn't start with a hyphen, one is automatically added
  - `--postfix btn` becomes `-btn` → `.home-btn`
  - `--postfix -icon` stays `-icon` → `.home-icon`

**Examples:**
```bash
# Creates classes like .ui-home-btn
svgs-to-icons ./icons --prefix ui --postfix btn

# Creates classes like .nav-home-icon  
svgs-to-icons ./icons --prefix nav- --postfix -icon

# Creates classes like .btn-home
svgs-to-icons ./icons --prefix btn --postfix ""
```

### Output Control

By default, `svgs-to-icons` generates both embedded and referenced versions with demo files. You can control this:

```bash
# Generate only embedded icons
svgs-to-icons ./icons --embedded

# Generate only referenced icons  
svgs-to-icons ./icons --referenced

# Skip demo files
svgs-to-icons ./icons --demo false
```

## FAQ

### Quick Links
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

`svgs-to-icons` generates both:

- **Embedded** icons are inlined into the CSS as data URIs. This makes your CSS self-contained and avoids HTTP requests — ideal for a small set of icons that are always needed. You can preview this version directly in a browser from your local file system.
- **File-referenced** icons are linked by `url(\"...\")` in CSS. This keeps your CSS smaller and lets browsers cache the icons separately. It’s better for larger sets or when icons are reused across pages. **Note:** To preview this version locally, you'll need to use a simple HTTP server. If hosting SVGs on a different domain than your HTML, ensure proper CORS configuration on the SVG server (see FAQ below).

Both versions use the same class names and styling conventions.

### Why do I need a server for file-referenced icons, and what about CORS?

**Local Preview:**
When you open an HTML file directly from your local file system (using a `file:///` path), browsers impose strict security restrictions. These prevent the HTML page from loading other local files, such as the individual SVG files linked by the `referenced-icons` CSS.

Most computers have built-in software to launch a web server. Open your terminal or command prompt, navigate to the output directory where the `index.html` for the referenced icons is located (e.g., `cd ./dist/my-icons/referenced-icons/`), and run the following command:

*   **Recommended (Node.js/npm/npx):**
    ```bash
    npx serve .
    ```
    This will download `serve` if not already present and start a server. It usually serves on `http://localhost:3000` or `http://localhost:5000`. Check the terminal output for the exact address (e.g., `http://localhost:3000/index.html`) and open it in your browser.

*   **Using VS Code Live Server Extension:**
    If you're using Visual Studio Code, the “Live Server” extension is a convenient option. Right-click the `index.html` file in the Explorer and choose "Open with Live Server."

Once the server is running, open your web browser and navigate to the address provided by the server (e.g., `http://localhost:3000/index.html` or `http://localhost:8000/index.html`).

**CORS for Cross-Domain Hosting:**
CORS (Cross-Origin Resource Sharing) is a browser security feature that controls how web pages from one domain can request resources from another domain.

If you host your main website (HTML/CSS) on `https://www.example.com` and decide to host your SVG icon files on a separate domain or CDN, like `https://cdn.example-icons.com`, the browser will block your CSS (from `www.example.com`) from loading the SVG files (from `cdn.example-icons.com`) unless the server at `cdn.example-icons.com` explicitly allows it.

To enable this, the server hosting the SVG files must include the `Access-Control-Allow-Origin` HTTP header in its responses. For example:
`Access-Control-Allow-Origin: https://www.example.com` (to allow only your website)
OR
`Access-Control-Allow-Origin: *` (to allow any website, use with caution)

Without the correct CORS headers, browsers will block the requests for cross-origin SVGs, and your file-referenced icons will not appear. The embedded icons version does not have this issue as the SVGs are incorporated into the CSS as data URIs.

### Why does svgs-to-icons use CSS masks?

- **Colorizable**: Icons inherit the current text color via `currentColor`
- **Scalable**: Size controlled by `font-size` just like text
- **Performant**: No JavaScript required, efficient rendering
- **Accessible**: Works with screen readers and maintains semantic meaning
- **Flexible**: Easy to theme and style with existing CSS

### How are the icons optimized?

`svgs-to-icons` uses [`svgo`](https://github.com/svg/svgo) to:
- Remove metadata
- Minimize path and group complexity
- Strip unnecessary attributes

For embedded icons, we additionally minify them into `data:` URIs using [`mini-svg-data-uri`](https://github.com/tigt/mini-svg-data-uri).

### Why do you rename the icons?

Icon file names often contain characters that don’t work well in CSS class names. `svgs-to-icons`:
- Converts names to lowercase and replaces invalid characters with hyphens
- Removes special characters and normalizes spacing
- Prefixes numeric filenames with "i" (e.g., `123.svg` → `.i123-icon`)
- Ensures valid, predictable class names

### Can I use `<i>` tags for icons?

You could, but you shouldn’t. `<i>` is a semantic tag for italics, and using it for icons is bad practice for accessibility and maintainability. Use `<span>` or `<div>` with appropriate ARIA roles or labels if needed.

### Do these icons support color?

They are fully **colorizable** using `color` on the icon or a parent element. These icons **do not support** multiple colors within the same shape. They’re single-shape, single-color icons — just like icon fonts.

### Can I use this for emojis?

Probably not. Emojis are typically multicolor glyphs handled by the browser and operating system, not by SVG. They’re not well-suited to this kind of masking system.

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

Component libraries are certainly convenient though, especially when built into UI frameworks like shadcn, Vuetify, Material Design, etc. 

### What are some alternatives to `svgs-to-icons`?

You have a number of options for rendering icons in HTML; each has its pros and cons. Here are a few commonly-used systems.

### FontAwesome
[FontAwesome](https://fontawesome.com/) arguably started a revolution in 2012 by making large sets of professionally designed icons available on the web through a single font file. Its early approach — rendering icons via font glyphs — allowed developers to scale and style icons using familiar CSS properties like `font-size` and `color`. In more recent versions, FontAwesome has transitioned to an SVG-based model, offering component libraries for Vue, React, and Angular, as well as a script-based solution for injecting icons at runtime.
FontAwesome’s tools are reliable and well-integrated with modern JavaScript frameworks, but they work exclusively with the FontAwesome icon sets. Custom icons can be added, but only by converting them into a proprietary format and manually registering them. Compared to `svgs-to-icons`, FontAwesome is more powerful in dynamic app settings but far less flexible for quickly converting and using arbitrary SVGs — especially in CSS-only or HTML-first workflows.
—
### Iconify
[Iconify](https://iconify.design/) offers access to over 200,000 icons across a wide variety of public icon sets, many of them from commonly-used design systems. It supports multiple rendering strategies: icons can be injected into the DOM via framework components (Vue, React), rendered via a custom web component, inlined at build time using Vite or Webpack plugins, even simply cut-and-pasted as CSS from their site. This versatility allows developers to choose between runtime flexibility and build-time performance.
Iconify also supports custom icon sets, but doing so typically requires adopting their internal JSON format or configuring file system loaders for build-time integration. In comparison, `svgs-to-icons` handles custom icons much more directly — just point it at a folder of SVGs and it generates optimized CSS with no configuration. Where Iconify excels is in scale and dynamic integration; where it falls short is in simplicity and plug-and-play support for custom assets.
—
### UnoCSS Icons
Anthony Fu’s [UnoCSS](https://unocss.dev/) is an engine for CSS utillities — it’s similar to Bootstrap, Tailwind and other CSS frameworks, but it can allow you to mix and match from different frameworks, compiling only the CSS you need at build time. UnoCSS Icons is a plugin that allows you to use icons as utility classes — for example, `i-mdi-home` — and inlines their SVGs using `mask-image`, much like `svgs-to-icons`. Through standard naming conventions, it provides easy acccess to the entire Iconify library.
Both UnoCSS Icons and `svgs-to-icons` generate CSS-based icon styles with no runtime JavaScript and support styling via `color` and `font-size`. Where they differ is in setup and scope: UnoCSS is a CSS framework with a build routine that runs whenever you change your CSS; `svgs-to-icons` works independently of any CSS methodology and only needs to generate icon assets when your icon SVGs change. Additionally, while UnoCSS supports custom icons via configuration, `svgs-to-icons` requires no plugin setup or registration — it simply processes any folder of SVGs directly.
—
### IcoMoon
[IcoMoon](https://icomoon.io/) is a GUI-based online tool for creating custom icon fonts or SVG sprite sheets. It allows users to upload SVGs, combine them into a set, and export them as web fonts or inline SVG bundles. IcoMoon was a common choice in the era of icon fonts and still appeals to teams that want GUI control over their icon workflow.
Compared to `svgs-to-icons`, IcoMoon requires more manual work and produces outputs — like icon fonts — that are generally considered less accessible and more difficult to style than mask-based SVGs. It does, however, offer a visual way to manage icon collections, which some designers and front-end developers still prefer.
—
### Font Design Tools
Tools ([Glyphs](https://glyphsapp.com/), [FontForge](https://fontforge.org/en-US/), [FontLab](https://www.fontlab.com/)) are professional font editors used to create traditional font files, including custom icon fonts. These are powerful tools, often used by type designers or branding teams to produce multi-purpose fonts that include both textual glyphs and iconography.
These tools operate at a different level of abstraction than `svgs-to-icons`. Rather than generating CSS classes or optimizing SVG files, they produce binary font files (`.woff`, `.ttf`) and require considerable expertise to use effectively. They’re appropriate for highly customized font workflows or typographic branding projects, but they’re not a practical option for everyday web icon usage.

## Customization

### Demo Color Palette

The interactive demo pages use a customizable color system defined in `templates/colors.js`. This provides the color options in the "Icon Color" and "Background Color" dropdowns.

**Default colors include:**
- Base colors: Blue, Green, Red, Yellow, Orange, Purple, Teal
- Each color family has lighten/darken variants (e.g., `blue-lighten-10`, `blue-darken-20`)
- Extended grayscale options
- Common colors: Black, White, Transparent

**To customize the color palette:**
1. Edit `templates/colors.js`
2. Follow the existing data format:
   ```javascript
   'color-name': { value: '#HEX-CODE', name: 'Display Name' }
   ```
3. Regenerate your icons to see the new colors in demo pages

The color system is well-documented within the file itself, including structure guidelines and usage examples.

## Technical Details

### Generated CSS Structure

```css
.filename-icon {
    display: inline-block;
    width: 1em;
    height: 1em;
    background-color: currentColor;
    mask: url("data:image/svg+xml;charset=utf-8,<optimized-svg>") no-repeat;
    mask-size: 100% 100%;
}
```
Note that the 1em `width` and `height` will correspond to the font size, so when `font-size: 20px`, the icon will be rendered in a 20px block. Because icons are often interspersed with text, we’ve chosen `display: inline-block` though other display types are possible, so long as they can be sized with `width` and `height`. Similarly, it’s possible to change or override `background-color: currentColor`, which is present here because it allows the icon to be colorized using `color`.

### CSS Class Name Collisions
Different SVG filenames may generate identical base class names after sanitization. For example, `Home.svg`, `HOME.svg`, and `home@.svg` all become `home` after processing.

**Automatic collision handling:** `svgs-to-icons` automatically resolves collisions by adding numeric suffixes to the base name (shown here with default `-icon` postfix):
- First occurrence: `home` → `.home-icon`
- Second occurrence: `home-1` → `.home-1-icon` 
- Third occurrence: `home-2` → `.home-2-icon`

**Special case:** Files with names that result in empty or invalid class names (like `.svg`, `@.svg`, `!#$.svg`) become `unnamed`, `unnamed-1`, `unnamed-2`, etc. (before prefix/postfix are applied).

**Best practices** (to avoid numbered suffixes):
- Use consistent, unique filenames 
- Avoid special characters, spaces, and mixed case in filenames
- Consider using descriptive prefixes (e.g., `ui-home.svg`, `nav-home.svg`)
- Ensure filenames contain at least one alphanumeric character

**Case-Sensitive Filesystems:**
On case-sensitive filesystems (Linux, some macOS configurations), files like `Home.svg` and `home.svg` can coexist but will generate the same CSS class name. This can lead to unexpected behavior when moving projects between different operating systems. Use consistent lowercase naming to avoid these issues.

### Prefixes and Postfixes

The generated CSS uses wildcard selectors to apply base styles to all icons. If you use custom prefixes or postfixes, be aware that existing CSS classes in your project might unintentionally match the wildcard pattern.

For example, with the default `-icon` postfix, the CSS includes `[class*="-icon"]` which will match any class containing "-icon" anywhere in the name, including classes like `.navigation-icon-wrapper` or `.my-section-icon-container`.

To avoid conflicts, choose distinctive prefixes and postfixes that are unlikely to appear in your existing class names, such as `--prefix "svg-"` or `--postfix "-svg"`.

### Dependencies

- `svgo`: SVG optimization,[svgo on NPM](https://www.npmjs.com/package/svgo)
- `mini-svg-data-uri`: Efficient data URI encoding, [mini-svg-data-uri on NPM](https://www.npmjs.com/package/mini-svg-data-uri)
- `commander`: Command-line interface framework, [commander on NPM](https://www.npmjs.com/package/commander)
- Node.js built-in modules: `fs`, `path`

### Browser Compatibility

**Icon CSS Files (CSS Masking):**
The generated icon CSS relies on the standard, unprefixed `mask-image` property to display icons. This is well-supported in modern browsers (Chrome, Firefox, Edge, and Safari version 11+ from approximately 2017 onwards). Icons will not render correctly in browsers that require the older `-webkit-mask-image` prefix (like Safari pre-version 11 or older Chrome versions) or in Internet Explorer, which does not support CSS masking at all.

If you need to support very old Safari versions, you can manually modify the generated CSS to use CSS custom properties with `-webkit-` prefixes:

```css
.filename-icon {
    --svg: url("data:image/svg+xml;charset=utf-8,<optimized-svg>");
    display: inline-block;
    width: 1em;
    height: 1em;
    background-color: currentColor;
    -webkit-mask-image: var(--svg);
    mask-image: var(--svg);
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;
}
```

This approach provides maximum compatibility while keeping the data URI in a reusable CSS custom property.

**Demo Pages:**
The interactive demo pages use modern CSS features including CSS Nesting and the Clipboard API, requiring recent browsers (Chrome 112+, Firefox 117+, Safari 16.5+; generally from 2023 onwards). These demos are for development convenience only and do not affect the functionality of the generated icon CSS in your projects.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC License - see the [LICENSE](LICENSE) file for details.