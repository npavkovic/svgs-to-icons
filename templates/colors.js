/**
 * Color System
 * 
 * This color palette provides a structured system with base colors and their variants.
 * 
 * Structure:
 * - Common colors: black, white, transparent
 * - Color families: Each has a base color plus lighten/darken variants
 *   - Base: 'blue' (main color)
 *   - Lighter: 'blue-lighten-10', 'blue-lighten-20', 'blue-lighten-30'
 *   - Darker: 'blue-darken-10', 'blue-darken-20', 'blue-darken-30'
 * - Gray family: Extended grayscale from lighten-40 to darken-40
 * 
 * Data Format:
 * Each color is an object with:
 * - value: CSS color value (hex, rgb, hsl, named, etc.)
 * - name: Human-readable display name
 * 
 * You can substitute your own color system using this same data format.
 * Just ensure each color follows the pattern: 'key': { value: 'css-value', name: 'Display Name' }
 */

const colors = {

	// Common Colors
	'black': { value: '#000000', name: 'Black' },
	'white': { value: '#FFFFFF', name: 'White' },
	'transparent': { value: 'transparent', name: 'Transparent' },

	// Blue Family
	'blue': { value: '#2196F3', name: 'Blue' },
	'blue-lighten-10': { value: '#42A5F5', name: 'Blue Lighten 10' },
	'blue-lighten-20': { value: '#64B5F6', name: 'Blue Lighten 20' },
	'blue-lighten-30': { value: '#90CAF9', name: 'Blue Lighten 30' },
	'blue-darken-10': { value: '#1E88E5', name: 'Blue Darken 10' },
	'blue-darken-20': { value: '#1976D2', name: 'Blue Darken 20' },
	'blue-darken-30': { value: '#1565C0', name: 'Blue Darken 30' },

	// Green Family
	'green': { value: '#4CAF50', name: 'Green' },
	'green-lighten-10': { value: '#66BB6A', name: 'Green Lighten 10' },
	'green-lighten-20': { value: '#81C784', name: 'Green Lighten 20' },
	'green-lighten-30': { value: '#A5D6A7', name: 'Green Lighten 30' },
	'green-darken-10': { value: '#43A047', name: 'Green Darken 10' },
	'green-darken-20': { value: '#388E3C', name: 'Green Darken 20' },
	'green-darken-30': { value: '#2E7D32', name: 'Green Darken 30' },

	// Red Family
	'red': { value: '#F44336', name: 'Red' },
	'red-lighten-10': { value: '#EF5350', name: 'Red Lighten 10' },
	'red-lighten-20': { value: '#E57373', name: 'Red Lighten 20' },
	'red-lighten-30': { value: '#FFCDD2', name: 'Red Lighten 30' },
	'red-darken-10': { value: '#E53935', name: 'Red Darken 10' },
	'red-darken-20': { value: '#D32F2F', name: 'Red Darken 20' },
	'red-darken-30': { value: '#C62828', name: 'Red Darken 30' },

	// Yellow Family (limited darkening due to color nature)
	'yellow': { value: '#FFEB3B', name: 'Yellow' },
	'yellow-lighten-10': { value: '#FFF176', name: 'Yellow Lighten 10' },
	'yellow-lighten-20': { value: '#FFF59D', name: 'Yellow Lighten 20' },
	'yellow-lighten-30': { value: '#FFF9C4', name: 'Yellow Lighten 30' },
	'yellow-darken-10': { value: '#FDD835', name: 'Yellow Darken 10' },

	// Orange Family
	'orange': { value: '#FF9800', name: 'Orange' },
	'orange-lighten-10': { value: '#FFB74D', name: 'Orange Lighten 10' },
	'orange-lighten-20': { value: '#FFCC80', name: 'Orange Lighten 20' },
	'orange-lighten-30': { value: '#FFE0B2', name: 'Orange Lighten 30' },
	'orange-darken-10': { value: '#FB8C00', name: 'Orange Darken 10' },
	'orange-darken-20': { value: '#F57C00', name: 'Orange Darken 20' },
	'orange-darken-30': { value: '#EF6C00', name: 'Orange Darken 30' },

	// Purple Family
	'purple': { value: '#9C27B0', name: 'Purple' },
	'purple-lighten-10': { value: '#AB47BC', name: 'Purple Lighten 10' },
	'purple-lighten-20': { value: '#BA68C8', name: 'Purple Lighten 20' },
	'purple-lighten-30': { value: '#CE93D8', name: 'Purple Lighten 30' },
	'purple-darken-10': { value: '#8E24AA', name: 'Purple Darken 10' },
	'purple-darken-20': { value: '#7B1FA2', name: 'Purple Darken 20' },
	'purple-darken-30': { value: '#6A1B9A', name: 'Purple Darken 30' },

	// Teal Family
	'teal': { value: '#009688', name: 'Teal' },
	'teal-lighten-10': { value: '#26A69A', name: 'Teal Lighten 10' },
	'teal-lighten-20': { value: '#4DB6AC', name: 'Teal Lighten 20' },
	'teal-lighten-30': { value: '#80CBC4', name: 'Teal Lighten 30' },
	'teal-darken-10': { value: '#00897B', name: 'Teal Darken 10' },
	'teal-darken-20': { value: '#00796B', name: 'Teal Darken 20' },
	'teal-darken-30': { value: '#00695C', name: 'Teal Darken 30' },

	// Gray Family (Extended)
	'gray': { value: '#9E9E9E', name: 'Gray' },
	'gray-lighten-40': { value: '#FAFAFA', name: 'Gray Lighten 40' },
	'gray-lighten-30': { value: '#F5F5F5', name: 'Gray Lighten 30' },
	'gray-lighten-20': { value: '#EEEEEE', name: 'Gray Lighten 20' },
	'gray-lighten-10': { value: '#E0E0E0', name: 'Gray Lighten 10' },
	'gray-darken-10': { value: '#757575', name: 'Gray Darken 10' },
	'gray-darken-20': { value: '#616161', name: 'Gray Darken 20' },
	'gray-darken-30': { value: '#424242', name: 'Gray Darken 30' },
	'gray-darken-40': { value: '#212121', name: 'Gray Darken 40' }
};

module.exports = colors;
