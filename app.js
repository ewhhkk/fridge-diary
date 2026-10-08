'use strict';
// ================= 基础 =================
const KEY = 'fridgeDiary_v1';
const LOCS = ['冷藏','冷冻','常温','调料柜','零食柜'];
const LOC_EN = {冷藏:'Fridge',冷冻:'Freezer',常温:'Pantry',调料柜:'Spices',零食柜:'Snacks'};
const CATS = ['蔬菜','水果','肉类','海鲜','蛋奶','豆制品','主食','调料','干货','零食','冻品','其他'];
const CAT_EN = {蔬菜:'Veg',水果:'Fruit',肉类:'Meat',海鲜:'Seafood',蛋奶:'Egg & dairy',豆制品:'Tofu',主食:'Staples',调料:'Seasoning',干货:'Dry goods',零食:'Snacks',冻品:'Frozen',其他:'Other'};
const CAT_DEF = {蔬菜:['冷藏',5,'个',1],水果:['冷藏',7,'个',1],肉类:['冷藏',3,'g',300],海鲜:['冷藏',2,'g',300],蛋奶:['冷藏',7,'个',1],豆制品:['冷藏',5,'盒',1],主食:['常温',180,'g',500],调料:['调料柜',365,'瓶',1],干货:['常温',180,'g',100],零食:['零食柜',60,'包',1],冻品:['冷冻',180,'g',300],其他:['常温',30,'个',1]};
const FREEZE = {肉类:90,海鲜:90,冻品:180,主食:90,蔬菜:30,水果:60,蛋奶:30,豆制品:30,其他:60};
const UNITS = ['个','根','颗','把','盒','包','瓶','袋','罐','条','块','头','碗','支','g','kg','斤','两','ml','L'];
const UNIT_EN = {个:'pc',根:'pc',颗:'head',把:'bunch',盒:'box',包:'pack',瓶:'bottle',袋:'bag',罐:'can',条:'whole',块:'piece',头:'bulb',碗:'bowl',支:'tube',勺:'tbsp',瓣:'clove',片:'slice'};
const FAM = {g:['w',1],kg:['w',1000],'斤':['w',500],'两':['w',50],ml:['v',1],L:['v',1000]};
const CHANNELS = ['Coles','Woolworths','Aldi','亚超','菜市场','其他'];
const TAGS = ['荤','素','汤','快手','减脂','便当','甜点','主食'];
const TAG_EN = {荤:'Meat',素:'Veg',汤:'Soup',快手:'Quick',减脂:'Light',便当:'Lunchbox',甜点:'Dessert',主食:'Staple'};
const MEALS = ['早','午','晚','加餐'];
const MEAL_EN = {早:'Breakfast',午:'Lunch',晚:'Dinner',加餐:'Snack'};
const DIFFS = ['简单','中等','难'];
const DIFF_EN = {简单:'Easy',中等:'Medium',难:'Hard'};

const ICON = {
  home:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  fridge:'<rect x="5" y="2" width="14" height="20" rx="2.5"/><path d="M5 10h14M9 5.5v2M9 13v3"/>',
  book:'<path d="M5 4h10a4 4 0 0 1 4 4v12H8a3 3 0 0 1-3-3z"/><path d="M9 9h6M9 13h4"/>',
  cart:'<circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/><path d="M3 4h2l2.4 11h11.2L21 7.5H6"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  alert:'<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5v.5"/>',
  chef:'<path d="M7 14a4 4 0 1 1 1.5-7.7A4.5 4.5 0 0 1 17 7a3.5 3.5 0 0 1 0 7v6H7z"/><path d="M7 17h10"/>',
  list:'<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
  dice:'<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1"/><circle cx="15" cy="15" r="1"/><circle cx="15" cy="9" r="1"/><circle cx="9" cy="15" r="1"/>',
  x:'<path d="M6 6l12 12M18 6L6 18"/>',
  scan:'<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M7 12h10"/>',
  star:'<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
  back:'<path d="M15 5l-7 7 7 7"/>',
  pan:'<circle cx="10" cy="13" r="6"/><path d="M16 13h6"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7"/>'
};
function svg(n, fill) { return '<svg viewBox="0 0 24 24" fill="' + (fill ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + ICON[n] + '</svg>'; }

let S;
const ui = { tab:'home', sheet:null, invSearch:'', invLoc:'全部', batch:false, sel:new Set(), recTab:'rec', recSearch:'',
  f:{time:0,type:'',meal:'',diff:'',must:''}, serv:null, basket:{}, addSearch:'', addCat:'' };

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function ds(d) { const z = n => String(n).padStart(2, '0'); return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate()); }
function today() { return ds(new Date()); }
function addDays(s, n) { const d = new Date(s + 'T00:00:00'); d.setDate(d.getDate() + Math.round(n)); return ds(d); }
function diffDays(a, b) { return Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 864e5); }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function fq(q) { return String(Math.round(q * 100) / 100); }
function en() { return S.settings.lang === 'en'; }
function L(zh, e) { return en() ? e : zh; }
function uName(u) { return en() ? (UNIT_EN[u] || u) : u; }
function locN(l) { return en() ? (LOC_EN[l] || l) : l; }
function catN(c) { return en() ? (CAT_EN[c] || c) : c; }
function tagN(t) { return en() ? (TAG_EN[t] || t) : t; }
function mealN(m) { return en() ? (MEAL_EN[m] || m) : m; }
function diffN(d) { return en() ? (DIFF_EN[d] || d) : d; }
function chN(c) { return en() ? ({亚超:'Asian grocer',菜市场:'Market',其他:'Other'}[c] || c) : c; }
function stepOf(u) { return ({g:50,kg:0.1,'斤':0.5,'两':1,ml:50,L:0.1})[u] || 1; }
function conv(q, u) { const f = FAM[u]; return f ? { f:f[0], v:q * f[1] } : { f:'c:' + u, v:q }; }

// ================= 数据 =================
function makeCard(o) {
  const d = CAT_DEF[o.cat] || CAT_DEF['其他'];
  return Object.assign({ id:uid(), en:'', loc:d[0], shelf:d[1], unit:d[2], qty:d[3], open:0, min:0, group:'', barcode:'', uses:0, staple:false,
    channel: ASIAN.has(o.name) ? '亚超' : 'Coles' }, o, { loc:o.loc || d[0] });
}
function seed() {
  const s = { v:1, settings:{ country:'CN', lang:'zh', warnLabel:3, warnGuess:2 }, cards:[], items:[], recipes:[], reserved:[], shop:[], logs:[], waste:[] };
  s.cards = CARD_SEED.map(makeCard);
  s.recipes = RECIPE_SEED.map(r => Object.assign({ id:uid(), fav:false, last:null, custom:false }, r));
  return s;
}
function load() {
  try { const raw = localStorage.getItem(KEY); if (raw) { S = JSON.parse(raw); return; } } catch (e) {}
  S = seed();
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast(L('保存失败：存储空间不足','Save failed')); } }
function snap() { return JSON.stringify(S); }
function cardOf(id) { return S.cards.find(c => c.id === id); }
function nm(c) { return c ? (en() ? (c.en || c.name) : c.name) : '?'; }
function dn(n) { const c = findCard(n); return c ? nm(c) : n; }
function rn(r) { return en() ? (r.en || r.name) : r.name; }
function normName(n) { n = (n || '').trim(); return SYN[n] || SYN[n.toLowerCase()] || n; }
function findCard(n) {
  const k = normName(n); const kl = k.toLowerCase();
  return S.cards.find(c => c.name === k) || S.cards.find(c => (c.en || '').toLowerCase() === kl);
}
function dleft(it) { return diffDays(today(), it.exp); }
function warnOf(it) { return dleft(it) <= (it.labeled ? S.settings.warnLabel : S.settings.warnGuess); }
function usable(it) { return it.qty > 0.0001 && (dleft(it) >= 0 || it.keep); }
function dayTag(it) {
  const d = dleft(it);
  if (d < 0) return '<span class="tag red">' + (it.keep ? L('已过期·保留','kept') : L('过期' + (-d) + '天', (-d) + 'd ago')) + '</span>';
  if (d === 0) return '<span class="tag red">' + L('今天','today') + '</span>';
  if (warnOf(it)) return '<span class="tag">' + (d === 1 ? L('明天','1d') : L(d + '天', d + 'd')) + '</span>';
  return '<span class="tag gray">' + (d > 365 ? L('很久','1y+') : L(d + '天', d + 'd')) + '</span>';
}
function addToShop(name, cardId, silent) {
  if (S.shop.some(s => !s.done && (s.cardId ? s.cardId === cardId : s.name === name))) return false;
  const c = cardId ? cardOf(cardId) : findCard(name);
  S.shop.push({ id:uid(), name: c ? c.name : name, cardId: c ? c.id : null, channel: c ? c.channel : '其他', done:false });
  return true;
}
function newItem(c, qty, unit, exp, labeled, expType, loc) {
  return { id:uid(), cardId:c.id, qty, unit, buy:today(), exp, labeled:!!labeled, expType:expType || 'BB', opened:null, loc:loc || c.loc, frozen:(loc || c.loc) === '冷冻', keep:false };
}
function logIt(type, name, extra) { S.logs.unshift(Object.assign({ t:type, n:name, d:today() }, extra || {})); if (S.logs.length > 600) S.logs.length = 600; }
function removeItem(it, why) {
  S.items = S.items.filter(x => x.id !== it.id);
  const c = cardOf(it.cardId);
  if (why === 'waste') S.waste.push({ d:today(), n:c ? c.name : '?' });
  logIt(why === 'waste' ? 'waste' : 'used', c ? c.name : '?');
  if (why === 'used' && c && !c.staple && !S.items.some(x => x.cardId === c.id)) addToShop(c.name, c.id);
  if (why === 'used' && c && c.staple && !S.items.some(x => x.cardId === c.id)) addToShop(c.name, c.id);
}

