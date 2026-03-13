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
    commanderVoss:makeNPCSprite('#4a2a0a','#ff6b35',false)
  },
  npcFaces:{},
  playerFace:null,
  enemies:{},
  tiles:{},
  objects:{}
};

// Generate all enemy sprites
['wolf','bogling','sentinel','bandit','ashDrake','veilWraith','corruptWolf','voidSentinel','dungeonGuardian'].forEach(t=>{sprites.enemies[t]=makeEnemySprite(t)});

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
