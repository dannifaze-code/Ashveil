// ═══ EQUIPMENT OVERLAY DRAWING ═══
// Draws opaque, pixel-art-style equipment overlays aligned to the character sprite.
// Each piece is drawn as a detailed shape with outlines, shading, and accent detail,
// replacing the previous semi-transparent rectangle system.
//
// Functions are called during rendering with the player's screen position,
// scale, bob offset, direction, and equipment color data.
//
// Depends on: equipColors, weaponVisuals from weapons.js

/* ── Color helpers ── */
function darkenHex(hex,factor){
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  const f=Math.max(0,1-factor);
  return '#'+[r,g,b].map(c=>Math.max(0,Math.round(c*f)).toString(16).padStart(2,'0')).join('');
}
function lightenHex(hex,factor){
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return '#'+[r,g,b].map(c=>Math.min(255,Math.round(c+(255-c)*factor)).toString(16).padStart(2,'0')).join('');
}

/* ── Socket / Bone System ──
   Defines per-frame attachment offsets (in sc units) for each body part.
   Equipment positions update every frame via: Player.Position + Socket_Offset.
   This ensures gear moves naturally with walk/idle animations instead of floating. */
const playerSockets={
  idle:[
    {head:{x:0,y:0},chest:{x:0,y:0},hand:{x:0,y:0},feet:{x:0,y:0}},
    {head:{x:0,y:0.008},chest:{x:0,y:0.005},hand:{x:0,y:0.005},feet:{x:0,y:0}}
  ],
  walk:[
    {head:{x:0,y:0},chest:{x:0,y:0},hand:{x:0,y:0},feet:{x:0,y:0}},
    {head:{x:0,y:-0.015},chest:{x:0,y:-0.01},hand:{x:0,y:-0.008},feet:{x:0,y:0}},
    {head:{x:0,y:0},chest:{x:0,y:0},hand:{x:0,y:0},feet:{x:0,y:0}},
    {head:{x:0,y:-0.015},chest:{x:0,y:-0.01},hand:{x:0,y:-0.008},feet:{x:0,y:0}}
  ]
};
function getSocketOffset(socket,sc,frame,isWalk){
  const anim=isWalk?playerSockets.walk:playerSockets.idle;
  const s=anim[frame%anim.length][socket];
  if(!s) return{x:0,y:0};
  return{x:s.x*sc,y:s.y*sc};
}

/* ── Body Armor ──
   Draws chest plate with shoulder pauldrons, center seam, and belt.
   Renders differently for each direction: front (down), back (up), side (right).
   Left-facing is handled by ctx.scale(-1,1) via the flip parameter.
   Uses chest socket offset per animation frame. */
