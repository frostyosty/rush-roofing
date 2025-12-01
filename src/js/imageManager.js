/// src/js/imageManager.js
import { state } from './state.js';
import { supabase } from './db.js'; 
import { render } from './renderer.js';

// --- 🔓 UPLOAD SWITCH ---
const ENABLE_UPLOADS = true; // Set to false later to lock it down

let currentCarouselIndex = null;
let tempImageList = [];

export function openImageManager(index) {
    currentCarouselIndex = index;
    const item = state.items[index];
    tempImageList = item.metadata && item.metadata.images ? [...item.metadata.images] : [];
    
    const modal = document.getElementById('image-modal');
    if (!modal) return;

    renderImageTable();
    modal.classList.remove('hidden');

    document.getElementById('close-images').onclick = () => modal.classList.add('hidden');
    
    const uploadBtn = document.getElementById('btn-upload-img');
    const fileInput = document.getElementById('img-upload-input');
    
    if (uploadBtn && fileInput) {
        uploadBtn.onclick = () => {
            if (!ENABLE_UPLOADS) {
                alert("Uploads are currently disabled.");
                return;
            }
            fileInput.click();
        };
        fileInput.onchange = handleUpload;
    }
    
    document.getElementById('btn-save-images').onclick = () => {
        if (!state.items[currentCarouselIndex].metadata) state.items[currentCarouselIndex].metadata = {};
        state.items[currentCarouselIndex].metadata.images = tempImageList;
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
        // 👇 UPDATED TEXT
        tbody.innerHTML = '<tr><td colspan="3" style="padding:20px; text-align:center;">Drag and drop to upload images.</td></tr>';
        return;
    }

    tempImageList.forEach((img, idx) => {
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid #eee';
        tr.draggable = true;

        const thumb = `<img src="${img.url}" style="width:60px; height:60px; object-fit:cover; border-radius:4px;">`;
        const catSelect = `
            <select class="cat-select" data-idx="${idx}" style="padding:8px; width:100%;">
                <option value="re-roofs" ${img.category === 're-roofs' ? 'selected' : ''}>Re-Roofs</option>
                <option value="commercial" ${img.category === 'commercial' ? 'selected' : ''}>Commercial</option>
                <option value="maintenance" ${img.category === 'maintenance' ? 'selected' : ''}>Maintenance</option>
                <option value="leaks" ${img.category === 'leaks' ? 'selected' : ''}>Leaks</option>
                <option value="spouting" ${img.category === 'spouting' ? 'selected' : ''}>Spouting</option>
            </select>
        `;
        const delBtn = `<button class="img-del-btn" data-idx="${idx}" style="color:red; background:none; border:none; cursor:pointer;"><i class="fas fa-trash"></i></button>`;

        tr.innerHTML = `<td style="padding:10px;">${thumb}</td><td style="padding:10px;">${catSelect}</td><td style="padding:10px;">${delBtn}</td>`;
        
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

    document.querySelectorAll('.cat-select').forEach(sel => {
        sel.addEventListener('change', e => { tempImageList[e.target.dataset.idx].category = e.target.value; });
    });
    document.querySelectorAll('.img-del-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            const idx = e.target.closest('button').dataset.idx;
            tempImageList.splice(idx, 1);
            renderImageTable();
        });
    });
}

async function handleUpload(e) {
    if (!ENABLE_UPLOADS) return;
    
    const files = e.target.files;
    if (!files.length) return;

    const status = document.getElementById('upload-status');
    status.innerText = "Uploading...";

    for (let file of files) {
        const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
        // Ensure 'rush-assets' is the correct bucket name in Supabase
        const { data, error } = await supabase.storage.from('rush-assets').upload(fileName, file);

        if (!error) {
            // Get Public URL
            const { data: urlData } = supabase.storage.from('rush-assets').getPublicUrl(fileName);
            tempImageList.push({ url: urlData.publicUrl, category: 're-roofs' });
        } else {
            console.error("Upload Error:", error);
            alert("Upload Failed: " + error.message);
        }
    }
    status.innerText = "";
    renderImageTable();
    e.target.value = '';
}