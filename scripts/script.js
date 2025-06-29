function fetchData() {
    fetch('projects.json')
        .then(response => response.json())
        .then(data => {
            data.projects.forEach(project => {
                createProjectElement(
                    project.title,
                    project.animationName,
                    project.topOffset || (Math.random() * 50 + 25),
                    project.speed || (Math.random() * 5 + 3),
                    project.moreInformation,
                    project.image
                );
            });
        });
}

function createProjectElement(projectName, animationName, topOffset, speed, modalContent, image) {
    const projectElement = document.createElement('div');
    projectElement.classList.add('project');
    projectElement.textContent = projectName;
    projectElement.style.top = `${topOffset}%`;
    projectElement.style.animationDuration = `${speed}s`;
    projectElement.style.animationName = `${animationName}`;

    // Modal structure
    const modal = document.createElement('div');
    modal.classList.add('modal');
    // Title
    const modalTitle = document.createElement('h2');
    modalTitle.className = 'modal-title';
    modalTitle.textContent = projectName;
    modal.appendChild(modalTitle);
    // Text
    const modalText = document.createElement('div');
    modalText.className = 'modal-text';
    modalText.innerHTML = modalContent.replace(/\n/g, '<br>');
    modal.appendChild(modalText);
    // Image(s) or video(s)
    if (image) {
        let images = image;
        if (typeof image === 'string' && image.trim().startsWith('[') && image.trim().endsWith(']')) {
            try {
                images = JSON.parse(image.replace(/'/g, '"'));
            } catch (e) {
                images = [];
            }
        }
        if (!Array.isArray(images)) images = [images];
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'modal-images';

        images.forEach(mediaSrc => {
            if (mediaSrc && mediaSrc.trim()) {
                let src = mediaSrc.trim();
                if (!src.startsWith('images/')) {
                    src = 'images/' + src.replace(/^\[|\]$/g, '').replace(/['"]+/g, '');
                }
                if (src.match(/\.(mp4|webm|ogg)$/i)) {
                    const video = document.createElement('video');
                    video.src = src;
                    video.className = 'modal-video';
                    video.controls = true;
                    video.style.maxWidth = '90%';
                    video.style.maxHeight = '220px';
                    video.style.borderRadius = '12px';
                    video.style.margin = '0.5em 0';
                    imageWrapper.appendChild(video);
                } else {
                    const img = document.createElement('img');
                    img.src = src;
                    img.className = 'modal-image';
                    img.alt = projectName;
                    imageWrapper.appendChild(img);
                }
            }
        });
        modal.appendChild(imageWrapper);
    }

    const overlay = document.createElement('div');
    overlay.classList.add('modal-overlay');

    document.body.appendChild(modal);
    document.body.appendChild(overlay);

    projectElement.addEventListener('click', () => {
        modal.classList.add('active');
        overlay.classList.add('active');
        document.querySelectorAll('.project').forEach(el => el.classList.add('active'));
        projectElement.classList.add('activated');
    });

    overlay.addEventListener('click', () => {
        modal.classList.remove('active');
        overlay.classList.remove('active');
        document.querySelectorAll('.project').forEach(el => el.classList.remove('active'));
        projectElement.classList.remove('activated');
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            modal.classList.remove('active');
            overlay.classList.remove('active');
            document.querySelectorAll('.project').forEach(el => el.classList.remove('active'));
            projectElement.classList.remove('activated');
        }
    });



    document.body.appendChild(projectElement);
}

function imagesZoom() {
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('modal-image')) {
            e.stopPropagation();
            const src = e.target.getAttribute('src');
            // Remove any existing lightbox
            document.querySelectorAll('.image-lightbox').forEach(lb => lb.remove());
            const lightbox = document.createElement('div');
            lightbox.className = 'image-lightbox';
            const img = document.createElement('img');
            img.src = src;
            lightbox.appendChild(img);
            // Sluiten op klik of Escape
            lightbox.addEventListener('click', () => {
                lightbox.remove();
            });
            document.addEventListener('keydown', function escListener(ev) {
                if (ev.key === 'Escape') {
                    lightbox.remove();
                    document.removeEventListener('keydown', escListener);
                }
            });
            document.body.appendChild(lightbox);
        }
    }, true);
}

function changeFontFamily() {
    const fonts = ['Pacifico', 'Indie Flower', 'Rouge Script', 'Foldit', 'Rubik Beastly'];
    const Title = document.querySelector('h1');

    let currentFontIndex = 0;
    Title.onclick = function () {
        Title.style.fontFamily = fonts[currentFontIndex];
        currentFontIndex = (currentFontIndex + 1) % fonts.length;
    };
}

function loadHeader() {
    const header = document.querySelector('.header');
    header.classList.add('active');
}

function loader(callback) {
    const loader = document.createElement('div');
    loader.classList.add('loader');
    const overlay = document.createElement('div');
    overlay.classList.add('loader-overlay');

    document.body.appendChild(loader);
    document.body.appendChild(overlay);

    let progress = 0;
    loader.innerHTML = progress + '%';

    const interval = setInterval(() => {
        progress++;
        loader.innerHTML = progress + '%';
        overlay.style.backdropFilter = `blur(${20 - (progress * 0.2)}px)`;
        if (progress >= 100) {
            clearInterval(interval);
            loader.remove();
            overlay.remove();
            if (typeof callback === 'function') callback();
        }
    }, 10);
}

// function enableHeaderGlow() {
//     const header = document.querySelector('.header');
//     if (!header) return;
//     header.addEventListener('mouseenter', () => header.classList.add('cursor-glow'));
//     header.addEventListener('mouseleave', () => header.classList.remove('cursor-glow'));
// }

window.onload = () => {
    loader(() => {
        fetchData();
        loadHeader();
        changeFontFamily();
        // enableHeaderGlow();
        imagesZoom();
    });
};
