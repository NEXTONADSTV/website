// info.js - Sección de información sobre NEXTON ADS TV
(function() {
    const sectionId = 'info';
    const module = {
        render: function(container, NS) {
            container.innerHTML = `
                <div class="info-card">
                    <h2><i class="fas fa-info-circle"></i> Sobre NEXTON ADS TV</h2>
                    <p>NEXTON ADS TV es una plataforma de streaming experimental con alma independiente. Nuestro propósito es ofrecer una experiencia fresca, conectando audiencias con series de calidad, narrativas alternativas y una interfaz moderna e inteligente.</p>
                    <p>✔️ <strong>¿Para qué sirve?</strong> Para descubrir series, explorar géneros únicos, recibir recomendaciones personalizadas a través de nuestro asistente NEX, y disfrutar de contenido sin barreras.</p>
                    <p>✔️ <strong>¿Cómo te ayuda?</strong> Te brinda un catálogo seleccionado, información detallada de cada producción, un bot inteligente que sugiere según tus gustos, y próximamente descargas para dispositivos Android.</p>
                    <p>Diseñado para amantes de las series que buscan originalidad y tecnología al servicio del entretenimiento.</p>
                    <div style="margin-top: 1rem;"><span class="genre-badge" style="background:#e4e4ec;">🔮 beta permanente</span> <span class="genre-badge">🎬 sin publicidad invasiva</span></div>
                </div>
            `;
        },
        attachEvents: function(NS) {}
    };
    if(window.NEXTON && window.NEXTON.registerSection) {
        window.NEXTON.registerSection(sectionId, module);
    }
})();