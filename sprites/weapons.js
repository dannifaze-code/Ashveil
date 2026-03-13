// ═══ WEAPON & EQUIPMENT VISUALS ═══
// Weapon swing properties and equipment color definitions.
// To add new weapons or equipment, add entries to the objects below.
//
// weaponVisuals: defines how each weapon looks and animates during attacks
//   color:     blade color
//   glow:      optional glow overlay color (null for none)
//   particles: particle effect color on swing
//   swing:     swing duration in seconds
//   arc:       swing arc in degrees
//   trail:     trail color during swing animation
//   name:      animation style name
//
// equipColors: defines armor/equipment tint colors
//   body/accent: for body armor, helmets, boots
//   glow:        for rings (pulsing aura)

const weaponVisuals={
woodblade:{color:'#a0804a',glow:null,particles:'#8a6a3a',swing:0.35,arc:120,trail:'#a0804a',name:'slash'},
ironblade:{color:'#cccccc',glow:null,particles:'#aaaaaa',swing:0.3,arc:130,trail:'#cccccc',name:'slash'},
veilEdge:{color:'#9b8afb',glow:'#7b68ee',particles:'#b8a8ff',swing:0.28,arc:140,trail:'#9b8afb',name:'veil'},
ashfangBlade:{color:'#ff9f1a',glow:'#ff6b35',particles:'#ffcc44',swing:0.25,arc:150,trail:'#ff6b35',name:'fire'},
wraithTouch:{color:'#b088ee',glow:'#8060cc',particles:'#d0b8ff',swing:0.3,arc:120,trail:'#b088ee',name:'phase'},
relicBlade:{color:'#f5c842',glow:'#c8a020',particles:'#ffe066',swing:0.22,arc:160,trail:'#f5c842',name:'relic'},
voidreaper:{color:'#5020aa',glow:'#8844dd',particles:'#6633bb',swing:0.2,arc:180,trail:'#8844dd',name:'void'}
};

const equipColors={
wanderercoat:{body:'#8a6a3a',accent:'#a0804a'},marshwraps:{body:'#3a7a3a',accent:'#4a9a4a'},veilcloak:{body:'#7b68ee',accent:'#9b8afb'},drakemail:{body:'#cc4a1a',accent:'#ff6b35'},relicArmor:{body:'#c8a020',accent:'#f5c842'},
leatherHood:{body:'#8a6a3a',accent:'#a0804a'},ironHelm:{body:'#aaaaaa',accent:'#cccccc'},veilCrown:{body:'#7b68ee',accent:'#9b8afb'},drakeVisage:{body:'#cc4a1a',accent:'#ff6b35'},relicHelm:{body:'#c8a020',accent:'#f5c842'},
wandererBoots:{body:'#8a6a3a',accent:'#a0804a'},marshTreads:{body:'#3a7a3a',accent:'#4a9a4a'},veilStriders:{body:'#7b68ee',accent:'#9b8afb'},drakeGreaves:{body:'#cc4a1a',accent:'#ff6b35'},relicSabatons:{body:'#c8a020',accent:'#f5c842'},
boneRing:{glow:'#c4a86e'},emberBand:{glow:'#ff6b35'},voidLoop:{glow:'#8844dd'},ashenCirclet:{glow:'#f5c842'}
};

// ═══ ARM DRAWING SYSTEM ═══
// 2-segment IK arm used by humanoid enemies (bandits, dungeon guardians).
// Not used by player or NPCs (they use integrated sprite arm stubs instead).
function drawArm2J(ctx,sx,sy,hx,hy,l1,l2,thick,color,eBend,gripA){
var dx=hx-sx,dy=hy-sy,dist=Math.sqrt(dx*dx+dy*dy),maxR=l1+l2;
if(dist>maxR*0.95){var f=maxR*0.95/dist;hx=sx+dx*f;hy=sy+dy*f;dx=hx-sx;dy=hy-sy;dist=maxR*0.95}
if(dist<Math.abs(l1-l2)*1.1+1)dist=Math.abs(l1-l2)*1.1+1;
var cosA=Math.max(-1,Math.min(1,(l1*l1+dist*dist-l2*l2)/(2*l1*dist)));
var angSH=Math.atan2(dy,dx);
var elbA=angSH+(eBend||1)*Math.acos(cosA);
var ex=sx+Math.cos(elbA)*l1,ey=sy+Math.sin(elbA)*l1;
ctx.strokeStyle=color;ctx.lineCap='round';
ctx.lineWidth=thick;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(ex,ey);ctx.stroke();
ctx.lineWidth=thick*0.78;ctx.beginPath();ctx.moveTo(ex,ey);ctx.lineTo(hx,hy);ctx.stroke();
ctx.fillStyle=color;ctx.beginPath();ctx.arc(ex,ey,thick*0.35,0,Math.PI*2);ctx.fill();
if(gripA!==undefined){ctx.save();ctx.translate(hx,hy);ctx.rotate(gripA);
ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(0,0,thick*0.55,thick*0.35,0,0,Math.PI*2);ctx.fill();ctx.restore()}
else{ctx.fillStyle=color;ctx.beginPath();ctx.arc(hx,hy,thick*0.42,0,Math.PI*2);ctx.fill()}}
