/// src/js/fallbackData.js
export const FALLBACK_ITEMS = [
    // HOME PAGE
    {
        type: 'section',
        page: 'home',
        content: '<h3 style="color:#37474f;">Rush Roofing Services</h3><p>Professional roofing solutions for Tauranga and the Bay of Plenty. We specialize in re-roofing, leak repairs, and long-run iron installations.</p><p><b>Emergency Repairs:</b> Available for urgent leak fixes.</p>',
        styles: { padding: "30px", maxWidth: "800px", margin: "20px auto", background: "white", borderRadius: "4px", borderTop: "4px solid #f57c00", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }
    },
    {
        type: 'carousel',
        page: 'home',
        content: '<h3 style="color:#37474f; text-transform: uppercase; text-align:center;">Recent Projects</h3><div style="text-align: center;"><img src="https://placehold.co/800x400/37474f/ffffff?text=Rush+Roofing+Project" alt="Roofing Project" style="max-width: 100%; height: 350px; object-fit: cover; border-radius: 4px;"></div>',
        styles: { padding: "30px", maxWidth: "900px", margin: "20px auto", background: "white", borderRadius: "4px" }
    },

    // SERVICES
    {
        type: 'header',
        page: 'services',
        content: '<h3>Our Services</h3><p>Quality workmanship guaranteed.</p>',
        styles: { textAlign: "center", marginTop: "40px", color: "#37474f" }
    },
    {
        type: 'section',
        page: 'services',
        content: '<h4>Re-Roofing</h4><ul><li>Long-run Iron Installation</li><li>Decramastic Tile Replacement</li></ul>',
        styles: { padding: "20px", margin: "10px auto", maxWidth: "700px", background: "white", borderLeft: "5px solid #f57c00", borderRadius: "2px" }
    },

    // CONTACT
    {
        type: 'contact',
        page: 'contact',
        content: '<h3>Get a Free Quote</h3><p><b>Email:</b> <a href="mailto:srroofing@outlook.co.nz" style="color:white;">srroofing@outlook.co.nz</a></p>',
        styles: { padding: "30px", maxWidth: "800px", margin: "20px auto", textAlign: "center", background: "#37474f", color: "white", borderRadius: "4px" }
    },
    
    // NOTEPAD
    {
        type: 'notepad',
        page: 'home',
        content: '',
        styles: { padding: "10px", margin: "20px auto", maxWidth: "600px", background: "transparent" }
    }
];