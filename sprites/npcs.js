// ═══ NPC SPRITES ═══
// Chibi-style NPC characters. Same proportions as the player sprite.
// To redesign NPCs, replace this file. The function signature must stay the same:
//   makeNPCSprite(rc, ac, hood) -> HTMLCanvasElement (20x20)
//
// rc:   robe/clothing primary color (hex string)
// ac:   accent/secondary color (hex string)
// hood: true = hooded head (uses rc color), false = bare hair with ear features
//
// Depends on: C (color constants), createSprite() from config.js

function makeNPCSprite(rc,ac,hood=false){const W=20,H=20,s=new Array(W*H).fill(0),p=(x,y,c)=>{if(x>=0&&x<W&&y>=0&&y<H)s[y*W+x]=c};const hD='#6b2a1a',hM='#8b3a2a',ear='#1a1a2a',eW='#f0f4ff',eP='#1a1a2a',eH='#ffffff',mth='#c47070',blush='#d4968a';if(hood){p(6,0,rc);p(13,0,rc);p(6,1,rc);p(13,1,rc);for(let x=7;x<=12;x++)p(x,1,rc);for(let x=6;x<=13;x++)p(x,2,rc);for(let x=5;x<=14;x++)p(x,3,rc);p(5,4,rc);p(6,4,rc);for(let x=7;x<=12;x++)p(x,4,C.skin);p(13,4,rc);p(14,4,rc)}else{p(6,0,ear);p(13,0,ear);p(6,1,ear);p(13,1,ear);for(let x=7;x<=12;x++)p(x,1,hD);for(let x=6;x<=13;x++)p(x,2,hM);for(let x=5;x<=14;x++)p(x,3,hM);p(5,4,hD);p(6,4,hD);for(let x=7;x<=12;x++)p(x,4,C.skin);p(13,4,hD);p(14,4,hD)}p(5,5,hood?rc:hD);p(6,5,C.skin);p(7,5,eH);p(8,5,eW);p(9,5,C.skin);p(10,5,C.skin);p(11,5,eW);p(12,5,eH);p(13,5,C.skin);p(14,5,hood?rc:hD);p(5,6,hood?rc:hD);p(6,6,blush);for(let x=7;x<=12;x++)p(x,6,C.skin);p(13,6,blush);p(14,6,hood?rc:hD);for(let x=6;x<=13;x++)p(x,7,C.skin);p(9,7,mth);p(10,7,mth);for(let x=7;x<=12;x++)p(x,8,C.skin);p(9,9,C.skinS);p(10,9,C.skinS);for(let y=10;y<=12;y++){p(7,y,rc);p(8,y,ac);p(9,y,ac);p(10,y,ac);p(11,y,ac);p(12,y,rc)}p(6,11,C.skin);p(13,11,C.skin);p(6,12,C.skin);p(13,12,C.skin);p(7,13,rc);p(8,13,ac);p(9,13,ac);p(10,13,ac);p(11,13,ac);p(12,13,rc);[8,9,10,11].forEach(x=>{p(x,14,rc);p(x,15,rc)});[8,9,10,11].forEach(x=>{p(x,16,C.leatherD);p(x,17,C.leatherD)});return createSprite(s,W,H)}
