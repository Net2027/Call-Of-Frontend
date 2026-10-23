
const $=s=>document.querySelector(s);
const esc=t=>String(t==null?'':t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const TYPES={telegram:'تلگرام',whatsapp:'واتساپ',eitaa:'ایتا',rubika:'روبیکا',bale:'بله',instagram:'اینستاگرام',discord:'دیسکورد',other:'سایر'};
let API='',TOKEN='',cur=null,tm=null,editId=null,contacts=[],tl=[];
try{API=localStorage.getItem('api')||'';TOKEN=localStorage.getItem('tok')||''}catch(e){}
if(!API&&window.CODM_API)API=window.CODM_API.replace(/\/$/,'');
if(!API&&location.protocol==='file:')API='http://localhost:5000';
const H=j=>{const h={};if(TOKEN)h.Authorization='Bearer '+TOKEN;if(j)h['Content-Type']='application/json';return h};
const J=(u,m='GET',b)=>fetch(API+u,{method:m,headers:H(!!b),body:b?JSON.stringify(b):undefined});
const save=()=>{try{localStorage.setItem('api',API);localStorage.setItem('tok',TOKEN)}catch(e){}};
async function start(){try{const r=await(await J('/api/admin/me')).json();r.admin?panel():login()}catch(e){login('سرور در دسترس نیست. run.bat / run.sh را اجرا کنید یا آدرس سرور را پایین بررسی کنید.')}}
function login(msg){
  clearInterval(tm);
  $('#app').innerHTML=`<div class="login"><img src="${$('header img').src}" alt=""><h2>ADMIN ACCESS</h2>
  <div class="mu">رمز عبور را وارد کنید</div><input id="pw" type="password" autocomplete="current-password">
  <button id="go" style="width:100%;margin-top:8px">ورود به پنل</button><div id="er" class="mu" style="margin-top:8px;color:#ff8aa5">${esc(msg||'')}</div>
  <details style="margin-top:10px"><summary class="mu" style="cursor:pointer">آدرس سرور</summary><input id="sv" class="sv" value="${esc(API||location.origin)}"></details></div>`;
  const go=async()=>{API=$('#sv').value.trim().replace(/\/$/,'');if(API===location.origin)API='';
    try{const r=await J('/api/admin/login','POST',{password:$('#pw').value});
      if(!r.ok){$('#er').textContent=r.status===503?'رمز ادمین روی سرور تنظیم نشده (ADMIN_PASSWORD)':r.status===429?'تلاش‌های زیاد؛ یک دقیقه صبر کنید':'رمز اشتباه است ✖';return}
      TOKEN=(await r.json()).token||'';save();panel()}
    catch(e){$('#er').textContent='اتصال به سرور برقرار نشد. run.bat را اجرا کنید یا آدرس سرور را درست کنید.'}};
  $('#go').onclick=go;$('#pw').onkeydown=e=>{if(e.key==='Enter')go()};
}
function sec(id){['s_acc','s_msg','s_users','s_about','s_ct'].forEach(i=>$('#'+i).style.display=i===id?'':'none');
  document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.s===id));if(id==='s_about'||id==='s_ct')loadSite();if(id==='s_users')users()}
