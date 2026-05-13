// Shared CSS styles for MS-Identity App – Premium Glassmorphism Theme
module.exports = `
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  
  :root {
    --bg-deep: #0c0a14;
    --bg-surface: rgba(18,14,28,0.65);
    --bg-card: rgba(24,18,40,0.5);
    --bg-card-hover: rgba(38,28,58,0.6);
    --glass-border: rgba(140,90,160,0.18);
    --glass-border-hover: rgba(200,120,180,0.3);
    --text-primary: #f5f0ff;
    --text-secondary: #a99bc4;
    --text-muted: #6e5a8a;
    --accent-purple: #a78bfa;
    --accent-blue: #38bdf8;
    --accent-cyan: #2dd4bf;
    --accent-green: #34d399;
    --accent-amber: #fbbf24;
    --accent-red: #ff6b6b;
    --accent-pink: #fb7185;
    --gradient-main: linear-gradient(135deg, #ff6b6b 0%, #fbbf24 30%, #34d399 60%, #a78bfa 100%);
    --gradient-glow: linear-gradient(135deg, rgba(255,107,107,0.12), rgba(251,191,36,0.08), rgba(52,211,153,0.08));
    --blur-amount: 20px;
    --radius-lg: 20px;
    --radius-md: 14px;
    --radius-sm: 10px;
  }

  * { margin:0; padding:0; box-sizing:border-box; }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--bg-deep);
    color: var(--text-primary);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* ═══════ ANIMATED BACKGROUND ═══════ */
  body::before {
    content: '';
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background:
      radial-gradient(ellipse 600px 400px at 10% 25%, rgba(255,107,107,0.12) 0%, transparent 70%),
      radial-gradient(ellipse 500px 500px at 85% 15%, rgba(251,191,36,0.1) 0%, transparent 70%),
      radial-gradient(ellipse 700px 300px at 50% 85%, rgba(52,211,153,0.08) 0%, transparent 70%),
      radial-gradient(ellipse 400px 400px at 70% 60%, rgba(167,139,250,0.06) 0%, transparent 60%);
    animation: bgShift 20s ease-in-out infinite alternate;
    z-index: -2;
    pointer-events: none;
  }
  @keyframes bgShift {
    0% { transform: translate(0,0) scale(1); }
    50% { transform: translate(-20px, 15px) scale(1.02); }
    100% { transform: translate(10px, -10px) scale(1); }
  }

  /* Mesh overlay */
  body::after {
    content: '';
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.015'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    z-index: -1;
    pointer-events: none;
  }

  /* ═══════ LAYOUT ═══════ */
  .app-wrapper {
    display: flex;
    min-height: 100vh;
  }

  /* ═══════ SIDEBAR NAV ═══════ */
  .sidebar {
    width: 260px;
    min-height: 100vh;
    position: fixed;
    top: 0; left: 0;
    background: rgba(8,12,28,0.85);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-right: 1px solid rgba(80,100,160,0.12);
    padding: 28px 0;
    z-index: 100;
    display: flex;
    flex-direction: column;
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
  }
  .sidebar-brand {
    display: flex; align-items: center; gap: 10px;
    padding: 0 24px 24px;
    border-bottom: 1px solid rgba(80,100,160,0.1);
    margin-bottom: 16px;
    text-decoration: none;
  }
  .sidebar-brand .brand-icon {
    font-size: 28px;
    background: var(--gradient-main);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .sidebar-brand .brand-text {
    font-size: 15px; font-weight: 700; color: var(--text-primary);
    letter-spacing: -0.3px;
  }
  .sidebar-brand .brand-sub {
    font-size: 10px; color: var(--text-muted);
    text-transform: uppercase; letter-spacing: 1.2px; margin-top: 2px;
  }
  .sidebar-section {
    padding: 0 12px;
    margin-bottom: 8px;
  }
  .sidebar-section-label {
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 1.5px; color: var(--text-muted);
    padding: 12px 12px 6px; display: block;
  }
  .sidebar-link {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px; margin: 2px 0;
    border-radius: var(--radius-sm);
    font-size: 13px; font-weight: 500;
    color: var(--text-secondary);
    text-decoration: none;
    transition: all 0.2s ease;
    position: relative;
  }
  .sidebar-link:hover {
    background: rgba(255,107,107,0.08);
    color: var(--text-primary);
    transform: translateX(3px);
  }
  .sidebar-link.active {
    background: linear-gradient(135deg, rgba(255,107,107,0.1), rgba(251,191,36,0.08));
    color: #a5b4fc;
    font-weight: 600;
  }
  .sidebar-link.active::before {
    content: '';
    position: absolute; left: 0; top: 50%; transform: translateY(-50%);
    width: 3px; height: 20px;
    background: var(--gradient-main);
    border-radius: 0 4px 4px 0;
  }
  .sidebar-link .link-icon { font-size: 16px; width: 22px; text-align: center; }
  .sidebar-link .link-badge {
    margin-left: auto; font-size: 9px; padding: 2px 7px;
    border-radius: 6px; font-weight: 700; text-transform: uppercase;
  }
  .badge-auth { background: rgba(239,68,68,0.12); color: #f87171; }
  .badge-new { background: rgba(16,185,129,0.12); color: #34d399; }

  .sidebar-footer {
    margin-top: auto;
    padding: 16px 20px;
    border-top: 1px solid rgba(80,100,160,0.1);
  }
  .sidebar-user {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 0;
  }
  .sidebar-avatar {
    width: 34px; height: 34px; border-radius: 10px;
    background: var(--gradient-main);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700; color: white;
  }
  .sidebar-user-info { flex: 1; min-width: 0; }
  .sidebar-user-name { font-size: 13px; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sidebar-user-email { font-size: 10px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  /* ═══════ MAIN CONTENT ═══════ */
  .main-content {
    margin-left: 260px;
    flex: 1;
    padding: 36px 40px;
    max-width: 1000px;
  }

  /* ═══════ HEADER ═══════ */
  .header {
    text-align: center;
    margin-bottom: 40px;
    animation: fadeDown 0.6s ease;
    position: relative;
  }
  @keyframes fadeDown { from { opacity:0; transform:translateY(-20px); } to { opacity:1; transform:translateY(0); } }
  .header .logo {
    font-size: 56px;
    margin-bottom: 14px;
    filter: drop-shadow(0 0 20px rgba(255,107,107,0.3));
  }
  .header h1 {
    font-size: 36px; font-weight: 800; letter-spacing: -0.5px;
    background: var(--gradient-main);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    animation: gradientFlow 4s ease infinite;
    background-size: 200% 200%;
  }
  @keyframes gradientFlow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .header .subtitle {
    color: var(--text-secondary);
    font-size: 15px; margin-top: 10px; line-height: 1.7;
    max-width: 600px; margin-left: auto; margin-right: auto;
  }

  /* ═══════ CARDS GRID ═══════ */
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    margin-top: 24px;
  }
  .feature-card {
    background: var(--bg-card);
    backdrop-filter: blur(var(--blur-amount));
    -webkit-backdrop-filter: blur(var(--blur-amount));
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    padding: 28px;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
    position: relative;
    overflow: hidden;
  }
  .feature-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: var(--accent);
    opacity: 0;
    transition: opacity 0.35s, height 0.35s;
  }
  .feature-card::after {
    content: '';
    position: absolute; inset: 0;
    background: var(--accent);
    opacity: 0;
    transition: opacity 0.35s;
    pointer-events: none;
    border-radius: inherit;
  }
  .feature-card:hover {
    transform: translateY(-8px) scale(1.01);
    border-color: var(--glass-border-hover);
    box-shadow: 0 24px 48px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,107,107,0.12);
  }
  .feature-card:hover::before { opacity: 1; height: 4px; }
  .feature-card:hover::after { opacity: 0.03; }
  .feature-card .card-icon {
    font-size: 40px; margin-bottom: 16px; display: block;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.2));
  }
  .feature-card h3 { font-size: 18px; font-weight: 700; color: var(--text-primary); margin-bottom: 10px; }
  .feature-card p { color: var(--text-secondary); font-size: 13px; line-height: 1.7; }
  .feature-card .card-tag {
    display: inline-block; margin-top: 16px; padding: 4px 12px;
    border-radius: 8px; font-size: 10px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.5px;
    backdrop-filter: blur(8px);
  }
  .tag-auth { background: rgba(239,68,68,0.1); color: #f87171; border: 1px solid rgba(239,68,68,0.2); }
  .tag-info { background: rgba(59,130,246,0.1); color: #60a5fa; border: 1px solid rgba(59,130,246,0.2); }

  /* ═══════ GLASS CARD ═══════ */
  .card {
    background: var(--bg-card);
    backdrop-filter: blur(var(--blur-amount));
    -webkit-backdrop-filter: blur(var(--blur-amount));
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    padding: 28px;
    margin-bottom: 20px;
    animation: fadeUp 0.5s ease both;
    transition: border-color 0.3s;
  }
  .card:hover { border-color: rgba(167,139,250,0.2); }
  @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  .card-title {
    font-size: 18px; font-weight: 700; margin-bottom: 18px; color: var(--text-primary);
    display: flex; align-items: center; gap: 10px;
  }
  .card-title .icon { font-size: 22px; }

  /* ═══════ BUTTONS ═══════ */
  .btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 24px; border: none; border-radius: var(--radius-sm);
    font-size: 14px; font-weight: 600; font-family: 'Inter', sans-serif;
    cursor: pointer; transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
    text-decoration: none; position: relative; overflow: hidden;
  }
  .btn::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
    opacity: 0; transition: opacity 0.25s;
  }
  .btn:hover::after { opacity: 1; }
  .btn-primary {
    background: var(--gradient-main); color: white;
    box-shadow: 0 4px 16px rgba(255,107,107,0.2);
  }
  .btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(255,107,107,0.3);
  }
  .btn-secondary {
    background: rgba(30,41,72,0.6); border: 1px solid var(--glass-border);
    color: var(--text-primary);
    backdrop-filter: blur(12px);
  }
  .btn-secondary:hover { background: rgba(50,60,100,0.5); transform: translateY(-2px); }
  .btn-danger {
    background: rgba(239,68,68,0.1); color: #f87171;
    border: 1px solid rgba(239,68,68,0.2);
  }
  .btn-danger:hover { background: rgba(239,68,68,0.2); transform: translateY(-2px); }
  .btn-signup {
    background: linear-gradient(135deg, #059669, #10b981); color: white;
    box-shadow: 0 4px 16px rgba(16,185,129,0.2);
  }
  .btn-signup:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(16,185,129,0.3); }
  .btn-warning {
    background: linear-gradient(135deg, #d97706, #f59e0b); color: white;
    box-shadow: 0 4px 16px rgba(245,158,11,0.2);
  }
  .btn-warning:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(245,158,11,0.3); }
  .btn-sm { padding: 8px 16px; font-size: 13px; border-radius: 8px; }
  .btn-lg { padding: 16px 36px; font-size: 16px; border-radius: 14px; }
  .btn-back { margin-bottom: 20px; }

  /* ═══════ CTA SECTION ═══════ */
  .cta-section {
    text-align: center; margin: 32px 0 8px; padding: 36px 28px;
    background: var(--bg-card);
    backdrop-filter: blur(var(--blur-amount));
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    animation: fadeUp 0.5s ease both;
    position: relative; overflow: hidden;
  }
  .cta-section::before {
    content: '';
    position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
    background: conic-gradient(from 0deg, transparent, rgba(255,107,107,0.04), transparent, rgba(251,191,36,0.03), transparent);
    animation: rotateConic 15s linear infinite;
  }
  @keyframes rotateConic { to { transform: rotate(360deg); } }
  .cta-text { color: var(--text-secondary); font-size: 16px; margin-bottom: 24px; line-height: 1.7; position: relative; }
  .cta-buttons { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; position: relative; }

  /* ═══════ USER GRID ═══════ */
  .user-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .user-item {
    background: rgba(20,30,55,0.5); padding: 16px 18px;
    border-radius: var(--radius-md); border: 1px solid rgba(80,100,160,0.12);
    transition: all 0.25s;
  }
  .user-item:hover { border-color: rgba(251,191,36,0.2); transform: translateY(-2px); }
  .user-item .label { font-size: 10px; text-transform: uppercase; letter-spacing: 1.2px; color: var(--text-muted); margin-bottom: 5px; font-weight: 700; }
  .user-item .value { font-size: 14px; color: var(--text-primary); word-break: break-all; font-weight: 500; }

  /* ═══════ CLAIMS ═══════ */
  .claims-grid { display: flex; flex-wrap: wrap; gap: 8px; }
  .claim-badge {
    padding: 7px 14px; border-radius: 10px; font-size: 12px;
    background: rgba(52,211,153,0.06); border: 1px solid rgba(52,211,153,0.15);
    color: #6ee7b7; transition: all 0.25s;
    backdrop-filter: blur(8px);
    font-family: 'JetBrains Mono', monospace; font-size: 11px;
  }
  .claim-badge:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(52,211,153,0.1); }
  .claim-badge .key { color: var(--text-muted); font-weight: 400; }

  /* ═══════ TOKEN BLOCK ═══════ */
  .token-block {
    background: rgba(2,6,20,0.8); border: 1px solid rgba(80,100,160,0.12);
    border-radius: var(--radius-md); padding: 20px; overflow-x: auto;
    font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
    font-size: 12px; line-height: 1.8; color: var(--text-secondary);
    max-height: 500px; overflow-y: auto;
  }

  /* ═══════ INFO SECTIONS ═══════ */
  .info-section { margin-bottom: 24px; }
  .info-section h3 { font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }
  .info-section p { color: var(--text-secondary); font-size: 14px; line-height: 1.8; margin-bottom: 10px; }
  .info-section ul { color: var(--text-secondary); font-size: 14px; line-height: 2; padding-left: 20px; }
  .info-section code { background: rgba(251,191,36,0.1); padding: 3px 8px; border-radius: 6px; font-size: 12px; color: #fde68a; font-family: 'JetBrains Mono', monospace; }

  /* ═══════ FLOW DIAGRAM ═══════ */
  .flow { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 0; margin: 20px 0; }
  .flow-step {
    padding: 12px 20px; background: rgba(20,30,55,0.6);
    border: 1px solid var(--glass-border); border-radius: var(--radius-sm);
    font-size: 13px; font-weight: 500; color: var(--text-secondary);
    transition: all 0.25s;
  }
  .flow-step:hover { border-color: rgba(52,211,153,0.3); color: var(--text-primary); }
  .flow-arrow { color: var(--text-muted); font-size: 18px; padding: 0 6px; }

  /* ═══════ STATUS BAR ═══════ */
  .status-bar {
    display: flex; align-items: center; gap: 10px; margin-bottom: 20px;
    padding: 12px 18px; background: rgba(16,185,129,0.06);
    border: 1px solid rgba(16,185,129,0.15); border-radius: var(--radius-md);
    font-size: 13px; color: #6ee7b7;
    backdrop-filter: blur(12px);
  }
  .status-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; animation: pulse 2s infinite; box-shadow: 0 0 8px rgba(16,185,129,0.4); }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.85)} }

  /* ═══════ HIGHLIGHT BOX ═══════ */
  .highlight-box {
    padding: 18px 22px; border-radius: var(--radius-md); margin: 14px 0;
    font-size: 14px; line-height: 1.8;
    backdrop-filter: blur(12px);
  }
  .highlight-blue { background: rgba(59,130,246,0.06); border: 1px solid rgba(59,130,246,0.15); color: #93c5fd; }
  .highlight-purple { background: rgba(139,92,246,0.06); border: 1px solid rgba(139,92,246,0.15); color: #c4b5fd; }
  .highlight-green { background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.15); color: #6ee7b7; }
  .highlight-amber { background: rgba(245,158,11,0.06); border: 1px solid rgba(245,158,11,0.15); color: #fcd34d; }
  .highlight-red { background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.15); color: #fca5a5; }

  /* ═══════ BADGE ═══════ */
  .badge {
    display: inline-block; padding: 4px 12px; border-radius: 8px;
    font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
  }
  .badge-id { background: rgba(59,130,246,0.1); color: #60a5fa; border: 1px solid rgba(59,130,246,0.2); }
  .badge-access { background: rgba(168,85,247,0.1); color: #c084fc; border: 1px solid rgba(168,85,247,0.2); }

  /* ═══════ COMPARE TABLE ═══════ */
  .compare-table { width: 100%; border-collapse: collapse; margin: 14px 0; }
  .compare-table th, .compare-table td {
    padding: 14px 18px; text-align: left;
    border-bottom: 1px solid rgba(80,100,160,0.1); font-size: 13px;
  }
  .compare-table th { color: var(--text-muted); font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: 1.2px; }
  .compare-table td { color: var(--text-primary); }
  .compare-table tr { transition: background 0.2s; }
  .compare-table tr:hover td { background: rgba(167,139,250,0.04); }

  /* ═══════ ERROR CARD ═══════ */
  .error-card {
    background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.2);
    color: #fca5a5; padding: 28px; border-radius: var(--radius-lg); text-align: center;
    backdrop-filter: blur(12px);
  }

  /* ═══════ SETUP CARD ═══════ */
  .setup-card {
    background: rgba(245,158,11,0.04); border: 1px solid rgba(245,158,11,0.15);
    border-radius: var(--radius-lg); padding: 28px; margin-bottom: 20px;
    backdrop-filter: blur(12px);
  }
  .setup-card h3 { color: #fbbf24; margin-bottom: 12px; }
  .setup-card ol { color: var(--text-secondary); font-size: 14px; line-height: 2.2; padding-left: 20px; }
  .setup-card code { background: rgba(245,158,11,0.08); padding: 2px 8px; border-radius: 6px; color: #fcd34d; font-size: 12px; font-family: 'JetBrains Mono', monospace; }

  /* ═══════ ROLE SELECTOR ═══════ */
  .role-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 30px;
    max-width: 700px; margin-left: auto; margin-right: auto;
  }
  .role-card {
    background: var(--bg-card); border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg); padding: 36px 28px; text-align: center;
    cursor: pointer; transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
    position: relative; overflow: hidden;
    backdrop-filter: blur(var(--blur-amount));
  }
  .role-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
    background: var(--role-accent); opacity: 0; transition: opacity 0.3s;
  }
  .role-card:hover { transform: translateY(-8px); border-color: var(--glass-border-hover); box-shadow: 0 24px 48px rgba(0,0,0,0.35); }
  .role-card:hover::before { opacity: 1; }
  .role-card .role-icon { font-size: 48px; margin-bottom: 14px; display: block; }
  .role-card h3 { font-size: 20px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px; }
  .role-card p { color: var(--text-secondary); font-size: 13px; line-height: 1.6; }
  .role-card input[type="submit"] {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%;
    opacity: 0; cursor: pointer; border: none; background: none;
  }

  /* ═══════ DASHBOARD ═══════ */
  .dash-welcome {
    border-radius: var(--radius-lg); padding: 40px 36px; margin-bottom: 28px;
    position: relative; overflow: hidden;
    animation: fadeDown 0.6s ease;
  }
  .dash-welcome::after {
    content: ''; position: absolute; top: -30px; right: -30px; width: 200px; height: 200px;
    border-radius: 50%; filter: blur(80px); opacity: 0.25;
  }
  .dash-welcome h1 { font-size: 28px; font-weight: 800; color: #fff; margin-bottom: 6px; }
  .dash-welcome p { color: rgba(255,255,255,0.75); font-size: 14px; }
  .dash-welcome .dash-role-badge {
    display: inline-block; padding: 6px 16px; border-radius: 10px; font-size: 12px;
    font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 12px;
    background: rgba(255,255,255,0.12); color: #fff; backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.1);
  }
  .dash-doctor { background: linear-gradient(135deg, #065f46, #059669, #10b981); }
  .dash-doctor::after { background: #34d399; }
  .dash-consultant { background: linear-gradient(135deg, #1e3a5f, #2563eb, #3b82f6); }
  .dash-consultant::after { background: #60a5fa; }
  .dash-student { background: linear-gradient(135deg, #78350f, #d97706, #f59e0b); }
  .dash-student::after { background: #fbbf24; }
  .dash-medstudent { background: linear-gradient(135deg, #4c1d95, #7c3aed, #8b5cf6); }
  .dash-medstudent::after { background: #a78bfa; }

  /* Stats Row */
  .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
  .stat-card {
    background: var(--bg-card); border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg); padding: 24px 20px; text-align: center;
    backdrop-filter: blur(var(--blur-amount)); transition: all 0.3s ease;
    animation: fadeUp 0.5s ease both;
  }
  .stat-card:hover { transform: translateY(-4px); border-color: rgba(251,191,36,0.25); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
  .stat-card .stat-icon { font-size: 28px; margin-bottom: 8px; display: block; }
  .stat-card .stat-value { font-size: 28px; font-weight: 800; color: var(--text-primary); }
  .stat-card .stat-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1.2px; color: var(--text-muted); font-weight: 700; margin-top: 6px; }

  /* Action Buttons Grid */
  .actions-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .action-btn {
    display: flex; align-items: center; gap: 12px; padding: 16px 20px;
    background: rgba(20,30,55,0.5); border: 1px solid var(--glass-border);
    border-radius: var(--radius-md); color: var(--text-primary); font-size: 14px; font-weight: 600;
    transition: all 0.25s ease; cursor: pointer; text-decoration: none;
  }
  .action-btn:hover { background: rgba(52,211,153,0.08); transform: translateX(4px); border-color: rgba(52,211,153,0.2); }
  .action-btn .action-icon { font-size: 20px; }

  /* Activity List */
  .activity-list { list-style: none; padding: 0; }
  .activity-item {
    display: flex; align-items: center; gap: 14px; padding: 14px 0;
    border-bottom: 1px solid rgba(80,100,160,0.08); font-size: 14px; color: var(--text-secondary);
    transition: background 0.2s;
  }
  .activity-item:last-child { border-bottom: none; }
  .activity-item:hover { background: rgba(167,139,250,0.03); }
  .activity-item .activity-icon {
    font-size: 16px; width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center;
    border-radius: var(--radius-sm);
    background: rgba(20,30,55,0.5); border: 1px solid var(--glass-border);
  }
  .activity-item .activity-time { margin-left: auto; font-size: 11px; color: var(--text-muted); }

  /* Dashboard nav */
  .dash-nav { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
  .change-role-link {
    display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px;
    border-radius: 8px; font-size: 12px; color: var(--text-secondary);
    background: rgba(20,30,55,0.5); border: 1px solid var(--glass-border); transition: all 0.2s;
  }
  .change-role-link:hover { color: var(--text-primary); background: rgba(255,107,107,0.08); }

  /* ═══════ FORMS (Profile Editor) ═══════ */
  .form-group {
    margin-bottom: 20px;
  }
  .form-group label {
    display: block;
    font-size: 11px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 1.2px; color: var(--text-muted);
    margin-bottom: 8px;
  }
  .form-input {
    width: 100%; padding: 12px 16px;
    background: rgba(10,16,36,0.7);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-sm);
    color: var(--text-primary);
    font-family: 'Inter', sans-serif; font-size: 14px;
    transition: all 0.25s;
    outline: none;
  }
  .form-input:focus {
    border-color: var(--accent-purple);
    box-shadow: 0 0 0 3px rgba(139,92,246,0.12);
  }
  .form-input:hover {
    border-color: rgba(167,139,250,0.3);
  }
  .form-input::placeholder { color: var(--text-muted); }
  .form-row {
    display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
  }
  .form-actions {
    display: flex; gap: 12px; margin-top: 8px; align-items: center;
  }

  /* ═══════ TOAST / FEEDBACK ═══════ */
  .toast {
    padding: 14px 20px; border-radius: var(--radius-sm);
    margin-bottom: 16px; font-size: 14px; line-height: 1.6;
    animation: slideIn 0.4s ease;
  }
  @keyframes slideIn { from { opacity:0; transform: translateX(-12px); } to { opacity:1; transform: translateX(0); } }
  .toast-success { background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.2); color: #6ee7b7; }
  .toast-error { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); color: #fca5a5; }
  .toast-info { background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.2); color: #93c5fd; }

  /* ═══════ GROUP / ROLE BADGES ═══════ */
  .role-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px; border-radius: 10px;
    font-size: 12px; font-weight: 600;
    background: rgba(139,92,246,0.08); border: 1px solid rgba(139,92,246,0.2);
    color: #c4b5fd; margin: 4px;
    transition: all 0.2s;
  }
  .role-badge:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(139,92,246,0.15); }
  .group-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px; border-radius: 10px;
    font-size: 12px; font-weight: 600;
    background: rgba(6,182,212,0.08); border: 1px solid rgba(6,182,212,0.2);
    color: #67e8f9; margin: 4px;
    transition: all 0.2s;
  }
  .group-badge:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(6,182,212,0.15); }

  /* ═══════ STEP-UP AUTH ═══════ */
  .auth-level-indicator {
    display: flex; gap: 12px; align-items: center;
    padding: 18px 22px;
    background: rgba(20,30,55,0.5);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
    margin-bottom: 20px;
  }
  .auth-level-dot {
    width: 14px; height: 14px; border-radius: 50%;
    box-shadow: 0 0 12px currentColor;
  }
  .auth-level-dot.high { background: #10b981; color: #10b981; }
  .auth-level-dot.medium { background: #f59e0b; color: #f59e0b; }
  .auth-level-dot.low { background: #ef4444; color: #ef4444; }
  .auth-level-text { font-size: 14px; font-weight: 600; color: var(--text-primary); }
  .auth-level-sub { font-size: 12px; color: var(--text-muted); }

  /* ═══════ GROUP LIST ═══════ */
  .group-list { list-style: none; padding: 0; }
  .group-list-item {
    display: flex; align-items: center; gap: 14px; padding: 14px 18px;
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
    margin-bottom: 8px;
    background: rgba(20,30,55,0.4);
    transition: all 0.25s;
  }
  .group-list-item:hover { border-color: rgba(6,182,212,0.25); transform: translateX(4px); }
  .group-list-icon {
    width: 40px; height: 40px; border-radius: var(--radius-sm);
    background: linear-gradient(135deg, rgba(52,211,153,0.15), rgba(255,107,107,0.1));
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
  }
  .group-list-name { font-size: 14px; font-weight: 600; color: var(--text-primary); }
  .group-list-id { font-size: 11px; color: var(--text-muted); font-family: 'JetBrains Mono', monospace; }

  /* ═══════ TABS ═══════ */
  .tabs { display: flex; gap: 4px; margin-bottom: 20px; border-bottom: 1px solid rgba(80,100,160,0.1); }
  .tab {
    padding: 10px 22px; cursor: pointer; font-size: 13px; font-weight: 600;
    color: var(--text-muted); border: none; background: none;
    border-bottom: 2px solid transparent; transition: all 0.25s; font-family: 'Inter', sans-serif;
  }
  .tab:hover { color: #a5b4fc; }
  .tab.active { color: #a78bfa; border-bottom-color: #a78bfa; }
  .tab-content { display: none; }
  .tab-content.active { display: block; }

  /* ═══════ MOBILE ═══════ */
  .sidebar-toggle {
    display: none;
    position: fixed; top: 14px; left: 14px; z-index: 200;
    background: var(--bg-card); border: 1px solid var(--glass-border);
    border-radius: 10px; padding: 10px 12px; cursor: pointer;
    color: var(--text-primary); font-size: 20px;
    backdrop-filter: blur(12px);
  }
  @media (max-width: 900px) {
    .sidebar { transform: translateX(-100%); }
    .sidebar.open { transform: translateX(0); box-shadow: 20px 0 60px rgba(0,0,0,0.5); }
    .sidebar-toggle { display: block; }
    .main-content { margin-left: 0; padding: 24px 16px; padding-top: 64px; }
    .user-grid { grid-template-columns: 1fr; }
    .cards-grid { grid-template-columns: 1fr; }
    .header h1 { font-size: 24px; }
    .role-grid { grid-template-columns: 1fr; }
    .stats-row { grid-template-columns: 1fr 1fr; }
    .actions-grid { grid-template-columns: 1fr; }
    .form-row { grid-template-columns: 1fr; }
  }
</style>
`;
