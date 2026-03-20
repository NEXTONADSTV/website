// bot.js - Sección del asistente NEX
(function() {
    const sectionId = 'bot';
    let chatWindow = null;
    let inputField = null;
    let sendBtn = null;
    
    function addMessage(text, isUser, NS) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${isUser ? 'user-msg' : 'bot-msg'}`;
        const prefix = isUser ? '<i class="fas fa-user"></i> ' : '<i class="fas fa-robot"></i> ';
        msgDiv.innerHTML = prefix + NS.escapeHtml(text);
        chatWindow.appendChild(msgDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
    
    function botResponse(userMsg, NS) {
        const lower = userMsg.toLowerCase();
        if(lower.includes('random') || lower.includes('azar') || lower.includes('sugiere algo') || lower.includes('aleatorio')) {
            const rand = NS.seriesData[Math.floor(Math.random() * NS.seriesData.length)];
            return `🎲 serie aleatoria: "${rand.name}" (${rand.genres.join(', ')}) · ${rand.summary.substring(0,120)}...`;
        }
        const genreMap = ['acción','drama','comedia','terror','ciencia ficción','misterio','thriller','fantasía','suspenso'];
        let matchedGenre = null;
        for(let g of genreMap) if(lower.includes(g)) { matchedGenre = g; break; }
        if(matchedGenre) {
            const filtered = NS.seriesData.filter(s => s.genres.some(g => g.toLowerCase().includes(matchedGenre.toLowerCase())));
            if(filtered.length) {
                const picks = filtered.slice(0,3).map(s=>s.name).join(', ');
                return `🔍 Encontré ${filtered.length} series con el género "${matchedGenre}". Ej: ${picks}. ¿Quieres más detalles?`;
            }
            return `No encontré series con el género exacto "${matchedGenre}", prueba con "drama", "ciencia ficción" o "misterio".`;
        }
        if(lower.includes('recomienda') || lower.includes('mejor valorada') || lower.includes('top') || lower.includes('mejores')) {
            const topRated = [...NS.seriesData].filter(s=>s.rating !== '—').sort((a,b)=>parseFloat(b.rating)-parseFloat(a.rating)).slice(0,3);
            const recs = topRated.map(s=>`${s.name} (⭐ ${s.rating})`).join(' · ');
            return `📺 Mis recomendaciones TOP: ${recs}. Todas disponibles en NEXTON ADS TV.`;
        }
        if(lower.includes('hola') || lower.includes('buenas') || lower.includes('que tal')) return "¡Hola! Soy NEX, tu asistente de series. Pregúntame por género, random o recomendaciones.";
        return `No entendí del todo. Prueba con: "recomienda", "acción", "drama", "random", "mejores series". ¡Estoy aquí para ayudarte!`;
    }
    
    function sendMessage(NS) {
        const msg = inputField.value.trim();
        if(!msg) return;
        addMessage(msg, true, NS);
        inputField.value = '';
        const reply = botResponse(msg, NS);
        setTimeout(() => addMessage(reply, false, NS), 60);
    }
    
    const module = {
        render: function(container, NS) {
            container.innerHTML = `
                <div class="bot-info-card">
                    <h2><i class="fas fa-robot"></i> NEX · Asistente oficial</h2>
                    <p>NEX es el bot inteligente de NEXTON ADS TV. Diseñado para ayudarte a elegir series, recomendarte por género, sugerir contenido aleatorio o destacar los títulos mejor valorados. <strong>Disponible 24/7</strong> para mejorar tu experiencia.</p>
                </div>
                <div class="bot-interface">
                    <div style="display:flex; gap:8px; align-items:center; margin-bottom:0.8rem;"><i class="fas fa-comment-dots"></i> <span style="font-weight:500;">Chatea con NEX</span></div>
                    <div class="chat-window" id="chatWindow"><div class="message bot-msg">🤖 Hola, soy NEX. Pregúntame por series: “recomiéndame algo”, “acción”, “drama”, “random”, o “los mejores ratings”.</div></div>
                    <div class="bot-input-area"><input type="text" id="botUserInput" placeholder="Ej: quiero ver una serie de ciencia ficción..." autocomplete="off"><button id="sendBotMsg"><i class="fas fa-paper-plane"></i> enviar</button></div>
                    <div style="font-size:0.65rem; margin-top:0.7rem; text-align:center;">🗣️ NEX conoce nuestro catálogo de series destacadas.</div>
                </div>
            `;
        },
        attachEvents: function(NS) {
            chatWindow = document.getElementById('chatWindow');
            inputField = document.getElementById('botUserInput');
            sendBtn = document.getElementById('sendBotMsg');
            if(sendBtn && inputField) {
                // Remover eventos previos para evitar duplicados
                const newSendBtn = sendBtn.cloneNode(true);
                sendBtn.parentNode.replaceChild(newSendBtn, sendBtn);
                sendBtn = newSendBtn;
                const newInput = inputField.cloneNode(true);
                inputField.parentNode.replaceChild(newInput, inputField);
                inputField = newInput;
                chatWindow = document.getElementById('chatWindow'); // actualizar referencia
                
                const handler = () => sendMessage(NS);
                sendBtn.addEventListener('click', handler);
                inputField.addEventListener('keypress', (e) => { if(e.key === 'Enter') sendMessage(NS); });
            }
        }
    };
    
    if(window.NEXTON && window.NEXTON.registerSection) {
        window.NEXTON.registerSection(sectionId, module);
    }
})();