function panel(){
  $('#app').innerHTML=`<div class="bar"><a class="btn" href="./" target="_blank" rel="noopener" style="text-decoration:none">مشاهده سایت</a><button class="g" id="lo">خروج</button><span id="sy" class="mu"></span></div>
  <div class="stats"><div class="stat"><b id="s1">0</b><span>اکانت‌های موجود</span></div><div class="stat"><b id="s2">0</b><span>گفتگوهای کاربران</span></div><div class="stat"><b id="s3">0</b><span>کاربران ثبت‌نام‌شده</span></div></div>
  <nav id="nav" style="margin:0 0 14px"><button data-s="s_acc">📦 اکانت‌ها</button><button data-s="s_msg">💬 پیام‌ها</button><button data-s="s_users">👥 کاربران</button><button data-s="s_about">📝 درباره ما</button><button data-s="s_ct">📞 تماس با ما</button></nav>
  <div id="s_acc"><div class="box" id="fbox"><b id="ft">➕ افزودن اکانت جدید</b>
   <input id="pt" placeholder="لجندری (مثلاً ۱)"><input id="pp" placeholder="قیمت (مثلاً ۵۰۰۰)">
   <textarea id="pd" rows="3" placeholder="توضیحات اکانت..."></textarea>
   <input id="pf" type="file" accept="image/*"><img id="pv" class="pv" style="display:none">
   <div class="fl" style="margin-top:8px"><button id="add">ذخیره اکانت</button><button class="g" id="cn" style="display:none">انصراف از ویرایش</button><span id="st" class="mu"></span></div></div>
   <div class="box"><b>اکانت‌های ثبت‌شده</b><div id="pl" style="margin-top:8px"></div></div></div>
  <div id="s_msg" style="display:none"><div class="box"><div class="two"><div id="th"></div>
   <div><div id="ah" class="mu" style="margin-bottom:6px"></div><div class="msgs" id="am"><span class="mu">یک گفتگو را انتخاب کنید</span></div>
   <div class="row" style="margin-top:8px"><input id="ar" placeholder="پاسخ به کاربر..."><button id="as">ارسال</button></div></div></div></div></div>
  <div id="s_users" style="display:none"><div class="box"><b>👥 کاربران ثبت‌نام‌شده</b> <span class="mu">(کاربران خودشان از سایت ثبت‌نام می‌کنند؛ این لیست فقط برای شما نمایش داده می‌شود)</span><input id="uq" placeholder="جستجوی نام کاربری یا ایمیل..." style="margin-top:10px"><div id="ul" style="margin-top:10px"></div></div></div>
  <div id="s_about" style="display:none"><div class="box"><b>متن صفحه‌ی «درباره ما»</b><textarea id="ab" rows="9" placeholder="درباره‌ی فروشگاه خود بنویسید..."></textarea>
   <div class="fl"><button id="sab">ذخیره</button><span id="sta" class="mu"></span></div></div></div>
  <div id="s_ct" style="display:none"><div class="box"><b>📞 شماره ادمین</b> <span class="mu">(بعد از زدن «تماس با ادمین و چت» به کاربر نمایش داده می‌شود)</span><input id="ph" class="sv" placeholder="09123456789"><br><b>پیام‌رسان‌های صفحه‌ی «تماس با ما»</b><div id="cl" style="margin-top:8px"></div>
   <div class="fl" style="margin-top:8px"><button class="g" id="ac">➕ افزودن پیام‌رسان</button><button id="sct">ذخیره</button><span id="stc" class="mu"></span></div></div></div>`;
  document.querySelectorAll('#nav button').forEach(b=>b.onclick=()=>sec(b.dataset.s));sec('s_acc');
  $('#lo').onclick=()=>{TOKEN='';save();login()};
  $('#pf').onchange=()=>{const f=$('#pf').files[0],v=$('#pv');if(f){v.src=URL.createObjectURL(f);v.style.display='block'}else v.style.display='none'};
  $('#cn').onclick=resetForm;$('#uq').oninput=drawU;
  $('#add').onclick=async()=>{const t=$('#pt').value.trim();if(!t){$('#st').textContent='لجندری را بنویسید';return}
    const fd=new FormData();fd.append('legendary',t);fd.append('price',$('#pp').value);fd.append('desc',$('#pd').value);
    const f=$('#pf').files[0];if(f)fd.append('image',f);$('#st').textContent='در حال ذخیره...';
    try{const r=await fetch(API+'/api/products'+(editId?'/'+editId:''),{method:editId?'PUT':'POST',headers:H(false),body:fd});
      if(r.ok){resetForm();$('#st').textContent='ذخیره شد ✓';prods()}else if(r.status===401)login('نشست تمام شد، دوباره وارد شوید.');else $('#st').textContent='خطا در ذخیره'}
    catch(e){$('#st').textContent='اتصال به سرور برقرار نشد'}};
  const rep=async()=>{const t=$('#ar').value.trim();if(!t||!cur)return;$('#ar').value='';
    try{const r=await J('/api/admin/threads/'+cur,'POST',{text:t});
      if(r.status===401)return login('نشست تمام شد، دوباره وارد شوید.');
      if(!r.ok){$('#ar').value=t;alert('ارسال پاسخ انجام نشد');return}}
    catch(e){$('#ar').value=t;alert('اتصال به سرور برقرار نشد');return}
    msgs()};
  $('#as').onclick=rep;$('#ar').onkeydown=e=>{if(e.key==='Enter')rep()};
  $('#sab').onclick=async()=>{const r=await J('/api/site','PUT',{about:$('#ab').value});if(r.status===401)return login('نشست تمام شد، دوباره وارد شوید.');$('#sta').textContent=r.ok?'ذخیره شد ✓':'خطا'};
  $('#ac').onclick=()=>{readC();contacts.push({type:'telegram',label:'',link:''});drawC()};
  $('#sct').onclick=async()=>{readC();const r=await J('/api/site','PUT',{contacts,phone:$('#ph').value});if(r.status===401)return login('نشست تمام شد، دوباره وارد شوید.');$('#stc').textContent=r.ok?'ذخیره شد ✓':'خطا';if(r.ok)loadSite()};
  prods();threads();users();clearInterval(tm);syncst();tm=setInterval(()=>{threads();msgs();syncst()},3000);
}
function resetForm(){editId=null;['pt','pp','pd','pf'].forEach(i=>$('#'+i).value='');$('#pv').style.display='none';$('#ft').textContent='➕ افزودن اکانت جدید';$('#cn').style.display='none';$('#add').textContent='ذخیره اکانت';$('#fbox').classList.remove('ed')}
let list=[];
async function prods(){try{list=await(await J('/api/products')).json();$('#s1').textContent=list.length;
  $('#pl').innerHTML=list.map(x=>`<div class="pi"><i${x.image?` style="background-image:url('${esc(API+x.image)}')"`:''}></i><span class="tx"><b>لجندری:</b> ${esc(x.legendary)} &nbsp; <b>قیمت:</b> ${esc(x.price)}</span><button class="g" data-e="${x.id}">✏️ ویرایش</button><button class="g" data-d="${x.id}">🗑 حذف</button></div>`).join('')||'<span class="mu">هنوز اکانتی ثبت نشده</span>';
  $('#pl').querySelectorAll('[data-e]').forEach(b=>b.onclick=()=>{const x=list.find(p=>p.id==b.dataset.e);editId=x.id;$('#pt').value=x.legendary;$('#pp').value=x.price;$('#pd').value=x.desc;$('#pf').value='';
    $('#ft').textContent='✏️ ویرایش اکانت (عکس را فقط برای تغییر انتخاب کنید)';$('#cn').style.display='';$('#add').textContent='ذخیره تغییرات';$('#fbox').classList.add('ed');$('#st').textContent='';scrollTo({top:0,behavior:'smooth'})});
  $('#pl').querySelectorAll('[data-d]').forEach(b=>{let armed=0;b.onclick=async()=>{
    if(!armed){armed=1;b.textContent='⚠️ تأیید حذف؟';b.className='dng';setTimeout(()=>{armed=0;b.textContent='🗑 حذف';b.className='g'},3500);return}
    const r=await J('/api/products/'+b.dataset.d,'DELETE');if(r.status===401)return login('نشست تمام شد، دوباره وارد شوید.');if(!r.ok){alert('حذف انجام نشد');return}if(editId==b.dataset.d)resetForm();prods()}})}catch(e){}}
