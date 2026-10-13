
// Pearson Garage - interchangeable 3D upgrade components for the GJ Mazda6.
// These are parametric visual approximations of the supplied reference parts,
// not scanned manufacturing CAD or validated physical fitment.
const PI=Math.PI;

function mat(THREE,color,metalness=.25,roughness=.38){
  return new THREE.MeshStandardMaterial({color,metalness,roughness,side:THREE.DoubleSide});
}
function addMesh(THREE,parent,geometry,material,x=0,y=0,z=0,name=''){
  const mesh=new THREE.Mesh(geometry,material);
  mesh.position.set(x,y,z);
  mesh.castShadow=true;
  mesh.receiveShadow=true;
  mesh.name=name;
  parent.add(mesh);
  return mesh;
}
function disposeChildren(group){
  group.traverse(o=>{ if(o.isMesh) o.geometry.dispose(); });
  group.clear();
}
function disc(THREE,outer,depth,material,parent,x,y,z,axis='z'){
  const mesh=addMesh(THREE,parent,new THREE.CylinderGeometry(outer,outer,depth,72),material,x,y,z);
  if(axis==='z')mesh.rotation.x=PI/2;
  if(axis==='x')mesh.rotation.z=PI/2;
  return mesh;
}
function ring(THREE,major,tube,material,parent,z,name=''){
  return addMesh(THREE,parent,new THREE.TorusGeometry(major,tube,10,88),material,0,0,z,name);
}
function shapePlate(THREE,parent,points,depth,material,z,name=''){
  const shape=new THREE.Shape();
  points.forEach((p,i)=>i?shape.lineTo(p[0],p[1]):shape.moveTo(p[0],p[1]));
  shape.closePath();
  return addMesh(THREE,parent,new THREE.ExtrudeGeometry(shape,{
    depth,bevelEnabled:false,curveSegments:12
  }),material,0,0,z,name);
}

const wheelCenters=[
  {x:1.384,z:-.786},{x:1.384,z:.786},
  {x:-1.387,z:-.786},{x:-1.387,z:.786}
];

function createWheel(THREE,x,z){
  const root=new THREE.Group();
  root.position.set(x,.341,z);
  root.name='wheel-module';
  const visual=new THREE.Group();
  root.add(visual);
  return {root,visual,side:Math.sign(z),lastId:null,caliperMaterial:null};
}

function rebuildWheel(THREE,wheel,spec){
  if(wheel.lastId===spec.id)return;
  disposeChildren(wheel.visual);
  const group=wheel.visual,side=wheel.side;
  const rimR=spec.diameter*.0254/2;
  const outer=.3395;
  const tire=mat(THREE,0x101114,.03,.86);
  const sidewall=mat(THREE,0x151719,.02,.84);
  const gunmetal=mat(THREE,spec.diameter===17?0x232a31:0x444950,.77,.27);
  const edges=mat(THREE,0x7b8087,.86,.19);
  const dark=mat(THREE,0x181c23,.7,.35);
  const rotor=mat(THREE,0x72777e,.73,.37);
  const holes=mat(THREE,0x20242a,.15,.62);
  const bolts=mat(THREE,0xaaaaae,.9,.26);
  const red=mat(THREE,0xc81b24,.25,.28);
  wheel.caliperMaterial=red;

  // Tread is a hollow cylinder. The two sidewalls leave an OPEN metal rim;
  // the former solid wheel disk completely concealed the spokes and brakes.
  const tread=addMesh(THREE,group,
    new THREE.CylinderGeometry(outer,outer,.221,88,1,true),tire,0,0,0,'tire-tread');
  tread.rotation.x=PI/2;
  ring(THREE,(outer+rimR)/2,(outer-rimR)/2,sidewall,group,.111,'outer-sidewall');
  ring(THREE,(outer+rimR)/2,(outer-rimR)/2,sidewall,group,-.111,'inner-sidewall');

  // Open alloy barrel, highlighted bead lip, visible rotor behind spokes.
  const barrel=addMesh(THREE,group,
    new THREE.CylinderGeometry(rimR*.97,rimR*.97,.23,84,1,true),
    dark,0,0,0,'open-alloy-barrel');
  barrel.rotation.x=PI/2;
  const faceZ=side*.139,rotorZ=side*.081;
  ring(THREE,rimR*.975,.010,edges,group,faceZ,'machined-rim-lip');
  ring(THREE,rimR*.89,.009,gunmetal,group,faceZ-side*.012,'outer-rim-ring');

  disc(THREE,Math.min(.193,rimR*.78),.018,rotor,group,0,0,rotorZ);
  ring(THREE,Math.min(.184,rimR*.72),.006,edges,group,rotorZ+side*.012,'rotor-edge');

  // Real drilled rotor apertures become visible through the open spokes.
  for(let i=0;i<24;i++){
    const a=(i/24)*2*PI,rr=.15;
    const hole=addMesh(THREE,group,new THREE.CircleGeometry(.006,8),holes,
      rr*Math.sin(a),rr*Math.cos(a),rotorZ+side*.014,'rotor-drill');
    if(side<0)hole.rotation.y=PI;
  }

  const cal=shapePlate(THREE,group,[
    [.116,-.075],[.169,-.088],[.218,-.047],[.225,.025],
    [.204,.094],[.153,.115],[.113,.076]
  ],.045,red,rotorZ+side*.016,'brake-caliper');
  // Position behind the spokes without protruding outside the tyre face.
  if(side<0)cal.position.z=rotorZ-side*.038;
  const calHighlight=addMesh(THREE,group,new THREE.BoxGeometry(.045,.009,.004),
    mat(THREE,0xf15c60,.3,.28),.171,.028,side*.128,'caliper-highlight');

  // 10 paired split-spokes = 20 visibly open forged spokes, not a dark disk.
  const count=spec.diameter===17?5:10;
  for(let i=0;i<count;i++){
    const base=i*2*PI/count;
    const offsets=count===5?[0]:[-.056,.056];
    for(const shift of offsets){
      const a=base+shift,inner=rimR*.265,outerSpoke=rimR*.883;
      const widthIn=count===5?.025:.010,widthOut=count===5?.019:.009;
      const tangent=[-Math.sin(a),Math.cos(a)];
      const radial=[Math.cos(a),Math.sin(a)];
      const v=(r,w)=>[
        radial[0]*r+tangent[0]*w,
        radial[1]*r+tangent[1]*w
      ];
      shapePlate(THREE,group,[
        v(inner,-widthIn),v(outerSpoke,-widthOut),
        v(outerSpoke,widthOut),v(inner,widthIn)
      ],.018,gunmetal,faceZ-side*.007,'forged-split-spoke');
    }
  }
  disc(THREE,rimR*.245,.026,gunmetal,group,0,0,faceZ,'center-hub');
  disc(THREE,rimR*.145,.030,dark,group,0,0,faceZ+side*.015,'center-cap');
  ring(THREE,rimR*.12,.004,edges,group,faceZ+side*.031,'center-cap-ring');
  for(let i=0;i<5;i++){
    const a=i*PI*2/5;
    addMesh(THREE,group,new THREE.SphereGeometry(.0075,8,8),bolts,
      rimR*.19*Math.sin(a),rimR*.19*Math.cos(a),faceZ+side*.024,'lug-nut');
  }
  wheel.lastId=spec.id;
}

