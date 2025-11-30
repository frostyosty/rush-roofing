/// src/js/security.js
import emailjs from 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/+esm';
import { EMAIL_SERVICE_ID, EMAIL_PUBLIC_KEY } from './config.js';

// You will need to create this template in EmailJS later
const SECURITY_TEMPLATE_ID = "template_security"; 

emailjs.init(EMAIL_PUBLIC_KEY);

export function notifyAdminOfChange() {
    // 1. CHECK ADMIN FLAG (Renamed Key)
    if (localStorage.getItem('rush_is_admin_device')) {
        console.log("Security: Change made by Rush Admin. No email sent.");
        return;
    }

    // 2. THROTTLE (Renamed Key)
    const lastSent = localStorage.getItem('rush_last_security_alert');
    const now = Date.now();
    if (lastSent && (now - parseInt(lastSent) < 10 * 60 * 1000)) {
        return;
    }

    console.warn("Security: Change from unknown device. Sending Alert...");

    const templateParams = {
        time: new Date().toLocaleString(),
        device_info: navigator.userAgent
    };

    emailjs.send(EMAIL_SERVICE_ID, SECURITY_TEMPLATE_ID, templateParams)
        .then(() => {
            console.log("Security: Alert Sent.");
            localStorage.setItem('rush_last_security_alert', now.toString());
        })
        .catch(err => console.error("Security: Failed to send alert", err));
}