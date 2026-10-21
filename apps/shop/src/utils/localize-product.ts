/**
 * Returns locale-appropriate field from a product.
 * Falls back to the default field if no translation exists.
 * Hardcoded translation map for mock data.
 */
const enTranslations: Record<string, Record<string, string>> = {
    'zyn-cool-mint-6mg': {
        title: 'ZYN Cool Mint 6mg',
        description: 'ZYN Cool Mint — refreshing mint nicotine pouch, smooth, smoke-free, odor-free. 6mg/pouch, 15 pouches/can.',
        'meta.title': 'ZYN Cool Mint 6mg | SnusSaigon',
        'meta.description': 'Buy ZYN Cool Mint nicotine pouches — authentic, fast delivery in HCMC',
        flavor: 'Mint (Cool Mint)',
        origin: 'USA',
        nicotineType: 'Pure nicotine (tobacco-derived)',
        ingredients: 'Water, sweeteners (Xylitol, Acesulfame K), nicotine, natural mint flavor, stabilizers (E460, E463), salt (NaCl, Na2CO3)',
    },
    'zyn-spearmint-6mg': {
        description: 'ZYN Spearmint — smooth green mint nicotine pouch, smoke-free, odor-free. 6mg/pouch, 15 pouches/can.',
        'meta.title': 'ZYN Spearmint 6mg | SnusSaigon',
        'meta.description': 'Buy ZYN Spearmint nicotine pouches — authentic, fast delivery in HCMC',
        flavor: 'Green Mint (Spearmint)',
        origin: 'USA',
        nicotineType: 'Pure nicotine (tobacco-derived)',
        ingredients: 'Water, sweeteners (Xylitol, Acesulfame K), nicotine, spearmint flavor, stabilizers (E460, E463), salt (NaCl, Na2CO3)',
    },
    'zyn-wintergreen-6mg': {
        description: 'ZYN Wintergreen — deep mint flavor, cool and refreshing. 6mg/pouch, 15 pouches/can.',
        'meta.title': 'ZYN Wintergreen 6mg | SnusSaigon',
        'meta.description': 'Buy ZYN Wintergreen nicotine pouches — authentic, fast delivery',
        flavor: 'Wintergreen Mint',
        origin: 'USA',
        nicotineType: 'Pure nicotine (tobacco-derived)',
        ingredients: 'Water, sweeteners (Xylitol, Acesulfame K), nicotine, wintergreen flavor, stabilizers (E460, E463), salt (NaCl, Na2CO3)',
    },
    'velo-freeze-10mg': {
        description: 'VELO Freeze — intense mint, high nicotine 10mg for experienced users. 20 pouches/can.',
        'meta.title': 'VELO Freeze 10mg | SnusSaigon',
        'meta.description': 'Buy VELO Freeze nicotine pouches — authentic, high nicotine',
        flavor: 'Intense Mint (Freeze)',
        origin: 'Sweden',
        nicotineType: 'Pure nicotine (tobacco-free)',
        ingredients: 'Water, plant fibers, sweeteners (Xylitol), nicotine, mint flavor, stabilizers (E460), salt',
    },
    'velo-mango-6mg': {
        description: 'VELO Mango — sweet tropical mango flavor, smooth. 6mg/pouch, 20 pouches/can.',
        'meta.title': 'VELO Mango 6mg | SnusSaigon',
        'meta.description': 'Buy VELO Mango nicotine pouches — authentic, fruity flavor',
        flavor: 'Mango',
        origin: 'Sweden',
        nicotineType: 'Pure nicotine (tobacco-free)',
        ingredients: 'Water, plant fibers, sweeteners (Xylitol), nicotine, natural mango flavor, stabilizers (E460), salt',
    },
    'velo-berry-6mg': {
        description: 'VELO Berry — Nordic berry flavor, sweet and tart, refreshing. 6mg/pouch, 20 pouches/can.',
        'meta.title': 'VELO Berry 6mg | SnusSaigon',
        'meta.description': 'Buy VELO Berry nicotine pouches — authentic, berry flavor',
        flavor: 'Nordic Berry',
        origin: 'Sweden',
        nicotineType: 'Pure nicotine (tobacco-free)',
        ingredients: 'Water, plant fibers, sweeteners (Xylitol), nicotine, berry flavor, stabilizers (E460), salt',
    },
    'killa-cold-mint-16mg': {
        description: 'KILLA Cold Mint — extra strong 16mg, double cold mint sensation. 20 pouches/can.',
        'meta.title': 'KILLA Cold Mint 16mg | SnusSaigon',
        'meta.description': 'Buy KILLA Cold Mint extra strong snus — authentic',
        flavor: 'Cold Mint',
        origin: 'Sweden',
        nicotineType: 'Pure nicotine (tobacco-free)',
        ingredients: 'Water, plant fibers, sweeteners, nicotine (16mg/pouch), mint flavor, stabilizers, salt',
    },
    'killa-watermelon-12mg': {
        description: 'KILLA Watermelon — sweet watermelon flavor, strong 12mg nicotine. 20 pouches/can.',
        'meta.title': 'KILLA Watermelon 12mg | SnusSaigon',
        'meta.description': 'Buy KILLA Watermelon snus — authentic',
        flavor: 'Watermelon',
        origin: 'Sweden',
        nicotineType: 'Pure nicotine (tobacco-free)',
        ingredients: 'Water, plant fibers, sweeteners, nicotine (12mg/pouch), watermelon flavor, stabilizers, salt',
    },
    'cuba-white-16mg': {
        description: 'Cuba White — traditional Swedish-style snus, high nicotine 16mg, odorless. 20 pouches/can.',
        'meta.title': 'Cuba White 16mg | SnusSaigon',
        'meta.description': 'Buy Cuba White snus — authentic Swedish snus',
        flavor: 'White Tobacco',
        origin: 'Russia',
        nicotineType: 'Pure nicotine (tobacco-free)',
        ingredients: 'Water, plant fibers, sweeteners, nicotine (16mg/pouch), white tobacco flavor, stabilizers, salt',
    },
    'siberia-80-20mg': {
        description: 'Siberia -80C — one of the strongest snus in the world, 20mg nicotine. 20 pouches/can.',
        'meta.title': 'Siberia -80C 20mg | SnusSaigon',
        'meta.description': 'Buy Siberia -80C extra strong snus — authentic',
        flavor: 'Ultra Cold Mint (-80C)',
        origin: 'Sweden',
        nicotineType: 'Pure nicotine (tobacco-free)',
        ingredients: 'Water, plant fibers, sweeteners, nicotine (20mg/pouch), ultra cold mint flavor, stabilizers, salt',
    },
    'skruf-fresh-white-12mg': {
        description: 'Skruf Fresh White — established Swedish brand, clean mint, 12mg. 24 pouches/can.',
        'meta.title': 'Skruf Fresh White 12mg | SnusSaigon',
        'meta.description': 'Buy Skruf Fresh White snus — authentic',
        flavor: 'Fresh Mint',
        origin: 'Sweden',
        nicotineType: 'Pure nicotine (tobacco-free)',
        ingredients: 'Water, plant fibers, sweeteners (Xylitol), nicotine (12mg/pouch), fresh mint flavor, peppermint oil, stabilizers, salt',
    },
    'odens-cold-dry-16mg': {
        description: 'Odens Cold Dry — Swedish snus, intense mint flavor, 16mg nicotine, ultra dry. 20 pouches/can.',
        'meta.title': 'Odens Cold Dry 16mg | SnusSaigon',
        'meta.description': 'Buy Odens Cold Dry snus — authentic',
        flavor: 'Cold Dry Mint',
        origin: 'Sweden',
        nicotineType: 'Pure nicotine (tobacco-free)',
        ingredients: 'Water, plant fibers, sweeteners, nicotine (16mg/pouch), dry mint flavor, stabilizers, salt',
    },
    'general-white-14mg': {
        description: 'General White — legendary Swedish snus, traditional tobacco flavor with bergamot orange. 24 pouches/can.',
        'meta.title': 'General White 14mg | SnusSaigon',
        'meta.description': 'Buy General White snus — authentic Swedish snus',
        flavor: 'Traditional Tobacco (White)',
        origin: 'Sweden',
        nicotineType: 'Pure nicotine (tobacco-derived)',
        ingredients: 'Water, plant fibers, sweeteners, nicotine (14mg/pouch), traditional tobacco flavor, bergamot oil, stabilizers, salt',
    },
    'nick-johnny-green-ice-12mg': {
        description: 'Nick & Johnny Green Ice — green mint combined with rich tobacco. 24 pouches/can.',
        'meta.title': 'Nick & Johnny Green Ice 12mg | SnusSaigon',
        'meta.description': 'Buy Nick & Johnny Green Ice snus — authentic',
        flavor: 'Green Ice Mint',
        origin: 'Sweden',
        nicotineType: 'Pure nicotine (tobacco-free)',
        ingredients: 'Water, plant fibers, sweeteners, nicotine (12mg/pouch), green mint flavor, peppermint oil, stabilizers, salt',
    },
    'lundgrens-skane-10mg': {
        description: 'Lundgrens Skane — premium Swedish snus, wild berry and herb flavor. 24 pouches/can, perforated pouch.',
        'meta.title': 'Lundgrens Skane 10mg | SnusSaigon',
        'meta.description': 'Buy Lundgrens Skane premium snus — authentic',
        flavor: 'Nordic Herbs (Skane)',
        origin: 'Sweden',
        nicotineType: 'Pure nicotine (tobacco-free)',
        ingredients: 'Water, plant fibers, sweeteners, nicotine (10mg/pouch), Nordic herb flavor, pine oil, stabilizers, salt',
    },
};

