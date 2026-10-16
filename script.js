(function(){
function rec(type){Store.save(type,to);}
var P=new URLSearchParams(location.search),to=(P.get('to')||'').trim(),from=(P.get('from')||'').trim();
var name=to||'you';
document.title=to?('For '+to):document.title;

/* story steps: [title, typed text] then reason cards */
var steps=[];function build(){var name=to||'you';steps=[
 ['Hey '+name+'…','I made this just for you, so give me a minute of your time.'],
 ['I have to be honest','Somewhere along the way you became the person I look forward to talking to.'],
 ['Little things','Your smile, the way you laugh, how you make a plain day feel lighter. I notice all of it.'],
 [P.get('r')||'Why you','You are kind, you are fun, and around you I feel like the best version of myself.']
]}
var i=0,typing=false,timer;
var t1=document.getElementById('t1'),tx=document.getElementById('tx'),nx=document.getElementById('nx'),dots=document.getElementById('dots');
function mkdots(){dots.textContent='';steps.forEach(function(){dots.appendChild(document.createElement('i'))})}

function show(n){
  var s=steps[n];t1.textContent=s.length?s[0]:'';tx.textContent='';tx.classList.add('cur');
  [].forEach.call(dots.children,function(d,k){d.classList.toggle('on',k===n)});
  var k=0,full=s[1];typing=true;nx.style.visibility='hidden';
  clearInterval(timer);
  timer=setInterval(function(){
    tx.textContent=full.slice(0,++k);
    if(k>=full.length){clearInterval(timer);typing=false;nx.style.visibility='visible';nx.textContent=n===steps.length-1?'Keep going':'Next';}
  },38);
}
nx.addEventListener('click',function(){
  if(typing)return;
  if(i<steps.length-1){i++;show(i);}
  else{var a=document.getElementById('s1');a.classList.add('out');setTimeout(function(){a.classList.add('hide');document.getElementById('s2').classList.remove('hide')},600);}
});
document.getElementById('s1').classList.add('hide');
document.getElementById('s0').classList.remove('hide');
function go(){var v=document.getElementById('nm').value.trim();if(!v){document.getElementById('nm').focus();return;}
  to=v;document.title='For '+v;rec('view');build();mkdots();
  document.getElementById('s0').classList.add('hide');document.getElementById('s1').classList.remove('hide');show(0);}
document.getElementById('go').addEventListener('click',go);
document.getElementById('nm').addEventListener('keydown',function(e){if(e.key==='Enter')go()});

/* starfield + drifting hearts */
var sky=document.getElementById('sky'),c=sky.getContext('2d'),W,H,stars=[];
function size(){W=sky.width=innerWidth;H=sky.height=innerHeight;}
size();addEventListener('resize',size);
for(var n=0;n<110;n++)stars.push({x:Math.random(),y:Math.random(),r:Math.random()*1.6+.3,p:Math.random()*6,s:Math.random()*.4+.1});
var still=matchMedia('(prefers-reduced-motion:reduce)').matches;
function draw(t){
  c.clearRect(0,0,W,H);
  stars.forEach(function(s){
    c.globalAlpha=.35+.6*Math.abs(Math.sin(t/1200*s.s+s.p));
    c.fillStyle='#ffe9b5';c.beginPath();c.arc(s.x*W,s.y*H,s.r,0,7);c.fill();
    if(!still){s.y-=.00006*s.s*10;if(s.y<0)s.y=1;}
  });
  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

/* runaway No */
var yes=document.getElementById('yes'),no=document.getElementById('no'),note=document.getElementById('note'),tries=0;
var lines=["Oops, that button is shy.","Are you sure? Try the other one.","It keeps running away from you.","The No button has left the chat.","The Yes button is looking pretty big now."];
function dodge(e){
  if(e)e.preventDefault();tries++;rec('no');no.classList.add('run');
  no.style.left=Math.max(10,Math.random()*(innerWidth-no.offsetWidth-20))+'px';
  no.style.top=Math.max(10,Math.random()*(innerHeight-no.offsetHeight-20))+'px';
  yes.style.transform='scale('+Math.min(1+tries*.18,2.2)+')';yes.style.margin=(tries*6)+'px '+(tries*10)+'px';
  note.textContent=lines[Math.min(tries-1,lines.length-1)];
  if(tries>6)no.textContent='Fine, Yes';
}
no.addEventListener('mouseenter',dodge);
no.addEventListener('touchstart',dodge,{passive:false});
no.addEventListener('click',function(e){tries>6?win():dodge(e)});
yes.addEventListener('click',win);

/* celebration: confetti + hearts */
var fx=document.getElementById('fx'),f=fx.getContext('2d'),bits=[];
function fsize(){fx.width=innerWidth;fx.height=innerHeight}fsize();addEventListener('resize',fsize);
function burst(x,y){
  var cols=['#ff5d8f','#ffd27a','#ffffff','#b78cff','#7be0ff'];
  for(var n=0;n<90;n++){var a=Math.random()*6.28,v=Math.random()*9+3;
    bits.push({x:x,y:y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-4,w:Math.random()*8+4,h:Math.random()*5+3,c:cols[n%5],r:Math.random()*6,life:120+Math.random()*60});}
}
function loop(){
  f.clearRect(0,0,fx.width,fx.height);
  bits=bits.filter(function(b){return b.life>0});
  bits.forEach(function(b){b.x+=b.vx;b.y+=b.vy;b.vy+=.22;b.vx*=.99;b.r+=.2;b.life--;
    f.save();f.translate(b.x,b.y);f.rotate(b.r);f.fillStyle=b.c;f.globalAlpha=Math.min(1,b.life/40);f.fillRect(-b.w/2,-b.h/2,b.w,b.h);f.restore();});
  requestAnimationFrame(loop);
}
loop();
function win(){
  rec('yes');
  document.getElementById('s2').classList.add('hide');no.style.display='none';
  document.getElementById('s3').classList.remove('hide');
  if(from)document.getElementById('thx').textContent='Thank you'+(to?', '+to:'')+'. '+from+' is smiling right now.';
  if(!still){
    burst(innerWidth/2,innerHeight/2);setTimeout(function(){burst(innerWidth*.25,innerHeight*.4)},350);setTimeout(function(){burst(innerWidth*.75,innerHeight*.4)},700);
    var ic=['💖','💕','💗','✨','🌸'];
    for(var k=0;k<45;k++)(function(k){setTimeout(function(){
      var h=document.createElement('span');h.className='heart';h.textContent=ic[k%5];
      h.style.left=Math.random()*100+'vw';h.style.fontSize=(18+Math.random()*28)+'px';h.style.animationDuration=(4+Math.random()*4)+'s';
      document.body.appendChild(h);setTimeout(function(){h.remove()},8500);},k*110)})(k);
  }
}
})();
