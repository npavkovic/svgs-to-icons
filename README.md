# Iconizer

## Why Are You Here?

- You have a directory full of SVG files you’d like to use as icons.
- You don’t want to install a JavaScript component library just to render icons.
- You don’t want to download an icon font.
- You’re looking for a solution that integrates seamlessly with vanilla HTML and CSS.
- You want to be able to use the icons inline with text and colorize them.

## What Iconizer Does

Iconizer takes a folder of SVGs and generates:

- **Optimized SVG files** with consistent, class-safe names
- **CSS classes** that render those icons using `-webkit-mask-image`, allowing them to be colorized with `currentColor`
- **Two versions of the CSS:**
  - **Embedded**: SVGs are inlined using `data:` URIs
  - **File-referenced**: SVGs are linked via `url("icon.svg")`
- **Bundled and per-icon CSS files** for both modes
- **Demo HTML pages** for each version so you can preview the output

This gives you a modern, minimal, and scalable icon system that can be used in any HTML or CSS setup — no JS required.

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/iconizer.git
cd iconizer

# Install dependencies
npm install
```

## How to Use This

### 1. Create or gather a set of SVG icons in a folder:

```
./my-icons/
├── home.svg
├── user.svg
└── settings.svg
```

### 2. Run Iconizer:

```bash
node iconizer.js ./my-icons
```

### 3. Iconizer will:

- Optimize and sanitize the SVGs
- Rename them to class-safe names like `lt5-home.svg`
- Generate output at:

```
./my-icons/css/
├── embedded-icons/
│   ├── icon-css/
│   └── demo.html
└── referenced-icons/
    ├── icon-css/
    └── demo.html
```

### 4. Preview the results:

Open the generated `demo.html` files in your browser to see the icons in action:
- `./my-icons/css/embedded-icons/demo.html` - Icons with embedded SVG data
- `./my-icons/css/referenced-icons/demo.html` - Icons referencing external SVG files

The demo pages include interactive features like search and copy-to-clipboard functionality.

### 5. Use the icons in your HTML:

```html
<!-- Include the CSS file -->
<link rel="stylesheet" href="my-icons/css/embedded-icons/icon-css/all-icons.css">

