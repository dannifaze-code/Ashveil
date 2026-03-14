// ═══ SPRITE SYSTEM - SHARED CONFIG ═══
// Color palette used across all sprites. Modify these to change the game's color scheme.
// To create a new color theme, duplicate this file and update the hex values.

const C={skin:'#e8b89d',skinS:'#c4916e',hair:'#4a3728',hairL:'#6b5040',cloth:'#3a5068',clothL:'#4a6a88',clothD:'#2a3a4d',metal:'#8899aa',metalL:'#aabbcc',metalD:'#667788',leather:'#7a5533',leatherL:'#9a7553',leatherD:'#5a3513',wood:'#8b6914',woodL:'#ab8934',woodD:'#6b4904',fire:'#ff6b35',fire2:'#ff9f1a',fire3:'#ffcc44',veil:'#7b68ee',veil2:'#9b8afb',red:'#dc2626',green:'#3ddc84',blue:'#4fc3f7',gold:'#f59e0b',white:'#f0f4ff',gray:'#9ca3af',dark:'#2a3347',grass1:'#2d5a1e',grass2:'#3a6e2a',grass3:'#4a8038',grass4:'#1e4a12',dirt1:'#6b5233',dirt2:'#7a6243',dirt3:'#8a7253',stone1:'#555f6e',stone2:'#667080',stone3:'#778090',water1:'#1a4a6e',water2:'#2a5a7e',water3:'#3a6a8e',sand1:'#c4a86e',sand2:'#b49858',marsh1:'#2a4a1e',marsh2:'#3a5a28',marsh3:'#1a3a12',ruins1:'#3a3850',ruins2:'#4a4860',ruins3:'#5a5870',tree1:'#1a4a0a',tree2:'#2a5a1a',tree3:'#0a3a00',trunk:'#5a3a1a',trunkD:'#4a2a0a',roof1:'#8b3a2a',roof2:'#6b2a1a',wall1:'#9a8a6a',wall2:'#8a7a5a',corrupt1:'#3a1a3a',corrupt2:'#4a1a4a',corrupt3:'#2a0a2a',dungeon1:'#1a1a2a',dungeon2:'#2a2a3a',dungeon3:'#3a3a4a',
// New biome colors
snow1:'#e8eef5',snow2:'#d0d8e5',snow3:'#c0c8d5',snowRock:'#8090a0',ice1:'#a0d0ee',ice2:'#80c0e0',
volcanic1:'#3a2018',volcanic2:'#4a2a20',volcanic3:'#5a3428',lava1:'#ff4400',lava2:'#ff6600',lava3:'#ffaa22',ash1:'#4a4a4a',ash2:'#5a5a5a',
darkForest1:'#0a2a0a',darkForest2:'#122a12',darkForest3:'#0a1a08',webColor:'#cccccc',webColorD:'#999999',
shore1:'#d4c48e',shore2:'#c4b47e',shore3:'#e4d49e',deepWater1:'#0a3a5e',deepWater2:'#1a4a6e',
road1:'#7a6a4a',road2:'#8a7a5a',road3:'#6a5a3a',
pine1:'#1a3a2a',pine2:'#2a4a3a',pine3:'#0a2a1a',
deadTree:'#5a4a3a',deadTreeD:'#4a3a2a',
darkTrunk:'#2a1a0a',darkLeaf1:'#1a2a0a',darkLeaf2:'#0a1a00',darkLeaf3:'#2a3a1a',
palm1:'#3a7a2a',palm2:'#4a8a3a',palmTrunk:'#8a7040',
cactus1:'#2a6a1a',cactus2:'#3a7a2a',
mushroom1:'#8a2a2a',mushroom2:'#aa3a3a',mushroom3:'#cc5555',mushroomStem:'#e0d8c0',
cave1:'#1a1418',cave2:'#2a2028',cave3:'#3a2a38'};

// Core sprite renderer - converts a flat array of hex color strings into a canvas element.
// data: array of hex color strings (falsy values = transparent), w/h: dimensions
function createSprite(data,w=16,h=16){const c=document.createElement('canvas');c.width=w;c.height=h;const cx=c.getContext('2d');for(let i=0;i<data.length;i++){if(data[i]){cx.fillStyle=data[i];cx.fillRect(i%w,Math.floor(i/w),1,1)}}return c}