// ================= 推荐算法 =================
function itemMatch(it, need) { const c = cardOf(it.cardId); return c && (c.name === need || c.group === need); }
function makePool(withReserved, except) {
  const pool = S.items.filter(usable).map(it => ({ it, left:it.qty }));
  if (withReserved) S.reserved.forEach(rv => { if (rv.id === except) return; const r = S.recipes.find(x => x.id === rv.rid); if (r) evalR(r, rv.serv, pool); });
  return pool;
}
function clonePool(p) { return p.map(x => ({ it:x.it, left:x.left })); }
function evalR(r, serv, pool, depth) {
  depth = depth || 0;
  const factor = (serv || r.serve || 1) / (r.serve || 1);
  const missing = [], used = [], vague = [];
  for (const g of r.ings) {
    if (g.ref) {
      const sub = S.recipes.find(x => x.id === g.ref);
      if (!sub || depth > 3) { if (!g.opt) missing.push({ n:g.n }); continue; }
      const res = evalR(sub, sub.serve, pool, depth + 1);
      if (res.missing.length) { if (!g.opt) missing.push({ n:sub.name, sub:true }); }
      else { used.push.apply(used, res.used); vague.push.apply(vague, res.vague); }
      continue;
    }
    const need = normName(g.n);
    const cands = pool.filter(p => p.left > 0.0001 && itemMatch(p.it, need)).sort((a, b) => a.it.exp < b.it.exp ? -1 : 1);
    if (!cands.length) { if (!g.opt) missing.push({ n:need, q:g.q != null ? g.q * factor : null, u:g.u }); continue; }
    if (g.q == null) { used.push({ n:need, p:cands[0], presence:true }); continue; }
    const want = conv(g.q * factor, g.u);
    const same = cands.filter(p => conv(1, p.it.unit).f === want.f);
    if (!same.length) { used.push({ n:need, p:cands[0], presence:true }); vague.push(need); continue; }
    const total = same.reduce((s, p) => s + conv(p.left, p.it.unit).v, 0);
    if (total + 1e-6 < want.v) {
      if (!g.opt) { const per = conv(1, g.u).v || 1; missing.push({ n:need, short:(want.v - total) / per, u:g.u }); }
      continue;
    }
    let rem = want.v;
    for (const p of same) {
      if (rem <= 1e-9) break;
      const per = conv(1, p.it.unit).v; const take = Math.min(p.left * per, rem);
      p.left -= take / per; rem -= take; used.push({ n:need, p, take:take / per });
    }
  }
  return { missing, used, vague };
}
function passFilter(r) {
  const f = ui.f;
  if (f.time && r.min > f.time) return false;
  if (f.type && !(r.tags || []).includes(f.type)) return false;
  if (f.meal && !(r.meal || []).includes(f.meal)) return false;
  if (f.diff && r.diff !== f.diff) return false;
  if (f.must) { const k = normName(f.must); if (!r.ings.some(g => normName(g.n) === k || (findCard(g.n) || {}).group === k)) return false; }
  return true;
}
function recommend(pool, useFilter) {
  const out = [];
  for (const r of S.recipes) {
    if (useFilter && !passFilter(r)) continue;
    const serv = ui.serv || r.serve;
    const res = evalR(r, serv, clonePool(pool));
    const req = r.ings.filter(g => !g.opt).length || 1;
    const m = res.missing.length;
    let urg = 0; const soon = [];
    res.used.forEach(u => { const it = u.p && u.p.it; if (!it) return; const d = dleft(it); if (d <= 3) { urg += Math.max(1, 4 - d); const n = nm(cardOf(it.cardId)); if (!soon.includes(n)) soon.push(n); } });
    const score = urg * 3 + (req - m) / req * 10 + (r.fav ? 1 : 0);
    let reason = '';
    if (soon.length) reason = L('能用掉快过期的 ', 'Uses up ') + soon.join('、');
    else if (!m) reason = L('原料全齐', 'All ingredients ready');
    out.push({ r, res, serv, can: m === 0, near: m > 0 && m <= 2, score, reason });
  }
  return out.sort((a, b) => b.score - a.score);
}
function missText(ms) {
  return ms.map(x => {
    const n = x.sub ? x.n : dn(x.n);
    return x.short ? n + L(' 差', ' short ') + fq(x.short) + uName(x.u) : n;
  }).join('、');
}
function cook(rid, serv) {
  const r = S.recipes.find(x => x.id === rid); if (!r) return;
  const before = snap();
  const pool = S.items.filter(usable).map(it => ({ it, left:it.qty }));
  const res = evalR(r, serv, pool);
  res.used.forEach(u => { if (u.take) u.p.it.qty = Math.round((u.p.it.qty - u.take) * 1000) / 1000; });
  S.items.filter(it => it.qty <= 0.0001).forEach(it => removeItem(it, 'used'));
  r.last = today();
  logIt('cook', r.name);
  save(); render();
  const vague = Array.from(new Set(res.vague)).map(dn);
  toast(L('已扣库存：', 'Deducted: ') + rn(r) + (vague.length ? L('。单位对不上没扣：', '. Not deducted: ') + vague.join('、') : ''), before);
}

// ================= 页面 =================
function render() {
  document.documentElement.lang = en() ? 'en' : 'zh';
  const pages = { home:pHome, inv:pInv, rec:pRec, shop:pShop };
  const nav = [['home','home',L('首页','Home')],['inv','fridge',L('库存','Pantry')],['rec','book',L('菜谱','Recipes')],['shop','cart',L('购物','Shopping')]];
  document.getElementById('app').innerHTML = pages[ui.tab]() +
    '<nav class="nav">' + nav.map(n => '<button data-a="tab" data-v="' + n[0] + '" class="' + (ui.tab === n[0] ? 'on' : '') + '">' + svg(n[1]) + n[2] + '</button>').join('') + '</nav>' +
    (ui.tab !== 'rec' && !ui.batch ? '<button class="fab" data-a="openAdd" aria-label="add">' + svg('plus') + '</button>' : '');
  renderSheet();
  bindSwipe();
}

function pHome() {
  const d = new Date();
  const wk = en() ? d.toLocaleDateString('en-AU', { weekday:'short', month:'short', day:'numeric' }) : (d.getMonth() + 1) + '月' + d.getDate() + '日 周' + '日一二三四五六'[d.getDay()];
  const exp = S.items.filter(warnOf).sort((a, b) => a.exp < b.exp ? -1 : 1);
  const pool = makePool(true);
  const recs = recommend(pool, false);
  const can = recs.filter(x => x.can).slice(0, 4);
  const nearN = recs.filter(x => x.near).length;
  const cnt = {}; S.items.forEach(i => cnt[i.loc] = (cnt[i.loc] || 0) + 1);
  let h = '<div class="top"><div><h1>' + L('冰箱日记','Fridge Diary') + '</h1><div class="mut">' + wk + ' · ' + L('库存 ' + S.items.length + ' 样', S.items.length + ' items') + '</div></div><button class="ibtn" data-a="settings">' + svg('gear') + '</button></div>';
  // 快过期
  h += '<div class="card"><h2 style="color:var(--acc)">' + svg('alert') + L('快过期','Use soon') + '</h2>';
  if (!exp.length) h += '<div class="mut">' + L('没有快过期的东西','Nothing expiring soon') + '</div>';
  exp.forEach(it => {
    const c = cardOf(it.cardId); const dd = dleft(it);
    h += '<div class="li"><span class="sp" data-a="item" data-id="' + it.id + '">' + esc(nm(c)) + ' <span class="mut">' + fq(it.qty) + uName(it.unit) + '</span></span>' + dayTag(it);
    if (dd < 0 && !it.keep) h += '<button class="btn sm red" data-a="waste" data-id="' + it.id + '">' + L('扔了','Toss') + '</button><button class="btn sm" data-a="keep" data-id="' + it.id + '">' + L('还能吃','Still ok') + '</button>';
    h += '</div>';
  });
  h += '</div>';
  // 今天能做
  h += '<div class="card"><h2>' + svg('chef') + L('今天能做','Cook today') + '<span class="sp"></span><button class="btn sm" data-a="random">' + svg('dice').replace('<svg', '<svg style="width:16px;height:16px"') + L('随机','Random') + '</button></h2>';
  if (!can.length) h += '<div class="mut">' + (S.items.length ? L('原料还不够做任何一道菜', 'Not enough for any recipe yet') : L('先录入家里的食材吧', 'Add your groceries first')) + '</div>';
  can.forEach(x => h += '<div class="li" data-a="recipe" data-id="' + x.r.id + '"><span class="sp">' + esc(rn(x.r)) + (x.reason ? '<div class="mut">' + esc(x.reason) + '</div>' : '') + '</span><span class="mut">' + x.r.min + L(' 分钟',' min') + '</span></div>');
  if (nearN) h += '<div class="li" data-a="tab" data-v="rec"><span class="sp mut">' + L('还有 ' + nearN + ' 道差一两样', nearN + ' more need 1–2 items') + '</span><span class="mut">›</span></div>';
  h += '</div>';
  // 待选栏
  if (S.reserved.length) {
    h += '<div class="card"><h2>' + svg('list') + L('待选栏','Planned') + ' · ' + S.reserved.length + '</h2>';
    S.reserved.forEach(rv => { const r = S.recipes.find(x => x.id === rv.rid); if (!r) return;
      h += '<div class="li"><span class="sp" data-a="recipe" data-id="' + r.id + '">' + esc(rn(r)) + ' <span class="mut">' + rv.serv + L('人份',' serv') + '</span></span><button class="btn sm pri" data-a="cookRes" data-id="' + rv.id + '">' + L('做好了','Done') + '</button><button class="btn sm" data-a="unres" data-id="' + rv.id + '">' + L('移出','Remove') + '</button></div>'; });
    h += '</div>';
  }
  // 库存概览
  h += '<div class="card"><h2>' + svg('fridge') + L('库存','Pantry') + '<span class="sp"></span><button class="btn sm" data-a="freeCook">' + L('随手做','Freestyle') + '</button></h2><div class="stats">' +
    LOCS.map(l => '<div class="stat" data-a="invLoc" data-v="' + l + '"><b>' + (cnt[l] || 0) + '</b><span class="mut">' + locN(l) + '</span></div>').join('') +
    '<div class="stat" data-a="tab" data-v="shop"><b>' + S.shop.filter(s => !s.done).length + '</b><span class="mut">' + L('待买','To buy') + '</span></div></div></div>';
  return h;
}

function invListHtml() {
  const q = ui.invSearch.trim().toLowerCase();
  let items = S.items.filter(it => { const c = cardOf(it.cardId); if (!c) return false;
    if (ui.invLoc !== '全部' && it.loc !== ui.invLoc) return false;
    return !q || c.name.includes(q) || (c.en || '').toLowerCase().includes(q); });
  items.sort((a, b) => a.exp < b.exp ? -1 : 1);
  const stapleBtn = !S.items.some(i => (cardOf(i.cardId) || {}).staple) ? '<button class="btn full" style="margin-top:8px" data-a="addStaples">' + L('一键添加常备调料（盐、糖、生抽等）','Add basic seasonings') + '</button>' : '';
  if (!items.length) return '<div class="empty">' + (S.items.length ? L('没有找到','No match') : L('冰箱还是空的。点右下角 + 开始录入。','Empty. Tap + to add.')) + '</div>' + stapleBtn;
  const locs = ui.invLoc === '全部' ? LOCS : [ui.invLoc];
  let h = '';
  locs.forEach(l => {
    const arr = items.filter(i => i.loc === l); if (!arr.length) return;
    h += '<div class="sec">' + locN(l) + ' · ' + arr.length + '</div><div class="card" style="padding:4px 0">';
    arr.forEach(it => {
      const c = cardOf(it.cardId);
      const flags = (it.opened ? ' <span class="tag gray">' + L('已开封','opened') + '</span>' : '') + (it.expType === 'UB' && it.labeled ? ' <span class="tag gray">Use by</span>' : '');
      h += '<div class="swipe" data-sw="' + it.id + '"><div class="under">' + L('用完','Used up') + '</div><div class="inner"><div class="li" style="padding:8px 12px;border:0">' +
        (ui.batch ? '<span data-a="sel" data-id="' + it.id + '" style="width:22px;height:22px;border-radius:7px;border:1.5px solid ' + (ui.sel.has(it.id) ? 'var(--acc);background:var(--acc);color:#fff' : 'var(--line)') + ';display:inline-flex;align-items:center;justify-content:center">' + (ui.sel.has(it.id) ? svg('check').replace('<svg', '<svg style="width:14px"') : '') + '</span>' : '') +
        '<span class="sp" data-a="item" data-id="' + it.id + '">' + esc(nm(c)) + flags + '</span>' +
        '<span class="step"><button data-a="dec" data-id="' + it.id + '">−</button><span>' + fq(it.qty) + uName(it.unit) + '</span><button data-a="inc" data-id="' + it.id + '">+</button></span>' + dayTag(it) +
        '</div></div></div>';
    });
    h += '</div>';
  });
  return h + stapleBtn;
}
function pInv() {
  const n = S.items.length, soon = S.items.filter(warnOf).length;
  let h = '<div class="top"><div><h1>' + L('我的库存','My pantry') + '</h1><div class="mut">' + L('共 ' + n + ' 样，' + soon + ' 样快过期', n + ' items, ' + soon + ' expiring') + '</div></div>' +
    '<div class="row"><button class="btn sm" data-a="freeCook">' + L('随手做','Freestyle') + '</button><button class="btn sm" data-a="batch">' + (ui.batch ? L('完成','Done') : L('批量','Select')) + '</button></div></div>';
  h += '<input id="invSearch" placeholder="' + L('搜索食材','Search') + '" value="' + esc(ui.invSearch) + '" style="margin-bottom:8px">';
  h += '<div class="scroll-x">' + ['全部'].concat(LOCS).map(l => '<button class="chip ' + (ui.invLoc === l ? 'on' : '') + '" data-a="invLoc" data-v="' + l + '">' + (l === '全部' ? L('全部','All') : locN(l)) + '</button>').join('') + '</div>';
  h += '<div class="mut" style="margin:6px 2px">' + L('左滑一行 = 用完','Swipe left = used up') + '</div>';
  h += '<div id="invList">' + invListHtml() + '</div>';
  if (ui.batch) h += '<div class="bar" style="position:fixed;left:0;right:0;bottom:calc(64px + env(safe-area-inset-bottom));padding:10px 16px;justify-content:center;z-index:22"><button class="btn red" data-a="batchDel">' + L('删除','Delete') + ' (' + ui.sel.size + ')</button><button class="btn" data-a="batchShop">' + L('加入购物清单','Add to list') + '</button></div>';
  return h;
}

