// index.js - Lógica principal, gestión de caché y navegación
(function() {
    // Variables globales
    window.NEXTON = window.NEXTON || {};
    const NS = window.NEXTON;
    
    NS.seriesData = [];
    NS.currentSection = 'inicio';
    NS.isLoading = false;
    const contentContainer = document.getElementById('dynamicContent');
    const navBtns = document.querySelectorAll('.nav-item');
    
    // Utilidades compartidas
    NS.escapeHtml = function(str) {
        if(!str) return '';
        return str.replace(/[&<>]/g, function(m){
            if(m === '&') return '&amp;';
            if(m === '<') return '&lt;';
            if(m === '>') return '&gt;';
            return m;
        });
    };
    
    NS.renderCardGrid = function(items, titleIcon, titleText) {
        if(!items || !items.length) return `<div class="featured-highlight"><p>Próximamente más series.</p></div>`;
        let gridHtml = `<div class="section-title"><i class="${titleIcon}"></i> ${titleText}</div><div class="series-grid">`;
        for(let serie of items){
            const ratingText = serie.rating !== '—' ? `⭐ ${serie.rating}` : '—';
            const genreHtml = serie.genres.map(g => `<span class="genre-badge">${NS.escapeHtml(g)}</span>`).join('');
            gridHtml += `
                <div class="series-card">
                    <img class="card-img" src="${serie.image}" alt="${NS.escapeHtml(serie.name)}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x180?text=poster+nexton'">
                    <div class="card-content">
                        <div class="card-title"><span>${NS.escapeHtml(serie.name)}</span><span class="rating">${ratingText}</span></div>
                        <div class="genres">${genreHtml}</div>
                        <div class="summary">${NS.escapeHtml(serie.summary)}</div>
                    </div>
                </div>`;
        }
        gridHtml += `</div>`;
        return gridHtml;
    };
    
    // Carga de catálogo con caché
    const CACHE_KEY = 'nexton_catalog_cache';
    const CACHE_TTL = 30 * 60 * 1000;
    
    async function fetchSeriesCatalogOptimized() {
        if(NS.isLoading) return;
        NS.isLoading = true;
        
        const cached = localStorage.getItem(CACHE_KEY);
        if(cached) {
            try {
                const { data, timestamp } = JSON.parse(cached);
                if(Date.now() - timestamp < CACHE_TTL && Array.isArray(data) && data.length) {
                    NS.seriesData = data;
                    NS.isLoading = false;
                    renderCurrentView();
                    return;
                }
            } catch(e) {}
        }
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);
            const response = await fetch('https://api.tvmaze.com/shows?page=0', { signal: controller.signal });
            clearTimeout(timeoutId);
            if(!response.ok) throw new Error(`error ${response.status}`);
            let shows = await response.json();
            const mapped = shows.slice(0, 28).map(show => ({
                id: show.id,
                name: show.name || 'Título sin especificar',
                image: show.image?.medium || show.image?.original || 'https://via.placeholder.com/300x180?text=poster+nexton',
                summary: show.summary ? show.summary.replace(/<[^>]*>/g, '').substring(0, 160) + '...' : 'Próximamente más detalles en NEXTON ADS TV.',
                rating: show.rating?.average ? show.rating.average.toFixed(1) : '—',
                genres: show.genres?.length ? show.genres.slice(0,2) : ['Drama'],
                url: show.url
            }));
            if(!mapped.length) throw new Error('empty');
            NS.seriesData = mapped;
            localStorage.setItem(CACHE_KEY, JSON.stringify({ data: NS.seriesData, timestamp: Date.now() }));
        } catch(e) {
            console.warn("fallback local por error de red");
            NS.seriesData = [
                { id: 1, name: "Bruma Nocturna", image: "https://via.placeholder.com/300x180?text=Bruma+Nocturna", summary: "Thriller psicológico sobre un crítico de series.", rating: "8.4", genres: ["Drama", "Misterio"] },
                { id: 2, name: "Código Nexus", image: "https://via.placeholder.com/300x180?text=Codigo+Nexus", summary: "Ficción distópica y streaming cuántico.", rating: "7.9", genres: ["Ciencia Ficción"] },
                { id: 3, name: "Ritual Analógico", image: "https://via.placeholder.com/300x180?text=Ritual+Analog", summary: "Minimalismo y terror sonoro.", rating: "8.1", genres: ["Terror", "Suspenso"] },
                { id: 4, name: "Última Temporada", image: "https://via.placeholder.com/300x180?text=Ultima+Temp", summary: "Drama meta sobre producción de series.", rating: "7.5", genres: ["Drama"] }
            ];
        } finally {
            NS.isLoading = false;
            renderCurrentView();
        }
    }
    
    // Renderizado según sección actual
    function renderCurrentView() {
        if(!NS.seriesData.length && (NS.currentSection === 'inicio' || NS.currentSection === 'bot')) {
            contentContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-pulse"></i> Cargando catálogo NEXTON...</div>';
            return;
        }
        const section = NS.currentSection;
        if(NS.sections && NS.sections[section] && typeof NS.sections[section].render === 'function') {
            NS.sections[section].render(contentContainer, NS);
        } else {
            contentContainer.innerHTML = '<div class="loading">Sección no disponible</div>';
        }
        // Actualizar clase activa en appbar
        navBtns.forEach(btn => {
            const sec = btn.getAttribute('data-section');
            if(sec === section) btn.classList.add('active');
            else btn.classList.remove('active');
        });
        // Llamar a attachEvents si existe para la sección
        if(NS.sections[section] && typeof NS.sections[section].attachEvents === 'function') {
            setTimeout(() => NS.sections[section].attachEvents(NS), 10);
        }
    }
    
    // Cambiar sección
    NS.setActiveSection = function(sectionId) {
        NS.currentSection = sectionId;
        renderCurrentView();
    };
    
    // Registrar secciones
    NS.sections = {};
    NS.registerSection = function(name, module) {
        NS.sections[name] = module;
    };
    
    // Inicializar navegación
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.getAttribute('data-section');
            if(section) NS.setActiveSection(section);
        });
    });
    
    // Cargar datos
    fetchSeriesCatalogOptimized();
})();