export function localizeProduct<T extends Record<string, any>>(
    product: T,
    locale: string
): T {
    const base = { ...product } as Record<string, any>;

    // ── Map description → articleBody ───────────────────────────────────────────
    if (!base.articleBody && base.description) {
        base.articleBody = base.description;
    }

    // ── Map CMS field names → product-tabs expected names ───────────────────────
    // portion_count → pouchCount
    if (base.pouchCount == null && base.portion_count != null) {
        base.pouchCount = base.portion_count;
    }
    // origin_country → origin
    if (!base.origin && base.origin_country) {
        base.origin = base.origin_country;
    }
    // Compute strength label from nicotine_mg if not set
    if (!base.strength && base.nicotine_mg != null) {
        const mg = Number(base.nicotine_mg);
        if (mg <= 4)       base.strength = 'Light';
        else if (mg <= 8)  base.strength = 'Normal';
        else if (mg <= 12) base.strength = 'Strong';
        else if (mg <= 20) base.strength = 'Extra Strong';
        else               base.strength = 'Ultra Strong';
    }

    // ── Map gallery first image → thumbnail (for product cards) ────────────────
    if (!base.thumbnail) {
        const g = base.gallery;
        if (Array.isArray(g) && g.length > 0) {
            const img = g[0];
            if (typeof img === 'object' && img !== null && img.url) {
                base.thumbnail = img.url;
            }
        }
        // Also check variants[0].gallery
        if (!base.thumbnail) {
            const vg = base.variants?.[0]?.gallery;
            if (Array.isArray(vg) && vg.length > 0) {
                const img = vg[0];
                if (typeof img === 'object' && img !== null && img.url) {
                    base.thumbnail = img.url;
                }
            }
        }
    }

    // ── EN locale hardcoded override (for products not yet in CMS with EN content) ──
    if (locale !== 'en' || !product.handle) return base as T;

    const en = enTranslations[product.handle as string];
    if (!en) return base as T;

    // Direct field mappings
    const directFields = ['title', 'description', 'flavor', 'origin', 'nicotineType', 'ingredients'];
    for (const field of directFields) {
        if (en[field]) base[field] = en[field];
    }
    // Update articleBody with EN description if available
    if (en['description']) base.articleBody = en['description'];

    // Nested meta fields
    if (en['meta.title'] || en['meta.description']) {
        base.meta = { ...(product.meta || {}) };
        if (en['meta.title']) base.meta.title = en['meta.title'];
        if (en['meta.description']) base.meta.description = en['meta.description'];
    }

    return base as T;
}
