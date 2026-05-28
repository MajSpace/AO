// ============================================
// TRANSLATION SYSTEM
// ============================================

let translations = {
    en: {},
    id: {}
};

let currentLanguage = localStorage.getItem('language') || 'en';

// Load translations
async function loadTranslations() {
    try {
        const enResponse = await fetch('locales/en.json');
        const idResponse = await fetch('locales/id.json');
        
        translations.en = await enResponse.json();
        translations.id = await idResponse.json();
        
        updatePageLanguage();
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

function t(key, defaultValue = '') {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = value[k];
        } else {
            return defaultValue;
        }
    }
    
    return value || defaultValue;
}

function updatePageLanguage() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const text = t(key);
        
        if (text && typeof text === 'string') {
            element.textContent = text;
        }
    });
    
    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === currentLanguage) {
            btn.classList.add('active');
        }
    });
    
    // Re-render dynamic content
    renderBiomes();
    renderTiers();
    renderT8Maps();
    renderProTips();
    renderGatheringBuilds();
    renderEventSchedule();
}

// ============================================
// BIOME DATA & RENDERING
// ============================================

function getBiomeData() {
    return [
        {
            name: t('biome_names.swamp'),
            city: 'Thetford',
            primaryResource: 'Fiber (Hemp)',
            secondaryResource: 'Wood (Log)',
            tertiaryResource: 'Hide',
            image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663244214689/CP2xbP6jZ7YquxKLmra3zY/biome-forest-GU38UQaqucTXFdpCjtksAA.webp',
            description: t('biome_descriptions.swamp'),
            color: '#5a189a',
        },
        {
            name: t('biome_names.forest'),
            city: 'Lymhurst',
            primaryResource: 'Wood (Log)',
            secondaryResource: 'Hide',
            tertiaryResource: 'Stone',
            image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663244214689/CP2xbP6jZ7YquxKLmra3zY/biome-forest-GU38UQaqucTXFdpCjtksAA.webp',
            description: t('biome_descriptions.forest'),
            color: '#2d5016',
        },
        {
            name: t('biome_names.mountain'),
            city: 'Fort Sterling',
            primaryResource: 'Ore (Iron)',
            secondaryResource: 'Stone',
            tertiaryResource: 'Fiber',
            image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663244214689/CP2xbP6jZ7YquxKLmra3zY/biome-mountain-njbLb46H7FGuykLTKS9wMS.webp',
            description: t('biome_descriptions.mountain'),
            color: '#4a5568',
        },
        {
            name: t('biome_names.highland'),
            city: 'Martlock',
            primaryResource: 'Stone',
            secondaryResource: 'Ore (Iron)',
            tertiaryResource: 'Wood',
            image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663244214689/CP2xbP6jZ7YquxKLmra3zY/biome-mountain-njbLb46H7FGuykLTKS9wMS.webp',
            description: t('biome_descriptions.highland'),
            color: '#8b6914',
        },
        {
            name: t('biome_names.steppe'),
            city: 'Bridgewatch',
            primaryResource: 'Hide',
            secondaryResource: 'Fiber',
            tertiaryResource: 'Ore',
            image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663244214689/CP2xbP6jZ7YquxKLmra3zY/biome-steppe-Hzd9bGzAkigiRx6SatXPpd.webp',
            description: t('biome_descriptions.steppe'),
            color: '#c9a227',
        },
    ];
}

