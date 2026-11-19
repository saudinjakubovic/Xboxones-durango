// void-anvil runner: local crash detection via localStorage
const q = new URLSearchParams(location.search);
const id = q.get('id') || '0';
const src = q.get('f') || 'corpus/t0.html';

function save(k, v){ localStorage.setItem(k, JSON.stringify(v)); }
function load(k){ try { return JSON.parse(localStorage.getItem(k)); } catch(e){ return null; } }
function ev(o){
  let b = load('void_events') || [];
  b.push(o); if (b.length > 2000) b = b.slice(-2000);
  save('void_events', b);
}

// provjeri da li je prosli run pukao
const prev = load('void_last');
if (prev && !prev.done){
  let cr = load('void_crashes') || [];
  cr.push({id: prev.id, f: prev.f, t: Date.now()});
  save('void_crashes', cr);
  ev({type:'CRASH?', id: prev.id, f: prev.f});
}

save('void_last', {id, f: src, t: Date.now(), done: false});
ev({type:'START', id, f: src});

const f = document.createElement('iframe');
f.width = 800; f.height = 600; f.src = src;
document.body.appendChild(f);

setTimeout(function(){
  save('void_last', {id, f: src, t: Date.now(), done: true});
  ev({type:'DONE', id, f: src});
}, 15000);

document.getElementById('s').textContent =
  'running id=' + id + ' file=' + src;
