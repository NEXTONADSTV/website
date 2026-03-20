// canal.js - Sección del canal oficial
(function() {
    const sectionId = 'canal';
    const module = {
        render: function(container, NS) {
            container.innerHTML = `
                <div class="channel-card">
                    <h2><i class="fas fa-tower-cell"></i> Canal oficial NEXTON ADS TV</h2>
                    <p>Suscríbete a nuestro canal para contenido exclusivo: detrás de cámaras, entrevistas con creadores, avances de series y eventos en vivo. Sé el primero en conocer los próximos lanzamientos.</p>
                    <p>📺 Beneficios: acceso anticipado a estrenos, sesiones Q&A y material adicional.</p>
                    <button id="subscribeMockBtn" class="mock-btn"><i class="fab fa-youtube"></i> Suscripción simulada</button>
                    <p style="margin-top: 0.8rem; font-size:0.7rem;">🔔 Próximamente: comunidad en Telegram y Discord.</p>
                </div>
                <div style="background:#ffffffcc; border-radius:1.2rem; padding:1rem; text-align:center; font-size:0.8rem;">
                    <i class="fas fa-envelope"></i> nexton@ads.tv · canal en construcción activa
                </div>
            `;
        },
        attachEvents: function(NS) {
            const btn = document.getElementById('subscribeMockBtn');
            if(btn) {
                btn.removeEventListener('click', this.handler);
                this.handler = () => alert('✅ ¡Gracias por tu interés! Recibirás novedades del canal oficial de NEXTON ADS TV.');
                btn.addEventListener('click', this.handler);
            }
        },
        handler: null
    };
    if(window.NEXTON && window.NEXTON.registerSection) {
        window.NEXTON.registerSection(sectionId, module);
    }
})();