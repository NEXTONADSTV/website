// apk.js - Sección de descarga de la APK (Android)
(function() {
    const sectionId = 'apk';
    const module = {
        render: function(container, NS) {
            container.innerHTML = `
                <div class="download-card">
                    <h2><i class="fab fa-android"></i> App para Android</h2>
                    <p>Próximamente, la aplicación oficial de NEXTON ADS TV estará disponible para dispositivos Android. Disfruta de streaming sin interrupciones, modo offline y recomendaciones inteligentes donde quieras.</p>
                    <p><strong>Características:</strong> Catálogo completo, sincronización con tu cuenta, asistente NEX integrado y descargas de episodios.</p>
                    <button id="mockApkBtn" class="mock-btn"><i class="fas fa-download"></i> Simular descarga (APK demo)</button>
                    <p style="font-size:0.75rem; margin-top:1rem;">*Versión en desarrollo. Regístrate para recibir novedades.</p>
                </div>
                <div style="background:#f2f2f6; border-radius:1.5rem; padding:1rem; text-align:center;">
                    <i class="fas fa-qrcode" style="font-size:2rem;"></i>
                    <p style="font-size:0.7rem;">Escanea para acceder a la beta privada (próximamente)</p>
                </div>
            `;
        },
        attachEvents: function(NS) {
            const btn = document.getElementById('mockApkBtn');
            if(btn) {
                btn.removeEventListener('click', this.handler);
                this.handler = () => alert('📱 Simulador de descarga: NEXTON ADS TV para Android (demo técnica). Versión estable muy pronto.');
                btn.addEventListener('click', this.handler);
            }
        },
        handler: null
    };
    if(window.NEXTON && window.NEXTON.registerSection) {
        window.NEXTON.registerSection(sectionId, module);
    }
})();