function renderBiomes() {
    const grid = document.getElementById('biomesGrid');
    grid.innerHTML = '';
    
    const biomes = getBiomeData();
    
    biomes.forEach(biome => {
        const card = document.createElement('div');
        card.className = 'biome-card';
        card.style.borderColor = biome.color;
        
        card.innerHTML = `
            <div class="biome-image">
                <img src="${biome.image}" alt="${biome.name}" loading="lazy">
                <div class="biome-image-overlay">
                    <h3 class="biome-name">${biome.name}</h3>
                    <p class="biome-city">${biome.city}</p>
                </div>
            </div>
            <div class="biome-content">
                <p class="biome-description">${biome.description}</p>
                <div class="resource-group">
                    <p class="resource-label">${t('biomes.primaryResource')}</p>
                    <span class="badge badge-primary">${biome.primaryResource}</span>
                </div>
                <div class="resource-group">
                    <p class="resource-label">${t('biomes.secondaryResource')}</p>
                    <span class="badge badge-outline">${biome.secondaryResource}</span>
                </div>
                <div class="resource-group">
                    <p class="resource-label">${t('biomes.tertiaryResource')}</p>
                    <span class="badge badge-outline">${biome.tertiaryResource}</span>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// ============================================
// TIER DATA & RENDERING
// ============================================

function getTierData() {
    return [
        {
            tier: 1,
            location: t('tiers.tier1.location'),
            zoneType: t('tiers.tier1.zoneType'),
            resources: ['Fiber', 'Hide', 'Ore', 'Wood', 'Stone'],
            tips: t('tiers.tier1.tips') || [],
            danger: 'safe',
        },
        {
            tier: 4,
            location: t('tiers.tier4.location'),
            zoneType: t('tiers.tier4.zoneType'),
            resources: ['Fiber', 'Hide', 'Ore', 'Wood', 'Stone'],
            tips: t('tiers.tier4.tips') || [],
            danger: 'moderate',
        },
        {
            tier: 6,
            location: t('tiers.tier6.location'),
            zoneType: t('tiers.tier6.zoneType'),
            resources: ['Fiber', 'Hide', 'Ore', 'Wood', 'Stone'],
            tips: t('tiers.tier6.tips') || [],
            danger: 'dangerous',
        },
        {
            tier: 7,
            location: t('tiers.tier7.location'),
            zoneType: t('tiers.tier7.zoneType'),
            resources: ['Fiber', 'Hide', 'Ore', 'Wood', 'Stone'],
            tips: t('tiers.tier7.tips') || [],
            danger: 'dangerous',
        },
        {
            tier: 8,
            location: t('tiers.tier8.location'),
            zoneType: t('tiers.tier8.zoneType'),
            resources: ['Fiber', 'Hide', 'Ore', 'Wood', 'Stone'],
            tips: t('tiers.tier8.tips') || [],
            danger: 'dangerous',
        },
    ];
}

function renderTiers() {
    const container = document.getElementById('tiersContainer');
    container.innerHTML = '';
    
    const tiers = getTierData();
    
    tiers.forEach(tier => {
        const card = document.createElement('div');
        card.className = 'tier-card';
        
        const dangerBadgeClass = `badge badge-${tier.danger}`;
        
        let tipsHTML = '';
        if (Array.isArray(tier.tips)) {
            tipsHTML = tier.tips.map(tip => `<li>${tip}</li>`).join('');
        }
        
        card.innerHTML = `
            <div class="tier-header">
                <div>
                    <h3 class="tier-title">Tier ${tier.tier}</h3>
                    <p class="tier-location">${tier.location}</p>
                </div>
                <div class="tier-badges">
                    <span class="badge badge-outline">${tier.zoneType}</span>
                    <span class="${dangerBadgeClass}">${tier.danger.charAt(0).toUpperCase() + tier.danger.slice(1)}</span>
                </div>
            </div>
            <div class="tier-body">
                <div class="tier-section">
                    <h4 class="tier-section-title">${t('tiers.resources')}</h4>
                    <div class="resources-badges">
                        ${tier.resources.map(resource => `<span class="badge badge-outline">${resource}</span>`).join('')}
                    </div>
                </div>
                <div class="tier-section">
                    <h4 class="tier-section-title">${t('tiers.tips')}</h4>
                    <ul class="tips-list">
                        ${tipsHTML}
                    </ul>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// ============================================
// T8 MAPS DATA & RENDERING
// ============================================

function getT8MapsData() {
    return {
        [t('t8Maps.fiber')]: ['Willow Wood', 'Drownfield Mire', 'Wispwhisper Marsh', 'Nightcreak Marsh'],
        [t('t8Maps.wood')]: ['Whitebank Wall', 'Whitebank Ridge', 'Highbole Glen', 'Timberscar Dell'],
        [t('t8Maps.hide')]: ['Sandmount Ascent', 'Sandrift Dunes', 'Dryvein Oasis', 'Sandmount Desert'],
        [t('t8Maps.stone')]: ['Everwinter Peak', 'Frostpeak Ascent', 'Whitepeak Tundra', 'Glacierfall Valley'],
        [t('t8Maps.ore')]: ['Blackthorn Quarry', 'Shaleheath Hills', 'Birken Fell', 'Munten Fell'],
    };
}

function renderT8Maps() {
    const grid = document.getElementById('t8MapsGrid');
    grid.innerHTML = '';
    
    const maps = getT8MapsData();
    
    Object.entries(maps).forEach(([resource, mapList]) => {
        const card = document.createElement('div');
        card.className = 't8-card';
        
        const mapsHTML = mapList.map(map => `<li>${map}</li>`).join('');
        
        card.innerHTML = `
            <h3 class="t8-card-title">${resource}</h3>
            <ul class="t8-maps-list">
                ${mapsHTML}
            </ul>
        `;
        
        grid.appendChild(card);
    });
}

// ============================================
// GATHERING BUILDS DATA & RENDERING
// ============================================

function getGatheringBuilds() {
    return [
        {
            name: t('builds.solo'),
            type: t('builds.typeSolo'),
            items: [
                'Assassin Jacket',
                'Assassin Boots',
                'Assassin Hood',
                'Gathering Axe T8',
                'Satchel'
            ]
        },
        {
            name: t('builds.tank'),
            type: t('builds.typeGroup'),
            items: [
                'Knight Armor',
                'Knight Boots',
                'Knight Helm',
                'Gathering Axe T8',
                'Bag'
            ]
        },
        {
            name: t('builds.balanced'),
            type: t('builds.typeVersatile'),
            items: [
                'Cleric Robe',
                'Cleric Sandals',
                'Cleric Cowl',
                'Gathering Axe T8',
                'Satchel'
            ]
        }
    ];
}

function renderGatheringBuilds() {
    const grid = document.getElementById('buildsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    const builds = getGatheringBuilds();
    
    builds.forEach(build => {
        const card = document.createElement('div');
        card.className = 'build-card';
        
        const itemsHTML = build.items.map(item => `<div class="build-item">→ ${item}</div>`).join('');
        
        card.innerHTML = `
            <div class="build-name">${build.name}</div>
            <div class="build-type">${build.type}</div>
            <div class="build-items">
                ${itemsHTML}
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// ============================================
// EVENTS SCHEDULE DATA & RENDERING
// ============================================

function getEventSchedule() {
    return [
        {
            time: t('events.worldBoss'),
            title: t('events.worldBoss'),
            description: t('events.worldBossDesc'),
            note: t('events.worldBossNote')
        },
        {
            time: '14:00 UTC (9 PM WIB)',
            title: t('events.primeTime'),
            description: t('events.primeTimeDesc'),
            note: t('events.primeTimeNote')
        },
        {
            time: '13:00-15:00 UTC',
            title: t('events.dangerWindow'),
            description: t('events.dangerWindowDesc'),
            note: t('events.dangerWindowNote')
        },
        {
            time: '21:00-09:00 UTC',
            title: t('events.lowActivity'),
            description: t('events.lowActivityDesc'),
            note: t('events.lowActivityNote')
        }
    ];
}

function renderEventSchedule() {
    const grid = document.getElementById('eventsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    const events = getEventSchedule();
    
    events.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';
        
        card.innerHTML = `
            <div class="event-time">${event.time}</div>
            <div class="event-description"><strong>${event.title}</strong></div>
            <div class="event-description">${event.description}</div>
            <div class="event-note">💡 ${event.note}</div>
        `;
        
        grid.appendChild(card);
    });
}

// ============================================
// PRIME TIME TRACKER
// ============================================

function updatePrimeTimeTracker() {
    const now = new Date();
    
    // UTC Time
    const utcHours = now.getUTCHours();
    const utcMinutes = now.getUTCMinutes();
    const utcTimeString = `${String(utcHours).padStart(2, '0')}:${String(utcMinutes).padStart(2, '0')} UTC`;
    
    // Local Time
    const localHours = now.getHours();
    const localMinutes = now.getMinutes();
    const ampm = localHours >= 12 ? 'PM' : 'AM';
    const displayHours = localHours % 12 || 12;
    const localTimeString = `${String(displayHours).padStart(2, '0')}:${String(localMinutes).padStart(2, '0')} ${ampm}`;
    
    const utcTimeEl = document.getElementById('utcTime');
    if (utcTimeEl) {
        utcTimeEl.textContent = utcTimeString;
    }
    
    const localTimeEl = document.getElementById('localTime');
    if (localTimeEl) {
        localTimeEl.textContent = localTimeString;
    }
    
    // Determine danger level
    let dangerLevel = 'safe';
    let statusText = t('tracker.safeStatus');
    
    if (utcHours >= 13 && utcHours < 15) {
        dangerLevel = 'extreme';
        statusText = t('tracker.extremeStatus');
    } else if ((utcHours >= 9 && utcHours < 13) || (utcHours >= 15 && utcHours < 21)) {
        dangerLevel = 'moderate';
        statusText = t('tracker.moderateStatus');
    } else {
        dangerLevel = 'safe';
        statusText = t('tracker.safeStatus');
    }
    
    const dangerEl = document.getElementById('dangerLevel');
    if (dangerEl) {
        dangerEl.textContent = dangerLevel.charAt(0).toUpperCase() + dangerLevel.slice(1);
        dangerEl.className = `danger-level ${dangerLevel}`;
    }
    
    const statusEl = document.getElementById('statusInfo');
    if (statusEl) {
        statusEl.textContent = statusText;
    }
}

// Update prime time tracker every minute
setInterval(updatePrimeTimeTracker, 60000);

// ============================================
// PRO TIPS RENDERING
// ============================================

function renderProTips() {
    const efficiencyTips = t('proTips.efficiency.tips') || [];
    const safetyTips = t('proTips.safety.tips') || [];
    const profitabilityTips = t('proTips.profitability.tips') || [];
    
    const efficiencyContainer = document.getElementById('efficiencyTips');
    const safetyContainer = document.getElementById('safetyTips');
    const profitabilityContainer = document.getElementById('profitabilityTips');
    
    efficiencyContainer.innerHTML = Array.isArray(efficiencyTips) 
        ? efficiencyTips.map(tip => `<p>${tip}</p>`).join('')
        : '';
    
    safetyContainer.innerHTML = Array.isArray(safetyTips)
        ? safetyTips.map(tip => `<p>${tip}</p>`).join('')
        : '';
    
    profitabilityContainer.innerHTML = Array.isArray(profitabilityTips)
        ? profitabilityTips.map(tip => `<p>${tip}</p>`).join('')
        : '';
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Load translations first
    loadTranslations().then(() => {
        // Language switcher
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                currentLanguage = lang;
                localStorage.setItem('language', lang);
                updatePageLanguage();
            });
        });
        
        // Scroll to main content button
        const startFarmingBtn = document.querySelector('.btn-primary');
        if (startFarmingBtn) {
            startFarmingBtn.addEventListener('click', () => {
                const mainContent = document.querySelector('.main-content');
                if (mainContent) {
                    mainContent.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
        
        // Render new sections
        renderGatheringBuilds();
        renderEventSchedule();
        updatePrimeTimeTracker();
    });
});


// ============================================
// GUIDE PANEL SYSTEM
// ============================================

let currentGuideTab = 'beginner';

function openGuidePanel() {
    const overlay = document.getElementById('guideOverlay');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderGuideContent(currentGuideTab);
}

function closeGuidePanel() {
    const overlay = document.getElementById('guideOverlay');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
}

function switchGuideTab(tab) {
    currentGuideTab = tab;
    document.querySelectorAll('.guide-tab').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
    });
    renderGuideContent(tab);
}

function renderGuideContent(tab) {
    const container = document.getElementById('guideContent');
    container.innerHTML = '';

    if (tab === 'beginner') renderBeginnerGuide(container);
    else if (tab === 'midgame') renderMidGameGuide(container);
    else if (tab === 'endgame') renderEndGameGuide(container);
    else if (tab === 'professions') renderProfessionsGuide(container);
}

// ---- BEGINNER GUIDE ----
function renderBeginnerGuide(container) {
    const lang = currentLanguage;

    const data = {
        en: {
            intro: { title: "🌱 Starting Your Journey", desc: "Welcome to Albion Online! Follow these steps in order. Don't skip ahead — each step builds on the last." },
            steps: [
                { title: "Complete the Tutorial", desc: "Finish the starter island tutorial to earn your first gear and understand basic mechanics. Don't rush it — there are free rewards waiting.", tags: [{ label: "Blue Zone", cls: "tag-safe" }, { label: "Free Gear", cls: "" }] },
                { title: "Choose Your Starting City", desc: "Each city connects to a different biome. Pick Thetford (Fiber), Lymhurst (Wood), Fort Sterling (Ore), Martlock (Stone), or Bridgewatch (Hide) based on what profession you plan to focus on.", tags: [{ label: "Important", cls: "tag-warn" }, { label: "Biome Match", cls: "" }] },
                { title: "Level Up One Gathering Skill", desc: "Focus on ONE resource type only. Don't spread yourself thin. Use your gathering tool every day to gain Gathering Fame. Target Journeyman (T3) first.", tags: [{ label: "Focus = Silver", cls: "tag-tip" }, { label: "T1 → T3", cls: "" }] },
                { title: "Use Learning Points Wisely", desc: "Learning Points (LP) speed up skill leveling. Spend them on your main gathering skill. Log in daily to accumulate LP even when not playing.", tags: [{ label: "Log In Daily", cls: "tag-warn" }, { label: "LP = Speed", cls: "tag-tip" }] },
                { title: "Sell Everything at the Market", desc: "Always check the Black Market in Caerleon for best prices. Use the 'Quick Sort' feature and sell raw resources — don't refine early as it costs silver.", tags: [{ label: "Black Market", cls: "" }, { label: "Raw > Refined", cls: "tag-tip" }] },
                { title: "Get Premium (Optional but Helpful)", desc: "Premium gives +50% Fame, double Learning Points, and 50% increased carrying capacity. Even one month helps enormously for beginners.", tags: [{ label: "Optional", cls: "tag-safe" }, { label: "+50% XP", cls: "" }] }
            ],
            milestone: { icon: "🏆", text: "Goal: Reach T4 Gathering Skill & earn your first 100,000 Silver!" }
        },
        id: {
            intro: { title: "🌱 Memulai Perjalananmu", desc: "Selamat datang di Albion Online! Ikuti langkah-langkah ini secara berurutan. Jangan melewati langkah — setiap langkah membangun dari yang sebelumnya." },
            steps: [
                { title: "Selesaikan Tutorial", desc: "Selesaikan tutorial starter island untuk mendapatkan gear pertamamu dan memahami mekanik dasar. Jangan terburu-buru — ada hadiah gratis yang menunggumu.", tags: [{ label: "Blue Zone", cls: "tag-safe" }, { label: "Gear Gratis", cls: "" }] },
                { title: "Pilih Kota Awal", desc: "Setiap kota terhubung ke biome yang berbeda. Pilih Thetford (Fiber), Lymhurst (Wood), Fort Sterling (Ore), Martlock (Stone), atau Bridgewatch (Hide) sesuai profesi yang ingin kamu fokuskan.", tags: [{ label: "Penting", cls: "tag-warn" }, { label: "Sesuai Biome", cls: "" }] },
                { title: "Leveling Satu Skill Gathering", desc: "Fokus pada SATU jenis resource saja. Jangan menyebar. Gunakan alat gathering setiap hari untuk mendapatkan Gathering Fame. Target Journeyman (T3) dulu.", tags: [{ label: "Fokus = Silver", cls: "tag-tip" }, { label: "T1 → T3", cls: "" }] },
                { title: "Gunakan Learning Points Bijak", desc: "Learning Points (LP) mempercepat leveling skill. Habiskan di skill gathering utama. Login setiap hari untuk mengumpulkan LP meski tidak main.", tags: [{ label: "Login Setiap Hari", cls: "tag-warn" }, { label: "LP = Kecepatan", cls: "tag-tip" }] },
                { title: "Jual Semua di Market", desc: "Selalu cek Black Market di Caerleon untuk harga terbaik. Jual resource mentah — jangan refine di awal karena menghabiskan silver.", tags: [{ label: "Black Market", cls: "" }, { label: "Raw > Refined", cls: "tag-tip" }] },
                { title: "Ambil Premium (Opsional tapi Membantu)", desc: "Premium memberi +50% Fame, double Learning Points, dan +50% kapasitas bawa. Bahkan satu bulan sangat membantu untuk pemula.", tags: [{ label: "Opsional", cls: "tag-safe" }, { label: "+50% XP", cls: "" }] }
            ],
            milestone: { icon: "🏆", text: "Target: Capai T4 Gathering Skill & raih 100.000 Silver pertamamu!" }
        }
    };

    const d = data[lang] || data.en;
    container.innerHTML = `
        <div class="guide-section-intro">
            <h3>${d.intro.title}</h3>
            <p>${d.intro.desc}</p>
        </div>
        <div class="guide-steps">
            ${d.steps.map((s, i) => `
                <div class="guide-step">
                    <div class="guide-step-number">${i + 1}</div>
                    <div class="guide-step-body">
                        <p class="guide-step-title">${s.title}</p>
                        <p class="guide-step-desc">${s.desc}</p>
                        <div class="guide-step-tags">
                            ${s.tags.map(tag => `<span class="guide-tag ${tag.cls}">${tag.label}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="guide-milestone">
            <span class="guide-milestone-icon">${d.milestone.icon}</span>
            <p class="guide-milestone-text">${d.milestone.text}</p>
        </div>
    `;
}

// ---- MID GAME GUIDE ----
function renderMidGameGuide(container) {
    const lang = currentLanguage;

    const data = {
        en: {
            intro: { title: "⚔️ Mid Game: T4 – T6 Grind", desc: "You've got the basics down. Now it's time to push into Yellow and Red Zones, upgrade your gear, and start making real silver." },
            steps: [
                { title: "Upgrade to T4 Gathering Gear", desc: "Buy T4 gathering equipment from the market. Each gear piece gives bonus yield for its matching resource. The investment pays for itself within hours.", tags: [{ label: "T4 Gear", cls: "" }, { label: "Yield Bonus", cls: "tag-tip" }] },
                { title: "Move Into Yellow Zones", desc: "Yellow zones have better resource nodes (T4-T5) and low PvP risk. Players can attack you but lose gear. Good middle ground for solo farmers.", tags: [{ label: "Yellow Zone", cls: "tag-warn" }, { label: "T4–T5 Resources", cls: "" }] },
                { title: "Start Using Pork Pie Food", desc: "Pork Pie food increases carry weight by 30%. Always eat before farming. The extra capacity per trip adds up to massive silver gains over time.", tags: [{ label: "Food Buff", cls: "tag-tip" }, { label: "+30% Carry", cls: "" }] },
                { title: "Farm Red Zones for T5–T6", desc: "Red zones are fully open PvP but have T5-T6 nodes. Farm during off-peak hours (late night UTC) to avoid gankers. Always have an escape route planned.", tags: [{ label: "Red Zone", cls: "tag-danger" }, { label: "T5–T6", cls: "" }, { label: "Off-Peak Hours", cls: "tag-warn" }] },
                { title: "Explore Roads of Avalon", desc: "Roads of Avalon are instanced zones accessible via portals. Excellent for mid-level players — resources respawn quickly and there are fewer players competing.", tags: [{ label: "Roads of Avalon", cls: "tag-tip" }, { label: "Less Competition", cls: "tag-safe" }] },
                { title: "Join a Guild", desc: "Mid-game is much easier with a guild. You get group protection while farming, access to guild island crafting, and tips from experienced players. Look for casual/farming guilds.", tags: [{ label: "Group Safety", cls: "tag-safe" }, { label: "Recommended", cls: "tag-tip" }] }
            ],
            milestone: { icon: "⚡", text: "Goal: Reach T6 Gathering Skill & earn 1,000,000 Silver. You're now a real farmer!" }
        },
        id: {
            intro: { title: "⚔️ Mid Game: Grind T4 – T6", desc: "Kamu sudah menguasai dasar-dasarnya. Sekarang saatnya masuk Yellow dan Red Zone, upgrade gear, dan mulai menghasilkan silver sungguhan." },
            steps: [
                { title: "Upgrade ke Gear Gathering T4", desc: "Beli equipment gathering T4 dari market. Setiap bagian gear memberikan bonus hasil untuk resource yang sesuai. Investasi ini terbayar dalam beberapa jam.", tags: [{ label: "Gear T4", cls: "" }, { label: "Bonus Hasil", cls: "tag-tip" }] },
                { title: "Masuk Yellow Zone", desc: "Yellow zone memiliki node resource lebih baik (T4-T5) dan risiko PvP rendah. Pemain bisa menyerangmu tapi kehilangan gear. Bagus untuk farmer solo.", tags: [{ label: "Yellow Zone", cls: "tag-warn" }, { label: "Resource T4–T5", cls: "" }] },
                { title: "Mulai Gunakan Makanan Pork Pie", desc: "Makanan Pork Pie meningkatkan berat bawaan 30%. Selalu makan sebelum farming. Kapasitas ekstra per perjalanan menghasilkan silver yang sangat besar seiring waktu.", tags: [{ label: "Buff Makanan", cls: "tag-tip" }, { label: "+30% Bawaan", cls: "" }] },
                { title: "Farm Red Zone untuk T5–T6", desc: "Red zone adalah PvP penuh tapi punya node T5-T6. Farm di jam sepi (tengah malam UTC) untuk menghindari ganker. Selalu rencanakan jalur kabur.", tags: [{ label: "Red Zone", cls: "tag-danger" }, { label: "T5–T6", cls: "" }, { label: "Jam Sepi", cls: "tag-warn" }] },
                { title: "Jelajahi Roads of Avalon", desc: "Roads of Avalon adalah zona instanced yang bisa diakses lewat portal. Sangat bagus untuk pemain mid-level — resource respawn cepat dan lebih sedikit persaingan.", tags: [{ label: "Roads of Avalon", cls: "tag-tip" }, { label: "Lebih Sepi", cls: "tag-safe" }] },
                { title: "Bergabung dengan Guild", desc: "Mid-game jauh lebih mudah dengan guild. Kamu dapat perlindungan grup saat farming, akses crafting guild island, dan tips dari pemain berpengalaman.", tags: [{ label: "Aman Bersama", cls: "tag-safe" }, { label: "Disarankan", cls: "tag-tip" }] }
            ],
            milestone: { icon: "⚡", text: "Target: Capai T6 Gathering Skill & raih 1.000.000 Silver. Kamu sudah jadi farmer sejati!" }
        }
    };

    const d = data[lang] || data.en;
    container.innerHTML = `
        <div class="guide-section-intro">
            <h3>${d.intro.title}</h3>
            <p>${d.intro.desc}</p>
        </div>
        <div class="guide-steps">
            ${d.steps.map((s, i) => `
                <div class="guide-step">
                    <div class="guide-step-number">${i + 1}</div>
                    <div class="guide-step-body">
                        <p class="guide-step-title">${s.title}</p>
                        <p class="guide-step-desc">${s.desc}</p>
                        <div class="guide-step-tags">
                            ${s.tags.map(tag => `<span class="guide-tag ${tag.cls}">${tag.label}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="guide-milestone">
            <span class="guide-milestone-icon">${d.milestone.icon}</span>
            <p class="guide-milestone-text">${d.milestone.text}</p>
        </div>
    `;
}

// ---- END GAME GUIDE ----
function renderEndGameGuide(container) {
    const lang = currentLanguage;

    const data = {
        en: {
            intro: { title: "💀 End Game: T7–T8 Black Zone Mastery", desc: "This is where the real silver lives — and the real danger. T8 farming in the Outlands can earn you millions per hour, but one mistake costs everything." },
            steps: [
                { title: "Reach Grandmaster (T7) Gathering", desc: "At T7, your yield bonus and tool efficiency make Black Zone farming truly profitable. Don't enter Black Zones below T7 gathering — it's not worth the risk.", tags: [{ label: "T7 Required", cls: "tag-warn" }, { label: "Yield Gate", cls: "" }] },
                { title: "Get Full T6–T8 Gathering Gear", desc: "Invest in a complete gathering set: Hood, Jacket, Boots, and a T7/T8 Gathering Tool. Each piece adds bonus yield. This gear is your income machine.", tags: [{ label: "Full Set Bonus", cls: "tag-tip" }, { label: "T6–T8 Gear", cls: "" }] },
                { title: "Use Invisibility Shrines Strategically", desc: "Invisibility Shrines let you travel unseen for 30 seconds. Use them to cross dangerous corridors and portal to deeper Black Zone maps. Learn shrine locations on each map.", tags: [{ label: "Shrines = Life", cls: "tag-safe" }, { label: "Memorize Routes", cls: "tag-tip" }] },
                { title: "Farm During Asia Off-Peak Hours", desc: "For Asia server, off-peak is 21:00–09:00 UTC (4 AM – 4 PM WIB). Solo Black Zone farming is significantly safer outside of prime time (13:00–15:00 UTC).", tags: [{ label: "21:00–09:00 UTC", cls: "tag-safe" }, { label: "Avoid 13:00–15:00 UTC", cls: "tag-danger" }] },
                { title: "Master the Escape Build", desc: "Always carry a Mount with high speed (Swiftclaw or better). Keep a Morgana's Tome or Invisibility Cape. One escape kit can save your entire T8 loadout worth millions.", tags: [{ label: "Swiftclaw Mount", cls: "" }, { label: "Always Escape Ready", cls: "tag-warn" }] },
                { title: "Learn T8 Black Zone Map Names", desc: "Bookmark the T8 map names for your resource (see the T8 Locations section on this site). Learn which portal clusters lead to them. Route knowledge = survival.", tags: [{ label: "Map Knowledge", cls: "tag-tip" }, { label: "T8 Locations Below", cls: "" }] }
            ],
            milestone: { icon: "💎", text: "End Goal: 5M+ Silver/hour farming T8 resources in Black Zones. You are now a legend." }
        },
        id: {
            intro: { title: "💀 End Game: Menguasai Black Zone T7–T8", desc: "Di sinilah silver sesungguhnya berada — dan bahaya sesungguhnya. Farming T8 di Outlands bisa menghasilkan jutaan per jam, tapi satu kesalahan bisa menghilangkan segalanya." },
            steps: [
                { title: "Capai Gathering Grandmaster (T7)", desc: "Di T7, bonus hasil dan efisiensi alatmu membuat farming Black Zone benar-benar menguntungkan. Jangan masuk Black Zone di bawah T7 — tidak sebanding dengan risikonya.", tags: [{ label: "T7 Wajib", cls: "tag-warn" }, { label: "Syarat Hasil", cls: "" }] },
                { title: "Dapatkan Gear Gathering T6–T8 Lengkap", desc: "Investasikan dalam set gathering lengkap: Hood, Jacket, Boots, dan Gathering Tool T7/T8. Setiap bagian menambah bonus hasil. Gear ini adalah mesin penghasilmu.", tags: [{ label: "Bonus Set Penuh", cls: "tag-tip" }, { label: "Gear T6–T8", cls: "" }] },
                { title: "Gunakan Invisibility Shrine Secara Strategis", desc: "Invisibility Shrine membuatmu tidak terlihat selama 30 detik. Gunakan untuk melewati koridor berbahaya dan portal ke peta Black Zone yang lebih dalam.", tags: [{ label: "Shrine = Nyawa", cls: "tag-safe" }, { label: "Hafal Rute", cls: "tag-tip" }] },
                { title: "Farm di Jam Sepi Asia Server", desc: "Untuk server Asia, jam sepi adalah 21:00–09:00 UTC (4 pagi – 4 sore WIB). Farming Black Zone solo jauh lebih aman di luar prime time (13:00–15:00 UTC).", tags: [{ label: "21:00–09:00 UTC", cls: "tag-safe" }, { label: "Hindari 13:00–15:00 UTC", cls: "tag-danger" }] },
                { title: "Kuasai Escape Build", desc: "Selalu bawa Mount dengan kecepatan tinggi (Swiftclaw atau lebih baik). Simpan Morgana's Tome atau Invisibility Cape. Satu kit kabur bisa menyelamatkan loadout T8-mu yang bernilai jutaan.", tags: [{ label: "Mount Swiftclaw", cls: "" }, { label: "Selalu Siap Kabur", cls: "tag-warn" }] },
                { title: "Hafal Nama Peta Black Zone T8", desc: "Bookmark nama peta T8 untuk resourcemu (lihat bagian T8 Locations di situs ini). Pelajari cluster portal mana yang mengarah ke sana. Pengetahuan rute = keselamatan.", tags: [{ label: "Pengetahuan Peta", cls: "tag-tip" }, { label: "Lihat T8 Locations", cls: "" }] }
            ],
            milestone: { icon: "💎", text: "Target Akhir: 5 Juta+ Silver/jam farming resource T8 di Black Zone. Kamu kini seorang legenda." }
        }
    };

    const d = data[lang] || data.en;
    container.innerHTML = `
        <div class="guide-section-intro">
            <h3>${d.intro.title}</h3>
            <p>${d.intro.desc}</p>
        </div>
        <div class="guide-steps">
            ${d.steps.map((s, i) => `
                <div class="guide-step">
                    <div class="guide-step-number">${i + 1}</div>
                    <div class="guide-step-body">
                        <p class="guide-step-title">${s.title}</p>
                        <p class="guide-step-desc">${s.desc}</p>
                        <div class="guide-step-tags">
                            ${s.tags.map(tag => `<span class="guide-tag ${tag.cls}">${tag.label}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="guide-milestone">
            <span class="guide-milestone-icon">${d.milestone.icon}</span>
            <p class="guide-milestone-text">${d.milestone.text}</p>
        </div>
    `;
}

// ---- PROFESSIONS GUIDE ----
function renderProfessionsGuide(container) {
    const lang = currentLanguage;

    const professions = [
        {
            id: 'gatherer',
            emoji: '🌾',
            name: { en: 'Gatherer (Fiber/Wood)', id: 'Penambang (Fiber/Wood)' },
            tagline: { en: "Harvest nature's bounty", id: 'Panen hasil alam' },
            stats: {
                en: [
                    { label: 'Resource Types', value: 'Fiber (Hemp), Wood (Log)', cls: '' },
                    { label: 'Best Biomes', value: 'Swamp (Thetford), Forest (Lymhurst)', cls: 'gold' },
                    { label: 'Profit (T8)', value: '2M – 4M Silver/hr', cls: 'green' },
                    { label: 'Competition', value: 'High (Fiber) / Medium (Wood)', cls: 'red' },
                    { label: 'Solo Viable?', value: 'Yes, with speed build', cls: 'green' },
                    { label: 'Difficulty', value: 3 }
                ],
                id: [
                    { label: 'Jenis Resource', value: 'Fiber (Hemp), Wood (Log)', cls: '' },
                    { label: 'Biome Terbaik', value: 'Swamp (Thetford), Forest (Lymhurst)', cls: 'gold' },
                    { label: 'Profit (T8)', value: '2 Juta – 4 Juta Silver/jam', cls: 'green' },
                    { label: 'Persaingan', value: 'Tinggi (Fiber) / Sedang (Wood)', cls: 'red' },
                    { label: 'Bisa Solo?', value: 'Ya, dengan build kecepatan', cls: 'green' },
                    { label: 'Kesulitan', value: 3 }
                ]
            },
            tips: {
                en: ['Farm near portal clusters during off-peak for fast rotation', 'Fiber respawns quickly — revisit same nodes in loops', 'Lymhurst wood nodes are less contested than Thetford fiber'],
                id: ['Farm dekat cluster portal di jam sepi untuk rotasi cepat', 'Fiber respawn cepat — kunjungi ulang node yang sama dalam lingkaran', 'Node kayu Lymhurst lebih sepi dari fiber Thetford']
            },
            difficulty: 60
        },
        {
            id: 'miner',
            emoji: '⛏️',
            name: { en: 'Miner (Ore)', id: 'Penambang (Ore)' },
            tagline: { en: 'Master of the depths', id: 'Penguasa kedalaman bumi' },
            stats: {
                en: [
                    { label: 'Resource Types', value: 'Ore (Iron/Titanium)', cls: '' },
                    { label: 'Best Biomes', value: 'Mountain (Fort Sterling)', cls: 'gold' },
                    { label: 'Profit (T8)', value: '1.5M – 3M Silver/hr', cls: 'green' },
                    { label: 'Competition', value: 'Medium — less than fiber', cls: 'purple' },
                    { label: 'Solo Viable?', value: 'Yes — stable income', cls: 'green' },
                    { label: 'Difficulty', value: 2 }
                ],
                id: [
                    { label: 'Jenis Resource', value: 'Ore (Iron/Titanium)', cls: '' },
                    { label: 'Biome Terbaik', value: 'Mountain (Fort Sterling)', cls: 'gold' },
                    { label: 'Profit (T8)', value: '1,5 Juta – 3 Juta Silver/jam', cls: 'green' },
                    { label: 'Persaingan', value: 'Sedang — lebih sepi dari fiber', cls: 'purple' },
                    { label: 'Bisa Solo?', value: 'Ya — penghasilan stabil', cls: 'green' },
                    { label: 'Kesulitan', value: 2 }
                ]
            },
            tips: {
                en: ['Ore nodes are heavier — always use Pork Pie food for extra carry', 'Check the Black Market daily — ore prices fluctuate significantly', 'Fort Sterling Black Zone has excellent T8 ore clusters'],
                id: ['Node ore lebih berat — selalu pakai Pork Pie untuk bawaan ekstra', 'Cek Black Market setiap hari — harga ore berfluktuasi signifikan', 'Black Zone Fort Sterling punya cluster ore T8 yang sangat bagus']
            },
            difficulty: 40
        },
        {
            id: 'skinner',
            emoji: '🐾',
            name: { en: 'Skinner (Hide)', id: 'Skinner (Ngulit)' },
            tagline: { en: 'Hunt beasts, wear their skin', id: 'Berburu hewan, pakai kulitnya' },
            stats: {
                en: [
                    { label: 'Resource Types', value: 'Hide (Thick/Robust/Pristine)', cls: '' },
                    { label: 'Best Biomes', value: 'Steppe (Bridgewatch)', cls: 'gold' },
                    { label: 'Profit (T8)', value: '2M – 5M Silver/hr', cls: 'green' },
                    { label: 'Competition', value: 'Variable — can be very low', cls: 'purple' },
                    { label: 'Solo Viable?', value: 'Excellent for solo play', cls: 'green' },
                    { label: 'Difficulty', value: 2 }
                ],
                id: [
                    { label: 'Jenis Resource', value: 'Hide (Thick/Robust/Pristine)', cls: '' },
                    { label: 'Biome Terbaik', value: 'Steppe (Bridgewatch)', cls: 'gold' },
                    { label: 'Profit (T8)', value: '2 Juta – 5 Juta Silver/jam', cls: 'green' },
                    { label: 'Persaingan', value: 'Bervariasi — bisa sangat sepi', cls: 'purple' },
                    { label: 'Bisa Solo?', value: 'Sangat cocok untuk solo', cls: 'green' },
                    { label: 'Kesulitan', value: 2 }
                ]
            },
            tips: {
                en: ['Hunt elder beasts — they have higher chance of T7/T8 hide drops', 'Bridgewatch portal zones have dense beast populations', 'Hide prices spike during guild war seasons — time your sales'],
                id: ['Berburu elder beasts — peluang lebih tinggi drop hide T7/T8', 'Zona portal Bridgewatch punya populasi hewan yang padat', 'Harga hide naik saat musim guild war — atur waktu penjualanmu']
            },
            difficulty: 35
        },
        {
            id: 'fisherman',
            emoji: '🎣',
            name: { en: 'Fisherman', id: 'Nelayan (Memancing)' },
            tagline: { en: 'Patience is your weapon', id: 'Kesabaran adalah senjatamu' },
            stats: {
                en: [
                    { label: 'Resource Types', value: 'All fish types + rare items', cls: '' },
                    { label: 'Best Locations', value: 'Hidden lakes in Black Zones', cls: 'gold' },
                    { label: 'Profit (Mastered)', value: '1M – 6M Silver/hr', cls: 'green' },
                    { label: 'Competition', value: 'Very Low — most players ignore it', cls: 'green' },
                    { label: 'Solo Viable?', value: 'Perfect for solo & AFK play', cls: 'green' },
                    { label: 'Difficulty', value: 1 }
                ],
                id: [
                    { label: 'Jenis Resource', value: 'Semua jenis ikan + item langka', cls: '' },
                    { label: 'Lokasi Terbaik', value: 'Danau tersembunyi di Black Zone', cls: 'gold' },
                    { label: 'Profit (Ahli)', value: '1 Juta – 6 Juta Silver/jam', cls: 'green' },
                    { label: 'Persaingan', value: 'Sangat Rendah — diabaikan banyak pemain', cls: 'green' },
                    { label: 'Bisa Solo?', value: 'Sempurna untuk solo & AFK', cls: 'green' },
                    { label: 'Kesulitan', value: 1 }
                ]
            },
            tips: {
                en: ['Equip a full fishing set for bonus fish quality — higher tier fish = more silver', 'Black Zone fishing gives rare fish and occasionally valuable items', 'Fish during prime time when other farmers avoid Black Zones — fishing spots are safer'],
                id: ['Pakai set memancing lengkap untuk bonus kualitas ikan — ikan tier tinggi = lebih banyak silver', 'Memancing di Black Zone memberi ikan langka dan kadang item berharga', 'Pancing saat prime time ketika farmer lain menghindari Black Zone — spot mancing lebih aman']
            },
            difficulty: 20
        },
        {
            id: 'stone_cutter',
            emoji: '🪨',
            name: { en: 'Stone Cutter', id: 'Penambang Batu' },
            tagline: { en: 'The overlooked goldmine', id: 'Tambang emas yang terlupakan' },
            stats: {
                en: [
                    { label: 'Resource Types', value: 'Limestone, Sandstone, Granite', cls: '' },
                    { label: 'Best Biomes', value: 'Highland (Martlock)', cls: 'gold' },
                    { label: 'Profit (T8)', value: '1M – 2.5M Silver/hr', cls: 'green' },
                    { label: 'Competition', value: 'Very Low — most players avoid stone', cls: 'green' },
                    { label: 'Solo Viable?', value: 'Easiest solo profession', cls: 'green' },
                    { label: 'Difficulty', value: 1 }
                ],
                id: [
                    { label: 'Jenis Resource', value: 'Limestone, Sandstone, Granite', cls: '' },
                    { label: 'Biome Terbaik', value: 'Highland (Martlock)', cls: 'gold' },
                    { label: 'Profit (T8)', value: '1 Juta – 2,5 Juta Silver/jam', cls: 'green' },
                    { label: 'Persaingan', value: 'Sangat Rendah — kebanyakan pemain menghindari batu', cls: 'green' },
                    { label: 'Bisa Solo?', value: 'Profesi solo termudah', cls: 'green' },
                    { label: 'Kesulitan', value: 1 }
                ]
            },
            tips: {
                en: ['Stone is great for new players — low risk, stable income', 'Martlock portal zones near Highland biome for consistent T7-T8 nodes', 'Stone is used in massive quantities for building — demand is always high'],
                id: ['Batu bagus untuk pemain baru — risiko rendah, penghasilan stabil', 'Zona portal Martlock dekat biome Highland untuk node T7-T8 yang konsisten', 'Batu digunakan dalam jumlah besar untuk konstruksi — permintaan selalu tinggi']
            },
            difficulty: 20
        },
        {
            id: 'combat_gatherer',
            emoji: '🗡️',
            name: { en: 'Combat Gatherer', id: 'Gatherer Tempur' },
            tagline: { en: 'Fight & farm simultaneously', id: 'Bertarung & farm sekaligus' },
            stats: {
                en: [
                    { label: 'Playstyle', value: 'PvE + Gathering hybrid', cls: '' },
                    { label: 'Best Use', value: 'Dungeon loot + surface gathering', cls: 'gold' },
                    { label: 'Profit (T8)', value: '3M – 8M Silver/hr (high skill)', cls: 'green' },
                    { label: 'Competition', value: 'Medium — requires combat skill', cls: 'purple' },
                    { label: 'Solo Viable?', value: 'Very risky — only for experienced', cls: 'red' },
                    { label: 'Difficulty', value: 5 }
                ],
                id: [
                    { label: 'Gaya Bermain', value: 'Hybrid PvE + Gathering', cls: '' },
                    { label: 'Penggunaan Terbaik', value: 'Loot dungeon + gathering permukaan', cls: 'gold' },
                    { label: 'Profit (T8)', value: '3 Juta – 8 Juta Silver/jam (skill tinggi)', cls: 'green' },
                    { label: 'Persaingan', value: 'Sedang — butuh skill bertarung', cls: 'purple' },
                    { label: 'Bisa Solo?', value: 'Sangat berisiko — hanya untuk yang berpengalaman', cls: 'red' },
                    { label: 'Kesulitan', value: 5 }
                ]
            },
            tips: {
                en: ['Requires mastery of both combat and gathering gear — expensive to setup', 'Radiant Chest dungeons near gathering spots are the most efficient combo', 'Not recommended for players below 3 months experience'],
                id: ['Butuh penguasaan gear tempur dan gathering — setup mahal', 'Dungeon Radiant Chest dekat spot gathering adalah kombinasi paling efisien', 'Tidak disarankan untuk pemain di bawah 3 bulan pengalaman']
            },
            difficulty: 90
        }
    ];

    const headerText = lang === 'id' ? 'Pilih Profesimu' : 'Choose Your Profession';
    const subText = lang === 'id' ? 'Klik kartu untuk melihat detail lengkap setiap profesi.' : 'Click a card to see full details for each profession.';
    const tipsLabel = lang === 'id' ? 'Tips Pro' : 'Pro Tips';
    const difficultyLabel = lang === 'id' ? 'Kesulitan' : 'Difficulty';
    const difficultyLevels = ['', lang === 'id' ? 'Sangat Mudah' : 'Very Easy', lang === 'id' ? 'Mudah' : 'Easy', lang === 'id' ? 'Sedang' : 'Medium', lang === 'id' ? 'Sulit' : 'Hard', lang === 'id' ? 'Sangat Sulit' : 'Very Hard'];

    container.innerHTML = `
        <div class="guide-section-intro">
            <h3>🎯 ${headerText}</h3>
            <p>${subText}</p>
        </div>
        <div class="profession-grid">
            ${professions.map(p => {
                const stats = p.stats[lang] || p.stats.en;
                const tips = p.tips[lang] || p.tips.en;
                const name = p.name[lang] || p.name.en;
                const tagline = p.tagline[lang] || p.tagline.en;
                const diffLevel = stats.find(s => s.label === 'Difficulty' || s.label === 'Kesulitan');
                const diffNum = diffLevel ? diffLevel.value : 3;
                const diffName = difficultyLevels[diffNum] || 'Medium';

                return `
                    <div class="profession-card" data-profession="${p.id}" onclick="toggleProfession('${p.id}')">
                        <div class="profession-card-header">
                            <div class="profession-emoji">${p.emoji}</div>
                            <div>
                                <p class="profession-name">${name}</p>
                                <p class="profession-tagline">${tagline}</p>
                            </div>
                        </div>
                        <div class="profession-detail">
                            <div class="profession-detail-inner">
                                ${stats.filter(s => s.label !== 'Difficulty' && s.label !== 'Kesulitan').map(s => `
                                    <div class="profession-stat-row">
                                        <span class="profession-stat-label">${s.label}</span>
                                        <span class="profession-stat-value ${s.cls}">${s.value}</span>
                                    </div>
                                `).join('')}
                                <div class="profession-stat-row">
                                    <span class="profession-stat-label">${difficultyLabel}</span>
                                    <div class="difficulty-bar-wrap" style="flex:1; margin-left:1rem;">
                                        <div class="difficulty-bar">
                                            <div class="difficulty-bar-fill" style="width:${p.difficulty}%"></div>
                                        </div>
                                        <span class="difficulty-label">${diffName}</span>
                                    </div>
                                </div>
                                <p class="profession-tips-title">${tipsLabel}</p>
                                ${tips.map(tip => `<div class="profession-tip-item">${tip}</div>`).join('')}
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function toggleProfession(id) {
    const card = document.querySelector(`.profession-card[data-profession="${id}"]`);
    if (!card) return;
    const isActive = card.classList.contains('active');
    document.querySelectorAll('.profession-card').forEach(c => c.classList.remove('active'));
    if (!isActive) card.classList.add('active');
}

// ============================================
// GUIDE PANEL EVENT LISTENERS — init
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Open buttons
    document.getElementById('guidePanelBtn').addEventListener('click', openGuidePanel);
    const heroGuideBtn = document.getElementById('heroGuideBtn');
    if (heroGuideBtn) heroGuideBtn.addEventListener('click', openGuidePanel);

    // Close
    document.getElementById('guideCloseBtn').addEventListener('click', closeGuidePanel);

    // Close on overlay click (outside panel)
    document.getElementById('guideOverlay').addEventListener('click', (e) => {
        if (e.target === document.getElementById('guideOverlay')) closeGuidePanel();
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeGuidePanel();
    });

    // Tab switching
    document.querySelectorAll('.guide-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            switchGuideTab(btn.getAttribute('data-tab'));
        });
    });
});
