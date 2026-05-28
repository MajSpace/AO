// ============================================
// TRANSLATION SYSTEM
// ============================================
let translations = { en: {}, id: {} };
let currentLanguage = localStorage.getItem('language') || 'en';

async function loadTranslations() {
    try {
        const [enR, idR] = await Promise.all([fetch('locales/en.json'), fetch('locales/id.json')]);
        translations.en = await enR.json();
        translations.id = await idR.json();
        updatePageLanguage();
    } catch (e) {
        console.error('Translation load error:', e);
    }
}

function t(key, def = '') {
    let v = translations[currentLanguage];
    for (const k of key.split('.')) {
        if (v && typeof v === 'object' && k in v) v = v[k];
        else return def;
    }
    return v || def;
}

function updatePageLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const text = t(el.getAttribute('data-i18n'));
        if (text && typeof text === 'string') el.textContent = text;
    });
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLanguage);
    });
    renderBiomes();
    renderTiers();
    renderT8Maps();
    renderProTips();
    renderGatheringBuilds();
    renderEventSchedule();
    renderGatheringProgression();
    renderBeginnerGuide();
}

// ============================================
// BIOME DATA
// ============================================
function getBiomeData() {
    return [
        { name: t('biome_names.swamp'), city: 'Thetford', primaryResource: 'Fiber (Hemp)', secondaryResource: 'Wood (Log)', tertiaryResource: 'Hide', image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663244214689/CP2xbP6jZ7YquxKLmra3zY/biome-forest-GU38UQaqucTXFdpCjtksAA.webp', description: t('biome_descriptions.swamp'), color: '#7c3aed' },
        { name: t('biome_names.forest'), city: 'Lymhurst', primaryResource: 'Wood (Log)', secondaryResource: 'Hide', tertiaryResource: 'Stone', image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663244214689/CP2xbP6jZ7YquxKLmra3zY/biome-forest-GU38UQaqucTXFdpCjtksAA.webp', description: t('biome_descriptions.forest'), color: '#22c55e' },
        { name: t('biome_names.mountain'), city: 'Fort Sterling', primaryResource: 'Ore (Iron)', secondaryResource: 'Stone', tertiaryResource: 'Fiber', image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663244214689/CP2xbP6jZ7YquxKLmra3zY/biome-mountain-njbLb46H7FGuykLTKS9wMS.webp', description: t('biome_descriptions.mountain'), color: '#94a3b8' },
        { name: t('biome_names.highland'), city: 'Martlock', primaryResource: 'Stone', secondaryResource: 'Ore (Iron)', tertiaryResource: 'Wood', image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663244214689/CP2xbP6jZ7YquxKLmra3zY/biome-mountain-njbLb46H7FGuykLTKS9wMS.webp', description: t('biome_descriptions.highland'), color: '#d4af37' },
        { name: t('biome_names.steppe'), city: 'Bridgewatch', primaryResource: 'Hide', secondaryResource: 'Fiber', tertiaryResource: 'Ore', image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663244214689/CP2xbP6jZ7YquxKLmra3zY/biome-steppe-Hzd9bGzAkigiRx6SatXPpd.webp', description: t('biome_descriptions.steppe'), color: '#f59e0b' },
    ];
}

function renderBiomes() {
    const grid = document.getElementById('biomesGrid');
    grid.innerHTML = '';
    getBiomeData().forEach(biome => {
        const card = document.createElement('div');
        card.className = 'biome-card';
        card.style.borderTopColor = biome.color;
        card.innerHTML = `
            <div class="biome-image">
                <img src="${biome.image}" alt="${biome.name}" loading="lazy">
                <div class="biome-image-overlay">
                    <h3 class="biome-name">${biome.name}</h3>
                    <p class="biome-city">📍 ${biome.city}</p>
                </div>
            </div>
            <div class="biome-content">
                <p class="biome-description">${biome.description}</p>
                <div class="resource-group"><p class="resource-label">${t('biomes.primaryResource')}</p><span class="badge badge-primary">${biome.primaryResource}</span></div>
                <div class="resource-group"><p class="resource-label">${t('biomes.secondaryResource')}</p><span class="badge badge-outline">${biome.secondaryResource}</span></div>
                <div class="resource-group"><p class="resource-label">${t('biomes.tertiaryResource')}</p><span class="badge badge-outline">${biome.tertiaryResource}</span></div>
            </div>`;
        grid.appendChild(card);
    });
}

// ============================================
// TIER DATA — T1, T2, T3, T4, T5, T6, T7, T8
// ============================================
function getTierData() {
    return [
        { tier: 1, location: 'Beginner Zone (Royal Continent)', zoneType: 'Blue Zone', resources: ['Fiber', 'Hide', 'Ore', 'Wood', 'Stone'], tips: ['Fokus leveling gathering tools secepat mungkin', 'Gunakan Learning Points untuk percepat progression', 'Jangan lama di sini — naik ke T2-T3 segera'], danger: 'safe' },
        { tier: 2, location: 'Starter Towns (Royal Continent)', zoneType: 'Blue Zone', resources: ['Fiber', 'Hide', 'Ore', 'Wood', 'Stone'], tips: ['Mulai beli atau craft Novice Gathering Gear', 'Jual resource di local market', 'Belajar jalur gathering yang efisien'], danger: 'safe' },
        { tier: 3, location: 'Royal Continent - Blue Zones', zoneType: 'Blue Zone', resources: ['Rough Stone', 'Birch Log', 'Cotton', 'Rough Ore', 'Young Hide'], tips: ['Gunakan Journeyman Gathering Set', 'Fokus pada satu jenis resource untuk XP lebih cepat', 'Mulai kumpulkan silver untuk gear T4'], danger: 'safe' },
        { tier: 4, location: 'Royal Continent - Yellow & Red Zones', zoneType: 'Yellow/Red Zone', resources: ['Limestone', 'Chestnut Log', 'Hemp', 'Tin Ore', 'Mature Hide'], tips: ['Red zone = lebih banyak resource, lebih berbahaya', 'Selalu bawa Pork Pie untuk capacity tambahan', 'Pertimbangkan gathering gear untuk bonus yield'], danger: 'moderate' },
        { tier: 5, location: 'Royal Continent - Red Zones / Roads of Avalon', zoneType: 'Red Zone / Roads', resources: ['Sandstone', 'Bloodoak Log', 'Skyflower', 'Iron Ore', 'Thick Hide'], tips: ['Roads of Avalon aman untuk solo tapi hati-hati mob', 'Mulai upgrade ke T5 gathering gear', 'Pertimbangkan join guild untuk protection'], danger: 'moderate' },
        { tier: 6, location: 'Outlands - Black Zone', zoneType: 'Black Zone', resources: ['Granite', 'Cedar Log', 'Gadget Yarn', 'Steel Ore', 'Rugged Hide'], tips: ['Gunakan Invisibility Shrines untuk perjalanan aman', 'Farm di luar peak hours untuk elak gankers', 'Selalu ada escape route'], danger: 'dangerous' },
        { tier: 7, location: 'Outlands - Deep Black Zone', zoneType: 'Black Zone', resources: ['Slate', 'Ashwood Log', 'Silk', 'Mythril Ore', 'Robust Hide'], tips: ['Gold Mists bagus untuk solo players', 'Roads of Avalon bagus untuk group farming', 'Competition tinggi — timing adalah kunci'], danger: 'dangerous' },
        { tier: 8, location: 'Outlands - Deepest Black Zone', zoneType: 'Black Zone', resources: ['Basalt', 'Fir Log', 'Dragonweave', 'Adamantium Ore', 'Fortified Hide'], tips: ['Watchtower territories adalah sumber T8 terbaik', 'Farm dengan guild support atau di hidden spots', 'Expect extreme competition — gunakan premium gear', 'Selalu bawa escape mount terbaik'], danger: 'dangerous' },
    ];
}

function renderTiers() {
    const container = document.getElementById('tiersContainer');
    container.innerHTML = '';
    // T8 always last (sorted: T1-T7, then T8)
    const tiers = getTierData();
    const sorted = [...tiers.filter(t => t.tier < 8), ...tiers.filter(t => t.tier === 8)];
    sorted.forEach(tier => {
        const card = document.createElement('div');
        card.className = 'tier-card';
        const tipsHTML = Array.isArray(tier.tips) ? tier.tips.map(tip => `<li>${tip}</li>`).join('') : '';
        const dangerLabel = tier.danger.charAt(0).toUpperCase() + tier.danger.slice(1);
        card.innerHTML = `
            <div class="tier-header">
                <div>
                    <h3 class="tier-title">Tier ${tier.tier}</h3>
                    <p class="tier-location">${tier.location}</p>
                </div>
                <div class="tier-badges">
                    <span class="badge badge-outline">${tier.zoneType}</span>
                    <span class="badge badge-${tier.danger}">${dangerLabel}</span>
                </div>
            </div>
            <div class="tier-body">
                <div class="tier-section">
                    <h4 class="tier-section-title">Available Resources</h4>
                    <div class="resources-badges">${tier.resources.map(r => `<span class="badge badge-outline">${r}</span>`).join('')}</div>
                </div>
                <div class="tier-section">
                    <h4 class="tier-section-title">Pro Tips</h4>
                    <ul class="tips-list">${tipsHTML}</ul>
                </div>
            </div>`;
        container.appendChild(card);
    });
}

// ============================================
// GATHERING PROGRESSION BY PROFESSION
// ============================================
const gatheringProfessions = [
    {
        id: 'gatherer',
        icon: '🌿',
        name: 'Gatherer (Umum)',
        desc: 'Kumpul semua jenis resource',
        tiers: [
            { tier: 1, label: 'T1 — Pemula', equipment: [{ slot: 'Head', item: 'Padded Cap' }, { slot: 'Chest', item: 'Padded Tunic' }, { slot: 'Feet', item: 'Padded Shoes' }, { slot: 'Tool', item: 'Beginners Axe / Pick / Etc' }, { slot: 'Bag', item: 'Bag T1' }], tip: 'Gear standar pemula. Kumpul resource apa saja untuk XP.' },
            { tier: 2, label: 'T2 — Novice', equipment: [{ slot: 'Head', item: 'Novice Gatherer Cap' }, { slot: 'Chest', item: 'Novice Gatherer Jacket' }, { slot: 'Feet', item: 'Novice Gatherer Shoes' }, { slot: 'Tool', item: 'Novice Tool (sesuai profesi)' }, { slot: 'Bag', item: 'Bag T2' }], tip: 'Mulai pakai Gatherer set untuk bonus yield.' },
            { tier: 3, label: 'T3 — Journeyman', equipment: [{ slot: 'Head', item: 'Journeyman Gatherer Cap' }, { slot: 'Chest', item: 'Journeyman Gatherer Jacket' }, { slot: 'Feet', item: 'Journeyman Gatherer Shoes' }, { slot: 'Tool', item: 'Journeyman Tool T3' }, { slot: 'Bag', item: 'Bag T3' }], tip: 'Zona Blue, farm lebih efisien. Kumpul untuk upgrade.' },
            { tier: 4, label: 'T4 — Adept', equipment: [{ slot: 'Head', item: 'Adept Gatherer Cap' }, { slot: 'Chest', item: 'Adept Gatherer Jacket' }, { slot: 'Feet', item: 'Adept Gatherer Shoes' }, { slot: 'Tool', item: 'Adept Gathering Tool T4' }, { slot: 'Bag', item: 'Satchel of Insight T4' }], tip: 'Yellow/Red zone. Pork Pie untuk carry capacity lebih besar.' },
            { tier: 5, label: 'T5 — Expert', equipment: [{ slot: 'Head', item: 'Expert Gatherer Cap' }, { slot: 'Chest', item: 'Expert Gatherer Jacket' }, { slot: 'Feet', item: 'Expert Gatherer Shoes' }, { slot: 'Tool', item: 'Expert Gathering Tool T5' }, { slot: 'Bag', item: 'Satchel of Insight T5' }, { slot: 'Mount', item: 'Swiftclaw / Armored Horse' }], tip: 'Roads of Avalon. Mulai serius dengan satu jenis resource.' },
            { tier: 6, label: 'T6 — Master', equipment: [{ slot: 'Head', item: 'Master Gatherer Cap' }, { slot: 'Chest', item: 'Master Gatherer Jacket' }, { slot: 'Feet', item: 'Master Gatherer Shoes' }, { slot: 'Tool', item: 'Master Gathering Tool T6' }, { slot: 'Bag', item: 'Satchel of Insight T6' }, { slot: 'Mount', item: 'Swiftclaw / Armored Beetle' }], tip: 'Black Zone. Gunakan Invisibility Shrine, farm off-peak.' },
            { tier: 7, label: 'T7 — Grandmaster', equipment: [{ slot: 'Head', item: 'Grandmaster Gatherer Cap' }, { slot: 'Chest', item: 'Grandmaster Gatherer Jacket' }, { slot: 'Feet', item: 'Grandmaster Gatherer Shoes' }, { slot: 'Tool', item: 'Grandmaster Gathering Tool T7' }, { slot: 'Bag', item: 'Satchel of Insight T7' }, { slot: 'Mount', item: 'Swiftclaw / Direwolf' }], tip: 'Deep Black Zone. Bawa gear escape. Gold Mists untuk solo.' },
            { tier: 8, label: 'T8 — Elder', equipment: [{ slot: 'Head', item: 'Elder Gatherer Cap' }, { slot: 'Chest', item: 'Elder Gatherer Jacket' }, { slot: 'Feet', item: 'Elder Gatherer Shoes' }, { slot: 'Tool', item: 'Elder Gathering Tool T8' }, { slot: 'Bag', item: 'Satchel of Insight T8' }, { slot: 'Mount', item: 'Direwolf / Spectral Wolf' }, { slot: 'Potion', item: 'Pork Pie + Gathering Tonic' }], tip: 'Tier tertinggi. Farm dengan guild atau di hidden spots. Expected danger extreme.' },
        ]
    },
    {
        id: 'miner',
        icon: '⛏',
        name: 'Miner',
        desc: 'Fokus pada Ore & batu',
        tiers: [
            { tier: 1, label: 'T1', equipment: [{ slot: 'Tool', item: 'Beginners Pickaxe' }, { slot: 'Chest', item: 'Padded Tunic' }], tip: 'Mine Rough Ore di Starter Towns.' },
            { tier: 2, label: 'T2', equipment: [{ slot: 'Tool', item: 'Novice Pickaxe' }, { slot: 'Chest', item: 'Novice Gatherer Jacket' }, { slot: 'Head', item: 'Novice Gatherer Cap' }], tip: 'Cari Tin Ore di Blue Zones.' },
            { tier: 3, label: 'T3', equipment: [{ slot: 'Tool', item: 'Journeyman Pickaxe' }, { slot: 'Full Set', item: 'Journeyman Gatherer Set' }, { slot: 'Bag', item: 'Bag T3' }], tip: 'Mine Limestone & Tin Ore untuk silver.' },
            { tier: 4, label: 'T4', equipment: [{ slot: 'Tool', item: 'Adept Pickaxe' }, { slot: 'Full Set', item: 'Adept Gatherer Set' }, { slot: 'Bag', item: 'Satchel T4' }, { slot: 'Food', item: 'Pork Pie' }], tip: 'Masuk Yellow/Red Zone untuk Iron Ore T4.' },
            { tier: 5, label: 'T5', equipment: [{ slot: 'Tool', item: 'Expert Pickaxe' }, { slot: 'Full Set', item: 'Expert Gatherer Set' }, { slot: 'Bag', item: 'Satchel T5' }, { slot: 'Mount', item: 'Swiftclaw' }], tip: 'Roads of Avalon: mine Steel Ore T5 dengan aman.' },
            { tier: 6, label: 'T6', equipment: [{ slot: 'Tool', item: 'Master Pickaxe' }, { slot: 'Full Set', item: 'Master Gatherer Set' }, { slot: 'Bag', item: 'Satchel T6' }, { slot: 'Mount', item: 'Swiftclaw / Armored Bear' }], tip: 'Black Zone untuk Mythril Ore T6. Hati-hati ganker.' },
            { tier: 7, label: 'T7', equipment: [{ slot: 'Tool', item: 'Grandmaster Pickaxe' }, { slot: 'Full Set', item: 'Grandmaster Gatherer Set' }, { slot: 'Bag', item: 'Satchel T7' }, { slot: 'Mount', item: 'Direwolf' }], tip: 'Shaleheath Hills / Birken Fell untuk Mythril T7.' },
            { tier: 8, label: 'T8', equipment: [{ slot: 'Tool', item: 'Elder Pickaxe' }, { slot: 'Full Set', item: 'Elder Gatherer Set' }, { slot: 'Bag', item: 'Satchel T8' }, { slot: 'Mount', item: 'Spectral Wolf' }, { slot: 'Food', item: 'Pork Pie + Tonic' }], tip: 'Blackthorn Quarry / Munten Fell untuk Adamantium T8. Paling valuable!' },
        ]
    },
    {
        id: 'logger',
        icon: '🪓',
        name: 'Logger',
        desc: 'Tebang kayu dari semua biome',
        tiers: [
            { tier: 1, label: 'T1', equipment: [{ slot: 'Tool', item: 'Beginners Axe' }, { slot: 'Chest', item: 'Padded Tunic' }], tip: 'Chop Birch Sapling di Starter Zones.' },
            { tier: 2, label: 'T2', equipment: [{ slot: 'Tool', item: 'Novice Axe' }, { slot: 'Full Set', item: 'Novice Gatherer Set' }], tip: 'Cari Birch Log di hutan Blue Zone.' },
            { tier: 3, label: 'T3', equipment: [{ slot: 'Tool', item: 'Journeyman Axe' }, { slot: 'Full Set', item: 'Journeyman Gatherer Set' }, { slot: 'Bag', item: 'Bag T3' }], tip: 'Chestnut Log T3 untuk profit awal.' },
            { tier: 4, label: 'T4', equipment: [{ slot: 'Tool', item: 'Adept Axe' }, { slot: 'Full Set', item: 'Adept Gatherer Set' }, { slot: 'Bag', item: 'Satchel T4' }, { slot: 'Food', item: 'Pork Pie' }], tip: 'Bloodoak Log T4 di Yellow/Red Zone.' },
            { tier: 5, label: 'T5', equipment: [{ slot: 'Tool', item: 'Expert Axe' }, { slot: 'Full Set', item: 'Expert Gatherer Set' }, { slot: 'Mount', item: 'Swiftclaw' }], tip: 'Roads of Avalon: Cedar Log T5.' },
            { tier: 6, label: 'T6', equipment: [{ slot: 'Tool', item: 'Master Axe' }, { slot: 'Full Set', item: 'Master Gatherer Set' }, { slot: 'Mount', item: 'Swiftclaw' }], tip: 'Black Zone untuk Ashwood Log T6.' },
            { tier: 7, label: 'T7', equipment: [{ slot: 'Tool', item: 'Grandmaster Axe' }, { slot: 'Full Set', item: 'Grandmaster Gatherer Set' }, { slot: 'Mount', item: 'Direwolf' }], tip: 'Whitebank Wall / Highbole Glen untuk Fir Log T7.' },
            { tier: 8, label: 'T8', equipment: [{ slot: 'Tool', item: 'Elder Axe' }, { slot: 'Full Set', item: 'Elder Gatherer Set' }, { slot: 'Mount', item: 'Spectral Wolf' }, { slot: 'Food', item: 'Pork Pie + Tonic' }], tip: 'Highbole Glen / Timberscar Dell untuk Elder Wood T8.' },
        ]
    },
    {
        id: 'skinner',
        icon: '🦊',
        name: 'Skinner',
        desc: 'Uliti haiwan untuk Hide',
        tiers: [
            { tier: 1, label: 'T1', equipment: [{ slot: 'Tool', item: 'Beginners Skinning Knife' }, { slot: 'Chest', item: 'Padded Tunic' }], tip: 'Bunuh haiwan kecil untuk Young Hide T1.' },
            { tier: 2, label: 'T2', equipment: [{ slot: 'Tool', item: 'Novice Skinning Knife' }, { slot: 'Full Set', item: 'Novice Gatherer Set' }], tip: 'Hunt di Blue Zone. Mature Hide T2.' },
            { tier: 3, label: 'T3', equipment: [{ slot: 'Tool', item: 'Journeyman Skinning Knife' }, { slot: 'Full Set', item: 'Journeyman Gatherer Set' }, { slot: 'Bag', item: 'Bag T3' }], tip: 'Cari haiwan Tier 3 di Blue/Yellow Zone.' },
            { tier: 4, label: 'T4', equipment: [{ slot: 'Tool', item: 'Adept Skinning Knife' }, { slot: 'Full Set', item: 'Adept Gatherer Set' }, { slot: 'Bag', item: 'Satchel T4' }], tip: 'Red Zone untuk Thick Hide T4 dari haiwan T4.' },
            { tier: 5, label: 'T5', equipment: [{ slot: 'Tool', item: 'Expert Skinning Knife' }, { slot: 'Full Set', item: 'Expert Gatherer Set' }, { slot: 'Mount', item: 'Swiftclaw' }], tip: 'Roads of Avalon: haiwan T5 untuk Rugged Hide.' },
            { tier: 6, label: 'T6', equipment: [{ slot: 'Tool', item: 'Master Skinning Knife' }, { slot: 'Full Set', item: 'Master Gatherer Set' }, { slot: 'Mount', item: 'Armored Horse' }], tip: 'Black Zone: Robust Hide T6 dari mob T6.' },
            { tier: 7, label: 'T7', equipment: [{ slot: 'Tool', item: 'Grandmaster Skinning Knife' }, { slot: 'Full Set', item: 'Grandmaster Gatherer Set' }, { slot: 'Mount', item: 'Direwolf' }], tip: 'Sandmount Ascent / Sandrift Dunes untuk Hide T7.' },
            { tier: 8, label: 'T8', equipment: [{ slot: 'Tool', item: 'Elder Skinning Knife' }, { slot: 'Full Set', item: 'Elder Gatherer Set' }, { slot: 'Mount', item: 'Spectral Wolf' }, { slot: 'Food', item: 'Pork Pie + Tonic' }], tip: 'Dryvein Oasis / Sandmount Desert untuk Fortified Hide T8.' },
        ]
    },
    {
        id: 'fisher',
        icon: '🎣',
        name: 'Fisher',
        desc: 'Mancing untuk profit tinggi',
        tiers: [
            { tier: 1, label: 'T1', equipment: [{ slot: 'Tool', item: 'Beginners Fishing Rod' }, { slot: 'Bait', item: 'Earthworm (Basic)' }], tip: 'Mancing di Starter Town pond. Jual ikan mentah.' },
            { tier: 2, label: 'T2', equipment: [{ slot: 'Tool', item: 'Novice Fishing Rod' }, { slot: 'Bait', item: 'Earthworm T2' }, { slot: 'Food', item: 'Bread' }], tip: 'Cari fishing spot di Blue Zone untuk jenis ikan T2.' },
            { tier: 3, label: 'T3', equipment: [{ slot: 'Tool', item: 'Journeyman Fishing Rod' }, { slot: 'Bait', item: 'Pincer T3' }, { slot: 'Food', item: 'Bread' }], tip: 'Fishing di lake/river untuk ikan T3 yang lebih berharga.' },
            { tier: 4, label: 'T4', equipment: [{ slot: 'Tool', item: 'Adept Fishing Rod' }, { slot: 'Bait', item: 'Firefly T4' }, { slot: 'Food', item: 'Fish Sandwich' }], tip: 'Yellow Zone: ikan T4 lebih mahal. Jual di city terdekat.' },
            { tier: 5, label: 'T5', equipment: [{ slot: 'Tool', item: 'Expert Fishing Rod' }, { slot: 'Bait', item: 'Gleamfish T5' }, { slot: 'Food', item: 'Avalonian Pork Pie' }], tip: 'Roads of Avalon: Fishpond khusus T5. Rare fish mahal.' },
            { tier: 6, label: 'T6', equipment: [{ slot: 'Tool', item: 'Master Fishing Rod' }, { slot: 'Bait', item: 'Bait T6' }, { slot: 'Food', item: 'Avalonian Pork Pie' }], tip: 'Black Zone Fishing Spots: ikan T6 nilai tinggi di market.' },
            { tier: 7, label: 'T7', equipment: [{ slot: 'Tool', item: 'Grandmaster Fishing Rod' }, { slot: 'Bait', item: 'Bait T7' }, { slot: 'Mount', item: 'Swiftclaw untuk escape' }], tip: 'Fishing di Mists: sedikit ganker, banyak ikan premium.' },
            { tier: 8, label: 'T8', equipment: [{ slot: 'Tool', item: 'Elder Fishing Rod' }, { slot: 'Bait', item: 'Bait T8 Premium' }, { slot: 'Food', item: 'Full Gathering Buff' }, { slot: 'Mount', item: 'Fast Escape Mount' }], tip: 'T8 fish langka = harga sangat tinggi. Perlu kesabaran.' },
        ]
    },
];

let activeGatherProf = 'gatherer';

function renderGatheringProgression() {
    const tabsEl = document.getElementById('gatheringProfTabs');
    const progEl = document.getElementById('gatheringProgression');
    if (!tabsEl || !progEl) return;

    // Render tab buttons
    tabsEl.innerHTML = '';
    gatheringProfessions.forEach(prof => {
        const btn = document.createElement('button');
        btn.className = 'gather-prof-btn' + (prof.id === activeGatherProf ? ' active' : '');
        btn.innerHTML = `${prof.icon} ${prof.name}`;
        btn.addEventListener('click', () => {
            activeGatherProf = prof.id;
            renderGatheringProgression();
        });
        tabsEl.appendChild(btn);
    });

    // Render progression content
    progEl.innerHTML = '';
    const prof = gatheringProfessions.find(p => p.id === activeGatherProf);
    if (!prof) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'gathering-progression active';

    prof.tiers.forEach((t, idx) => {
        const row = document.createElement('div');
        row.className = 'gathering-tier-row' + (idx === prof.tiers.length - 1 ? ' current' : '');

        const equipHTML = t.equipment.map(e => `
            <div class="equip-item">
                <span class="equip-slot">${e.slot}</span>
                <span>${e.item}</span>
            </div>`).join('');

        row.innerHTML = `
            <div class="gathering-tier-num">
                <div class="tier-circle">T${t.tier}</div>
            </div>
            <div class="gathering-tier-content">
                <div class="gathering-tier-title">${t.label}</div>
                <div class="gathering-equipment">${equipHTML}</div>
                <div class="gathering-tips-text">💡 ${t.tip}</div>
            </div>`;
        wrapper.appendChild(row);
    });

    progEl.appendChild(wrapper);
}

// ============================================
// BUILDS
// ============================================
function getGatheringBuilds() {
    return [
        { name: t('builds.solo'), type: t('builds.typeSolo'), items: ['Assassin Jacket (Speed Caster)', 'Assassin Boots', 'Assassin Hood', 'Gathering Axe / Pick T6+', 'Satchel of Insight', 'Swiftclaw Mount'] },
        { name: t('builds.tank'), type: t('builds.typeGroup'), items: ['Knight Armor', 'Knight Boots', 'Knight Helm', 'Gathering Tool T7+', 'Reinforced Bag', 'Armored Horse'] },
        { name: t('builds.balanced'), type: t('builds.typeVersatile'), items: ['Cleric Robe', 'Cleric Sandals', 'Cleric Cowl', 'Gathering Tool T6+', 'Satchel of Insight', 'Direwolf Mount'] }
    ];
}

function renderGatheringBuilds() {
    const grid = document.getElementById('buildsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    getGatheringBuilds().forEach(build => {
        const card = document.createElement('div');
        card.className = 'build-card';
        card.innerHTML = `
            <div class="build-name">${build.name}</div>
            <div class="build-type">${build.type}</div>
            <div class="build-items">${build.items.map(i => `<div class="build-item">→ ${i}</div>`).join('')}</div>`;
        grid.appendChild(card);
    });
}

// ============================================
// T8 MAPS
// ============================================
function getT8MapsData() {
    return {
        '🌿 Fiber': ['Willow Wood', 'Drownfield Mire', 'Wispwhisper Marsh', 'Nightcreak Marsh'],
        '🪵 Wood': ['Whitebank Wall', 'Whitebank Ridge', 'Highbole Glen', 'Timberscar Dell'],
        '🦊 Hide': ['Sandmount Ascent', 'Sandrift Dunes', 'Dryvein Oasis', 'Sandmount Desert'],
        '🪨 Stone': ['Everwinter Peak', 'Frostpeak Ascent', 'Whitepeak Tundra', 'Glacierfall Valley'],
        '⛏ Ore': ['Blackthorn Quarry', 'Shaleheath Hills', 'Birken Fell', 'Munten Fell'],
    };
}

function renderT8Maps() {
    const grid = document.getElementById('t8MapsGrid');
    grid.innerHTML = '';
    Object.entries(getT8MapsData()).forEach(([resource, maps]) => {
        const card = document.createElement('div');
        card.className = 't8-card';
        card.innerHTML = `
            <h3 class="t8-card-title">${resource}</h3>
            <ul class="t8-maps-list">${maps.map(m => `<li>${m}</li>`).join('')}</ul>`;
        grid.appendChild(card);
    });
}

// ============================================
// EVENTS
// ============================================
function renderEventSchedule() {
    const grid = document.getElementById('eventsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    const events = [
        { time: 'Even Hours UTC', title: t('events.worldBoss'), desc: t('events.worldBossDesc'), note: t('events.worldBossNote') },
        { time: '14:00 UTC (9 PM WIB)', title: t('events.primeTime'), desc: t('events.primeTimeDesc'), note: t('events.primeTimeNote') },
        { time: '13:00–15:00 UTC', title: t('events.dangerWindow'), desc: t('events.dangerWindowDesc'), note: t('events.dangerWindowNote') },
        { time: '21:00–09:00 UTC', title: t('events.lowActivity'), desc: t('events.lowActivityDesc'), note: t('events.lowActivityNote') },
    ];
    events.forEach(ev => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
            <div class="event-time">⏰ ${ev.time}</div>
            <div class="event-description"><strong>${ev.title}</strong></div>
            <div class="event-description">${ev.desc}</div>
            <div class="event-note">💡 ${ev.note}</div>`;
        grid.appendChild(card);
    });
}

// ============================================
// PRO TIPS
// ============================================
function renderProTips() {
    const eff = document.getElementById('efficiencyTips');
    const saf = document.getElementById('safetyTips');
    const pro = document.getElementById('profitabilityTips');
    const effTips = t('proTips.efficiency.tips') || [];
    const safTips = t('proTips.safety.tips') || [];
    const proTips = t('proTips.profitability.tips') || [];
    if (eff) eff.innerHTML = Array.isArray(effTips) ? effTips.map(tip => `<p>${tip}</p>`).join('') : '';
    if (saf) saf.innerHTML = Array.isArray(safTips) ? safTips.map(tip => `<p>${tip}</p>`).join('') : '';
    if (pro) pro.innerHTML = Array.isArray(proTips) ? proTips.map(tip => `<p>${tip}</p>`).join('') : '';
}

// ============================================
// PRIME TIME TRACKER
// ============================================
function updatePrimeTimeTracker() {
    const now = new Date();
    const uh = now.getUTCHours(), um = now.getUTCMinutes();
    const lh = now.getHours(), lm = now.getMinutes();
    const ampm = lh >= 12 ? 'PM' : 'AM';
    const dh = lh % 12 || 12;
    const utcEl = document.getElementById('utcTime');
    const localEl = document.getElementById('localTime');
    if (utcEl) utcEl.textContent = `${String(uh).padStart(2,'0')}:${String(um).padStart(2,'0')} UTC`;
    if (localEl) localEl.textContent = `${String(dh).padStart(2,'0')}:${String(lm).padStart(2,'0')} ${ampm}`;

    let level = 'safe', status = t('tracker.safeStatus');
    if (uh >= 13 && uh < 15) { level = 'extreme'; status = t('tracker.extremeStatus'); }
    else if ((uh >= 9 && uh < 13) || (uh >= 15 && uh < 21)) { level = 'moderate'; status = t('tracker.moderateStatus'); }

    const dEl = document.getElementById('dangerLevel');
    if (dEl) { dEl.textContent = level.charAt(0).toUpperCase() + level.slice(1); dEl.className = `danger-level ${level}`; }
    const sEl = document.getElementById('statusInfo');
    if (sEl) sEl.textContent = status;
}
setInterval(updatePrimeTimeTracker, 60000);

// ============================================
// BEGINNER GUIDE DATA & RENDER
// ============================================
function getBeginnerGuideData() {
    return {
        early: [
            { title: 'Buat Karakter & Pilih Server', desc: 'Pilih Albion East (Asia) untuk latency terbaik di Asia Tenggara. Server ini punya komuniti Malaysia/Indonesia yang ramai.', badge: { text: 'Langkah 1', type: 'tier' } },
            { title: 'Selesaikan Tutorial', desc: 'Ikut tutorial habis-habisan. Kamu dapat equipment percuma dan faham basic mechanics seperti Destiny Board.', badge: { text: 'Wajib', type: 'tip' } },
            { title: 'Buka Destiny Board', desc: 'Tekan K untuk buka Destiny Board. Ini adalah "skill tree" Albion. Fokus pada satu path: Gathering atau Combat dulu.', badge: { text: 'T1-T3', type: 'tier' } },
            { title: 'Pilih Satu Gathering Profession', desc: 'Pilih antara: Logger (kayu), Miner (batu/ore), Skinner (hide), atau Fisher. Fokus satu untuk cepat naik tier.', badge: { text: 'Penting', type: 'tip' } },
            { title: 'Kumpul Resource & Jual di Market', desc: 'Bawa hasil gathering ke kota terdekat, buka Market (M), dan jual. Ini cara paling mudah dapat Silver awal.', badge: { text: 'T1-T4', type: 'tier' } },
            { title: 'Upgrade Gathering Gear', desc: 'Gunakan Silver untuk beli atau craft Gatherer Set tier yang lebih tinggi. Set ini memberi bonus yield resource.', badge: { text: 'Priority', type: 'tip' } },
        ],
        mid: [
            { title: 'Capai Gathering Tier 5', desc: 'Target T5 untuk mulai masuk Roads of Avalon yang lebih aman daripada Black Zone tapi lebih profitable dari Royal Continent.', badge: { text: 'T5', type: 'tier' } },
            { title: 'Join Guild', desc: 'Guild memberi protection, informasi meta, dan akses ke territory. Cari guild aktif di Albion East dengan tag [MY] atau [ID].', badge: { text: 'Recommended', type: 'tip' } },
            { title: 'Faham Zone System', desc: 'Blue = aman, Yellow = semi-PvP, Red = PvP penuh lose gear, Black = PvP penuh lose all. Plan route gathering dengan bijak.', badge: { text: 'Safety', type: 'warn' } },
            { title: 'Gunakan Food Buff', desc: 'Pork Pie (Pastel de Porco) meningkatkan carrying capacity. Selalu makan sebelum farm untuk maximize profit per trip.', badge: { text: 'T4+', type: 'tier' } },
            { title: 'Beli Premium (Optional)', desc: 'Premium membership memberi +50% more Silver dari activity & lebih banyak Learning Points. Sangat berbaloi jika main serius.', badge: { text: 'Optional', type: 'tip' } },
            { title: 'Mulai Farm Black Zone dengan Guild', desc: 'Bila dah ready, farm T6 di Black Zone bersama guildmates. Lebih aman dan profit jauh lebih tinggi.', badge: { text: 'T6', type: 'tier' } },
        ],
        end: [
            { title: 'Capai Elder Gathering (T8)', desc: 'Elder Gatherer dengan fully-leveled tools memberikan yield bonus terbesar. Ini matlamat utama gatherer.', badge: { text: 'T8', type: 'tier' } },
            { title: 'Farm Outlands Black Zone', desc: 'T8 resources hanya ada di Outlands. Gunakan guild ZvZ group atau ninja solo farm dengan Invis Shrine dan escape mount.', badge: { text: 'Danger', type: 'warn' } },
            { title: 'Diversify ke Multiple Resources', desc: 'Bila T8 di satu resource, naik T8 resource lain. Lebih diversified = lebih stable income bila harga turun.', badge: { text: 'Smart', type: 'tip' } },
            { title: 'Craft & Refine untuk Extra Profit', desc: 'Refine resource kamu sendiri sebelum jual untuk markup 20-40%. Crafting juga beri Destiny Board XP.', badge: { text: 'Profit+', type: 'tip' } },
            { title: 'Join Territory Battles (ZvZ)', desc: 'Dengan guild yang ada territory, kamu dapat farm T8 di guild land dengan lebih aman dan dapat share dari territory.', badge: { text: 'Endgame', type: 'tier' } },
            { title: 'Masuk Economy: Trading', desc: 'Beli low, jual high antara cities. Albion market beza harga antar kota bisa mencapai 30-50%. Advanced play.', badge: { text: 'Advanced', type: 'tip' } },
        ]
    };
}

function renderBeginnerGuide() {
    const data = getBeginnerGuideData();
    ['early', 'mid', 'end'].forEach(phase => {
        const container = document.getElementById(`${phase}GameSteps`);
        if (!container) return;
        container.innerHTML = '';
        data[phase].forEach((step, i) => {
            const div = document.createElement('div');
            div.className = 'guide-step';
            div.innerHTML = `
                <div class="guide-step-num">${i + 1}</div>
                <div class="guide-step-content">
                    <div class="guide-step-title">${step.title}</div>
                    <p class="guide-step-desc">${step.desc}</p>
                    <span class="guide-step-badge badge-${step.badge.type}">${step.badge.text}</span>
                </div>`;
            container.appendChild(div);
        });
    });

    // Render professions grid
    const profGrid = document.getElementById('professionsGrid');
    if (!profGrid) return;
    profGrid.innerHTML = '';
    gatheringProfessions.forEach(prof => {
        const card = document.createElement('div');
        card.className = 'profession-card';
        card.innerHTML = `
            <div class="profession-icon">${prof.icon}</div>
            <div class="profession-name">${prof.name}</div>
            <div class="profession-desc">${prof.desc}</div>`;
        card.addEventListener('click', () => openProfessionDetail(prof));
        profGrid.appendChild(card);
    });
}

// ============================================
// PROFESSION DETAIL PAGE
// ============================================
function openProfessionDetail(prof) {
    const page = document.getElementById('professionDetailPage');
    const title = document.getElementById('professionDetailTitle');
    const content = document.getElementById('professionDetailContent');

    title.innerHTML = `${prof.icon} ${prof.name}`;

    const tiersHTML = prof.tiers.map(t => `
        <div class="prof-tier-item">
            <h4>${t.label}</h4>
            <div class="prof-equip-list">
                ${t.equipment.map(e => `
                    <div class="prof-equip-row">
                        <span class="prof-equip-slot">${e.slot}</span>
                        <span class="prof-equip-name">${e.item}</span>
                    </div>`).join('')}
            </div>
            <div class="prof-tip">💡 ${t.tip}</div>
        </div>`).join('');

    content.innerHTML = `
        <div class="prof-detail-header">
            <div class="prof-detail-icon">${prof.icon}</div>
            <div class="prof-detail-meta">
                <h3>${prof.name}</h3>
                <p>${prof.desc}</p>
            </div>
        </div>
        <div class="prof-tier-list">${tiersHTML}</div>`;

    // Tutup guide overlay dulu, kemudian buka profession detail page
    document.getElementById('guideOverlay').classList.remove('open');
    page.classList.add('open');
    document.body.style.overflow = 'hidden';
}

// ============================================
// GUILD PAGE CONTENT
// ============================================
function renderGuildPage() {
    const content = document.getElementById('guildPageContent');
    content.innerHTML = `
        <div class="guild-section">
            <h3>🛡 Kenapa Perlu Join Guild?</h3>
            <div class="guild-grid">
                <div class="guild-card"><div class="guild-card-title">⚔ Protection</div><p>Farm dengan protection dari guildmates. Kurang risiko kena gank solo.</p></div>
                <div class="guild-card"><div class="guild-card-title">🏰 Territory Access</div><p>Guild territory membolehkan farm T8 di tanah sendiri dengan lebih aman.</p></div>
                <div class="guild-card"><div class="guild-card-title">💰 Guild Island</div><p>Access ke guild island untuk shared farming, refining dan crafting station.</p></div>
                <div class="guild-card"><div class="guild-card-title">📢 Intel & Meta</div><p>Info terkini tentang harga market, spot farming terbaik dan event server.</p></div>
            </div>
        </div>
        <div class="guild-section">
            <h3>🔍 Cara Cari Guild di Albion East</h3>
            <div class="guild-grid">
                <div class="guild-card"><div class="guild-card-title">In-Game Search</div><p>Tekan G → Guild Finder. Cari tag [MY], [ID], [SG] atau [ASIA] untuk guild serantau.</p></div>
                <div class="guild-card"><div class="guild-card-title">Discord Community</div><p>Join Albion Online Asia Discord. Ramai guild advertise di #looking-for-guild channel.</p></div>
                <div class="guild-card"><div class="guild-card-title">Reddit & Forum</div><p>r/albiononline ada thread guild recruitment. Filter by Asia/East server.</p></div>
            </div>
        </div>
        <div class="guild-section">
            <h3>📋 Apa yang Perlu Dibuat Bila Baru Join Guild</h3>
            <table class="info-table">
                <tr><td>1. Perkenalkan diri</td><td>Cakap role kamu: gatherer, crafter, atau fighter</td></tr>
                <tr><td>2. Baca Guild Rules</td><td>Biasanya ada di Discord atau Guild Notes</td></tr>
                <tr><td>3. Contribute Silver/Resources</td><td>Banyak guild ada minimum contribution per minggu</td></tr>
                <tr><td>4. Join Guild Events</td><td>ZvZ, Hellgate, atau group farm sesuai schedule</td></tr>
                <tr><td>5. Upgrade Gear</td><td>Pastikan gear kamu sesuai dengan keperluan guild activity</td></tr>
            </table>
        </div>
        <div class="guild-section">
            <h3>⚔ Jenis-Jenis Guild di Albion East</h3>
            <div class="guild-grid">
                <div class="guild-card"><div class="guild-card-title">🏕 Casual Guild</div><p>Untuk pemain santai. Tiada pressure, banyak belajar. Sesuai untuk pemula.</p></div>
                <div class="guild-card"><div class="guild-card-title">⚔ PvP Guild</div><p>Fokus ZvZ dan Hellgate. Perlu gear tinggi dan komitmen schedule.</p></div>
                <div class="guild-card"><div class="guild-card-title">🌿 Gathering Guild</div><p>Fokus farming dan economy. Lebih chill, income stable. Sesuai gatherer.</p></div>
                <div class="guild-card"><div class="guild-card-title">🏰 Territory Guild</div><p>Own territories di Outlands. Farm T8 dengan protection. Perlu commitment.</p></div>
            </div>
        </div>
        <div class="guild-section">
            <h3>💡 Tips Player Baru dalam Guild</h3>
            <table class="info-table">
                <tr><td>Jangan ego</td><td>Dengar arahan veteran guild, ada banyak nak belajar</td></tr>
                <tr><td>Aktif berkomunikasi</td><td>Join voice chat semasa event, tanya bila tak faham</td></tr>
                <tr><td>Contribute balik</td><td>Jangan hanya ambil, tolong guildmates bila boleh</td></tr>
                <tr><td>Sabar naik tier</td><td>T4 → T8 ambil masa, jangan rush dan rugi silver</td></tr>
                <tr><td>Simpan backup silver</td><td>Selalu ada 500k+ silver backup bila kena gank</td></tr>
            </table>
        </div>`;
}

// ============================================
// NAVIGATION TABS
// ============================================
function initNavTabs() {
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const section = tab.getAttribute('data-section');

            // Guild opens full page
            if (section === 'guild') {
                renderGuildPage();
                document.getElementById('playerGuildPage').classList.add('open');
                document.body.style.overflow = 'hidden';
                return;
            }

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const target = document.getElementById(`section-${section}`);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ============================================
// GUIDE OVERLAY
// ============================================
function initGuideOverlay() {
    const overlay = document.getElementById('guideOverlay');
    const openBtn = document.getElementById('guideToggleBtn');
    const closeBtn = document.getElementById('guideCloseBtn');
    const heroBtn = document.getElementById('heroGuideBtn');

    function open() {
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    function close() {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (openBtn) openBtn.addEventListener('click', open);
    if (heroBtn) heroBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);

    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

    // Guide tabs
    document.querySelectorAll('.guide-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.guide-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.guide-panel').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const panel = document.querySelector(`[data-guide-panel="${tab.getAttribute('data-guide-tab')}"]`);
            if (panel) panel.classList.add('active');
        });
    });
}

// ============================================
// FULLPAGE OVERLAYS — CLOSE
// ============================================
function initFullPageOverlays() {
    document.getElementById('closeGuildPage').addEventListener('click', () => {
        document.getElementById('playerGuildPage').classList.remove('open');
        document.body.style.overflow = '';
    });
    document.getElementById('closeProfessionPage').addEventListener('click', () => {
        document.getElementById('professionDetailPage').classList.remove('open');
        document.body.style.overflow = '';
    });
}

// ============================================
// HERO SCROLL BUTTON
// ============================================
function initHeroScroll() {
    const btn = document.getElementById('heroScrollBtn');
    if (btn) {
        btn.addEventListener('click', () => {
            document.getElementById('mainContent').scrollIntoView({ behavior: 'smooth' });
        });
    }
}

// ============================================
// KEYBOARD CLOSE
// ============================================
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        document.getElementById('guideOverlay')?.classList.remove('open');
        document.getElementById('playerGuildPage')?.classList.remove('open');
        document.getElementById('professionDetailPage')?.classList.remove('open');
        document.body.style.overflow = '';
    }
});

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadTranslations().then(() => {
        // Language switcher
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                currentLanguage = btn.getAttribute('data-lang');
                localStorage.setItem('language', currentLanguage);
                updatePageLanguage();
            });
        });

        renderGatheringBuilds();
        renderEventSchedule();
        renderGatheringProgression();
        renderBeginnerGuide();
        updatePrimeTimeTracker();
        initGuideOverlay();
        initNavTabs();
        initFullPageOverlays();
        initHeroScroll();
    });
});
