export const categories = [
  ['wheels','Wheels'], ['stance','Stance'], ['aero','Aero'], ['brakes','Brakes'], ['badging','Badging'], ['glass','Glass'], ['graphics','Graphics']
]

export const options = {
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

export const defaultBuild = { wheels:'black20', stance:'stock', aero:'full', brakes:'red', badging:'pearson-black', glass:'current', graphics:'none' }
export const pipeline = [
  ['20″ forged wheels','researching'], ['Rear diffuser','ordered'], ['Aggressive wing','planned'], ['PEARSON trunk emblem','prototype'], ['Red calipers','installed']
]
