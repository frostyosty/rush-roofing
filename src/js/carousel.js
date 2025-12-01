/// src/js/carousel.js
import { state } from './state.js';

// Fallback Hardcoded
const BASE_URL = 'https://oannlpewujcnmbzzvklu.supabase.co/storage/v1/object/public/rush-assets/';
const FALLBACK_IMAGES = {
    're-roofs': [BASE_URL + 'after1.jpg', BASE_URL + 'before1.jpg'], 
    // You should upload 'before.jpg' and 'after.jpg' to Supabase later
};

export function initCarousel() {
    const container = document.querySelector('.content-block div[style*="text-align: center"]');
    // If we can't find the specific container logic, try finding by ID or marker class
    // For now, let's look for the buttons we know exist
    const btnContainer = document.querySelector('#doorsButton')?.parentElement;
    
    if (!btnContainer) return; // Not on home page

    // 1. DATA SETUP
    const carouselItem = state.items.find(i => i.type === 'carousel');
    let dynamicImageMap = {};
    
    if (carouselItem && carouselItem.metadata && carouselItem.metadata.images && carouselItem.metadata.images.length > 0) {
        carouselItem.metadata.images.forEach(img => {
            if (!dynamicImageMap[img.category]) dynamicImageMap[img.category] = [];
            dynamicImageMap[img.category].push(img.url);
        });
    } else {
        dynamicImageMap = FALLBACK_IMAGES;
    }

    // 2. RENDERER FUNCTION
    const renderBeforeAfter = (category) => {
        // Find the image container (sibling to buttons)
        const displayArea = btnContainer.nextElementSibling;
        if(!displayArea) return;

        const images = dynamicImageMap[category] || [];
        
        if (images.length < 2) {
            // Not enough images for comparison? Show single image or placeholder
            const src = images[0] || '/assets/quick_logo.png';
            displayArea.innerHTML = `<img src="${src}" style="max-width:100%; height:350px; object-fit:cover; border-radius:4px;">`;
            return;
        }

        const afterImg = images[0];  // Background
        const beforeImg = images[1]; // Foreground (Clipped)

        // Build HTML
        displayArea.innerHTML = `
            <div class="ba-slider" id="ba-slider">
                <img src="${afterImg}" class="ba-img ba-after" alt="After">
                <span class="ba-label label-after">After</span>
                
                <div class="ba-img ba-before" id="ba-before" style="width: 50%;">
                    <img src="${beforeImg}" class="ba-img" style="width: 200%;" alt="Before"> <!-- 200% width compensates for 50% container -->
                    <span class="ba-label label-before">Before</span>
                </div>
                
                <div class="ba-handle" id="ba-handle" style="left: 50%;"></div>
            </div>
        `;

        // Add Interaction Logic
        const slider = document.getElementById('ba-slider');
        const beforeDiv = document.getElementById('ba-before');
        const beforeInnerImg = beforeDiv.querySelector('img');
        const handle = document.getElementById('ba-handle');

        const move = (e) => {
            const rect = slider.getBoundingClientRect();
            const x = (e.clientX || e.touches[0].clientX) - rect.left;
            let percent = (x / rect.width) * 100;
            
            // Clamp 0-100
            percent = Math.max(0, Math.min(100, percent));

            beforeDiv.style.width = `${percent}%`;
            handle.style.left = `${percent}%`;
            
            // Counter-scale inner image so it doesn't squish
            // The logic: If container is 50%, img needs to be 100vw relative to parent? 
            // Actually, simplest CSS trick: Set inner image width to fixed pixels equal to container width
            beforeInnerImg.style.width = `${rect.width}px`; 
        };

        // Fix inner image width initially
        beforeInnerImg.style.width = `${slider.getBoundingClientRect().width}px`;
        window.addEventListener('resize', () => {
             beforeInnerImg.style.width = `${slider.getBoundingClientRect().width}px`;
        });

        slider.addEventListener('mousemove', move);
        slider.addEventListener('touchmove', move);
    };

    // 3. BUTTON SETUP
    // Rename buttons dynamically based on Rush Roofing services
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
            // Clone to remove old listeners
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                renderBeforeAfter(mapping[id].cat);
            });
        }
    });

    // Initial Load
    renderBeforeAfter('re-roofs');
}