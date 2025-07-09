# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-07-08

### Added
- Initial release of svgs-to-icons
- Support for generating both embedded (data URI) and referenced (file path) CSS versions
- Automatic SVG optimization using SVGO
- Interactive demo pages with search and copy-to-clipboard functionality
- Collision handling for duplicate CSS class names
- Customizable prefixes and postfixes for CSS class names
- Comprehensive CLI options for controlling output
- Example icon set in `examples/chair-icons/`
- Browser compatibility guidance for CSS masking
- Detailed documentation with FAQ section

### Technical
- Node.js 18+ requirement
- Dependencies: SVGO, mini-svg-data-uri, commander
- CSS mask-image based icon rendering
- Support for older Safari with webkit prefix instructions