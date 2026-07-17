document.addEventListener('DOMContentLoaded', () => {
    // Add any necessary interactivity here
    console.log('Vimet Store initialized');

    // Enable search bar functionality
    const searchInput = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-bar button');

    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                // In a real application, you would redirect to a search results page
                alert(`Buscando: ${query}`);
            }
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    alert(`Buscando: ${query}`);
                }
            }
        });
    }

    // Mobile menu toggle logic
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const headerNav = document.getElementById('headerNav');

    if (mobileMenuBtn && closeMenuBtn && headerNav) {
        mobileMenuBtn.addEventListener('click', () => {
            headerNav.classList.add('active');
            document.body.style.overflow = 'hidden'; // Evitar scroll de fondo
        });

        closeMenuBtn.addEventListener('click', () => {
            headerNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
});
