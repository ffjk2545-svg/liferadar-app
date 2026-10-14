(() => {
  'use strict';
  const STORAGE_KEY = 'liferadar.v1';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const now = new Date();
  const todayISO = () => localISO(new Date());
  function localISO(date) { const d = new Date(date); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0,10); }
  function dateOffset(days) { const d = new Date(); d.setDate(d.getDate() + days); return localISO(d); }
  function dateAtDay(day) { const d = new Date(); d.setDate(1); d.setDate(day); return localISO(d); }
  function monthKey(date) { return String(date || '').slice(0,7); }
  function startOfMonth() { const d = new Date(); d.setDate(1); return localISO(d); }
  function currency(value) { return new Intl.NumberFormat('th-TH', { style:'currency', currency:'THB', maximumFractionDigits:0 }).format(Number(value)||0); }
  function num(value) { return new Intl.NumberFormat('th-TH', { maximumFractionDigits:0 }).format(Number(value)||0); }
  function thaiDate(date, options = { day:'numeric', month:'short' }) { if (!date) return 'ยังไม่กำหนด'; const d = new Date(`${date}T12:00:00`); return new Intl.DateTimeFormat('th-TH', options).format(d); }
  function escapeHTML(text) { return String(text ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function uid() { return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`; }
  const categoryInfo = {
    'อาหาร':{icon:'🍜', color:'#86b99b'}, 'เดินทาง':{icon:'🚆', color:'#8eb7d3'}, 'ช้อปปิ้ง':{icon:'🛍️', color:'#cfb3e4'},
    'ของใช้':{icon:'🧴', color:'#dfb08b'}, 'บันเทิง':{icon:'🎮', color:'#a99add'}, 'สุขภาพ':{icon:'🌿', color:'#83b6b0'},
    'บ้าน/บิล':{icon:'🏡', color:'#b3bd86'}, 'กาแฟ/ขนม':{icon:'☕', color:'#c99a7e'}, 'การเรียน':{icon:'📚', color:'#8eabd4'},
    'เงินเดือน':{icon:'💼', color:'#6fa8d7'}, 'ฟรีแลนซ์':{icon:'✨', color:'#c3a1df'}, 'อื่นๆ':{icon:'✳️', color:'#a8b2a5'}
  };
  const subInfo = {
    'สตรีมมิง':{icon:'🎬',bg:'#fce8e6'}, 'เพลง':{icon:'🎧',bg:'#efe6ff'}, 'พื้นที่เก็บข้อมูล':{icon:'☁️',bg:'#e5f1ff'},
    'ทำงาน/เรียน':{icon:'✍️',bg:'#e8f6e7'}, 'สุขภาพ/ฟิตเนส':{icon:'🏃',bg:'#fff0dd'}, 'เกม':{icon:'🎮',bg:'#e8ebff'},
    'ช้อปปิ้ง':{icon:'📦',bg:'#fce8ef'}, 'อื่นๆ':{icon:'✳️',bg:'#eff2ec'}
  };
  const categoryOptions = ['อาหาร','เดินทาง','ช้อปปิ้ง','ของใช้','บันเทิง','สุขภาพ','บ้าน/บิล','กาแฟ/ขนม','การเรียน','อื่นๆ'];
  const subCategories = ['สตรีมมิง','เพลง','พื้นที่เก็บข้อมูล','ทำงาน/เรียน','สุขภาพ/ฟิตเนส','เกม','ช้อปปิ้ง','อื่นๆ'];
  const cycleLabels = { monthly:'รายเดือน', yearly:'รายปี', quarterly:'ราย 3 เดือน', weekly:'รายสัปดาห์' };
  const usageLabels = { daily:'ใช้ทุกวัน', weekly:'ใช้ทุกสัปดาห์', monthly:'ใช้บางครั้ง', rarely:'ใช้น้อย', never:'ไม่ได้ใช้' };
  const usageEmojis = {daily:'💚',weekly:'🙂',monthly:'🫧',rarely:'🟠',never:'🔎'};
  const moneyTips = [
    {title:'เช็กสมาชิกที่ตัดเงินใน 7 วัน', body:'เปิดรายการ Subscription สักนาที เช็กบริการที่อาจไม่ได้ใช้ก่อนถึงวันตัดเงิน', task:'เช็กวันตัดเงินหรือบริการที่ใช้น้อย 1 รายการ'},
    {title:'เงินก้อนเล็กก็มีความหมาย', body:'ลองบันทึกรายจ่ายเล็ก ๆ วันนี้ เพื่อให้ภาพรวมสิ้นเดือนไม่ขาดชิ้นส่วนสำคัญ', task:'บันทึกรายจ่ายล่าสุดให้ครบ 1 รายการ'},
    {title:'เลือกหนึ่งอย่างที่ไม่จำเป็น', body:'ไม่ต้องตัดทุกอย่าง ลองถามว่าอะไรให้คุณค่าน้อยกว่าค่าใช้จ่ายที่จ่ายไป', task:'ทบทวนค่าใช้จ่ายที่ไม่ค่อยได้ใช้ 1 อย่าง'},
    {title:'ให้เงินทำงานตามแผน', body:'เช็กยอดใช้เดือนนี้เทียบงบของตัวเอง ถ้าเกินแผนก็ใช้เป็นข้อมูล ไม่ใช่เหตุผลให้โทษตัวเอง', task:'ดูรายจ่ายเดือนนี้เทียบกับงบที่ตั้งไว้'},
    {title:'เก็บหลักฐานให้ค้นเจอ', body:'จดรายการพร้อมหมวดหมู่วันนี้ไว้ก่อน การย้อนดูย้อนหลังจะง่ายขึ้นมาก', task:'ตรวจว่ารายการล่าสุดมีหมวดหมู่ถูกต้อง'}
  ];
  const todayTip = moneyTips[Math.floor(new Date().getTime()/86400000)%moneyTips.length];

  function createDemoState() {
    const subs = [
      ['Netflix',419,'สตรีมมิง','weekly',3,'monthly','🎬'], ['Spotify Premium',169,'เพลง','daily',1,'monthly','🎧'],
      ['iCloud+',35,'พื้นที่เก็บข้อมูล','daily',5,'monthly','☁️'], ['YouTube Premium',179,'สตรีมมิง','weekly',9,'monthly','▶️'],
      ['Fitness / Gym',990,'สุขภาพ/ฟิตเนส','rarely',6,'monthly','🏋️'], ['Canva Pro',249,'ทำงาน/เรียน','rarely',4,'monthly','🎨'],
      ['Google One',79,'พื้นที่เก็บข้อมูล','weekly',2,'monthly','☁️']
    ].map(([name,amount,category,usage,due,cycle,icon])=>({id:uid(),name,amount,category,usage,dueDate:dateOffset(due),cycle,icon,active:true,note:''}));
    const txSeed = [
      [-1,'กาแฟตอนเช้า',85,'กาแฟ/ขนม','expense'],[-1,'ค่าเดินทาง',48,'เดินทาง','expense'],[-2,'อาหารกลางวัน',125,'อาหาร','expense'],[-2,'ของใช้ในบ้าน',320,'ของใช้','expense'],[-3,'ข้าวเย็น',185,'อาหาร','expense'],[-4,'เติมน้ำมัน/เดินทาง',250,'เดินทาง','expense'],[-4,'ขนมกับกาแฟ',115,'กาแฟ/ขนม','expense'],[-5,'ค่าโทรศัพท์',399,'บ้าน/บิล','expense'],[-5,'ซื้อของออนไลน์',490,'ช้อปปิ้ง','expense'],[-7,'อาหารกับเพื่อน',390,'อาหาร','expense'],[-8,'ค่าเดินทาง',95,'เดินทาง','expense'],[-10,'ของใช้ส่วนตัว',240,'ของใช้','expense'],[-11,'ดูหนัง',280,'บันเทิง','expense'],[-13,'ซื้ออาหาร',160,'อาหาร','expense'],[-14,'ค่าไฟ',840,'บ้าน/บิล','expense'],[-15,'รายรับตัวอย่าง',35000,'เงินเดือน','income'],[-16,'กาแฟ',90,'กาแฟ/ขนม','expense'],[-18,'หนังสือ/คอร์ส',590,'การเรียน','expense'],[-20,'อาหาร',240,'อาหาร','expense'],[-22,'เดินทาง',110,'เดินทาง','expense'],[-24,'ซื้อของใช้',350,'ของใช้','expense']
    ].map(([offset,title,amount,category,kind])=>({id:uid(),date:title==='รายรับตัวอย่าง'?dateAtDay(1):dateOffset(offset),title,amount,category,kind,note:''}));
    return {version:1,isDemo:true,budget:15000,transactions:txSeed,subscriptions:subs,checkins:[],streak:0,lastCheckin:null};
  }
  function emptyState() { return {version:1,isDemo:false,budget:15000,transactions:[],subscriptions:[],checkins:[],streak:0,lastCheckin:null}; }
  let state;
  try { state = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || createDemoState(); }
  catch { state = createDemoState(); }
  state.transactions ||= []; state.subscriptions ||= []; state.checkins ||= []; state.budget = Number(state.budget)||15000; state.version=1;
  let subFilter = 'all';
  let editing = null;
  let dialogKind = null;

  function save() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e) { toast('พื้นที่จัดเก็บเต็ม กรุณาดาวน์โหลดไฟล์สำรอง', 'error'); } }
  function activeSubs() { return state.subscriptions.filter(s=>s.active!==false); }
  function monthlyCost(sub) { const a = Number(sub.amount)||0; return ({monthly:a, yearly:a/12, quarterly:a/3, weekly:a*52/12})[sub.cycle] ?? a; }
  function annualCost(sub) { return monthlyCost(sub)*12; }
  function monthTransactions() { const key = monthKey(todayISO()); return state.transactions.filter(t=>monthKey(t.date)===key); }
  function currentExpenses() { return monthTransactions().filter(t=>t.kind==='expense').reduce((s,t)=>s+Number(t.amount||0),0); }
  function currentIncome() { return monthTransactions().filter(t=>t.kind==='income').reduce((s,t)=>s+Number(t.amount||0),0); }
  function monthlySubsCost() { return activeSubs().reduce((s,sub)=>s+monthlyCost(sub),0); }
  function annualSubsCost() { return activeSubs().reduce((s,sub)=>s+annualCost(sub),0); }
  function reviewSubs() { return activeSubs().filter(s=>['rarely','never'].includes(s.usage)); }
  function reviewMonthlyCost() { return reviewSubs().reduce((s,sub)=>s+monthlyCost(sub),0); }
  function daysUntil(date) { if(!date)return 999; const a=new Date(`${todayISO()}T00:00:00`),b=new Date(`${date}T00:00:00`); return Math.round((b-a)/86400000); }
  function advanceDate(date, cycle) { const d = new Date(`${date}T12:00:00`); if(cycle==='weekly')d.setDate(d.getDate()+7); else if(cycle==='quarterly')d.setMonth(d.getMonth()+3); else if(cycle==='yearly')d.setFullYear(d.getFullYear()+1); else d.setMonth(d.getMonth()+1); return localISO(d); }
  function normalizeDueDates() { let changed=false; state.subscriptions.forEach(s=>{if(!s.dueDate || s.active===false)return; let loops=0; while(s.dueDate < todayISO() && loops++ < 36) { s.dueDate=advanceDate(s.dueDate,s.cycle); changed=true; }}); if(changed)save(); }
  function comingSubs(days=7) { return activeSubs().filter(s=>daysUntil(s.dueDate)>=0&&daysUntil(s.dueDate)<=days).sort((a,b)=>a.dueDate.localeCompare(b.dueDate)); }
  function iconForCategory(category) { return categoryInfo[category]?.icon || '✳️'; }
  function renderHeader() {
    const d=new Date(); const hh=d.getHours(); const greeting=hh<11?'อรุณสวัสดิ์':hh<16?'สวัสดีตอนบ่าย':hh<19?'สวัสดีตอนเย็น':'คืนนี้อย่าลืมดูแลตัวเอง';
    $('#greeting-title').textContent=`${greeting} วันนี้เรามาจัดการเงินกัน ✨`;
    $('#today-label').textContent=new Intl.DateTimeFormat('th-TH',{weekday:'short',day:'numeric',month:'short'}).format(d);
    $('#hero-month').textContent=new Intl.DateTimeFormat('th-TH',{month:'long',year:'numeric'}).format(d);
    $('#insight-month').textContent=new Intl.DateTimeFormat('th-TH',{month:'long',year:'numeric'}).format(d);
    $('#daily-prompt').textContent=todayTip.body; $('#daily-task-label').textContent=todayTip.task;
    $('#demo-banner').hidden=!state.isDemo;
  }
  function renderOverview() {
    const exp=currentExpenses(), sub=monthlySubsCost(), annual=annualSubsCost(), waste=reviewMonthlyCost(), upcoming=comingSubs(7), upcomingAmount=upcoming.reduce((s,x)=>s+Number(x.amount),0);
    $('#hero-expenses').textContent=currency(exp); $('#hero-subscriptions').textContent=currency(sub);
    $('#hero-expense-note').textContent=monthTransactions().filter(t=>t.kind==='expense').length?`${monthTransactions().filter(t=>t.kind==='expense').length} รายการที่บันทึก`:'ยังไม่มีรายการรายจ่าย';
    $('#radar-spend').textContent=currency(exp); $('#radar-save').textContent=currency(waste*12);
    $('#metric-expenses').textContent=currency(exp); $('#metric-expense-caption').textContent=`${monthTransactions().filter(t=>t.kind==='expense').length} รายการในเดือนนี้`;
    $('#metric-subs-year').textContent=currency(annual); $('#metric-subs-caption').textContent=`${activeSubs().length} บริการที่ยังใช้งาน`;
    $('#metric-upcoming').textContent=currency(upcomingAmount); $('#metric-upcoming-caption').textContent=`${upcoming.length} บริการใน 7 วัน`;
    $('#metric-savings').textContent=currency(waste*12); $('#nav-sub-count').textContent=activeSubs().length;
    renderCategoryChart($('#category-chart'));
    renderUpcoming(); renderLeak(); renderCheckin();
  }
  function categoryTotals() {
    const totals={}; monthTransactions().filter(t=>t.kind==='expense').forEach(t=>{const c=t.category||'อื่นๆ';totals[c]=(totals[c]||0)+Number(t.amount||0);});
    return Object.entries(totals).sort((a,b)=>b[1]-a[1]);
  }
  function renderCategoryChart(container) {
    const items=categoryTotals().slice(0,6), max=items[0]?.[1]||0;
    if(!items.length) { container.innerHTML='<div class="empty-chart"><span>◒</span><p>ยังไม่มีข้อมูลรายจ่ายในเดือนนี้<br>เพิ่มรายการเพื่อดูว่าเงินไปหมวดไหนบ้าง</p></div>'; return; }
    container.innerHTML=items.map(([cat,value])=>{const info=categoryInfo[cat]||categoryInfo['อื่นๆ'];return `<div class="category-row"><div class="category-name"><span class="category-emoji">${info.icon}</span><span>${escapeHTML(cat)}</span></div><div class="category-track"><div class="category-fill" style="width:${Math.max(3,value/max*100)}%;background:${info.color}"></div></div><div class="category-value">${currency(value)}</div></div>`}).join('');
  }
  function renderUpcoming() {
    const list=$('#upcoming-list'), items=comingSubs(7);
    $('#upcoming-total-footer').textContent=currency(items.reduce((s,x)=>s+Number(x.amount),0));
    if(!items.length) { list.innerHTML='<div class="empty-inline"><span>☀️</span><span>ไม่มีบริการที่ตัดเงินใน 7 วันข้างหน้า</span></div>'; return; }
    list.innerHTML=items.slice(0,4).map(s=>{const info=subInfo[s.category]||subInfo['อื่นๆ'];const d=daysUntil(s.dueDate);const label=d===0?'วันนี้':d===1?'พรุ่งนี้':`อีก ${d} วัน`;return `<div class="upcoming-row"><span class="app-tile" style="background:${info.bg}">${escapeHTML(s.icon||info.icon)}</span><div class="upcoming-copy"><strong>${escapeHTML(s.name)}</strong><small>${escapeHTML(s.category)} · ${label}</small></div><div class="upcoming-amount"><strong>${currency(s.amount)}</strong><small>${cycleLabels[s.cycle]||'รายเดือน'}</small></div></div>`}).join('');
  }
  function renderLeak() {
    const items=reviewSubs().sort((a,b)=>monthlyCost(b)-monthlyCost(a));
    $('#leak-annual').innerHTML=`${currency(reviewMonthlyCost()*12)}<span>/ปี</span>`;
    $('#leak-summary').textContent=items.length?`มี ${items.length} บริการที่คุณระบุว่าใช้น้อยหรือไม่ได้ใช้ ลองทบทวนก่อนวันตัดเงิน`:'เพิ่มบริการและบอกความถี่ที่ใช้ เพื่อหาจุดที่อาจลดได้';
    $('#leak-mini-list').innerHTML=items.slice(0,2).map(s=>{const info=subInfo[s.category]||subInfo['อื่นๆ'];return `<div class="leak-mini-row"><span class="leak-mini-ico" style="background:${info.bg}">${escapeHTML(s.icon||info.icon)}</span><span>${escapeHTML(s.name)} <small>· ${usageLabels[s.usage]||'ยังไม่ระบุ'}</small></span><strong>${currency(monthlyCost(s))}/ด.</strong></div>`}).join('');
  }
  function renderCheckin() {
    const has=state.lastCheckin===todayISO(); $('#daily-checkin').disabled=has;
    $('#daily-checkin').innerHTML=has?'<span>✓</span> เช็กอินวันนี้แล้ว <span class="button-arrow">✦</span>':'<span>✓</span> เช็กอินวันนี้ <span class="button-arrow">→</span>';
    $('#task-check-icon').classList.toggle('done',has); $('#streak-count').textContent=`${state.streak||0} วัน`;
    $('#checkin-message').textContent=has?'เยี่ยมเลย วันนี้คุณมาแล้ว':'แค่หนึ่งนาทีก็ถือว่าดูแลตัวเองแล้ว';
  }
  function renderExpenses() {
    const income=currentIncome(), exp=currentExpenses();
    $('#ledger-income').textContent=currency(income);$('#ledger-expenses').textContent=currency(exp);$('#ledger-balance').textContent=currency(income-exp);
    const search=($('#ledger-search').value||'').trim().toLowerCase(), filter=$('#ledger-filter').value;
    let rows=monthTransactions().filter(t=>(filter==='all'||t.kind===filter) && `${t.title} ${t.category} ${t.note||''}`.toLowerCase().includes(search)).sort((a,b)=>b.date.localeCompare(a.date));
    $('#ledger-count').textContent=`${rows.length} รายการในเดือนนี้`;
    $('#transaction-list').innerHTML=rows.map(t=>{const isIncome=t.kind==='income';return `<div class="transaction-row"><div class="transaction-main"><span class="tx-icon">${isIncome?(t.category==='เงินเดือน'?'💼':'💰'):iconForCategory(t.category)}</span><div style="min-width:0"><div class="tx-title">${escapeHTML(t.title)}</div><div class="tx-subtitle">${escapeHTML(t.note||t.category||'ไม่ระบุหมวด')}</div></div></div><span class="tx-category">${escapeHTML(t.category||'อื่นๆ')}</span><span class="tx-kind ${isIncome?'income':''}">${isIncome?'รายรับ':'รายจ่าย'}</span><span class="tx-date">${thaiDate(t.date,{day:'numeric',month:'short'})}</span><strong class="tx-amount ${isIncome?'':'negative'}">${isIncome?'+':'−'}${currency(t.amount)}</strong><div class="row-actions"><button class="row-action" data-edit-tx="${t.id}" aria-label="แก้ไข">✎</button><button class="row-action" data-delete-tx="${t.id}" aria-label="ลบ">×</button></div></div>`}).join('');
    $('#ledger-empty').hidden=rows.length>0;
  }
  function renderSubscriptions() {
    const items=[...state.subscriptions].filter(s=>subFilter==='all'||(subFilter==='review'&&s.active!==false&&['rarely','never'].includes(s.usage))||(subFilter==='upcoming'&&s.active!==false&&daysUntil(s.dueDate)>=0&&daysUntil(s.dueDate)<=7));
    $('#sub-page-monthly').textContent=currency(monthlySubsCost());$('#sub-page-annual').textContent=currency(annualSubsCost());$('#sub-total-count').textContent=activeSubs().length;
    $('#subscription-grid').innerHTML=items.map(s=>{
      const info=subInfo[s.category]||subInfo['อื่นๆ'], d=daysUntil(s.dueDate), isReview=['rarely','never'].includes(s.usage), inactive=s.active===false;
      const dueText=inactive?'หยุดติดตามแล้ว':d<0?'รอกำหนดวันตัดเงิน':d===0?'ตัดเงินวันนี้':d===1?'ตัดเงินพรุ่งนี้':`ตัดเงิน ${thaiDate(s.dueDate,{day:'numeric',month:'short'})}`;
      return `<article class="sub-card" style="${inactive?'opacity:.64':''}"><div class="sub-card-header"><span class="sub-app-icon" style="background:${info.bg}">${escapeHTML(s.icon||info.icon)}</span><div class="sub-title-wrap"><strong>${escapeHTML(s.name)}</strong><span>${escapeHTML(s.category)} · ${cycleLabels[s.cycle]||'รายเดือน'}</span></div><span class="sub-status" style="${inactive?'background:#f0f1ed;color:#8b948c':''}">${inactive?'หยุดติดตาม': 'ใช้งานอยู่'}</span></div><div class="sub-cost-line"><strong>${currency(s.amount)}</strong><span>/${s.cycle==='yearly'?'ปี':s.cycle==='weekly'?'สัปดาห์':s.cycle==='quarterly'?'3 เดือน':'เดือน'}</span></div><div class="sub-year-line">เฉลี่ย ${currency(monthlyCost(s))}/เดือน · รวม ${currency(annualCost(s))}/ปี</div><div class="sub-meta"><span class="sub-due">◷ <strong>${dueText}</strong></span><span class="usage-pill ${isReview?'review':''}">${usageEmojis[s.usage]||'🫧'} ${usageLabels[s.usage]||'ยังไม่ระบุ'}</span></div><div class="sub-card-bottom"><span class="sub-note">${isReview?'อาจมีโอกาสประหยัด':inactive?'ไม่รวมยอดภาระ':'บันทึกไว้ใน LifeRadar'}</span><div class="sub-actions"><button class="sub-action" data-edit-sub="${s.id}">แก้ไข</button><button class="sub-action" data-toggle-sub="${s.id}">${inactive?'เปิดติดตาม':'พัก'}</button><button class="sub-action delete" data-delete-sub="${s.id}">ลบ</button></div></div></article>`;
    }).join('');
    $('#subscription-empty').hidden=items.length>0;
    $('#nav-sub-count').textContent=activeSubs().length;
  }
  function renderInsights() {
    renderCategoryChart($('#insight-category-chart'));
    const exp=currentExpenses(), day=new Date().getDate(), daysInMonth=new Date(new Date().getFullYear(),new Date().getMonth()+1,0).getDate();
    const projected=day>0?exp/day*daysInMonth:0, subs=reviewSubs().sort((a,b)=>monthlyCost(b)-monthlyCost(a)), savings=reviewMonthlyCost();
    let headline='เริ่มจากการเห็นภาพ แล้วค่อยเลือกสิ่งที่เปลี่ยนได้'; let summary='บันทึกรายรับ รายจ่าย และ Subscription เพื่อให้ LifeRadar วิเคราะห์จากข้อมูลของคุณจริง ๆ';
    if(exp>0) { const p=projected; headline=p>state.budget?`ถ้าใช้จังหวะเดิม รายจ่ายอาจแตะ ${currency(p)} สิ้นเดือน`: 'คุณกำลังสร้างภาพการเงินของตัวเองได้ชัดขึ้น'; summary=`บันทึกรายจ่ายแล้ว ${currency(exp)} ใน ${day} วันแรกของเดือน ตัวเลขสิ้นเดือนเป็นเพียงการคำนวณตามค่าเฉลี่ย ไม่ได้ทำนายค่าใช้จ่ายจริง`; }
    if(savings>0) summary+=` และมีบริการที่ระบุว่าใช้น้อย ซึ่งอาจประหยัดได้ถึง ${currency(savings*12)} ต่อปีหากคุณเลือกยกเลิกทั้งหมด`;
    $('#insight-headline').textContent=headline; $('#insight-summary').textContent=summary;
    $('#insight-savings-year').textContent=currency(savings*12); $('#insight-savings-month').textContent=currency(savings);
    $('#savings-progress-fill').style.width=`${Math.min(100,state.budget? savings/state.budget*100:0)}%`;
    $('#insight-review-list').innerHTML=subs.length?subs.slice(0,4).map(s=>{const info=subInfo[s.category]||subInfo['อื่นๆ'];return `<div class="review-row"><span class="app-tile" style="background:${info.bg}">${escapeHTML(s.icon||info.icon)}</span><span>${escapeHTML(s.name)} <small>· ${usageLabels[s.usage]}</small></span><strong>${currency(monthlyCost(s))}/ด.</strong></div>`}).join(''):'<div class="empty-inline"><span>🌿</span><span>ยังไม่มีบริการที่ต้องทบทวน ลองเพิ่ม Subscription และระบุความถี่การใช้</span></div>';
    $('#projection-spent').textContent=currency(exp);$('#projection-total').textContent=currency(projected);
    const percent=state.budget>0?projected/state.budget*100:0;$('#projection-budget-fill').style.width=`${Math.min(100,percent)}%`;
    $('#projection-budget-fill').style.background=percent>100?'#e88e78':percent>80?'#e7bc6b':'#7fb999';
    $('#projection-budget-caption').textContent=state.budget?`ใช้จังหวะเดิมจะอยู่ที่ประมาณ ${Math.round(percent)}% ของงบ ${currency(state.budget)}`:'ยังไม่ได้ตั้งงบประมาณ';
  }
  function renderSettings() { $('#monthly-budget').value=state.budget||0; }
  function renderAll() { normalizeDueDates(); renderHeader(); renderOverview(); renderExpenses(); renderSubscriptions(); renderInsights(); renderSettings(); $('#demo-banner').hidden=!state.isDemo; }
  const viewNames={overview:'ภาพรวมวันนี้',expenses:'รายรับ–รายจ่าย',subscriptions:'Subscription',insights:'อินไซต์ของฉัน',settings:'ตั้งค่าและข้อมูล'};
  function switchView(name) {
    if(!viewNames[name])return;
    $$('[data-panel]').forEach(p=>{const active=p.dataset.panel===name;p.hidden=!active;p.classList.toggle('active',active);});
    $$('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===name));
    $('#breadcrumb-title').textContent=viewNames[name];
    window.location.hash=name==='overview'?'overview':name;
    if(name==='expenses')renderExpenses();if(name==='subscriptions')renderSubscriptions();if(name==='insights')renderInsights();
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function toast(message,type='success') { const el=document.createElement('div');el.className=`toast ${type==='error'?'error':''}`;el.textContent=message;$('#toast-region').appendChild(el);setTimeout(()=>{el.style.opacity='0';el.style.transform='translateY(5px)';setTimeout(()=>el.remove(),200)},3600); }
  function optionHTML(items,current) { return items.map(x=>`<option value="${escapeHTML(x.value)}" ${x.value===current?'selected':''}>${escapeHTML(x.label)}</option>`).join(''); }
  function field(label,name,value,type='text',opts={}) {
    const full=opts.full?' full-field':''; const help=opts.help?`<small class="field-help">${opts.help}</small>`:'';
    let control='';
    if(opts.options) control=`<select name="${name}" ${opts.required===false?'':'required'}>${optionHTML(opts.options,value)}</select>`;
    else if(type==='textarea')control=`<textarea name="${name}" rows="2" ${opts.required===false?'':'required'}>${escapeHTML(value||'')}</textarea>`;
    else control=`<input name="${name}" type="${type}" value="${escapeHTML(value??'')}" ${type==='number'?'min="0" step="any"':''} ${opts.required===false?'':'required'} ${opts.placeholder?`placeholder="${escapeHTML(opts.placeholder)}"`:''}>`;
    return `<div class="form-field${full}"><label for="f-${name}">${label}</label>${control.replace(`name="${name}"`,`id="f-${name}" name="${name}"`)}${help}</div>`;
  }
  function openDialog(kind,id=null) {
    dialogKind=kind;editing=id;const item=id?(kind==='expense'||kind==='income'?state.transactions.find(t=>t.id===id):state.subscriptions.find(s=>s.id===id)):null;
    const title=kind==='subscription'?(item?'แก้ไข Subscription':'เพิ่ม Subscription'):kind==='budget'?'ตั้งงบรายเดือน':item?'แก้ไขรายการ':kind==='income'?'เพิ่มรายรับ':'บันทึกรายจ่าย';
    $('#dialog-title').textContent=title;$('#dialog-eyebrow').textContent=kind==='subscription'?'RECURRING PAYMENT':kind==='budget'?'MONTHLY PLAN':'QUICK MONEY ENTRY';
    $('#dialog-subtitle').textContent=kind==='subscription'?'ใส่ราคา รอบบิล และบอกความถี่ในการใช้ เพื่อช่วยมองเห็นบริการที่อาจไม่คุ้ม':kind==='budget'?'เลือกงบที่สอดคล้องกับชีวิตจริง แล้วค่อยปรับได้เสมอ':'ใส่ข้อมูลเท่าที่รู้ ยิ่งบันทึกครบยิ่งเห็นภาพจริง';
    let html='';
    if(kind==='expense'||kind==='income') {
      const isIncome=kind==='income';
      const currentCategory=item?.category||(isIncome?'เงินเดือน':'อื่นๆ');
      const quickCats=isIncome?[['เงินเดือน','💼'],['ฟรีแลนซ์','✨'],['อื่นๆ','➕']]:[['อาหาร','🍜'],['กาแฟ/ขนม','☕'],['เดินทาง','🚆'],['ช้อปปิ้ง','🛍️'],['บ้าน/บิล','🏡'],['อื่นๆ','➕']];
      html+=`<div class="quick-kind-switch full-field"><button type="button" data-kind-switch="expense" class="${kind==='expense'?'selected':''}">↘ จ่ายเงิน</button><button type="button" data-kind-switch="income" class="${kind==='income'?'selected':''}">↗ ได้รับเงิน</button></div>`;
      html+=`<div class="quick-amount-wrap full-field"><label for="f-amount">${isIncome?'ได้เงินเท่าไหร่?':'จ่ายไปเท่าไหร่?'}</label><div class="quick-amount-input"><span>฿</span><input id="f-amount" name="amount" type="number" min="0.01" step="any" inputmode="decimal" placeholder="0" value="${item?.amount??''}" required autofocus></div><small>ใส่แค่ตัวเลขก็พอ รายละเอียดค่อยเติมทีหลังได้</small></div>`;
      html+=`<div class="quick-category-wrap full-field"><div class="quick-category-title">${isIncome?'เงินมาจากไหน?':'กดเลือกถ้าอยากแยกหมวด (ไม่เลือกก็ได้)'}</div><div class="quick-category-chips">${quickCats.map(([c,icon])=>`<button type="button" class="quick-cat ${c===currentCategory?'selected':''}" data-quick-category="${c}"><span>${icon}</span>${c}</button>`).join('')}</div><input type="hidden" id="f-category" name="category" value="${currentCategory}"></div>`;
      html+=`<div class="quick-extra full-field"><label for="f-title">จำว่าเป็นค่าอะไร? <span>ไม่บังคับ</span></label><input id="f-title" name="title" type="text" value="${escapeHTML(item?.title||'')}" placeholder="เช่น ข้าวเที่ยง, BTS, เงินเดือน"><input type="hidden" id="f-date" name="date" value="${item?.date||todayISO()}"><input type="hidden" id="f-note" name="note" value="${escapeHTML(item?.note||'')}"></div>`;
    } else if(kind==='subscription') {
      html+=field('ชื่อบริการ','name',item?.name||'','text',{full:true,placeholder:'เช่น Netflix, Spotify, Cloud Storage'});
      html+=field('ราคาในแต่ละรอบ (บาท)','amount',item?.amount??'','number');
      html+=field('เรียกเก็บแบบไหน','cycle',item?.cycle||'monthly','select',{options:[{value:'monthly',label:'ทุกเดือน'},{value:'yearly',label:'ทุกปี'},{value:'quarterly',label:'ทุก 3 เดือน'},{value:'weekly',label:'ทุกสัปดาห์'}]});
      html+=field('หมวดหมู่','category',item?.category||'สตรีมมิง','select',{options:subCategories.map(c=>({value:c,label:`${subInfo[c].icon} ${c}`}))});
      html+=field('วันตัดเงินครั้งถัดไป','dueDate',item?.dueDate||dateOffset(7),'date');
      html+=field('ใช้บ่อยแค่ไหน?','usage',item?.usage||'weekly','select',{options:[{value:'daily',label:'💚 ใช้ทุกวัน'},{value:'weekly',label:'🙂 ใช้ทุกสัปดาห์'},{value:'monthly',label:'🫧 ใช้บางครั้ง'},{value:'rarely',label:'🟠 ใช้น้อย'},{value:'never',label:'🔎 ไม่ได้ใช้'}]});
      html+=field('หมายเหตุ (ไม่บังคับ)','note',item?.note||'','text',{full:true,required:false,placeholder:'แพ็กเกจอะไร / เงื่อนไขที่ควรรู้'});
      html+=`<div class="form-field full-field"><span class="field-help">ยอดรายปีและค่าเฉลี่ยรายเดือนจะคำนวณให้ทันทีหลังบันทึก ไม่มีการเชื่อมต่อหรือยกเลิกบริการแทนคุณ</span></div>`;
    } else if(kind==='budget') {
      html+=field('งบประมาณรายเดือน (บาท)','budget',state.budget,'number',{full:true});
    }
    $('#dialog-fields').innerHTML=html;$('#dialog-submit').textContent=kind==='budget'?'บันทึกงบ':item?'บันทึกการแก้ไข':kind==='subscription'?'เพิ่มบริการ':'บันทึกรายการ';
    $('#entry-dialog').showModal();
  }
  function closeDialog() { $('#entry-dialog').close();dialogKind=null;editing=null; }
  function handleEntrySubmit(e) {
    e.preventDefault();const form=new FormData(e.currentTarget);const data=Object.fromEntries(form.entries());
    if(dialogKind==='budget'){state.budget=Math.max(0,Number(data.budget)||0);save();renderAll();closeDialog();toast('อัปเดตงบประมาณแล้ว');return;}
    if(dialogKind==='subscription') {
      const entry={name:data.name.trim(),amount:Number(data.amount),cycle:data.cycle,category:data.category,dueDate:data.dueDate,usage:data.usage,note:(data.note||'').trim(),icon:subInfo[data.category]?.icon||'✳️',active:true};
      if(!entry.name||!(entry.amount>0)||!entry.dueDate){toast('กรอกชื่อ ราคา และวันตัดเงินให้ครบก่อนนะ','error');return;}
      if(state.isDemo && !editing) { if(!confirm('ตอนนี้เป็นข้อมูลตัวอย่าง หากบันทึกบริการจริง ระบบจะลบข้อมูลตัวอย่างออกก่อน ต้องการดำเนินการต่อไหม?')) return; state=emptyState(); }
      if(editing){const index=state.subscriptions.findIndex(s=>s.id===editing);if(index>=0)state.subscriptions[index]={...state.subscriptions[index],...entry};toast('แก้ไข Subscription แล้ว');}
      else {state.subscriptions.unshift({...entry,id:uid()});toast('เพิ่ม Subscription แล้ว');}
      save();renderAll();closeDialog();return;
    }
    let kind=dialogKind; if(data.kind)kind=data.kind;
    const entry={title:(data.title||'').trim(),amount:Number(data.amount),date:data.date,category:data.category,kind:kind==='income'?'income':'expense',note:(data.note||'').trim()};
    if(!(entry.amount>0)||!entry.date){toast('ใส่จำนวนเงินก่อนนะครับ','error');return;} if(!entry.title) entry.title=entry.kind==='income'?'รายรับ':'รายจ่าย'; if(!entry.category) entry.category=entry.kind==='income'?'อื่นๆ':'อื่นๆ';
    if(state.isDemo && !editing) { if(!confirm('ตอนนี้เป็นข้อมูลตัวอย่าง หากบันทึกรายการจริง ระบบจะลบข้อมูลตัวอย่างออกก่อน ต้องการดำเนินการต่อไหม?')) return; state=emptyState(); }
    if(editing){const index=state.transactions.findIndex(t=>t.id===editing);if(index>=0)state.transactions[index]={...state.transactions[index],...entry};toast('แก้ไขรายการแล้ว');}
    else {state.transactions.unshift({...entry,id:uid()});toast(entry.kind==='income'?'บันทึกรายรับแล้ว':'บันทึกรายจ่ายแล้ว');}
    save();renderAll();closeDialog();
  }
  function exportData() {
    const blob=new Blob([JSON.stringify({...state,exportedAt:new Date().toISOString(),app:'LifeRadar'},null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`LifeRadar-backup-${todayISO()}.json`;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);toast('ดาวน์โหลดไฟล์สำรองแล้ว');
  }
  function importData(file) {
    const reader=new FileReader();reader.onload=()=>{try{const data=JSON.parse(reader.result);if(!data||!Array.isArray(data.transactions)||!Array.isArray(data.subscriptions))throw new Error('รูปแบบไฟล์ไม่ถูกต้อง');if(!confirm('นำเข้าข้อมูลนี้และแทนที่ข้อมูลที่อยู่ในเบราว์เซอร์ปัจจุบันหรือไม่? แนะนำให้ดาวน์โหลดไฟล์สำรองก่อน'))return;state={version:1,isDemo:false,budget:Number(data.budget)||15000,transactions:data.transactions,subscriptions:data.subscriptions,checkins:Array.isArray(data.checkins)?data.checkins:[],streak:Number(data.streak)||0,lastCheckin:data.lastCheckin||null};save();renderAll();$('#import-message').textContent='นำเข้าข้อมูลสำเร็จ';toast('นำเข้าข้อมูลแล้ว');}catch(err){$('#import-message').textContent='ไฟล์นี้ไม่ใช่ข้อมูลสำรอง LifeRadar ที่ถูกต้อง';toast('นำเข้าไม่ได้: รูปแบบไฟล์ไม่ถูกต้อง','error');}};reader.readAsText(file);
  }
  let digestIndex=0, digestTimer=null;
  function digestSlides(){
    const exp=currentExpenses(), income=currentIncome(), subs=monthlySubsCost(), review=reviewMonthlyCost(), upcoming=activeSubs().filter(s=>daysUntil(s.dueDate)>=0&&daysUntil(s.dueDate)<=7).reduce((n,s)=>n+monthlyCost(s),0);
    const budget=Number(state.budget)||0, projected=new Date().getDate()?exp/new Date().getDate()*new Date(new Date().getFullYear(),new Date().getMonth()+1,0).getDate():0;
    return [
      {kicker:'ภาพรวมเงินเดือนนี้',title:exp?'เงินออกไปแล้วเท่าไหร่?':'เริ่มเห็นเงินของตัวเอง',body:exp?`รายจ่ายที่คุณบันทึกอยู่ที่ ${currency(exp)}${budget?` จากงบ ${currency(budget)}`:''}`:'บันทึกรายจ่ายแค่ยอดเงินก็เริ่มเห็นภาพรวมได้ ไม่จำเป็นต้องกรอกทุกช่อง',stat:currency(exp),foot:budget?(exp>budget?'รายจ่ายเกินงบที่ตั้งไว้แล้ว ลองดูรายการล่าสุด':'ตัวเลขคำนวณจากรายการที่บันทึก ไม่รวมธุรกรรมที่ยังไม่ได้เพิ่ม'):'ตั้งงบรายเดือนเพื่อเทียบจังหวะการใช้เงิน'},
      {kicker:'เงินที่จ่ายซ้ำ',title:review?`มี ${currency(review)} ต่อเดือนที่ควรทบทวน`:'เช็กสมาชิกที่จ่ายซ้ำ',body:review?`บริการที่คุณระบุว่าใช้น้อยอาจรวมเป็น ${currency(review*12)} ต่อปี ถ้าไม่คุ้ม ค่อยพิจารณาจัดการทีละบริการ`:'เพิ่มบริการที่จ่ายประจำ แล้วระบุว่าใช้น้อยหรือไม่ได้ใช้ เพื่อคำนวณโอกาสประหยัด',stat:currency(review*12),foot:'ประมาณการต่อปีจากบริการที่คุณทำเครื่องหมายว่าใช้น้อย'},
      {kicker:'สิ่งที่กำลังจะมาถึง',title:upcoming?`เตรียมรับยอดตัดเงิน ${currency(upcoming)}`:'มีอะไรจะตัดเงินเร็ว ๆ นี้ไหม?',body:upcoming?'ตรวจวันตัดเงินใน 7 วันข้างหน้า เพื่อให้ยอดที่เกิดซ้ำไม่ทำให้แผนเดือนนี้สะดุด':'บันทึกวันตัดเงินของบริการที่มี แล้ว LifeRadar จะรวมยอดใกล้ถึงกำหนดให้',stat:currency(upcoming),foot:`รายรับที่บันทึกเดือนนี้ ${currency(income)} · ประมาณการรายจ่ายสิ้นเดือน ${currency(projected)}`}
    ];
  }
  function showDigestSlide(index){
    const slides=digestSlides();digestIndex=(index+slides.length)%slides.length;const s=slides[digestIndex];
    $('#digest-slide').classList.remove('digest-slide-in');void $('#digest-slide').offsetWidth;$('#digest-slide').classList.add('digest-slide-in');
    $('#digest-title').textContent=s.title;$('#digest-body').textContent=s.body;$('#digest-stat').textContent=s.stat;$('#digest-foot').textContent=s.foot;$('.digest-kicker').textContent=s.kicker;
    $$('#digest-progress i').forEach((el,i)=>el.classList.toggle('active',i===digestIndex));$$('#digest-dots i').forEach((el,i)=>el.classList.toggle('active',i===digestIndex));
    $('#digest-prev').disabled=digestIndex===0;$('#digest-next').textContent=digestIndex===slides.length-1?'ดูอีกครั้ง ↻':'ถัดไป →';
  }
  function openDigest(auto=false){showDigestSlide(0);if(!$('#digest-dialog').open)$('#digest-dialog').showModal();if(digestTimer)clearInterval(digestTimer);digestTimer=setInterval(()=>{if(!$('#digest-dialog').open){clearInterval(digestTimer);digestTimer=null;return;}showDigestSlide(digestIndex+1);},6500);if(auto)localStorage.setItem('liferadar.digest-day',todayISO());}
  function closeDigest(){if($('#digest-dialog').open)$('#digest-dialog').close();if(digestTimer)clearInterval(digestTimer);digestTimer=null;localStorage.setItem('liferadar.digest-day',todayISO());}
  function bindEvents() {
    $$('[data-view]').forEach(b=>b.addEventListener('click',()=>switchView(b.dataset.view)));
    $$('[data-goto]').forEach(b=>b.addEventListener('click',()=>switchView(b.dataset.goto)));
    $('#quick-expense').addEventListener('click',()=>openDialog('expense'));$('#hero-add-expense').addEventListener('click',()=>openDialog('expense'));$('#expense-add-page').addEventListener('click',()=>openDialog('expense'));
    $('#hero-review-subs').addEventListener('click',()=>switchView('subscriptions'));$('#subscription-add-page').addEventListener('click',()=>openDialog('subscription'));$('#empty-add-sub').addEventListener('click',()=>openDialog('subscription'));$('#empty-add-expense').addEventListener('click',()=>openDialog('expense'));
    $('#daily-checkin').addEventListener('click',()=>{if(state.lastCheckin===todayISO())return;const yesterday=dateOffset(-1);state.streak=state.lastCheckin===yesterday?(state.streak||0)+1:1;state.lastCheckin=todayISO();state.checkins=[...new Set([...(state.checkins||[]),todayISO()])].slice(-365);save();renderCheckin();toast('เช็กอินสำเร็จ! ขอบคุณที่ใช้เวลาดูแลตัวเอง ✦');});
    $('#start-real-data').addEventListener('click',()=>{if(!confirm('เริ่มพื้นที่จริงแบบว่างเปล่าใช่ไหม? ข้อมูลตัวอย่างจะถูกลบออก คุณสามารถเพิ่มข้อมูลของตัวเองได้ทันที'))return;state=emptyState();save();renderAll();toast('พร้อมเริ่มบันทึกข้อมูลของคุณแล้ว');});
    $('#ledger-search').addEventListener('input',renderExpenses);$('#ledger-filter').addEventListener('change',renderExpenses);
    $$('[data-sub-filter]').forEach(b=>b.addEventListener('click',()=>{subFilter=b.dataset.subFilter;$$('[data-sub-filter]').forEach(x=>x.classList.toggle('active',x===b));renderSubscriptions();}));
    $('#transaction-list').addEventListener('click',e=>{const edit=e.target.closest('[data-edit-tx]'),del=e.target.closest('[data-delete-tx]');if(edit){const tx=state.transactions.find(t=>t.id===edit.dataset.editTx);if(tx)openDialog(tx.kind,tx.id);}if(del){const tx=state.transactions.find(t=>t.id===del.dataset.deleteTx);if(tx&&confirm(`ลบรายการ “${tx.title}” ใช่ไหม?`)){state.transactions=state.transactions.filter(t=>t.id!==tx.id);save();renderAll();toast('ลบรายการแล้ว');}}});
    $('#subscription-grid').addEventListener('click',e=>{const edit=e.target.closest('[data-edit-sub]'),del=e.target.closest('[data-delete-sub]'),toggle=e.target.closest('[data-toggle-sub]');if(edit)openDialog('subscription',edit.dataset.editSub);if(del){const s=state.subscriptions.find(x=>x.id===del.dataset.deleteSub);if(s&&confirm(`ลบ ${s.name} ออกจากรายการใช่ไหม?`)){state.subscriptions=state.subscriptions.filter(x=>x.id!==s.id);save();renderAll();toast('ลบบริการแล้ว');}}if(toggle){const s=state.subscriptions.find(x=>x.id===toggle.dataset.toggleSub);if(s){s.active=s.active===false;save();renderAll();toast(s.active?'กลับมาติดตามบริการนี้แล้ว':'พักการติดตามบริการแล้ว');}}});
    $('#dialog-close').addEventListener('click',closeDialog);$('#dialog-cancel').addEventListener('click',closeDialog);$('#entry-form').addEventListener('submit',handleEntrySubmit);
    $('#dialog-fields').addEventListener('click',e=>{const cat=e.target.closest('[data-quick-category]');if(cat){const value=cat.dataset.quickCategory;$('#f-category').value=value;$$('[data-quick-category]').forEach(b=>b.classList.toggle('selected',b===cat));const title=$('#f-title');if(title&&!title.value.trim()&&value!=='อื่นๆ')title.placeholder=`เช่น ${value}`;}});
    $('#daily-digest-open').addEventListener('click',()=>openDigest(false));
    $('#digest-close').addEventListener('click',closeDigest);$('#digest-prev').addEventListener('click',()=>showDigestSlide(digestIndex-1));$('#digest-next').addEventListener('click',()=>showDigestSlide(digestIndex+1));
    $('#digest-dialog').addEventListener('click',e=>{if(e.target===$('#digest-dialog'))closeDigest();});
    $('#dialog-fields').addEventListener('click',e=>{const b=e.target.closest('[data-kind-switch]');if(!b)return;const kind=b.dataset.kindSwitch;dialogKind=kind;const nameField=$('#f-title');const currentTitle=nameField?.value||'';const currentAmount=$('#f-amount')?.value||'';const currentDate=$('#f-date')?.value||todayISO();const currentNote=$('#f-note')?.value||'';openDialog(kind,editing);if($('#f-title'))$('#f-title').value=currentTitle;if($('#f-amount'))$('#f-amount').value=currentAmount;if($('#f-date'))$('#f-date').value=currentDate;if($('#f-note'))$('#f-note').value=currentNote;const category=$('#f-category');if(category)category.value=kind==='income'?'เงินเดือน':'อื่นๆ';$$('[data-quick-category]').forEach(b=>b.classList.toggle('selected',b.dataset.quickCategory===category?.value));});
    $('#save-budget').addEventListener('click',()=>{state.budget=Math.max(0,Number($('#monthly-budget').value)||0);save();renderAll();$('#budget-save-message').textContent='บันทึกงบประมาณแล้ว';toast('บันทึกงบประมาณแล้ว');});$('#edit-budget-inline').addEventListener('click',()=>openDialog('budget'));
    $('#export-data').addEventListener('click',exportData);$('#export-quick').addEventListener('click',exportData);$('#import-file').addEventListener('change',e=>{const file=e.target.files?.[0];if(file)importData(file);e.target.value='';});
    $('#clear-all-data').addEventListener('click',()=>{if(!confirm('ลบข้อมูลทั้งหมดจาก LifeRadar ในเบราว์เซอร์นี้จริงหรือไม่? การกระทำนี้ย้อนกลับไม่ได้ หากยังไม่ได้สำรองจะกู้คืนไม่ได้'))return;state=emptyState();save();renderAll();toast('ล้างข้อมูลแล้ว เริ่มใหม่ได้เลย');});
    $('#entry-dialog').addEventListener('click',e=>{if(e.target===$('#entry-dialog'))closeDialog();});
    window.addEventListener('hashchange',()=>{const name=location.hash.replace('#','');if(viewNames[name])switchView(name);});
  }
  function init() { if(!localStorage.getItem(STORAGE_KEY)){save();} bindEvents();renderAll();const hash=location.hash.replace('#','');if(viewNames[hash])switchView(hash);if('serviceWorker'in navigator && location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{}); if(localStorage.getItem('liferadar.digest-day')!==todayISO()) setTimeout(()=>{if(!$('#entry-dialog').open)openDigest(true);},1800); }
  init();
})();