<!-- Use the icons -->
<span class="home-icon"></span>
```

### 6. Style with CSS:

```css
.home-icon {
  font-size: 1.25rem;
  color: #444;
}
```

## FAQ

### What’s the difference between embedded and file-referenced CSS?

Iconizer generates both:

- **Embedded** icons are inlined into the CSS as data URIs. This makes your CSS self-contained and avoids HTTP requests — ideal for a small set of icons that are always needed.
- **File-referenced** icons are linked by `url("...")` in CSS. This keeps your CSS smaller and lets browsers cache the icons separately. It’s better for larger sets or when icons are reused across pages.

Both versions use the same class names and styling conventions.

### Why does Iconizer use CSS masks?

- **Colorizable**: Icons inherit the current text color via `currentColor`
- **Scalable**: Size controlled by `font-size` just like text
- **Performant**: No JavaScript required, efficient rendering
- **Accessible**: Works with screen readers and maintains semantic meaning
- **Flexible**: Easy to theme and style with existing CSS

### How are the icons optimized?

Iconizer uses [`svgo`](https://github.com/svg/svgo) to:
- Remove metadata
- Minimize path and group complexity
- Strip unnecessary attributes

For embedded icons, we additionally minify them into `data:` URIs using [`mini-svg-data-uri`](https://github.com/tigt/mini-svg-data-uri).

### Why do you rename the icons?

Icon file names often contain characters that don’t work well in CSS class names. Iconizer:
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

What these icons **do not support** is multiple colors within the same shape. They’re single-shape, single-color icons — just like icon fonts or UnoCSS icons.

### Can I use this for emojis?

No. Emojis are typically multicolor glyphs handled by the browser and operating system, not by SVG. They’re not well-suited to this kind of masking system.

If you need accessible emoji-style icons, consider using:
- [Twemoji](https://twemoji.twitter.com/)
- [Noto Emoji](https://github.com/googlefonts/noto-emoji)

### What’s the difference between Iconizer’s approach and React/Vue icon components?

Iconizer supports two common ways of displaying icons with CSS: embedded data URIs and SVG file references. Most framework components inject SVG markup directly into the HTML instead.

Having SVG in HTML allows more rendering control — you can use CSS to style additional aspects like `stroke-width`, `fill` patterns, or individual paths within the icon. However, in practice, most people don’t need this level of control for icons and prefer the simplicity of single-color, scalable icons that work like text.

Iconizer’s CSS approach offers several advantages:
- **No JavaScript required** — icons work in static HTML
- **Consistent behavior** — icons scale and color like text via `font-size` and `color`
- **Better performance** — no component overhead or runtime SVG injection
- **Framework agnostic** — works with any HTML/CSS setup

Component libraries are certainly convenient though, especially when built into UI frameworks like shadcn, Vuetify, Material Design, etc. They’re ideal if you need programmatic control over icon properties or want TypeScript integration for icon imports.

## Other Options for Icon Display
Iconizer isn’t for everyone, and it’s important that you find the solution that’s the best fit for your particular use case.

**FontAwesome**
FontAwesome ([fontawesome.com](https://fontawesome.com)) offers both icon font and SVG implementations through dedicated React/Vue components that render inline SVG elements. Their Kit system provides two approaches: hosted CDN with automatic subsetting that detects icon usage and serves only needed icons, or downloadable static files containing pre-selected icons that can be used with any web project. Kits support custom icon uploads alongside FontAwesome’s library. **Pros:** Professional design quality, automatic subsetting via hosted Kits, framework-specific components, and downloadable subsets for self-hosting. **Cons:** Pro subscription costs, Kit setup workflow, and hosted versions require network requests. **Best for:** Projects needing professionally designed icons with managed subsetting. Iconizer does not have React/Vue components, but creates icon resources similar to a downloaded Kit, from a directory of SVG files.

**Iconify**
Iconify ([iconify.design](https://iconify.design)) provides access to over 254,000 icons from 183 icon sets through both a web component and framework-specific components (React, Vue, Svelte, Ember) that load icon data on-demand from their API. Their iconify-icon web component works in vanilla HTML and renders SVG in shadow DOM, while framework components load icons from Iconify API and render them as inline SVG. Iconify API can be self-hosted for full control. For static CSS workflows similar to Iconizer, they offer a no-code API that generates CSS with embedded data URIs - simply visit URLs like `https://api.iconify.design/mdi.css?icons=account-box,account-cash` to get ready-to-use CSS with mask properties. For processing custom local SVG files, their Utils package requires Node.js programming. **Pros:** Massive selection from diverse designers, web component for vanilla JS, framework components, self-hosting options, and easy CSS generation via API URLs. **Cons:** Runtime dependency for dynamic loading, potential network requests for components, and limited to their icon collection for simple CSS generation. **Best for:** Applications needing vast icon variety with component-based integration, or projects wanting Iconizer-style CSS from their curated collection. Unlike Iconizer’s automated script that processes custom SVGs, Iconify focuses on their curated collection but offers both simple API-based and programming-based CSS generation for custom icons.

