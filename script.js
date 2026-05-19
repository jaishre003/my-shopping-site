function setApiKey() {
    const key = prompt("Bhai, apni Google AI Studio wali API Key (AIzaSy...) yahan paste karo:");
    if(key) {
        localStorage.setItem('gemini_api_key', key.trim());
        alert("Key successfully save ho gayi hai! Ab tum chat kar sakte ho. 😎");
    }
}

async function sendMsg() {
    const inputEl = document.getElementById('userInput');
    const container = document.getElementById('chatContainer');
    const text = inputEl.value.trim();
    if(!text) return;

    const API_KEY = localStorage.getItem('gemini_api_key');
    if(!API_KEY) {
        alert("Pehle upar diye gaye 'Set Key' button par click karke apni free API key daalo bhai!");
        return;
    }

    appendMessage(text, 'user');
    inputEl.value = '';
    const typingDiv = appendMessage("Thinking...", 'bot');

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: text }] }],
                systemInstruction: {
                    parts: [{ text: "You are 'Amit's Personal AI Buddy'. Your master/creator is Amit. Act like an ultra-supportive, frank friend (yaar/bro). Use casual Gen-Z Indian slang mixed with Hinglish. Keep answers direct and fast. Always stay loyal to Amit." }]
                }
            })
        });
        const data = await response.json();
        if(data.candidates && data.candidates[0].content.parts[0].text) {
            const reply = data.candidates[0].content.parts[0].text;
            typingDiv.innerHTML = `<strong>Amit's AI:</strong> ${reply}`;
        } else {
            typingDiv.innerHTML = `<strong>Amit's AI:</strong> Key mein koi galti lag rahi hai bhai, naye se check karo!`;
        }
    } catch (error) {
        typingDiv.innerHTML = `<strong>Amit's AI:</strong> Arre Amit bhai, glitch aa gaya. Check karo key sahi hai ya nahi!`;
    }
    container.scrollTop = container.scrollHeight;
}

function appendMessage(text, sender) {
    const container = document.getElementById('chatContainer');
    const row = document.createElement('div');
    row.classList.add('row', sender === 'user' ? 'user-row' : 'bot-row');
    const msgText = document.createElement('div');
    msgText.classList.add('msg-text');
    if(sender === 'user') { msgText.innerHTML = `<strong>You:</strong> ${text}`; } 
    else { msgText.innerHTML = `<strong>Amit's AI:</strong> ${text}`; }
    row.appendChild(msgText);
    container.appendChild(row);
    container.scrollTop = container.scrollHeight;
    return msgText;
}