function recCard(x) {
  const r = x.r;
  return '<div class="rc" data-a="recipe" data-id="' + r.id + '"><div class="row"><span class="nm sp">' + (r.fav ? '<span style="color:var(--acc)">★</span> ' : '') + esc(rn(r)) + '</span><span class="mut">' + r.min + L('分钟','min') + ' · ' + diffN(r.diff) + '</span></div>' +
    (x.reason ? '<div class="mut ok">' + esc(x.reason) + '</div>' : '') +
    (x.res.missing.length ? '<div class="mut no">' + L('缺：','Need: ') + esc(missText(x.res.missing)) + '</div>' : '') +
    '<div class="row" style="margin-top:6px"><span class="chips sp">' + (r.tags || []).map(t => '<span class="tag gray">' + tagN(t) + '</span>').join('') + '</span>' +
    (x.can ? '<button class="btn sm pri" data-a="reserve" data-id="' + r.id + '">' + L('加入待选','Plan') + '</button>' : '<button class="btn sm" data-a="missShop" data-id="' + r.id + '">' + L('缺的加清单','Add missing') + '</button>') + '</div></div>';
}
function pRec() {
  let h = '<div class="top"><h1>' + L('菜谱','Recipes') + '</h1><div class="row"><button class="btn sm" data-a="combo">' + L('一顿饭组合','Meal combo') + '</button><button class="ibtn" data-a="newRecipe" aria-label="new">' + svg('plus') + '</button></div></div>';
  h += '<div class="chips" style="margin-bottom:10px"><button class="chip ' + (ui.recTab === 'rec' ? 'on' : '') + '" data-a="recTab" data-v="rec">' + L('能做什么','What can I cook') + '</button><button class="chip ' + (ui.recTab === 'all' ? 'on' : '') + '" data-a="recTab" data-v="all">' + L('全部菜谱','All recipes') + ' (' + S.recipes.length + ')</button></div>';
  if (ui.recTab === 'rec') {
    const f = ui.f;
    const chipRow = (key, opts, labelFn) => '<div class="scroll-x" style="margin-bottom:6px">' + opts.map(o => '<button class="chip ' + (f[key] === o[0] ? 'on' : '') + '" data-a="filt" data-k="' + key + '" data-v="' + o[0] + '">' + o[1] + '</button>').join('') + '</div>';
    h += chipRow('time', [[0, L('不限时间','Any time')], [15, '≤15' + L('分钟','min')], [30, '≤30' + L('分钟','min')], [60, '≤60' + L('分钟','min')]]);
    h += chipRow('type', [['', L('全部','All')]].concat(TAGS.map(t => [t, tagN(t)])));
    h += chipRow('meal', [['', L('全部餐次','Any meal')]].concat(MEALS.map(t => [t, mealN(t)])));
    h += chipRow('diff', [['', L('全部难度','Any level')]].concat(DIFFS.map(t => [t, diffN(t)])));
    h += '<div class="row" style="margin:6px 0 4px"><input id="mustIn" list="cardList" placeholder="' + L('必须用到的食材（可空）','Must include (optional)') + '" value="' + esc(f.must) + '" style="flex:1">' +
      '<span class="step"><button data-a="serv" data-v="-1">−</button><span>' + (ui.serv ? ui.serv + L('人份',' serv') : L('原份量','default')) + '</span><button data-a="serv" data-v="1">+</button></span></div>';
    h += datalist();
    h += '<div id="recList">' + recListHtml() + '</div>';
  } else {
    h += '<input id="recSearch" placeholder="' + L('搜索菜谱','Search recipes') + '" value="' + esc(ui.recSearch) + '" style="margin-bottom:8px">';
    h += '<div id="recList">' + allListHtml() + '</div>';
  }
  return h;
}
function recListHtml() {
  const recs = recommend(makePool(true), true);
  const can = recs.filter(x => x.can), near = recs.filter(x => x.near);
  let h = '<div class="sec">' + svg('check').replace('<svg', '<svg style="width:16px"') + L('能做','Ready') + ' · ' + can.length + '</div>';
  h += can.length ? can.map(recCard).join('') : '<div class="empty">' + L('现在的库存还做不了','Nothing ready with current stock') + '</div>';
  h += '<div class="sec">' + L('差一两样','Need 1–2 more') + ' · ' + near.length + '</div>';
  h += near.length ? near.map(recCard).join('') : '<div class="empty">—</div>';
  if (S.reserved.length) h += '<div class="mut" style="text-align:center;margin-top:8px">' + L('已扣掉待选栏里 ' + S.reserved.length + ' 道菜要用的原料', 'Excludes ingredients for ' + S.reserved.length + ' planned') + '</div>';
  return h;
}
function allListHtml() {
  const q = ui.recSearch.trim().toLowerCase();
  const list = S.recipes.filter(r => !q || r.name.includes(q) || (r.en || '').toLowerCase().includes(q))
    .sort((a, b) => (b.fav - a.fav) || a.name.localeCompare(b.name, 'zh'));
  return list.map(r => '<div class="rc" data-a="recipe" data-id="' + r.id + '"><div class="row"><span class="nm sp">' + (r.fav ? '<span style="color:var(--acc)">★</span> ' : '') + esc(rn(r)) + (r.custom ? ' <span class="tag">' + L('自创','mine') + '</span>' : '') + '</span><span class="mut">' + (r.last ? L('上次 ', 'last ') + r.last.slice(5) : L('还没做过','never')) + '</span></div></div>').join('') || '<div class="empty">—</div>';
}
function datalist() {
  return '<datalist id="cardList">' + S.cards.map(c => '<option value="' + esc(nm(c)) + '">').join('') + '</datalist>';
}

function lowStock() {
  return S.cards.filter(c => c.min > 0).filter(c => {
    const tot = S.items.filter(i => i.cardId === c.id && usable(i)).reduce((s, i) => s + (conv(i.qty, i.unit).f === conv(1, c.unit).f ? conv(i.qty, i.unit).v : 0), 0);
    return tot < conv(c.min, c.unit).v && !S.shop.some(s => !s.done && s.cardId === c.id);
  });
}
function pShop() {
  const au = S.settings.country === 'AU';
  const list = S.shop.filter(s => !s.done);
  let h = '<div class="top"><div><h1>' + L('购物清单','Shopping list') + '</h1><div class="mut">' + (au ? L('澳洲模式 · 按渠道分组','Australia · grouped by store') : L('中国模式','China mode')) + '</div></div></div>';
  h += '<div class="row" style="margin-bottom:10px"><input id="shopIn" list="cardList" placeholder="' + L('加一样要买的','Add an item') + '"><button class="btn pri" data-a="shopAdd">' + L('加','Add') + '</button></div>' + datalist();
  const low = lowStock();
  if (low.length) h += '<div class="card"><h2>' + L('常备品不够了','Running low') + '</h2>' + low.map(c => '<div class="li"><span class="sp">' + esc(nm(c)) + '</span><button class="btn sm" data-a="shopCard" data-id="' + c.id + '">' + L('加入','Add') + '</button></div>').join('') + '</div>';
  const row = s => '<div class="li"><button data-a="shopTick" data-id="' + s.id + '" style="width:24px;height:24px;border-radius:50%;border:1.5px solid var(--acc)"></button><span class="sp">' + esc(s.cardId ? nm(cardOf(s.cardId)) : s.name) + '</span>' +
    (au ? '<select data-ch="' + s.id + '" style="width:auto;padding:3px 6px;font-size:12px">' + CHANNELS.map(c => '<option value="' + c + '"' + (s.channel === c ? ' selected' : '') + '>' + chN(c) + '</option>').join('') + '</select>' : '') +
    '<button class="ibtn" style="width:28px;height:28px" data-a="shopDel" data-id="' + s.id + '">' + svg('x') + '</button></div>';
  if (!list.length) h += '<div class="empty">' + L('清单是空的','Nothing to buy') + '</div>';
  else if (au) CHANNELS.forEach(ch => { const arr = list.filter(s => (s.channel || '其他') === ch); if (arr.length) h += '<div class="sec">' + chN(ch) + '</div><div class="card" style="padding:4px 14px">' + arr.map(row).join('') + '</div>'; });
  else h += '<div class="card" style="padding:4px 14px">' + list.map(row).join('') + '</div>';
  return h;
}

// ================= 弹层 =================
function openSheet(o) { ui.sheet = o; renderSheet(); }
function closeSheet() { ui.sheet = null; renderSheet(); render(); }
function hd(title, back) { return '<div class="hd">' + (back ? '<button class="ibtn" data-a="' + back + '">' + svg('back') + '</button>' : '<span style="width:38px"></span>') + '<h2>' + title + '</h2><button class="ibtn" data-a="close">' + svg('x') + '</button></div>'; }
function renderSheet() {
  const el = document.getElementById('sheet');
  const s = ui.sheet;
  if (!s) { el.innerHTML = ''; document.body.style.overflow = ''; return; }
  document.body.style.overflow = 'hidden';
  const fns = { add:sAdd, adjust:sAdjust, newCard:sNewCard, item:sItem, recipe:sRecipe, edit:sEdit, pick:sPick, free:sFree, settings:sSettings, cards:sCards, card:sCard, stats:sStats, combo:sCombo, scan:sScan };
  el.innerHTML = '<div class="ov" data-a="ovClose"><div class="sheet" data-stop="1">' + fns[s.type](s) + '</div></div>';
  if (s.type === 'scan') startScan();
}

