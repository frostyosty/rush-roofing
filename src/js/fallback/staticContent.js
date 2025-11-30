/// src/js/fallback/staticContent.js

export const STATIC_CONTENT = [
    // --- HOME PAGE ---
    {
        id: 'static_rr_1',
        type: 'section',
        page: 'home',
        position: 1,
        content: '<h3 style="color:#37474f;">Rush Roofing Services</h3><p>Professional roofing solutions for Tauranga and the Bay of Plenty. We specialize in re-roofing, leak repairs, and long-run iron installations.</p><p><b>Emergency Repairs:</b> Available for urgent leak fixes.</p>',
        styles: { padding: "30px", maxWidth: "800px", margin: "20px auto", background: "white", borderRadius: "4px", borderTop: "4px solid #f57c00", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }
    },
    {
        id: 'static_rr_2',
        type: 'carousel', 
        page: 'home',
        position: 2,
        content: '<h3 style="color:#37474f; text-transform: uppercase; text-align:center;">Recent Projects</h3><div style="text-align: center; margin-bottom: 20px;"><button id="doorsButton" class="filter-btn">Re-Roofs</button><button id="windowsButton" class="filter-btn">Commercial</button><button id="handlesButton" class="filter-btn">Spouting</button></div><div style="text-align: center;"><img id="carouselImage" src="https://placehold.co/800x400/37474f/ffffff?text=Rush+Roofing+Project" alt="Roofing Project" style="max-width: 100%; height: 350px; object-fit: cover; border-radius: 4px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"></div>',
        styles: { padding: "30px", maxWidth: "900px", margin: "20px auto", background: "white", borderRadius: "4px" }
    },
    
    // --- SERVICES PAGE (Was Products) ---
    {
        id: 'static_rr_3',
        type: 'header',
        page: 'services', // Renamed from 'products'
        position: 1,
        content: '<h3>Our Services</h3><p>Quality workmanship guaranteed on all jobs, big or small.</p>',
        styles: { textAlign: "center", marginTop: "40px", color: "#37474f" }
    },
    {
        id: 'static_rr_4',
        type: 'section',
        page: 'services',
        position: 2,
        content: '<h4>Re-Roofing</h4><ul><li>Long-run Iron Installation</li><li>Decramastic Tile Replacement</li><li>Full Roof Conversions</li></ul>',
        styles: { padding: "20px", margin: "10px auto", maxWidth: "700px", background: "white", borderLeft: "5px solid #f57c00", borderRadius: "2px" }
    },
    {
        id: 'static_rr_5',
        type: 'section',
        page: 'services',
        position: 3,
        content: '<h4>Maintenance & Repairs</h4><ul><li>Leak Detection & Repair</li><li>Moss & Mould Treatment</li><li>Flashings & Penetrations</li></ul>',
        styles: { padding: "20px", margin: "10px auto", maxWidth: "700px", background: "white", borderLeft: "5px solid #f57c00", borderRadius: "2px" }
    },
    {
        id: 'static_rr_6',
        type: 'section',
        page: 'services',
        position: 4,
        content: '<h4>Spouting & Gutters</h4><ul><li>PVC & Colorsteel Spouting</li><li>Downpipe Installation</li><li>Gutter Cleaning Services</li></ul>',
        styles: { padding: "20px", margin: "10px auto", maxWidth: "700px", background: "white", borderLeft: "5px solid #f57c00", borderRadius: "2px" }
    },

    // --- CONTACT PAGE ---
    {
        id: 'static_rr_7',
        type: 'contact',
        page: 'contact',
        position: 1,
        content: '<h3>Get a Free Quote</h3><p>Contact Shane for an assessment.</p><p><b>Email:</b> <a href="mailto:srroofing@outlook.co.nz" style="color:white; text-decoration:underline;">srroofing@outlook.co.nz</a></p><p><b>Location:</b> Tauranga & Bay of Plenty Wide</p>',
        styles: { padding: "30px", maxWidth: "800px", margin: "20px auto", textAlign: "center", background: "#37474f", color: "white", borderRadius: "4px" }
    },
    {
        id: 'static_rr_8',
        type: 'form', 
        page: 'contact',
        position: 2,
        content: '<h3>Send Enquiry</h3><form id="embedded-email-form" style="display: flex; flex-direction: column; gap: 15px;"><input type="text" name="user_name" placeholder="Your Name" required style="padding: 12px; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem;"><input type="email" name="user_email" placeholder="Your Email" required style="padding: 12px; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem;"><textarea name="message" rows="5" placeholder="Address and description of roof issue..." required style="padding: 12px; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; resize: vertical;"></textarea><button type="submit" class="submit-btn" style="background-color: #f57c00; color: white; padding: 15px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 1.1rem; text-transform: uppercase;">Request Quote</button></form>',
        styles: { padding: "30px", maxWidth: "600px", margin: "20px auto", background: "white", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }
    },

    // --- UTILITIES ---
    {
        id: 'static_rr_9',
        type: 'notepad', 
        page: 'home',
        position: 99,
        content: '',
        styles: { padding: "10px", margin: "20px auto", maxWidth: "600px", background: "transparent" }
    }
];