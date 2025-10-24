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
        
        // --- NEW: Check which type of toggle we are on ---

        // Case 1: It's the icon-button (like on index.html)
        if (themeToggle.tagName.toLowerCase() === 'button') {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                // The icon should reflect the user's *choice* ('system'), not the effective theme.
                Object.values(ICONS).forEach(iconClass => icon.classList.remove(iconClass));
                icon.classList.add(ICONS[theme]);
            }
            
            // The title should tell the user what the *next* click will do.
            const nextThemeIndex = (THEMES.indexOf(theme) + 1) % THEMES.length;
            themeToggle.setAttribute('title', TITLES[THEMES[nextThemeIndex]]);
        } 
        // Case 2: It's the checkbox-slider (like on settings.html)
        else if (themeToggle.tagName.toLowerCase() === 'input' && themeToggle.type === 'checkbox') {
            // Set the 'checked' state based on the *effective* theme.
            // This ensures if the theme is 'system' and the OS is dark, the toggle is 'on'.
            themeToggle.checked = (effectiveTheme === 'dark');
        }
    }

    // Dispatch a custom event so index.html's tooltip can update
    const event = new CustomEvent('themeChanged', { 
        detail: { theme: theme } 
    });
    document.dispatchEvent(event);
}

/**
 * Finds the theme toggle button and attaches the correct event listener.
 */
function setupThemeToggle() {
    const themeToggle = document.getElementById('darkModeToggle');
    if (!themeToggle) return; // Exit if no button on this page

    // --- NEW: Attach the correct listener based on the toggle type ---

    // Case 1: It's the icon-button (index.html)
    if (themeToggle.tagName.toLowerCase() === 'button') {
        themeToggle.addEventListener('click', () => {
            // This button cycles through all 3 themes
            const currentTheme = localStorage.getItem('theme') || 'system';
            const nextThemeIndex = (THEMES.indexOf(currentTheme) + 1) % THEMES.length;
            const nextTheme = THEMES[nextThemeIndex];

            localStorage.setItem('theme', nextTheme);
            applyTheme(nextTheme);
        });
    }
    // Case 2: It's the checkbox-slider (settings.html)
    else if (themeToggle.tagName.toLowerCase() === 'input' && themeToggle.type === 'checkbox') {
        themeToggle.addEventListener('change', () => {
            // This checkbox *only* toggles between 'light' and 'dark'.
            // This is the most intuitive behavior for an on/off switch.
            const newTheme = themeToggle.checked ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    }
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


// --- The HTML pages are responsible for initialization ---
// (No DOMContentLoaded listener here)

