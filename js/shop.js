
const $=s=>document.querySelector(s);
const API=(window.CODM_API||"").replace(/\/$/,"");
let UT='',UI=null,pending=null;try{UT=localStorage.getItem('ut')||'';UI=JSON.parse(localStorage.getItem('ui')||'null')}catch(e){}
const saveU=()=>{try{localStorage.setItem('ut',UT);localStorage.setItem('ui',JSON.stringify(UI))}catch(e){}};
const UH=()=>UT?{Authorization:'Bearer '+UT}:{};
const updNav=()=>{$('#lgn').textContent=UI?'👤 '+UI.username:'ورود'};
const esc=t=>String(t==null?'':t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s==null?'':s).replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).trim().toLowerCase();
const num=p=>{const n=parseFloat(norm(p.legendary).replace(/[^\d.]/g,''));return isNaN(n)?1e12:n};
const byLegendary=(a,b)=>num(a)-num(b)||norm(a.legendary).localeCompare(norm(b.legendary));
const TYPES={telegram:['تلگرام','#27a7e7','✈'],whatsapp:['واتساپ','#25d366','✆'],eitaa:['ایتا','#f57c00','ا'],rubika:['روبیکا','#b620e0','R'],bale:['بله','#1db954','ب'],instagram:['اینستاگرام','#e1306c','◎'],discord:['دیسکورد','#5865f2','D'],other:['لینک','#6d4bc4','↗']};
const safe=u=>/^(https?:\/\/|tg:\/\/)/i.test(u)?u:'#';
let products=[],site={about:'',contacts:[],phone:''},tab='home',q='',timer=null,loaded=false;

let retryT=null;
async function load(){
  clearTimeout(retryT);
  try{
    const [pr,sr]=await Promise.all([fetch(API+'/api/products'),fetch(API+'/api/site')]);
    if(!pr.ok||!sr.ok)throw new Error('http');
    products=await pr.json();site=await sr.json();loaded=true;
  }catch(e){loaded=false;retryT=setTimeout(load,5000)}
  updNav();show(tab);
}
function go(t){tab=t;clearInterval(timer);show(t)}
document.querySelectorAll('#nav button').forEach(b=>b.onclick=()=>go(b.dataset.t));
function card(p){return `<div class="card"><div class="im"${p.image?` style="background-image:url('${esc(API+p.image)}')"`:''}></div>
  <div class="bd"><div class="ln"><span>لجندری:</span> ${esc(p.legendary)}</div><div class="ln"><span>قیمت:</span> ${esc(p.price)}</div><div class="ln d"><span>توضیحات:</span> ${esc(p.desc)}</div></div>
  <button data-i="${p.id}">تماس با ادمین و چت</button></div>`}
