// ── COLOURS ──
const G='#8B6914',GR='#3A7A4E',MU='#8B7355',TX='#1C1712',RD='#8B3A1C';
Chart.defaults.color=MU;
Chart.defaults.font.family="'Outfit',sans-serif";
Chart.defaults.font.size=10;
const tip={backgroundColor:'#EAE3D8',titleColor:TX,bodyColor:MU,borderColor:'rgba(139,105,20,0.25)',borderWidth:1};
const MO=['Oct','Nov','Dec','Jan','Feb','Mar'];

// ── AUTH ──
function auth(){
  try {
    const val=document.getElementById('pw').value.trim();
    if(val==='orbit2026'){
      document.getElementById('gate').style.display='none';
      document.getElementById('portal').style.display='block';
      setTimeout(initCharts,150);
    } else {
      document.getElementById('pw-err').style.display='block';
      document.getElementById('pw').value='';
      document.getElementById('pw').focus();
    }
  } catch(e){ console.error('Auth error:',e); }
}
document.getElementById('pw').addEventListener('keydown',e=>{if(e.key==='Enter')auth();});

// ── NAV ──
function showSec(id,el){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('sec-'+id).classList.add('active');
  el.classList.add('active');
  if(id==='playbook') setTimeout(initPlaybookFunnel,120);
}

