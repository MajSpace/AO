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
