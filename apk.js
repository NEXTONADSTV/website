// apk.js - Sección de descarga de la APK (Android) - NEXTON ADS TV
(function() {
    const sectionId = 'apk';
    const module = {
        render: function(container, NS) {
            container.innerHTML = `
                <div class="download-card">
                    <h2><i class="fab fa-android"></i> App para Android</h2>
                    <p>¡Ya disponible! La aplicación oficial de NEXTON ADS TV para dispositivos Android. Disfruta de streaming optimizado, funcional y ligero.</p>
                    <p><strong>Características:</strong> Catálogo completo, sincronización nativa, asistente NEX integrado y notificaciones de estrenos.</p>
                    <a href="apk/NextonAdsTV.apk" download="NextonAdsTV.apk" id="downloadApkBtn" class="mock-btn" style="text-decoration:none; display:inline-block; width:auto; padding: 0.8rem 1.5rem;">
                        <i class="fas fa-download"></i> Descargar APK (v1.0.0)
                    </a>
                    <p style="font-size:0.75rem; margin-top:1rem;">*Versión oficial optimizada (2.9 MB). Compatible con Android 5.0+.</p>
                </div>
                <div style="background:#f2f2f6; border-radius:1.5rem; padding:1rem; text-align:center;">
                    <i class="fas fa-shield-halved" style="font-size:2rem; color:#111112;"></i>
                    <p style="font-size:0.7rem; margin-top:0.5rem;">Segura, ligera y funcional. Sin anuncios intrusivos.</p>
                </div>
            `;
        },
        attachEvents: function(NS) {
            const btn = document.getElementById('downloadApkBtn');
            if(btn) {
                btn.addEventListener('click', () => {
                    console.log('Descarga de APK iniciada');
                });
            }
        }
    };
    if(window.NEXTON && window.NEXTON.registerSection) {
        window.NEXTON.registerSection(sectionId, module);
    }
})();
