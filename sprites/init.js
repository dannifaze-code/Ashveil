// ═══ SPRITE INITIALIZATION ═══
// Assembles all character sprites into the global `sprites` object.
// This file runs after config.js, player.js, npcs.js, enemies.js, and creator.js have loaded.
// The tiles and objects properties are populated later by inline code in index.html.

const sprites={
  player:{
    walk:{
      down:[0,1,2,3].map(f=>makePlayerSprite('down',f,true)),
      up:[0,1,2,3].map(f=>makePlayerSprite('up',f,true)),
      right:[0,1,2,3].map(f=>makePlayerSprite('right',f,true))
    },
    idle:{
      down:[0,1].map(f=>makePlayerSprite('down',f,false)),
      up:[0,1].map(f=>makePlayerSprite('up',f,false)),
      right:[0,1].map(f=>makePlayerSprite('right',f,false))
    }
  },
  npcs:{
    elder:makeNPCSprite('#c4a86e','#f59e0b',true),
    quartermaster:makeNPCSprite('#8b3a2a','#cc4a1a',false),
    herbalist:makeNPCSprite('#2a5a1e','#3ddc84',true),
    smuggler:makeNPCSprite('#2a2a3a','#555f6e',false),
    bountyMaster:makeNPCSprite('#5a1a1a','#dc2626',false),
    scholarLynn:makeNPCSprite('#1a3a6a','#4fc3f7',true),
    commanderVoss:makeNPCSprite('#4a2a0a','#ff6b35',false),
    // New biome town NPCs
    frostMerchant:makeNPCSprite('#8090a0','#a0d0ee',true),
    frostElder:makeNPCSprite('#c0c8d5','#4fc3f7',true),
    emberTrader:makeNPCSprite('#5a3a1a','#3a6e2a',false),
    emberRanger:makeNPCSprite('#2a4a12','#4a8038',false),
    ruinKeeper:makeNPCSprite('#3a3850','#9b8afb',true),
    ruinScholar:makeNPCSprite('#4a4860','#ccbbff',true),
    thornHermit:makeNPCSprite('#1a2a0a','#3a5a28',true),
    thornAlchemist:makeNPCSprite('#0a1a08','#3ddc84',true),
    shoreFisher:makeNPCSprite('#c4b47e','#4fc3f7',false),
    shoreSmith:makeNPCSprite('#7a6a4a','#8899aa',false),
    scorchForger:makeNPCSprite('#3a2018','#ff6600',false),
    scorchNomad:makeNPCSprite('#5a3428','#ffaa22',true),
    mireSage:makeNPCSprite('#1a3a12','#3a5a28',true),
    mireHunter:makeNPCSprite('#2a4a1e','#c4a86e',false)
  },
  npcFaces:{},
  playerFace:null,
  enemies:{},
  tiles:{},
  objects:{}
};

// Generate all enemy sprites
['wolf','bogling','sentinel','bandit','ashDrake','veilWraith','corruptWolf','voidSentinel','dungeonGuardian','frostWolf','frostGolem','magmaBeetle','magmaWyrm','thornweaver','caveSpider','deepLurker','shoreCrab','crystalGolem','emberFox','forestStag','swampToad','mireStalker','ruinShade','iceSprite','snowOwl','vineCreeper','poisonMoth','ashScarab','cinderElemental','tidalSerpent'].forEach(t=>{sprites.enemies[t]=makeEnemySprite(t)});

// Rebuild player sprites from a saved appearance object (async)
async function rebuildPlayerSprites(appearance){
  const built=await buildCharacterSprites(appearance);
  sprites.player=built;
  sprites.playerFace=await buildFacePortrait(appearance,48);
}

// Rebuild NPC sprites from the new character assets (async)
async function rebuildNPCSprites(){
  for(const id of Object.keys(NPC_APPEARANCES)){
    sprites.npcs[id]=await buildNPCSprite(NPC_APPEARANCES[id]);
    sprites.npcFaces[id]=await buildFacePortrait(NPC_APPEARANCES[id],48);
  }
}
