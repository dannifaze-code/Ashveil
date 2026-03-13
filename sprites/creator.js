// ═══ CHARACTER CREATOR ═══
// Composites layered PNG sprite sheets into playable character sprites.
// Sprite sheets are 72×128 (3 frames × 4 directions, each frame 24×32).
// Directions in sheet: 0=up, 1=right, 2=down, 3=left.
//
// Depends on: nothing (standalone module loaded before init.js)

/* ── Available character options ── */
const SKIN_COLORS = ['light','light_brown','light_black','ash','brown','dark_ash','black'];
const SKIN_LABELS = {light:'Fair',light_brown:'Tan',light_black:'Dusk',ash:'Ash',brown:'Bronze',dark_ash:'Shadow',black:'Obsidian'};

const EYE_COLORS = ['blue','brown','amber','green','azure','baby_blue','amethyst','violet','scarlet','auburn','ginger','aqua','black','apple_green','bottle_green','canary_yellow','dark_turquoise','french_rose','heliotrope','dark_slate_blue','boysenberry','bittersweet','cadet_blue','ball_blue','bazaar'];
const EYE_LABELS = {blue:'Blue',brown:'Brown',amber:'Amber',green:'Green',azure:'Azure',baby_blue:'Sky',amethyst:'Amethyst',violet:'Violet',scarlet:'Scarlet',auburn:'Auburn',ginger:'Ginger',aqua:'Aqua',black:'Black',apple_green:'Apple',bottle_green:'Forest',canary_yellow:'Gold',dark_turquoise:'Teal',french_rose:'Rose',heliotrope:'Helio',dark_slate_blue:'Indigo',boysenberry:'Berry',bittersweet:'Coral',cadet_blue:'Cadet',ball_blue:'Ice',bazaar:'Bazaar'};

const MOUTH_OPTIONS = ['001','002','003','004'];
const BODY_TYPES = ['normal','heavy'];
const BODY_LABELS = {normal:'Normal',heavy:'Heavy'};
const RACE_LABELS = {human:'Human',elf:'Elf'};
const GENDER_LABELS = {m:'Male',f:'Female'};

/* ── Default appearance ── */
function defaultAppearance(){return{race:'human',gender:'m',skin:'ash',eyes:'blue',bodyType:'normal',mouth:'001'}}

/* ── Availability map: which skin colors exist for each race+gender+bodyType ── */
const SKIN_AVAILABILITY={
  'human-m-normal':['ash','black','brown','dark_ash'],
  'human-m-heavy':['ash','black'],
  'human-f-normal':['dark_ash','light_black','light_brown'],
  'human-f-heavy':['ash','black','brown','dark_ash','light','light_black','light_brown'],
  'elf-m-normal':['ash','black','brown','dark_ash','light','light_black','light_brown'],
  'elf-m-heavy':['ash','black','brown','dark_ash','light','light_brown'],
  'elf-f-normal':['ash','black','brown','dark_ash','light_black','light_brown'],
  'elf-f-heavy':['ash','black','brown','dark_ash','light','light_black','light_brown']
};
function getAvailableSkins(race,gender,bodyType){
  return SKIN_AVAILABILITY[race+'-'+gender+'-'+bodyType]||SKIN_COLORS;
}

/* ── Image cache ── */
const _imgCache={};
function loadImg(src){
  if(_imgCache[src])return _imgCache[src];
  const p=new Promise(r=>{const img=new Image();img.onload=()=>r(img);img.onerror=()=>r(null);img.src=src});
  _imgCache[src]=p;return p;
}

/* ── Build layer paths for a character appearance ── */
function getCharacterLayers(a){
  const layers=[];
  const hvy=a.bodyType==='heavy'?'heavy-':'';
  if(a.race==='elf'){
    layers.push('sprites/character/elf-'+a.gender+'-'+hvy+a.skin+'.png');
  }else{
    layers.push('sprites/character/base-'+a.gender+'-'+hvy+a.skin+'.png');
  }
  layers.push('sprites/character/head-'+hvy+a.skin+'.png');
  if(a.race==='elf'){
    layers.push('sprites/character/ears_long-'+a.skin+'.png');
  }else{
    layers.push('sprites/character/ears-'+a.skin+'.png');
  }
  layers.push('sprites/character/eyes-'+a.eyes+'.png');
  layers.push('sprites/character/body-'+a.gender+'-'+hvy+a.skin+'.png');
  return layers;
}

/* ── Composite all layers into a single 72×128 sprite sheet canvas ── */
async function compositeCharacter(appearance){
  const paths=getCharacterLayers(appearance);
  const cv=document.createElement('canvas');cv.width=72;cv.height=128;
  const cx=cv.getContext('2d');
  for(const src of paths){
    const img=await loadImg(src);
    if(img)cx.drawImage(img,0,0);
  }
  return cv;
}

