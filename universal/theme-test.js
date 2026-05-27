// theme.js - Universal Compatibility Version

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
 * Single source of truth for applying a theme.
 * Toggles both modernized ('dark') and legacy ('dark-mode') classes.
 */
function applyTheme(theme) {
    let effectiveTheme = theme;

    if (theme === 'system') {
        effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    const isDark = effectiveTheme === 'dark';
    
    // 1. Modern CSS implementation (html.dark)
    document.documentElement.classList.toggle('dark', isDark);
    
    // 2. Legacy CSS implementation (html.dark-mode and body.dark-mode)
    document.documentElement.classList.toggle('dark-mode', isDark);
    if (document.body) {
        document.body.classList.toggle('dark-mode', isDark);
    }

    // Update the UI of the custom toolbar button, if it exists
    const themeToggle = document.getElementById('darkModeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            Object.values(ICONS).forEach(iconClass => icon.classList.remove(iconClass));
            icon.classList.add(ICONS[theme]);
        }
        
        const nextThemeIndex = (THEMES.indexOf(theme) + 1) % THEMES.length;
        themeToggle.title = TITLES[THEMES[nextThemeIndex]];
    }
}

/**
 * Finds the theme toggle button and attaches the click event listener.
 */
function setupThemeToggle() {
    const themeToggle = document.getElementById('darkModeToggle');
    if (!themeToggle) return; 

    themeToggle.addEventListener('click', () => {
        const currentTheme = localStorage.getItem('theme') || 'system';
        const nextThemeIndex = (THEMES.indexOf(currentTheme) + 1) % THEMES.length;
        const nextTheme = THEMES[nextThemeIndex];

        localStorage.setItem('theme', nextTheme);
        applyTheme(nextTheme);
    });
}

// --- SCRIPT EXECUTION FLOW ---

// 1. Apply the initial theme IMMEDIATELY to prevent FOUC (White Flash)
// Place <script src="theme.js"></script> in your <head> tags.
const savedTheme = localStorage.getItem('theme') || 'system';
applyTheme(savedTheme);

// 2. Listen for OS-level theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if ((localStorage.getItem('theme') || 'system') === 'system') {
        applyTheme('system');
    }
});

// 3. Set up the toggle button once the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
    // Re-apply to ensure the button UI catches up with the initially applied theme
    applyTheme(localStorage.getItem('theme') || 'system');
});