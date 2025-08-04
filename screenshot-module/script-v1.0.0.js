// atikle screenshot module script-v1.0.0.js {Working, Prod}
// --- Screenshot Functionality ---
        const screenshotBtn = document.getElementById('screenshotBtn');
        screenshotBtn.addEventListener('click', () => {
            // Hides the toolbar itself before taking the screenshot
            document.querySelector('.reading-toolbar').style.display = 'none';

            html2canvas(document.body).then(canvas => {
                const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                const link = document.createElement('a');
                link.download = 'atikle.github.io_screenshot.png';
                link.href = image;
                link.click();

                // Shows the toolbar again after the screenshot is taken
                document.querySelector('.reading-toolbar').style.display = 'flex';
            });
        });