function bladeSurface(THREE,span,chord,height,rearX,style,material){
  const section=24,depth=6,vertices=[],indices=[];
  const half=span/2;
  for(let side=0;side<2;side++){
    for(let i=0;i<=section;i++){
      const z=-half+span*i/section,normalized=z/half;
      for(let j=0;j<=depth;j++){
        const t=j/depth;
        const bowed=style==='curved'?.055*(1-normalized*normalized):.025*(1-normalized*normalized);
        const upsweep=style==='curved'?.024*Math.abs(normalized):.010*Math.abs(normalized);
        const x=rearX+(t-.52)*chord-.045*(normalized*normalized);
        const y=height+bowed+upsweep+.018*(t-.5)-.017*Math.pow(t-.48,2)+(side===0?.012:-.012);
        vertices.push(x,y,z);
      }
    }
  }
  const row=depth+1,sectionSize=(section+1)*row;
  for(let layer=0;layer<2;layer++){
    for(let i=0;i<section;i++){
      for(let j=0;j<depth;j++){
        const a=layer*sectionSize+i*row+j,b=a+row;
        if(layer===0)indices.push(a,b,a+1,b,b+1,a+1);
        else indices.push(a,a+1,b,b,a+1,b+1);
      }
    }
  }
  // Front/rear chord edges and lateral end caps.
  for(let i=0;i<section;i++){
    for(const j of [0,depth]){
      const a=i*row+j,b=(i+1)*row+j;
      indices.push(a,a+sectionSize,b,b,a+sectionSize,b+sectionSize);
    }
  }
  for(let j=0;j<depth;j++){
    for(const i of [0,section]){
      const a=i*row+j,b=a+1;
      indices.push(a,b,a+sectionSize,b,b+sectionSize,a+sectionSize);
    }
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return new THREE.Mesh(geo,material);
}
function curvedStrut(THREE,group,points,r,material,name){
  const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
  return addMesh(THREE,group,new THREE.TubeGeometry(curve,22,r,7,false),material,0,0,0,name);
}
function buildWing(THREE,type){
  const wing=new THREE.Group();
  wing.name='interchangeable-rear-wing';
  const carbon=mat(THREE,0x161a20,.45,.27);
  const bracket=mat(THREE,0x373c44,.66,.29);
  const bolt=mat(THREE,0x9ca2a9,.85,.23);
  const gt=type==='gt';
  const span=gt?1.50:1.42,half=span/2;
  const h=gt?1.37:1.245;
  const x=gt?-2.075:-2.045;
  wing.add(bladeSurface(THREE,span,gt?.32:.245,h,x,type,carbon));
  const legOffset=gt?.48:.385;
  for(const z of [-legOffset,legOffset]){
    const leg=gt?[
      [-1.88,1.015,z],[-1.92,1.08,z],[-2.035,1.23,z],[-2.075,h-.03,z]
    ]:[
      [-1.9,1.01,z],[-1.93,1.11,z],[-2.04,h-.025,z]
    ];
    curvedStrut(THREE,wing,leg,gt?.025:.019,bracket,'wing-mount-upright');
    addMesh(THREE,wing,new THREE.BoxGeometry(.13,.025,.09),bracket,-1.88,1.015,z,'wing-deck-foot');
    for(const dx of [-.035,.034])
      addMesh(THREE,wing,new THREE.SphereGeometry(.009,10,8),bolt,
        -1.88+dx,1.038,z,'wing-fastener');
  }
  for(const side of [-1,1]){
    const z=side*(half-.012);
    const xStart=x-(gt?.18:.145),xEnd=x+(gt?.17:.13);
    shapePlate(THREE,wing,[
      [xStart,h-.078],[xStart-.015,h+.063],
      [xStart+.095,h+.083],[xEnd,h+.032],
      [xEnd+.045,h-.062]
    ],.024,carbon,z-side*.011,'wing-endplate');
  }
  if(gt){
    // Short trailing aero lip inspired by the double-tier wing reference.
    wing.add(bladeSurface(THREE,span*.92,.075,h+.096,x+.096,'curved',carbon));
  }
  return wing;
}
function buildDiffuser(THREE,variant){
  const group=new THREE.Group();
  group.name='integrated-rear-diffuser';
  const carbon=mat(THREE,0x181c23,.32,.42);
  const black=mat(THREE,0x0b0e12,.23,.46);
  const edge=mat(THREE,0x5e6369,.55,.32);
  const mesh=mat(THREE,0x252a30,.25,.58);
  const width=variant==='street'?1.46:1.59;
  const centerX=-2.32;
  // The panel tucks UNDER the bumper; no large box protruding behind it.
  const tray=addMesh(THREE,group,new THREE.BoxGeometry(.205,.038,width),carbon,
    centerX,.18,0,'diffuser-undertray');
  tray.rotation.z=-.11;
  const outer=addMesh(THREE,group,new THREE.BoxGeometry(.042,.155,width),black,
    -2.418,.215,0,'diffuser-bumper-valance');
  for(const z of [-.62,-.4,-.18,.18,.4,.62]){
    if(Math.abs(z)>=width/2-.05)continue;
    const fin=shapePlate(THREE,group,[
      [-2.225,.257],[-2.363,.265],[-2.436,.214],
      [-2.451,.085],[-2.305,.089],[-2.236,.131]
    ],.021,carbon,z,'diffuser-vertical-fin');
    fin.rotation.z=0;
  }
  for(const z of [-width/2+.032,width/2-.032]){
    shapePlate(THREE,group,[
      [-2.25,.22],[-2.407,.24],[-2.462,.103],[-2.30,.105]
    ],.025,carbon,z,'diffuser-outer-vane');
  }
  const face=addMesh(THREE,group,new THREE.BoxGeometry(.018,.075,width*.64),
    mesh,-2.44,.251,0,'diffuser-recessed-mesh');
  // Twin exhaust exits are cylinders along X, naturally placed in the rear valance.
  for(const z of [-.645,.645]){
    const exhaust=addMesh(THREE,group,new THREE.CylinderGeometry(.071,.071,.09,32),
      edge,-2.45,.212,z,'twin-exhaust');
    exhaust.rotation.z=PI/2;
    const inner=addMesh(THREE,group,new THREE.CylinderGeometry(.052,.052,.092,32),
      black,-2.45,.212,z,'exhaust-interior');
    inner.rotation.z=PI/2;
  }
  return group;
}
export function createGarageParts(THREE,bodyRoot,wheelRoot){
  const wheelGroups=wheelCenters.map(({x,z})=>createWheel(THREE,x,z));
  wheelGroups.forEach(w=>wheelRoot.add(w.root));
  const wings={
    gt:buildWing(THREE,'gt'),
    curved:buildWing(THREE,'curved')
  };
  for(const wing of Object.values(wings))bodyRoot.add(wing);
  const diffusers={
    fin:buildDiffuser(THREE,'sport'),
    street:buildDiffuser(THREE,'street')
  };
  for(const diffuser of Object.values(diffusers))bodyRoot.add(diffuser);
  return {wheelGroups,wings,diffusers};
}
export function applyGarageParts(THREE,parts,s){
  for(const wheel of parts.wheelGroups){
    rebuildWheel(THREE,wheel,s.wheels);
    if(wheel.caliperMaterial)wheel.caliperMaterial.color.set(s.brakes.color);
  }
  for(const [type,wing] of Object.entries(parts.wings)){
    wing.visible=s.wing.id===type;
  }
  for(const [type,diffuser] of Object.entries(parts.diffusers)){
    diffuser.visible=s.diffuser.id===type;
  }
}