async function syncst(){try{const r=await J('/api/admin/sync');if(!r.ok)return;const s=await r.json(),e=$('#sy');if(!e)return;
  if(!s.enabled){e.textContent='';return}
  e.textContent=s.error?'☁️ خطا در ذخیره روی GitHub (دوباره تلاش می‌شود)':s.pending?'☁️ در حال ذخیره روی GitHub...':'☁️ ذخیره‌شده روی GitHub ✓';
  e.title=s.error||''}catch(e){}}
let ulist=[];
function drawU(){const q=($('#uq').value||'').trim().toLowerCase();
  const l=ulist.filter(u=>!q||u.username.toLowerCase().includes(q)||u.email.toLowerCase().includes(q));
  $('#ul').innerHTML=l.length?l.map(u=>`<div class="pi"><span class="tx"><b>👤 ${esc(u.username)}</b> <span class="mu">#${u.id}</span><div class="mu sv">${esc(u.email)}</div></span><span class="mu">${new Date(u.created*1000).toLocaleDateString('fa-IR')} · ${u.messages} پیام</span><button class="g" data-c="u${u.id}">💬 گفتگو</button></div>`).join(''):'<div class="mu">کاربری پیدا نشد.</div>';
  $('#ul').querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{cur=b.dataset.c;sec('s_msg');msgs();threads()})}
