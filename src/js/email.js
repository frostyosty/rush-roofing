/// src/js/email.js
import emailjs from 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/+esm';
import { EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, EMAIL_PUBLIC_KEY } from './config.js';

let isInitialized = false;

// Call this ONCE at startup
export function initEmailConfig() {
    if (isInitialized) return;
    
    console.log("⚡ EMAIL SYSTEM V2: Initializing Global Listener...");
    emailjs.init(EMAIL_PUBLIC_KEY);
    
    // --- GLOBAL EVENT LISTENER ---
    // This catches submits anywhere on the page, forever.
    document.addEventListener('submit', (e) => {
        // Log every submit event to see if we catch it
        console.log("⚡ EVENT CAPTURED: Submit detected on:", e.target.id);

        if (e.target && e.target.id === 'embedded-email-form') {
            console.log("✅ TARGET MATCH: Preventing default refresh...");
            e.preventDefault(); // STOP THE PAGE REFRESH
            handleFormSubmit(e.target);
        }
    });

    isInitialized = true;
}

// We keep this function empty so main.js doesn't crash when it calls it
export function attachEmailListeners() {
    // DO NOTHING. The global listener above handles everything now.
}

function handleFormSubmit(form) {
    // 1. Spam Prevention
    const lastSubmit = localStorage.getItem('lastEmailSubmit');
    const now = Date.now();
    const COOLDOWN_MS = 2 * 60 * 1000; 

    if (lastSubmit) {
        const timeDiff = now - parseInt(lastSubmit);
        if (timeDiff < COOLDOWN_MS) {
            const secondsLeft = Math.ceil((COOLDOWN_MS - timeDiff) / 1000);
            showPopup(`Please wait ${secondsLeft} seconds before sending another message.`);
            return;
        }
    }

    // 2. UI Feedback
    const btn = form.querySelector('.submit-btn');
    const originalText = btn ? btn.innerText : 'Send';
    if(btn) {
        btn.innerText = 'Sending...';
        btn.disabled = true;
        btn.style.opacity = '0.7';
    }

    // 3. Prepare Data
    const templateParams = {
        from_name: form.elements['user_name'].value,
        from_email: form.elements['user_email'].value,
        subject: "Website Inquiry",
        message: form.elements['message'].value
    };

    console.log("⚡ EMAILJS: Sending data...", templateParams);

    // 4. Send
    emailjs.send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, templateParams)
        .then(() => {
            console.log("⚡ EMAILJS: Success");
            showPopup('Email sent successfully!');
            localStorage.setItem('lastEmailSubmit', Date.now().toString());
            form.reset();
        })
        .catch((err) => {
            console.error("⚡ EMAILJS ERROR:", err);
            showPopup('Error sending email. Please try again later.');
        })
        .finally(() => {
            if(btn) {
                btn.innerText = originalText;
                btn.disabled = false;
                btn.style.opacity = '1';
            }
        });
}

function showPopup(message) {
    const popup = document.getElementById('toast');
    if (popup) {
        popup.innerText = message;
        popup.classList.remove('hidden');
        popup.style.background = ''; 
        setTimeout(() => popup.classList.add('hidden'), 4000);
    } else {
        alert(message);
    }
}