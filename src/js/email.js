/// src/js/email.js
import emailjs from 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/+esm';
import { EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, EMAIL_PUBLIC_KEY } from './config.js';

let isInitialized = false;

// This function now handles EVERYTHING (Init + Listening)
// Call it ONCE at startup.
export function initEmailConfig() {
    if (isInitialized) return;
    
    console.log("📧 EmailJS: Initializing Global Delegation...");
    emailjs.init(EMAIL_PUBLIC_KEY);
    
    // --- GLOBAL EVENT LISTENER (Delegation) ---
    // This sits on the top of the page and catches ANY form submit bubbling up
    document.addEventListener('submit', (e) => {
        // 1. Is this our form?
        if (e.target && e.target.id === 'embedded-email-form') {
            console.log("🛑 EmailJS: Captured Submit Event!");
            e.preventDefault(); // STOP THE REFRESH
            handleFormSubmit(e.target);
        }
    });

    isInitialized = true;
}

// We keep this function name for compatibility with main.js, 
// but it doesn't need to do anything anymore.
export function attachEmailListeners() {
    // No-op (Delegation handles it now)
    // console.log("EmailJS: Listeners handled via global delegation.");
}

function handleFormSubmit(form) {
    // 2. Spam Prevention
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

    // 3. UI Feedback
    const btn = form.querySelector('.submit-btn');
    const originalText = btn ? btn.innerText : 'Send';
    if(btn) {
        btn.innerText = 'Sending...';
        btn.disabled = true;
        btn.style.opacity = '0.7';
    }

    // 4. Prepare Data
    const templateParams = {
        from_name: form.elements['user_name'].value,
        from_email: form.elements['user_email'].value,
        subject: "Website Inquiry",
        message: form.elements['message'].value
    };

    console.log("EmailJS: Sending...", templateParams);

    // 5. Send
    emailjs.send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, templateParams)
        .then(() => {
            console.log("EmailJS: Success");
            showPopup('Email sent successfully!');
            localStorage.setItem('lastEmailSubmit', Date.now().toString());
            form.reset();
        })
        .catch((err) => {
            console.error("EmailJS Error:", err);
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