const categories = [
  ['wheels','Wheels'], ['stance','Stance'], ['aero','Aero'], ['brakes','Brakes'], ['badging','Badging'], ['glass','Glass'], ['graphics','Graphics']
]

const options = {
  wheels: [
    { id:'stock17', label:'Factory 17', meta:'225/55R17', diameter:17, width:7.5, offset:50, price:0 },
    { id:'black19', label:'19″ Multi-Spoke', meta:'19×8.5 · ET42', diameter:19, width:8.5, offset:42, price:980 },
    { id:'black20', label:'20″ Forged Multi-Spoke', meta:'20×8.5 · ET42', diameter:20, width:8.5, offset:42, price:992 }
  ],
  stance: [
    { id:'stock', label:'Factory', meta:'OEM ride height', drop:0, price:0 },
    { id:'mild', label:'Street', meta:'≈ 25 mm drop', drop:25, price:420 },
    { id:'low', label:'Low', meta:'≈ 40 mm drop', drop:40, price:780 }
  ],
  aero: [
    { id:'clean', label:'Clean Rear', meta:'No wing / OEM bumper', wing:false, diffuser:false, price:0 },
    { id:'wing', label:'Aggressive Wing', meta:'Black · raised deck wing', wing:true, diffuser:false, price:0 },
    { id:'full', label:'Wing + Diffuser', meta:'Planned final aero package', wing:true, diffuser:true, price:0 }
  ],
  brakes: [
    { id:'red', label:'Red', meta:'Current', color:'#e32727', price:0 },
    { id:'gold', label:'Gold', meta:'Future accent', color:'#d7a62f', price:120 },
    { id:'black', label:'Black', meta:'Stealth', color:'#111214', price:120 }
  ],
  badging: [
    { id:'mazda', label:'Mazda', meta:'Factory trunk emblem', pearson:false, price:0 },
    { id:'pearson-black', label:'PEARSON Stealth', meta:'1B faceted · smoked', pearson:true, badge:'#25272b', price:55 },
    { id:'pearson-gold', label:'PEARSON Gold', meta:'Faceted metallic gold', pearson:true, badge:'#b9913f', price:65 }
  ],
  glass: [
    { id:'current', label:'Current Tint', meta:'As photographed', tint:.2, price:0 },
    { id:'dark', label:'Dark', meta:'Deeper side glass', tint:.42, price:0 },
    { id:'limo', label:'Very Dark', meta:'Show build only', tint:.62, price:0 }
  ],
  graphics: [
    { id:'none', label:'No Graphics', meta:'Clean body', graphic:false, price:0 },
    { id:'ghost', label:'Satin Ghost', meta:'Subtle fender treatment', graphic:true, price:140 }
  ]
}

const defaultBuild = { wheels:'black20', stance:'stock', aero:'full', brakes:'red', badging:'pearson-black', glass:'current', graphics:'none' }
const pipeline = [
  ['20″ forged wheels','researching'], ['Rear diffuser','ordered'], ['Aggressive wing','planned'], ['PEARSON trunk emblem','prototype'], ['Red calipers','installed']
]

const $ = (s) => document.querySelector(s)
const $$ = (s) => [...document.querySelectorAll(s)]
const money = new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0})

let build = (() => { try { return JSON.parse(localStorage.getItem('mazda6-build')) || {...defaultBuild} } catch { return {...defaultBuild} } })()
let category = 'wheels', mode = '3d', view = 'side', compare = false, showMore = false
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
  if(compare || !photos[view]) return ''
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

async function inflateModelBytes(base64){
  const compressed=Uint8Array.from(atob(base64),c=>c.charCodeAt(0))
  if('DecompressionStream' in window){
    const stream=new Blob([compressed]).stream().pipeThrough(new DecompressionStream('deflate'))
    return new Uint8Array(await new Response(stream).arrayBuffer())
  }
  const {inflate}=await import('https://cdn.jsdelivr.net/npm/pako@2.1.0/+esm')
  return inflate(compressed)
}

