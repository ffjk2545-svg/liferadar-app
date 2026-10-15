(() => {
  'use strict';
  const STORAGE_KEY = 'liferadar.v1';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const iconPaths = {
    grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    arrows:'<path d="M7 7h11l-3-3M18 7l-3 3M17 17H6l3 3M6 17l3-3"/>',
    repeat:'<path d="m17 2 4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>',
    wallet:'<rect x="3" y="5" width="18" height="15" rx="2.5"/><path d="M3 9h18M16 14h2"/>',
    chart:'<path d="M3 3v18h18"/><path d="m7 14 4-4 4 3 6-7"/>',
    settings:'<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.8 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.8-1l-1.7.6-1.4-2.4L7 15a8 8 0 0 1 0-2l-.1-.1-1.4-1.1 1.4-2.4 1.7.6a8 8 0 0 1 1.8-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.8 1l1.7-.6 1.4 2.4-1.4 1.1a8 8 0 0 1 0 2Z"/>',
    shield:'<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
    download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    'arrow-right':'<path d="M5 12h14M12 5l7 7-7 7"/>',
    'arrow-up-right':'<path d="M7 17 17 7M7 7h10v10"/>',
    'arrow-down-left':'<path d="M17 7 7 17M17 17H7V7"/>',
    'calendar-clock':'<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 9h18M12 13v4l3 1"/>',
    target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    lightbulb:'<path d="M9 18h6M10 22h4M8.4 14.5A6 6 0 1 1 15.6 14.5c-.9.7-1.3 1.5-1.4 2.5h-4.4c-.1-1-.5-1.8-1.4-2.5Z"/>',
    info:'<circle cx="12" cy="12" r="10"/><path d="M12 11v5M12 8h.01"/>',
    utensils:'<path d="M7 2v8M4 2v5a3 3 0 0 0 6 0V2M7 10v12M17 2v20M17 2c-3 3-3 8 0 10"/>',
    car:'<path d="m5 11 1.5-5h11L19 11M3 16v-5l2-2h14l2 2v5M5 16v3M19 16v3M3 15h18"/><circle cx="7" cy="15" r="1"/><circle cx="17" cy="15" r="1"/>',
    'shopping-bag':'<path d="M5 8h14l1 13H4L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/>',
    package:'<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="M3 8v9l9 5 9-5V8M12 13v9"/>',
    tv:'<rect x="3" y="4" width="18" height="14" rx="2"/><path d="m8 22 4-4 4 4M8 2l4 2 4-2"/>',
    'heart-pulse':'<path d="M20.8 8.7c0 5.1-8.8 11.1-8.8 11.1S3.2 13.8 3.2 8.7A4.7 4.7 0 0 1 12 6.4a4.7 4.7 0 0 1 8.8 2.3Z"/><path d="M4 12h4l2-4 3.5 8 2-4H20"/>',
    house:'<path d="m3 10 9-7 9 7"/><path d="M5 9v12h14V9M9 21v-7h6v7"/>',
    coffee:'<path d="M5 8h12v7a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8Z"/><path d="M17 10h2a2 2 0 1 1 0 4h-2M8 3c0 2 2 2 2 4M13 3c0 2 2 2 2 4"/>',
    'book-open':'<path d="M12 7v14M3 5.5A2.5 2.5 0 0 1 5.5 3H12v18H5.5A2.5 2.5 0 0 0 3 23V5.5ZM21 5.5A2.5 2.5 0 0 0 18.5 3H12v18h6.5A2.5 2.5 0 0 1 21 23V5.5Z"/>',
    briefcase:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 12h18M10 12v2h4v-2"/>',
    laptop:'<rect x="5" y="4" width="14" height="12" rx="1.5"/><path d="M2 20h20l-2-4H4l-2 4Z"/>',
    'circle-ellipsis':'<circle cx="12" cy="12" r="10"/><path d="M8 12h.01M12 12h.01M16 12h.01"/>',
    headphones:'<path d="M3 13v-1a9 9 0 0 1 18 0v1"/><rect x="3" y="12" width="5" height="8" rx="2"/><rect x="16" y="12" width="5" height="8" rx="2"/>',
    cloud:'<path d="M7 18a5 5 0 1 1 1-9.9A6 6 0 0 1 20 10a4 4 0 0 1-1 8H7Z"/>',
    gamepad:'<path d="M6 9h12a4 4 0 0 1 3.8 5l-1 3.5a2.5 2.5 0 0 1-4.3 1l-1.5-1.5H9l-1.5 1.5a2.5 2.5 0 0 1-4.3-1L2.2 14A4 4 0 0 1 6 9Z"/><path d="M7 12v4M5 14h4M16 13h.01M18 15h.01"/>',
    wifi:'<path d="M5 9a11 11 0 0 1 14 0M8 12a6.5 6.5 0 0 1 8 0M11 15a2 2 0 0 1 2 0M12 19h.01"/>',
    zap:'<path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z"/>',
    'calendar-days':'<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 9h18M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01"/>',
    search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    receipt:'<path d="M5 3h14v18l-3-2-4 2-4-2-3 2V3Z"/><path d="M8 8h8M8 12h8M8 16h4"/>',
    edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/>',
    'trash-2':'<path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15M10 10v7M14 10v7"/>',
    x:'<path d="m18 6-12 12M6 6l12 12"/>',
    check:'<path d="m5 12 4 4L19 6"/>',
    'chart-no-axes-combined':'<path d="M3 3v18h18"/><path d="m7 14 4-4 4 3 6-8"/><path d="M16 5h5v5"/>',
    sliders:'<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M2 14h4M10 8h4M18 16h4"/>',
    database:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5-5 5 5M12 5v12"/>',
    'shield-check':'<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
    'folder-open':'<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v1H5a2 2 0 0 0-2 2V7Z"/><path d="m3 12 1.5 7H19l2-9H5a2 2 0 0 0-2 2Z"/>',
    menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
    list:'<path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/>',
    sparkles:'<path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z"/><path d="m19 14 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z"/>',
  };
  const icon = (name) => `<svg aria-hidden="true" viewBox="0 0 24 24">${iconPaths[name] || iconPaths['circle-ellipsis']}</svg>`;
  const applyIcons = (root = document) => $$('[data-icon]', root).forEach(el => { el.innerHTML = icon(el.dataset.icon); });

  const categoryInfo = {
    'อาหาร':{icon:'utensils',color:'#79b48e',soft:'#edf6ef'}, 'เดินทาง':{icon:'car',color:'#7ca8c9',soft:'#edf5fa'}, 'ช้อปปิ้ง':{icon:'shopping-bag',color:'#c39a70',soft:'#fbf2e9'},
    'ของใช้':{icon:'package',color:'#9b9fce',soft:'#f0f0fa'}, 'บันเทิง':{icon:'tv',color:'#a187c4',soft:'#f5effa'}, 'สุขภาพ':{icon:'heart-pulse',color:'#77aca2',soft:'#eaf5f3'},
    'บ้าน/บิล':{icon:'house',color:'#a9ae74',soft:'#f5f5e9'}, 'กาแฟ/ขนม':{icon:'coffee',color:'#b88c70',soft:'#f8f0e9'}, 'การเรียน':{icon:'book-open',color:'#7b9dcc',soft:'#edf2fa'},
    'เงินเดือน':{icon:'briefcase',color:'#4d9c70',soft:'#eaf5ee'}, 'ฟรีแลนซ์':{icon:'laptop',color:'#7a90bb',soft:'#eef1f9'}, 'รายได้อื่น':{icon:'chart',color:'#79a987',soft:'#edf6ef'}, 'อื่นๆ':{icon:'circle-ellipsis',color:'#98a69b',soft:'#f2f5f2'}
  };
  const subInfo = {
    'สตรีมมิง':{icon:'tv',soft:'#f4eef8'}, 'เพลง':{icon:'headphones',soft:'#eef3fb'}, 'พื้นที่เก็บข้อมูล':{icon:'cloud',soft:'#edf5fb'},
    'ทำงาน/เรียน':{icon:'book-open',soft:'#edf6ed'}, 'สุขภาพ/ฟิตเนส':{icon:'heart-pulse',soft:'#eef7f2'}, 'เกม':{icon:'gamepad',soft:'#f0effa'},
    'ช้อปปิ้ง':{icon:'package',soft:'#faf2e8'}, 'อินเทอร์เน็ต/มือถือ':{icon:'wifi',soft:'#edf5fa'}, 'บิล/สาธารณูปโภค':{icon:'zap',soft:'#f7f5e9'}, 'อื่นๆ':{icon:'repeat',soft:'#f1f5f1'}
  };
  const expenseCategories = ['อาหาร','เดินทาง','ช้อปปิ้ง','ของใช้','บันเทิง','สุขภาพ','บ้าน/บิล','กาแฟ/ขนม','การเรียน','อื่นๆ'];
  const incomeCategories = ['เงินเดือน','ฟรีแลนซ์','รายได้อื่น','อื่นๆ'];
  const subCategories = Object.keys(subInfo);
  const cycleLabels = {monthly:'รายเดือน',yearly:'รายปี',quarterly:'ทุก 3 เดือน',weekly:'รายสัปดาห์'};
  const usageLabels = {daily:'เกือบทุกวัน',weekly:'ทุกสัปดาห์',monthly:'บางครั้งในเดือน',rarely:'ใช้น้อย',never:'ไม่ได้ใช้'};
  const defaultCategoryBudgets = {'อาหาร':5000,'เดินทาง':1800,'ช้อปปิ้ง':1500,'ของใช้':1200,'บันเทิง':1000,'สุขภาพ':800,'บ้าน/บิล':2500,'กาแฟ/ขนม':900,'การเรียน':800,'อื่นๆ':1000};

  const localISO = (date) => { const d = new Date(date); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0,10); };
  const todayISO = () => localISO(new Date());
  const dateOffset = (days) => { const d = new Date(); d.setDate(d.getDate() + days); return localISO(d); };
  const dateForMonthOffset = (offset, day=1) => { const d=new Date();d.setDate(1);d.setMonth(d.getMonth()+offset);const last=new Date(d.getFullYear(),d.getMonth()+1,0).getDate();d.setDate(Math.min(day,last));return localISO(d); };
  const monthKey = date => String(date || '').slice(0,7);
  const monthId = (offset=0) => { const d=new Date();d.setDate(1);d.setMonth(d.getMonth()+offset);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`; };
  const parseMonth = key => new Date(`${key}-01T12:00:00`);
  const monthLabel = key => new Intl.DateTimeFormat('th-TH',{month:'short'}).format(parseMonth(key));
  const currency = value => new Intl.NumberFormat('th-TH',{style:'currency',currency:'THB',maximumFractionDigits:0}).format(Number(value)||0);
  const number = value => new Intl.NumberFormat('th-TH',{maximumFractionDigits:0}).format(Number(value)||0);
  const shortMoney = value => { const n=Number(value)||0; if(n>=1000000)return `฿${(n/1000000).toFixed(1)}M`;if(n>=10000)return `฿${(n/1000).toFixed(0)}k`;if(n>=1000)return `฿${(n/1000).toFixed(1)}k`;return `฿${number(n)}`; };
  const thaiDate = (date, options={day:'numeric',month:'short'}) => { if(!date)return 'ยังไม่กำหนด'; const d=new Date(`${date}T12:00:00`);return new Intl.DateTimeFormat('th-TH',options).format(d); };
  const escapeHTML = text => String(text ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`;
  const daysUntil = date => { if(!date)return 999;const a=new Date(`${todayISO()}T00:00:00`),b=new Date(`${date}T00:00:00`);return Math.round((b-a)/86400000); };
  const monthTransactions = (key=monthKey(todayISO())) => state.transactions.filter(t=>monthKey(t.date)===key);
  const totalsFor = (key=monthKey(todayISO())) => monthTransactions(key).reduce((acc,t)=>{acc[t.kind==='income'?'income':'expense']+=Number(t.amount)||0;return acc;},{income:0,expense:0});
  const currentExpenses = () => totalsFor().expense;
  const currentIncome = () => totalsFor().income;
  const activeSubs = () => state.subscriptions.filter(s=>s.active!==false);
  const monthlyCost = sub => { const amount=Number(sub.amount)||0;return ({monthly:amount,yearly:amount/12,quarterly:amount/3,weekly:amount*52/12})[sub.cycle] ?? amount; };
  const annualCost = sub => monthlyCost(sub)*12;
  const monthlySubsCost = () => activeSubs().reduce((sum,s)=>sum+monthlyCost(s),0);
  const annualSubsCost = () => monthlySubsCost()*12;
  const reviewSubs = () => activeSubs().filter(s=>['rarely','never'].includes(s.usage));
  const reviewMonthlyCost = () => reviewSubs().reduce((sum,s)=>sum+monthlyCost(s),0);
  const comingSubs = (days=7) => activeSubs().filter(s=>daysUntil(s.dueDate)>=0&&daysUntil(s.dueDate)<=days).sort((a,b)=>a.dueDate.localeCompare(b.dueDate));
  const transactionTotalsForCategory = (key=monthKey(todayISO())) => { const totals={};monthTransactions(key).filter(t=>t.kind==='expense').forEach(t=>{const c=t.category||'อื่นๆ';totals[c]=(totals[c]||0)+(Number(t.amount)||0);});return Object.entries(totals).sort((a,b)=>b[1]-a[1]); };
  const getMonthTotalsHistory = () => Array.from({length:6},(_,i)=>{const key=monthId(i-5),totals=totalsFor(key);return {key,label:monthLabel(key),...totals};});

  function createDemoState() {
    const subs = [
      ['Netflix',419,'สตรีมมิง','weekly',3,'monthly'],['Music Premium',169,'เพลง','daily',1,'monthly'],['Cloud Storage',35,'พื้นที่เก็บข้อมูล','daily',5,'monthly'],
      ['Video Premium',179,'สตรีมมิง','weekly',9,'monthly'],['Fitness / Gym',990,'สุขภาพ/ฟิตเนส','rarely',6,'monthly'],['Design Suite',249,'ทำงาน/เรียน','rarely',4,'monthly'],['Google One',79,'พื้นที่เก็บข้อมูล','weekly',2,'monthly']
    ].map(([name,amount,category,usage,due,cycle])=>({id:uid(),name,amount,category,usage,dueDate:dateOffset(due),cycle,active:true,note:''}));
    const seeds = [
      [-1,'กาแฟตอนเช้า',85,'กาแฟ/ขนม','expense'],[-1,'ค่าเดินทาง',48,'เดินทาง','expense'],[-2,'อาหารกลางวัน',125,'อาหาร','expense'],[-2,'ของใช้ในบ้าน',320,'ของใช้','expense'],[-3,'ข้าวเย็น',185,'อาหาร','expense'],[-4,'เติมน้ำมัน',250,'เดินทาง','expense'],[-4,'ขนมกับกาแฟ',115,'กาแฟ/ขนม','expense'],[-5,'ค่าโทรศัพท์',399,'บ้าน/บิล','expense'],[-5,'ซื้อของออนไลน์',490,'ช้อปปิ้ง','expense'],[-7,'อาหารกับเพื่อน',390,'อาหาร','expense'],[-8,'ค่าเดินทาง',95,'เดินทาง','expense'],[-10,'ของใช้ส่วนตัว',240,'ของใช้','expense'],[-11,'ดูหนัง',280,'บันเทิง','expense'],[-13,'ซื้ออาหาร',160,'อาหาร','expense'],[-14,'ค่าไฟ',840,'บ้าน/บิล','expense'],[-16,'กาแฟ',90,'กาแฟ/ขนม','expense'],[-18,'หนังสือ/คอร์ส',590,'การเรียน','expense'],[-20,'อาหาร',240,'อาหาร','expense'],[-22,'เดินทาง',110,'เดินทาง','expense'],[-24,'ซื้อของใช้',350,'ของใช้','expense']
    ].map(([offset,title,amount,category,kind])=>({id:uid(),date:dateOffset(offset),title,amount,category,kind,note:''}));
    seeds.push({id:uid(),date:dateForMonthOffset(0,1),title:'เงินเดือน',amount:35000,category:'เงินเดือน',kind:'income',note:'รายรับประจำ'});
    seeds.push({id:uid(),date:dateForMonthOffset(-1,1),title:'เงินเดือน',amount:35000,category:'เงินเดือน',kind:'income',note:'รายรับประจำ'});
    seeds.push({id:uid(),date:dateForMonthOffset(-2,1),title:'เงินเดือน',amount:34500,category:'เงินเดือน',kind:'income',note:'รายรับประจำ'});
    const goals=[{id:uid(),name:'เงินสำรองฉุกเฉิน',target:60000,current:21500,targetDate:dateForMonthOffset(8,1)},{id:uid(),name:'ทริปพักผ่อน',target:18000,current:6500,targetDate:dateForMonthOffset(5,1)}];
    return {version:2,isDemo:true,budget:15000,categoryBudgets:{...defaultCategoryBudgets},transactions:seeds,subscriptions:subs,goals,checkins:[],streak:0,lastCheckin:null};
  }
  function emptyState() { return {version:2,isDemo:false,budget:15000,categoryBudgets:{...defaultCategoryBudgets},transactions:[],subscriptions:[],goals:[],checkins:[],streak:0,lastCheckin:null}; }
  let state;
  try { state=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null') || createDemoState(); }
  catch { state=createDemoState(); }
  if(!state||typeof state!=='object')state=createDemoState();
  state.version=2;state.budget=Number.isFinite(Number(state.budget))&&Number(state.budget)>=0?Number(state.budget):15000;
  state.transactions=Array.isArray(state.transactions)?state.transactions:[];
  state.subscriptions=Array.isArray(state.subscriptions)?state.subscriptions:[];
  state.goals=Array.isArray(state.goals)?state.goals:[];
  state.checkins=Array.isArray(state.checkins)?state.checkins:[];
  state.categoryBudgets={...defaultCategoryBudgets,...(state.categoryBudgets||{})};
  state.transactions=state.transactions.map(t=>({...t,id:t.id||uid(),date:t.date||todayISO(),title:t.title||((t.kind==='income')?'รายรับ':'รายจ่าย'),amount:Number(t.amount)||0,kind:t.kind==='income'?'income':'expense',category:t.category||'อื่นๆ',note:t.note||''}));
  state.subscriptions=state.subscriptions.map(s=>({...s,id:s.id||uid(),name:s.name||'บริการไม่ระบุชื่อ',amount:Number(s.amount)||0,category:s.category||'อื่นๆ',cycle:cycleLabels[s.cycle]?s.cycle:'monthly',usage:usageLabels[s.usage]?s.usage:'monthly',active:s.active!==false,dueDate:s.dueDate||todayISO(),note:s.note||''}));
  state.goals=state.goals.map(g=>({...g,id:g.id||uid(),name:g.name||'เป้าหมายใหม่',target:Math.max(1,Number(g.target)||1),current:Math.max(0,Number(g.current)||0),targetDate:g.targetDate||''}));
  let subFilter='all';
  let activeTransactionDialogId=null;

  function save() { try { localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); } catch { toast('พื้นที่จัดเก็บเต็ม กรุณาดาวน์โหลดไฟล์สำรอง','error'); } }
  function applyIconsToNewContent(root) { applyIcons(root); }
  function serviceIcon(category) { return subInfo[category]?.icon||'repeat'; }
  function categoryIcon(category) { return categoryInfo[category]?.icon||'circle-ellipsis'; }
  function normalizeDueDates() {
    let changed=false;
    state.subscriptions.forEach(s=>{if(!s.dueDate||s.active===false)return;let loops=0;while(s.dueDate<todayISO()&&loops++<36){const d=new Date(`${s.dueDate}T12:00:00`);if(s.cycle==='weekly')d.setDate(d.getDate()+7);else if(s.cycle==='quarterly')d.setMonth(d.getMonth()+3);else if(s.cycle==='yearly')d.setFullYear(d.getFullYear()+1);else d.setMonth(d.getMonth()+1);s.dueDate=localISO(d);changed=true;}});
    if(changed)save();
  }
  function switchView(name,updateHash=true) {
    const valid=['overview','expenses','subscriptions','budgets','insights','settings'];if(!valid.includes(name))name='overview';
    $$('.view-panel').forEach(panel=>{const active=panel.dataset.panel===name;panel.hidden=!active;panel.classList.toggle('active',active);});
    $$('[data-view]').forEach(btn=>btn.classList.toggle('active',btn.dataset.view===name));
    const labels={overview:'ภาพรวม',expenses:'ธุรกรรม',subscriptions:'รายจ่ายประจำ',budgets:'งบประมาณและเป้าหมาย',insights:'อินไซต์',settings:'ตั้งค่าและข้อมูล'};
    $('#breadcrumb-title').textContent=labels[name];
    if(updateHash&&location.hash!==`#${name}`)history.replaceState(null,'',`#${name}`);
    $('#sidebar').classList.remove('mobile-open');document.body.classList.remove('nav-open');
    window.scrollTo({top:0,behavior:'smooth'});
    if(name==='expenses')renderTransactions();
  }
  let quickKind='expense';
  function renderQuickCategories(kind=quickKind, selected='') {
    const all=kind==='income'?incomeCategories:expenseCategories;
    const popular=kind==='income'?['เงินเดือน','ฟรีแลนซ์','รายได้อื่น']:['อาหาร','กาแฟ/ขนม','เดินทาง','บ้าน/บิล','ช้อปปิ้ง'];
    const select=$('#quick-category');
    select.innerHTML=`<option value="">หมวดเพิ่มเติม</option>`+all.map(cat=>`<option value="${escapeHTML(cat)}">${escapeHTML(cat)}</option>`).join('');
    select.value=all.includes(selected)?selected:'';
    $('#quick-category-chips').innerHTML=popular.map(cat=>{const info=categoryInfo[cat]||categoryInfo['อื่นๆ'];return `<button type="button" class="quick-category-chip ${selected===cat?'selected':''}" data-quick-category="${escapeHTML(cat)}" aria-pressed="${selected===cat?'true':'false'}"><span>${icon(info.icon)}</span><span>${escapeHTML(cat)}</span></button>`;}).join('');
    applyIconsToNewContent($('#quick-category-chips'));
  }
  function setQuickKind(kind) {
    quickKind=kind==='income'?'income':'expense';
    $$('[data-quick-kind]').forEach(btn=>{const active=btn.dataset.quickKind===quickKind;btn.classList.toggle('active',active);btn.classList.toggle('expense-mode',active&&quickKind==='expense');btn.classList.toggle('income-mode',active&&quickKind==='income');btn.setAttribute('aria-pressed',active?'true':'false');});
    $('#quick-capture-card').classList.toggle('income-mode',quickKind==='income');
    $('#quick-title').placeholder=quickKind==='income'?'เช่น เงินเดือน / รับเงินคืน':'เช่น กาแฟตอนเช้า / ค่าเดินทาง';
    $('#quick-category').value='';
    renderQuickCategories(quickKind,'');
  }
  function handleQuickEntrySubmit(event) {
    event.preventDefault();
    const amount=Number($('#quick-amount').value);
    if(!Number.isFinite(amount)||amount<=0){toast('ใส่จำนวนเงินมากกว่า 0 เพื่อบันทึก','error');$('#quick-amount').focus();return;}
    // If the user starts entering real data from the demo workspace, clear only the marked sample dataset first.
    const wasDemo=state.isDemo;
    if(wasDemo){state=emptyState();}
    const kind=quickKind,category=$('#quick-category').value||'อื่นๆ';
    const title=$('#quick-title').value.trim()||(kind==='income'?'รายรับ':'รายจ่าย');
    state.transactions.push({id:uid(),kind,title,category,amount,date:todayISO(),note:''});
    state.isDemo=false;save();renderAll();
    const card=$('#quick-capture-card');card.classList.add('is-saved');setTimeout(()=>card.classList.remove('is-saved'),1200);
    $('#quick-amount').value='';$('#quick-title').value='';$('#quick-category').value='';renderQuickCategories(quickKind,'');
    toast(wasDemo?`เริ่มใช้ข้อมูลจริงแล้ว · บันทึก ${currency(amount)} เรียบร้อย`:`${kind==='income'?'บันทึกรายรับ':'บันทึกรายจ่าย'} ${currency(amount)} แล้ว`);
    $('#quick-amount').focus({preventScroll:true});
  }
  function showArrivalNotice() {
    const key='liferadar.arrival-notice-date';
    try{if(localStorage.getItem(key)===todayISO())return;}catch{}
    const totals=totalsFor(),budget=Number(state.budget)||0,pct=budget?totals.expense/budget*100:0;
    const due=comingSubs(1),review=reviewSubs();let message='พร้อมแล้วสำหรับวันนี้ — กดบันทึกเร็วด้านบนเพื่อเก็บทุกยอดไว้ในที่เดียว',type='info';
    if(due.length){message=due.length===1?`${due[0].name} จะตัดเงิน${daysUntil(due[0].dueDate)===0?'วันนี้':'พรุ่งนี้'} · ${currency(due[0].amount)} เตรียมยอดไว้ได้เลย`: `${due.length} รายการจะตัดเงินวันนี้หรือพรุ่งนี้ · รวม ${currency(due.reduce((sum,s)=>sum+s.amount,0))}`;type='info';}
    else if(budget&&pct>=100){message=`รายจ่ายที่บันทึกใช้เกินงบเดือนนี้ ${Math.round(pct)}% แล้ว ลองดูหมวดที่ปรับได้`;type='warning';}
    else if(budget&&pct>=85){message=`ใช้ไป ${Math.round(pct)}% ของงบเดือนนี้แล้ว · เหลืองบ ${currency(budget-totals.expense)}`;type='warning';}
    else if(review.length&&reviewMonthlyCost()>0){message=`มี ${review.length} บริการที่คุณระบุว่าใช้น้อย · อาจทบทวนค่าใช้จ่ายได้ปีละ ${currency(reviewMonthlyCost()*12)}`;type='info';}
    else if(!state.transactions.length){message='เริ่มต้นได้ง่าย ๆ: ใส่จำนวนเงินในช่องบันทึกเร็วด้านบน แค่นั้นก็พอ';type='info';}
    try{localStorage.setItem(key,todayISO());}catch{}
    setTimeout(()=>toast(message,type),780);
  }

  function renderHeader() {
    const d=new Date();
    $('#overview-month').textContent=new Intl.DateTimeFormat('th-TH',{month:'long',year:'numeric'}).format(d);
    $('#insight-month').textContent=new Intl.DateTimeFormat('th-TH',{month:'long',year:'numeric'}).format(d);
    $('#footer-year').textContent=String(d.getFullYear());
    $('#demo-banner').hidden=!state.isDemo;
  }
  function renderOverview() {
    const totals=totalsFor(),exp=totals.expense,income=totals.income,net=income-exp,budget=Number(state.budget)||0,remaining=budget-exp,monthlySubs=monthlySubsCost(),potential=reviewMonthlyCost()*12,upcoming=comingSubs(7);
    $('#overview-balance').textContent=currency(net);$('#overview-balance').style.color=net<0?'#ffc6aa':'#fbfff9';
    $('#balance-caption').textContent=income||exp?'รายรับลบรายจ่ายจากรายการที่บันทึกในเดือนนี้':'เพิ่มธุรกรรมเพื่อเริ่มเห็นกระแสเงินสด';
    $('#overview-income').textContent=currency(income);$('#overview-expenses').textContent=currency(exp);$('#overview-budget-remaining').textContent=budget?currency(remaining):'ยังไม่ตั้งงบ';
    $('#metric-income').textContent=currency(income);$('#metric-expenses').textContent=currency(exp);$('#metric-recurring').textContent=currency(monthlySubs);$('#metric-savings').textContent=currency(potential);
    $('#metric-income-note').textContent=`${monthTransactions().filter(t=>t.kind==='income').length} รายการในเดือนนี้`;
    $('#metric-expense-note').textContent=`${monthTransactions().filter(t=>t.kind==='expense').length} รายการในเดือนนี้`;
    $('#metric-recurring-note').textContent=`${activeSubs().length} บริการที่ยังติดตาม`;
    $('#metric-savings-note').textContent=`${reviewSubs().length} บริการที่ควรทบทวน`;
    $('#nav-sub-count').textContent=activeSubs().length;
    const pct=budget>0?exp/budget*100:0;$('#budget-used').textContent=currency(exp);$('#budget-total').textContent=`จาก ${currency(budget)}`;
    $('#budget-progress').style.width=`${Math.min(100,pct)}%`;$('#budget-progress').style.background=pct>=100?'#ce6e59':pct>=80?'#d0a04f':'#4a9e70';
    $('#budget-percent').textContent=`${Math.round(pct)}% ของงบที่ใช้ไป`;
    const status=$('#budget-status');status.className='status-pill '+(budget===0?'status-warn':pct>=100?'status-over':pct>=80?'status-warn':'status-good');status.textContent=budget===0?'ยังไม่ตั้งงบ':pct>=100?'เกินงบ':pct>=80?'ใกล้เต็มงบ':'ตามแผน';
    const budgetInsight=$('#budget-insight p');
    budgetInsight.textContent=budget===0?'ตั้งงบของคุณเองเพื่อให้ LifeRadar ช่วยเทียบจังหวะการใช้เงิน':pct>=100?'รายจ่ายเกินงบที่ตั้งไว้แล้ว ลองทบทวนรายการในหมวดที่ยืดหยุ่นได้':pct>=80?'ใช้ไปมากกว่า 80% ของงบแล้ว เหลืองบ '+currency(remaining):`เหลืองบ ${currency(remaining)} ลองใช้ตัวเลขนี้เป็นแนวทางวางแผนที่เหลือของเดือน`;
    const quickHint=$('#quick-budget-hint');quickHint.classList.toggle('warn',budget>0&&pct>=80&&pct<100);quickHint.classList.toggle('over',budget>0&&pct>=100);
    quickHint.querySelector('span:last-child').textContent=budget?`${pct>=100?'เกินงบ ': 'เหลืองบ '}${currency(Math.abs(remaining))}`:'ตั้งงบเพื่อดูงบคงเหลือ';
    const todayCount=state.transactions.filter(t=>t.date===todayISO()).length;$('#quick-entry-count').textContent=`บันทึกวันนี้ ${todayCount} รายการ`;
    renderTrendChart($('#trend-chart'));renderCategoryBreakdown($('#category-breakdown'),$('#category-total'),$('#category-total-label'));renderUpcoming();renderRecent();
  }
  function renderTrendChart(container) {
    const data=getMonthTotalsHistory(),max=Math.max(1,...data.flatMap(d=>[d.income,d.expense]));
    container.innerHTML=data.map(d=>{const hi=d.income?Math.max(2,d.income/max*100):2,he=d.expense?Math.max(2,d.expense/max*100):2;return `<div class="trend-month"><div class="bar-pair"><div class="chart-bar income-bar" style="height:${hi}%" data-tooltip="รายรับ ${escapeHTML(currency(d.income))}" aria-label="รายรับ ${escapeHTML(currency(d.income))}"></div><div class="chart-bar expense-bar" style="height:${he}%" data-tooltip="รายจ่าย ${escapeHTML(currency(d.expense))}" aria-label="รายจ่าย ${escapeHTML(currency(d.expense))}"></div></div><span class="trend-month-label">${escapeHTML(d.label)}</span></div>`;}).join('');
  }
  function renderCategoryBreakdown(container,totalEl,labelEl,key=monthKey(todayISO())) {
    const items=transactionTotalsForCategory(key).slice(0,5),total=items.reduce((sum,item)=>sum+item[1],0),max=items[0]?.[1]||0;
    totalEl.textContent=currency(total);labelEl.textContent='รายจ่ายรวม';
    if(!items.length){container.innerHTML=`<div class="empty-state small-empty"><span class="empty-icon">${icon('chart')}</span><strong>ยังไม่มีข้อมูลหมวดหมู่</strong><p>บันทึกรายจ่ายพร้อมหมวดหมู่ แล้วจะแสดงภาพรวมที่นี่</p></div>`;return;}
    container.innerHTML=items.map(([cat,amount])=>{const info=categoryInfo[cat]||categoryInfo['อื่นๆ'];return `<div class="category-line"><div class="category-line-label"><span class="category-line-icon" style="background:${info.soft};color:${info.color}">${icon(info.icon)}</span><span>${escapeHTML(cat)}</span></div><div class="category-line-track"><span style="width:${Math.max(2,amount/max*100)}%;background:${info.color}"></span></div><span class="category-line-value">${currency(amount)}</span></div>`;}).join('');applyIconsToNewContent(container);
  }
  function formatDue(date) { const d=daysUntil(date);if(d===0)return 'วันนี้';if(d===1)return 'พรุ่งนี้';if(d>1&&d<=7)return `อีก ${d} วัน`;return thaiDate(date,{day:'numeric',month:'short'}); }
  function renderUpcoming() {
    const list=$('#upcoming-list'),items=comingSubs(7),sum=items.reduce((acc,s)=>acc+Number(s.amount||0),0);$('#upcoming-total').textContent=currency(sum);
    if(!items.length){list.innerHTML=`<div class="empty-state small-empty"><span class="empty-icon">${icon('calendar-days')}</span><strong>ยังไม่มีรายการใกล้ถึงกำหนด</strong><p>เพิ่มวันเรียกเก็บของบริการที่จ่ายประจำเพื่อให้เห็นล่วงหน้า</p><button class="button button-secondary button-small" data-open-subscription>${icon('plus')} เพิ่มบริการ</button></div>`;applyIconsToNewContent(list);return;}
    list.innerHTML=items.slice(0,4).map(s=>{const info=subInfo[s.category]||subInfo['อื่นๆ'];const d=daysUntil(s.dueDate);return `<div class="upcoming-row"><span class="service-mark" style="background:${info.soft};color:#567e62">${icon(info.icon)}</span><div class="upcoming-copy"><strong>${escapeHTML(s.name)}</strong><span>${escapeHTML(s.category)} · ${escapeHTML(formatDue(s.dueDate))}</span></div><div class="upcoming-amount"><strong>${currency(s.amount)}</strong><small>${escapeHTML(cycleLabels[s.cycle]||'รายเดือน')}</small></div></div>`;}).join('');applyIconsToNewContent(list);
  }
  function renderTransactionRow(t,compact=false) {
    const isIncome=t.kind==='income',cat=t.category||'อื่นๆ',info=categoryInfo[cat]||categoryInfo['อื่นๆ'];
    return `<div class="tx-row"><div class="tx-name-cell"><span class="tx-cat-mark" style="background:${info.soft};color:${info.color}">${icon(info.icon)}</span><div class="tx-name-copy"><strong>${escapeHTML(t.title|| (isIncome?'รายรับ':'รายจ่าย'))}</strong><small>${escapeHTML(t.note||cat)}</small></div></div><span class="tx-category-label">${escapeHTML(cat)}</span><span class="tx-date-label">${escapeHTML(thaiDate(t.date,{day:'numeric',month:'short',year:'2-digit'}))}</span><strong class="tx-amount-label ${isIncome?'income':''}">${isIncome?'+':'−'}${currency(t.amount)}</strong><div class="tx-actions"><button class="row-icon-button" data-edit-tx="${escapeHTML(t.id)}" title="แก้ไขรายการ" aria-label="แก้ไขรายการ">${icon('edit')}</button><button class="row-icon-button danger" data-delete-tx="${escapeHTML(t.id)}" title="ลบรายการ" aria-label="ลบรายการ">${icon('trash-2')}</button></div></div>`;
  }
  function renderRecent() {
    const rows=[...state.transactions].sort((a,b)=>`${b.date}|${b.id}`.localeCompare(`${a.date}|${a.id}`)).slice(0,5);
    $('#recent-list').innerHTML=rows.map(t=>renderTransactionRow(t,true)).join('');$('#recent-empty').hidden=rows.length>0;applyIconsToNewContent($('#recent-list'));
  }
  function getTransactionPeriod() {
    const period=$('#transaction-period').value;
    if(period==='all')return state.transactions;
    if(period==='last-month')return monthTransactions(monthId(-1));
    return monthTransactions();
  }
  function renderTransactions() {
    const totals=totalsFor();$('#tx-month-income').textContent=currency(totals.income);$('#tx-month-expense').textContent=currency(totals.expense);$('#tx-month-net').textContent=currency(totals.income-totals.expense);$('#tx-month-net').style.color=totals.income-totals.expense<0?'#bd5e4c':'#233b2c';
    const search=($('#transaction-search')?.value||'').trim().toLocaleLowerCase('th-TH'),filter=$('#transaction-filter').value;
    const rows=getTransactionPeriod().filter(t=>(filter==='all'||t.kind===filter)&&`${t.title} ${t.category} ${t.note||''}`.toLocaleLowerCase('th-TH').includes(search)).sort((a,b)=>`${b.date}|${b.id}`.localeCompare(`${a.date}|${a.id}`));
    $('#transaction-count').textContent=`พบ ${rows.length} รายการ`;
    $('#transaction-list').innerHTML=rows.map(t=>renderTransactionRow(t)).join('');$('#transaction-empty').hidden=rows.length>0;applyIconsToNewContent($('#transaction-list'));
  }
  function renderSubscriptions() {
    const items=state.subscriptions.filter(s=>subFilter==='all'||(subFilter==='upcoming'&&s.active!==false&&daysUntil(s.dueDate)>=0&&daysUntil(s.dueDate)<=7)||(subFilter==='review'&&s.active!==false&&['rarely','never'].includes(s.usage))||(subFilter==='inactive'&&s.active===false));
    $('#subs-month-total').textContent=currency(monthlySubsCost());$('#subs-year-total').textContent=currency(annualSubsCost());$('#subs-active-total').textContent=String(activeSubs().length);$('#sub-review-annual').textContent=`${currency(reviewMonthlyCost()*12)}/ปี`;
    $('#sub-review-title').textContent=reviewSubs().length?`${reviewSubs().length} บริการที่ควรทบทวน`:'ยังไม่มีบริการที่ต้องทบทวน';
    $('#sub-review-text').textContent=reviewSubs().length?`บริการที่ระบุว่าใช้น้อยรวมประมาณ ${currency(reviewMonthlyCost())} ต่อเดือน ไม่จำเป็นต้องยกเลิกทันที ลองดูว่าคุ้มกับการใช้งานหรือไม่`:'หากเพิ่มบริการและบอกความถี่การใช้งาน LifeRadar จะช่วยรวบรวมจุดที่ควรกลับมาดู';
    $('#subscription-list').innerHTML=items.map(s=>{const info=subInfo[s.category]||subInfo['อื่นๆ'],inactive=s.active===false,isReview=['rarely','never'].includes(s.usage),d=daysUntil(s.dueDate),dueText=inactive?'หยุดติดตามแล้ว':d===0?'ตัดเงินวันนี้':d===1?'ตัดเงินพรุ่งนี้':d>1&&d<=7?`ตัดเงินอีก ${d} วัน`:`เรียกเก็บ ${thaiDate(s.dueDate,{day:'numeric',month:'short'})}`;return `<article class="subscription-card ${inactive?'inactive':''}"><div class="sub-card-head"><span class="sub-logo" style="background:${info.soft};color:#5f8069">${icon(info.icon)}</span><div class="sub-card-name"><strong>${escapeHTML(s.name)}</strong><span>${escapeHTML(s.category)} · ${escapeHTML(cycleLabels[s.cycle]||'รายเดือน')}</span></div><span class="sub-status ${inactive?'paused':''}">${inactive?'พักไว้':'ติดตามอยู่'}</span></div><div class="sub-price-row"><strong>${currency(s.amount)}</strong><span>/${s.cycle==='yearly'?'ปี':s.cycle==='weekly'?'สัปดาห์':s.cycle==='quarterly'?'3 เดือน':'เดือน'}</span></div><div class="sub-cost-annual">เฉลี่ย ${currency(monthlyCost(s))}/เดือน · ${currency(annualCost(s))}/ปี</div><div class="sub-due-row"><span class="due-date-label">${icon('calendar-days')} ${escapeHTML(dueText)}</span><span class="usage-label ${isReview?'':'good'}">${escapeHTML(usageLabels[s.usage]||'ยังไม่ระบุ')}</span></div><div class="sub-card-actions"><button class="row-icon-button" data-edit-sub="${escapeHTML(s.id)}" title="แก้ไขบริการ" aria-label="แก้ไขบริการ">${icon('edit')}</button><button class="row-icon-button danger" data-delete-sub="${escapeHTML(s.id)}" title="ลบบริการ" aria-label="ลบบริการ">${icon('trash-2')}</button><span class="spacer"></span><button type="button" data-toggle-sub="${escapeHTML(s.id)}">${inactive?'กลับมาติดตาม':'พักการติดตาม'}</button></div></article>`;}).join('');
    $('#subscription-empty').hidden=items.length>0;applyIconsToNewContent($('#subscription-list'));
    $('#nav-sub-count').textContent=activeSubs().length;
  }
  function renderCategoryBudgets() {
    $('#category-budget-list').innerHTML=expenseCategories.map(cat=>{const info=categoryInfo[cat];const used=transactionTotalsForCategory().find(([c])=>c===cat)?.[1]||0;const budget=Number(state.categoryBudgets[cat])||0;const pct=budget?Math.round(used/budget*100):0;return `<label class="category-budget-row"><span class="category-budget-info"><span class="category-line-icon" style="background:${info.soft};color:${info.color}">${icon(info.icon)}</span><span>${escapeHTML(cat)}<small style="display:block;color:#9aa59d;font-size:8px;margin-top:2px">${budget?`${pct}% ของงบ`: 'ยังไม่ตั้งงบ'}</small></span></span><input type="number" min="0" step="100" inputmode="decimal" data-category-budget="${escapeHTML(cat)}" value="${budget||''}" placeholder="ไม่จำกัด" aria-label="งบหมวด${escapeHTML(cat)}"></label>`;}).join('');applyIconsToNewContent($('#category-budget-list'));
  }
  function renderGoalList() {
    const list=$('#goal-list');
    list.innerHTML=state.goals.map(g=>{const pct=Math.min(100,(Number(g.current)||0)/(Number(g.target)||1)*100),remaining=Math.max(0,g.target-g.current),dateText=g.targetDate?`เป้าหมาย ${thaiDate(g.targetDate,{day:'numeric',month:'short',year:'numeric'})}`:'ยังไม่กำหนดวัน';return `<article class="goal-card"><div class="goal-card-head"><span class="goal-symbol">${icon('target')}</span><div class="goal-card-title"><strong>${escapeHTML(g.name)}</strong><small>${escapeHTML(dateText)}</small></div><div class="goal-actions"><button class="row-icon-button" data-edit-goal="${escapeHTML(g.id)}" title="แก้ไขเป้าหมาย" aria-label="แก้ไขเป้าหมาย">${icon('edit')}</button><button class="row-icon-button danger" data-delete-goal="${escapeHTML(g.id)}" title="ลบเป้าหมาย" aria-label="ลบเป้าหมาย">${icon('trash-2')}</button></div></div><div class="goal-total"><strong>${currency(g.current)}</strong><span>จาก ${currency(g.target)}</span></div><div class="goal-progress"><span style="width:${pct}%"></span></div><div class="goal-meta"><span>${Math.round(pct)}% สำเร็จ</span><span>${remaining?`เหลือ ${currency(remaining)}`:'ถึงเป้าหมายแล้ว'}</span></div><div class="goal-card-actions"><button class="button button-secondary" data-edit-goal="${escapeHTML(g.id)}">แก้ไขเป้าหมาย</button><button class="button button-primary" data-contribute-goal="${escapeHTML(g.id)}">เพิ่มเงินออม</button></div></article>`;}).join('');
    $('#goal-empty').hidden=state.goals.length>0;applyIconsToNewContent(list);
  }
  function renderBudgets() {
    $('#monthly-budget-input').value=String(state.budget||0);const spent=currentExpenses(),budget=Number(state.budget)||0;$('#budget-page-spent').textContent=currency(spent);$('#budget-page-left').textContent=currency(budget-spent);$('#budget-page-left').style.color=budget-spent<0?'#b94b4b':'#26382c';renderCategoryBudgets();renderGoalList();
  }
  function renderInsights() {
    const totals=totalsFor(),items=transactionTotalsForCategory(),review=reviewSubs(),reviewTotal=reviewMonthlyCost()*12;
    if(!state.transactions.length){$('#insight-headline').textContent='ข้อมูลเล็ก ๆ ช่วยให้เห็นภาพใหญ่';$('#insight-summary').textContent='เริ่มบันทึกรายรับและรายจ่าย แล้ว LifeRadar จะช่วยสรุปแนวโน้มจากข้อมูลจริงของคุณ';}
    else if(totals.income>totals.expense){$('#insight-headline').textContent='เดือนนี้รายรับสูงกว่ารายจ่ายที่บันทึก';$('#insight-summary').textContent=`มีส่วนต่างประมาณ ${currency(totals.income-totals.expense)} ในเดือนนี้ ลองจัดสรรส่วนหนึ่งให้เป้าหมายที่สำคัญกับคุณ`;}
    else if(totals.expense>totals.income){$('#insight-headline').textContent='รายจ่ายเดือนนี้สูงกว่ารายรับที่บันทึก';$('#insight-summary').textContent='ลองตรวจว่ามีรายการรายรับตกหล่นหรือไม่ จากนั้นพิจารณารายจ่ายที่ปรับได้โดยไม่กระทบสิ่งจำเป็น';}
    else{$('#insight-headline').textContent='เริ่มจากทำให้ภาพการเงินครบถ้วน';$('#insight-summary').textContent='ตัวเลขจะมีประโยชน์ขึ้นเมื่อบันทึกรายการสม่ำเสมอ และใส่หมวดที่ใกล้เคียงกับการใช้จริง';}
    renderTrendChart($('#insight-trend-chart'));const fakeTotal=document.createElement('span'),fakeLabel=document.createElement('span');renderCategoryBreakdown($('#insight-category-list'),fakeTotal,fakeLabel);
    const days=new Date().getDate(),daysInMonth=new Date(new Date().getFullYear(),new Date().getMonth()+1,0).getDate(),projected=days?totals.expense/days*daysInMonth:0;
    $('#pace-spent').textContent=currency(totals.expense);$('#pace-projected').textContent=currency(projected);const pct=state.budget?projected/state.budget*100:0;$('#pace-progress').style.width=`${Math.min(100,pct)}%`;$ ('#pace-progress').style.background=pct>=100?'#ce6e59':pct>=80?'#d0a04f':'#4a9e70';
    $('#pace-caption').textContent=state.budget?`หากจังหวะนี้คงเดิม จะใช้ประมาณ ${Math.round(pct)}% ของงบเดือนนี้`:'ตั้งงบรายเดือนเพื่อเทียบกับการคาดการณ์';
    $('#insight-subscription-list').innerHTML=review.length?review.slice(0,4).map(s=>`<div class="insight-sub-row"><span class="service-mark">${icon(serviceIcon(s.category))}</span><div><strong>${escapeHTML(s.name)}</strong><small>${escapeHTML(usageLabels[s.usage]||'ใช้น้อย')} · ${currency(monthlyCost(s))}/เดือน</small></div><span>${currency(annualCost(s))}/ปี</span></div>`).join(''):`<div class="empty-state small-empty"><span class="empty-icon">${icon('repeat')}</span><strong>ยังไม่มีบริการที่ควรทบทวน</strong><p>เพิ่มรายจ่ายประจำและระบุการใช้งานเพื่อเริ่มประเมิน</p></div>`;
    $('#insight-savings-total').textContent=currency(reviewTotal);applyIconsToNewContent($('#insight-subscription-list'));
  }
  function renderAll() {
    renderHeader();renderOverview();renderTransactions();renderSubscriptions();renderBudgets();renderInsights();applyIcons();
  }

  function populateCategorySelect(kind, selected='') {
    const sel=$('#tx-category'),options=kind==='income'?incomeCategories:expenseCategories;
    sel.innerHTML=`<option value="">ไม่ระบุหมวดหมู่</option>${options.map(c=>`<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join('')}`;
    if(selected&&options.includes(selected))sel.value=selected;else sel.value='';
  }
  function openTransaction(id=null,kind='expense') {
    activeTransactionDialogId=id;const tx=id?state.transactions.find(t=>t.id===id):null;
    $('#transaction-dialog-title').textContent=tx?'แก้ไขธุรกรรม':'เพิ่มธุรกรรม';$('#transaction-dialog-kicker').textContent=tx?'EDIT TRANSACTION':'QUICK ENTRY';$('#tx-id').value=tx?.id||'';
    const currentKind=tx?.kind||(kind==='income'?'income':'expense');$('#tx-kind').value=currentKind;
    $$('[data-tx-kind]').forEach(b=>{const active=b.dataset.txKind===currentKind;b.classList.toggle('selected',active);b.classList.toggle('expense-kind',active&&currentKind==='expense');});
    $('#tx-amount').value=tx?.amount??'';$('#tx-title').value=tx?.title==='รายรับ'||tx?.title==='รายจ่าย'?'':(tx?.title||'');$('#tx-date').value=tx?.date||todayISO();$('#tx-note').value=tx?.note||'';
    populateCategorySelect(currentKind,tx?.category||'');
    const dialog=$('#transaction-dialog');if(!dialog.open)dialog.showModal();setTimeout(()=>$('#tx-amount').focus({preventScroll:true}),60);
  }
  function closeDialog(dialog) { if(dialog?.open)dialog.close(); }
  function openSubscription(id=null) {
    const sub=id?state.subscriptions.find(s=>s.id===id):null;$('#sub-id').value=sub?.id||'';$('#subscription-dialog-title').textContent=sub?'แก้ไขรายจ่ายประจำ':'เพิ่มรายจ่ายประจำ';
    $('#sub-name').value=sub?.name||'';$('#sub-amount').value=sub?.amount??'';$('#sub-cycle').value=sub?.cycle||'monthly';$('#sub-category').innerHTML=subCategories.map(c=>`<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join('');$('#sub-category').value=sub?.category||'อื่นๆ';$('#sub-due').value=sub?.dueDate||dateOffset(7);$('#sub-usage').value=sub?.usage||'monthly';$('#sub-note').value=sub?.note||'';
    const dialog=$('#subscription-dialog');if(!dialog.open)dialog.showModal();setTimeout(()=>$('#sub-name').focus({preventScroll:true}),60);
  }
  function openGoal(id=null) {
    const g=id?state.goals.find(x=>x.id===id):null;$('#goal-id').value=g?.id||'';$('#goal-dialog-title').textContent=g?'แก้ไขเป้าหมาย':'สร้างเป้าหมายการออม';$('#goal-name').value=g?.name||'';$('#goal-target').value=g?.target??'';$('#goal-current').value=g?.current??0;$('#goal-date').value=g?.targetDate||'';
    const dialog=$('#goal-dialog');if(!dialog.open)dialog.showModal();setTimeout(()=>$('#goal-name').focus({preventScroll:true}),60);
  }
  function setTransactionKind(kind) {
    const currentCategory=$('#tx-category').value;$('#tx-kind').value=kind;
    $$('[data-tx-kind]').forEach(b=>{const active=b.dataset.txKind===kind;b.classList.toggle('selected',active);b.classList.toggle('expense-kind',active&&kind==='expense');});
    populateCategorySelect(kind,kind==='income'&&currentCategory==='เงินเดือน'?'เงินเดือน':kind==='income'&&currentCategory==='ฟรีแลนซ์'?'ฟรีแลนซ์':kind==='expense'&&expenseCategories.includes(currentCategory)?currentCategory:'');
    if(!$('#tx-title').value.trim())$('#tx-title').placeholder=kind==='income'?'เช่น เงินเดือน':'เช่น อาหารกลางวัน';
  }
  function handleTransactionSubmit(event) {
    event.preventDefault();const amount=Number($('#tx-amount').value);if(!Number.isFinite(amount)||amount<=0){$('#tx-amount').focus();toast('กรุณาใส่จำนวนเงินที่มากกว่า 0','error');return;}
    const kind=$('#tx-kind').value,title=$('#tx-title').value.trim()||(kind==='income'?'รายรับ':'รายจ่าย'),category=$('#tx-category').value||'อื่นๆ';const tx={id:$('#tx-id').value||uid(),kind,title,category,amount,date:$('#tx-date').value||todayISO(),note:$('#tx-note').value.trim()};
    const index=state.transactions.findIndex(t=>t.id===tx.id);if(index>=0)state.transactions[index]=tx;else state.transactions.push(tx);state.isDemo=false;save();closeDialog($('#transaction-dialog'));renderAll();toast(index>=0?'แก้ไขธุรกรรมแล้ว':'บันทึกธุรกรรมแล้ว');
  }
  function handleSubscriptionSubmit(event) {
    event.preventDefault();const name=$('#sub-name').value.trim(),amount=Number($('#sub-amount').value);if(!name||!Number.isFinite(amount)||amount<=0){toast('ตรวจสอบชื่อบริการและจำนวนเงินอีกครั้ง','error');return;}
    const id=$('#sub-id').value||uid(),old=state.subscriptions.find(s=>s.id===id);const item={id,name,amount,category:$('#sub-category').value,cycle:$('#sub-cycle').value,dueDate:$('#sub-due').value,usage:$('#sub-usage').value,note:$('#sub-note').value.trim(),active:old?.active!==false};const index=state.subscriptions.findIndex(s=>s.id===id);if(index>=0)state.subscriptions[index]=item;else state.subscriptions.push(item);state.isDemo=false;save();closeDialog($('#subscription-dialog'));renderAll();toast(index>=0?'แก้ไขบริการแล้ว':'เพิ่มรายจ่ายประจำแล้ว');
  }
  function handleGoalSubmit(event) {
    event.preventDefault();const name=$('#goal-name').value.trim(),target=Number($('#goal-target').value),current=Number($('#goal-current').value);if(!name||target<=0||current<0){toast('ตรวจสอบชื่อและจำนวนเงินของเป้าหมาย','error');return;}
    const id=$('#goal-id').value||uid(),goal={id,name,target,current,targetDate:$('#goal-date').value||''},index=state.goals.findIndex(g=>g.id===id);if(index>=0)state.goals[index]=goal;else state.goals.push(goal);state.isDemo=false;save();closeDialog($('#goal-dialog'));renderAll();toast(index>=0?'แก้ไขเป้าหมายแล้ว':'เพิ่มเป้าหมายการออมแล้ว');
  }
  function toast(message,type='success') {
    const region=$('#toast-region');
    // Keep the surface calm: a successful action replaces a lingering reminder instead of stacking over it.
    if(type==='success')region.querySelectorAll('.toast.info,.toast.warning').forEach(item=>item.remove());
    if(type==='info')region.querySelectorAll('.toast.info').forEach(item=>item.remove());
    while(region.children.length>=3)region.firstElementChild?.remove();
    const allowed=['error','info','warning'];const style=allowed.includes(type)?type:'';const glyph=type==='error'?'info':type==='warning'?'calendar-clock':type==='info'?'sparkles':'check';const el=document.createElement('div');el.className=`toast ${style}`;el.setAttribute('role',type==='error'?'alert':'status');el.innerHTML=`${icon(glyph)}<span>${escapeHTML(message)}</span>`;region.appendChild(el);setTimeout(()=>{el.classList.add('toast-exit');setTimeout(()=>el.remove(),230);},type==='info'?4700:3200);
  }
  function exportData() {
    const backup={app:'LifeRadar',version:2,exportedAt:new Date().toISOString(),...state};const blob=new Blob([JSON.stringify(backup,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`liferadar-backup-${todayISO()}.json`;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);toast('ดาวน์โหลดไฟล์สำรองแล้ว');
  }
  function importData(file) {
    const reader=new FileReader();reader.onload=()=>{try{const data=JSON.parse(String(reader.result));if(!Array.isArray(data.transactions)||!Array.isArray(data.subscriptions))throw new Error('invalid');if(!confirm('นำเข้าข้อมูลและแทนที่ข้อมูลที่อยู่ในเบราว์เซอร์นี้หรือไม่? แนะนำให้ดาวน์โหลดไฟล์ปัจจุบันสำรองก่อน'))return;state={version:2,isDemo:false,budget:(data.budget!==undefined&&Number.isFinite(Number(data.budget)))?Math.max(0,Number(data.budget)):15000,categoryBudgets:{...defaultCategoryBudgets,...(data.categoryBudgets||{})},transactions:data.transactions,subscriptions:data.subscriptions,goals:Array.isArray(data.goals)?data.goals:[],checkins:Array.isArray(data.checkins)?data.checkins:[],streak:Number(data.streak)||0,lastCheckin:data.lastCheckin||null};state.transactions=state.transactions.map(t=>({...t,id:t.id||uid()}));state.subscriptions=state.subscriptions.map(s=>({...s,id:s.id||uid()}));state.goals=state.goals.map(g=>({...g,id:g.id||uid()}));save();normalizeDueDates();renderAll();$('#import-message').textContent='นำเข้าข้อมูลสำเร็จ';toast('นำเข้าข้อมูลสำเร็จ');}catch{ $('#import-message').textContent='ไฟล์นี้ไม่ใช่ไฟล์สำรอง LifeRadar ที่ถูกต้อง';toast('ไม่สามารถนำเข้าไฟล์นี้ได้','error');}};reader.readAsText(file);
  }
  function renderDailyBrief() {
    const totals=totalsFor(),budget=Number(state.budget)||0,remaining=budget-totals.expense,upcoming=comingSubs(7),review=reviewSubs();
    const rows=[
      {icon:'wallet',title:'กระแสเงินสดเดือนนี้',body:`รายรับ ${currency(totals.income)} · รายจ่าย ${currency(totals.expense)}`,value:currency(totals.income-totals.expense)},
      {icon:'chart',title:'งบประมาณ',body:budget?(remaining>=0?`ยังเหลืองบประมาณ ${currency(remaining)}`:`รายจ่ายเกินงบ ${currency(Math.abs(remaining))}`):'ยังไม่ได้กำหนดงบประมาณรายเดือน',value:budget?`${Math.round(totals.expense/budget*100)}%`:'—'},
      {icon:'calendar-clock',title:'เรียกเก็บใน 7 วัน',body:upcoming.length?upcoming.map(s=>s.name).slice(0,3).join(' · '):'ไม่มีบริการเรียกเก็บใน 7 วันข้างหน้า',value:currency(upcoming.reduce((sum,s)=>sum+s.amount,0))},
      {icon:'repeat',title:'บริการที่ควรทบทวน',body:review.length?`${review.length} บริการที่ระบุว่าใช้น้อยหรือไม่ได้ใช้`:'ยังไม่มีบริการที่ควรทบทวน',value:`${currency(reviewMonthlyCost()*12)}/ปี`}
    ];
    $('#daily-brief-content').innerHTML=rows.map(r=>`<div class="brief-item"><span class="brief-item-icon">${icon(r.icon)}</span><div><strong>${escapeHTML(r.title)}</strong><p>${escapeHTML(r.body)}</p></div><span>${escapeHTML(r.value)}</span></div>`).join('');applyIconsToNewContent($('#daily-brief-content'));
    $('#daily-dialog').showModal();
  }
  function bindEvents() {
    $$('[data-view]').forEach(b=>b.addEventListener('click',()=>switchView(b.dataset.view)));
    $$('[data-goto]').forEach(b=>b.addEventListener('click',()=>switchView(b.dataset.goto)));
    $('#top-add').addEventListener('click',()=>openTransaction());$('#overview-add').addEventListener('click',()=>openTransaction());
    $('#quick-entry-form').addEventListener('submit',handleQuickEntrySubmit);
    $$('[data-quick-kind]').forEach(btn=>btn.addEventListener('click',()=>setQuickKind(btn.dataset.quickKind)));
    $('#quick-category-chips').addEventListener('click',event=>{const btn=event.target.closest('[data-quick-category]');if(!btn)return;$('#quick-category').value=btn.dataset.quickCategory;$$('[data-quick-category]').forEach(chip=>{const active=chip.dataset.quickCategory===btn.dataset.quickCategory;chip.classList.toggle('selected',active);chip.setAttribute('aria-pressed',active?'true':'false');});});
    $('#quick-category').addEventListener('change',()=>{$$('[data-quick-category]').forEach(chip=>{const active=chip.dataset.quickCategory===$('#quick-category').value;chip.classList.toggle('selected',active);chip.setAttribute('aria-pressed',active?'true':'false');});});
    $('.quick-presets').addEventListener('click',event=>{const btn=event.target.closest('[data-quick-add]');if(!btn)return;const input=$('#quick-amount'),current=Number(input.value)||0;input.value=String(Math.round((current+Number(btn.dataset.quickAdd))*100)/100);input.focus({preventScroll:true});input.dispatchEvent(new Event('input',{bubbles:true}));});
    document.addEventListener('click',event=>{const tx=event.target.closest('[data-open-transaction]'),sub=event.target.closest('[data-open-subscription]'),goal=event.target.closest('[data-open-goal]');if(tx){event.preventDefault();openTransaction();}else if(sub){event.preventDefault();openSubscription();}else if(goal){event.preventDefault();openGoal();}});
    $('#add-goal').addEventListener('click',()=>openGoal());$('#add-goal-inline').addEventListener('click',()=>openGoal());
    $('#daily-brief').addEventListener('click',renderDailyBrief);$('#brief-to-budget').addEventListener('click',()=>{closeDialog($('#daily-dialog'));switchView('budgets');});
    $('#start-real-data').addEventListener('click',()=>{if(!confirm('เริ่มใช้ LifeRadar ด้วยข้อมูลจริงหรือไม่? ธุรกรรม บริการ และเป้าหมายตัวอย่างจะถูกลบ'))return;state=emptyState();save();renderAll();toast('พร้อมเริ่มต้นด้วยข้อมูลของคุณแล้ว');});
    $('#mobile-menu').addEventListener('click',()=>{const open=!$('#sidebar').classList.contains('mobile-open');$('#sidebar').classList.toggle('mobile-open',open);document.body.classList.toggle('nav-open',open);});
    $('#transaction-search').addEventListener('input',renderTransactions);$('#transaction-filter').addEventListener('change',renderTransactions);$('#transaction-period').addEventListener('change',renderTransactions);
    $('#clear-transaction-filters').addEventListener('click',()=>{$('#transaction-search').value='';$('#transaction-filter').value='all';$('#transaction-period').value='month';renderTransactions();});
    $('#transaction-list').addEventListener('click',event=>{const edit=event.target.closest('[data-edit-tx]'),del=event.target.closest('[data-delete-tx]');if(edit){const tx=state.transactions.find(t=>t.id===edit.dataset.editTx);if(tx)openTransaction(tx.id,tx.kind);}if(del){const tx=state.transactions.find(t=>t.id===del.dataset.deleteTx);if(tx&&confirm(`ลบรายการ “${tx.title}” ใช่ไหม?`)){state.transactions=state.transactions.filter(t=>t.id!==tx.id);save();renderAll();toast('ลบธุรกรรมแล้ว');}}});
    $('#recent-list').addEventListener('click',event=>{const edit=event.target.closest('[data-edit-tx]'),del=event.target.closest('[data-delete-tx]');if(edit){const tx=state.transactions.find(t=>t.id===edit.dataset.editTx);if(tx)openTransaction(tx.id,tx.kind);}if(del){const tx=state.transactions.find(t=>t.id===del.dataset.deleteTx);if(tx&&confirm(`ลบรายการ “${tx.title}” ใช่ไหม?`)){state.transactions=state.transactions.filter(t=>t.id!==tx.id);save();renderAll();toast('ลบธุรกรรมแล้ว');}}});
    $$('[data-sub-filter]').forEach(b=>b.addEventListener('click',()=>{subFilter=b.dataset.subFilter;$$('[data-sub-filter]').forEach(btn=>btn.classList.toggle('active',btn===b));renderSubscriptions();}));
    $('#subscription-list').addEventListener('click',event=>{const edit=event.target.closest('[data-edit-sub]'),del=event.target.closest('[data-delete-sub]'),toggle=event.target.closest('[data-toggle-sub]');if(edit)openSubscription(edit.dataset.editSub);if(del){const sub=state.subscriptions.find(s=>s.id===del.dataset.deleteSub);if(sub&&confirm(`ลบบริการ “${sub.name}” ใช่ไหม?`)){state.subscriptions=state.subscriptions.filter(s=>s.id!==sub.id);save();renderAll();toast('ลบบริการแล้ว');}}if(toggle){const sub=state.subscriptions.find(s=>s.id===toggle.dataset.toggleSub);if(sub){sub.active=sub.active===false;save();renderAll();toast(sub.active?'กลับมาติดตามบริการแล้ว':'พักการติดตามบริการแล้ว');}}});
    $('#goal-list').addEventListener('click',event=>{const edit=event.target.closest('[data-edit-goal]'),del=event.target.closest('[data-delete-goal]'),contribute=event.target.closest('[data-contribute-goal]');if(edit)openGoal(edit.dataset.editGoal);if(del){const goal=state.goals.find(g=>g.id===del.dataset.deleteGoal);if(goal&&confirm(`ลบเป้าหมาย “${goal.name}” ใช่ไหม?`)){state.goals=state.goals.filter(g=>g.id!==goal.id);save();renderAll();toast('ลบเป้าหมายแล้ว');}}if(contribute){const goal=state.goals.find(g=>g.id===contribute.dataset.contributeGoal);if(!goal)return;const raw=prompt(`เพิ่มเงินออมให้ “${goal.name}” กี่บาท?`,'500');if(raw===null)return;const amount=Number(raw);if(!Number.isFinite(amount)||amount<=0){toast('กรุณาใส่จำนวนเงินที่ถูกต้อง','error');return;}goal.current+=amount;save();renderAll();toast(`เพิ่มเงินออม ${currency(amount)} แล้ว`);}});
    $('#transaction-form').addEventListener('submit',handleTransactionSubmit);$('#subscription-form').addEventListener('submit',handleSubscriptionSubmit);$('#goal-form').addEventListener('submit',handleGoalSubmit);
    $$('[data-tx-kind]').forEach(b=>b.addEventListener('click',()=>setTransactionKind(b.dataset.txKind)));
    $$('[data-close-dialog]').forEach(b=>b.addEventListener('click',()=>closeDialog(b.closest('dialog'))));
    $$('.app-dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target===dialog)closeDialog(dialog);}));
    $('#monthly-budget-form').addEventListener('submit',event=>{event.preventDefault();state.budget=Math.max(0,Number($('#monthly-budget-input').value)||0);state.isDemo=false;save();renderAll();$('#budget-save-message').textContent='บันทึกงบประมาณแล้ว';toast('อัปเดตงบประมาณแล้ว');});
    $('#save-category-budgets').addEventListener('click',()=>{$$('[data-category-budget]').forEach(input=>{state.categoryBudgets[input.dataset.categoryBudget]=Math.max(0,Number(input.value)||0);});save();renderAll();$('#category-budget-message').textContent='บันทึกงบประมาณแยกหมวดแล้ว';toast('อัปเดตงบตามหมวดแล้ว');});
    $('#export-data').addEventListener('click',exportData);$('#export-quick').addEventListener('click',exportData);
    $('#import-file').addEventListener('change',event=>{const file=event.target.files?.[0];if(file)importData(file);event.target.value='';});
    $('#clear-all-data').addEventListener('click',()=>{if(!confirm('ลบข้อมูลทั้งหมดจาก LifeRadar ในเบราว์เซอร์นี้หรือไม่? การกระทำนี้ย้อนกลับไม่ได้ กรุณาสำรองไฟล์ก่อน'))return;state=emptyState();save();renderAll();toast('ล้างข้อมูลเรียบร้อยแล้ว');});
    $('#save-category-budgets').setAttribute('type','button');
    window.addEventListener('hashchange',()=>{const name=location.hash.replace('#','');if(name)switchView(name,false);});
    window.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)||event.altKey)return;const target=event.target;if(target&&['INPUT','TEXTAREA','SELECT'].includes(target.tagName))return;if(event.key.toLowerCase()==='n'){event.preventDefault();if($('#view-overview').classList.contains('active'))$('#quick-amount').focus({preventScroll:true});else openTransaction();}if(event.key==='/'){if($('#view-expenses').classList.contains('active')){event.preventDefault();$('#transaction-search').focus();}}if(event.key==='Escape'){$('#sidebar').classList.remove('mobile-open');document.body.classList.remove('nav-open');}});
  }
  function init() {
    normalizeDueDates();save();applyIcons();renderQuickCategories('expense','');bindEvents();renderAll();const hash=location.hash.replace('#','');if(hash)switchView(hash,false);showArrivalNotice();
    if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
  }
  init();
})();