// --- 采购模式 ---
function sAdd() {
  const q = ui.addSearch.trim();
  const total = Object.values(ui.basket).length;
  let h = hd(L('录入','Add groceries'));
  h += '<div class="row" style="margin-bottom:8px"><input id="addSearch" placeholder="' + L('搜索或输入新食材','Search or type new') + '" value="' + esc(q) + '">' +
    '<button class="btn" data-a="scan">' + svg('scan').replace('<svg', '<svg style="width:18px;height:18px"') + '</button></div>';
  h += '<div class="scroll-x" style="margin-bottom:8px">' + [''].concat(CATS).map(c => '<button class="chip ' + (ui.addCat === c ? 'on' : '') + '" data-a="addCat" data-v="' + c + '">' + (c ? catN(c) : L('常买','Frequent')) + '</button>').join('') + '</div>';
  h += '<div id="addGrid">' + addGridHtml() + '</div>';
  h += '<div class="mut" style="text-align:center;margin:8px 0">' + L('点一下加一份 · 长按改数量和保质期','Tap = add one · Long-press = adjust') + '</div>';
  h += '<div class="bar"><button class="btn full pri" data-a="addDone">' + L('完成入库','Save') + (total ? ' (' + total + L(' 样',' items') + ')' : '') + '</button></div>';
  return h;
}
function addGridHtml() {
  const q = ui.addSearch.trim(); const ql = q.toLowerCase(); const nq = normName(q);
  let cards = S.cards.slice();
  if (q) cards = cards.filter(c => c.name.includes(q) || c.name === nq || (c.en || '').toLowerCase().includes(ql));
  else if (ui.addCat) cards = cards.filter(c => c.cat === ui.addCat);
  cards.sort((a, b) => (b.uses - a.uses) || (CATS.indexOf(a.cat) - CATS.indexOf(b.cat)));
  if (!q && !ui.addCat) cards = cards.slice(0, 30);
  let h = '<div class="grid">' + cards.map(c => { const b = ui.basket[c.id];
    return '<div class="fc ' + (b ? 'on' : '') + '" data-lp="' + c.id + '">' + esc(nm(c)) + '<div class="sub">' + fq(b ? b.qty : c.qty) + uName(b ? b.unit : c.unit) + '</div>' + (b ? '<span class="badge">×' + b.n + '</span>' : '') + '</div>'; }).join('') + '</div>';
  if (q && !S.cards.some(c => c.name === q || c.name === nq)) h += '<button class="btn full" style="margin-top:8px" data-a="newCard">' + L('新建「' + esc(q) + '」','Create "' + esc(q) + '"') + '</button>';
  return h;
}
function tapCard(id) {
  const c = cardOf(id); if (!c) return;
  if (ui.pendingCode) { c.barcode = ui.pendingCode; ui.pendingCode = null; save(); toast(L('已记住这个条码','Barcode saved')); }
  const b = ui.basket[id];
  if (b) b.n++; else ui.basket[id] = { n:1, qty:c.qty, unit:c.unit, shelf:c.shelf, exp:null, labeled:false, expType:'BB', loc:c.loc };
  document.getElementById('addGrid').innerHTML = addGridHtml();
  const btn = document.querySelector('[data-a=addDone]'); if (btn) btn.textContent = L('完成入库','Save') + ' (' + Object.keys(ui.basket).length + L(' 样',' items') + ')';
}
function sAdjust(s) {
  const c = cardOf(s.id); const b = ui.basket[s.id] || { n:1, qty:c.qty, unit:c.unit, shelf:c.shelf, exp:null, labeled:false, expType:'BB', loc:c.loc };
  s.b = s.b || JSON.parse(JSON.stringify(b));
  const B = s.b;
  let h = hd(esc(nm(c)), 'backAdd');
  h += '<div class="field"><label>' + L('买了几份','How many') + '</label><span class="step"><button data-a="adj" data-k="n" data-v="-1">−</button><span>' + B.n + '</span><button data-a="adj" data-k="n" data-v="1">+</button></span></div>';
  h += '<div class="field"><label>' + L('每份多少','Amount each') + '</label><div class="row"><input id="adjQty" type="number" inputmode="decimal" value="' + B.qty + '" style="width:110px"><select id="adjUnit" style="width:100px">' + UNITS.map(u => '<option value="' + u + '"' + (B.unit === u ? ' selected' : '') + '>' + uName(u) + '</option>').join('') + '</select></div></div>';
  h += '<div class="field"><label>' + L('到期日','Expiry') + '</label><div class="chips" style="margin-bottom:6px"><button class="chip ' + (!B.labeled ? 'on' : '') + '" data-a="adj" data-k="labeled" data-v="0">' + L('按天数估算','Estimate') + '</button><button class="chip ' + (B.labeled ? 'on' : '') + '" data-a="adj" data-k="labeled" data-v="1">' + L('包装上的日期','Date on pack') + '</button></div>';
  if (B.labeled) h += '<input id="adjExp" type="date" value="' + (B.exp || addDays(today(), B.shelf)) + '"><div class="chips" style="margin-top:6px"><button class="chip ' + (B.expType === 'BB' ? 'on' : '') + '" data-a="adj" data-k="expType" data-v="BB">Best before</button><button class="chip ' + (B.expType === 'UB' ? 'on' : '') + '" data-a="adj" data-k="expType" data-v="UB">Use by</button></div>';
  else h += '<div class="row"><span class="step"><button data-a="adj" data-k="shelf" data-v="-1">−</button><span>' + B.shelf + L(' 天',' d') + '</span><button data-a="adj" data-k="shelf" data-v="1">+</button></span><span class="mut">' + L('下次买会记住这个天数','Remembered next time') + '</span></div>';
  h += '</div><div class="field"><label>' + L('放在哪','Where') + '</label><div class="chips">' + LOCS.map(l => '<button class="chip ' + (B.loc === l ? 'on' : '') + '" data-a="adj" data-k="loc" data-v="' + l + '">' + locN(l) + '</button>').join('') + '</div></div>';
  h += '<div class="bar"><button class="btn" data-a="adjRemove">' + L('不买这个','Remove') + '</button><button class="btn pri sp" data-a="adjOk">' + L('好了','OK') + '</button></div>';
  return h;
}
function readAdj() {
  const B = ui.sheet.b; const q = document.getElementById('adjQty'), u = document.getElementById('adjUnit'), e = document.getElementById('adjExp');
  if (q) B.qty = parseFloat(q.value) || B.qty; if (u) B.unit = u.value; if (e && e.value) B.exp = e.value;
}
function addDone() {
  const ids = Object.keys(ui.basket); if (!ids.length) { closeSheet(); return; }
  const before = snap();
  ids.forEach(id => {
    const c = cardOf(id); const b = ui.basket[id]; if (!c) return;
    const exp = b.labeled && b.exp ? b.exp : addDays(today(), b.shelf);
    if (!b.labeled) c.shelf = b.shelf;
    c.qty = b.qty; c.unit = b.unit; c.uses = (c.uses || 0) + 1;
    let e2 = exp; if (b.loc === '冷冻' && c.loc !== '冷冻') e2 = addDays(today(), Math.max(diffDays(today(), exp), FREEZE[c.cat] || 60));
    S.items.push(newItem(c, b.qty * b.n, b.unit, e2, b.labeled, b.expType, b.loc));
    logIt('buy', c.name, { q:b.qty * b.n, u:b.unit });
  });
  ui.basket = {}; ui.addSearch = ''; save();
  closeSheet();
  toast(L('已入库 ' + ids.length + ' 样', ids.length + ' added'), before);
}
function sNewCard(s) {
  let h = hd(L('新食材','New item'), 'backAdd');
  h += '<div class="field"><label>' + L('名字','Name') + '</label><input id="ncName" value="' + esc(s.name || '') + '"></div>';
  h += '<div class="field"><label>' + L('英文名（可空）','English name (optional)') + '</label><input id="ncEn" value=""></div>';
  h += '<div class="field"><label>' + L('选个类别，保质期和位置会自动填','Pick a category') + '</label><div class="chips">' + CATS.map(c => '<button class="chip" data-a="ncCat" data-v="' + c + '">' + catN(c) + '</button>').join('') + '</div></div>';
  return h;
}

// --- 库存单项 ---
function sItem(s) {
  const it = S.items.find(x => x.id === s.id); if (!it) return hd('');
  const c = cardOf(it.cardId);
  let h = hd(esc(nm(c)));
  h += '<div class="field"><label>' + L('数量','Amount') + '</label><div class="row"><input id="itQty" type="number" inputmode="decimal" value="' + fq(it.qty) + '" style="width:110px"><select id="itUnit" style="width:100px">' + UNITS.map(u => '<option value="' + u + '"' + (it.unit === u ? ' selected' : '') + '>' + uName(u) + '</option>').join('') + '</select></div></div>';
  h += '<div class="field"><label>' + L('到期日','Expiry') + ' · ' + L('买于 ','bought ') + it.buy + '</label><input id="itExp" type="date" value="' + it.exp + '"><div class="chips" style="margin-top:6px">' +
    '<button class="chip ' + (it.labeled ? 'on' : '') + '" data-a="itSet" data-k="labeled">' + L('包装标注的日期','From label') + '</button>' +
    '<button class="chip ' + (it.expType === 'UB' ? 'on' : '') + '" data-a="itSet" data-k="ub">Use by</button>' +
    '<button class="chip ' + (it.opened ? 'on' : '') + '" data-a="itSet" data-k="opened">' + (it.opened ? L('已开封 ', 'Opened ') + it.opened.slice(5) : L('标记开封','Mark opened')) + '</button></div></div>';
  h += '<div class="field"><label>' + L('放在哪','Where') + '</label><div class="chips">' + LOCS.map(l => '<button class="chip ' + (it.loc === l ? 'on' : '') + '" data-a="itLoc" data-v="' + l + '">' + locN(l) + '</button>').join('') + '</div></div>';
  h += '<div class="chips" style="margin:14px 0"><button class="btn pri" data-a="itUsed">' + L('用完了','Used up') + '</button><button class="btn red" data-a="itWaste">' + L('扔掉','Toss') + '</button><button class="btn" data-a="itAgain">' + L('又买了一份','Bought again') + '</button><button class="btn" data-a="itShop">' + L('加购物清单','To list') + '</button></div>';
  h += '<button class="btn sm" data-a="itDel">' + L('删除记录（不算浪费）','Delete record') + '</button>';
  return h;
}
function saveItemFields() {
  const s = ui.sheet; if (!s || s.type !== 'item') return;
  const it = S.items.find(x => x.id === s.id); if (!it) return;
  const q = document.getElementById('itQty'), u = document.getElementById('itUnit'), e = document.getElementById('itExp');
  if (q && q.value !== '') it.qty = Math.max(0, parseFloat(q.value) || 0);
  if (u) it.unit = u.value; if (e && e.value) it.exp = e.value;
  save();
}

// --- 菜谱详情 ---
function sRecipe(s) {
  const r = S.recipes.find(x => x.id === s.id); if (!r) return hd('');
  s.serv = s.serv || ui.serv || r.serve;
  const pool = makePool(true);
  const res = evalR(r, s.serv, clonePool(pool));
  const missSet = new Set(res.missing.map(m => m.n));
  const factor = s.serv / r.serve;
  let h = hd(esc(rn(r)));
  h += '<div class="row" style="margin-bottom:8px"><span class="chips sp">' + (r.tags || []).map(t => '<span class="tag">' + tagN(t) + '</span>').join('') + '<span class="tag gray">' + diffN(r.diff) + '</span><span class="tag gray">' + r.min + L('分钟','min') + '</span></span>' +
    '<button class="ibtn" data-a="fav" data-id="' + r.id + '" style="color:' + (r.fav ? 'var(--acc)' : '#A3B3A8') + '">' + svg('star', r.fav) + '</button></div>';
  h += '<div class="card"><div class="row" style="margin-bottom:4px"><h2 class="sp">' + L('原料','Ingredients') + '</h2><span class="step"><button data-a="rServ" data-v="-1">−</button><span>' + s.serv + L('人份',' serv') + '</span><button data-a="rServ" data-v="1">+</button></span></div>';
  r.ings.forEach(g => {
    const n = g.ref ? (S.recipes.find(x => x.id === g.ref) || {}).name || g.n : normName(g.n);
    const card = findCard(n);
    const miss = missSet.has(n);
    const amt = g.q != null ? fq(g.q * factor) + uName(g.u) : (g.txt || L('适量','to taste'));
    h += '<div class="li"><span class="' + (miss ? 'no' : 'ok') + '" style="width:18px">' + (miss ? '✕' : (g.opt && !card ? '·' : '✓')) + '</span><span class="sp">' + esc(card ? nm(card) : (g.ref ? '@' + n : g.n)) + (g.opt ? ' <span class="mut">' + L('可选','optional') + '</span>' : '') + '</span><span class="mut">' + esc(amt) + '</span></div>';
  });
  if (r.kcal) h += '<div class="mut" style="margin-top:6px">' + L('每人约 ','Per serving ≈ ') + r.kcal + ' kcal · ' + L('蛋白质 ','protein ') + r.prot + 'g</div>';
  h += '</div>';
  if (res.missing.length) h += '<button class="btn full" style="margin-bottom:10px" data-a="missShop" data-id="' + r.id + '">' + L('缺的 ' + res.missing.length + ' 样加入购物清单', 'Add ' + res.missing.length + ' missing to list') + '</button>';
  h += '<div class="card"><h2>' + L('做法','Steps') + '</h2>' + (r.steps || []).map((t, i) => '<div class="li"><span class="tag">' + (i + 1) + '</span><span class="sp">' + esc(t) + '</span></div>').join('') + '</div>';
  h += '<div class="mut" style="margin-bottom:10px">' + (r.last ? L('上次做：','Last cooked: ') + r.last : L('还没做过','Never cooked')) + '</div>';
  h += '<div class="bar"><button class="btn" data-a="editRecipe" data-id="' + r.id + '">' + L('编辑','Edit') + '</button><button class="btn" data-a="cookMode" data-id="' + r.id + '">' + L('烹饪模式','Cook mode') + '</button><button class="btn pri sp" data-a="reserve" data-id="' + r.id + '">' + L('加入待选栏','Plan it') + '</button></div>';
  return h;
}

