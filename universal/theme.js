// theme.js - Corrected and Simplified

// Define constants in the global scope for easy access
const THEMES = ['light', 'dark', 'system'];
const ICONS = {
    light: 'fa-sun',
    dark: 'fa-moon',
    system: 'fa-circle-half-stroke'
};
const TITLES = {
    light: 'Switch to Dark Mode',
    dark: 'Switch to System Preference',
    system: 'Switch to Light Mode'
};

/**
 * This is the SINGLE source of truth for applying a theme.
 * All other parts of the script will call this function.
 * @param {string} theme - The user's chosen theme: 'light', 'dark', or 'system'.
 */
function applyTheme(theme) {
    let effectiveTheme = theme;

    // If the theme is 'system', determine the actual theme from the OS
    if (theme === 'system') {
        effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Apply the 'dark-mode' class based on the effective theme
    const isDark = effectiveTheme === 'dark';
    document.documentElement.classList.toggle('dark-mode', isDark);
    if (document.body) {
        document.body.classList.toggle('dark-mode', isDark);
    }

    // Update the UI of the toggle button, if it exists on the page
    const themeToggle = document.getElementById('darkModeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            // The icon should reflect the user's *choice* ('system'), not the effective theme.
            Object.values(ICONS).forEach(iconClass => icon.classList.remove(iconClass));
            icon.classList.add(ICONS[theme]);
        }
        
        // The title should tell the user what the *next* click will do.
        const nextThemeIndex = (THEMES.indexOf(theme) + 1) % THEMES.length;
        themeToggle.title = TITLES[THEMES[nextThemeIndex]];
    }
}

/**
 * Finds the theme toggle button and attaches the click event listener.
 */
function setupThemeToggle() {
    const themeToggle = document.getElementById('darkModeToggle');
    if (!themeToggle) return; // Exit if no button on this page

    themeToggle.addEventListener('click', () => {
        // Get the current theme choice from storage
        const currentTheme = localStorage.getItem('theme') || 'system';
        
        // Determine the next theme in the cycle
        const nextThemeIndex = (THEMES.indexOf(currentTheme) + 1) % THEMES.length;
        const nextTheme = THEMES[nextThemeIndex];

        // Save the user's new choice to storage
        localStorage.setItem('theme', nextTheme);

        // Apply the newly chosen theme
        applyTheme(nextTheme);
    });
}

// --- SCRIPT EXECUTION FLOW ---

// 1. Add a listener for OS-level theme changes.
// This will only trigger a change if the user's setting is 'system'.
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const savedTheme = localStorage.getItem('theme') || 'system';
    if (savedTheme === 'system') {
        applyTheme('system');
    }
});


// 2. Set up the toggle and apply the initial theme once the DOM is ready.
document.addEventListener('DOMContentLoaded', () => {
    // Get the saved theme preference from storage
    const savedTheme = localStorage.getItem('theme') || 'system';
    
    // Apply the theme to make sure the body class and button UI are correct
    applyTheme(savedTheme);

    // Set up the click listener on the button
    setupThemeToggle();
});