function drawEquipArmor(ctx,px,py,sc,bob,dir,flip,colors,frame,isWalk){
  const bc=colors.body,ac=colors.accent;
  const dk=darkenHex(bc,0.35),lt=lightenHex(bc,0.25);
  ctx.save();
  if(flip){ctx.translate(px,0);ctx.scale(-1,1);px=0}

  const sock=getSocketOffset('chest',sc,frame||0,!!isWalk);
  px+=sock.x;
  const isSide=dir==='right';
  const isBack=dir==='up';

  // Direction-dependent plate dimensions: side view is narrower
  const bw=isSide?sc*0.34:sc*0.48;
  const bh=sc*0.42;
  const bx=isSide?px-sc*0.14:px-sc*0.24;
  const by=py-sc*0.16+bob+sock.y;

  // Outline
  ctx.fillStyle=dk;
  ctx.fillRect(bx-1,by-1,bw+2,bh+2);
  // Main plate
  ctx.fillStyle=bc;
  ctx.fillRect(bx,by,bw,bh);

  // Shoulder pauldrons
  const sW=sc*0.09,sH=sc*0.13;
  if(isSide){
    // Side view: only the front-facing shoulder pauldron is visible
    ctx.fillStyle=dk;
    ctx.fillRect(bx+bw-1,by+sc*0.01-1,sW+2,sH+2);
    ctx.fillStyle=ac;
    ctx.fillRect(bx+bw,by+sc*0.01,sW,sH);
    ctx.fillStyle=lt;
    ctx.fillRect(bx+bw+sc*0.04,by+sc*0.04,sc*0.025,sc*0.025);
  } else {
    // Front/back: both shoulder pauldrons visible
    ctx.fillStyle=dk;
    ctx.fillRect(bx-sW-1,by+sc*0.01-1,sW+2,sH+2);
    ctx.fillRect(bx+bw-1,by+sc*0.01-1,sW+2,sH+2);
    ctx.fillStyle=ac;
    ctx.fillRect(bx-sW,by+sc*0.01,sW,sH);
    ctx.fillRect(bx+bw,by+sc*0.01,sW,sH);
    ctx.fillStyle=lt;
    ctx.fillRect(bx-sW+sc*0.02,by+sc*0.04,sc*0.025,sc*0.025);
    ctx.fillRect(bx+bw+sc*0.04,by+sc*0.04,sc*0.025,sc*0.025);
  }

  // Detail lines differ per direction
  if(isBack){
    // Back plate spine ridge
    ctx.fillStyle=dk;
    ctx.fillRect(px-sc*0.015,by+sc*0.06,sc*0.03,bh-sc*0.15);
  } else if(isSide){
    // Side edge seam
    ctx.fillStyle=ac;
    ctx.fillRect(bx+bw*0.15,by+sc*0.04,sc*0.03,bh-sc*0.12);
  } else {
    // Front center seam
    ctx.fillStyle=ac;
    ctx.fillRect(px-sc*0.02,by+sc*0.04,sc*0.04,bh-sc*0.12);
  }

  // Belt
  ctx.fillStyle=dk;
  ctx.fillRect(bx-sc*0.01,by+bh-sc*0.055,bw+sc*0.02,sc*0.055);
  ctx.fillStyle=ac;
  ctx.fillRect(bx,by+bh-sc*0.045,bw,sc*0.035);
  // Belt buckle (front only)
  if(!isBack&&!isSide){
    ctx.fillStyle=lt;
    ctx.fillRect(px-sc*0.02,by+bh-sc*0.055,sc*0.04,sc*0.055);
  }

  // Highlight strip — position shifts with viewing angle
  ctx.fillStyle=lt;
  ctx.globalAlpha=0.25;
  if(isSide){
    ctx.fillRect(bx+bw*0.55,by+sc*0.02,bw*0.25,bh*0.35);
  } else if(isBack){
    ctx.fillRect(bx+bw*0.65,by+sc*0.02,bw*0.25,bh*0.35);
  } else {
    ctx.fillRect(bx+sc*0.02,by+sc*0.02,bw*0.25,bh*0.35);
  }
  ctx.globalAlpha=1;

  ctx.restore();
}

/* ── Helmet ──
   Draws dome helmet with visor band and cheek guards.
   Renders differently for each direction: front (down), back (up), side (right).
   Left-facing is handled by ctx.scale(-1,1) via the flip parameter.
   Uses head socket offset per animation frame. */
