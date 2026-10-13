import { categories, options, defaultBuild, pipeline } from './buildOptions.js'

const $ = (s) => document.querySelector(s)
const $$ = (s) => [...document.querySelectorAll(s)]
const money = new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0})

let build = (() => { try { return JSON.parse(localStorage.getItem('mazda6-build')) || {...defaultBuild} } catch { return {...defaultBuild} } })()
let category = 'wheels', mode = 'photo', view = 'side', compare = false, showMore = false
const photos = { side:null, front3q:null, rear:null }

const selected = () => Object.fromEntries(Object.entries(build).map(([k,id]) => [k, options[k].find(x=>x.id===id) || options[k][0]]))
const save = () => localStorage.setItem('mazda6-build', JSON.stringify(build))

function renderCategories(){
  $('#categoryTabs').innerHTML = categories.map(([id,label])=>`<button data-category="${id}" class="${id===category?'active':''}">${label}</button>`).join('')
  $$('#categoryTabs button').forEach(btn=>btn.addEventListener('click',()=>{category=btn.dataset.category;renderCategories();renderOptions()}))
}
function renderOptions(){
  $('#optionList').innerHTML = options[category].map(o=>`<button class="option-card ${build[category]===o.id?'selected':''}" data-id="${o.id}"><div><strong>${o.label}</strong><span>${o.meta}</span></div><em>${o.price?money.format(o.price):'—'}</em></button>`).join('')
  $$('#optionList .option-card').forEach(btn=>btn.addEventListener('click',()=>{build={...build,[category]:btn.dataset.id};save();renderOptions();renderSpec();renderStage()}))
}
function renderSpec(){
  const s=selected(), w=s.wheels
  const tire=w.diameter===20?'245/35R20':w.diameter===19?'245/40R19':'225/55R17'
  const total=Object.values(s).reduce((a,b)=>a+(b.price||0),0)
  const rows=[['Wheel',`${w.diameter}×${w.width} ET${w.offset}`],['Tire target',tire],['Brake',s.brakes.label],['Aero',s.aero.label],['Badge',s.badging.label]]
  if(showMore) rows.push(['PCD','5×114.3'],['Center bore','67.1 mm'],['Estimated mods',money.format(total)])
  $('#specList').innerHTML=rows.map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')
  $('#stageSpec').textContent=`${w.diameter}×${w.width} · ET${w.offset} · ${s.brakes.label} calipers · ${s.aero.label}`
}
function renderPipeline(){
  $('#pipeline').innerHTML=pipeline.map(([label,status])=>`<div class="status-row"><span>${label}</span><b class="status ${status}">${status}</b></div>`).join('')
}
function overlayMarkup(){
  if(compare) return ''
  const s=selected(), wheelScale=s.wheels.diameter===20?1.14:s.wheels.diameter===19?1.08:1
  if(view==='side'){
    const wheels=[{x:223,y:515},{x:755,y:548}].map(p=>`<g transform="translate(${p.x} ${p.y}) scale(${wheelScale})"><circle r="74" fill="#08090a" opacity=".96"/><circle r="58" fill="#14181d" stroke="#30343a" stroke-width="2"/><circle r="24" fill="${s.brakes.color}"/>${Array.from({length:10},(_,i)=>`<rect x="-5" y="-56" width="10" height="48" rx="3" fill="#1d2228" transform="rotate(${i*36})"/>`).join('')}<circle r="10" fill="#090a0c" stroke="#555b64" stroke-width="2"/></g>`).join('')
    const wing=s.aero.wing?`<g transform="translate(75 305)"><path d="M0 36 L115 17 L173 20 L174 31 L121 34 L8 52 Z" fill="#090a0c" stroke="#3b3e44" stroke-width="2"/><rect x="35" y="40" width="7" height="36" rx="2" fill="#0d0f11"/><rect x="137" y="31" width="7" height="42" rx="2" fill="#0d0f11"/></g>`:''
    const graphic=s.graphics.graphic?`<g opacity=".33" fill="none" stroke="#757b84" stroke-linecap="round"><path d="M630 388 C700 335 790 340 865 382 C803 361 743 376 685 420" stroke-width="7"/><path d="M658 408 C725 365 787 383 842 421" stroke-width="4"/></g>`:''
    return wheels+wing+graphic
  }
  if(view==='front3q') return `${s.aero.wing?'<path d="M175 397 L286 380 L330 389 L326 399 L217 410 Z" fill="#0b0d0f" stroke="#36393d" stroke-width="2"/>':''}${s.graphics.graphic?'<path d="M575 390 C670 336 756 344 842 410" fill="none" stroke="#62666b" stroke-width="8" opacity=".3"/>':''}`
  if(view==='rear') return `${s.aero.wing?'<path d="M330 160 L670 160 L704 178 L680 188 L320 188 L294 178 Z" fill="#08090a" stroke="#35383d" stroke-width="2"/><rect x="350" y="184" width="8" height="40" fill="#0a0b0c"/><rect x="642" y="184" width="8" height="40" fill="#0a0b0c"/>':''}${s.aero.diffuser?'<g transform="translate(250 583)"><path d="M0 0 H500 L472 62 H28 Z" fill="#060708" opacity=".92"/>'+[85,145,205,265,325,385].map(x=>`<path d="M${x} 4 L${x-8} 55 L${x+12} 55 Z" fill="#20242a"/>`).join('')+'</g>':''}${s.badging.pearson?`<text x="500" y="124" text-anchor="middle" font-size="28" font-weight="900" font-style="italic" letter-spacing="2" fill="${s.badging.badge}" stroke="#050607" stroke-width="1">PEARSON</text>`:''}`
  return ''
}
function renderStage(){
  $('#photoOverlay').innerHTML=overlayMarkup()
  $('#stageName').textContent=$('#buildName').value||'Untitled build'
  const has=!!photos[view]
  $('#carPhoto').classList.toggle('hidden',!has)
  $('#photoPlaceholder').classList.toggle('hidden',has)
  if(has) $('#carPhoto').src=photos[view]
  renderSpec(); updateThree()
}
function setMode(next){mode=next;$$('#modeTabs button').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));$('#photoStage').classList.toggle('hidden',mode!=='photo');$('#threeWrap').classList.toggle('hidden',mode!=='3d');$('#viewTabs').classList.toggle('hidden',mode!=='photo');if(mode==='3d') initThree()}
function setView(next){view=next;$$('#viewTabs button').forEach(b=>b.classList.toggle('active',b.dataset.view===view));renderStage()}

