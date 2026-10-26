// ==========================================
// JOY GALERY - MAIN JAVASCRIPT LOGIC
// ==========================================

// Default Sample QRIS (SVG Data URI placeholder)
const DEFAULT_QRIS = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'><rect width='300' height='300' fill='%23F7F4EF'/><rect x='30' y='30' width='80' height='80' fill='%236A1B29'/><rect x='45' y='45' width='50' height='50' fill='%23F7F4EF'/><rect x='190' y='30' width='80' height='80' fill='%236A1B29'/><rect x='205' y='45' width='50' height='50' fill='%23F7F4EF'/><rect x='30' y='190' width='80' height='80' fill='%236A1B29'/><rect x='45' y='205' width='50' height='50' fill='%23F7F4EF'/><rect x='130' y='30' width='40' height='40' fill='%236A1B29'/><rect x='130' y='90' width='40' height='40' fill='%236A1B29'/><rect x='30' y='130' width='40' height='40' fill='%236A1B29'/><rect x='90' y='130' width='40' height='40' fill='%236A1B29'/><rect x='190' y='130' width='80' height='80' fill='%236A1B29'/><rect x='130' y='190' width='40' height='40' fill='%236A1B29'/><rect x='190' y='190' width='40' height='80' fill='%236A1B29'/><rect x='250' y='190' width='20' height='80' fill='%236A1B29'/><text x='150' y='290' font-family='sans-serif' font-size='12' font-weight='bold' fill='%236A1B29' text-anchor='middle'>JOY GALERY QRIS ONLY</text></svg>";

