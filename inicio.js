// inicio.js - Sección de inicio (destacados y nuevos estrenos)
(function() {
    const sectionId = 'inicio';
    const module = {
        render: function(container, NS) {
            if(!NS.seriesData.length) {
                container.innerHTML = '<div class="loading"><i class="fas fa-spinner"></i> Cargando contenido destacado...</div>';
                return;
            }
            let destacado = [...NS.seriesData].filter(s => s.rating !== '—').sort((a,b) => parseFloat(b.rating) - parseFloat(a.rating)).slice(0,4);
            if(destacado.length < 4) destacado = NS.seriesData.slice(0,4);
            let nuevo = [...NS.seriesData].sort((a,b) => b.id - a.id).slice(0,4);
            
            const destacadoHtml = NS.renderCardGrid(destacado, "fas fa-crown", "🌟 Destacado de la semana");
            const nuevoHtml = NS.renderCardGrid(nuevo, "fas fa-sparkle", "✨ Nuevos estrenos");
            
            container.innerHTML = `
                <div class="featured-highlight" style="background:transparent; padding:0;">
                    ${destacadoHtml}
                    <div style="margin-top: 2rem;">${nuevoHtml}</div>
                </div>
                <div style="font-size:0.7rem; text-align:center; margin-top:1.5rem; color:#6b6b7a;">Explora lo mejor del streaming independiente.</div>
            `;
        },
        attachEvents: function(NS) {
            // No hay eventos específicos en inicio
        }
    };
    if(window.NEXTON && window.NEXTON.registerSection) {
        window.NEXTON.registerSection(sectionId, module);
    }
})();