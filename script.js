document.addEventListener('DOMContentLoaded', () => {
    // Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .materials-carousel-wrapper, .review-card, .work-item, .section-header, .location-container, .hero-graphics, .hero-classic h1, .hero-classic p').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)`;
        el.style.transitionDelay = `${(i % 3) * 0.1}s`;
        observer.observe(el);
    });
    
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .fade-in-up {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        </style>
    `);

    // Smooth scroll for nav links (only if on index page)
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Drag and Drop Logic for Quote Page
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const fileList = document.getElementById('file-list');
    
    if (dropZone && fileInput && fileList) {
        dropZone.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', handleFiles);

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.add('dragover'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'), false);
        });

        dropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles({ target: { files: files } });
        });

        function handleFiles(e) {
            const files = Array.from(e.target.files);
            
            files.forEach(file => {
                const item = document.createElement('div');
                item.className = 'file-item fade-in-up';
                item.innerHTML = `
                    <i class="fa-solid fa-file-check"></i>
                    <span>${file.name}</span>
                    <span style="margin-left:auto; color:var(--text-muted); font-size:0.8rem;">
                        ${(file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                `;
                fileList.appendChild(item);
            });
        }

        // Calculate Button Simulation
        const calcBtn = document.getElementById('calc-btn');
        if(calcBtn) {
            calcBtn.addEventListener('click', () => {
                if(fileList.children.length === 0) {
                    alert('Please upload a 3D model first.');
                    return;
                }
                const email = document.querySelector('input[type="email"]').value;
                if(!email) {
                    alert('Please enter your email address.');
                    return;
                }
                calcBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Calculating...';
                setTimeout(() => {
                    calcBtn.innerHTML = '<i class="fa-solid fa-check"></i> Quote Sent to Email!';
                    calcBtn.classList.add('btn-dark');
                    calcBtn.classList.remove('btn-primary');
                }, 1500);
            });
        }
    }
});
