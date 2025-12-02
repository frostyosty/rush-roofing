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
    mainFont: "'Oswald', sans-serif",
    mainSize: 40,

    // Sub Text
    subText: 'Quality Solutions Bay Wide',
    subX: 50, subY: 70,
    subFont: "Arial, sans-serif",
    subSize: 16
};

// HELPER: Safely set value only if element exists
function setVal(id, value) {
    const el = document.getElementById(id);
    if (el) {
        el.value = value;
    } else {
        console.warn(`Header Editor: Missing input #${id} in HTML`);
    }
}

// HELPER: Safely get value, or return default
function getVal(id, fallback) {
    const el = document.getElementById(id);
    if (el) return el.value;
    return fallback;
}

export function initHeaderEditor() {
    const btn = document.getElementById('btn-edit-header');
    if (btn) btn.onclick = openHeaderEditor;

    const inputs = [
        'header-bg-color', 'header-accent-color', 'header-text-color', 'header-pattern',
        'header-main-text', 'header-main-x', 'header-main-y', 'header-main-font', 'header-main-size',
        'header-sub-text', 'header-sub-x', 'header-sub-y', 'header-sub-font', 'header-sub-size'
    ];

    inputs.forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            el.oninput = updatePreview;
            el.onchange = updatePreview; 
        }
    });

    document.getElementById('btn-save-header').onclick = saveHeaderConfig;
    const closeBtn = document.getElementById('close-header-modal');
    if(closeBtn) closeBtn.onclick = () => {
        document.getElementById('header-editor-modal').classList.add('hidden');
    };
}

function openHeaderEditor() {
    const existing = state.items.find(i => i.type === 'header_config');
    if (existing && existing.metadata) {
        currentConfig = { ...currentConfig, ...existing.metadata };
    }

    // Populate UI (Safely)
    setVal('header-bg-color', currentConfig.bgColor || '#263238');
    setVal('header-accent-color', currentConfig.accentColor || '#f57c00');
    setVal('header-text-color', currentConfig.textColor || '#ffffff');
    setVal('header-pattern', currentConfig.pattern || 'none');
    
    // Main
    setVal('header-main-text', currentConfig.mainText || '');
    setVal('header-main-x', currentConfig.mainX ?? 50);
    setVal('header-main-y', currentConfig.mainY ?? 45);
    setVal('header-main-font', currentConfig.mainFont || "'Oswald', sans-serif");
    setVal('header-main-size', currentConfig.mainSize || 40);

    // Sub
    setVal('header-sub-text', currentConfig.subText || '');
    setVal('header-sub-x', currentConfig.subX ?? 50);
    setVal('header-sub-y', currentConfig.subY ?? 70);
    setVal('header-sub-font', currentConfig.subFont || "Arial, sans-serif");
    setVal('header-sub-size', currentConfig.subSize || 16);

    updatePreview();
    document.getElementById('header-editor-modal').classList.remove('hidden');
}

function updatePreview() {
    // Globals
    currentConfig.bgColor = getVal('header-bg-color', '#263238');
    currentConfig.accentColor = getVal('header-accent-color', '#f57c00');
    currentConfig.textColor = getVal('header-text-color', '#ffffff');
    currentConfig.pattern = getVal('header-pattern', 'none');
    
    // Main
    currentConfig.mainText = getVal('header-main-text', '');
    currentConfig.mainX = getVal('header-main-x', 50);
    currentConfig.mainY = getVal('header-main-y', 45);
    currentConfig.mainFont = getVal('header-main-font', "'Oswald', sans-serif");
    currentConfig.mainSize = parseInt(getVal('header-main-size', 40));

    // Sub
    currentConfig.subText = getVal('header-sub-text', '');
    currentConfig.subX = getVal('header-sub-x', 50);
    currentConfig.subY = getVal('header-sub-y', 70);
    currentConfig.subFont = getVal('header-sub-font', "Arial, sans-serif");
    currentConfig.subSize = parseInt(getVal('header-sub-size', 16));

    const svgHTML = generateHeaderSVG(currentConfig);
    const container = document.getElementById('header-preview-container');
    if (container) container.innerHTML = svgHTML;
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
                  fill="${config.textColor}" font-family="${mFont}" font-weight="bold" 
                  font-size="${mSize}">
                ${config.mainText.toUpperCase()}
            </text>
            
            <text x="${sx}%" y="${sy}%" text-anchor="middle" dominant-baseline="middle" 
                  fill="${config.textColor}" font-family="${sFont}" font-weight="normal" 
                  font-size="${sSize}" letter-spacing="1">
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
    
    const headerEl = document.getElementById('super-header');
    if(headerEl) {
        headerEl.innerHTML = generateHeaderSVG(currentConfig);
        headerEl.style.padding = '0';
        headerEl.style.borderBottom = 'none';
    }
}