function materialForCompactPart(THREE,name){
  const materials={
    paint:new THREE.MeshPhysicalMaterial({color:0x030405,metalness:.78,roughness:.17,clearcoat:1,clearcoatRoughness:.07}),
    chrome:new THREE.MeshStandardMaterial({color:0x30343a,metalness:.96,roughness:.18}),
    plastic:new THREE.MeshStandardMaterial({color:0x090b0e,metalness:.12,roughness:.58}),
    glass:new THREE.MeshPhysicalMaterial({color:0x061019,metalness:.18,roughness:.08,transparent:true,opacity:.58,depthWrite:false}),
    brake:new THREE.MeshStandardMaterial({color:0xb70f18,emissive:0x5e0006,emissiveIntensity:.9,metalness:.25,roughness:.34}),
    position:new THREE.MeshStandardMaterial({color:0x8d0710,emissive:0x530008,emissiveIntensity:.65,metalness:.15,roughness:.35}),
    reverse:new THREE.MeshStandardMaterial({color:0xdce9ee,emissive:0x4a5558,emissiveIntensity:.35,metalness:.05,roughness:.25}),
    bottom:new THREE.MeshStandardMaterial({color:0x07080a,metalness:.08,roughness:.78}),
    plate:new THREE.MeshStandardMaterial({color:0x16191e,metalness:.08,roughness:.5})
  }
  return materials[name]||materials.plastic
}

async function decodeCompactGeometry(THREE,part){
  const raw=await inflateModelBytes(part.data)
  const q=new Int16Array(raw.buffer,raw.byteOffset,part.qbytes/2)
  const positions=new Float32Array(part.v*3)
  for(let i=0;i<positions.length;i++) positions[i]=q[i]/part.scale
  const indexBytes=raw.slice(part.qbytes,part.qbytes+part.ibytes)
  const indices=part.i==='u32'
    ? new Uint32Array(indexBytes.buffer,indexBytes.byteOffset,indexBytes.byteLength/4)
    : new Uint16Array(indexBytes.buffer,indexBytes.byteOffset,indexBytes.byteLength/2)
  const geom=new THREE.BufferGeometry()
  geom.setAttribute('position',new THREE.BufferAttribute(positions,3))
  geom.setIndex(new THREE.BufferAttribute(indices,1))
  geom.computeVertexNormals()
  geom.computeBoundingBox()
  geom.computeBoundingSphere()
  return geom
}

async function loadCompactMazda(THREE){
  const response=await fetch('./models/mazda6-compact.json',{cache:'force-cache'})
  if(!response.ok) throw new Error('Compact Mazda6 asset missing')
  const data=await response.json()
  const group=new THREE.Group()
  const order=['bottom','plastic','paint','chrome','glass','brake','position','reverse','plate']
  for(const name of order){
    const part=data[name]
    if(!part) continue
    const geom=await decodeCompactGeometry(THREE,part)
    const mesh=new THREE.Mesh(geom,materialForCompactPart(THREE,name))
    mesh.name='mazda6_'+name
    mesh.castShadow=name!=='glass'
    mesh.receiveShadow=true
    mesh.renderOrder=name==='glass'?3:1
    group.add(mesh)
  }
  const box=new THREE.Box3().setFromObject(group)
  const center=box.getCenter(new THREE.Vector3())
  group.position.x-=center.x
  group.position.z-=center.z
  group.position.y-=box.min.y
  return group
}

function makeProxyCar(THREE,parent){
  const car=new THREE.Group();parent.add(car)
  const bodyMat=new THREE.MeshPhysicalMaterial({color:0x050607,metalness:.78,roughness:.16,clearcoat:1,clearcoatRoughness:.08})
  const glassMat=new THREE.MeshPhysicalMaterial({color:0x0b1720,metalness:.25,roughness:.13,transparent:true,opacity:.82})
  const box=(w,h,d,mat,x,y,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d,4,2,2),mat);m.position.set(x,y,z);car.add(m);return m}
  box(4.9,.65,1.9,bodyMat,0,.73,0)
  box(2.0,.28,1.78,bodyMat,1.28,1.12,0)
  box(2.45,.82,1.58,glassMat,-.42,1.49,0)
  box(1.85,.13,1.52,bodyMat,-.48,1.94,0)
  box(.38,.45,1.78,bodyMat,2.5,.66,0)
  box(.38,.45,1.78,bodyMat,-2.5,.66,0)
  return car
}

