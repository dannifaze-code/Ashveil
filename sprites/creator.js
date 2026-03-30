// ═══ CHARACTER CREATOR ═══
// Uses preloaded PNG sprite sheets from assets/characters/ via GameAssets.
// New sprite sheets are 1024×1024 with an 8×8 grid of 48×48-pixel cells.
// Layout: rows 0-1=up(back), 2-3=side idle, 4-5=down(front), 6-7=side walk.
// Falls back to legacy layer compositing from sprites/character/ if no asset found.
//
// Depends on: GameAssets (sprites/assets.js) loaded before init.js

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

/* ═══════════════════════════════════════════════════════════
   NEW SPRITE SHEET SYSTEM — uses assets/characters/ via GameAssets
   Sheet format: 1024×1024 PNG, 8×8 grid of 48×48 cells.
   Row layout (each row = 1 direction / state):
     Row 0: Up (back) idle       — 8 frames
     Row 1: Up (back) walk       — 8 frames
     Row 2: Side idle            — 8 frames
     Row 3: Side idle alt        — 8 frames
     Row 4: Down (front) walk    — 4 frames (cols 0-3)
     Row 5: Down (front) walk alt— 4 frames (cols 0-3)
     Row 6: Side walk            — 4 frames (cols 0-3)
     Row 7: Side walk alt        — 4 frames (cols 0-3)
   ═══════════════════════════════════════════════════════════ */

const SHEET_CELL = 48; // pixels per cell in the new sprite sheets

/* ── Map character appearance → GameAssets character key ── */
const CHAR_ASSET_MAP = {
  // human male: skin → asset key
  'human-m-light':       'human_male_european',
  'human-m-ash':         'human_male_european',
  'human-m-light_brown': 'human_male_asian',
  'human-m-light_black': 'body_2',
  'human-m-brown':       'human_male_african',
  'human-m-dark_ash':    'human_male_african',
  'human-m-black':       'human_male_african',
  // human female: skin → asset key
  'human-f-light':       'human_female_european',
  'human-f-ash':         'human_female_european',
  'human-f-light_brown': 'human_female_european',
  'human-f-light_black': 'human_female_african',
  'human-f-brown':       'human_female_african',
  'human-f-dark_ash':    'human_female_african',
  'human-f-black':       'human_female_african',
  // elf male: use body_1 / body_2 variants
  'elf-m-light':         'human_male_european',
  'elf-m-ash':           'human_male_asian',
  'elf-m-light_brown':   'human_male_asian',
  'elf-m-light_black':   'body_2',
  'elf-m-brown':         'body_2',
  'elf-m-dark_ash':      'human_male_african',
  'elf-m-black':         'human_male_african',
  // elf female: reuse human female variants
  'elf-f-light':         'human_female_european',
  'elf-f-ash':           'human_female_european',
  'elf-f-light_brown':   'human_female_european',
  'elf-f-light_black':   'human_female_african',
  'elf-f-brown':         'human_female_african',
  'elf-f-dark_ash':      'human_female_african',
  'elf-f-black':         'human_female_african'
};

/* ── Resolve appearance to a loaded GameAssets image (or null) ── */
function resolveCharSheet(appearance){
  if(typeof GameAssets==='undefined') return null;
  const key = appearance.race+'-'+appearance.gender+'-'+appearance.skin;
  const assetKey = CHAR_ASSET_MAP[key];
  if(!assetKey) return null;
  return GameAssets.get('char.'+assetKey);
}

/* ── Extract a single frame from a 48×48-grid sheet ──
     Crops the content area (22×27 starting at cell-relative 13,5) and scales
     to 24×32 so it matches the legacy frame size the renderer expects. */
function extractNewFrame(sheet,row,col){
  const cv=document.createElement('canvas');cv.width=24;cv.height=32;
  const cx=cv.getContext('2d');
  cx.imageSmoothingEnabled=false;
  const sx=col*SHEET_CELL+13, sy=row*SHEET_CELL+5;
  cx.drawImage(sheet,sx,sy,22,27,0,0,24,32);
  return cv;
}

/* ── Build walk/idle sprites from new sheet ──
     Returns {walk:{down:[],up:[],right:[]}, idle:{down:[],up:[],right:[]}} */
function buildSpritesFromNewSheet(sheet){
  // Walk: 4-frame cycle [0,1,2,1] from sheet rows
  // Down (front) = row 4, Up (back) = row 0, Side = row 6
  // Idle: 2 frames from standing rows
  // Down idle = row 4, Up idle = row 0, Side idle = row 2
  return{
    walk:{
      down: [0,1,2,1].map(f=>extractNewFrame(sheet,4,f)),
      up:   [0,1,2,1].map(f=>extractNewFrame(sheet,0,f)),
      right:[0,1,2,1].map(f=>extractNewFrame(sheet,6,f))
    },
    idle:{
      down: [extractNewFrame(sheet,4,0),extractNewFrame(sheet,4,1)],
      up:   [extractNewFrame(sheet,0,0),extractNewFrame(sheet,0,1)],
      right:[extractNewFrame(sheet,2,0),extractNewFrame(sheet,2,1)]
    }
  };
}

/* ── Build a static NPC sprite from new sheet (front-facing standing) ── */
function buildNPCSpriteFromNewSheet(sheet){
  return extractNewFrame(sheet,4,0);
}

