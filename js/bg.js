// calm animated background
(function(){const c=document.getElementById('fx'),x=c.getContext('2d');let W,H,P=[];
  const rs=()=>{W=c.width=innerWidth;H=c.height=innerHeight;P=Array.from({length:Math.min(70,Math.floor(W*H/22000))},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*2.2+.5,v:Math.random()*.25+.05,a:Math.random()*.5+.2,d:Math.random()*6.28}))};
  addEventListener('resize',rs);rs();
  (function f(){x.clearRect(0,0,W,H);const t=Date.now()/1000;
    [[.2,.3,260,'#7c3aed'],[.8,.7,320,'#5b21b6'],[.6,.15,220,'#a855f7']].forEach((o,i)=>{const px=o[0]*W+Math.sin(t/9+i)*60,py=o[1]*H+Math.cos(t/11+i)*50,g=x.createRadialGradient(px,py,0,px,py,o[2]);g.addColorStop(0,o[3]+'33');g.addColorStop(1,'transparent');x.fillStyle=g;x.fillRect(0,0,W,H)});
    P.forEach(p=>{p.y-=p.v;p.x+=Math.sin(t/3+p.d)*.15;if(p.y<-5){p.y=H+5;p.x=Math.random()*W}x.beginPath();x.fillStyle=`rgba(200,160,255,${p.a*(.6+.4*Math.sin(t+p.d))})`;x.arc(p.x,p.y,p.r,0,6.28);x.fill()});
    if(!matchMedia('(prefers-reduced-motion:reduce)').matches)requestAnimationFrame(f)})();
})();