/* ── Extract a single 24×32 frame from a 72×128 sheet ── */
function extractFrame(sheet,dir,frame){
  const cv=document.createElement('canvas');cv.width=24;cv.height=32;
  cv.getContext('2d').drawImage(sheet,frame*24,dir*32,24,32,0,0,24,32);
  return cv;
}

/* ── Build the walk/idle sprite object used by the game ──
     Returns {walk:{down:[],up:[],right:[]}, idle:{down:[],up:[],right:[]}} */
async function buildCharacterSprites(appearance){
  const sheet=await compositeCharacter(appearance);
  // Sheet dirs: 0=up,1=right,2=down,3=left
  // Game dirs stored: down, up, right (left = flipped right at render)
  // Walk: 4 frames mapped from 3 sheet frames: 0,1,2,1
  // Idle: 2 frames (standing frame repeated)
  return{
    walk:{
      down:[0,1,2,1].map(f=>extractFrame(sheet,2,f)),
      up:  [0,1,2,1].map(f=>extractFrame(sheet,0,f)),
      right:[0,1,2,1].map(f=>extractFrame(sheet,1,f))
    },
    idle:{
      down:[extractFrame(sheet,2,1),extractFrame(sheet,2,1)],
      up:  [extractFrame(sheet,0,1),extractFrame(sheet,0,1)],
      right:[extractFrame(sheet,1,1),extractFrame(sheet,1,1)]
    }
  };
}

/* ── Build a static NPC sprite (single down-facing frame) ── */
async function buildNPCSprite(appearance){
  const sheet=await compositeCharacter(appearance);
  return extractFrame(sheet,2,1);
}

/* ── Build a face portrait canvas from the composed character ──
     Extracts and scales up the head region from the front-facing frame */
async function buildFacePortrait(appearance,size){
  size=size||48;
  const sheet=await compositeCharacter(appearance);
  const cv=document.createElement('canvas');cv.width=size;cv.height=size;
  const cx=cv.getContext('2d');
  cx.imageSmoothingEnabled=false;
  // Head region in front-facing frame: roughly rows 4-18, cols 5-18 (14×14 area)
  cx.drawImage(sheet,5,68,14,14,2,2,size-4,size-4);
  return cv;
}

/* ── NPC appearance presets ── */
const NPC_APPEARANCES={
  elder:      {race:'human',gender:'m',skin:'ash',      eyes:'amber',       bodyType:'normal',mouth:'001'},
  quartermaster:{race:'human',gender:'m',skin:'ash',    eyes:'brown',       bodyType:'heavy', mouth:'002'},
  herbalist:  {race:'elf',  gender:'f',skin:'light_brown',eyes:'apple_green',bodyType:'normal',mouth:'003'},
  smuggler:   {race:'human',gender:'m',skin:'dark_ash', eyes:'black',       bodyType:'normal',mouth:'001'},
  bountyMaster:{race:'human',gender:'m',skin:'black',   eyes:'scarlet',     bodyType:'heavy', mouth:'002'},
  scholarLynn:{race:'elf',  gender:'f',skin:'light_brown',eyes:'amethyst',    bodyType:'normal',mouth:'004'},
  commanderVoss:{race:'human',gender:'m',skin:'black',  eyes:'azure',       bodyType:'heavy', mouth:'001'}
};

/* ── Preview: render a character preview onto a target canvas ── */
async function renderCharacterPreview(canvas,appearance){
  const sheet=await compositeCharacter(appearance);
  const cx=canvas.getContext('2d');
  cx.clearRect(0,0,canvas.width,canvas.height);
  cx.imageSmoothingEnabled=false;
  // Draw front-facing standing frame centered and scaled up
  const frame=extractFrame(sheet,2,1);
  const scale=Math.min(Math.floor(canvas.width/24),Math.floor(canvas.height/32));
  const w=24*scale,h=32*scale;
  const ox=(canvas.width-w)/2,oy=(canvas.height-h)/2;
  cx.drawImage(frame,0,0,24,32,ox,oy,w,h);

  // Draw walk cycle preview below (small, 3 frames)
  const smallScale=Math.max(2,Math.floor(scale*0.4));
  const sw=24*smallScale,sh=32*smallScale;
  const startX=(canvas.width-(sw*3+8))/2;
  const startY=oy+h+8;
  if(startY+sh<=canvas.height){
    for(let i=0;i<3;i++){
      const wf=extractFrame(sheet,2,i);
      cx.drawImage(wf,0,0,24,32,startX+i*(sw+4),startY,sw,sh);
    }
  }
}