// --- 菜谱编辑 ---
function blankEdit() { return { id:null, name:'', en:'', ings:[], diff:'简单', tags:[], meal:['午','晚'], min:20, serve:2, kcal:'', prot:'', steps:'' }; }
function sEdit(s) {
  const E = s.e;
  let h = hd(E.id ? L('编辑菜谱','Edit recipe') : L('新菜谱','New recipe'));
  h += '<div class="field"><label>' + L('菜名','Name') + '</label><input data-e="name" value="' + esc(E.name) + '"></div>';
  h += '<div class="field"><label>' + L('英文名（可空）','English name (optional)') + '</label><input data-e="en" value="' + esc(E.en) + '"></div>';
  h += '<div class="field"><label>' + L('原料（写「任意肉」会按牛肉算）','Ingredients') + '</label>';
  E.ings.forEach((g, i) => {
    h += '<div class="ing-row"><input data-ei="' + i + '" data-k="n" value="' + esc(g.ref ? '@' + g.n : g.n) + '"' + (g.ref ? ' disabled' : '') + ' list="cardList">' +
      '<input data-ei="' + i + '" data-k="q" type="number" inputmode="decimal" placeholder="' + L('适量','any') + '" value="' + (g.q == null ? '' : g.q) + '">' +
      '<select data-ei="' + i + '" data-k="u"><option value=""></option>' + UNITS.concat(['勺','瓣','片']).map(u => '<option value="' + u + '"' + (g.u === u ? ' selected' : '') + '>' + uName(u) + '</option>').join('') + '</select>' +
      '<button class="chip ' + (g.opt ? 'on' : '') + '" style="padding:4px 0" data-a="eOpt" data-i="' + i + '">' + L('选','opt') + '</button>' +
      '<button class="ibtn" style="width:26px;height:26px" data-a="eDel" data-i="' + i + '">' + svg('x') + '</button></div>';
  });
  h += datalist() + '<div class="chips"><button class="btn sm" data-a="ePick">' + L('+ 从食材卡片选','+ From items') + '</button><button class="btn sm" data-a="eAddRow">' + L('+ 手写一行','+ Type one') + '</button><button class="btn sm" data-a="ePickRecipe">' + L('+ 引用另一道菜','+ Another recipe') + '</button></div></div>';
  const chipSet = (key, opts, fn, multi) => '<div class="chips">' + opts.map(o => { const on = multi ? E[key].includes(o) : E[key] === o; return '<button class="chip ' + (on ? 'on' : '') + '" data-a="eChip" data-k="' + key + '" data-v="' + o + '" data-m="' + (multi ? 1 : 0) + '">' + fn(o) + '</button>'; }).join('') + '</div>';
  h += '<div class="field"><label>' + L('难度','Difficulty') + '</label>' + chipSet('diff', DIFFS, diffN, false) + '</div>';
  h += '<div class="field"><label>' + L('标签','Tags') + '</label>' + chipSet('tags', TAGS, tagN, true) + '</div>';
  h += '<div class="field"><label>' + L('餐次','Meal') + '</label>' + chipSet('meal', MEALS, mealN, true) + '</div>';
  h += '<div class="row"><div class="field sp"><label>' + L('时间(分钟)','Minutes') + '</label><input data-e="min" type="number" value="' + E.min + '"></div><div class="field sp"><label>' + L('几人份','Serves') + '</label><input data-e="serve" type="number" value="' + E.serve + '"></div></div>';
  h += '<div class="row"><div class="field sp"><label>' + L('每人热量 kcal（可空）','kcal/serving') + '</label><input data-e="kcal" type="number" value="' + E.kcal + '"></div><div class="field sp"><label>' + L('蛋白质 g（可空）','Protein g') + '</label><input data-e="prot" type="number" value="' + E.prot + '"></div></div>';
  h += '<div class="field"><label>' + L('做法（一行一步，可空）','Steps (one per line)') + '</label><textarea data-e="steps" rows="5">' + esc(E.steps) + '</textarea></div>';
  h += '<div id="eErr" class="no mut"></div><div class="bar">' + (E.id ? '<button class="btn red" data-a="eRemove">' + L('删除','Delete') + '</button>' : '') + '<button class="btn pri sp" data-a="eSave">' + L('保存','Save') + '</button></div>';
  return h;
}
function sPick(s) {
  const q = (s.q || '').trim().toLowerCase();
  let h = hd(s.mode === 'recipe' ? L('选一道菜','Pick a recipe') : L('选食材（可多选）','Pick items'), 'backEdit');
  if (s.mode === 'recipe') {
    h += S.recipes.filter(r => r.id !== s.e.id).map(r => '<div class="rc" data-a="pickR" data-id="' + r.id + '">' + esc(rn(r)) + '</div>').join('');
    return h;
  }
  h += '<input id="pickSearch" placeholder="' + L('搜索','Search') + '" value="' + esc(s.q || '') + '" style="margin-bottom:8px"><div id="pickGrid">' + pickGridHtml(s) + '</div>';
  h += '<div class="bar"><button class="btn pri full" data-a="pickDone">' + L('加入 ','Add ') + s.sel.length + '</button></div>';
  return h;
}
function pickGridHtml(s) {
  const q = (s.q || '').trim().toLowerCase();
  return '<div class="grid">' + S.cards.filter(c => !q || c.name.includes(q) || (c.en || '').toLowerCase().includes(q)).map(c => '<div class="fc ' + (s.sel.includes(c.id) ? 'on' : '') + '" data-a="pickC" data-id="' + c.id + '">' + esc(nm(c)) + '<div class="sub">' + catN(c.cat) + '</div></div>').join('') + '</div>';
}
function readEdit() {
  const s = ui.sheet; if (!s || s.type !== 'edit') return;
  document.querySelectorAll('[data-e]').forEach(el => { s.e[el.dataset.e] = el.value; });
  document.querySelectorAll('[data-ei]').forEach(el => { const g = s.e.ings[+el.dataset.ei]; if (!g) return; const k = el.dataset.k;
    if (k === 'q') g.q = el.value === '' ? null : parseFloat(el.value); else if (k === 'n') { if (!g.ref) g.n = el.value; } else g[k] = el.value; });
}
function saveEdit() {
  readEdit(); const E = ui.sheet.e;
  const ings = E.ings.filter(g => (g.n || '').trim()).map(g => { const n = g.ref ? g.n : (findCard(g.n) ? findCard(g.n).name : normName(g.n));
    return { n, q:g.q == null || isNaN(g.q) ? null : g.q, u:g.q == null ? '' : (g.u || ''), txt:g.q == null ? (g.txt || '适量') : '', opt:!!g.opt, ref:g.ref || undefined }; });
  if (!E.name.trim()) { document.getElementById('eErr').textContent = L('先填菜名', 'Enter a name'); return; }
  if (!ings.length) { document.getElementById('eErr').textContent = L('至少加一样原料', 'Add at least one ingredient'); return; }
  const data = { name:E.name.trim(), en:E.en.trim(), ings, diff:E.diff, tags:E.tags, meal:E.meal, min:+E.min || 20, serve:+E.serve || 1, kcal:+E.kcal || 0, prot:+E.prot || 0,
    steps:E.steps.split('\n').map(x => x.trim()).filter(Boolean) };
  if (E.id) Object.assign(S.recipes.find(r => r.id === E.id), data);
  else S.recipes.push(Object.assign({ id:uid(), fav:false, last:null, custom:true }, data));
  save(); closeSheet(); toast(L('菜谱已保存','Recipe saved'));
}

// --- 随手做 ---
function sFree(s) {
  let h = hd(L('随手做：点你用了的','Freestyle: tap what you used'));
  const items = S.items.filter(usable).sort((a, b) => a.exp < b.exp ? -1 : 1);
  if (!items.length) return h + '<div class="empty">' + L('库存是空的','Pantry is empty') + '</div>';
  items.forEach(it => { const c = cardOf(it.cardId); const v = s.sel[it.id];
    h += '<div class="li"><span class="sp" data-a="freeT" data-id="' + it.id + '">' + (v != null ? '<b class="ok">✓</b> ' : '') + esc(nm(c)) + ' <span class="mut">' + L('有 ','have ') + fq(it.qty) + uName(it.unit) + '</span></span>' +
      (v != null ? '<span class="step"><button data-a="freeQ" data-id="' + it.id + '" data-v="-1">−</button><span>' + fq(v) + uName(it.unit) + '</span><button data-a="freeQ" data-id="' + it.id + '" data-v="1">+</button></span>' : '') + '</div>'; });
  h += '<div class="bar"><button class="btn pri full" data-a="freeDone">' + L('扣掉 ','Deduct ') + Object.keys(s.sel).length + L(' 样',' items') + '</button></div>';
  return h;
}
function freeDone() {
  const s = ui.sheet; const ids = Object.keys(s.sel); if (!ids.length) { closeSheet(); return; }
  const before = snap(); const ings = [];
  ids.forEach(id => { const it = S.items.find(x => x.id === id); if (!it) return; const v = Math.min(s.sel[id], it.qty);
    ings.push({ n:cardOf(it.cardId).name, q:v, u:it.unit, opt:false }); it.qty = Math.round((it.qty - v) * 1000) / 1000; });
  S.items.filter(it => it.qty <= 0.0001).forEach(it => removeItem(it, 'used'));
  logIt('cook', L('随手做','freestyle')); save(); ui.sheet = null; render();
  toast(L('已扣库存','Deducted'), before);
  ask(L('要把刚才做的存成菜谱吗？','Save this as a recipe?'), () => { const e = blankEdit(); e.ings = ings; openSheet({ type:'edit', e }); }, null, L('存成菜谱','Save recipe'), L('不用','No'));
}