/* ── Build a face portrait from new sheet ── */
function buildFaceFromNewSheet(sheet,size){
  size=size||48;
  const cv=document.createElement('canvas');cv.width=size;cv.height=size;
  const cx=cv.getContext('2d');
  cx.imageSmoothingEnabled=false;
  // Head region from front-facing frame (row 4, col 0): ~12×12 pixels at cell-relative (18,8)
  cx.drawImage(sheet,0*SHEET_CELL+18,4*SHEET_CELL+8,12,12,2,2,size-4,size-4);
  return cv;
}

/* ═══════════════════════════════════════════════════════════
   LEGACY FALLBACK — layer compositing from sprites/character/
   Used only when the new asset for a given appearance is unavailable.
   ═══════════════════════════════════════════════════════════ */

const _imgCache={};
function loadImg(src){
  if(_imgCache[src])return _imgCache[src];
  const p=new Promise(r=>{const img=new Image();img.onload=()=>r(img);img.onerror=()=>r(null);img.src=src});
  _imgCache[src]=p;return p;
}

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

async function compositeCharacterLegacy(appearance){
  const paths=getCharacterLayers(appearance);
  const cv=document.createElement('canvas');cv.width=72;cv.height=128;
  const cx=cv.getContext('2d');
  for(const src of paths){
    const img=await loadImg(src);
    if(img)cx.drawImage(img,0,0);
  }
  return cv;
}

function extractLegacyFrame(sheet,dir,frame){
  const cv=document.createElement('canvas');cv.width=24;cv.height=32;
  cv.getContext('2d').drawImage(sheet,frame*24,dir*32,24,32,0,0,24,32);
  return cv;
}

/* ═══════════════════════════════════════════════════════════
   PUBLIC API — tries new asset system first, falls back to legacy
   ═══════════════════════════════════════════════════════════ */

async function buildCharacterSprites(appearance){
  // Try new sprite sheet from GameAssets
  const sheet=resolveCharSheet(appearance);
  if(sheet) return buildSpritesFromNewSheet(sheet);
  // Fallback to legacy layer compositing
  const legacy=await compositeCharacterLegacy(appearance);
  return{
    walk:{
      down:[0,1,2,1].map(f=>extractLegacyFrame(legacy,2,f)),
      up:  [0,1,2,1].map(f=>extractLegacyFrame(legacy,0,f)),
      right:[0,1,2,1].map(f=>extractLegacyFrame(legacy,1,f))
    },
    idle:{
      down:[extractLegacyFrame(legacy,2,1),extractLegacyFrame(legacy,2,1)],
      up:  [extractLegacyFrame(legacy,0,1),extractLegacyFrame(legacy,0,1)],
      right:[extractLegacyFrame(legacy,1,1),extractLegacyFrame(legacy,1,1)]
    }
  };
}

async function buildNPCSprite(appearance){
  const sheet=resolveCharSheet(appearance);
  if(sheet) return buildNPCSpriteFromNewSheet(sheet);
  const legacy=await compositeCharacterLegacy(appearance);
  return extractLegacyFrame(legacy,2,1);
}

async function buildFacePortrait(appearance,size){
  size=size||48;
  const sheet=resolveCharSheet(appearance);
  if(sheet) return buildFaceFromNewSheet(sheet,size);
  const legacy=await compositeCharacterLegacy(appearance);
  const cv=document.createElement('canvas');cv.width=size;cv.height=size;
  const cx=cv.getContext('2d');
  cx.imageSmoothingEnabled=false;
  cx.drawImage(legacy,5,68,14,14,2,2,size-4,size-4);
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
  const cx=canvas.getContext('2d');
  cx.clearRect(0,0,canvas.width,canvas.height);
  cx.imageSmoothingEnabled=false;

  const sheet=resolveCharSheet(appearance);
  if(sheet){
    // New system: extract front-facing standing frame (now 24×32 after crop)
    const frame=extractNewFrame(sheet,4,0);
    const scale=Math.min(Math.floor(canvas.width/24),Math.floor(canvas.height/32));
    const w=24*scale,h=32*scale;
    const ox=(canvas.width-w)/2,oy=(canvas.height-h)/2;
    cx.drawImage(frame,0,0,24,32,ox,oy,w,h);
    // Walk cycle preview (3 frames from walk row 4)
    const smallScale=Math.max(1,Math.floor(scale*0.4));
    const sw=24*smallScale,sh=32*smallScale;
    const startX=(canvas.width-(sw*3+8))/2;
    const startY=oy+h+8;
    if(startY+sh<=canvas.height){
      for(let i=0;i<3;i++){
        const wf=extractNewFrame(sheet,4,i);
        cx.drawImage(wf,0,0,24,32,startX+i*(sw+4),startY,sw,sh);
      }
    }
  }else{
    // Legacy fallback
    const legacy=await compositeCharacterLegacy(appearance);
    const frame=extractLegacyFrame(legacy,2,1);
    const scale=Math.min(Math.floor(canvas.width/24),Math.floor(canvas.height/32));
    const w=24*scale,h=32*scale;
    const ox=(canvas.width-w)/2,oy=(canvas.height-h)/2;
    cx.drawImage(frame,0,0,24,32,ox,oy,w,h);
    const smallScale=Math.max(2,Math.floor(scale*0.4));
    const sw=24*smallScale,sh=32*smallScale;
    const startX=(canvas.width-(sw*3+8))/2;
    const startY=oy+h+8;
    if(startY+sh<=canvas.height){
      for(let i=0;i<3;i++){
        const wf=extractLegacyFrame(legacy,2,i);
        cx.drawImage(wf,0,0,24,32,startX+i*(sw+4),startY,sw,sh);
      }
    }
  }
}
