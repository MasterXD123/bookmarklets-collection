javascript:(function(){
  const CFG = { POLL: 1200 };
  const d = document;

  const BM = {
    items: [],
    mo: null,
    globalOpen: false,
    selectedIdx: 0,
    btnMap: new Map(),
    filter: 'all',
    viewMode: 'single',
    transforms: {}, // index -> { zoom: 1, rot: 0, flipH: 1, flipV: 1, panX: 0, panY: 0 }
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    
    getFilteredItems() {
      return BM.filter === 'all' ? BM.items : BM.items.filter(i => i.type === BM.filter);
    },
    getSt(idx) {
      if (!BM.transforms[idx]) {
        BM.transforms[idx] = { zoom: 1, rot: 0, flipH: 1, flipV: 1, panX: 0, panY: 0 };
      }
      return BM.transforms[idx];
    },
    resetSt(idx) {
      BM.transforms[idx] = { zoom: 1, rot: 0, flipH: 1, flipV: 1, panX: 0, panY: 0 };
    }
  };

  const ICONS = {
    navLeft: '<svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
    navRight: '<svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
    close: '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    download: '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
    zoomIn: '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>',
    zoomOut: '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>',
    zoomReset: '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>',
    float: '<svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>',
    grid: '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>',
    single: '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2.5"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
    trash: '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
    rotL: '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>',
    rotR: '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10"/></svg>',
    flipH: '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M8 6l-6 6 6 6V6zM16 6l6 6-6 6V6z"/></svg>',
    flipV: '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20M6 8l6-6 6 6H6zM6 16l6 6 6-6H6z"/></svg>',
    copy: '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    fullscreen: '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>'
  };

  if (!d.getElementById('bm-styles')) {
    const style = d.createElement('style');
    style.id = 'bm-styles';
    style.textContent = `
      :root {
        --bm-bg: rgba(9, 11, 18, 0.94);
        --bm-panel-bg: rgba(16, 20, 32, 0.88);
        --bm-blur: blur(25px);
        --bm-accent: linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #d946ef 100%);
        --bm-card-bg: rgba(255, 255, 255, 0.04);
        --bm-border: 1px solid rgba(255, 255, 255, 0.12);
        --bm-radius: 14px;
        --bm-radius-sm: 8px;
        --bm-transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .bm-font {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        box-sizing: border-box;
        -webkit-font-smoothing: antialiased;
      }
      .bm-font * { box-sizing: inherit; }

      /* Botón flotante inyectado en cada imagen/video */
      .bm-float-btn {
        position: absolute !important;
        width: 32px !important;
        height: 32px !important;
        background: rgba(15, 23, 42, 0.85) !important;
        backdrop-filter: blur(10px) !important;
        -webkit-backdrop-filter: blur(10px) !important;
        color: #38bdf8 !important;
        border-radius: 8px !important;
        cursor: pointer !important;
        z-index: 2147483640 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        transition: var(--bm-transition) !important;
        border: 1px solid rgba(56, 189, 248, 0.35) !important;
        box-shadow: 0 4px 14px rgba(0,0,0,0.45) !important;
        pointer-events: auto !important;
        top: 8px !important;
        right: 8px !important;
        opacity: 0.85 !important;
      }
      .bm-float-btn:hover {
        transform: scale(1.15) !important;
        background: #0284c7 !important;
        color: #fff !important;
        opacity: 1 !important;
        border-color: #38bdf8 !important;
        box-shadow: 0 0 16px rgba(56,189,248,0.6) !important;
      }

      /* Launcher botón global */
      #bm-gb {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 52px;
        height: 52px;
        background: var(--bm-bg);
        backdrop-filter: var(--bm-blur);
        -webkit-backdrop-filter: var(--bm-blur);
        color: #38bdf8;
        border-radius: 50%;
        cursor: pointer;
        z-index: 2147483646;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: var(--bm-transition);
        box-shadow: 0 10px 35px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1);
        border: 1px solid rgba(56,189,248,0.3);
      }
      #bm-gb:hover {
        transform: scale(1.1) rotate(6deg);
        background: #0f172a;
        color: #fff;
        border-color: #38bdf8;
        box-shadow: 0 0 24px rgba(56, 189, 248, 0.55);
      }

      /* Modal principal */
      #bm-gm {
        position: fixed;
        inset: 0;
        height: 100dvh;
        width: 100dvw;
        background: radial-gradient(circle at 50% 30%, rgba(18, 24, 38, 0.96) 0%, rgba(6, 8, 14, 0.98) 100%);
        backdrop-filter: blur(35px);
        -webkit-backdrop-filter: blur(35px);
        z-index: 2147483647;
        display: flex;
        flex-direction: column;
        opacity: 0;
        transition: opacity 0.25s ease;
        color: #f8fafc;
        overflow: hidden;
        user-select: none;
      }

      /* BARRA SUPERIOR FIJA CON TODOS LOS CONTROLES */
      .bm-hdr {
        width: 100%;
        padding: 8px 16px;
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        background: var(--bm-panel-bg);
        border-bottom: var(--bm-border);
        gap: 12px;
        flex-shrink: 0;
        z-index: 30;
      }
      .bm-title-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba(255,255,255,0.06);
        padding: 6px 14px;
        border-radius: 20px;
        border: var(--bm-border);
        font-size: 13px;
        font-weight: 600;
        color: #f8fafc;
        white-space: nowrap;
      }
      .bm-title-badge span {
        background: var(--bm-accent);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 800;
      }

      /* Filtros */
      .bm-filter-container {
        display: flex;
        gap: 3px;
        background: rgba(0, 0, 0, 0.35);
        padding: 3px;
        border-radius: 22px;
        border: var(--bm-border);
        justify-self: center;
      }
      .bm-filter-btn {
        padding: 5px 13px;
        background: transparent;
        border-radius: 18px;
        color: rgba(255, 255, 255, 0.65);
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: var(--bm-transition);
        border: none;
        white-space: nowrap;
      }
      .bm-filter-btn:hover { color: #fff; background: rgba(255,255,255,0.08); }
      .bm-filter-btn.active {
        background: var(--bm-accent);
        color: #fff;
        box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
      }

      /* Grupo Botones Acción en Cabecera */
      .bm-btn-group {
        display: flex;
        gap: 5px;
        align-items: center;
        justify-self: end;
      }
      .bm-divider {
        width: 1px;
        height: 20px;
        background: rgba(255, 255, 255, 0.15);
        margin: 0 2px;
      }
      .bm-action-btn {
        width: 34px;
        height: 34px;
        padding: 0;
        background: rgba(255, 255, 255, 0.06);
        border-radius: var(--bm-radius-sm);
        color: rgba(255, 255, 255, 0.88);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: var(--bm-transition);
        border: var(--bm-border);
        flex-shrink: 0;
      }
      .bm-action-btn:hover {
        background: rgba(255, 255, 255, 0.16);
        color: #fff;
        transform: translateY(-1.5px);
        border-color: rgba(56, 189, 248, 0.4);
      }
      .bm-action-btn.active {
        background: rgba(14, 165, 233, 0.25);
        color: #38bdf8;
        border-color: #38bdf8;
        box-shadow: 0 0 14px rgba(56, 189, 248, 0.35);
      }
      .bm-close-btn:hover {
        background: #ef4444 !important;
        color: white !important;
        border-color: transparent !important;
        box-shadow: 0 0 16px rgba(239,68,68,0.5) !important;
      }
      .bm-clear-btn:hover {
        background: #f59e0b !important;
        color: white !important;
        border-color: transparent !important;
      }
      .bm-zoom-display {
        font-size: 11px;
        font-weight: 800;
        color: #38bdf8;
        padding: 0 8px;
        height: 34px;
        background: rgba(56, 189, 248, 0.12);
        border: var(--bm-border);
        border-radius: var(--bm-radius-sm);
        min-width: 44px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: var(--bm-transition);
      }
      .bm-zoom-display:hover {
        background: rgba(56, 189, 248, 0.25);
        color: #fff;
      }

      /* Visualizador principal totalmente despejado */
      .bm-main {
        flex: 1;
        width: 100%;
        display: flex;
        position: relative;
        overflow: hidden;
        align-items: center;
        justify-content: center;
      }
      .bm-view-wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
      }
      .bm-media-container {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px 80px;
        position: relative;
        box-sizing: border-box;
        overflow: hidden;
      }
      .bm-media-box {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        transform-origin: center center;
        transition: transform 0.05s linear;
        touch-action: none;
      }
      .bm-media-box.bm-animate-smooth {
        transition: transform 0.25s cubic-bezier(0.2, 0, 0.2, 1);
      }
      .bm-main-media {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
        object-fit: contain !important;
        border-radius: var(--bm-radius);
        box-shadow: 0 25px 65px rgba(0, 0, 0, 0.75);
        border: var(--bm-border);
        animation: bm-pop 0.3s cubic-bezier(0.34, 1.4, 0.64, 1);
        pointer-events: auto;
      }

      /* Flechas navegación lateral */
      .bm-side-nav {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 70px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 20;
        color: rgba(255, 255, 255, 0.45);
        cursor: pointer;
        transition: var(--bm-transition);
        user-select: none;
      }
      .bm-side-nav:hover {
        color: #38bdf8;
        background: linear-gradient(to right, rgba(56, 189, 248, 0.08), transparent);
      }
      .bm-side-right:hover {
        background: linear-gradient(to left, rgba(56, 189, 248, 0.08), transparent);
      }
      .bm-side-nav svg { transition: transform 0.2s; }
      .bm-side-nav:hover svg { transform: scale(1.25); }
      .bm-side-left { left: 0; }
      .bm-side-right { right: 0; }

      /* Vista Grid */
      .bm-grid-view {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 14px;
        padding: 24px;
        align-content: start;
        -webkit-overflow-scrolling: touch;
      }
      .bm-grid-item {
        position: relative;
        width: 100%;
        padding-top: 68%;
        border-radius: var(--bm-radius-sm);
        overflow: hidden;
        border: var(--bm-border);
        background: var(--bm-card-bg);
        cursor: pointer;
        transition: var(--bm-transition);
      }
      .bm-grid-item:hover {
        transform: scale(1.04) translateY(-3px);
        border-color: #38bdf8;
        box-shadow: 0 10px 25px rgba(56, 189, 248, 0.25);
      }
      .bm-grid-item-inner {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .bm-grid-item img, .bm-grid-item video {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      /* Carrusel */
      .bm-carousel {
        display: flex;
        gap: 10px;
        overflow-x: auto;
        padding: 10px 18px;
        background: var(--bm-panel-bg);
        border-top: var(--bm-border);
        scroll-behavior: smooth;
        height: 84px;
        align-items: center;
        flex-shrink: 0;
        width: 100%;
        z-index: 20;
        -webkit-overflow-scrolling: touch;
      }
      .bm-carousel::-webkit-scrollbar, .bm-grid-view::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      .bm-carousel::-webkit-scrollbar-thumb, .bm-grid-view::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 10px;
      }
      .bm-thumb {
        flex-shrink: 0;
        height: 100%;
        aspect-ratio: 16/10;
        border-radius: 8px;
        overflow: hidden;
        position: relative;
        cursor: pointer;
        border: 2px solid transparent;
        transition: var(--bm-transition);
        opacity: 0.45;
        background: #0b0d14;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .bm-thumb:hover { opacity: 0.85; transform: translateY(-2px); }
      .bm-thumb.active {
        opacity: 1;
        border-color: #38bdf8;
        transform: scale(1.05);
        box-shadow: 0 0 16px rgba(56, 189, 248, 0.4);
      }
      .bm-thumb img, .bm-thumb video {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .bm-badge {
        position: absolute;
        bottom: 4px;
        right: 4px;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        color: #f1f5f9;
        font-size: 8px;
        padding: 2px 5px;
        border-radius: 4px;
        font-weight: 700;
        letter-spacing: 0.5px;
        z-index: 2;
        border: 1px solid rgba(255,255,255,0.1);
      }

      /* Notificaciones Toast */
      .bm-toast {
        position: absolute;
        top: 65px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(15, 23, 42, 0.95);
        backdrop-filter: blur(15px);
        border: 1px solid rgba(56, 189, 248, 0.4);
        color: #38bdf8;
        padding: 8px 18px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        z-index: 40;
        box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        animation: bm-pop 0.25s ease;
        pointer-events: none;
      }

      @media (max-width: 900px) {
        .bm-hdr { grid-template-columns: 1fr auto; gap: 8px; padding: 8px 12px; }
        .bm-filter-container { grid-column: 1 / span 2; grid-row: 2; width: 100%; justify-content: center; }
        .bm-media-container { padding: 10px 20px; }
        .bm-side-nav { width: 35px; }
        .bm-carousel { height: 72px; }
      }
      @keyframes bm-pop {
        from { transform: scale(0.96); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
    `;
    d.head.appendChild(style);
  }

  function showToast(msg) {
    const old = d.querySelector('.bm-toast');
    if (old) old.remove();
    const t = d.createElement('div');
    t.className = 'bm-toast bm-font';
    t.textContent = msg;
    const modal = d.getElementById('bm-gm');
    if (modal) {
      modal.appendChild(t);
      setTimeout(() => t.remove(), 1800);
    }
  }

  function isValid(src) {
    if (!src || src === window.location.href || src === "about:blank") return false;
    return src.startsWith("blob:") || src.startsWith("data:") || src.startsWith("http");
  }

  function addItem(src, type) {
    if (!isValid(src) || BM.items.some(i => i.src === src)) return false;
    BM.items.push({ src, type });
    return true;
  }

  function processElement(el) {
    if (el.classList.contains('bm-main-media') || el.classList.contains('bm-thumb') || el.id === 'bm-gb' || el.closest('#bm-gm')) return;
    const tag = el.tagName;
    let src = "";
    let type = "";
    if (tag === "VIDEO") {
      src = el.currentSrc || el.src;
      type = "VIDEO";
    } else if (tag === "IMG") {
      src = el.currentSrc || el.src || el.getAttribute("data-mediabook");
      type = (src && src.toLowerCase().includes(".gif")) ? "GIF" : "IMG";
    }
    if (!isValid(src)) return;
    addItem(src, type);
    if (BM.btnMap.has(el)) return;
    const rect = el.getBoundingClientRect();
    if (rect.width < 20 || rect.height < 20) return;
    const p = el.parentElement;
    if (!p) return;
    const comp = window.getComputedStyle(p);
    if (comp.position === 'static') p.style.position = 'relative';
    
    const btn = d.createElement("div");
    btn.className = "bm-float-btn";
    btn.innerHTML = ICONS.float;
    btn.title = "Ver en Galería";
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      openModal();
      BM.viewMode = 'single';
      const filtered = BM.getFilteredItems();
      const idx = filtered.findIndex(i => i.src === src);
      if (idx !== -1) {
        BM.selectedIdx = idx;
      }
      updateMainView();
    };
    p.appendChild(btn);
    BM.btnMap.set(el, btn);
  }

  function syncAll() {
    d.querySelectorAll("video, img").forEach(processElement);
    BM.btnMap.forEach((btn, el) => {
      if (!d.contains(el)) {
        btn.remove();
        BM.btnMap.delete(el);
      }
    });
  }

  function handleKeyDown(e) {
    if (!BM.globalOpen) return;
    const key = e.key.toLowerCase();
    const filtered = BM.getFilteredItems();

    if (BM.viewMode === 'single') {
      if (e.key === "ArrowRight" || key === "d") {
        if (BM.selectedIdx < filtered.length - 1) {
          BM.selectedIdx++;
          updateMainView();
        }
      } else if (e.key === "ArrowLeft" || key === "a") {
        if (BM.selectedIdx > 0) {
          BM.selectedIdx--;
          updateMainView();
        }
      } else if (key === "r") {
        rotateMedia(90);
      } else if (key === "h") {
        flipMedia('H');
      } else if (key === "v") {
        flipMedia('V');
      } else if (key === "f") {
        toggleFullscreen();
      } else if (key === "+" || key === "=") {
        zoomMedia(0.3);
      } else if (key === "-" || key === "_") {
        zoomMedia(-0.3);
      } else if (key === "0") {
        BM.resetSt(BM.selectedIdx);
        applyTransform(true);
      }
    }
    if (e.key === "Escape") {
      closeModal();
    }
  }

  function closeModal() {
    const m = d.getElementById("bm-gm");
    if (m) m.remove();
    BM.globalOpen = false;
    window.removeEventListener("keydown", handleKeyDown);
  }

  function toggleFullscreen() {
    const m = d.getElementById("bm-gm");
    if (!m) return;
    if (!d.fullscreenElement) {
      m.requestFullscreen().catch(() => {});
    } else {
      d.exitFullscreen().catch(() => {});
    }
  }

  function applyTransform(smooth) {
    const box = d.querySelector(".bm-media-box");
    const media = d.querySelector(".bm-main-media");
    if (!box) return;
    const st = BM.getSt(BM.selectedIdx);

    if (smooth) {
      box.classList.add("bm-animate-smooth");
      setTimeout(() => box.classList.remove("bm-animate-smooth"), 260);
    }

    // Cursor y Arrastre de mano
    if (st.zoom > 1.05) {
      box.style.cursor = BM.isDragging ? "grabbing" : "grab";
    } else {
      box.style.cursor = "default";
      st.panX = 0;
      st.panY = 0;
    }

    box.style.transform = `translate3d(${st.panX}px, ${st.panY}px, 0) scale(${st.zoom}) rotate(${st.rot}deg) scaleX(${st.flipH}) scaleY(${st.flipV})`;

    if (media) {
      if (st.rot === 90 || st.rot === 270) {
        media.style.maxWidth = "88vh";
        media.style.maxHeight = "72vw";
      } else {
        media.style.maxWidth = "100%";
        media.style.maxHeight = "100%";
      }
    }

    // Actualizar indicador de zoom en cabecera
    const zDisplay = d.querySelector('.bm-zoom-display');
    if (zDisplay) zDisplay.textContent = `${Math.round(st.zoom * 100)}%`;

    const flipHBtn = d.querySelector('.bm-btn-fliph');
    if (flipHBtn) flipHBtn.classList.toggle('active', st.flipH === -1);

    const flipVBtn = d.querySelector('.bm-btn-flipv');
    if (flipVBtn) flipVBtn.classList.toggle('active', st.flipV === -1);
  }

  function rotateMedia(deg) {
    const st = BM.getSt(BM.selectedIdx);
    st.rot = (st.rot + deg + 360) % 360;
    applyTransform(true);
  }

  function flipMedia(dir) {
    const st = BM.getSt(BM.selectedIdx);
    if (dir === 'H') {
      st.flipH = st.flipH === 1 ? -1 : 1;
      showToast(st.flipH === -1 ? '↔ Espejo Horizontal Activado' : '↔ Espejo Horizontal Desactivado');
    } else {
      st.flipV = st.flipV === 1 ? -1 : 1;
      showToast(st.flipV === -1 ? '↕ Espejo Vertical Activado' : '↕ Espejo Vertical Desactivado');
    }
    applyTransform(true);
  }

  function zoomMedia(delta) {
    const st = BM.getSt(BM.selectedIdx);
    st.zoom = Math.min(Math.max(1, +(st.zoom + delta).toFixed(2)), 6);
    if (st.zoom <= 1) {
      st.panX = 0;
      st.panY = 0;
    }
    applyTransform(Math.abs(delta) > 0.4);
  }

  function setupPanAndZoom(box, media) {
    // Zoom mediante rueda del ratón
    box.onwheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.25 : -0.25;
      zoomMedia(delta);
    };

    // Doble clic para zoom rápido 100% / 250%
    box.ondblclick = (e) => {
      e.preventDefault();
      const st = BM.getSt(BM.selectedIdx);
      if (st.zoom > 1.1) {
        BM.resetSt(BM.selectedIdx);
      } else {
        st.zoom = 2.5;
      }
      applyTransform(true);
    };

    // Arrastre con la mano (Pan)
    const onMouseDown = (e) => {
      const st = BM.getSt(BM.selectedIdx);
      if (st.zoom <= 1.05) return;
      e.preventDefault();
      BM.isDragging = true;
      BM.dragStart = { x: e.clientX - st.panX, y: e.clientY - st.panY };
      applyTransform(false);

      const onMouseMove = (ev) => {
        if (!BM.isDragging) return;
        st.panX = ev.clientX - BM.dragStart.x;
        st.panY = ev.clientY - BM.dragStart.y;
        applyTransform(false);
      };

      const onMouseUp = () => {
        BM.isDragging = false;
        applyTransform(false);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    };

    box.onmousedown = onMouseDown;

    // Soporte Touch en Móviles/Tablets
    let touchStartDist = 0;
    let initialTouchZoom = 1;
    box.ontouchstart = (e) => {
      const st = BM.getSt(BM.selectedIdx);
      if (e.touches.length === 1 && st.zoom > 1.05) {
        BM.isDragging = true;
        BM.dragStart = { x: e.touches[0].clientX - st.panX, y: e.touches[0].clientY - st.panY };
      } else if (e.touches.length === 2) {
        touchStartDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        initialTouchZoom = st.zoom;
      }
    };
    box.ontouchmove = (e) => {
      const st = BM.getSt(BM.selectedIdx);
      if (e.touches.length === 1 && BM.isDragging) {
        st.panX = e.touches[0].clientX - BM.dragStart.x;
        st.panY = e.touches[0].clientY - BM.dragStart.y;
        applyTransform(false);
      } else if (e.touches.length === 2 && touchStartDist > 0) {
        const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        st.zoom = Math.min(Math.max(1, +(initialTouchZoom * (dist / touchStartDist)).toFixed(2)), 6);
        applyTransform(false);
      }
    };
    box.ontouchend = () => {
      BM.isDragging = false;
      touchStartDist = 0;
    };
  }

  function updateMainView() {
    const main = d.querySelector(".bm-main");
    const car = d.querySelector(".bm-carousel");
    const vBtn = d.querySelector(".bm-view-btn");
    const singleCtrls = d.querySelectorAll(".bm-single-only");
    const filtered = BM.getFilteredItems();

    if (!main) return;
    if (vBtn) vBtn.innerHTML = BM.viewMode === 'single' ? ICONS.grid : ICONS.single;
    main.innerHTML = "";

    // Ocultar/Mostrar controles específicos del visor individual en la cabecera
    singleCtrls.forEach(el => {
      el.style.display = BM.viewMode === 'single' ? 'inline-flex' : 'none';
    });

    if (BM.viewMode === 'grid') {
      if (car) car.style.display = 'none';

      const gv = d.createElement("div");
      gv.className = "bm-grid-view";
      filtered.forEach((it, idx) => {
        const gi = d.createElement("div");
        gi.className = "bm-grid-item";
        const inner = d.createElement("div");
        inner.className = "bm-grid-item-inner";
        let el = d.createElement(it.type === "VIDEO" ? "video" : "img");
        el.src = it.src;
        if (it.type === "VIDEO") el.muted = true;
        inner.appendChild(el);
        gi.appendChild(inner);

        const bd = d.createElement("div");
        bd.className = "bm-badge bm-font";
        bd.textContent = it.type;
        gi.appendChild(bd);

        gi.onclick = () => {
          BM.selectedIdx = idx;
          BM.viewMode = 'single';
          updateMainView();
        };
        gv.appendChild(gi);
      });
      main.appendChild(gv);
    } else {
      if (car) car.style.display = 'flex';

      const vw = d.createElement("div");
      vw.className = "bm-view-wrapper";
      const mc = d.createElement("div");
      mc.className = "bm-media-container";

      const navL = d.createElement("div");
      navL.className = "bm-side-nav bm-side-left";
      navL.innerHTML = ICONS.navLeft;
      navL.title = "Anterior (← o A)";
      navL.onclick = (e) => {
        e.stopPropagation();
        if (BM.selectedIdx > 0) {
          BM.selectedIdx--;
          updateMainView();
        }
      };

      const navR = d.createElement("div");
      navR.className = "bm-side-nav bm-side-right";
      navR.innerHTML = ICONS.navRight;
      navR.title = "Siguiente (→ o D)";
      navR.onclick = (e) => {
        e.stopPropagation();
        if (BM.selectedIdx < filtered.length - 1) {
          BM.selectedIdx++;
          updateMainView();
        }
      };

      const box = d.createElement("div");
      box.className = "bm-media-box";

      if (filtered[BM.selectedIdx]) {
        let media = d.createElement(filtered[BM.selectedIdx].type === "VIDEO" ? "video" : "img");
        if (filtered[BM.selectedIdx].type === "VIDEO") {
          media.controls = true;
          media.autoplay = true;
        }
        media.className = "bm-main-media";
        media.src = filtered[BM.selectedIdx].src;
        box.appendChild(media);
        setupPanAndZoom(box, media);
      }

      mc.appendChild(navL);
      mc.appendChild(box);
      mc.appendChild(navR);
      vw.appendChild(mc);
      main.appendChild(vw);

      navL.style.display = BM.selectedIdx > 0 ? "flex" : "none";
      navR.style.display = BM.selectedIdx < filtered.length - 1 ? "flex" : "none";

      const thumbs = d.querySelectorAll(".bm-thumb");
      thumbs.forEach((th, idx) => {
        if (idx === BM.selectedIdx) {
          th.classList.add("active");
          th.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
          th.classList.remove("active");
        }
      });

      requestAnimationFrame(() => applyTransform(false));
    }
  }

  function buildCarousel() {
    const carousel = d.createElement("div");
    carousel.className = "bm-carousel";
    BM.getFilteredItems().forEach((it, idx) => {
      const thumb = d.createElement("div");
      thumb.className = "bm-thumb " + (idx === BM.selectedIdx ? 'active' : '');
      let media = d.createElement(it.type === "VIDEO" ? "video" : "img");
      if (it.type === "VIDEO") {
        media.muted = true;
        media.preload = "metadata";
      } else {
        media.loading = "lazy";
      }
      media.src = it.src;
      thumb.appendChild(media);

      const badge = d.createElement("div");
      badge.className = "bm-badge bm-font";
      badge.textContent = it.type;
      thumb.appendChild(badge);

      thumb.onclick = () => {
        BM.selectedIdx = idx;
        BM.viewMode = 'single';
        updateMainView();
      };
      carousel.appendChild(thumb);
    });
    return carousel;
  }

  function openModal() {
    if (BM.globalOpen) return;
    BM.globalOpen = true;
    syncAll();

    const modal = d.createElement("div");
    modal.id = "bm-gm";
    modal.className = "bm-font";

    const hdr = d.createElement("div");
    hdr.className = "bm-hdr";

    const left = d.createElement("div");
    const badge = d.createElement("div");
    badge.className = "bm-title-badge";
    const ttl = d.createElement("span");
    badge.appendChild(ttl);
    left.appendChild(badge);

    const center = d.createElement("div");
    center.className = "bm-filter-container";

    // PANEL DE ACCIONES SUPERIOR (SOLO ICONOS)
    const right = d.createElement("div");
    right.className = "bm-btn-group";

    // 1. Espejos (Solo Iconos)
    const flipHBtn = d.createElement("button");
    flipHBtn.className = "bm-action-btn bm-btn-fliph bm-single-only";
    flipHBtn.innerHTML = ICONS.flipH;
    flipHBtn.title = "Espejo Horizontal (H)";
    flipHBtn.onclick = () => flipMedia('H');

    const flipVBtn = d.createElement("button");
    flipVBtn.className = "bm-action-btn bm-btn-flipv bm-single-only";
    flipVBtn.innerHTML = ICONS.flipV;
    flipVBtn.title = "Espejo Vertical (V)";
    flipVBtn.onclick = () => flipMedia('V');

    // 2. Rotaciones (Solo Iconos)
    const rotLBtn = d.createElement("button");
    rotLBtn.className = "bm-action-btn bm-single-only";
    rotLBtn.innerHTML = ICONS.rotL;
    rotLBtn.title = "Rotar Izquierda 90°";
    rotLBtn.onclick = () => rotateMedia(-90);

    const rotRBtn = d.createElement("button");
    rotRBtn.className = "bm-action-btn bm-single-only";
    rotRBtn.innerHTML = ICONS.rotR;
    rotRBtn.title = "Rotar Derecha 90° (R)";
    rotRBtn.onclick = () => rotateMedia(90);

    // 3. Zoom (Solo Iconos + Display)
    const zOutBtn = d.createElement("button");
    zOutBtn.className = "bm-action-btn bm-single-only";
    zOutBtn.innerHTML = ICONS.zoomOut;
    zOutBtn.title = "Reducir Zoom (-)";
    zOutBtn.onclick = () => zoomMedia(-0.3);

    const zDisplay = d.createElement("div");
    zDisplay.className = "bm-zoom-display bm-single-only";
    zDisplay.title = "Click para restablecer a 100% (0)";
    zDisplay.textContent = "100%";
    zDisplay.onclick = () => {
      BM.resetSt(BM.selectedIdx);
      applyTransform(true);
    };

    const zInBtn = d.createElement("button");
    zInBtn.className = "bm-action-btn bm-single-only";
    zInBtn.innerHTML = ICONS.zoomIn;
    zInBtn.title = "Aumentar Zoom (+)";
    zInBtn.onclick = () => zoomMedia(0.3);

    // 4. Copiar URL (Solo Icono)
    const copyBtn = d.createElement("button");
    copyBtn.className = "bm-action-btn bm-single-only";
    copyBtn.innerHTML = ICONS.copy;
    copyBtn.title = "Copiar URL del medio";
    copyBtn.onclick = () => {
      const filtered = BM.getFilteredItems();
      const cur = filtered[BM.selectedIdx];
      if (cur && cur.src) {
        navigator.clipboard.writeText(cur.src).then(() => showToast('¡Enlace copiado!')).catch(() => {});
      }
    };

    // 5. Vista Grid / Single (Solo Icono)
    const vBtn = d.createElement("button");
    vBtn.className = "bm-action-btn bm-view-btn";
    vBtn.innerHTML = ICONS.grid;
    vBtn.title = "Cambiar Modo de Vista (Grid / Single)";
    vBtn.onclick = () => {
      BM.viewMode = BM.viewMode === 'single' ? 'grid' : 'single';
      updateMainView();
    };

    // 6. Pantalla Completa (Solo Icono)
    const fsBtn = d.createElement("button");
    fsBtn.className = "bm-action-btn";
    fsBtn.innerHTML = ICONS.fullscreen;
    fsBtn.title = "Pantalla Completa (F)";
    fsBtn.onclick = toggleFullscreen;

    // 7. Descargar (Solo Icono)
    const dl = d.createElement("button");
    dl.className = "bm-action-btn";
    dl.innerHTML = ICONS.download;
    dl.title = "Descargar Medio Actual";
    dl.onclick = () => {
      const filtered = BM.getFilteredItems();
      if (filtered[BM.selectedIdx]) {
        const item = filtered[BM.selectedIdx];
        const a = d.createElement('a');
        a.href = item.src;
        let ext = item.type === 'VIDEO' ? '.mp4' : (item.type === 'GIF' ? '.gif' : '.jpg');
        a.download = `media_${BM.selectedIdx + 1}${ext}`;
        a.target = '_blank';
        a.click();
        showToast('Descargando...');
      }
    };

    // 8. Rescanear (Solo Icono)
    const rld = d.createElement("button");
    rld.className = "bm-action-btn";
    rld.innerHTML = ICONS.refresh;
    rld.title = "Rescanear Página";
    rld.onclick = () => {
      syncAll();
      BM.selectedIdx = 0;
      updateFilter();
      showToast('Medios sincronizados');
    };

    // 9. Vaciar Lista (Solo Icono)
    const clr = d.createElement("button");
    clr.className = "bm-action-btn bm-clear-btn";
    clr.innerHTML = ICONS.trash;
    clr.title = "Vaciar Lista";
    clr.onclick = () => {
      if (!confirm(`¿Vaciar la lista de ${BM.items.length} elementos detectados?`)) return;
      BM.items = [];
      BM.transforms = {};
      BM.btnMap.forEach(b => b.remove());
      BM.btnMap.clear();
      BM.selectedIdx = 0;
      updateFilter();
    };

    // 10. Cerrar (Solo Icono)
    const cls = d.createElement("button");
    cls.className = "bm-action-btn bm-close-btn";
    cls.innerHTML = ICONS.close;
    cls.title = "Cerrar (Esc)";
    cls.onclick = closeModal;

    // Agregar botones al Header
    right.appendChild(flipHBtn);
    right.appendChild(flipVBtn);
    right.appendChild(rotLBtn);
    right.appendChild(rotRBtn);

    const d1 = d.createElement("div");
    d1.className = "bm-divider bm-single-only";
    right.appendChild(d1);

    right.appendChild(zOutBtn);
    right.appendChild(zDisplay);
    right.appendChild(zInBtn);

    const d2 = d.createElement("div");
    d2.className = "bm-divider bm-single-only";
    right.appendChild(d2);

    right.appendChild(copyBtn);
    right.appendChild(vBtn);
    right.appendChild(fsBtn);
    right.appendChild(dl);
    right.appendChild(rld);
    right.appendChild(clr);

    const d3 = d.createElement("div");
    d3.className = "bm-divider";
    right.appendChild(d3);

    right.appendChild(cls);

    hdr.appendChild(left);
    hdr.appendChild(center);
    hdr.appendChild(right);

    const filters = [
      { type: 'all', label: 'Todos' },
      { type: 'VIDEO', label: 'Videos' },
      { type: 'IMG', label: 'Imágenes' },
      { type: 'GIF', label: 'GIFs' }
    ];

    filters.forEach(f => {
      const btn = d.createElement("button");
      btn.className = "bm-filter-btn " + (BM.filter === f.type ? 'active' : '');
      btn.textContent = f.label;
      btn.setAttribute('data-filter', f.type);
      btn.onclick = () => {
        if (BM.filter !== f.type) {
          BM.filter = f.type;
          updateFilter();
        }
      };
      center.appendChild(btn);
    });

    const main = d.createElement("div");
    main.className = "bm-main";

    modal.appendChild(hdr);
    modal.appendChild(main);
    d.body.appendChild(modal);

    function updateFilter() {
      const filtered = BM.getFilteredItems();
      const names = { all: 'Medios', VIDEO: 'Videos', IMG: 'Imágenes', GIF: 'GIFs' };
      ttl.textContent = `${names[BM.filter]} (${filtered.length})`;
      center.querySelectorAll('.bm-filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-filter') === BM.filter);
      });
      BM.selectedIdx = 0;
      const oldCar = modal.querySelector('.bm-carousel');
      if (oldCar) oldCar.remove();
      modal.appendChild(buildCarousel());
      updateMainView();
    }

    updateFilter();
    window.addEventListener("keydown", handleKeyDown);
    requestAnimationFrame(() => modal.style.opacity = "1");
  }

  // Cleanup previo
  Array.from(d.querySelectorAll(".bm-float-btn, #bm-gm, #bm-gb")).forEach(e => e.remove());
  BM.btnMap.forEach(b => b.remove());
  BM.btnMap.clear();

  syncAll();

  // Launcher flotante
  const gb = d.createElement("div");
  gb.id = "bm-gb";
  gb.className = "bm-font";
  gb.innerHTML = ICONS.grid;
  gb.title = "Abrir Galería de Medios";
  d.body.appendChild(gb);
  gb.onclick = () => {
    const m = d.getElementById("bm-gm");
    if (m) { closeModal(); return; }
    openModal();
  };

  BM.mo = new MutationObserver(muts => {
    muts.forEach(m => {
      m.addedNodes.forEach(n => {
        if (n.nodeType === 1) {
          if (n.tagName === "VIDEO" || n.tagName === "IMG") processElement(n);
          if (n.querySelectorAll) n.querySelectorAll("video, img").forEach(processElement);
        }
      });
    });
  });
  BM.mo.observe(d.documentElement, { childList: true, subtree: true });
  setInterval(syncAll, CFG.POLL);
})();