function createWheel(THREE,x,z){
  const root=new THREE.Group()
  root.position.set(x,.343,z)
  const tireMat=new THREE.MeshStandardMaterial({color:0x050506,roughness:.82,metalness:.02})
  const rimMat=new THREE.MeshStandardMaterial({color:0x0d1014,roughness:.22,metalness:.96})
  const rotorMat=new THREE.MeshStandardMaterial({color:0x777d84,roughness:.35,metalness:.88})
  const tire=new THREE.Mesh(new THREE.TorusGeometry(.286,.054,18,64),tireMat)
  const rotor=new THREE.Mesh(new THREE.CylinderGeometry(.205,.205,.025,64),rotorMat);rotor.rotation.x=Math.PI/2
  const rim=new THREE.Mesh(new THREE.CylinderGeometry(.252,.252,.15,64),rimMat);rim.rotation.x=Math.PI/2
  const spokes=new THREE.Group()
  for(let i=0;i<10;i++){
    const a=i*Math.PI/5
    const spoke=new THREE.Mesh(new THREE.BoxGeometry(.045,.43,.035),rimMat)
    spoke.rotation.z=a
    spokes.add(spoke)
  }
  const hub=new THREE.Mesh(new THREE.CylinderGeometry(.055,.055,.17,32),rimMat);hub.rotation.x=Math.PI/2
  const cal=new THREE.Mesh(new THREE.BoxGeometry(.105,.25,.055),new THREE.MeshStandardMaterial({color:0xe32727,metalness:.4,roughness:.3}))
  cal.position.set(.19,.02,z>0?.11:-.11)
  root.add(tire,rotor,rim,spokes,hub,cal)
  return {root,tire,rim,spokes,hub,cal}
}

function makeConfigParts(THREE,bodyRoot,wheelRoot){
  const trimMat=new THREE.MeshStandardMaterial({color:0x060708,metalness:.78,roughness:.25})
  const wheelGroups=[
    createWheel(THREE,1.384,-.779),
    createWheel(THREE,1.384,.779),
    createWheel(THREE,-1.387,-.779),
    createWheel(THREE,-1.387,.779)
  ]
  wheelGroups.forEach(w=>wheelRoot.add(w.root))
  const wing=new THREE.Group()
  const blade=new THREE.Mesh(new THREE.BoxGeometry(.42,.065,1.62),trimMat);blade.rotation.z=-.035;blade.position.set(-2.02,1.49,0);wing.add(blade)
  ;[-.56,.56].forEach(z=>{const p=new THREE.Mesh(new THREE.BoxGeometry(.075,.38,.075),trimMat);p.position.set(-1.98,1.29,z);wing.add(p)})
  bodyRoot.add(wing)
  const diffuser=new THREE.Group()
  const tray=new THREE.Mesh(new THREE.BoxGeometry(.34,.12,1.68),trimMat);tray.position.set(-2.28,.24,0);diffuser.add(tray)
  for(const z of [-.62,-.37,-.12,.12,.37,.62]){
    const fin=new THREE.Mesh(new THREE.BoxGeometry(.34,.18,.028),trimMat);fin.position.set(-2.27,.19,z);diffuser.add(fin)
  }
  bodyRoot.add(diffuser)
  return {wheelGroups,wing,diffuser}
}

function setWheelSpec(THREE,wheel,diameter){
  const outer=.3395
  const rimR=diameter*.0254/2
  const major=(outer+rimR)/2
  const tube=(outer-rimR)/2
  wheel.tire.geometry.dispose()
  wheel.tire.geometry=new THREE.TorusGeometry(major,tube,18,72)
  wheel.rim.geometry.dispose()
  wheel.rim.geometry=new THREE.CylinderGeometry(rimR*.985,rimR*.985,.15,64)
  wheel.rim.rotation.x=Math.PI/2
  const spokeScale=rimR/.254
  wheel.spokes.scale.set(spokeScale,spokeScale,1)
  wheel.hub.scale.set(spokeScale,spokeScale,1)
}