// --- 一顿饭组合 ---
function sCombo() {
  const pool = makePool(true); const pick = [];
  [['荤', r => r.tags.includes('荤') && !r.tags.includes('汤')], ['素', r => r.tags.includes('素') && !r.tags.includes('汤')], ['汤', r => r.tags.includes('汤')]].forEach(([k, fn]) => {
    let best = null, bestScore = -1;
    S.recipes.filter(fn).forEach(r => { if (pick.some(p => p.r && p.r.id === r.id)) return; const p2 = clonePool(pool); const res = evalR(r, r.serve, p2);
      if (res.missing.length) return; let u = 0; res.used.forEach(x => { if (x.p) u += Math.max(0, 4 - dleft(x.p.it)); }); const sc = u + (r.fav ? 1 : 0) + Math.random() * 0.5;
      if (sc > bestScore) { bestScore = sc; best = { r, p2 }; } });
    if (best) { pick.push({ k, r:best.r }); pool.length = 0; best.p2.forEach(x => pool.push(x)); } else pick.push({ k, r:null });
  });
  ui.sheet.pick = pick.filter(p => p.r).map(p => p.r.id);
  let h = hd(L('一顿饭组合','Meal combo'));
  pick.forEach(p => h += '<div class="rc"' + (p.r ? ' data-a="recipe" data-id="' + p.r.id + '"' : '') + '><span class="tag">' + tagN(p.k) + '</span> ' + (p.r ? esc(rn(p.r)) : '<span class="mut">' + L('现在的库存凑不出来','None possible now') + '</span>') + '</div>');
  h += '<div class="bar"><button class="btn" data-a="combo">' + L('换一组','Shuffle') + '</button><button class="btn pri sp" data-a="comboRes">' + L('全部加入待选栏','Plan all') + '</button></div>';
  return h;
}

// --- 设置 / 卡片 / 统计 ---
function sSettings() {
  const st = S.settings;
  const seg = (k, opts) => '<div class="chips">' + opts.map(o => '<button class="chip ' + (st[k] === o[0] ? 'on' : '') + '" data-a="set" data-k="' + k + '" data-v="' + o[0] + '">' + o[1] + '</button>').join('') + '</div>';
  let h = hd(L('设置','Settings'));
  h += '<div class="field"><label>' + L('国家','Country') + '</label>' + seg('country', [['CN', L('中国','China')], ['AU', L('澳大利亚','Australia')]]) + '</div>';
  h += '<div class="field"><label>' + L('语言','Language') + '</label>' + seg('lang', [['zh', '中文'], ['en', 'English']]) + '</div>';
  h += '<div class="field"><label>' + L('有包装日期的，提前几天提醒','Warn days (labelled)') + '</label><span class="step"><button data-a="setN" data-k="warnLabel" data-v="-1">−</button><span>' + st.warnLabel + '</span><button data-a="setN" data-k="warnLabel" data-v="1">+</button></span></div>';
  h += '<div class="field"><label>' + L('估算到期的，提前几天提醒','Warn days (estimated)') + '</label><span class="step"><button data-a="setN" data-k="warnGuess" data-v="-1">−</button><span>' + st.warnGuess + '</span><button data-a="setN" data-k="warnGuess" data-v="1">+</button></span></div>';
  h += '<div class="card" style="padding:4px 14px">' +
    '<div class="li" data-a="cards"><span class="sp">' + L('食材卡片管理','Item cards') + '</span><span class="mut">' + S.cards.length + ' ›</span></div>' +
    '<div class="li" data-a="stats"><span class="sp">' + L('浪费统计和购买记录','Waste and history') + '</span><span class="mut">›</span></div>' +
    '<div class="li" data-a="addStaples"><span class="sp">' + L('一键添加常备调料','Add basic seasonings') + '</span><span class="mut">›</span></div></div>';
  h += '<button class="btn sm red" data-a="reset">' + L('清空所有数据','Erase all data') + '</button>';
  h += '<div class="mut" style="margin-top:12px">' + L('数据只存在这台设备的浏览器里。清除浏览器数据会丢失。','Data lives only in this browser on this device.') + '</div>';
  return h;
}
function sCards(s) {
  let h = hd(L('食材卡片','Item cards'), 'settings');
  h += '<input id="cardSearch" placeholder="' + L('搜索','Search') + '" value="' + esc(s.q || '') + '" style="margin-bottom:8px"><div id="cardsList">' + cardsListHtml(s) + '</div>';
  return h;
}
function cardsListHtml(s) {
  const q = (s.q || '').toLowerCase(); let h = '';
  CATS.forEach(cat => { const arr = S.cards.filter(c => c.cat === cat && (!q || c.name.includes(q) || (c.en || '').toLowerCase().includes(q))); if (!arr.length) return;
    h += '<div class="sec">' + catN(cat) + '</div><div class="card" style="padding:4px 14px">' + arr.map(c => '<div class="li" data-a="card" data-id="' + c.id + '"><span class="sp">' + esc(nm(c)) + '</span><span class="mut">' + c.shelf + L('天','d') + ' · ' + locN(c.loc) + (c.min ? ' · ' + L('常备','stock') : '') + ' ›</span></div>').join('') + '</div>'; });
  return h;
}
function sCard(s) {
  const c = cardOf(s.id); if (!c) return hd('');
  const f = (k, lab, type) => '<div class="field"><label>' + lab + '</label><input data-cf="' + k + '" ' + (type ? 'type="' + type + '" inputmode="decimal"' : '') + ' value="' + esc(c[k] == null ? '' : c[k]) + '"></div>';
  let h = hd(esc(nm(c)), 'cards');
  h += f('name', L('中文名','Name')) + f('en', L('英文名','English name'));
  h += '<div class="field"><label>' + L('类别','Category') + '</label><select data-cf="cat">' + CATS.map(x => '<option value="' + x + '"' + (c.cat === x ? ' selected' : '') + '>' + catN(x) + '</option>').join('') + '</select></div>';
  h += '<div class="field"><label>' + L('默认位置','Default place') + '</label><select data-cf="loc">' + LOCS.map(x => '<option value="' + x + '"' + (c.loc === x ? ' selected' : '') + '>' + locN(x) + '</option>').join('') + '</select></div>';
  h += '<div class="row">' + f('shelf', L('保质期(天)','Shelf days'), 'number') + f('open', L('开封后几天(0=不变)','Days after opening'), 'number') + '</div>';
  h += '<div class="row">' + f('qty', L('每次默认量','Default amount'), 'number') + '<div class="field"><label>' + L('单位','Unit') + '</label><select data-cf="unit">' + UNITS.map(u => '<option value="' + u + '"' + (c.unit === u ? ' selected' : '') + '>' + uName(u) + '</option>').join('') + '</select></div></div>';
  h += f('min', L('常备量：低于这个数提醒补货（0=不提醒）','Restock below (0 = off)'), 'number');
  h += f('group', L('归类（比如「牛肉」，菜谱写牛肉时都算）','Group (e.g. beef)'));
  if (S.settings.country === 'AU') h += '<div class="field"><label>' + L('在哪买','Store') + '</label><select data-cf="channel">' + CHANNELS.map(x => '<option value="' + x + '"' + (c.channel === x ? ' selected' : '') + '>' + chN(x) + '</option>').join('') + '</select></div>';
  h += f('barcode', L('条形码','Barcode'));
  h += '<div class="field"><label><input type="checkbox" data-cf="staple" style="width:auto"' + (c.staple ? ' checked' : '') + '> ' + L('常备调料（用完自动进购物清单）','Staple') + '</label></div>';
  h += '<div class="bar"><button class="btn red" data-a="cardDel">' + L('删除卡片','Delete') + '</button><button class="btn pri sp" data-a="cardSave">' + L('保存','Save') + '</button></div>';
  return h;
}
function sStats() {
  const m = today().slice(0, 7);
  const byMonth = {}; S.waste.forEach(w => { const k = w.d.slice(0, 7); byMonth[k] = (byMonth[k] || 0) + 1; });
  const months = Object.keys(byMonth).sort().reverse().slice(0, 6);
  let h = hd(L('统计和记录','Stats'), 'settings');
  h += '<div class="stats" style="margin-bottom:12px"><div class="stat"><b>' + (byMonth[m] || 0) + '</b><span class="mut">' + L('本月扔掉','Tossed this month') + '</span></div><div class="stat"><b>' + S.logs.filter(l => l.t === 'cook' && l.d.startsWith(m)).length + '</b><span class="mut">' + L('本月做饭','Cooked') + '</span></div><div class="stat"><b>' + S.logs.filter(l => l.t === 'buy' && l.d.startsWith(m)).length + '</b><span class="mut">' + L('本月买入','Bought') + '</span></div></div>';
  if (months.length) h += '<div class="card"><h2>' + L('每月浪费','Waste by month') + '</h2>' + months.map(k => '<div class="li"><span class="sp">' + k + '</span><span>' + byMonth[k] + L(' 件',' items') + '</span></div>').join('') + '</div>';
  const names = {}; S.waste.forEach(w => names[w.n] = (names[w.n] || 0) + 1);
  const top = Object.entries(names).sort((a, b) => b[1] - a[1]).slice(0, 5);
  if (top.length) h += '<div class="card"><h2>' + L('最常扔的','Most tossed') + '</h2>' + top.map(([n, k]) => '<div class="li"><span class="sp">' + esc(dn(n)) + '</span><span>' + k + '</span></div>').join('') + '</div>';
  const lab = { buy:L('买入','Bought'), used:L('用完','Used up'), waste:L('扔掉','Tossed'), cook:L('做了','Cooked') };
  h += '<div class="card"><h2>' + L('最近记录','Recent') + '</h2>' + (S.logs.slice(0, 60).map(l => '<div class="li"><span class="mut" style="width:44px">' + l.d.slice(5) + '</span><span class="tag gray">' + lab[l.t] + '</span><span class="sp">' + esc(l.t === 'cook' ? l.n : dn(l.n)) + (l.q ? ' <span class="mut">' + fq(l.q) + uName(l.u) + '</span>' : '') + '</span></div>').join('') || '<div class="mut">—</div>') + '</div>';
  return h;
}

// --- 扫码 ---
let scanStream = null, scanTimer = null;
function sScan() {
  let h = hd(L('扫条形码','Scan barcode'), 'backAdd');
  if ('BarcodeDetector' in window) h += '<video id="scanV" playsinline muted></video><div class="mut" style="margin:8px 0">' + L('把条形码对准镜头','Point at a barcode') + '</div>';
  else h += '<div class="mut" style="margin-bottom:8px">' + L('这个浏览器不支持直接扫码（iPhone 的 Safari 目前都不支持）。可以手动输入条码数字：','This browser can\'t scan. Type the number:') + '</div>';
  h += '<div class="row"><input id="codeIn" inputmode="numeric" placeholder="' + L('条码数字','Barcode number') + '"><button class="btn pri" data-a="codeGo">' + L('确定','OK') + '</button></div>';
  return h;
}
function stopScan() { if (scanTimer) clearInterval(scanTimer); scanTimer = null; if (scanStream) scanStream.getTracks().forEach(t => t.stop()); scanStream = null; }
async function startScan() {
  if (!('BarcodeDetector' in window) || scanStream) return;
  try {
    const v = document.getElementById('scanV'); if (!v) return;
    scanStream = await navigator.mediaDevices.getUserMedia({ video:{ facingMode:'environment' } });
    v.srcObject = scanStream; await v.play();
    const det = new BarcodeDetector({ formats:['ean_13','ean_8','upc_a','upc_e','code_128'] });
    scanTimer = setInterval(async () => { try { const r = await det.detect(v); if (r.length) { stopScan(); handleCode(r[0].rawValue); } } catch (e) {} }, 300);
  } catch (e) { stopScan(); }
}
function handleCode(code) {
  code = String(code).trim(); if (!code) return;
  const c = S.cards.find(x => x.barcode === code);
  ui.sheet = { type:'add' }; renderSheet();
  if (c) { tapCard(c.id); toast(L('已加入 ', 'Added ') + nm(c)); return; }
  ui.pendingCode = code;
  toast(L('新条码：搜索或新建这个食材，会自动记住','New barcode: pick or create the item'));
}

