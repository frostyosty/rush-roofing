/// src/js/headerEditor.js
import { state } from './state.js';
import { supabase, saveContent } from './db.js';
import { render } from './renderer.js';

let currentConfig = {
    bgColor: '#263238',
    accentColor: '#f57c00',
    textColor: '#ffffff',
    pattern: 'none',
    
    // Main Text
    mainText: 'RUSH ROOFING',
    mainX: 50, mainY: 45,
    mainFont: "'Oswald', sans-serif", // Default with quotes
    mainSize: 40,

    // Sub Text
    subText: 'Quality Solutions Bay Wide',
    subX: 50, subY: 70,
    subFont: "Arial, sans-serif",
    subSize: 16
};

export function initHeaderEditor() {
    const btn = document.getElementById('btn-edit-header');
    if (btn) btn.onclick = openHeaderEditor;

    // LIST OF IDs TO WATCH
    const inputs = [
        'header-bg-color', 'header-accent-color', 'header-text-color', 'header-pattern',
        'header-main-text', 'header-main-x', 'header-main-y', 'header-main-font', 'header-main-size',
        'header-sub-text', 'header-sub-x', 'header-sub-y', 'header-sub-font', 'header-sub-size'
    ];

    inputs.forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            // Bind BOTH input and change to be safe for all browser types
            el.oninput = updatePreview;
            el.onchange = updatePreview; 
        }
    });

    document.getElementById('btn-save-header').onclick = saveHeaderConfig;
    document.getElementById('close-header-modal').onclick = () => {
        document.getElementById('header-editor-modal').classList.add('hidden');
    };
}

function openHeaderEditor() {
    const existing = state.items.find(i => i.type === 'header_config');
    if (existing && existing.metadata) {
        currentConfig = { ...currentConfig, ...existing.metadata };
    }

    // Populate UI
    // Colors
    document.getElementById('header-bg-color').value = currentConfig.bgColor || '#263238';
    document.getElementById('header-accent-color').value = currentConfig.accentColor || '#f57c00';
    document.getElementById('header-text-color').value = currentConfig.textColor || '#ffffff';
    document.getElementById('header-pattern').value = currentConfig.pattern || 'none';
    
    // Main
    document.getElementById('header-main-text').value = currentConfig.mainText || '';
    document.getElementById('header-main-x').value = currentConfig.mainX ?? 50;
    document.getElementById('header-main-y').value = currentConfig.mainY ?? 45;
    // Set Font (Default to Oswald if missing)
    document.getElementById('header-main-font').value = currentConfig.mainFont || "'Oswald', sans-serif";
    document.getElementById('header-main-size').value = currentConfig.mainSize || 40;

    // Sub
    document.getElementById('header-sub-text').value = currentConfig.subText || '';
    document.getElementById('header-sub-x').value = currentConfig.subX ?? 50;
    document.getElementById('header-sub-y').value = currentConfig.subY ?? 70;
    // Set Font (Default to Arial if missing)
    document.getElementById('header-sub-font').value = currentConfig.subFont || "Arial, sans-serif";
    document.getElementById('header-sub-size').value = currentConfig.subSize || 16;

    updatePreview();
    document.getElementById('header-editor-modal').classList.remove('hidden');
}

function updatePreview() {
    // Globals
    currentConfig.bgColor = document.getElementById('header-bg-color').value;
    currentConfig.accentColor = document.getElementById('header-accent-color').value;
    currentConfig.textColor = document.getElementById('header-text-color').value;
    currentConfig.pattern = document.getElementById('header-pattern').value;
    
    // Main
    currentConfig.mainText = document.getElementById('header-main-text').value;
    currentConfig.mainX = document.getElementById('header-main-x').value;
    currentConfig.mainY = document.getElementById('header-main-y').value;
    currentConfig.mainFont = document.getElementById('header-main-font').value;
    currentConfig.mainSize = parseInt(document.getElementById('header-main-size').value);

    // Sub
    currentConfig.subText = document.getElementById('header-sub-text').value;
    currentConfig.subX = document.getElementById('header-sub-x').value;
    currentConfig.subY = document.getElementById('header-sub-y').value;
    currentConfig.subFont = document.getElementById('header-sub-font').value;
    currentConfig.subSize = parseInt(document.getElementById('header-sub-size').value);

    const svgHTML = generateHeaderSVG(currentConfig);
    document.getElementById('header-preview-container').innerHTML = svgHTML;
}

export function generateHeaderSVG(config) {
    const w = 800;
    const h = 200;
    
    const mx = config.mainX ?? 50;
    const my = config.mainY ?? 45;
    const mFont = config.mainFont || "'Oswald', sans-serif";
    const mSize = config.mainSize || 40;

    const sx = config.subX ?? 50;
    const sy = config.subY ?? 70;
    const sFont = config.subFont || "Arial, sans-serif";
    const sSize = config.subSize || 16;
    
    let defs = '';
    let patternOverlay = '';

    if (config.pattern === 'stripes') {
        defs = `<defs><pattern id="p_stripes" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="20" stroke="${config.accentColor}" stroke-width="10" opacity="0.1" /></pattern></defs>`;
        patternOverlay = `<rect width="100%" height="100%" fill="url(#p_stripes)" />`;
    } 
    else if (config.pattern === 'circle') {
        defs = `<defs><pattern id="p_circles" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="2" fill="${config.accentColor}" opacity="0.2" /></pattern></defs>`;
        patternOverlay = `<rect width="100%" height="100%" fill="url(#p_circles)" />`;
    }

    return `
        <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" 
             style="width:100%; height:auto; display:block; background:${config.bgColor}; min-height:100px;">
            ${defs}
            ${patternOverlay}
            <rect x="0" y="${h - 10}" width="${w}" height="10" fill="${config.accentColor}" />
            
            <text x="${mx}%" y="${my}%" text-anchor="middle" dominant-baseline="middle" 
                  fill="${config.textColor}" font-family="${mFont}" font-weight="900" 
                  font-size="${mSize}">
                ${config.mainText.toUpperCase()}
            </text>
            
            <text x="${sx}%" y="${sy}%" text-anchor="middle" dominant-baseline="middle" 
                  fill="${config.textColor}" font-family="${sFont}" font-weight="400" 
                  font-size="${sSize}" letter-spacing="2">
                ${config.subText.toUpperCase()}
            </text>
        </svg>
    `;
}

async function saveHeaderConfig() {
    let item = state.items.find(i => i.type === 'header_config');
    if (!item) {
        item = { type: 'header_config', page: 'all', position: -99, content: 'Header Config', styles: {}, metadata: currentConfig };
        state.items.push(item);
    } else {
        item.metadata = currentConfig;
    }
    document.dispatchEvent(new Event('app-render-request')); 
    document.getElementById('header-editor-modal').classList.add('hidden');
    
    // Force Render
    const headerEl = document.getElementById('super-header');
    if(headerEl) {
        headerEl.innerHTML = generateHeaderSVG(currentConfig);
        headerEl.style.padding = '0';
        headerEl.style.borderBottom = 'none';
    }
}