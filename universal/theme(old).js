// This function runs immediately to apply the theme on initial page load
(function () {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.documentElement.classList.add('dark-mode');
        // In your provided code, the class was added to body. 
        // It's often better to add to documentElement (<html>) to avoid a flash of unstyled content.
        // Let's stick to your original implementation for consistency.
        document.body.classList.add('dark-mode');
    }
})();


// This function will be called ONLY on the settings page to set up the toggle
function setupThemeToggle() {
    const darkModeToggle = document.getElementById('darkModeToggle');

    // If the toggle element doesn't exist on the current page, do nothing.
    if (!darkModeToggle) {
        return;
    }

    // Set the toggle's initial state based on the theme
    darkModeToggle.checked = localStorage.getItem('darkMode') === 'true';

    // Add listener for when the toggle is clicked
    darkModeToggle.addEventListener('change', () => {
        if (darkModeToggle.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'false');
        }
    });
}