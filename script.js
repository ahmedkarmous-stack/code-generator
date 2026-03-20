document.addEventListener('DOMContentLoaded', function() {
    const qrInput = document.getElementById('qr-input');
    const generateBtn = document.getElementById('generate-btn');
    const qrCodeContainer = document.getElementById('qr-code');
    const qrResult = document.getElementById('qr-result');
    const downloadBtn = document.getElementById('download-btn');
    const selfQrContainer = document.getElementById('self-qr');

    let currentQR = null;

    // Generate QR code for the current page (self-reference)
    function generateSelfQR() {
        const currentURL = window.location.href;

        new QRCode(selfQrContainer, {
            text: currentURL,
            width: 150,
            height: 150,
            colorDark: "#1e293b",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }

    // Generate QR code from user input
    function generateQR() {
        const text = qrInput.value.trim();

        if (!text) {
            showError('Veuillez entrer un texte ou une URL');
            return;
        }

        // Add loading state
        generateBtn.textContent = 'Génération...';
        generateBtn.disabled = true;

        // Clear previous QR code
        qrCodeContainer.innerHTML = '';

        // Small delay for animation effect
        setTimeout(() => {
            // Create new QR code
            currentQR = new QRCode(qrCodeContainer, {
                text: text,
                width: 220,
                height: 220,
                colorDark: "#1e293b",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });

            // Add success class to result container
            qrResult.classList.add('has-qr');

            // Show download button with animation
            downloadBtn.classList.remove('hidden');
            downloadBtn.style.opacity = '0';
            downloadBtn.style.transform = 'translateY(10px)';

            requestAnimationFrame(() => {
                downloadBtn.style.transition = 'opacity 0.3s, transform 0.3s';
                downloadBtn.style.opacity = '1';
                downloadBtn.style.transform = 'translateY(0)';
            });

            // Reset button state
            generateBtn.textContent = 'Générer le QR Code';
            generateBtn.disabled = false;

            // Scroll to result
            qrResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    }

    // Show error message
    function showError(message) {
        qrInput.style.borderColor = '#ef4444';
        qrInput.style.animation = 'shake 0.5s ease';

        setTimeout(() => {
            qrInput.style.borderColor = '';
            qrInput.style.animation = '';
        }, 500);

        // Create temporary error message
        const existingError = document.querySelector('.error-message');
        if (existingError) existingError.remove();

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #ef4444;
            font-size: 0.9rem;
            margin-top: 0.5rem;
            text-align: center;
            animation: fadeIn 0.3s ease;
        `;

        qrInput.parentElement.appendChild(errorDiv);

        setTimeout(() => {
            errorDiv.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => errorDiv.remove(), 300);
        }, 3000);
    }

    // Download QR code as PNG
    function downloadQR() {
        const canvas = qrCodeContainer.querySelector('canvas');
        const img = qrCodeContainer.querySelector('img');

        // Create a larger canvas for better quality download
        const downloadCanvas = document.createElement('canvas');
        const ctx = downloadCanvas.getContext('2d');
        const padding = 40;
        const size = 220 + (padding * 2);

        downloadCanvas.width = size;
        downloadCanvas.height = size;

        // White background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);

        if (canvas) {
            ctx.drawImage(canvas, padding, padding);
        } else if (img) {
            ctx.drawImage(img, padding, padding);
        }

        const link = document.createElement('a');
        const timestamp = new Date().toISOString().slice(0, 10);
        link.download = `qrcode-${timestamp}.png`;
        link.href = downloadCanvas.toDataURL('image/png');
        link.click();

        // Visual feedback
        downloadBtn.textContent = 'Téléchargé !';
        downloadBtn.style.background = '#10b981';

        setTimeout(() => {
            downloadBtn.textContent = 'Télécharger le QR Code';
            downloadBtn.style.background = '';
        }, 2000);
    }

    // Add CSS animations dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-5px); }
            40%, 80% { transform: translateX(5px); }
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-5px); }
        }
    `;
    document.head.appendChild(style);

    // Event listeners
    generateBtn.addEventListener('click', generateQR);

    qrInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateQR();
        }
    });

    // Clear error state on input
    qrInput.addEventListener('input', function() {
        qrInput.style.borderColor = '';
        const existingError = document.querySelector('.error-message');
        if (existingError) existingError.remove();
    });

    downloadBtn.addEventListener('click', downloadQR);

    // Generate self-referencing QR code on page load
    generateSelfQR();

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    // Observe articles for scroll animation
    document.querySelectorAll('.explanation article').forEach((article, index) => {
        article.style.opacity = '0';
        article.style.transform = 'translateY(20px)';
        article.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(article);
    });

    // Observe diagram items
    document.querySelectorAll('.diagram-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(15px)';
        item.style.transition = `opacity 0.4s ease ${index * 0.05}s, transform 0.4s ease ${index * 0.05}s`;
        observer.observe(item);
    });

    // Observe steps
    document.querySelectorAll('.step').forEach((step, index) => {
        step.style.opacity = '0';
        step.style.transform = 'translateX(-20px)';
        step.style.transition = `opacity 0.5s ease ${index * 0.08}s, transform 0.5s ease ${index * 0.08}s`;
        observer.observe(step);
    });
});
