/// src/js/gallery.js
import { state } from './state.js';

// Fallback Hardcoded
const BASE_URL = 'https://oannlpewujcnmbzzvklu.supabase.co/storage/v1/object/public/rush-assets/';
const FALLBACK_IMAGES = {
    're-roofs': [
        { url: BASE_URL + 'after1.jpg', role: 'after' },
        { url: BASE_URL + 'before1.jpg', role: 'before' }
    ]
};

export function initGallery() {
    const btnContainer = document.querySelector('.filter-btn')?.parentElement;
    if (!btnContainer) return; 

    // 1. DATA SETUP (Look for type 'gallery')
    const galleryItem = state.items.find(i => i.type === 'gallery');
    let dynamicImageMap = {};
    
    if (galleryItem && galleryItem.metadata && galleryItem.metadata.images && galleryItem.metadata.images.length > 0) {
        galleryItem.metadata.images.forEach(img => {
            if (!dynamicImageMap[img.category]) dynamicImageMap[img.category] = [];
            // Ensure role exists
            if (!img.role) img.role = 'after';
            dynamicImageMap[img.category].push(img);
        });
    } else {
        dynamicImageMap = FALLBACK_IMAGES;
    }

    // 2. RENDERER
    const renderBeforeAfter = (category) => {
        const displayArea = btnContainer.nextElementSibling;
        if(!displayArea) return;

        const images = dynamicImageMap[category] || [];
        
        // Find the pair based on Role
        const afterObj = images.find(i => i.role === 'after');
        const beforeObj = images.find(i => i.role === 'before');

        // Fallback: If no pair, just show whatever we have
        const afterImg = afterObj ? afterObj.url : (images[0] ? images[0].url : '/assets/quick_logo.png');
        const beforeImg = beforeObj ? beforeObj.url : null;

        if (!beforeImg) {
            // Standard Single Image View
            displayArea.innerHTML = `<img src="${afterImg}" style="max-width:100%; height:350px; object-fit:cover; border-radius:4px;">`;
            return;
        }

        // Before/After View
        displayArea.innerHTML = `
            <div class="ba-slider" id="ba-slider">
                <img src="${afterImg}" class="ba-img ba-after" alt="After">
                <span class="ba-label label-after">After</span>
                
                <div class="ba-img ba-before" id="ba-before" style="width: 50%;">
                    <img src="${beforeImg}" class="ba-img" style="width: 200%;" alt="Before">
                    <span class="ba-label label-before">Before</span>
                </div>
                
                <div class="ba-handle" id="ba-handle" style="left: 50%;"></div>
            </div>
        `;

        // Logic
        const slider = document.getElementById('ba-slider');
        const beforeDiv = document.getElementById('ba-before');
        const beforeInnerImg = beforeDiv.querySelector('img');
        const handle = document.getElementById('ba-handle');

        const move = (e) => {
            const rect = slider.getBoundingClientRect();
            const x = (e.clientX || e.touches[0].clientX) - rect.left;
            let percent = (x / rect.width) * 100;
            percent = Math.max(0, Math.min(100, percent));

            beforeDiv.style.width = `${percent}%`;
            handle.style.left = `${percent}%`;
            beforeInnerImg.style.width = `${rect.width}px`; 
        };

        beforeInnerImg.style.width = `${slider.getBoundingClientRect().width}px`;
        window.addEventListener('resize', () => beforeInnerImg.style.width = `${slider.getBoundingClientRect().width}px`);

        slider.addEventListener('mousemove', move);
        slider.addEventListener('touchmove', move);
    };

    // 3. BUTTONS
    const mapping = {
        'doorsButton': { cat: 're-roofs', text: 'Re-Roofs' },
        'windowsButton': { cat: 'commercial', text: 'Commercial' },
        'handlesButton': { cat: 'maintenance', text: 'Maintenance' },
        'electricalButton': { cat: 'leaks', text: 'Leaks' },
        'tilesButton': { cat: 'spouting', text: 'Spouting' }
    };

    Object.keys(mapping).forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.innerText = mapping[id].text;
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                renderBeforeAfter(mapping[id].cat);
            });
        }
    });

    renderBeforeAfter('re-roofs');
}