// ================= 弹窗 / 提示 =================
let askYes = null, askNo = null;
function ask(msg, yes, no, yesL, noL) {
  askYes = yes; askNo = no;
  document.getElementById('ask').innerHTML = '<div class="ov"><div class="sheet"><div style="font-size:16px;margin:6px 0 16px">' + esc(msg) + '</div><div class="row"><button class="btn sp" data-a="askNo">' + (noL || L('取消','Cancel')) + '</button><button class="btn pri sp" data-a="askYes">' + (yesL || L('好','OK')) + '</button></div></div></div>';
}
function closeAsk() { document.getElementById('ask').innerHTML = ''; }
let toastTimer = null, toastSnap = null;
function toast(msg, before) {
  const t = document.getElementById('toast'); toastSnap = before || null;
  t.innerHTML = '<span>' + esc(msg) + '</span>' + (before ? '<button data-a="undo">' + L('撤销','Undo') + '</button>' : '');
  t.style.display = 'flex'; clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.style.display = 'none'; toastSnap = null; }, before ? 5000 : 2500);
}

// ================= 烹饪模式 =================
let wake = null;
function openCook(r, i) {
  const steps = r.steps && r.steps.length ? r.steps : [L('这道菜还没写做法','No steps yet')];
  i = Math.max(0, Math.min(i, steps.length - 1));
  document.getElementById('cook').innerHTML = '<div class="cook"><div class="row"><span class="mut sp">' + esc(rn(r)) + ' · ' + (i + 1) + '/' + steps.length + '</span><button class="ibtn" data-a="cookX">' + svg('x') + '</button></div>' +
    '<div class="big">' + esc(steps[i]) + '</div><div class="row">' +
    '<button class="btn sp" style="padding:16px" data-a="cookGo" data-id="' + r.id + '" data-v="' + (i - 1) + '"' + (i === 0 ? ' disabled' : '') + '>' + L('上一步','Back') + '</button>' +
    (i < steps.length - 1 ? '<button class="btn pri sp" style="padding:16px" data-a="cookGo" data-id="' + r.id + '" data-v="' + (i + 1) + '">' + L('下一步','Next') + '</button>'
      : '<button class="btn pri sp" style="padding:16px" data-a="cookFin" data-id="' + r.id + '">' + L('做好了，扣库存','Done, deduct') + '</button>') + '</div></div>';
  if (!wake && navigator.wakeLock) navigator.wakeLock.request('screen').then(w => wake = w).catch(() => {});
}
function closeCook() { document.getElementById('cook').innerHTML = ''; if (wake) { wake.release().catch(() => {}); wake = null; } }

// ================= 事件 =================
function reserve(rid) {
  const r = S.recipes.find(x => x.id === rid); if (!r) return;
  const serv = (ui.sheet && ui.sheet.type === 'recipe' && ui.sheet.serv) || ui.serv || r.serve;
  const res = evalR(r, serv, makePool(true));
  const add = () => { const before = snap(); S.reserved.push({ id:uid(), rid, serv }); save(); toast(L('已加入待选栏：', 'Planned: ') + rn(r), before); if (ui.sheet && ui.sheet.type === 'recipe') closeSheet(); else render(); };
  if (res.missing.length) ask(L('去掉待选栏里其他菜要用的之后，这道菜还缺：', 'Still missing: ') + missText(res.missing) + L('。仍然加入吗？', '. Plan anyway?'), add);
  else add();
}
function missShop(rid) {
  const r = S.recipes.find(x => x.id === rid);
  const res = evalR(r, ui.serv || r.serve, makePool(true));
  if (!res.missing.length) { toast(L('不缺东西','Nothing missing')); return; }
  ask(L('把这些加入购物清单？\n', 'Add to shopping list?\n') + missText(res.missing), () => { const before = snap(); res.missing.forEach(m => { const c = findCard(m.n); addToShop(m.n, c ? c.id : null); }); save(); render(); toast(L('已加入购物清单','Added to list'), before); });
}

document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]');
  if (!el) return;
  if (lpFired) { lpFired = false; return; }
  const a = el.dataset.a, id = el.dataset.id, v = el.dataset.v;
  const s = ui.sheet;
  if (a === 'ovClose') { if (e.target === el) { if (s && s.type === 'scan') stopScan(); if (s && s.type === 'item') saveItemFields(); closeSheet(); } return; }
  e.stopPropagation();
  let before;
  switch (a) {
    case 'tab': ui.tab = v; ui.batch = false; ui.sel.clear(); render(); window.scrollTo(0, 0); break;
    case 'close': if (s && s.type === 'scan') stopScan(); if (s && s.type === 'item') saveItemFields(); closeSheet(); break;
    case 'settings': openSheet({ type:'settings' }); break;
    case 'set': S.settings[el.dataset.k] = v; save(); render(); break;
    case 'setN': S.settings[el.dataset.k] = Math.max(0, Math.min(14, S.settings[el.dataset.k] + +v)); save(); render(); break;
    case 'cards': openSheet({ type:'cards', q:'' }); break;
    case 'card': openSheet({ type:'card', id }); break;
    case 'stats': openSheet({ type:'stats' }); break;
    case 'reset': ask(L('确定清空所有数据？这一步不能撤销。','Erase everything? Cannot be undone.'), () => { S = seed(); save(); ui.sheet = null; render(); }); break;
    case 'cardSave': { const c = cardOf(s.id); document.querySelectorAll('[data-cf]').forEach(f => { const k = f.dataset.cf;
        if (f.type === 'checkbox') c[k] = f.checked; else if (['shelf','open','qty','min'].includes(k)) c[k] = parseFloat(f.value) || 0; else c[k] = f.value.trim(); });
      save(); openSheet({ type:'cards', q:'' }); toast(L('已保存','Saved')); break; }
    case 'cardDel': ask(L('删除这张卡片？库存里的这样东西也会删掉。','Delete this card and its stock?'), () => { S.items = S.items.filter(i => i.cardId !== s.id); S.cards = S.cards.filter(c => c.id !== s.id); save(); openSheet({ type:'cards', q:'' }); }); break;
    case 'addStaples': before = snap(); S.cards.filter(c => c.staple).forEach(c => { if (!S.items.some(i => i.cardId === c.id)) S.items.push(newItem(c, 1, c.unit, addDays(today(), c.shelf), false, 'BB', c.loc)); }); save(); ui.sheet = null; render(); toast(L('已添加常备调料','Seasonings added'), before); break;
    // 首页
    case 'item': openSheet({ type:'item', id }); break;
    case 'waste': before = snap(); removeItem(S.items.find(x => x.id === id), 'waste'); save(); render(); toast(L('记为浪费 1 件','Logged as waste'), before); break;
    case 'keep': before = snap(); S.items.find(x => x.id === id).keep = true; save(); render(); toast(L('好，先留着','Kept'), before); break;
    case 'random': { const can = recommend(makePool(true), false).filter(x => x.can); if (!can.length) { toast(L('现在没有能做的菜','Nothing ready')); break; } openSheet({ type:'recipe', id:can[Math.floor(Math.random() * can.length)].r.id }); break; }
    case 'cookRes': { const rv = S.reserved.find(x => x.id === id); before = snap(); S.reserved = S.reserved.filter(x => x.id !== id); cook(rv.rid, rv.serv); toastSnap = before; break; }
    case 'unres': before = snap(); S.reserved = S.reserved.filter(x => x.id !== id); save(); render(); toast(L('已移出，原料退回','Removed'), before); break;
    case 'invLoc': ui.invLoc = v; ui.tab = 'inv'; render(); break;
    case 'freeCook': openSheet({ type:'free', sel:{} }); break;
    // 库存
    case 'dec': case 'inc': { const it = S.items.find(x => x.id === id); before = snap(); const st = stepOf(it.unit);
      it.qty = Math.max(0, Math.round((it.qty + (a === 'inc' ? st : -st)) * 1000) / 1000);
      if (it.qty <= 0.0001) { removeItem(it, 'used'); toast(L('用完了：', 'Used up: ') + nm(cardOf(it.cardId)), before); }
      save(); render(); break; }
    case 'batch': ui.batch = !ui.batch; ui.sel.clear(); render(); break;
    case 'sel': ui.sel.has(id) ? ui.sel.delete(id) : ui.sel.add(id); render(); break;
    case 'batchDel': if (!ui.sel.size) break; before = snap(); S.items = S.items.filter(i => !ui.sel.has(i.id)); ui.sel.clear(); ui.batch = false; save(); render(); toast(L('已删除','Deleted'), before); break;
    case 'batchShop': before = snap(); ui.sel.forEach(i => { const it = S.items.find(x => x.id === i); if (it) addToShop(cardOf(it.cardId).name, it.cardId); }); ui.sel.clear(); ui.batch = false; save(); render(); toast(L('已加入购物清单','Added'), before); break;
    case 'itSet': { saveItemFields(); const it = S.items.find(x => x.id === s.id); const k = el.dataset.k; const c = cardOf(it.cardId);
      if (k === 'labeled') it.labeled = !it.labeled;
      if (k === 'ub') { it.expType = it.expType === 'UB' ? 'BB' : 'UB'; it.labeled = true; }
      if (k === 'opened') { if (it.opened) it.opened = null; else { it.opened = today(); if (c.open) { const e2 = addDays(today(), c.open); if (e2 < it.exp) it.exp = e2; } } }
      save(); renderSheet(); break; }
    case 'itLoc': { saveItemFields(); const it = S.items.find(x => x.id === s.id); const c = cardOf(it.cardId);
      if (v === '冷冻' && it.loc !== '冷冻') { it.preExp = it.exp; const e2 = addDays(today(), FREEZE[c.cat] || 60); if (e2 > it.exp) it.exp = e2; it.frozen = true; toast(L('冷冻后到期日延到 ', 'Frozen, now expires ') + it.exp); }
      else if (it.loc === '冷冻' && v !== '冷冻') { it.exp = addDays(today(), Math.min(c.shelf, 2)); it.frozen = false; toast(L('解冻后请 ' + Math.min(c.shelf, 2) + ' 天内吃完', 'Use within ' + Math.min(c.shelf, 2) + ' days')); }
      it.loc = v; save(); renderSheet(); break; }
    case 'itUsed': before = snap(); removeItem(S.items.find(x => x.id === s.id), 'used'); save(); closeSheet(); toast(L('已用完','Used up'), before); break;
    case 'itWaste': before = snap(); removeItem(S.items.find(x => x.id === s.id), 'waste'); save(); closeSheet(); toast(L('记为浪费','Logged as waste'), before); break;
    case 'itDel': before = snap(); S.items = S.items.filter(x => x.id !== s.id); save(); closeSheet(); toast(L('已删除','Deleted'), before); break;
    case 'itAgain': { saveItemFields(); before = snap(); const it = S.items.find(x => x.id === s.id); const c = cardOf(it.cardId);
      S.items.push(newItem(c, c.qty, c.unit, addDays(today(), c.shelf), false, 'BB', it.loc)); c.uses++; logIt('buy', c.name, { q:c.qty, u:c.unit }); save(); closeSheet(); toast(L('又入库了一份','Added another'), before); break; }
    case 'itShop': { saveItemFields(); const it = S.items.find(x => x.id === s.id); before = snap(); addToShop(cardOf(it.cardId).name, it.cardId); save(); toast(L('已加入购物清单','Added to list'), before); break; }
    // 录入
    case 'openAdd': ui.basket = {}; ui.addSearch = ''; ui.addCat = ''; openSheet({ type:'add' }); break;
    case 'addCat': ui.addCat = v; ui.addSearch = ''; renderSheet(); break;
    case 'addDone': addDone(); break;
    case 'backAdd': stopScan(); ui.sheet = { type:'add' }; renderSheet(); break;
    case 'newCard': openSheet({ type:'newCard', name:ui.addSearch.trim() }); break;
    case 'ncCat': { const name = document.getElementById('ncName').value.trim(); if (!name) break;
      const c = makeCard({ name, en:document.getElementById('ncEn').value.trim(), cat:v });
      if (ui.pendingCode) { c.barcode = ui.pendingCode; ui.pendingCode = null; }
      S.cards.push(c); save(); ui.addSearch = ''; ui.sheet = { type:'add' }; renderSheet(); tapCard(c.id); break; }
    case 'adj': { readAdj(); const B = s.b; const k = el.dataset.k;
      if (k === 'n') B.n = Math.max(1, B.n + +v); else if (k === 'shelf') B.shelf = Math.max(0, B.shelf + +v); else if (k === 'labeled') B.labeled = v === '1'; else B[k] = v;
      renderSheet(); break; }
    case 'adjOk': readAdj(); ui.basket[s.id] = s.b; ui.sheet = { type:'add' }; renderSheet(); break;
    case 'adjRemove': delete ui.basket[s.id]; ui.sheet = { type:'add' }; renderSheet(); break;
    case 'scan': openSheet({ type:'scan' }); break;
    case 'codeGo': { const c = document.getElementById('codeIn').value; stopScan(); handleCode(c); break; }
    // 菜谱
    case 'recTab': ui.recTab = v; render(); break;
    case 'filt': { const k = el.dataset.k; ui.f[k] = k === 'time' ? +v : (ui.f[k] === v ? '' : v); render(); break; }
    case 'serv': { const base = ui.serv || 2; const n = base + +v; ui.serv = n < 1 ? null : n; render(); break; }
    case 'recipe': openSheet({ type:'recipe', id }); break;
    case 'rServ': s.serv = Math.max(1, s.serv + +v); renderSheet(); break;
    case 'fav': { const r = S.recipes.find(x => x.id === id); r.fav = !r.fav; save(); renderSheet(); break; }
    case 'reserve': reserve(id); break;
    case 'missShop': missShop(id); break;
    case 'combo': openSheet({ type:'combo' }); break;
    case 'comboRes': before = snap(); (s.pick || []).forEach(rid => { const r = S.recipes.find(x => x.id === rid); S.reserved.push({ id:uid(), rid, serv:r.serve }); }); save(); closeSheet(); toast(L('已加入待选栏','Planned'), before); break;
    case 'cookMode': { const r = S.recipes.find(x => x.id === id); openCook(r, 0); break; }
    case 'cookGo': openCook(S.recipes.find(x => x.id === id), +v); break;
    case 'cookX': closeCook(); break;
    case 'cookFin': { closeCook(); const r = S.recipes.find(x => x.id === id); const serv = (s && s.serv) || r.serve;
      const rv = S.reserved.find(x => x.rid === id); const b0 = snap(); if (rv) S.reserved = S.reserved.filter(x => x !== rv);
      ui.sheet = null; cook(id, serv); toastSnap = b0; break; }
    case 'newRecipe': openSheet({ type:'edit', e:blankEdit() }); break;
    case 'editRecipe': { const r = S.recipes.find(x => x.id === id);
      const e2 = { id:r.id, name:r.name, en:r.en || '', ings:JSON.parse(JSON.stringify(r.ings)), diff:r.diff, tags:(r.tags || []).slice(), meal:(r.meal || []).slice(), min:r.min, serve:r.serve, kcal:r.kcal || '', prot:r.prot || '', steps:(r.steps || []).join('\n') };
      openSheet({ type:'edit', e:e2 }); break; }
    case 'eChip': { readEdit(); const k = el.dataset.k; if (el.dataset.m === '1') { const arr = s.e[k]; const i = arr.indexOf(v); i >= 0 ? arr.splice(i, 1) : arr.push(v); } else s.e[k] = v; renderSheet(); break; }
    case 'eOpt': readEdit(); s.e.ings[+el.dataset.i].opt = !s.e.ings[+el.dataset.i].opt; renderSheet(); break;
    case 'eDel': readEdit(); s.e.ings.splice(+el.dataset.i, 1); renderSheet(); break;
    case 'eAddRow': readEdit(); s.e.ings.push({ n:'', q:null, u:'', opt:false }); renderSheet(); break;
    case 'ePick': readEdit(); ui.sheet = { type:'pick', mode:'card', e:s.e, sel:[], q:'' }; renderSheet(); break;
    case 'ePickRecipe': readEdit(); ui.sheet = { type:'pick', mode:'recipe', e:s.e }; renderSheet(); break;
    case 'pickC': { const i = s.sel.indexOf(id); i >= 0 ? s.sel.splice(i, 1) : s.sel.push(id); document.getElementById('pickGrid').innerHTML = pickGridHtml(s); document.querySelector('[data-a=pickDone]').textContent = L('加入 ','Add ') + s.sel.length; break; }
    case 'pickDone': s.sel.forEach(cid => { const c = cardOf(cid); s.e.ings.push({ n:c.name, q:c.unit in FAM ? 100 : 1, u:c.unit, opt:false }); }); ui.sheet = { type:'edit', e:s.e }; renderSheet(); break;
    case 'pickR': { const r = S.recipes.find(x => x.id === id); s.e.ings.push({ n:r.name, ref:r.id, q:null, u:'', opt:false }); ui.sheet = { type:'edit', e:s.e }; renderSheet(); break; }
    case 'backEdit': ui.sheet = { type:'edit', e:s.e }; renderSheet(); break;
    case 'eSave': saveEdit(); break;
    case 'eRemove': ask(L('删除这道菜谱？','Delete this recipe?'), () => { S.recipes = S.recipes.filter(r => r.id !== s.e.id); S.reserved = S.reserved.filter(x => x.rid !== s.e.id); save(); closeSheet(); }); break;
    // 随手做
    case 'freeT': { const it = S.items.find(x => x.id === id); if (s.sel[id] != null) delete s.sel[id]; else s.sel[id] = Math.min(it.qty, it.unit in FAM ? stepOf(it.unit) * 2 : 1); renderSheet(); break; }
    case 'freeQ': { const it = S.items.find(x => x.id === id); s.sel[id] = Math.max(stepOf(it.unit) < 1 ? stepOf(it.unit) : 0, Math.min(it.qty, Math.round((s.sel[id] + +v * stepOf(it.unit)) * 1000) / 1000)); renderSheet(); break; }
    case 'freeDone': freeDone(); break;
    // 购物
    case 'shopAdd': { const inp = document.getElementById('shopIn'); const n = inp.value.trim(); if (!n) break; const c = findCard(n); before = snap();
      if (!addToShop(c ? c.name : n, c ? c.id : null)) { toast(L('已经在清单里了','Already on list')); break; } save(); render(); break; }
    case 'shopCard': before = snap(); addToShop(cardOf(id).name, id); save(); render(); break;
    case 'shopDel': before = snap(); S.shop = S.shop.filter(x => x.id !== id); save(); render(); toast(L('已删除','Removed'), before); break;
    case 'shopTick': { const sh = S.shop.find(x => x.id === id);
      ask(L('买到了「', 'Got "') + (sh.cardId ? nm(cardOf(sh.cardId)) : sh.name) + L('」，现在入库吗？', '". Add to pantry?'), () => {
        const b0 = snap(); let c = sh.cardId ? cardOf(sh.cardId) : findCard(sh.name);
        if (!c) { c = makeCard({ name:sh.name, cat:'其他' }); S.cards.push(c); }
        S.items.push(newItem(c, c.qty, c.unit, addDays(today(), c.shelf), false, 'BB', c.loc)); c.uses++; logIt('buy', c.name, { q:c.qty, u:c.unit });
        S.shop = S.shop.filter(x => x.id !== id); save(); render(); toast(L('已入库','Added to pantry'), b0);
      }, () => { const b0 = snap(); S.shop = S.shop.filter(x => x.id !== id); save(); render(); toast(L('已划掉','Checked off'), b0); }, L('入库','Add'), L('只划掉','Just check off')); break; }
    // 通用
    case 'askYes': { const f = askYes; closeAsk(); askYes = askNo = null; if (f) f(); break; }
    case 'askNo': { const f = askNo; closeAsk(); askYes = askNo = null; if (f) f(); break; }
    case 'undo': if (toastSnap) { S = JSON.parse(toastSnap); toastSnap = null; save(); ui.sheet = null; render(); document.getElementById('toast').style.display = 'none'; } break;
  }
});