let threeState=null
async function initThree(){
  if(threeState) return
  const mount=$('#threeCanvas')
  try{
    const THREE=await import('https://cdn.jsdelivr.net/npm/three@0.169.0/+esm')
    const {OrbitControls}=await import('https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/controls/OrbitControls.js')
    const scene=new THREE.Scene();scene.background=new THREE.Color('#0b0d10')
    const camera=new THREE.PerspectiveCamera(34,mount.clientWidth/Math.max(mount.clientHeight,1),.1,100);camera.position.set(7.2,3.2,8.2)
    const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(mount.clientWidth,mount.clientHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;mount.append(renderer.domElement)
    const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.minDistance=5;controls.maxDistance=16;controls.target.set(0,.55,0)
    scene.add(new THREE.HemisphereLight(0xd8e6ff,0x151515,2.7));const key=new THREE.DirectionalLight(0xffffff,4.2);key.position.set(5,8,4);scene.add(key);const rim=new THREE.DirectionalLight(0x83a8ff,2.4);rim.position.set(-6,3,-4);scene.add(rim)
    const floor=new THREE.Mesh(new THREE.CircleGeometry(8.5,96),new THREE.MeshStandardMaterial({color:0x111318,roughness:.88,metalness:.08}));floor.rotation.x=-Math.PI/2;floor.position.y=-.02;scene.add(floor)
    const car=new THREE.Group();scene.add(car)
    const bodyMat=new THREE.MeshPhysicalMaterial({color:0x050607,metalness:.78,roughness:.16,clearcoat:1,clearcoatRoughness:.08}),glassMat=new THREE.MeshPhysicalMaterial({color:0x0b1720,metalness:.25,roughness:.13,transparent:true,opacity:.82}),trimMat=new THREE.MeshStandardMaterial({color:0x08090b,metalness:.7,roughness:.3})
    const box=(w,h,d,mat,x,y,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d,4,2,2),mat);m.position.set(x,y,z);car.add(m);return m}
    box(4.9,.65,1.9,bodyMat,0,.73,0);box(2.0,.28,1.78,bodyMat,1.28,1.12,0);box(2.45,.82,1.58,glassMat,-.42,1.49,0);box(1.85,.13,1.52,bodyMat,-.48,1.94,0);box(.38,.45,1.78,bodyMat,2.5,.66,0);box(.38,.45,1.78,bodyMat,-2.5,.66,0)
    const wheelGroups=[];[[1.55,.55,.94],[1.55,.55,-.94],[-1.55,.55,.94],[-1.55,.55,-.94]].forEach(([x,y,z])=>{const g=new THREE.Group();g.position.set(x,y,z);const tire=new THREE.Mesh(new THREE.CylinderGeometry(.53,.53,.26,48),new THREE.MeshStandardMaterial({color:0x050506,roughness:.76}));tire.rotation.x=Math.PI/2;g.add(tire);const rimM=new THREE.Mesh(new THREE.CylinderGeometry(.39,.39,.275,40),new THREE.MeshStandardMaterial({color:0x12151a,roughness:.28,metalness:.92}));rimM.rotation.x=Math.PI/2;g.add(rimM);const cal=new THREE.Mesh(new THREE.BoxGeometry(.18,.34,.08),new THREE.MeshStandardMaterial({color:0xe32727,metalness:.4,roughness:.3}));cal.position.set(.19,0,z>0?.17:-.17);g.add(cal);for(let i=0;i<10;i++){const sp=new THREE.Mesh(new THREE.BoxGeometry(.055,.58,.045),trimMat);sp.position.z=z>0?.145:-.145;sp.rotation.z=i*Math.PI/5;g.add(sp)}car.add(g);wheelGroups.push({g,cal})})
    const wing=new THREE.Group();const blade=new THREE.Mesh(new THREE.BoxGeometry(1.65,.09,.46),trimMat);blade.rotation.z=-.08;blade.position.set(-2.12,1.72,0);wing.add(blade);[-.55,.55].forEach(z=>{const p=new THREE.Mesh(new THREE.BoxGeometry(.09,.54,.08),trimMat);p.position.set(-2.03,1.42,z);wing.add(p)});car.add(wing)
    const diffuser=box(.5,.2,1.72,trimMat,-2.53,.37,0)
    threeState={THREE,renderer,camera,controls,car,wheelGroups,wing,diffuser,mount}
    const ro=new ResizeObserver(()=>{camera.aspect=mount.clientWidth/Math.max(mount.clientHeight,1);camera.updateProjectionMatrix();renderer.setSize(mount.clientWidth,mount.clientHeight)});ro.observe(mount);threeState.ro=ro
    const loop=()=>{controls.update();renderer.render(scene,camera);threeState.raf=requestAnimationFrame(loop)};loop();updateThree()
  }catch(err){mount.innerHTML='<div style="padding:28px;color:#aab0b9">3D engine could not load. Photo Twin remains fully usable.</div>';console.error(err)}
}
function updateThree(){if(!threeState)return;const s=selected(),scale=s.wheels.diameter===20?1.1:s.wheels.diameter===19?1.055:1;threeState.wheelGroups.forEach(({g,cal})=>{g.scale.setScalar(scale);cal.material.color.set(s.brakes.color)});threeState.car.position.y=-Math.min(s.stance.drop,45)/220;threeState.wing.visible=s.aero.wing;threeState.diffuser.visible=s.aero.diffuser}

$$('#modeTabs button').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));$$('#viewTabs button').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)))
$$('input[data-photo]').forEach(inp=>inp.addEventListener('change',e=>{const f=e.target.files?.[0];if(!f)return;const k=inp.dataset.photo;if(photos[k])URL.revokeObjectURL(photos[k]);photos[k]=URL.createObjectURL(f);if(k===view)renderStage()}))
$('#buildName').addEventListener('input',renderStage)
$('#compareBtn').addEventListener('click',()=>{compare=!compare;$('#compareBtn').textContent=compare?'Exit compare':'Compare current';renderStage()})
$('#moreBtn').addEventListener('click',()=>{showMore=!showMore;$('#moreBtn').textContent=showMore?'Less':'More';renderSpec()})
$('#resetBtn').addEventListener('click',()=>{build={...defaultBuild};save();renderOptions();renderSpec();renderStage()})
$('#exportBtn').addEventListener('click',()=>{const payload={name:$('#buildName').value||'Pearson Spec',vehicle:'2016 Mazda6 GS Sedan',build,selected:selected(),exportedAt:new Date().toISOString()};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=(payload.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')||'mazda6-build')+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)})

renderCategories();renderOptions();renderPipeline();renderStage();setMode('photo')
