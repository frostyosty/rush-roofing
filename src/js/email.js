/// src/js/email.js
import emailjs from 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/+esm';
import { EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, EMAIL_PUBLIC_KEY } from './config.js';

let isInitialized = false;

export function initEmailConfig() {
    if (isInitialized) return;
    
    console.log("⚡ EMAIL V3: Global Listener Active");
    emailjs.init(EMAIL_PUBLIC_KEY);
    
    document.addEventListener('submit', (e) => {
        const form = e.target;
        
        // ROBUST CHECK: Does this form look like our contact form?
        // We check if it has the specific email input field we use.
        if (form && form.elements['user_email']) {
            console.log("✅ CONTACT FORM DETECTED. Intercepting...");
            e.preventDefault(); // STOP REFRESH
            handleFormSubmit(form);
        } else {
            console.log("Ignored non-contact form submission.");
        }
    });

    isInitialized = true;
}

// Keep empty for compatibility
export function attachEmailListeners() {}

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
    const btn = form.querySelector('button[type="submit"]'); // Robust selector
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

    console.log("⚡ Sending to EmailJS...", templateParams);

    // 4. Send
    emailjs.send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, templateParams)
        .then(() => {
            console.log("⚡ SUCCESS");
            showPopup('Email sent successfully!');
            localStorage.setItem('lastEmailSubmit', Date.now().toString());
            form.reset();
        })
        .catch((err) => {
            console.error("⚡ ERROR:", err);
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