# Ashveil — Development Memory

> This file tracks what has been built, changed, and planned across development iterations.
> Reference this file at the start of each session to understand the current state of the game.

---

## 🏗 Architecture

- **Single-file HTML5 Canvas game** — All code in `index.html` (~870 lines)
- **Engine**: Vanilla JavaScript + HTML5 Canvas 2D (no frameworks)
- **Rendering**: 16×16 pixel art sprites at 3× scale (`SCALE=3`, tile size `T=16`)
- **Deployment**: GitHub Pages via `.github/workflows/deploy-pages.yml`
- **Platform**: Mobile-first (touch joystick + buttons), PC second (WASD + keyboard)

---

## 🗺 World Structure

- **Map**: 120×80 tiles (9,600 total)
- **4 Zones**:
  - **Cindergate** (town): `(40-60, 28-44)` — neutral hub, 7 NPCs, 9 buildings
  - **Emberwood** (forest): `(8-38, 5-35)` — danger 1, wolves/bandits
  - **Mirefen** (marsh): `(20-55, 45-72)` — danger 2, boglings
  - **Glass Ruins** (ruins): `(62-95, 10-45)` — danger 3, sentinels
- **3 Dungeon Entrances**: Shattered Reliquary (ruins), Sunken Hollow (marsh), The Deep Root (forest)
- **Terrain types**: grass, dirt, stone, water, marsh, ruins, sand, corrupt

---

## 👤 Player Character

- **Stats**: HP, ATK, DEF, Crit%, Speed (180), Level, EXP, Gold
- **Equipment slots**: Weapon, Body armor, Trinket
- **6 Skills**: Combat, Foraging, Crafting, Influence, Survival, Veilsense
- **Class Awakening** at level 5: Warden (+3 ATK), Artificer (+2 DEF), Veilwalker (+10% crit)
- **Sprite system**: Directional sprites (down/up/right, left=flipped right) with:
  - 4 walking animation frames per direction (arm swing + leg stride)
  - 2 idle animation frames per direction (subtle breathing bob)
  - Visual bob during movement/idle for fluid feel

---

## 🎮 Movement System (Current)

- **Omni-directional** — Full 360° movement via WASD/arrows or touch joystick
- **Velocity-based** — Acceleration (`lerp=12*dt`) and deceleration (`friction=10*dt`)
- **Diagonal normalization** — Input vector normalized so diagonals aren't faster
- **Animation speed** scales with movement velocity
- **Idle animation** — Slow breathing cycle (0.8s per frame) when stationary
- **Walk animation** — Fast stride cycle (0.12s per frame, speed-proportional)

---

## ⚔ Combat System

- **Melee only** — Attack nearest enemy within 60×SCALE range
- **Cooldown**: 0.4s between attacks
- **Invincibility frames**: 0.5s after taking damage
- **Damage**: `max(1, ATK + rand(0,3) - 1)`, crit = `×1.8`
- **Crit chance**: base 5% + equipment bonuses + Veilwalker class bonus
- **Enemy AI**: Chase player within 180px (overworld) or 200px (dungeon), patrol in 30px radius otherwise
- **Death**: Respawn at Cindergate, lose 12 gold

---

## 🏰 Faction System (4 Factions)

| Faction | Ideology | Key Perks |
|---------|----------|-----------|
| Cindergate 🏠 | Survival, community | Shop -10%, +5 ATK/DEF in town |
| Roadwardens 🗡 | Pragmatic mercenaries | Bounty +20%, rare bounties |
| Veil Scholars 📖 | Study the Veils | Dungeon info, relic crafting |
| Ashen Order 🔥 | Burn the Veils away | +2 vs corrupted, purification |

- Standing tiers: 0→10→25→50→80 (5 tiers each)

---

## 📖 Story (3 Chapters)