async function initThree(){
  if(threeState) return
  const mount=$('#threeCanvas')
  const labelStrong=document.querySelector('.three-label strong')
  const labelText=document.querySelector('.three-label span')
  labelStrong.textContent='Loading Mazda6…'
  labelText.textContent='Preparing the real car geometry from your attached 2015 Mazda6 model.'
  mount.innerHTML=''

  try{
    // Keep the viewer deliberately simple and robust: one dependency only.
    // No OrbitControls, no GLTFLoader, no chained CDN modules.
    const THREE=await import('https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js')

    const scene=new THREE.Scene()
    scene.background=new THREE.Color('#090b0e')

    const camera=new THREE.PerspectiveCamera(31,mount.clientWidth/Math.max(mount.clientHeight,1),.1,100)
    const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'})
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2))
    renderer.setSize(mount.clientWidth,mount.clientHeight)
    renderer.outputColorSpace=THREE.SRGBColorSpace
    renderer.toneMapping=THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure=1.12
    renderer.shadowMap.enabled=true
    renderer.shadowMap.type=THREE.PCFSoftShadowMap
    renderer.domElement.style.width='100%'
    renderer.domElement.style.height='100%'
    renderer.domElement.style.display='block'
    renderer.domElement.style.touchAction='none'
    mount.append(renderer.domElement)

    scene.add(new THREE.HemisphereLight(0xe4ecff,0x101217,2.8))
    const key=new THREE.DirectionalLight(0xffffff,4.6)
    key.position.set(4.5,7,4.5)
    key.castShadow=true
    scene.add(key)
    const fill=new THREE.DirectionalLight(0x9bb6ff,1.9)
    fill.position.set(-5,2.5,5)
    scene.add(fill)
    const rim=new THREE.DirectionalLight(0x5577ff,2.1)
    rim.position.set(-4,3,-5)
    scene.add(rim)

    const floor=new THREE.Mesh(
      new THREE.CircleGeometry(8.5,96),
      new THREE.MeshStandardMaterial({color:0x101217,roughness:.92,metalness:.05})
    )
    floor.rotation.x=-Math.PI/2
    floor.position.y=-.015
    floor.receiveShadow=true
    scene.add(floor)

    const vehicleRoot=new THREE.Group()
    scene.add(vehicleRoot)
    const bodyRoot=new THREE.Group()
    vehicleRoot.add(bodyRoot)
    const wheelRoot=new THREE.Group()
    vehicleRoot.add(wheelRoot)

    let carModel=null
    let source='compact'
    try{
      carModel=await loadCompactMazda(THREE)
      bodyRoot.add(carModel)
    }catch(modelErr){
      console.error('Real Mazda6 geometry failed to load:',modelErr)
      carModel=makeProxyCar(THREE,bodyRoot)
      source='proxy'
    }

    const {wheelGroups,wing,diffuser}=makeConfigParts(THREE,bodyRoot,wheelRoot)

    // Lightweight built-in orbit camera. This avoids another CDN dependency.
    const target=new THREE.Vector3(0,.72,0)
    let yaw=.72
    let pitch=.24
    let distance=7.25
    let dragging=false
    let lastX=0,lastY=0

    const updateCamera=()=>{
      const cp=Math.cos(pitch)
      camera.position.set(
        target.x + distance*cp*Math.cos(yaw),
        target.y + distance*Math.sin(pitch),
        target.z + distance*cp*Math.sin(yaw)
      )
      camera.lookAt(target)
    }
    const resetCamera=()=>{yaw=.72;pitch=.24;distance=7.25;updateCamera()}
    resetCamera()

    const canvas=renderer.domElement
    canvas.addEventListener('pointerdown',e=>{
      dragging=true
      lastX=e.clientX
      lastY=e.clientY
      canvas.setPointerCapture?.(e.pointerId)
    })
    canvas.addEventListener('pointermove',e=>{
      if(!dragging)return
      const dx=e.clientX-lastX,dy=e.clientY-lastY
      lastX=e.clientX
      lastY=e.clientY
      yaw-=dx*.007
      pitch=Math.max(-.08,Math.min(.78,pitch+dy*.0055))
      updateCamera()
    })
    const stopDrag=e=>{
      dragging=false
      if(e?.pointerId!==undefined) canvas.releasePointerCapture?.(e.pointerId)
    }
    canvas.addEventListener('pointerup',stopDrag)
    canvas.addEventListener('pointercancel',stopDrag)
    canvas.addEventListener('wheel',e=>{
      e.preventDefault()
      distance=Math.max(4.4,Math.min(12.5,distance+e.deltaY*.006))
      updateCamera()
    },{passive:false})
    canvas.addEventListener('dblclick',resetCamera)

    if(source==='compact'){
      labelStrong.textContent='2015 Mazda6 digital base'
      labelText.textContent='Real geometry from your attached model · drag to rotate · scroll to zoom · double-click to reset.'
    }else{
      labelStrong.textContent='Mazda6 fallback'
      labelText.textContent='The real model asset failed to decode, so the emergency proxy is showing.'
    }

    threeState={THREE,renderer,camera,vehicleRoot,bodyRoot,wheelRoot,carModel,wheelGroups,wing,diffuser,mount,source,updateCamera,resetCamera}

    const ro=new ResizeObserver(()=>{
      const w=Math.max(mount.clientWidth,1)
      const h=Math.max(mount.clientHeight,1)
      camera.aspect=w/h
      camera.updateProjectionMatrix()
      renderer.setSize(w,h,false)
    })
    ro.observe(mount)
    threeState.ro=ro

    const loop=()=>{
      renderer.render(scene,camera)
      threeState.raf=requestAnimationFrame(loop)
    }
    loop()
    updateThree()
  }catch(err){
    console.error('3D viewer failed:',err)
    labelStrong.textContent='3D viewer error'
    labelText.textContent='The car model is in the repo, but the browser could not start WebGL.'
    mount.innerHTML='<div style="padding:72px 28px;text-align:center;color:#c8cdd5;font:600 14px system-ui">Could not start the 3D viewer.<br><span style="font-weight:400;color:#777f8b">Refresh once. If this remains, the browser is blocking WebGL or the Three.js CDN.</span></div>'
  }
}

