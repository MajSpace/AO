// ============================================
// TRANSLATION SYSTEM
// ============================================
let translations = { en: {}, id: {} };
let currentLanguage = localStorage.getItem('language') || 'en';

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
        if (value && typeof value === 'object' && k in value) value = value[k];
        else return defaultValue;
    }
    return value || defaultValue;
}

function updatePageLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const text = t(key);
        if (text && typeof text === 'string') element.textContent = text;
    });
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === currentLanguage) btn.classList.add('active');
    });
    
    renderBiomes();
    renderTiers();
    renderT8Maps();
    renderProTips();
    renderGatheringBuilds();
    renderEventSchedule();
    
    // Refresh open guide if any
    const activeGuide = document.body.getAttribute('data-active-guide');
    if (activeGuide) openFullGuide(activeGuide);
}

// ============================================
// FULL VIEW GUIDE & SIDEBAR LOGIC
// ============================================
function initSidebar() {
    const toggleBtn = document.getElementById('menuToggleBtn');
    const closeBtn = document.getElementById('closeDrawerBtn');
    const drawer = document.getElementById('sidebarDrawer');
    const overlay = document.getElementById('sidebarOverlay');

    function openDrawer() { drawer.classList.add('open'); overlay.classList.add('show'); }
    function closeDrawer() { drawer.classList.remove('open'); overlay.classList.remove('show'); }

    toggleBtn.addEventListener('click', openDrawer);
    closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    document.querySelectorAll('.drawer-link-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const guideKey = e.target.getAttribute('data-guide');
            closeDrawer();
            openFullGuide(guideKey);
        });
    });

    document.getElementById('backToHomeBtn').addEventListener('click', closeFullGuide);
}

function openFullGuide(guideKey) {
    const data = translations[currentLanguage]?.detailed_guides?.[guideKey];
    if (!data) return;

    document.body.setAttribute('data-active-guide', guideKey);
    const contentBox = document.getElementById('dynamicGuideContent');
    
    let html = `<h2>${data.title}</h2><p>${data.description}</p>`;
    
    if (guideKey === 'equipment_progression' && data.nodes) {
        html += '<div class="equipment-timeline">';
        data.nodes.forEach(node => {
            let itemsHtml = node.items.map(item => `<li>${item}</li>`).join('');
            html += `
                <div class="timeline-node">
                    <h4><span class="badge-tier">${node.tier}</span> ${node.title}</h4>
                    <div class="node-focus"><strong>Focus:</strong> ${node.focus}</div>
                    <ul>${itemsHtml}</ul>
                </div>
            `;
        });
        html += '</div>';
    } else if (data.sections) {
        data.sections.forEach(sec => {
            html += `
                <div class="guide-section-block">
                    <h3>${sec.heading}</h3>
                    <p>${sec.content}</p>
                </div>
            `;
        });
    }

    contentBox.innerHTML = html;

    document.getElementById('homeViewContainer').classList.add('hidden');
    document.getElementById('fullGuideViewContainer').classList.remove('hidden');
    window.scrollTo(0, 0);
}

function closeFullGuide() {
    document.body.removeAttribute('data-active-guide');
    document.getElementById('homeViewContainer').classList.remove('hidden');
    document.getElementById('fullGuideViewContainer').classList.add('hidden');
    window.scrollTo(0, 0);
}

