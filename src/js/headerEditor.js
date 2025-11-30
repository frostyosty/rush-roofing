/// src/js/headerEditor.js
import { state } from './state.js';
import { supabase, saveContent } from './db.js';
import { render } from './renderer.js';

let currentConfig = {
    bgColor: '#263238',
    accentColor: '#f57c00',
    textColor: '#ffffff',
    mainText: 'RUSH ROOFING',
    subText: 'Quality Solutions Bay Wide',
    fontSize: 40,
    pattern: 'none' // none, stripes, circle
};

export function initHeaderEditor() {
    // 1. Setup Button Listener in Toolbar
    const btn = document.getElementById('btn-edit-header');
    if (btn) btn.onclick = openHeaderEditor;

    // 2. Setup Modal Listeners
    document.getElementById('header-bg-color').oninput = updatePreview;
    document.getElementById('header-accent-color').oninput = updatePreview;
    document.getElementById('header-text-color').oninput = updatePreview;
    document.getElementById('header-main-text').oninput = updatePreview;
    document.getElementById('header-sub-text').oninput = updatePreview;
    document.getElementById('header-font-size').oninput = updatePreview;
    document.getElementById('header-pattern').onchange = updatePreview;

    document.getElementById('btn-save-header').onclick = saveHeaderConfig;
    document.getElementById('close-header-modal').onclick = () => {
        document.getElementById('header-editor-modal').classList.add('hidden');
    };
}

function openHeaderEditor() {
    // Find existing config or use default
    const existing = state.items.find(i => i.type === 'header_config');
    if (existing && existing.metadata) {
        currentConfig = { ...currentConfig, ...existing.metadata };
    }

    // Populate Inputs
    document.getElementById('header-bg-color').value = currentConfig.bgColor;
    document.getElementById('header-accent-color').value = currentConfig.accentColor;
    document.getElementById('header-text-color').value = currentConfig.textColor;
    document.getElementById('header-main-text').value = currentConfig.mainText;
    document.getElementById('header-sub-text').value = currentConfig.subText;
    document.getElementById('header-font-size').value = currentConfig.fontSize;
    document.getElementById('header-pattern').value = currentConfig.pattern;

    updatePreview();
    document.getElementById('header-editor-modal').classList.remove('hidden');
}

function updatePreview() {
    // Update State object from Inputs
    currentConfig.bgColor = document.getElementById('header-bg-color').value;
    currentConfig.accentColor = document.getElementById('header-accent-color').value;
    currentConfig.textColor = document.getElementById('header-text-color').value;
    currentConfig.mainText = document.getElementById('header-main-text').value;
    currentConfig.subText = document.getElementById('header-sub-text').value;
    currentConfig.fontSize = parseInt(document.getElementById('header-font-size').value);
    currentConfig.pattern = document.getElementById('header-pattern').value;

    // Generate SVG
    const svgHTML = generateHeaderSVG(currentConfig);
    document.getElementById('header-preview-container').innerHTML = svgHTML;
}

export function generateHeaderSVG(config) {
    const w = 800;
    const h = 200;
    
    // Patterns
    let patternDef = '';
    let patternRect = '';
    
    if (config.pattern === 'stripes') {
        patternDef = `
            <defs>
                <pattern id="stripes" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="20" stroke="${config.accentColor}" stroke-width="10" opacity="0.1" />
                </pattern>
            </defs>`;
        patternRect = `<rect width="100%" height="100%" fill="url(#stripes)" />`;
    } else if (config.pattern === 'circle') {
        patternRect = `<circle cx="10%" cy="50%" r="80" fill="${config.accentColor}" opacity="0.2" />`;
    }

    return `
        <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" style="width:100%; height:100%; background:${config.bgColor};">
            ${patternDef}
            ${patternRect}
            
            <!-- Bottom Border -->
            <rect x="0" y="${h - 10}" width="${w}" height="10" fill="${config.accentColor}" />

            <!-- Text -->
            <text x="50%" y="45%" text-anchor="middle" dominant-baseline="middle" 
                  fill="${config.textColor}" font-family="Arial, sans-serif" font-weight="900" 
                  font-size="${config.fontSize}">
                ${config.mainText.toUpperCase()}
            </text>
            
            <text x="50%" y="70%" text-anchor="middle" dominant-baseline="middle" 
                  fill="${config.textColor}" font-family="Arial, sans-serif" font-weight="400" 
                  font-size="${config.fontSize * 0.4}" opacity="0.8" letter-spacing="2">
                ${config.subText.toUpperCase()}
            </text>
        </svg>
    `;
}

async function saveHeaderConfig() {
    // Check if config row exists
    let item = state.items.find(i => i.type === 'header_config');
    
    if (!item) {
        // Create new
        item = {
            type: 'header_config',
            page: 'all', // special page
            position: -99, // Doesn't matter, not rendered in list
            content: 'Header Configuration',
            styles: {},
            metadata: currentConfig
        };
        state.items.push(item);
    } else {
        // Update existing
        item.metadata = currentConfig;
    }

    // Save
    document.dispatchEvent(new Event('app-render-request')); // Trigger auto-save
    document.getElementById('header-editor-modal').classList.add('hidden');
    
    // Force re-render of header immediately
    const headerEl = document.getElementById('super-header');
    headerEl.innerHTML = generateHeaderSVG(currentConfig);
}