function updateThree(){
  if(!threeState)return
  const s=selected()
  threeState.wheelGroups.forEach(w=>{
    setWheelSpec(threeState.THREE,w,s.wheels.diameter)
    w.cal.material.color.set(s.brakes.color)
  })
  threeState.bodyRoot.position.y=-Math.min(s.stance.drop,45)/1000
  threeState.wing.visible=s.aero.wing
  threeState.diffuser.visible=s.aero.diffuser
}

$$('#modeTabs button').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));$$('#viewTabs button').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)))
$$('input[data-photo]').forEach(inp=>inp.addEventListener('change',e=>{const f=e.target.files?.[0];if(!f)return;const k=inp.dataset.photo;if(photos[k])URL.revokeObjectURL(photos[k]);photos[k]=URL.createObjectURL(f);if(k===view)renderStage()}))
$('#buildName').addEventListener('input',renderStage)
$('#compareBtn').addEventListener('click',()=>{compare=!compare;$('#compareBtn').textContent=compare?'Exit compare':'Compare current';renderStage()})
$('#moreBtn').addEventListener('click',()=>{showMore=!showMore;$('#moreBtn').textContent=showMore?'Less':'More';renderSpec()})
$('#resetBtn').addEventListener('click',()=>{build={...defaultBuild};save();renderOptions();renderSpec();renderStage()})
$('#exportBtn').addEventListener('click',()=>{const payload={name:$('#buildName').value||'Pearson Spec',vehicle:'2016 Mazda6 GS Sedan',build,selected:selected(),exportedAt:new Date().toISOString()};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=(payload.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')||'mazda6-build')+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)})

renderCategories();renderOptions();renderPipeline();renderStage();setMode('3d')