// Initial Products Data
const defaultProducts = [
    { id: 1, name: "Canva Bundle Aesthetic Feed", category: "Canva", price: 49000, img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80", desc: "50+ Template Canva siap edit untuk Instagram Feed & Story bertema earthy & maroon." },
    { id: 2, name: "Moodboard Luxury Brand Kit", category: "Moodboard", price: 75000, img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80", desc: "Panduan visual brand mewah lengkap dengan color palette, typography, dan elemen grafis." },
    { id: 3, name: "Wording Copywriting Bisnis F&B", category: "Wording", price: 35000, img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80", desc: "100+ Template caption Instagram, WhatsApp broadcast, dan copywriting jualan terbukti konversi." },
    { id: 4, name: "Preset Lightroom Maroon Vintage", category: "Preset", price: 29000, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80", desc: "15 XMP & DNG Lightroom presets bernuansa sinematik maroon dan beige warm tone." },
    { id: 5, name: "Canva Pitch Deck Investor Ready", category: "Canva", price: 99000, img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80", desc: "Presentasi bisnis profesional untuk pitching investor, lengkap dengan struktur finansial." },
    { id: 6, name: "Moodboard Minimalist Interior", category: "Moodboard", price: 65000, img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80", desc: "Inspirasi moodboard tata ruang dan desain interior modern minimalis." },
    { id: 7, name: "E-Book Wording Skincare & Beauty", category: "Wording", price: 45000, img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80", desc: "Kumpulan skrip jualan khusus produk kecantikan dan skincare agar laris manis." },
    { id: 8, name: "Canva E-Certificate Professional", category: "Canva", price: 39000, img: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=600&q=80", desc: "Template sertifikat elegan untuk webinar, workshop, dan penghargaan korporat." }
];

// Load State from LocalStorage
let products = JSON.parse(localStorage.getItem('joy_products')) || defaultProducts;
let cart = JSON.parse(localStorage.getItem('joy_cart')) || [];
let orders = JSON.parse(localStorage.getItem('joy_orders')) || [
    { id: "JG-9821", time: "2026-06-06 14:30", name: "Siti Rahma", contact: "081298765432", items: [{name: "Canva Bundle Aesthetic Feed", price: 49000}], total: 49000, proof: "", status: "Pending" }
];
let currentQris = localStorage.getItem('joy_qris') || DEFAULT_QRIS;
let currentFilter = 'all';

// Initialize App on Load
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartBadge();
    const qrisImg1 = document.getElementById('display-qris-img');
    const qrisImg2 = document.getElementById('admin-preview-qris');
    if(qrisImg1) qrisImg1.src = currentQris;
    if(qrisImg2) qrisImg2.src = currentQris;
});

// Render Products Grid
function renderProducts(filter = 'all', searchQuery = '') {
    const grid = document.getElementById('product-grid');
    if(!grid) return;
    grid.innerHTML = '';

    let filtered = products.filter(p => {
        let matchCat = filter === 'all' || p.category === filter;
        let matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.desc.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="col-span-full text-center py-12 text-zinc-500">Tidak ada produk ditemukan.</div>`;
        return;
    }

    filtered.forEach(p => {
        grid.innerHTML += `
            <div class="bg-white rounded-3xl overflow-hidden border border-beige-warm shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                <div>
                    <div class="relative h-48 overflow-hidden bg-beige">
                        <img src="${p.img}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                        <span class="absolute top-3 left-3 px-3 py-1 rounded-full bg-maroon/90 text-beige text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
                            ${p.category}
                        </span>
                    </div>
                    <div class="p-5">
                        <h3 class="font-serif font-bold text-lg text-maroon mb-2 line-clamp-1">${p.name}</h3>
                        <p class="text-zinc-600 text-xs line-clamp-2 mb-4 leading-relaxed">${p.desc}</p>
                    </div>
                </div>
                <div class="px-5 pb-5 pt-0 flex items-center justify-between border-t border-beige-warm/40 mt-2 pt-4">
                    <div>
                        <span class="text-[10px] uppercase text-zinc-400 block font-semibold">Harga</span>
                        <span class="font-bold text-maroon text-base">Rp ${p.price.toLocaleString('id-ID')}</span>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="addToCart(${p.id})" class="w-10 h-10 rounded-xl bg-beige text-maroon hover:bg-maroon hover:text-white transition-all flex items-center justify-center shadow-sm" title="Tambah ke Keranjang">
                            <i class="fa-solid fa-cart-plus text-sm"></i>
                        </button>
                        <button onclick="buyNow(${p.id})" class="px-4 py-2 rounded-xl bg-maroon text-beige text-xs font-bold hover:bg-maroon-dark transition-all shadow-sm">
                            Beli
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

function filterCategory(cat) {
    currentFilter = cat;
    document.querySelectorAll('.nav-link').forEach(btn => {
        if(btn.dataset.cat === cat) {
            btn.classList.add('text-maroon', 'border-b-2', 'border-maroon', 'pb-1');
            btn.classList.remove('text-zinc-600');
        } else {
            btn.classList.remove('text-maroon', 'border-b-2', 'border-maroon', 'pb-1');
            btn.classList.add('text-zinc-600');
        }
    });
    const searchInput = document.getElementById('search-input');
    const searchVal = searchInput ? searchInput.value : '';
    renderProducts(cat, searchVal);
}

function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const searchVal = searchInput ? searchInput.value : '';
    renderProducts(currentFilter, searchVal);
}

// Cart Management
function addToCart(id) {
    const prod = products.find(p => p.id === id);
    if(!prod) return;
    cart.push(prod);
    localStorage.setItem('joy_cart', JSON.stringify(cart));
    updateCartBadge();
    showNotification(`Berhasil menambahkan "${prod.name}" ke keranjang!`);
}

function buyNow(id) {
    const prod = products.find(p => p.id === id);
    if(!prod) return;
    cart = [prod];
    localStorage.setItem('joy_cart', JSON.stringify(cart));
    updateCartBadge();
    openCartModal();
}

function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if(badge) badge.innerText = cart.length;
}

function openCartModal() {
    const container = document.getElementById('cart-items-container');
    if(!container) return;
    container.innerHTML = '';

    if(cart.length === 0) {
        container.innerHTML = `<p class="text-center text-zinc-500 py-6 text-sm">Keranjang belanja Anda masih kosong.</p>`;
        document.getElementById('cart-total-items').innerText = 0;
        document.getElementById('cart-total-price').innerText = 'Rp 0';
        document.getElementById('cart-modal').classList.remove('hidden');
        document.getElementById('cart-modal').classList.add('flex');
        return;
    }

    let totalPrice = 0;
    cart.forEach((item, index) => {
        totalPrice += item.price;
        container.innerHTML += `
            <div class="py-3 flex items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                    <img src="${item.img}" class="w-12 h-12 rounded-xl object-cover bg-beige">
                    <div>
                        <h5 class="font-serif font-bold text-sm text-maroon line-clamp-1">${item.name}</h5>
                        <span class="text-xs text-zinc-500">Rp ${item.price.toLocaleString('id-ID')}</span>
                    </div>
                </div>
                <button onclick="removeFromCart(${index})" class="text-zinc-400 hover:text-maroon p-1">
                    <i class="fa-solid fa-trash text-sm"></i>
                </button>
            </div>
        `;
    });

    document.getElementById('cart-total-items').innerText = cart.length;
    document.getElementById('cart-total-price').innerText = `Rp ${totalPrice.toLocaleString('id-ID')}`;
    document.getElementById('cart-modal').classList.remove('hidden');
    document.getElementById('cart-modal').classList.add('flex');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('joy_cart', JSON.stringify(cart));
    updateCartBadge();
    openCartModal();
}

function closeCartModal() {
    const modal = document.getElementById('cart-modal');
    if(modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Checkout & QRIS Flow
function proceedToCheckout() {
    const nameInput = document.getElementById('buyer-name');
    const contactInput = document.getElementById('buyer-contact');
    const name = nameInput ? nameInput.value.trim() : '';
    const contact = contactInput ? contactInput.value.trim() : '';

    if(!name || !contact) {
        alert('Mohon isi Nama dan Nomor WhatsApp/Email terlebih dahulu.');
        return;
    }
    if(cart.length === 0) {
        alert('Keranjang belanja kosong.');
        return;
    }

    let totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
    const qrisTotal = document.getElementById('qris-total-amount');
    if(qrisTotal) qrisTotal.innerText = `Total: Rp ${totalPrice.toLocaleString('id-ID')}`;
    
    closeCartModal();
    const qrisModal = document.getElementById('qris-modal');
    if(qrisModal) {
        qrisModal.classList.remove('hidden');
        qrisModal.classList.add('flex');
    }
}

function closeQrisModal() {
    const modal = document.getElementById('qris-modal');
    if(modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function completeOrder() {
    const nameInput = document.getElementById('buyer-name');
    const contactInput = document.getElementById('buyer-contact');
    const name = nameInput ? nameInput.value : '';
    const contact = contactInput ? contactInput.value : '';
    let totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
    const fileInput = document.getElementById('payment-proof');
    
    let proofUrl = "";
    if(fileInput && fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            proofUrl = e.target.result;
            saveOrderRecord(name, contact, totalPrice, proofUrl);
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        saveOrderRecord(name, contact, totalPrice, "");
    }
}

function saveOrderRecord(name, contact, totalPrice, proofUrl) {
    const newOrder = {
        id: "JG-" + Math.floor(1000 + Math.random() * 9000),
        time: new Date().toISOString().replace('T', ' ').substring(0, 16),
        name: name,
        contact: contact,
        items: [...cart],
        total: totalPrice,
        proof: proofUrl,
        status: "Pending Verification"
    };

    orders.unshift(newOrder);
    localStorage.setItem('joy_orders', JSON.stringify(orders));
    
    cart = [];
    localStorage.setItem('joy_cart', JSON.stringify(cart));
    updateCartBadge();

    closeQrisModal();
    const successModal = document.getElementById('success-modal');
    if(successModal) {
        successModal.classList.remove('hidden');
        successModal.classList.add('flex');
    }
}

function closeSuccessModal() {
    const modal = document.getElementById('success-modal');
    if(modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
    location.reload();
}

// Admin Portal Flow
function openAdminLoginModal() {
    const modal = document.getElementById('admin-login-modal');
    if(modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeAdminLoginModal() {
    const modal = document.getElementById('admin-login-modal');
    if(modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function verifyAdminLogin() {
    const passInput = document.getElementById('admin-password');
    const pass = passInput ? passInput.value : '';
    if(pass === 'admin123') {
        closeAdminLoginModal();
        openAdminDashboard();
    } else {
        alert('Password admin salah! (Default: admin123)');
    }
}

function openAdminDashboard() {
    renderAdminProducts();
    renderAdminOrders();
    const modal = document.getElementById('admin-dashboard-modal');
    if(modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeAdminDashboard() {
    const modal = document.getElementById('admin-dashboard-modal');
    if(modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function switchAdminTab(tab) {
    const tabProd = document.getElementById('admin-tab-products');
    const tabOrd = document.getElementById('admin-tab-orders');
    const tabQris = document.getElementById('admin-tab-qris');
    
    if(tabProd) tabProd.classList.add('hidden');
    if(tabOrd) tabOrd.classList.add('hidden');
    if(tabQris) tabQris.classList.add('hidden');

    const btnProd = document.getElementById('btn-tab-products');
    const btnOrd = document.getElementById('btn-tab-orders');
    const btnQris = document.getElementById('btn-tab-qris');

    if(btnProd) btnProd.className = "px-4 py-2 rounded-xl bg-white text-zinc-700 text-xs font-semibold tracking-wide uppercase transition-all shadow-sm border border-beige-warm";
    if(btnOrd) btnOrd.className = "px-4 py-2 rounded-xl bg-white text-zinc-700 text-xs font-semibold tracking-wide uppercase transition-all shadow-sm border border-beige-warm";
    if(btnQris) btnQris.className = "px-4 py-2 rounded-xl bg-white text-zinc-700 text-xs font-semibold tracking-wide uppercase transition-all shadow-sm border border-beige-warm";

    if(tab === 'products') {
        if(tabProd) tabProd.classList.remove('hidden');
        if(btnProd) btnProd.className = "px-4 py-2 rounded-xl bg-maroon text-beige text-xs font-semibold tracking-wide uppercase transition-all shadow-sm";
    } else if(tab === 'orders') {
        if(tabOrd) tabOrd.classList.remove('hidden');
        if(btnOrd) btnOrd.className = "px-4 py-2 rounded-xl bg-maroon text-beige text-xs font-semibold tracking-wide uppercase transition-all shadow-sm";
    } else if(tab === 'qris') {
        if(tabQris) tabQris.classList.remove('hidden');
        if(btnQris) btnQris.className = "px-4 py-2 rounded-xl bg-maroon text-beige text-xs font-semibold tracking-wide uppercase transition-all shadow-sm";
    }
}

// Admin Products Table
function renderAdminProducts() {
    const tbody = document.getElementById('admin-product-table-body');
    if(!tbody) return;
    tbody.innerHTML = '';

    products.forEach(p => {
        tbody.innerHTML += `
            <tr class="hover:bg-beige/40">
                <td class="p-4 flex items-center gap-3">
                    <img src="${p.img}" class="w-10 h-10 rounded-xl object-cover bg-beige">
                    <div>
                        <span class="font-serif font-bold text-maroon block">${p.name}</span>
                        <span class="text-xs text-zinc-400 line-clamp-1">${p.desc}</span>
                    </div>
                </td>
                <td class="p-4"><span class="px-2.5 py-1 rounded-full bg-beige text-maroon text-xs font-semibold">${p.category}</span></td>
                <td class="p-4 font-bold text-maroon">Rp ${p.price.toLocaleString('id-ID')}</td>
                <td class="p-4 text-center space-x-2">
                    <button onclick="openEditProductModal(${p.id})" class="px-3 py-1.5 rounded-lg bg-beige text-maroon hover:bg-maroon hover:text-white transition-all text-xs font-semibold">Edit</button>
                    <button onclick="deleteProduct(${p.id})" class="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all text-xs font-semibold">Hapus</button>
                </td>
            </tr>
        `;
    });
}

function openAddProductModal() {
    document.getElementById('product-modal-title').innerText = "Tambah Produk Baru";
    document.getElementById('edit-product-id').value = "";
    document.getElementById('form-prod-name').value = "";
    document.getElementById('form-prod-cat').value = "Canva";
    document.getElementById('form-prod-price').value = "";
    document.getElementById('form-prod-img').value = "";
    document.getElementById('form-prod-desc').value = "";
    const modal = document.getElementById('product-form-modal');
    if(modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function openEditProductModal(id) {
    const prod = products.find(p => p.id === id);
    if(!prod) return;
    document.getElementById('product-modal-title').innerText = "Edit Produk Digital";
    document.getElementById('edit-product-id').value = prod.id;
    document.getElementById('form-prod-name').value = prod.name;
    document.getElementById('form-prod-cat').value = prod.category;
    document.getElementById('form-prod-price').value = prod.price;
    document.getElementById('form-prod-img').value = prod.img;
    document.getElementById('form-prod-desc').value = prod.desc;
    const modal = document.getElementById('product-form-modal');
    if(modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeProductFormModal() {
    const modal = document.getElementById('product-form-modal');
    if(modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function saveProductData() {
    const id = document.getElementById('edit-product-id').value;
    const name = document.getElementById('form-prod-name').value.trim();
    const category = document.getElementById('form-prod-cat').value;
    const price = parseInt(document.getElementById('form-prod-price').value);
    let img = document.getElementById('form-prod-img').value.trim();
    const desc = document.getElementById('form-prod-desc').value.trim();
    const fileInput = document.getElementById('form-prod-file-img');

    if(!name || isNaN(price)) {
        alert('Nama dan harga produk wajib diisi dengan benar.');
        return;
    }

    if(!img) {
        img = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80";
    }

    if(fileInput && fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            processProductSave(id, name, category, price, e.target.result, desc);
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        processProductSave(id, name, category, price, img, desc);
    }
}

function processProductSave(id, name, category, price, img, desc) {
    if(id) {
        const index = products.findIndex(p => p.id == id);
        if(index !== -1) {
            products[index] = { id: parseInt(id), name, category, price, img, desc };
        }
    } else {
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({ id: newId, name, category, price, img, desc });
    }

    localStorage.setItem('joy_products', JSON.stringify(products));
    closeProductFormModal();
    renderAdminProducts();
    renderProducts(currentFilter);
    alert('Produk berhasil disimpan!');
}

function deleteProduct(id) {
    if(confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('joy_products', JSON.stringify(products));
        renderAdminProducts();
        renderProducts(currentFilter);
    }
}

// Admin Orders Table
function renderAdminOrders() {
    const tbody = document.getElementById('admin-orders-table-body');
    if(!tbody) return;
    tbody.innerHTML = '';

    if(orders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-zinc-500">Belum ada pesanan masuk.</td></tr>`;
        return;
    }

    orders.forEach((o, idx) => {
        let itemsList = o.items.map(i => `${i.name} (Rp ${i.price.toLocaleString('id-ID')})`).join('<br>');
        let proofBtn = o.proof ? `<button onclick="viewProof('${o.proof}')" class="px-3 py-1 bg-maroon/10 text-maroon rounded-lg text-xs font-bold hover:bg-maroon hover:text-white transition-all">Lihat Bukti</button>` : `<span class="text-xs text-zinc-400">Tanpa Bukti</span>`;
        
        tbody.innerHTML += `
            <tr class="hover:bg-beige/40">
                <td class="p-4">
                    <span class="font-bold text-maroon block">${o.id}</span>
                    <span class="text-xs text-zinc-400">${o.time}</span>
                </td>
                <td class="p-4">
                    <span class="font-bold block">${o.name}</span>
                    <span class="text-xs text-zinc-500">${o.contact}</span>
                </td>
                <td class="p-4 text-xs">${itemsList}</td>
                <td class="p-4 font-bold text-maroon">Rp ${o.total.toLocaleString('id-ID')}</td>
                <td class="p-4">${proofBtn}</td>
                <td class="p-4 text-center space-x-2">
                    <button onclick="toggleOrderStatus(${idx})" class="px-3 py-1.5 rounded-lg bg-beige text-maroon hover:bg-maroon hover:text-white transition-all text-xs font-semibold">${o.status}</button>
                    <button onclick="deleteOrder(${idx})" class="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all text-xs font-semibold"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

function viewProof(url) {
    document.getElementById('proof-image-display').src = url;
    const modal = document.getElementById('proof-modal');
    if(modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeProofModal() {
    const modal = document.getElementById('proof-modal');
    if(modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function toggleOrderStatus(idx) {
    orders[idx].status = orders[idx].status === "Pending Verification" ? "Selesai & Link Terkirim" : "Pending Verification";
    localStorage.setItem('joy_orders', JSON.stringify(orders));
    renderAdminOrders();
}

function deleteOrder(idx) {
    if(confirm('Hapus riwayat pesanan ini?')) {
        orders.splice(idx, 1);
        localStorage.setItem('joy_orders', JSON.stringify(orders));
        renderAdminOrders();
    }
}

// QRIS Settings
function saveNewQris() {
    const fileInput = document.getElementById('new-qris-file');
    if(fileInput && fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentQris = e.target.result;
            localStorage.setItem('joy_qris', currentQris);
            const q1 = document.getElementById('display-qris-img');
            const q2 = document.getElementById('admin-preview-qris');
            if(q1) q1.src = currentQris;
            if(q2) q2.src = currentQris;
            alert('QRIS berhasil diperbarui!');
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        alert('Pilih file gambar QRIS terlebih dahulu.');
    }
}

function showNotification(msg) {
    const notif = document.createElement('div');
    notif.className = "fixed bottom-6 right-6 z-50 bg-maroon text-beige px-6 py-3 rounded-2xl shadow-xl font-medium text-sm animate-bounce";
    notif.innerHTML = `<i class="fa-solid fa-circle-check mr-2"></i> ${msg}`;
    document.body.appendChild(notif);
    setTimeout(() => { notif.remove(); }, 3000);
}