1. **The Walker Wakes** (Lv 1-5) — Awakening, exploration, first faction, first dungeon, Veil speaks
2. **Fracture Lines** (Lv 5-8) — Faction tensions, corruption spreading, Scholar's quest, Ashen demands, discovering sabotage
3. **The Broken Veil** (Lv 10+) — All paths converge at Deep Root, betrayal revealed, final choice (heal or break Veil)

---

## 🗡 Items & Crafting

- **7 resource types**: branch, herb, ore, fiber, scrap, hide, relic shard
- **20 crafting recipes** — Weapon chains (Woodblade → Voidreaper), armor chains, consumables
- **Equipment tiers**: Common → Uncommon → Rare → Epic → Legendary
- **Consumables**: Tonics (25 HP), Veil Elixir (60 HP), Strength Draft (+5 ATK 60s)

---

## 🌍 World Systems

- **Corruption** (0-100%): Passive drift, zone-based increase, spawns corrupted creatures at 40%+
- **Ecology**: Wolf/bogling populations affected by hunting (-2% per kill, recover +1% per day)
- **Settlement** (5 levels): Camp → Outpost → Hamlet → Stronghold → Veil Bastion
- **Events** (10 types): Wolf Migration, Veil Storm, Merchant Caravan, Corruption Spike, etc.
- **Bounties** (10 templates): Combat and gather contracts with gold/XP/item rewards

---

## 🏆 Achievements

18 achievements tracking kills, exploration, crafting, faction loyalty, corruption, dungeons, and story progress.

---

## 📱 UI Layout

- **Desktop** (>920px): 2-column — game canvas (left) + UI sidebar (right)
- **Mobile** (≤920px): 2-row — game (55vh top) + UI (45vh bottom)
- **HUD**: HP bar, level, zone/day, ATK/DEF/gold, active dungeon/event/bounty
- **Minimap**: Top-right, shows terrain, enemies, dungeons, NPCs
- **11 UI tabs**: Journal, Story, Items, Equip, Skills, Craft, Bounty, Factions, World, Dungeon, Feats
- **Touch controls**: Virtual joystick (bottom-left), action buttons (bottom-right)

---

## 🔄 Iteration Log

### Iteration 1 — Omni-directional Movement & Animation Polish
**Date**: 2026-03-11

**Changes Made**:
1. **Fluid omni-directional movement** — Replaced instant start/stop with velocity-based system using acceleration (lerp factor 12) and deceleration (friction factor 10). Movement feels smooth and responsive.
2. **Enhanced player sprites** — Created directional sprite system with separate walking (4 frames) and idle (2 frames) animations for down, up, and right directions (left = horizontally flipped right).
3. **Walking animation** — Arms swing alternately, legs stride with proper opposing motion. Animation speed scales with player velocity.
4. **Idle animation** — Subtle breathing bob on arms and feet. Slow cycle (0.8s) gives a living, relaxed feel when standing still.
5. **Player visual bob** — Added subtle Y-offset oscillation: fast bounce while moving, slow breathing while idle.
6. **NPC idle animation** — All NPCs now have a gentle floating bob (sin wave at 1.5Hz) for a lively town feel.
7. **Enemy idle animation** — All enemies bob subtly (sin wave at 2.5Hz, offset by position) to feel alive even when patrolling.
8. **Updated tutorial toast** — Now mentions mobile controls first ("Mobile: joystick + buttons. PC: WASD...").
9. **Updated README** — Comprehensive documentation emphasizing mobile-first design, controls, features, and tech stack.
10. **Created memory system** — `.ashveil-memory/MEMORY.md` for tracking game state across development iterations.

---

## 🔮 Future Ideas / Backlog

- Ranged combat / spell system
- More enemy animation frames (directional sprites for enemies)
- Particle effects for movement (dust trails)
- Screen shake on big hits
- Sound effects and music
- More dungeon variety (procedural layouts)
- Additional story content beyond Chapter III
- Multiplayer / leaderboard support
- Adaptive difficulty system