function bind(){document.querySelectorAll('button[data-i]').forEach(b=>b.onclick=()=>chat(products.find(p=>p.id==b.dataset.i)))}
function show(t){
  document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.t===t));
  const a=$('#app');
  if(!loaded){a.innerHTML='<div class="box mu">در حال اتصال به سرور... (اگر سرور خوابیده باشد تا یک دقیقه طول می‌کشد؛ هر ۵ ثانیه خودکار دوباره تلاش می‌شود.) اگر این پیام می‌ماند، آدرس سرور در config.js تنظیم نشده یا سرور روشن نیست.<div style="margin-top:10px"><button id="rt">تلاش دوباره</button></div></div>';$('#rt').onclick=load;return}
  if(t==='home'){
    const nw=products.slice(0,6);
    a.innerHTML=`<div class="hero"><h2>به CALL OF MARKET خوش آمدید</h2><div class="mu">بهترین اکانت‌های کالاف دیوتی موبایل با تضمین و پشتیبانی</div></div>
    <h2 class="t">✨ تازه‌ترین اکانت‌ها</h2>`+(nw.length?`<div class="grid">${nw.map(card).join('')}</div><div style="text-align:center;margin-top:18px"><button id="all">مشاهده همه‌ی اکانت‌ها</button></div>`:'<div class="box mu">هنوز اکانتی ثبت نشده است. به‌زودی!</div>');
    bind();const al=$('#all');if(al)al.onclick=()=>go('accounts');
  }else if(t==='accounts'){
    a.innerHTML=`<h2 class="t">اکانت‌ها</h2><input id="q" placeholder="🔍 جستجوی لجندری (مثلاً ۱ یا ۱۰)" value="${esc(q)}"><div id="res" style="margin-top:12px"></div>`;
    const draw=()=>{const k=norm(q);let l=products.slice().sort(byLegendary);if(k)l=l.filter(p=>norm(p.legendary).includes(k));
      $('#res').innerHTML=l.length?`<div class="grid">${l.map(card).join('')}</div>`:'<div class="box mu">اکانتی با این لجندری پیدا نشد.</div>';bind()};
    $('#q').oninput=e=>{q=e.target.value;draw()};draw();
  }else if(t==='login'){loginView();
  }else if(t==='about'){
    a.innerHTML=`<h2 class="t">درباره ما</h2><div class="box" style="white-space:pre-wrap;line-height:2">${esc(site.about)||'<span class="mu">به‌زودی...</span>'}</div>`;
  }else if(t==='contact'){
    const c=site.contacts||[];
    a.innerHTML=`<h2 class="t">تماس با ما</h2>`+(c.length?c.map(x=>{const T=TYPES[x.type]||TYPES.other;return `<a class="ct" href="${esc(safe(x.link))}" target="_blank" rel="noopener noreferrer"><span class="ic" style="background:${T[1]}">${T[2]}</span><span><b>${esc(x.label||T[0])}</b><div class="mu">ورود به ${esc(T[0])}</div></span></a>`}).join(''):'<div class="box mu">به‌زودی...</div>');
  }
}
function loginView(mode,after){
  mode=mode||'login';const a=$('#app');
  if(UT&&UI){a.innerHTML=`<h2 class="t">حساب کاربری</h2><div class="box"><div class="ln"><span>نام کاربری:</span> ${esc(UI.username)}</div><div class="ln"><span>ایمیل:</span> ${esc(UI.email)}</div>
    <p class="mu">گفتگوهای شما با ادمین فقط برای خودتان نمایش داده می‌شود. برای شروع گفتگو، روی «تماس با ادمین و چت» زیر هر اکانت بزنید.</p><button id="lo">خروج از حساب</button></div>`;
    $('#lo').onclick=()=>{UT='';UI=null;saveU();updNav();go('home')};return}
  a.innerHTML=`<h2 class="t">ورود</h2><div class="box" style="max-width:420px;margin:auto"><div class="row" style="margin-bottom:10px"><button class="${mode==='login'?'':'g'}" id="m1" style="flex:1">ورود</button><button class="${mode==='reg'?'':'g'}" id="m2" style="flex:1">ثبت‌نام</button></div>
  <input id="un" placeholder="نام کاربری" autocomplete="username">${mode==='reg'?'<input id="em" type="email" placeholder="ایمیل" autocomplete="email">':''}
  <input id="pw" type="password" placeholder="رمز عبور" autocomplete="${mode==='reg'?'new-password':'current-password'}">
  <button id="sb" style="width:100%;margin-top:8px">${mode==='reg'?'ساخت حساب':'ورود'}</button><div id="er" class="mu" style="margin-top:8px;color:#ff8aa5"></div></div>`;
  $('#m1').onclick=()=>loginView('login',after);$('#m2').onclick=()=>loginView('reg',after);
  const sub=async()=>{const body={username:$('#un').value,password:$('#pw').value};if(mode==='reg')body.email=$('#em').value;
    try{const r=await fetch(API+(mode==='reg'?'/api/register':'/api/login'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
      const d=await r.json();if(!r.ok){$('#er').textContent=d.error||(r.status===429?'تلاش‌های زیاد؛ کمی بعد دوباره امتحان کنید':'خطا');return}
      UT=d.token;UI=d.user;saveU();updNav();after?after():go('home')}catch(e){$('#er').textContent='اتصال به سرور برقرار نشد'}};
  $('#sb').onclick=sub;$('#pw').onkeydown=e=>{if(e.key==='Enter')sub()};
}
function chat(p){
  clearInterval(timer);
  const ph=site.phone?`<div class="box" style="border-color:var(--p)"><span class="ln"><span>📞 شماره ادمین:</span></span> <a href="tel:${esc(site.phone.replace(/[^\d+]/g,''))}" style="color:var(--p2);font-weight:700;direction:ltr;display:inline-block">${esc(site.phone)}</a></div>`:'';
  const info=`<div class="bar"><button class="g" id="back">→ بازگشت</button><h2 class="t" style="margin:0">لجندری ${esc(p.legendary)}</h2></div>
  <div class="box">${p.image?`<img src="${esc(API+p.image)}" style="max-width:100%;border-radius:10px;border:1px solid var(--line)">`:''}
  <div class="ln" style="margin-top:10px"><span>لجندری:</span> ${esc(p.legendary)}</div><div class="ln"><span>قیمت:</span> ${esc(p.price)}</div><div class="ln" style="white-space:pre-wrap"><span>توضیحات:</span> ${esc(p.desc)}</div></div>${ph}`;
  const a=$('#app');
  if(!UT){a.innerHTML=info+`<div class="box"><b>برای گفتگو با ادمین ابتدا وارد حساب خود شوید.</b><div style="margin-top:10px"><button id="gl">ورود / ثبت‌نام</button></div></div>`;
    $('#back').onclick=()=>go(tab);$('#gl').onclick=()=>{pending=p;loginView('login',()=>chat(pending))};return}
  a.innerHTML=info+`<div class="box"><b>💬 گفتگوی خصوصی با ادمین</b> <span class="mu">(${esc(UI?UI.username:'')})</span><div class="msgs" id="ms"></div>
  <div class="row" style="margin-top:8px"><input id="tx" placeholder="پیام خود را بنویسید..."><button id="sd">ارسال</button></div></div>`;
  $('#back').onclick=()=>go(tab);
  const refresh=async()=>{try{const r=await fetch(API+'/api/chat',{headers:UH()});if(r.status===401){UT='';UI=null;saveU();updNav();return chat(p)}
    const m=await r.json();const box=$('#ms');if(!box)return;const stick=box.scrollTop+box.clientHeight>=box.scrollHeight-40;
    box.innerHTML=m.map(x=>`<div class="m ${x.from==='user'?'me':'ot'}">${x.from==='user'&&x.product?'<small class="mu">'+esc(x.product)+'</small><br>':''}${esc(x.text)}</div>`).join('')||'<span class="mu">سلام! پیام خود را برای ادمین بنویسید.</span>';
    if(stick)box.scrollTop=1e9}catch(e){}};
  const send=async()=>{const t=$('#tx').value.trim();if(!t)return;$('#tx').value='';
    try{const r=await fetch(API+'/api/chat',{method:'POST',headers:Object.assign({'Content-Type':'application/json'},UH()),body:JSON.stringify({text:t,product_id:p.id})});
      if(r.status===401){UT='';UI=null;saveU();updNav();return chat(p)}
      if(!r.ok){$('#tx').value=t;alert(r.status===429?'پیام‌های زیاد؛ کمی بعد دوباره امتحان کنید':'ارسال پیام انجام نشد');return}
    }catch(e){$('#tx').value=t;alert('اتصال به سرور برقرار نشد');return}
    refresh()};
  $('#sd').onclick=send;$('#tx').onkeydown=e=>{if(e.key==='Enter')send()};
  refresh();timer=setInterval(refresh,3000);
}
load();
