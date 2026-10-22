/* Blood Bank Finder - front-end only, all data below is SAMPLE data */
var SITE={phone:"+91 98765 43210",phoneHref:"+919876543210",email:"bloodbankfinder.help@gmail.com"};
var GROUPS=["O-","O+","A-","A+","B-","B+","AB-","AB+"];
var CITIES=["Delhi","Gurugram","Noida","Faridabad","Jaipur","Chandigarh","Mumbai","Pune","Bengaluru","Hyderabad"];
var BANKS=[
["City Care Blood Bank","Delhi","Karol Bagh Road","+91 98110 24571","citycare.blood@gmail.com"],
["Red Drop Blood Centre","Delhi","Lajpat Nagar Market","+91 99580 31682","reddrop.centre@gmail.com"],
["LifeLine Blood Bank","Gurugram","Sector 14 Main Road","+91 98733 40915","lifeline.ggn@gmail.com"],
["Sanjeevani Blood Centre","Gurugram","Golf Course Extension","+91 97180 66204","sanjeevani.blood@gmail.com"],
["Pulse Blood Bank","Noida","Sector 62 Block B","+91 98999 17340","pulse.noida@gmail.com"],
["Hope Blood Bank","Faridabad","NIT Market","+91 98186 52093","hope.fbd.blood@gmail.com"],
["Pink City Blood Bank","Jaipur","MI Road","+91 94140 28876","pinkcity.blood@gmail.com"],
["Rose Garden Blood Centre","Chandigarh","Sector 17","+91 98760 33418","rosegarden.blood@gmail.com"],
["Marine Drive Blood Bank","Mumbai","Andheri West","+91 98200 71459","marine.blood.mum@gmail.com"],
["Sahyadri Blood Centre","Pune","Shivaji Nagar","+91 98220 45107","sahyadri.blood@gmail.com"],
["Garden City Blood Bank","Bengaluru","Indiranagar","+91 98450 62230","gardencity.blood@gmail.com"],
["Charminar Blood Centre","Hyderabad","Banjara Hills","+91 99490 18764","charminar.blood@gmail.com"],
["Heartbeat Blood Bank","Delhi","Dwarka Sector 9","+91 98711 90456","heartbeat.delhi@gmail.com"],
["Nav Jeevan Blood Bank","Noida","Sector 18","+91 98105 77321","navjeevan.noida@gmail.com"]
];
/* seeded stock so every visit shows the same demo numbers */
function seeded(n){var x=Math.sin(n*9301+49297)*233280;return x-Math.floor(x)}
BANKS=BANKS.map(function(b,i){
  var stock={};
  GROUPS.forEach(function(g,j){
    var r=seeded(i*17+j*5+3);
    var u=r<.12?0:Math.floor(r*28);
    if(g==="O-"&&(i%3===0))u=Math.max(u,4+i);
    stock[g]=u;
  });
  var mins=5+Math.floor(seeded(i+40)*50);
  return{name:b[0],city:b[1],area:b[2],phone:b[3],email:b[4],stock:stock,mins:mins};
});
function tel(p){return p.replace(/[^+\d]/g,"")}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}

/* header / footer */
var PAGES=[["index.html","Home"],["search.html","Find Blood"],["request.html","Urgent Request"],["donate.html","Donate"],["about.html","About"],["contact.html","Contact"]];
(function(){
  var cur=location.pathname.split("/").pop()||"index.html";
  var h=document.getElementById("site-header");
  if(h){
    h.outerHTML='<header><div class="wrap nav"><a class="logo" href="index.html"><span class="drop">+</span>Blood Bank Finder</a><nav aria-label="Main"><ul>'+
    PAGES.map(function(p){return'<li><a href="'+p[0]+'"'+(p[0]===cur?' class="active" aria-current="page"':'')+'>'+p[1]+'</a></li>'}).join("")+
    '</ul></nav></div></header><div class="sos">Medical emergency? Call <a href="tel:112">112</a> or ambulance <a href="tel:108">108</a> right away.</div>';
  }
  var f=document.getElementById("site-footer");
  if(f){
    f.outerHTML='<footer><div class="wrap"><div class="grid">'+
    '<div><h4>Blood Bank Finder</h4><p>Find verified blood availability near you, fast. Built for families who cannot afford to wait.</p></div>'+
    '<div><h4>Pages</h4>'+PAGES.map(function(p){return'<a href="'+p[0]+'">'+p[1]+'</a>'}).join("")+'</div>'+
    '<div><h4>Blood groups</h4>'+["O-","A+","B+","AB-"].map(function(g){return'<a href="search.html?group='+encodeURIComponent(g)+'">Find '+g+'</a>'}).join("")+'</div>'+
    '<div><h4>Reach us</h4><a href="tel:'+SITE.phoneHref+'">'+SITE.phone+'</a><a href="mailto:'+SITE.email+'">'+SITE.email+'</a></div>'+
    '</div><p class="copy">Demo project. Blood banks, stock numbers, phone numbers and emails on this site are sample data. Always confirm with the blood bank by phone.</p></div></footer>';
  }
})();

/* store helpers (localStorage, wrapped so it never breaks the page) */
function load(k){try{return JSON.parse(localStorage.getItem(k)||"[]")}catch(e){return[]}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}

function fillSelect(el,items,placeholder){
  if(!el)return;
  el.innerHTML=(placeholder?'<option value="">'+placeholder+'</option>':'')+items.map(function(i){return'<option>'+i+'</option>'}).join("");
}

/* render list of banks that match */
function renderBanks(target,group,city,onlyAvailable){
  var list=BANKS.filter(function(b){return(!city||b.city===city)}).map(function(b){
    return{b:b,u:group?b.stock[group]:Object.keys(b.stock).reduce(function(s,k){return s+b.stock[k]},0)};
  });
  if(onlyAvailable)list=list.filter(function(x){return x.u>0});
  list.sort(function(a,b){return b.u-a.u});
  if(!list.length){target.innerHTML='<div class="msg err">No blood bank found for this choice. Try another city, or call '+SITE.phone+' and we will help you search.</div>';return}
  target.innerHTML=list.map(function(x){
    var cls=x.u===0?"none":(x.u<5?"low":"");
    var lab=x.u===0?"Not in stock":(x.u<5?"Low stock":"Available");
    return'<article class="bank '+cls+'"><div><h3>'+esc(x.b.name)+'</h3><p class="meta">'+esc(x.b.area)+', '+esc(x.b.city)+' &middot; stock checked '+x.b.mins+' min ago</p>'+
    '<div class="chips"><span class="chip '+cls+'">'+lab+'</span><span class="chip v">Verified by phone</span></div></div>'+
    '<div class="act"><div class="units">'+x.u+'<small>'+(group?group+' units':'total units')+'</small></div>'+
    '<a class="btn sm" href="tel:'+tel(x.b.phone)+'">Call '+esc(x.b.phone)+'</a>'+
    '<a class="btn sm ghost" href="mailto:'+esc(x.b.email)+'?subject=Blood%20needed'+(group?'%20('+encodeURIComponent(group)+')':'')+'">Email</a></div></article>';
  }).join("");
}
