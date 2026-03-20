// canal.js - Sección del canal oficial - NEXTON ADS TV
(function() {
    const sectionId = 'canal';
    const module = {
        render: function(container, NS) {
            container.innerHTML = `
                <div class="channel-card">
                    <h2><i class="fas fa-tower-cell"></i> Canal oficial NEXTON ADS TV</h2>
                    <p>Únete a nuestro canal oficial de Telegram para recibir contenido exclusivo: detrás de cámaras, entrevistas con creadores, avances de series y eventos en vivo. Sé el primero en conocer los próximos lanzamientos.</p>
                    <p>📺 Beneficios: acceso anticipado a estrenos, sesiones Q&A y material adicional.</p>
                    <a href="https://t.me/nextonadstv_channel" target="_blank" id="subscribeBtn" class="mock-btn" style="text-decoration:none; display:inline-block; width:auto; padding: 0.8rem 1.5rem;">
                        <i class="fab fa-telegram"></i> Unirse al Canal de Telegram
                    </a>
                    <p style="margin-top: 0.8rem; font-size:0.7rem;">🔔 Novedades, comunidad y soporte directo.</p>
                </div>
                <div style="background:#ffffffcc; border-radius:1.2rem; padding:1rem; text-align:center; font-size:0.8rem;">
                    <i class="fas fa-envelope"></i> nexton@ads.tv · canal oficial de comunicación
                </div>
            `;
        },
        attachEvents: function(NS) {
            const btn = document.getElementById('subscribeBtn');
            if(btn) {
                btn.addEventListener('click', () => {
                    console.log('Redirección al canal de Telegram');
                });
            }
        }
    };
    if(window.NEXTON && window.NEXTON.registerSection) {
        window.NEXTON.registerSection(sectionId, module);
    }
})();