// ── PLAYBOOK INTERACTIVE ──
let pbFunnelDone=false;
function pbStage(n){
  document.querySelectorAll('.pb-stage-item').forEach(s=>s.classList.remove('pb-selected'));
  document.querySelectorAll('.pb-sd').forEach(s=>s.classList.remove('pb-sd-active'));
  const items=document.querySelectorAll('.pb-stage-item');
  if(items[n-1]) items[n-1].classList.add('pb-selected');
  const det=document.getElementById('pb-sd-'+n);
  if(det) det.classList.add('pb-sd-active');
}
function initPlaybookFunnel(){
  if(pbFunnelDone) return;
  pbFunnelDone=true;
  document.querySelectorAll('.pb-fr-fill').forEach(f=>{
    f.style.setProperty('--pb-scale', f.dataset.scale||'1');
    requestAnimationFrame(()=>{ f.classList.add('pb-animated'); });
  });
}
function pbaToggle(header){
  const body=header.nextElementSibling;
  const isOpen=header.classList.contains('open');
  header.classList.toggle('open',!isOpen);
  body.classList.toggle('open',!isOpen);
}
function showCo(id,el){
  ['apex','cw'].forEach(c=>document.getElementById('co-'+c).style.display='none');
  document.querySelectorAll('.co-tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('co-'+id).style.display='block';
  el.classList.add('active');
}
function showNx(id,el){
  document.querySelectorAll('.nx-sec').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nx-tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('nx-'+id).classList.add('active');
  el.classList.add('active');
}
function toggleDetail(did,hid){
  const d=document.getElementById(did),h=document.getElementById(hid);
  const o=d.classList.toggle('open');
  h.textContent=o?'Collapse ↑':'Expand ↓';
}

// ── TREND CHARTS ──
const rendered={}, chartInst={};
function toggleTrend(card,tid){
  const t=document.getElementById(tid);
  const o=t.classList.toggle('open');
  card.classList.toggle('exp',o);
  if(o&&!rendered[tid]){rendered[tid]=true;renderTrend(tid);}
}
const trendCfg={
  'tr-bdr': {c:'ch-bdr', t:'bar',  d:[38,52,61,74,88,107], col:G},
  'tr-calls':{c:'ch-calls',t:'line',d:[18,20,22,24,25,28],  col:GR},
  'tr-churn':{c:'ch-churn',t:'bar', d:[12,18,24,31,38,42],  col:G},
  'tr-crm':  {c:'ch-crm', t:'line',d:[74,78,82,87,91,94],   col:GR},
  'tr-t1':   {c:'ch-t1',  t:'line',d:[38,44,49,53,57,61],   col:GR},
  'tr-health':{c:'ch-health',t:'line',d:[62,65,68,71,73,76],col:G},
  'tr-onboard':{c:'ch-onboard',t:'bar',d:[18,14,11,8,6,4],  col:RD},
  'tr-retain':{c:'ch-retain',t:'line',d:[22,28,31,36,40,43],col:GR},
  'tr-ar':   {c:'ch-ar',  t:'bar', d:[32,28,24,20,16,12],   col:RD},
  'tr-tpv':  {c:'ch-tpv', t:'bar', d:[880,920,980,1010,1060,1090],col:G},
  'tr-close':{c:'ch-close',t:'bar',d:[11,9,7,5,4,3],        col:RD},
  'tr-fraud':{c:'ch-fraud',t:'line',d:[0.12,0.09,0.07,0.06,0.05,0.04],col:GR},
  'tr-clm':  {c:'ch-clm', t:'line',d:[78,82,86,89,92,94],   col:GR},
  'tr-disp': {c:'ch-disp',t:'bar', d:[5.2,5.6,5.9,6.2,6.5,6.8],col:G},
  'tr-sop':  {c:'ch-sop', t:'line',d:[32,58,82,104,122,141],col:G},
  'tr-kpi':  {c:'ch-kpi', t:'line',d:[4,8,12,16,20,24],     col:GR},
  'tr-src':  {c:'ch-src', t:'bar', d:[98,122,144,162,181,204],col:G},
  'tr-dd':   {c:'ch-dd',  t:'bar', d:[42,36,30,26,22,17],   col:RD},
  'tr-bench':{c:'ch-bench',t:'line',d:[8,10,12,14,17,20],   col:GR},
};
function renderTrend(tid){
  const cfg=trendCfg[tid]; if(!cfg)return;
  const el=document.getElementById(cfg.c); if(!el)return;
  if(chartInst[tid]){chartInst[tid].destroy();}
  const isBar=cfg.t==='bar';
  chartInst[tid]=new Chart(el,{
    type:isBar?'bar':'line',
    data:{labels:MO,datasets:[{data:cfg.d,
      ...(isBar?{backgroundColor:cfg.col+'33',borderColor:cfg.col,borderWidth:2,borderRadius:2}
               :{borderColor:cfg.col,backgroundColor:cfg.col+'18',borderWidth:2,pointBackgroundColor:cfg.col,pointRadius:3,fill:true,tension:0.4})
    }]},
    options:{responsive:true,maintainAspectRatio:false,animation:false,
      plugins:{legend:{display:false},tooltip:tip},
      scales:{x:{grid:{color:'rgba(139,105,20,0.08)'},ticks:{color:MU,maxRotation:0,font:{size:10}}},
              y:{grid:{color:'rgba(139,105,20,0.08)'},ticks:{color:MU,font:{size:10}},beginAtZero:false}}}
  });
}

// ── MAIN CHARTS ──
function initCharts(){
  try{
    new Chart(document.getElementById('c-rev'),{
      type:'bar',
      data:{labels:MO,datasets:[
        {label:'Recurring',data:[892,918,944,971,1010,1030],backgroundColor:G+'33',borderColor:G,borderWidth:2,borderRadius:2},
        {label:'Non-Recurring',data:[84,76,91,68,72,88],backgroundColor:GR+'33',borderColor:GR,borderWidth:2,borderRadius:2},
        {label:'Total',data:[976,994,1035,1039,1082,1118],type:'line',borderColor:TX,backgroundColor:'transparent',borderWidth:2,pointBackgroundColor:TX,pointRadius:3,tension:0.4}
      ]},
      options:{responsive:true,maintainAspectRatio:false,
        plugins:{legend:{display:true,labels:{color:MU,boxWidth:10,font:{size:10}}},tooltip:tip},
        scales:{x:{stacked:true,grid:{color:'rgba(139,105,20,0.08)'},ticks:{color:MU,font:{size:10}}},
                y:{stacked:true,grid:{color:'rgba(139,105,20,0.08)'},ticks:{color:MU,font:{size:10},callback:v=>'$'+v+'K'}}}}
    });
    new Chart(document.getElementById('c-ebitda'),{
      type:'bar',
      data:{labels:MO,datasets:[
        {label:'EBITDA ($K)',data:[245,258,288,323,346,380],backgroundColor:GR+'33',borderColor:GR,borderWidth:2,borderRadius:2,yAxisID:'y'},
        {label:'Margin (%)',data:[25,26,28,31,32,34],type:'line',borderColor:G,backgroundColor:'transparent',borderWidth:2,pointBackgroundColor:G,pointRadius:4,tension:0.4,yAxisID:'y2'}
      ]},
      options:{responsive:true,maintainAspectRatio:false,
        plugins:{legend:{display:true,labels:{color:MU,boxWidth:10,font:{size:10}}},tooltip:tip},
        scales:{x:{grid:{color:'rgba(139,105,20,0.08)'},ticks:{color:MU,font:{size:10}}},
                y:{grid:{color:'rgba(139,105,20,0.08)'},ticks:{color:MU,font:{size:10},callback:v=>'$'+v+'K'},position:'left'},
                y2:{grid:{display:false},ticks:{color:G,font:{size:10},callback:v=>v+'%'},position:'right'}}}
    });
  }catch(e){console.warn('Chart init:',e);}
}

// ── ORDER FORM ──
const prices={apex:48.40,cw:31.20,gp:112.60};
let orderMode='sell';
function setOrderType(type){
  orderMode=type;
  document.getElementById('tab-sell').className='ot-tab sell'+(type==='sell'?' active-sell':'');
  document.getElementById('tab-buy').className='ot-tab buy'+(type==='buy'?' active-buy':'');
  const btn=document.getElementById('ord-btn');
  btn.className='order-btn '+(type==='sell'?'sell':'buy');
  btn.textContent='Submit '+(type==='sell'?'Sell':'Buy')+' Order';
  updateOrderSummary();
}
function updateOrderSummary(){
  const co=document.getElementById('ord-co').value;
  const price=prices[co]||48.40;
  const qty=parseInt(document.getElementById('ord-qty').value)||0;
  const gross=price*qty, fee=gross*0.01, net=gross-fee;
  const fmt=n=>'$'+Math.round(n).toLocaleString('en-US');
  document.getElementById('s-qty').textContent=qty.toLocaleString();
  document.getElementById('s-price').textContent='$'+price.toFixed(2);
  document.getElementById('s-gross').textContent=fmt(gross);
  document.getElementById('s-fee').textContent=fmt(fee);
  document.getElementById('s-net').textContent=fmt(net);
}
function submitOrder(){
  document.getElementById('ord-confirm').style.display='block';
  document.getElementById('ord-btn').style.display='none';
  setTimeout(()=>{
    document.getElementById('ord-confirm').style.display='none';
    document.getElementById('ord-btn').style.display='block';
  },6000);
}