// ============================================
// DATA & RENDERING FUNCTIONS
// ============================================
function getBiomeData() {
    return [
        { name: t('biome_names.swamp'), city: 'Thetford', primaryResource: 'Fiber', secondaryResource: 'Wood', tertiaryResource: 'Hide', image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663244214689/CP2xbP6jZ7YquxKLmra3zY/biome-forest-GU38UQaqucTXFdpCjtksAA.webp', description: t('biome_descriptions.swamp'), color: '#5a189a' },
        { name: t('biome_names.forest'), city: 'Lymhurst', primaryResource: 'Wood', secondaryResource: 'Hide', tertiaryResource: 'Stone', image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663244214689/CP2xbP6jZ7YquxKLmra3zY/biome-forest-GU38UQaqucTXFdpCjtksAA.webp', description: t('biome_descriptions.forest'), color: '#2d5016' },
        { name: t('biome_names.mountain'), city: 'Fort Sterling', primaryResource: 'Ore', secondaryResource: 'Stone', tertiaryResource: 'Fiber', image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663244214689/CP2xbP6jZ7YquxKLmra3zY/biome-mountain-njbLb46H7FGuykLTKS9wMS.webp', description: t('biome_descriptions.mountain'), color: '#4a5568' },
        { name: t('biome_names.highland'), city: 'Martlock', primaryResource: 'Stone', secondaryResource: 'Ore', tertiaryResource: 'Wood', image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663244214689/CP2xbP6jZ7YquxKLmra3zY/biome-mountain-njbLb46H7FGuykLTKS9wMS.webp', description: t('biome_descriptions.highland'), color: '#8b6914' },
        { name: t('biome_names.steppe'), city: 'Bridgewatch', primaryResource: 'Hide', secondaryResource: 'Fiber', tertiaryResource: 'Ore', image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663244214689/CP2xbP6jZ7YquxKLmra3zY/biome-steppe-Hzd9bGzAkigiRx6SatXPpd.webp', description: t('biome_descriptions.steppe'), color: '#c9a227' }
    ];
}

function renderBiomes() {
    const grid = document.getElementById('biomesGrid');
    if (!grid) return; grid.innerHTML = '';
    getBiomeData().forEach(biome => {
        grid.innerHTML += `
            <div class="biome-card" style="border-color: ${biome.color}">
                <div class="biome-image">
                    <img src="${biome.image}" alt="${biome.name}" loading="lazy">
                    <div class="biome-image-overlay">
                        <div class="biome-name">${biome.name}</div>
                        <div class="biome-city">${biome.city}</div>
                    </div>
                </div>
                <div class="biome-content">
                    <p>${biome.description}</p>
                    <div class="resource-label">${t('biomes.primaryResource')}</div>
                    <span class="badge badge-primary">${biome.primaryResource}</span>
                    <div class="resource-label">${t('biomes.secondaryResource')} / ${t('biomes.tertiaryResource')}</div>
                    <span class="badge badge-outline">${biome.secondaryResource}</span>
                    <span class="badge badge-outline">${biome.tertiaryResource}</span>
                </div>
            </div>`;
    });
}

function getTierData() {
    return [
        { tier: 1, location: t('tiers.tier1.location'), zoneType: t('tiers.tier1.zoneType'), danger: 'safe', tips: t('tiers.tier1.tips') || [] },
        { tier: 4, location: t('tiers.tier4.location'), zoneType: t('tiers.tier4.zoneType'), danger: 'moderate', tips: t('tiers.tier4.tips') || [] },
        { tier: 5, location: t('tiers.tier5.location'), zoneType: t('tiers.tier5.zoneType'), danger: 'moderate', tips: t('tiers.tier5.tips') || [] },
        { tier: 6, location: t('tiers.tier6.location'), zoneType: t('tiers.tier6.zoneType'), danger: 'dangerous', tips: t('tiers.tier6.tips') || [] },
        { tier: 7, location: t('tiers.tier7.location'), zoneType: t('tiers.tier7.zoneType'), danger: 'dangerous', tips: t('tiers.tier7.tips') || [] },
        { tier: 8, location: t('tiers.tier8.location'), zoneType: t('tiers.tier8.zoneType'), danger: 'dangerous', tips: t('tiers.tier8.tips') || [] }
    ];
}

function renderTiers() {
    const container = document.getElementById('tiersContainer');
    if (!container) return; container.innerHTML = '';
    getTierData().forEach(tier => {
        let tipsHTML = Array.isArray(tier.tips) ? tier.tips.map(tip => `<li>${tip}</li>`).join('') : '';
        const badgeClass = tier.danger === 'safe' ? 'badge-safe' : tier.danger === 'moderate' ? 'badge-moderate' : 'badge-dangerous';
        container.innerHTML += `
            <div class="tier-card">
                <div class="tier-header">
                    <div>
                        <div class="tier-title">Tier ${tier.tier}</div>
                        <div class="tier-location">${tier.location}</div>
                    </div>
                    <div class="tier-badges">
                        <span class="badge badge-outline">${tier.zoneType}</span>
                        <span class="badge ${badgeClass}">${tier.danger.toUpperCase()}</span>
                    </div>
                </div>
                <ul class="tips-list">${tipsHTML}</ul>
            </div>`;
    });
}

function renderT8Maps() {
    const grid = document.getElementById('t8MapsGrid');
    if (!grid) return; grid.innerHTML = '';
    const maps = {
        [t('t8Maps.fiber')]: ['Willow Wood', 'Drownfield Mire', 'Wispwhisper Marsh', 'Nightcreak Marsh'],
        [t('t8Maps.wood')]: ['Whitebank Wall', 'Whitebank Ridge', 'Highbole Glen', 'Timberscar Dell'],
        [t('t8Maps.hide')]: ['Sandmount Ascent', 'Sandrift Dunes', 'Dryvein Oasis', 'Sandmount Desert'],
        [t('t8Maps.stone')]: ['Everwinter Peak', 'Frostpeak Ascent', 'Whitepeak Tundra', 'Glacierfall Valley'],
        [t('t8Maps.ore')]: ['Blackthorn Quarry', 'Shaleheath Hills', 'Birken Fell', 'Munten Fell']
    };
    Object.entries(maps).forEach(([res, list]) => {
        grid.innerHTML += `<div class="t8-card"><h3>${res}</h3><ul class="t8-maps-list">${list.map(m => `<li>${m}</li>`).join('')}</ul></div>`;
    });
}

function renderGatheringBuilds() {
    const grid = document.getElementById('buildsGrid');
    if (!grid) return; grid.innerHTML = '';
    const builds = [
        { name: t('builds.solo'), type: t('builds.typeSolo'), items: ['Assassin Jacket', 'Assassin Boots', 'Assassin Hood', 'Gathering Tool T8', 'Satchel / Pork Pie'] },
        { name: t('builds.tank'), type: t('builds.typeGroup'), items: ['Knight Armor', 'Knight Boots', 'Knight Helm', 'Gathering Tool T8', 'Bag / Pork Pie'] },
        { name: t('builds.balanced'), type: t('builds.typeVersatile'), items: ['Cleric Robe', 'Cleric Sandals', 'Cleric Cowl', 'Gathering Tool T8', 'Satchel / Pork Pie'] }
    ];
    builds.forEach(b => {
        grid.innerHTML += `<div class="build-card"><div class="build-name">${b.name}</div><div style="font-size:0.85rem; color:#a8a8c0; margin-bottom:1rem;">${b.type}</div><div>${b.items.map(i => `<div class="build-item">${i}</div>`).join('')}</div></div>`;
    });
}

function renderEventSchedule() {
    const grid = document.getElementById('eventsGrid');
    if (!grid) return; grid.innerHTML = '';
    const events = [
        { time: t('events.worldBoss'), title: t('events.worldBoss'), desc: t('events.worldBossDesc'), note: t('events.worldBossNote') },
        { time: '13:00-15:00 UTC', title: t('events.primeTime'), desc: t('events.primeTimeDesc'), note: t('events.primeTimeNote') },
        { time: 'Random Peak', title: t('events.dangerWindow'), desc: t('events.dangerWindowDesc'), note: t('events.dangerWindowNote') },
        { time: '21:00-09:00 UTC', title: t('events.lowActivity'), desc: t('events.lowActivityDesc'), note: t('events.lowActivityNote') }
    ];
    events.forEach(e => {
        grid.innerHTML += `<div class="event-card"><div class="event-time">${e.time}</div><div style="font-weight:bold; margin-bottom:0.5rem">${e.title}</div><div style="font-size:0.9rem; color:#e8e8f0;">${e.desc}</div><div class="event-note">${e.note}</div></div>`;
    });
}

function renderProTips() {
    ['efficiency', 'safety', 'profitability'].forEach(cat => {
        const el = document.getElementById(`${cat}Tips`);
        if (el) {
            const tips = t(`proTips.${cat}.tips`) || [];
            el.innerHTML = Array.isArray(tips) ? tips.map(tip => `<p>• ${tip}</p>`).join('') : '';
        }
    });
}

function updatePrimeTimeTracker() {
    const now = new Date();
    const utcHours = now.getUTCHours();
    document.getElementById('utcTime').textContent = `${String(utcHours).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')} UTC`;
    
    const localHours = now.getHours();
    const ampm = localHours >= 12 ? 'PM' : 'AM';
    document.getElementById('localTime').textContent = `${String(localHours % 12 || 12).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} ${ampm}`;
    
    let level = 'safe', status = t('tracker.safeStatus');
    if (utcHours >= 13 && utcHours < 15) { level = 'extreme'; status = t('tracker.extremeStatus'); }
    else if ((utcHours >= 9 && utcHours < 13) || (utcHours >= 15 && utcHours < 21)) { level = 'moderate'; status = t('tracker.moderateStatus'); }
    
    const dangerEl = document.getElementById('dangerLevel');
    if (dangerEl) { dangerEl.textContent = level.toUpperCase(); dangerEl.className = `danger-level ${level}`; }
    const statusEl = document.getElementById('statusInfo');
    if (statusEl) statusEl.textContent = status;
}

document.addEventListener('DOMContentLoaded', () => {
    loadTranslations().then(() => {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                currentLanguage = btn.getAttribute('data-lang');
                localStorage.setItem('language', currentLanguage);
                updatePageLanguage();
            });
        });
        
        const startBtn = document.getElementById('startFarmingBtn');
        if (startBtn) startBtn.addEventListener('click', () => {
            document.querySelector('.main-content').scrollIntoView({ behavior: 'smooth' });
        });
        
        initSidebar();
        updatePrimeTimeTracker();
        setInterval(updatePrimeTimeTracker, 60000);
    });
});
