/// src/js/email.js
import emailjs from 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/+esm';
import { EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, EMAIL_PUBLIC_KEY } from './config.js';

let isInitialized = false;

export function initEmailConfig() {
    if (!isInitialized) {
        console.log("📧 EmailJS: Initializing with key:", EMAIL_PUBLIC_KEY);
        emailjs.init(EMAIL_PUBLIC_KEY);
        isInitialized = true;
    }
}

export function attachEmailListeners() {
    console.log("📧 EmailJS: Attempting to attach listener...");
    
    const form = document.getElementById('embedded-email-form');
    
    // DEBUG LOGS
    if (!form) {
        console.log("⚠️ EmailJS: Form #embedded-email-form NOT found in DOM. (User might be on Home page?)");
        return;
    }

    if (form.getAttribute('data-listening') === 'true') {
        console.log("ℹ️ EmailJS: Listener already attached. Skipping.");
        return;
    }

    console.log("✅ EmailJS: Form FOUND. Attaching submit listener now.");
    form.setAttribute('data-listening', 'true');

    form.addEventListener('submit', (e) => {
        console.log("🛑 EmailJS: SUBMIT INTERCEPTED. preventing default...");
        e.preventDefault(); // STOP PAGE REFRESH

        // 1. Spam Check
        const lastSubmit = localStorage.getItem('lastEmailSubmit');
        const now = Date.now();
        const COOLDOWN_MS = 2 * 60 * 1000; 

        if (lastSubmit) {
            const timeDiff = now - parseInt(lastSubmit);
            if (timeDiff < COOLDOWN_MS) {
                console.warn("EmailJS: Spam cooldown active.");
                const secondsLeft = Math.ceil((COOLDOWN_MS - timeDiff) / 1000);
                showPopup(`Please wait ${secondsLeft} seconds before sending another message.`);
                return;
            }
        }

        // 2. UI Feedback
        const btn = form.querySelector('.submit-btn');
        const originalText = btn.innerText;
        btn.innerText = 'Sending...';
        btn.disabled = true;
        btn.style.opacity = '0.7';

        // 3. Prepare Data
        const templateParams = {
            from_name: form.elements['user_name'].value,
            from_email: form.elements['user_email'].value,
            subject: "Website Inquiry",
            message: form.elements['message'].value
        };
        console.log("EmailJS: Sending data...", templateParams);

        // 4. Send
        emailjs.send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, templateParams)
            .then(() => {
                console.log("EmailJS: SUCCESS");
                showPopup('Email sent successfully!');
                localStorage.setItem('lastEmailSubmit', Date.now().toString());
                form.reset();
            })
            .catch((err) => {
                console.error("EmailJS ERROR:", err);
                showPopup('Error sending email. Please try again later.');
            })
            .finally(() => {
                btn.innerText = originalText;
                btn.disabled = false;
                btn.style.opacity = '1';
            });
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