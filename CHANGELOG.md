# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.5] - 2025-01-10

### Changed
- Standardized all CSS color variables to use hex format for consistency
- Converted RGB and HSL color values in demo template to hex equivalents

## [0.1.4] - 2025-01-09

### Fixed
- Additional README.md formatting and content improvements
- Fixed section organization and structure
- Updated broken links and typos

## [0.1.3] - 2025-01-09

### Fixed
- Fixed README.md formatting errors and inconsistencies
- Corrected FAQ section numbering and links
- Fixed typos in documentation (frameworks, access, etc.)
- Updated screenshot reference in README

## [0.1.2] - 2025-01-09

### Fixed
- Fixed demo page copy button functionality with proper HTML escaping
- Removed unused `test-icons/` directory

## [0.1.1] - 2025-01-09

### Fixed
- Fixed missing `templates/` directory in NPM package that caused "Cannot find module" error
- Updated `.npmignore` to properly exclude only development files
- Removed unused `test-icons/` directory

## [0.1.0] - 2025-01-09

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