async function users(){try{const r=await J('/api/admin/users');if(r.status===401)return login('نشست تمام شد، دوباره وارد شوید.');ulist=await r.json();$('#s3').textContent=ulist.length;drawU()}catch(e){}}
async function threads(){try{const r=await J('/api/admin/threads');if(r.status===401)return login('نشست تمام شد، دوباره وارد شوید.');const t=await r.json();tl=t;$('#s2').textContent=t.length;
  $('#th').innerHTML=t.map(x=>`<div class="th ${cur===x.visitor?'on':''}" data-u="${esc(x.visitor)}"><b>👤 ${esc(x.username||'مهمان')}</b> <span class="mu">(${x.n})</span><div class="mu">${esc(x.email||'')}</div><div class="mu">${esc(x.last)}</div></div>`).join('')||'<span class="mu">پیامی نیست</span>';
  $('#th').querySelectorAll('.th').forEach(el=>el.onclick=()=>{cur=el.dataset.u;msgs();threads()})}catch(e){}}
async function msgs(){if(!cur)return;try{const m=await(await J('/api/admin/threads/'+cur)).json();const b=$('#am');if(!b)return;const ti=tl.find(z=>z.visitor===cur)||ulist.find(z=>'u'+z.id===cur);if(ti&&$('#ah'))$('#ah').textContent=ti.username?'👤 '+ti.username+(ti.email?' — '+ti.email:''):'مهمان';
  const stick=b.scrollTop+b.clientHeight>=b.scrollHeight-40;
  b.innerHTML=m.map(x=>`<div class="m ${x.from==='admin'?'me':'ot'}">${esc(x.text)}</div>`).join('');if(stick)b.scrollTop=1e9}catch(e){}}
async function loadSite(){try{const s=await(await J('/api/site')).json();if(document.activeElement!==$('#ab'))$('#ab').value=s.about||'';contacts=s.contacts||[];if(document.activeElement!==$('#ph'))$('#ph').value=s.phone||'';drawC()}catch(e){}}
function drawC(){$('#cl').innerHTML=contacts.map((c,i)=>`<div class="pi" data-i="${i}"><select style="width:130px">${Object.entries(TYPES).map(([k,v])=>`<option value="${k}" ${c.type===k?'selected':''}>${v}</option>`).join('')}</select>
  <input class="lb" style="flex:1;min-width:120px" placeholder="عنوان (مثلاً کانال تلگرام)" value="${esc(c.label)}"><input class="lk sv" style="flex:2;min-width:180px" placeholder="https://t.me/yourchannel" value="${esc(c.link)}"><button class="g" data-x="${i}">🗑</button></div>`).join('')||'<span class="mu">هنوز پیام‌رسانی اضافه نشده</span>';
  $('#cl').querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>{readC();contacts.splice(+b.dataset.x,1);drawC()})}
function readC(){document.querySelectorAll('#cl .pi').forEach(r=>{const c=contacts[+r.dataset.i];if(c){c.type=r.querySelector('select').value;c.label=r.querySelector('.lb').value;c.link=r.querySelector('.lk').value}})}
// background
(function(){const c=$('#fx'),x=c.getContext('2d');let W,H,P=[];const rs=()=>{W=c.width=innerWidth;H=c.height=innerHeight;P=Array.from({length:40},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*2+.5,v:Math.random()*.2+.05,d:Math.random()*6}))};addEventListener('resize',rs);rs();
  (function f(){x.clearRect(0,0,W,H);const t=Date.now()/1000;P.forEach(p=>{p.y-=p.v;if(p.y<-5){p.y=H+5;p.x=Math.random()*W}x.beginPath();x.fillStyle=`rgba(200,160,255,${.25+.2*Math.sin(t+p.d)})`;x.arc(p.x,p.y,p.r,0,6.28);x.fill()});
  if(!matchMedia('(prefers-reduced-motion:reduce)').matches)requestAnimationFrame(f)})()})();
start();
