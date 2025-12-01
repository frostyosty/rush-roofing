/// src/js/imageManager.js
import { state } from './state.js';
import { supabase } from './db.js'; 
import { render } from './renderer.js';

// --- 🔓 UPLOAD SWITCH ---
const ENABLE_UPLOADS = true; 

let currentGalleryIndex = null;
let tempImageList = [];

export function openImageManager(index) {
    currentGalleryIndex = index;
    const item = state.items[index];
    
    // Load images
    tempImageList = item.metadata && item.metadata.images ? [...item.metadata.images] : [];
    
    const modal = document.getElementById('image-modal');
    if (!modal) return;

    renderImageTable();
    modal.classList.remove('hidden');

    document.getElementById('close-images').onclick = () => modal.classList.add('hidden');
    
    // --- DRAG & DROP UPLOAD ZONE (Entire Modal) ---
    const dropZone = modal.querySelector('.modal-content');
    
    // Prevent default browser behavior (opening image in tab)
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Highlight visual
    dropZone.addEventListener('dragover', () => dropZone.style.border = '3px dashed #f57c00');
    dropZone.addEventListener('dragleave', () => dropZone.style.border = 'none');
    
    // Handle Drop
    dropZone.addEventListener('drop', (e) => {
        dropZone.style.border = 'none';
        const dt = e.dataTransfer;
        const files = dt.files;
        handleUploadFiles(files);
    });

    // Manual Button
    const uploadBtn = document.getElementById('btn-upload-img');
    const fileInput = document.getElementById('img-upload-input');
    if (uploadBtn && fileInput) {
        uploadBtn.onclick = () => {
            if (!ENABLE_UPLOADS) { alert("Uploads disabled."); return; }
            fileInput.click();
        };
        fileInput.onchange = (e) => handleUploadFiles(e.target.files);
    }
    
    // Save
    document.getElementById('btn-save-images').onclick = () => {
        if (!state.items[currentGalleryIndex].metadata) state.items[currentGalleryIndex].metadata = {};
        state.items[currentGalleryIndex].metadata.images = tempImageList;
        render();
        document.dispatchEvent(new Event('app-render-request'));
        modal.classList.add('hidden');
    };
}

function renderImageTable() {
    const tbody = document.getElementById('images-list');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (tempImageList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="padding:20px; text-align:center;">Drag and drop images here to upload.</td></tr>';
        return;
    }

    tempImageList.forEach((img, idx) => {
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid #eee';
        tr.draggable = true;

        const thumb = `<img src="${img.url}" style="width:60px; height:60px; object-fit:cover; border-radius:4px;">`;
        
        // CATEGORY SELECT
        const catSelect = `
            <select class="cat-select" data-idx="${idx}" style="padding:8px; width:100%;">
                <option value="re-roofs" ${img.category === 're-roofs' ? 'selected' : ''}>Re-Roofs</option>
                <option value="commercial" ${img.category === 'commercial' ? 'selected' : ''}>Commercial</option>
                <option value="maintenance" ${img.category === 'maintenance' ? 'selected' : ''}>Maintenance</option>
                <option value="leaks" ${img.category === 'leaks' ? 'selected' : ''}>Leaks</option>
                <option value="spouting" ${img.category === 'spouting' ? 'selected' : ''}>Spouting</option>
            </select>
        `;

        // ROLE SELECT (Before/After)
        const roleSelect = `
            <select class="role-select" data-idx="${idx}" style="padding:8px; width:100%;">
                <option value="after" ${img.role === 'after' || !img.role ? 'selected' : ''}>After (Main)</option>
                <option value="before" ${img.role === 'before' ? 'selected' : ''}>Before (Overlay)</option>
            </select>
        `;

        const delBtn = `<button class="img-del-btn" data-idx="${idx}" style="color:red; background:none; border:none; cursor:pointer;"><i class="fas fa-trash"></i></button>`;

        tr.innerHTML = `<td style="padding:10px;">${thumb}</td><td style="padding:10px;">${catSelect}</td><td style="padding:10px;">${roleSelect}</td><td style="padding:10px;">${delBtn}</td>`;
        
        // Reordering Logic
        tr.addEventListener('dragstart', e => { e.dataTransfer.setData('text/plain', idx); });
        tr.addEventListener('dragover', e => { e.preventDefault(); });
        tr.addEventListener('drop', e => {
            e.preventDefault();
            const fromIdx = parseInt(e.dataTransfer.getData('text/plain'));
            const item = tempImageList.splice(fromIdx, 1)[0];
            tempImageList.splice(idx, 0, item);
            renderImageTable();
        });

        tbody.appendChild(tr);
    });

    // Listeners
    document.querySelectorAll('.cat-select').forEach(sel => {
        sel.addEventListener('change', e => { tempImageList[e.target.dataset.idx].category = e.target.value; });
    });
    document.querySelectorAll('.role-select').forEach(sel => {
        sel.addEventListener('change', e => { tempImageList[e.target.dataset.idx].role = e.target.value; });
    });
    document.querySelectorAll('.img-del-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            const idx = e.target.closest('button').dataset.idx;
            tempImageList.splice(idx, 1);
            renderImageTable();
        });
    });
}

async function handleUploadFiles(files) {
    if (!ENABLE_UPLOADS) return;
    if (!files.length) return;

    const status = document.getElementById('upload-status');
    status.innerText = "Uploading...";

    for (let file of files) {
        const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
        const { data, error } = await supabase.storage.from('rush-assets').upload(fileName, file);

        if (!error) {
            const { data: urlData } = supabase.storage.from('rush-assets').getPublicUrl(fileName);
            tempImageList.push({ 
                url: urlData.publicUrl, 
                category: 're-roofs',
                role: 'after' // Default to 'After'
            });
        } else {
            console.error(error);
            alert("Upload Failed: " + error.message);
        }
    }
    status.innerText = "";
    renderImageTable();
}