document.addEventListener('input', e => {
  const t = e.target;
  if (t.id === 'invSearch') { ui.invSearch = t.value; document.getElementById('invList').innerHTML = invListHtml(); bindSwipe(); }
  else if (t.id === 'recSearch') { ui.recSearch = t.value; document.getElementById('recList').innerHTML = allListHtml(); }
  else if (t.id === 'addSearch') { ui.addSearch = t.value; document.getElementById('addGrid').innerHTML = addGridHtml(); }
  else if (t.id === 'pickSearch') { ui.sheet.q = t.value; document.getElementById('pickGrid').innerHTML = pickGridHtml(ui.sheet); }
  else if (t.id === 'cardSearch') { ui.sheet.q = t.value; document.getElementById('cardsList').innerHTML = cardsListHtml(ui.sheet); }
});
document.addEventListener('change', e => {
  const t = e.target;
  if (t.id === 'mustIn') { const c = findCard(t.value); ui.f.must = c ? c.name : t.value.trim(); document.getElementById('recList').innerHTML = recListHtml(); }
  else if (t.dataset.ch) { const sh = S.shop.find(x => x.id === t.dataset.ch); sh.channel = t.value; const c = sh.cardId && cardOf(sh.cardId); if (c) c.channel = t.value; save(); render(); }
  else if (['itQty','itUnit','itExp'].includes(t.id)) saveItemFields();
});
document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'shopIn') document.querySelector('[data-a=shopAdd]').click(); });

// 长按（录入卡片）
let lpTimer = null, lpFired = false, lpStart = null;
document.addEventListener('pointerdown', e => {
  const el = e.target.closest('[data-lp]'); if (!el) return;
  lpFired = false; lpStart = [e.clientX, e.clientY];
  lpTimer = setTimeout(() => { lpFired = true; const id = el.dataset.lp; ui.sheet = { type:'adjust', id }; renderSheet(); setTimeout(() => lpFired = false, 400); }, 450);
});
document.addEventListener('pointermove', e => { if (lpTimer && lpStart && (Math.abs(e.clientX - lpStart[0]) > 10 || Math.abs(e.clientY - lpStart[1]) > 10)) { clearTimeout(lpTimer); lpTimer = null; } });
document.addEventListener('pointerup', e => {
  const el = e.target.closest('[data-lp]');
  if (lpTimer) { clearTimeout(lpTimer); lpTimer = null; if (el && !lpFired) tapCard(el.dataset.lp); }
});
document.addEventListener('contextmenu', e => { if (e.target.closest('[data-lp]')) e.preventDefault(); });

// 左滑 = 用完
function bindSwipe() {
  document.querySelectorAll('[data-sw]').forEach(row => {
    if (row._b) return; row._b = true;
    const inner = row.querySelector('.inner'); let x0 = null, y0 = null, dx = 0, lock = null;
    row.addEventListener('touchstart', e => { if (ui.batch) return; x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; dx = 0; lock = null; inner.style.transition = 'none'; }, { passive:true });
    row.addEventListener('touchmove', e => { if (x0 == null) return; const mx = e.touches[0].clientX - x0, my = e.touches[0].clientY - y0;
      if (lock == null) lock = Math.abs(mx) > Math.abs(my) ? 'x' : 'y'; if (lock !== 'x') return; dx = Math.min(0, mx); inner.style.transform = 'translateX(' + dx + 'px)'; }, { passive:true });
    row.addEventListener('touchend', () => { inner.style.transition = ''; if (lock === 'x' && dx < -90) { const it = S.items.find(x => x.id === row.dataset.sw); const before = snap(); removeItem(it, 'used'); save(); render(); toast(L('用完了：', 'Used up: ') + nm(cardOf(it.cardId)), before); } else inner.style.transform = ''; x0 = null; });
  });
}

load();
render();
