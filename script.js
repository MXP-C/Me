document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Fade-in on scroll for sections
    const sections = document.querySelectorAll('.section');
    const reposGrid = document.querySelector('.repos-grid'); // Declared once at a higher scope

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Fetch GitHub Repositories
    const githubUsername = 'MXP-C'; // User's GitHub username

    async function fetchGitHubRepos() {
        try {
            const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&direction=desc`);
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.statusText}`);
            }
            const repos = await response.json();

            repos.forEach(repo => {
                const repoCard = document.createElement('div');
                repoCard.classList.add('repo-card');
                repoCard.innerHTML = `
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'No description provided.'}</p>
                    <div class="button-wrapper">
                        <div class="button-back-box"></div>
                        <a href="${repo.html_url}" target="_blank" class="btn project-btn">Ver Repositório</a>
                    </div>
                `;
                reposGrid.appendChild(repoCard);
            });
        } catch (error) {
            console.error('Failed to fetch GitHub repositories:', error);
            if (reposGrid) { // Check if reposGrid exists before trying to modify it
                reposGrid.innerHTML = `<p>Não foi possível carregar os repositórios. Por favor, tente novamente mais tarde.</p>`;
            }
        }
    }

    fetchGitHubRepos();

    // Collapsible GitHub Repositories section
    const toggleReposButton = document.getElementById('toggle-repos');

    // Initially collapse the section if there are many repos, or keep expanded
    // For now, let's assume it starts expanded and can be collapsed.
    // If you want it to start collapsed, add 'reposGrid.classList.add('collapsed');' here
    // and change button text to 'Mostrar Mais'.

    if (toggleReposButton && reposGrid) { // Ensure elements exist
        const toggleButtonWrapper = toggleReposButton.closest('.button-wrapper');

        // Set initial state: if reposGrid is collapsed, button is in inactive state
        // If reposGrid is not collapsed, button is in active state
        if (reposGrid.classList.contains('collapsed')) {
            toggleReposButton.textContent = 'Mostrar Mais';
            // No class needed for inactive state, as it's the default hover state
        } else {
            toggleReposButton.textContent = 'Mostrar Menos';
            if (toggleButtonWrapper) {
                toggleButtonWrapper.classList.add('button-active-state'); // Apply active state
            }
        }

        toggleReposButton.addEventListener('click', () => {
            reposGrid.classList.toggle('collapsed');
            if (reposGrid.classList.contains('collapsed')) {
                toggleReposButton.textContent = 'Mostrar Mais';
                if (toggleButtonWrapper) {
                    toggleButtonWrapper.classList.remove('button-active-state'); // Remove active state
                }
            } else {
                toggleReposButton.textContent = 'Mostrar Menos';
                if (toggleButtonWrapper) {
                    toggleButtonWrapper.classList.add('button-active-state'); // Apply active state
                }
            }
        });
    }

    // Linux mascot eyes follow mouse
    const mascot = document.querySelector('.linux-mascot');
    const pupils = document.querySelectorAll('.eye-pupil');

    document.addEventListener('mousemove', (e) => {
        if (!mascot) return;

        const mascotRect = mascot.getBoundingClientRect();
        const mascotCenterX = mascotRect.left + mascotRect.width / 2;
        const mascotCenterY = mascotRect.top + mascotRect.height / 2;

        const mouseX = e.clientX;
        const mouseY = e.clientY;

        pupils.forEach(pupil => {
            const pupilRect = pupil.getBoundingClientRect();
            const pupilCenterX = pupilRect.left + pupilRect.width / 2;
            const pupilCenterY = pupilRect.top + pupilRect.height / 2;

            const angle = Math.atan2(mouseY - pupilCenterY, mouseX - pupilCenterX);
            const distance = Math.min(pupilRect.width / 2, 5); // Limit pupil movement

            const moveX = Math.cos(angle) * distance;
            const moveY = Math.sin(angle) * distance;

            pupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
});