**UnoCSS Icons**
UnoCSS by Anthony Fu, is an icon engine ([unocss.dev/presets/icons](https://unocss.dev/presets/icons)) generates utility classes for icons at build time, using the same Iconify data source with over 200,000 icons but through CSS mask properties similar to Iconizer. **Pros:** Zero runtime overhead, excellent tree-shaking, seamless integration with UnoCSS utilities, and support for custom icon loaders and collections. **Cons:** Requires UnoCSS adoption, build-time dependency, and less flexibility for custom icon processing workflows. **Best for:** Projects using UnoCSS/Tailwind-style atomic CSS. While both UnoCSS and Iconizer use CSS masks, UnoCSS generates utilities on-demand during development from Iconify’s vast collection, while Iconizer pre-generates static CSS files from your custom SVG directory with more control over the build process.

**Icônes**
Icônes ([icones.js.org](https://icones.js.org/)) by Anthony Fu is an icon explorer and download tool that provides instant fuzzy searching across Iconify’s collection of over 254,000 icons from 183 icon sets. The web app allows users to browse, search, and select icons visually, then download them in multiple formats: individual SVG files (perfect for Iconizer workflows), icon fonts, SVG sprites, or as ready-to-use React/Vue components. All searching and filtering happens locally in the browser for fast performance. **Pros:** Instant local search across vast icon collections, visual browsing interface, multiple export formats including individual SVGs, and no account required. **Cons:** Limited to Iconify’s curated collection (albeit vast); doesn’t accommodate custom SVG files. **Best for:** Developers seeking high-quality icons from established design systems who want an easy way to discover and download specific icons. Icônes serves as an excellent starting point for Iconizer users who need to source professional icons before processing them into CSS utilities, while also offering alternative rendering approaches like fonts and sprites for different project needs.


**Icon Loading Components**
Framework users have multiple options for icon components: dedicated libraries like Heroicons (316 hand-crafted SVG icons by Tailwind’s creators) with individual React/Vue components, React Icons (3000+ icons from multiple libraries including FontAwesome and Bootstrap), Iconify and FontAwesome’s framework components, or UI library built-ins like those in shadcn, Radix, and Vuetify. These libraries embed SVG directly into components and typically require manual imports of specific icons (e.g., `import { BeakerIcon } from ’@heroicons/react/24/solid’`) rather than automatic detection. FontAwesome supports automatic tree-shaking out of the box, while other libraries like Heroicons and React Icons have had mixed results with build-time optimization. **Pros:** Framework integration, TypeScript support, inline SVG rendering for styling flexibility, and some tree-shaking support. **Cons:** JavaScript bundle overhead, framework lock-in, mostly manual import management, and inconsistent automatic optimization. **Best for:** Component-based applications where icons need programmatic control and developers can manage imports manually. These offer more dynamic control than Iconizer’s static CSS but require JavaScript runtime and manual dependency management.

**IcoMoon**
IcoMoon ([icomoon.io](https://icomoon.io)) provides a web-based font generator that lets you select icons from their library or import custom SVGs to create subsetted icon fonts. Their workflow involves selecting desired icons, generating a custom font with only chosen glyphs, and downloading font files with CSS. The service preserves project state through selection.json files for future modifications. **Pros:** Visual icon selection interface, precise subsetting control, font format output, and offline capability once loaded. **Cons:** Manual workflow for updates, icon font accessibility issues, and dependency on their web interface. **Best for:** Projects requiring traditional icon fonts with visual subset management. Unlike Iconizer’s automated script approach, IcoMoon offers a GUI-based workflow but produces icon fonts rather than CSS mask utilities, requiring different implementation patterns and potentially less accessibility.

**Font Design Software**
Professional font editors like Glyphs ([glyphsapp.com](https://glyphsapp.com)), FontLab ([fontlab.com](https://fontlab.com)), or the free FontForge ([fontforge.org](https://fontforge.org)) allow creating custom icon fonts from SVGs, though few are specifically optimized for icon design workflows. **Pros:** Complete control over font generation, glyph metrics, and output formats with professional-grade tools. **Cons:** Steep learning curve, complex manual workflow, time-intensive process, and icon font accessibility concerns. **Best for:** Design systems requiring ultimate control over font characteristics or specialized glyph features. Font creation offers maximum customization but requires significant typography expertise and manual effort, while Iconizer provides automated workflows with better web accessibility through CSS masks rather than custom fonts.

## Technical Details

### Generated CSS Structure

Iconizer generates CSS classes using CSS mask properties for maximum compatibility:

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

### Dependencies

- `svgo`: SVG optimization
- `mini-svg-data-uri`: Efficient data URI encoding
- Node.js built-in modules: `fs`, `path`

### Browser Support

- Modern browsers with CSS mask support
- Fallback to `-webkit-mask` for Safari
- Works offline (no external dependencies)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see the [LICENSE](LICENSE) file for details.