function drawEquipHelm(ctx,px,py,sc,bob,dir,flip,colors,frame,isWalk){
  const bc=colors.body,ac=colors.accent;
  const dk=darkenHex(bc,0.35),lt=lightenHex(bc,0.25);
  ctx.save();
  if(flip){ctx.translate(px,0);ctx.scale(-1,1);px=0}

  const sock=getSocketOffset('head',sc,frame||0,!!isWalk);
  const hx=px+sock.x,hy=py-sc*0.58+bob+sock.y;
  const hr=sc*0.20;
  const isSide=dir==='right';
  const isBack=dir==='up';

  if(isSide){
    // ── Side-view helmet: narrower dome, visor from side, one cheek guard ──
    const shr=hr*0.85;
    const cx=hx+sc*0.02;
    // Dome outline
    ctx.fillStyle=dk;
    ctx.beginPath();ctx.arc(cx,hy+hr*0.3,shr+1.5,Math.PI,0);ctx.fill();
    ctx.fillRect(cx-shr-1.5,hy+hr*0.3,shr*2+3,sc*0.12);
    // Dome body
    ctx.fillStyle=bc;
    ctx.beginPath();ctx.arc(cx,hy+hr*0.3,shr,Math.PI,0);ctx.fill();
    ctx.fillRect(cx-shr,hy+hr*0.3,shr*2,sc*0.1);
    // Visor from side (narrower band)
    ctx.fillStyle=ac;
    ctx.fillRect(cx-shr,hy+hr*0.3+sc*0.02,shr*2,sc*0.04);
    // Single cheek guard (front-facing side)
    ctx.fillStyle=dk;
    ctx.fillRect(cx+shr-sc*0.03,hy+hr*0.3+sc*0.04,sc*0.06,sc*0.1);
    // Side crest
    ctx.fillStyle=ac;
    ctx.fillRect(cx-sc*0.02,hy-hr*0.1,sc*0.04,hr*0.4);
    // Highlight
    ctx.fillStyle=lt;
    ctx.globalAlpha=0.3;
    ctx.beginPath();ctx.arc(cx+shr*0.2,hy+hr*0.05,hr*0.15,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=1;
  } else {
    // ── Front or back-view helmet ──
    // Dome outline
    ctx.fillStyle=dk;
    ctx.beginPath();ctx.arc(hx,hy+hr*0.3,hr+1.5,Math.PI,0);ctx.fill();
    ctx.fillRect(hx-hr-1.5,hy+hr*0.3,hr*2+3,sc*0.12);
    // Dome body
    ctx.fillStyle=bc;
    ctx.beginPath();ctx.arc(hx,hy+hr*0.3,hr,Math.PI,0);ctx.fill();
    ctx.fillRect(hx-hr,hy+hr*0.3,hr*2,sc*0.1);

    if(!isBack){
      // Visor band (front only)
      ctx.fillStyle=ac;
      ctx.fillRect(hx-hr,hy+hr*0.3+sc*0.02,hr*2,sc*0.04);
    }

    // Cheek guards
    ctx.fillStyle=dk;
    ctx.fillRect(hx-hr-sc*0.03,hy+hr*0.3+sc*0.04,sc*0.06,sc*0.1);
    ctx.fillRect(hx+hr-sc*0.03,hy+hr*0.3+sc*0.04,sc*0.06,sc*0.1);

    if(isBack){
      // Nape guard (back of helmet extending down)
      ctx.fillStyle=dk;
      ctx.fillRect(hx-sc*0.06,hy+hr*0.3+sc*0.08,sc*0.12,sc*0.06);
      ctx.fillStyle=bc;
      ctx.fillRect(hx-sc*0.05,hy+hr*0.3+sc*0.09,sc*0.10,sc*0.04);
    } else {
      // Top crest/ridge (front)
      ctx.fillStyle=ac;
      ctx.fillRect(hx-sc*0.02,hy-hr*0.1,sc*0.04,hr*0.4);
    }

    // Highlight — shifts to opposite side for back view
    ctx.fillStyle=lt;
    ctx.globalAlpha=0.3;
    if(isBack){
      ctx.beginPath();ctx.arc(hx+hr*0.3,hy+hr*0.05,hr*0.2,0,Math.PI*2);ctx.fill();
    } else {
      ctx.beginPath();ctx.arc(hx-hr*0.3,hy+hr*0.05,hr*0.2,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;
  }

  ctx.restore();
}

/* ── Boots ──
   Draws armored boots at foot positions.
   Front/back view shows boots side by side; side view stacks them front-to-back.
   Follows walk animation leg offsets.
   Uses feet socket offset per animation frame. */
function drawEquipBoots(ctx,px,py,sc,bob,dir,flip,colors,frame,isWalk){
  const bc=colors.body,ac=colors.accent;
  const dk=darkenHex(bc,0.35);
  ctx.save();
  if(flip){ctx.translate(px,0);ctx.scale(-1,1);px=0}

  const sock=getSocketOffset('feet',sc,frame||0,!!isWalk);
  px+=sock.x;
  // Walk leg offsets (matching player sprite leg animation)
  const lo=isWalk?[0,1,0,-1][frame%4]*sc*0.025:0;
  const ro=isWalk?[0,-1,0,1][frame%4]*sc*0.025:0;
  const bW=sc*0.15,bH=sc*0.13;
  const bY=py+sc*0.50+bob+sock.y;
  const isSide=dir==='right';

  if(isSide){
    // ── Side view: boots stacked front-to-back ──
    // Back boot (drawn first, partially hidden behind front boot)
    ctx.fillStyle=dk;
    ctx.fillRect(px-sc*0.06+ro-1,bY-1,bW+2,bH+2);
    ctx.fillStyle=bc;
    ctx.fillRect(px-sc*0.06+ro,bY,bW,bH);
    ctx.fillStyle=ac;
    ctx.fillRect(px-sc*0.06+ro,bY,bW,sc*0.03);
    ctx.fillStyle=dk;
    ctx.fillRect(px-sc*0.07+ro,bY+bH-sc*0.025,bW+sc*0.02,sc*0.025);

    // Front boot (drawn on top, slightly offset)
    ctx.fillStyle=dk;
    ctx.fillRect(px-sc*0.03+lo-1,bY-1,bW+2,bH+2);
    ctx.fillStyle=bc;
    ctx.fillRect(px-sc*0.03+lo,bY,bW,bH);
    ctx.fillStyle=ac;
    ctx.fillRect(px-sc*0.03+lo,bY,bW,sc*0.03);
    ctx.fillStyle=dk;
    ctx.fillRect(px-sc*0.04+lo,bY+bH-sc*0.025,bW+sc*0.02,sc*0.025);
  } else {
    // ── Front/back view: boots side by side ──
    // Left boot
    ctx.fillStyle=dk;
    ctx.fillRect(px-sc*0.21+lo-1,bY-1,bW+2,bH+2);
    ctx.fillStyle=bc;
    ctx.fillRect(px-sc*0.21+lo,bY,bW,bH);
    ctx.fillStyle=ac;
    ctx.fillRect(px-sc*0.21+lo,bY,bW,sc*0.03);
    ctx.fillStyle=dk;
    ctx.fillRect(px-sc*0.22+lo,bY+bH-sc*0.025,bW+sc*0.02,sc*0.025);

    // Right boot
    ctx.fillStyle=dk;
    ctx.fillRect(px+sc*0.06+ro-1,bY-1,bW+2,bH+2);
    ctx.fillStyle=bc;
    ctx.fillRect(px+sc*0.06+ro,bY,bW,bH);
    ctx.fillStyle=ac;
    ctx.fillRect(px+sc*0.06+ro,bY,bW,sc*0.03);
    ctx.fillStyle=dk;
    ctx.fillRect(px+sc*0.05+ro,bY+bH-sc*0.025,bW+sc*0.02,sc*0.025);
  }

  ctx.restore();
}

/* ── Leggings ──
   Draws leg armor panels between the belt and the boots.
   Front/back view shows two leg panels side by side; side view shows a single panel.
   Follows walk animation leg offsets (same as boots).
   Uses feet socket offset per animation frame.
   Left-facing is handled by ctx.scale(-1,1) via the flip parameter. */
function drawEquipLegs(ctx,px,py,sc,bob,dir,flip,colors,frame,isWalk){
  const bc=colors.body,ac=colors.accent;
  const dk=darkenHex(bc,0.35),lt=lightenHex(bc,0.25);
  ctx.save();
  if(flip){ctx.translate(px,0);ctx.scale(-1,1);px=0}

  const sock=getSocketOffset('feet',sc,frame||0,!!isWalk);
  px+=sock.x;
  // Walk leg offsets (matching player sprite leg animation)
  const lo=isWalk?[0,1,0,-1][frame%4]*sc*0.025:0;
  const ro=isWalk?[0,-1,0,1][frame%4]*sc*0.025:0;
  const isSide=dir==='right';
  const isBack=dir==='up';

  // Leggings sit between the belt and the boots
  const lY=py+sc*0.24+bob+sock.y;
  const lH=sc*0.28;

  if(isSide){
    // ── Side view: single leg panel (overlapping legs) ──
    const lW=sc*0.24;
    const lx=px-sc*0.10;
    // Back leg (drawn first, partially hidden)
    ctx.fillStyle=dk;
    ctx.fillRect(lx+ro-1,lY-1,lW+2,lH+2);
    ctx.fillStyle=bc;
    ctx.fillRect(lx+ro,lY,lW,lH);
    // Side seam
    ctx.fillStyle=ac;
    ctx.fillRect(lx+lW*0.3+ro,lY+sc*0.02,sc*0.025,lH-sc*0.06);
    // Front leg (drawn on top, slightly offset)
    ctx.fillStyle=dk;
    ctx.fillRect(lx+sc*0.03+lo-1,lY-1,lW+2,lH+2);
    ctx.fillStyle=bc;
    ctx.fillRect(lx+sc*0.03+lo,lY,lW,lH);
    // Side seam on front leg
    ctx.fillStyle=ac;
    ctx.fillRect(lx+sc*0.03+lW*0.3+lo,lY+sc*0.02,sc*0.025,lH-sc*0.06);
    // Knee guard accent
    ctx.fillStyle=ac;
    ctx.fillRect(lx+sc*0.03+lo,lY+lH*0.35,lW,sc*0.04);
    // Highlight
    ctx.fillStyle=lt;
    ctx.globalAlpha=0.2;
    ctx.fillRect(lx+sc*0.03+lW*0.55+lo,lY+sc*0.02,lW*0.25,lH*0.35);
    ctx.globalAlpha=1;
  } else {
    // ── Front/back view: two leg panels side by side ──
    const lW=sc*0.16;
    // Left leg panel
    const llx=px-sc*0.22;
    ctx.fillStyle=dk;
    ctx.fillRect(llx+lo-1,lY-1,lW+2,lH+2);
    ctx.fillStyle=bc;
    ctx.fillRect(llx+lo,lY,lW,lH);
    // Knee guard
    ctx.fillStyle=ac;
    ctx.fillRect(llx+lo,lY+lH*0.35,lW,sc*0.04);

    // Right leg panel
    const rlx=px+sc*0.06;
    ctx.fillStyle=dk;
    ctx.fillRect(rlx+ro-1,lY-1,lW+2,lH+2);
    ctx.fillStyle=bc;
    ctx.fillRect(rlx+ro,lY,lW,lH);
    // Knee guard
    ctx.fillStyle=ac;
    ctx.fillRect(rlx+ro,lY+lH*0.35,lW,sc*0.04);

    if(isBack){
      // Back detail: vertical seam on each leg
      ctx.fillStyle=dk;
      ctx.fillRect(llx+lW*0.45+lo,lY+sc*0.03,sc*0.02,lH-sc*0.08);
      ctx.fillRect(rlx+lW*0.45+ro,lY+sc*0.03,sc*0.02,lH-sc*0.08);
    } else {
      // Front detail: center seam on each leg
      ctx.fillStyle=ac;
      ctx.fillRect(llx+lW*0.4+lo,lY+sc*0.03,sc*0.025,lH-sc*0.08);
      ctx.fillRect(rlx+lW*0.4+ro,lY+sc*0.03,sc*0.025,lH-sc*0.08);
    }

    // Highlight
    ctx.fillStyle=lt;
    ctx.globalAlpha=0.2;
    if(isBack){
      ctx.fillRect(llx+lW*0.6+lo,lY+sc*0.02,lW*0.25,lH*0.35);
      ctx.fillRect(rlx+lW*0.6+ro,lY+sc*0.02,lW*0.25,lH*0.35);
    } else {
      ctx.fillRect(llx+sc*0.02+lo,lY+sc*0.02,lW*0.3,lH*0.35);
      ctx.fillRect(rlx+sc*0.02+ro,lY+sc*0.02,lW*0.3,lH*0.35);
    }
    ctx.globalAlpha=1;
  }

  ctx.restore();
}

/* ── Weapon Blade ──
   Draws a proper tapered sword blade with crossguard and hilt.
   Returns tip position for trail/particle effects.
   Uses hand socket offset per animation frame.
   The swing animation, trail, glow, and particles are handled by the caller. */
function drawEquipWeapon(ctx,px,py,sc,bob,flip,wv,swingTimer,time,frame,isWalk){
  const sock=getSocketOffset('hand',sc,frame||0,!!isWalk);
  const handAX=(flip?px-sc*0.28:px+sc*0.28)+(flip?-1:1)*sock.x;
  const handAY=py+sc*0.08+bob+sock.y;
  const dirSign=flip?-1:1;
  const restAng=flip?-Math.PI*0.25:Math.PI*0.25;
  let swAngle=restAng;
  if(swingTimer>0){
    const prog=1-swingTimer/(wv.swing||0.3);
    const swArc=(wv.arc||120)*Math.PI/180;
    swAngle=restAng+dirSign*(-swArc/2+swArc*prog);
  }

  const wLen=sc*0.55;
  const tipX=handAX+Math.cos(swAngle)*wLen;
  const tipY=handAY+Math.sin(swAngle)*wLen;
  const perpAng=swAngle+Math.PI/2;

  // Hilt
  const hiltLen=sc*0.1;
  const hiltX=handAX-Math.cos(swAngle)*hiltLen;
  const hiltY=handAY-Math.sin(swAngle)*hiltLen;
  // Grip wrap
  ctx.strokeStyle='#4a2a0a';ctx.lineWidth=4.5;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(hiltX,hiltY);ctx.lineTo(handAX,handAY);ctx.stroke();
  ctx.strokeStyle='#6a4a2a';ctx.lineWidth=2.5;
  ctx.beginPath();ctx.moveTo(hiltX,hiltY);ctx.lineTo(handAX,handAY);ctx.stroke();
  // Pommel
  ctx.fillStyle='#8899aa';
  ctx.beginPath();ctx.arc(hiltX,hiltY,2.5,0,Math.PI*2);ctx.fill();

  // Crossguard
  const guardLen=sc*0.06;
  const gx1=handAX+Math.cos(perpAng)*guardLen,gy1=handAY+Math.sin(perpAng)*guardLen;
  const gx2=handAX-Math.cos(perpAng)*guardLen,gy2=handAY-Math.sin(perpAng)*guardLen;
  ctx.strokeStyle='#667788';ctx.lineWidth=3.5;
  ctx.beginPath();ctx.moveTo(gx1,gy1);ctx.lineTo(gx2,gy2);ctx.stroke();
  ctx.fillStyle='#8899aa';
  ctx.beginPath();ctx.arc(gx1,gy1,2,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(gx2,gy2,2,0,Math.PI*2);ctx.fill();

  // Blade — tapered polygon
  const bw=sc*0.035,tw=sc*0.008;
  const bL={x:handAX+Math.cos(perpAng)*bw,y:handAY+Math.sin(perpAng)*bw};
  const bR={x:handAX-Math.cos(perpAng)*bw,y:handAY-Math.sin(perpAng)*bw};
  const tL={x:tipX+Math.cos(perpAng)*tw,y:tipY+Math.sin(perpAng)*tw};
  const tR={x:tipX-Math.cos(perpAng)*tw,y:tipY-Math.sin(perpAng)*tw};
  const tipPt={x:tipX+Math.cos(swAngle)*sc*0.015,y:tipY+Math.sin(swAngle)*sc*0.015};

  // Blade outline
  const bladeOutline=darkenHex(wv.color,0.35);
  ctx.fillStyle=bladeOutline;
  ctx.beginPath();
  ctx.moveTo(bL.x-Math.cos(perpAng)*0.8,bL.y-Math.sin(perpAng)*0.8);
  ctx.lineTo(tL.x,tL.y);ctx.lineTo(tipPt.x,tipPt.y);ctx.lineTo(tR.x,tR.y);
  ctx.lineTo(bR.x+Math.cos(perpAng)*0.8,bR.y+Math.sin(perpAng)*0.8);
  ctx.closePath();ctx.fill();
  // Blade fill
  ctx.fillStyle=wv.color;
  ctx.beginPath();
  ctx.moveTo(bL.x,bL.y);ctx.lineTo(tL.x,tL.y);ctx.lineTo(tipPt.x,tipPt.y);
  ctx.lineTo(tR.x,tR.y);ctx.lineTo(bR.x,bR.y);
  ctx.closePath();ctx.fill();
  // Center highlight
  ctx.strokeStyle=lightenHex(wv.color,0.35);
  ctx.lineWidth=1;ctx.globalAlpha=0.5;
  ctx.beginPath();ctx.moveTo(handAX,handAY);ctx.lineTo(tipX,tipY);ctx.stroke();
  ctx.globalAlpha=1;

  // Glow
  if(wv.glow){
    ctx.strokeStyle=wv.glow;ctx.lineWidth=6;
    ctx.globalAlpha=0.25+Math.sin(time*4)*0.1;
    ctx.beginPath();ctx.moveTo(handAX,handAY);ctx.lineTo(tipX,tipY);ctx.stroke();
    ctx.globalAlpha=1;
  }

  // Return data for trail/particles
  return{tipX,tipY,handAX,handAY,wLen,swAngle,restAng,dirSign};
}
