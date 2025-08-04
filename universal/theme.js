// File: theme.js

(function() {
    // Helper function to apply the theme classes
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark-mode');
            if (document.body) document.body.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
            if (document.body) document.body.classList.remove('dark-mode');
        }
    };

    // Helper function to decide which theme to apply based on saved preference and system settings
    const decideAndApplyTheme = () => {
        const savedTheme = localStorage.getItem('theme') || 'system';
        
        if (savedTheme === 'system') {
            // If system is preferred, check the OS setting
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyTheme(systemPrefersDark ? 'dark' : 'light');
        } else {
            // Otherwise, apply the explicitly saved theme
            applyTheme(savedTheme);
        }
    };

    // Run immediately to set the theme on the <html> tag and prevent FOUC
    decideAndApplyTheme();
})();


function setupThemeToggle() {
    const themeToggle = document.getElementById('darkModeToggle');
    if (!themeToggle) return;

    const themes = ['light', 'dark', 'system'];
    const icons = {
        light: 'fa-sun',
        dark: 'fa-moon',
        system: 'fa-circle-half-stroke'
    };
    const titles = {
        light: 'Switch to Dark Mode',
        dark: 'Switch to System Preference',
        system: 'Switch to Light Mode'
    };

    // --- Helper function to update the button's UI (icon and title) ---
    const updateToggleUI = (theme) => {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            // Remove all possible theme icons
            Object.values(icons).forEach(iconClass => icon.classList.remove(iconClass));
            // Add the correct one
            icon.classList.add(icons[theme]);
        }
        // Update the tooltip
        const nextThemeIndex = (themes.indexOf(theme) + 1) % themes.length;
        themeToggle.title = titles[themes[nextThemeIndex]];
    };
    
    // --- Helper function to apply theme and update UI ---
    const applyAndSetPreference = (theme) => {
        localStorage.setItem('theme', theme);

        if (theme === 'system') {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.classList.toggle('dark-mode', systemPrefersDark);
            document.body.classList.toggle('dark-mode', systemPrefersDark);
        } else {
            const isDark = theme === 'dark';
            document.documentElement.classList.toggle('dark-mode', isDark);
            document.body.classList.toggle('dark-mode', isDark);
        }
        updateToggleUI(theme);
    };


    // --- Event Listener for the toggle button ---
    themeToggle.addEventListener('click', () => {
        const currentTheme = localStorage.getItem('theme') || 'system';
        const nextThemeIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
        const nextTheme = themes[nextThemeIndex];
        applyAndSetPreference(nextTheme);
    });

    // --- Listen for changes in OS theme preference ---
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        // Only act if the user's preference is 'system'
        if (localStorage.getItem('theme') === 'system') {
            applyAndSetPreference('system');
        }
    });
    
    // --- Set the initial UI on page load ---
    const initialTheme = localStorage.getItem('theme') || 'system';
    updateToggleUI(initialTheme);
}


document.addEventListener('DOMContentLoaded', () => {
    // Ensure the body class is correct after the DOM has loaded
    const savedTheme = localStorage.getItem('theme') || 'system';
    if (savedTheme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.classList.toggle('dark-mode', systemPrefersDark);
    } else {
        document.body.classList.toggle('dark-mode', savedTheme === 'dark');
    }

    // Setup the button on the page
    setupThemeToggle();
});