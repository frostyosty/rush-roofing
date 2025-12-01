/// src/js/config.js
console.log("Loading config.js...");

// --- 🔐 SECURITY SETTINGS 🔐 ---
// Change this to switch how you open the admin menu.
// Options: 'longpress' (3 seconds) OR 'swipe' (Slide header right)
export const DEV_TRIGGER = 'swipe'; 
export const FORCE_OFFLINE = false; 

// 1. SUPABASE KEYS (Keep your existing Rush keys here)
export const SUPABASE_URL = "https://oannlpewujcnmbzzvklu.supabase.co"; 
export const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hbm5scGV3dWpjbm1ienp2a2x1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzQwMDQsImV4cCI6MjA2MTcxMDAwNH0.2hKaOLPYsRh6p1CQFfLYqpTo2Cz1WuQa4Y5n0AIoNPE";

// 2. EMAIL KEYS (UPDATE THESE!)
export const EMAIL_SERVICE_ID = "service_4q7zz8k";
export const EMAIL_TEMPLATE_ID = "template_5x0ggjh";
export const EMAIL_PUBLIC_KEY = "fuyR9UxYzfx8CjIDm";

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("CRITICAL: Keys are empty.");
}