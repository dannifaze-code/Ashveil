/* ═══════════════════════════════════════════
   Ashveil — Asset Manager
   Preloads & exposes all PNG-based game assets
   ═══════════════════════════════════════════ */

const GameAssets = (function () {
  'use strict';

  const loaded = {};
  let totalAssets = 0;
  let loadedCount = 0;
  let onProgress = null;

  /* ── Asset Manifest ── */

  const CHARACTERS = {
    human_female_african:  'assets/characters/human_female_african.png',
    human_female_european: 'assets/characters/human_female_european.png',
    human_male_african:    'assets/characters/human_male_african.png',
    human_male_asian:      'assets/characters/human_male_asian.png',
    human_male_european:   'assets/characters/human_male_european.png',
    body_1:                'assets/characters/1.png',
    body_2:                'assets/characters/2.png'
  };

  const EQUIPMENT_HEAD = {
    farmer_hat_straw:         'assets/equipment/head/farmer_hat_straw.png',
    farmer_hat_straw_cloth:   'assets/equipment/head/farmer_hat_straw_cloth.png',
    farmer_scarf_cloth:       'assets/equipment/head/farmer_scarf_cloth.png',
    female_1_green:           'assets/equipment/head/female_1_green.png',
    female_3_green:           'assets/equipment/head/female_3_green.png',
    guard_helmet_metal_red:   'assets/equipment/head/guard_helmet_metal_red.png',
    male_1_black:             'assets/equipment/head/male_1_black.png',
    male_1_brown:             'assets/equipment/head/male_1_brown.png',
    male_2_grey:              'assets/equipment/head/male_2_grey.png',
    merchant_hat_leather_black:'assets/equipment/head/merchant_hat_leather_black.png',
    head_2:                   'assets/equipment/head/2.png'
  };

  const EQUIPMENT_CHEST = {
    citizen_leathervest_green:     'assets/equipment/chest/citizen_leathervest_green.png',
    citizen_leathervest_red:       'assets/equipment/chest/citizen_leathervest_red.png',
    citizen_shirt_cloth_blue:      'assets/equipment/chest/citizen_shirt_cloth_blue.png',
    citizen_shortshirt_cloth_yellow:'assets/equipment/chest/citizen_shortshirt_cloth_yellow.png',
    farmer_leathertrousers_blue:   'assets/equipment/chest/farmer_leathertrousers_blue.png',
    farmer_leathertrousers_cloth:  'assets/equipment/chest/farmer_leathertrousers_cloth.png',
    farmer_leathertrousers_green:  'assets/equipment/chest/farmer_leathertrousers_green.png',
    farmer_leathertrousers_red:    'assets/equipment/chest/farmer_leathertrousers_red.png',
    guard_metal_red:               'assets/equipment/chest/guard_metal_red.png',
    merchant_vest_cloth:           'assets/equipment/chest/merchant_vest_cloth.png'
  };

  const EQUIPMENT_FEET = {
    citizen_leather:       'assets/equipment/feet/citizen_leather.png',
    citizen_leather_black: 'assets/equipment/feet/citizen_leather_black.png',
    citizen_leather_blue:  'assets/equipment/feet/citizen_leather_blue.png',
    citizen_leather_red:   'assets/equipment/feet/citizen_leather_red.png',
    citizen_leather_yellow:'assets/equipment/feet/citizen_leather_yellow.png',
    guard_boots_metal:     'assets/equipment/feet/guard_boots_metal.png'
  };

  const EQUIPMENT_HANDS = {
    bandit_leather: 'assets/equipment/hands/bandit_leather.png',
    cloth_yellow:   'assets/equipment/hands/cloth_yellow.png',
    guard_metal:    'assets/equipment/hands/guard_metal.png'
  };

  const EQUIPMENT_LEGS = {
    farmer_leather:       'assets/equipment/legs/farmer_leather.png',
    farmer_shortleather:  'assets/equipment/legs/farmer_shortleather.png',
    guard_metal:          'assets/equipment/legs/guard_metal.png',
    merchant_cloth_red:   'assets/equipment/legs/merchant_cloth_red.png',
    merchant_cloth_white: 'assets/equipment/legs/merchant_cloth_white.png'
  };

  const EQUIPMENT_SHOULDERS = {
    bandit_leather_big: 'assets/equipment/shoulders/bandit_leather_big.png',
    guard_metal_big:    'assets/equipment/shoulders/guard_metal_big.png'
  };

  const ICONS = {
    bug:                 'assets/icons/bug.png',
    button_chat:         'assets/icons/button_chat.png',
    dot_green:           'assets/icons/dot_green.png',
    happiness:           'assets/icons/happiness.png',
    icon_map:            'assets/icons/icon-map.png',
    icon_discord:        'assets/icons/icon_discord.png',
    icon_facebook:       'assets/icons/icon_facebook.png',
    icon_trash:          'assets/icons/icon_trash.png',
    icon_twitter:        'assets/icons/icon_twitter.png',
    inv_chest:           'assets/icons/inventory_chest.png',
    inv_feet:            'assets/icons/inventory_feet.png',
    inv_hands:           'assets/icons/inventory_hands.png',
    inv_head:            'assets/icons/inventory_head.png',
    inv_legs:            'assets/icons/inventory_legs.png',
    inv_shoulders:       'assets/icons/inventory_shoulders.png',
    mail_attachments:    'assets/icons/mail_attachments.png',
    map_marker_player:   'assets/icons/map-marker-player.png',
    shortcut_collection: 'assets/icons/shortcuts_button_collection.png',
    shortcut_hub:        'assets/icons/shortcuts_button_hub.png',
    shortcut_inventory:  'assets/icons/shortcuts_button_inventory.png',
    shortcut_minus:      'assets/icons/shortcuts_button_minus.png',
    shortcut_options:    'assets/icons/shortcuts_button_options.png',
    shortcut_plus:       'assets/icons/shortcuts_button_plus.png',
    shortcut_professions:'assets/icons/shortcuts_button_professions.png',
    shortcut_questlog:   'assets/icons/shortcuts_button_questlog.png',
    shortcut_stats:      'assets/icons/shortcuts_button_stats.png',
    shortcut_store:      'assets/icons/shortcuts_button_store.png'
  };

  const ITEMS = {
    citizen_shirt_cloth_blue: 'assets/items/citizen_shirt_cloth_blue.png',
    club_wood:                'assets/items/club_wood.png',
    healing_potion_small:     'assets/items/healing_potion_small.png',
    icon_feet_citizen_leather:'assets/items/icon_feet_citizen_leather.png',
    icon_legs_farmer_leather: 'assets/items/icon_legs_farmer_leather.png'
  };

  const TOOLS = {
    axe:       'assets/tools/axe.png',
    bow:       'assets/tools/bow.png',
    club_wood: 'assets/tools/club_wood.png',
    heal:      'assets/tools/heal.png',
    pickaxe:   'assets/tools/pickaxe.png',
    sickle:    'assets/tools/sickle.png',
    speer:     'assets/tools/speer.png',
    sword:     'assets/tools/sword.png'
  };

  const TUTORIAL = {
    fight:       'assets/tutorial/tut_fight.png',
    interaction: 'assets/tutorial/tut_interaction.png',
    movement:    'assets/tutorial/tut_movement.png',
    quests:      'assets/tutorial/tut_quests.png'
  };

  const EFFECTS_VISUAL = {
    compass:          'assets/effects/visual/compass.png',
    currency_gem:     'assets/effects/visual/currency_gem.png',
    currency_gold:    'assets/effects/visual/currency_gold.png',
    damage_indicators:'assets/effects/visual/damage_indicators.png',
    death_skull:      'assets/effects/visual/icon_death_skull.png',
    joystick_arrow:   'assets/effects/visual/joystick-arrow.png',
    login_background: 'assets/effects/visual/login-background.png',
    npc_head_icons:   'assets/effects/visual/npc_head_icons.png',
    party_leader:     'assets/effects/visual/party_leader_16_old.png',
    premium:          'assets/effects/visual/premium.png',
    shop_30days:      'assets/effects/visual/shop_icon_30days.png',
    target_marker:    'assets/effects/visual/target_marker.png'
  };

  /* ── Sprite Sheet Definitions (frame-based) ── */

  const EFFECT_SHEETS = {
    /* Entity effects - each row is a sprite strip */
    blood_1:       { src: 'assets/effects/entity/blood_1.png',       fw: 48, fh: 48, frames: 3 },
    blood_2:       { src: 'assets/effects/entity/blood_2.png',       fw: 48, fh: 48, frames: 3 },
    blood_3:       { src: 'assets/effects/entity/blood_3.png',       fw: 48, fh: 48, frames: 3 },
    clover_green:  { src: 'assets/effects/entity/clover_green.png',  fw: 48, fh: 48, frames: 4 },
    crafting:      { src: 'assets/effects/entity/crafting.png',      fw: 48, fh: 48, frames: 6 },
    drinking:      { src: 'assets/effects/entity/drinking.png',      fw: 80, fh: 80, frames: 6 },
    eating:        { src: 'assets/effects/entity/eating.png',        fw: 48, fh: 48, frames: 6 },
    ground_frost:  { src: 'assets/effects/entity/ground_frost.png',  fw: 80, fh: 80, frames: 8 },
    ground_holy:   { src: 'assets/effects/entity/ground_holy.png',   fw: 80, fh: 80, frames: 8 },
    heart_beating: { src: 'assets/effects/entity/heart_beating.png', fw: 48, fh: 48, frames: 6 },
    holly:         { src: 'assets/effects/entity/holly.png',         fw: 48, fh: 48, frames: 1 },
    icicle:        { src: 'assets/effects/entity/icicle.png',        fw: 48, fh: 48, frames: 1 },
    illusion:      { src: 'assets/effects/entity/illusion.png',      fw: 48, fh: 48, frames: 4 },
    level_up:      { src: 'assets/effects/entity/level_up.png',      fw: 48, fh: 48, frames: 8 },
    loot_crate:    { src: 'assets/effects/entity/loot_crate_10.png', fw: 48, fh: 48, frames: 8 },
    loot_geode:    { src: 'assets/effects/entity/loot_geode.png',    fw: 48, fh: 48, frames: 8 },
    phase_shift:   { src: 'assets/effects/entity/phase_shift.png',   fw: 48, fh: 48, frames: 8 },
    player_silence:{ src: 'assets/effects/entity/player_silence.png',fw: 48, fh: 48, frames: 4 },
    player_snare:  { src: 'assets/effects/entity/player_snare.png',  fw: 48, fh: 48, frames: 1 },
    player_stun:   { src: 'assets/effects/entity/player_stun.png',   fw: 48, fh: 48, frames: 4 },
    present:       { src: 'assets/effects/entity/present_green.png', fw: 48, fh: 48, frames: 8 },
    shield_glow:   { src: 'assets/effects/entity/shield_glow_yellow.png', fw: 48, fh: 48, frames: 6 },
    sleep:         { src: 'assets/effects/entity/sleep.png',         fw: 48, fh: 48, frames: 4 },
    spawn:         { src: 'assets/effects/entity/spawn.png',         fw: 48, fh: 48, frames: 4 },
    stronghold:    { src: 'assets/effects/entity/stronghold.png',    fw: 48, fh: 48, frames: 8 },
    loot_crate_glynphyra:  { src: 'assets/effects/entity/loot_crate_decoration_glynphyra.png',  fw: 48, fh: 48, frames: 8 },
    loot_crate_royal_bears:{ src: 'assets/effects/entity/loot_crate_decoration_royal_bears.png', fw: 48, fh: 48, frames: 8 }
  };

  const TARGET_SHEETS = {
    bubble_ground: { src: 'assets/effects/target/bubble_ground_purple.png', fw: 48, fh: 48 },
    carrot_smoke:  { src: 'assets/effects/target/carrot_smoke.png',  fw: 48, fh: 48 },
    cleanse:       { src: 'assets/effects/target/cleanse.png',       fw: 80, fh: 80 },
    dragon_staff:  { src: 'assets/effects/target/dragon_staff.png',  fw: 48, fh: 48 },
    fight_smoke:   { src: 'assets/effects/target/fight_smoke.png',   fw: 48, fh: 48 },
    fight_smoke_2: { src: 'assets/effects/target/fight_smoke_2.png', fw: 48, fh: 48 },
    fight_smoke_3: { src: 'assets/effects/target/fight_smoke_3.png', fw: 48, fh: 48 },
    fight_smoke_dark:{ src: 'assets/effects/target/fight_smoke_dark.png', fw: 48, fh: 48 },
    fight_smoke_dark_2:{ src: 'assets/effects/target/fight_smoke_dark_2.png', fw: 48, fh: 48 },
    fight_smoke_dark_3:{ src: 'assets/effects/target/fight_smoke_dark_3.png', fw: 48, fh: 48 },
    fight_smoke_white:{ src: 'assets/effects/target/fight_smoke_white.png', fw: 48, fh: 48 },
    fire:          { src: 'assets/effects/target/fire.png',          fw: 48, fh: 48 },
    fire_2:        { src: 'assets/effects/target/fire_2.png',        fw: 48, fh: 48 },
    fire_3:        { src: 'assets/effects/target/fire_3.png',        fw: 48, fh: 48 },
    fire_purple:   { src: 'assets/effects/target/fire_purple.png',   fw: 48, fh: 48 },
    fire_red:      { src: 'assets/effects/target/fire_red.png',      fw: 48, fh: 48 },
    fire_small:    { src: 'assets/effects/target/fire_small.png',    fw: 48, fh: 48 },
    fire_small_earth:{ src: 'assets/effects/target/fire_small_earth.png', fw: 48, fh: 48 },
    fire_small_holy:{ src: 'assets/effects/target/fire_small_holy.png', fw: 48, fh: 48 },
    fire_small_purple:{ src: 'assets/effects/target/fire_small_purple.png', fw: 48, fh: 48 },
    fire_small_water:{ src: 'assets/effects/target/fire_small_water.png', fw: 48, fh: 48 },
    firecracker:   { src: 'assets/effects/target/firecracker.png',   fw: 48, fh: 48 },
    firework_blue_1:{ src: 'assets/effects/target/firework_blue_1.png', fw: 48, fh: 48 },
    firework_blue_2:{ src: 'assets/effects/target/firework_blue_2.png', fw: 48, fh: 48 },
    firework_blue_3:{ src: 'assets/effects/target/firework_blue_3.png', fw: 48, fh: 48 },
    firework_blue_4:{ src: 'assets/effects/target/firework_blue_4.png', fw: 48, fh: 48 },
    firework_green_1:{ src: 'assets/effects/target/firework_green_1.png', fw: 48, fh: 48 },
    firework_green_2:{ src: 'assets/effects/target/firework_green_2.png', fw: 48, fh: 48 },
    firework_green_3:{ src: 'assets/effects/target/firework_green_3.png', fw: 48, fh: 48 },
    firework_green_4:{ src: 'assets/effects/target/firework_green_4.png', fw: 48, fh: 48 },
    firework_orange_1:{ src: 'assets/effects/target/firework_orange_1.png', fw: 48, fh: 48 },
    firework_orange_2:{ src: 'assets/effects/target/firework_orange_2.png', fw: 48, fh: 48 },
    firework_orange_3:{ src: 'assets/effects/target/firework_orange_3.png', fw: 48, fh: 48 },
    firework_orange_4:{ src: 'assets/effects/target/firework_orange_4.png', fw: 48, fh: 48 },
    firework_purple_1:{ src: 'assets/effects/target/firework_purple_1.png', fw: 48, fh: 48 },
    firework_purple_2:{ src: 'assets/effects/target/firework_purple_2.png', fw: 48, fh: 48 },
    firework_purple_3:{ src: 'assets/effects/target/firework_purple_3.png', fw: 48, fh: 48 },
    firework_purple_4:{ src: 'assets/effects/target/firework_purple_4.png', fw: 48, fh: 48 },
    firework_red_1:{ src: 'assets/effects/target/firework_red_1.png', fw: 48, fh: 48 },
    firework_red_2:{ src: 'assets/effects/target/firework_red_2.png', fw: 48, fh: 48 },
    firework_red_3:{ src: 'assets/effects/target/firework_red_3.png', fw: 48, fh: 48 },
    firework_red_4:{ src: 'assets/effects/target/firework_red_4.png', fw: 48, fh: 48 },
    flame:         { src: 'assets/effects/target/flame.png',         fw: 48, fh: 48 },
    flame_earth:   { src: 'assets/effects/target/flame_earth.png',   fw: 48, fh: 48 },
    flame_holy:    { src: 'assets/effects/target/flame_holy.png',    fw: 48, fh: 48 },
    flame_purple:  { src: 'assets/effects/target/flame_purple.png',  fw: 48, fh: 48 },
    flame_water:   { src: 'assets/effects/target/flame_water.png',   fw: 48, fh: 48 },
    heal_1:        { src: 'assets/effects/target/heal.png',          fw: 48, fh: 48 },
    heal_2:        { src: 'assets/effects/target/heal_2.png',        fw: 48, fh: 48 },
    heal_3:        { src: 'assets/effects/target/heal_3.png',        fw: 48, fh: 48 },
    leaf_explosion:{ src: 'assets/effects/target/leaf_explosion.png',fw: 48, fh: 48 },
    skulls_purple: { src: 'assets/effects/target/skulls_purple.png', fw: 48, fh: 48 },
    stein:         { src: 'assets/effects/target/stein.png',         fw: 48, fh: 48 },
    water:         { src: 'assets/effects/target/water.png',         fw: 48, fh: 48 },
    whirlwind_dark:{ src: 'assets/effects/target/whirlwind_dark.png', fw: 48, fh: 48 },
    whirlwind_white:{ src: 'assets/effects/target/whirlwind_white.png', fw: 48, fh: 48 },
    white_explosion:{ src: 'assets/effects/target/white_explosion.png', fw: 48, fh: 48 }
  };

  const CREATURES = {
    critter_1:   'assets/creatures/1.png',
    dog_black:   'assets/creatures/dog_black.png',
    dog_brown:   'assets/creatures/dog_brown.png',
    rat_white:   'assets/creatures/white.png',
    cocoon:      'assets/creatures/cocoon.png'
  };

  const WORLD_ASSETS = {
    world_1:                             'assets/world/1.png',
    cu_00000027_00000015_bottom:         'assets/world/cu_00000027_00000015_bottom.png',
    cu_00000027_00000015_top:            'assets/world/cu_00000027_00000015_top.png',
    cu_00000027_00000016_bottom:         'assets/world/cu_00000027_00000016_bottom.png',
    cu_00000027_00000016_top:            'assets/world/cu_00000027_00000016_top.png',
    cu_00000027_00000017_bottom:         'assets/world/cu_00000027_00000017_bottom.png',
    cu_00000027_00000017_top:            'assets/world/cu_00000027_00000017_top.png',
    cu_00000027_00000018_bottom:         'assets/world/cu_00000027_00000018_bottom.png',
    cu_00000027_00000018_top:            'assets/world/cu_00000027_00000018_top.png',
    cu_00000027_00000019_bottom:         'assets/world/cu_00000027_00000019_bottom.png',
    cu_00000027_00000019_top:            'assets/world/cu_00000027_00000019_top.png',
    cu_00000028_00000015_bottom:         'assets/world/cu_00000028_00000015_bottom.png',
    cu_00000028_00000015_top:            'assets/world/cu_00000028_00000015_top.png',
    cu_00000028_00000016_bottom:         'assets/world/cu_00000028_00000016_bottom.png',
    cu_00000028_00000016_top:            'assets/world/cu_00000028_00000016_top.png',
    cu_00000028_00000017_bottom:         'assets/world/cu_00000028_00000017_bottom.png',
    cu_00000028_00000017_top:            'assets/world/cu_00000028_00000017_top.png',
    cu_00000028_00000018_bottom:         'assets/world/cu_00000028_00000018_bottom.png',
    cu_00000028_00000018_top:            'assets/world/cu_00000028_00000018_top.png',
    cu_00000028_00000019_bottom:         'assets/world/cu_00000028_00000019_bottom.png',
    cu_00000028_00000019_top:            'assets/world/cu_00000028_00000019_top.png',
    cu_00000028_00000020_bottom:         'assets/world/cu_00000028_00000020_bottom.png',
    cu_00000028_00000020_top:            'assets/world/cu_00000028_00000020_top.png',
    cu_00000029_00000015_bottom:         'assets/world/cu_00000029_00000015_bottom.png',
    cu_00000029_00000015_top:            'assets/world/cu_00000029_00000015_top.png',
    cu_00000029_00000016_bottom:         'assets/world/cu_00000029_00000016_bottom.png',
    cu_00000029_00000016_top:            'assets/world/cu_00000029_00000016_top.png',
    cu_00000029_00000017_bottom:         'assets/world/cu_00000029_00000017_bottom.png',
    cu_00000029_00000017_top:            'assets/world/cu_00000029_00000017_top.png',
    cu_00000029_00000018_bottom:         'assets/world/cu_00000029_00000018_bottom.png',
    cu_00000029_00000018_top:            'assets/world/cu_00000029_00000018_top.png',
    cu_00000029_00000019_bottom:         'assets/world/cu_00000029_00000019_bottom.png',
    cu_00000029_00000019_top:            'assets/world/cu_00000029_00000019_top.png',
    cu_00000029_00000020_bottom:         'assets/world/cu_00000029_00000020_bottom.png',
    cu_00000029_00000020_top:            'assets/world/cu_00000029_00000020_top.png',
    cu_00000030_00000015_bottom:         'assets/world/cu_00000030_00000015_bottom.png',
    cu_00000030_00000015_top:            'assets/world/cu_00000030_00000015_top.png',
    cu_00000030_00000016_bottom:         'assets/world/cu_00000030_00000016_bottom.png',
    cu_00000030_00000016_top:            'assets/world/cu_00000030_00000016_top.png',
    cu_00000030_00000017_bottom:         'assets/world/cu_00000030_00000017_bottom.png',
    cu_00000030_00000017_top:            'assets/world/cu_00000030_00000017_top.png',
    cu_00000030_00000018_bottom:         'assets/world/cu_00000030_00000018_bottom.png',
    cu_00000030_00000018_top:            'assets/world/cu_00000030_00000018_top.png',
    cu_00000030_00000019_bottom:         'assets/world/cu_00000030_00000019_bottom.png',
    cu_00000030_00000019_top:            'assets/world/cu_00000030_00000019_top.png',
    cu_00000030_00000020_bottom:         'assets/world/cu_00000030_00000020_bottom.png',
    cu_00000030_00000020_top:            'assets/world/cu_00000030_00000020_top.png',
    cu_00000031_00000015_bottom:         'assets/world/cu_00000031_00000015_bottom.png',
    cu_00000031_00000015_top:            'assets/world/cu_00000031_00000015_top.png',
    cu_00000031_00000016_bottom:         'assets/world/cu_00000031_00000016_bottom.png',
    cu_00000031_00000016_top:            'assets/world/cu_00000031_00000016_top.png',
    cu_00000031_00000017_bottom:         'assets/world/cu_00000031_00000017_bottom.png',
    cu_00000031_00000017_top:            'assets/world/cu_00000031_00000017_top.png',
    cu_00000031_00000018_bottom:         'assets/world/cu_00000031_00000018_bottom.png',
    cu_00000031_00000018_top:            'assets/world/cu_00000031_00000018_top.png',
    cu_00000031_00000019_bottom:         'assets/world/cu_00000031_00000019_bottom.png',
    cu_00000031_00000019_top:            'assets/world/cu_00000031_00000019_top.png',
    cu_00000031_00000020_bottom:         'assets/world/cu_00000031_00000020_bottom.png',
    cu_00000031_00000020_top:            'assets/world/cu_00000031_00000020_top.png',
    cu_00000032_00000015_bottom:         'assets/world/cu_00000032_00000015_bottom.png',
    cu_00000032_00000015_top:            'assets/world/cu_00000032_00000015_top.png',
    cu_00000032_00000016_bottom:         'assets/world/cu_00000032_00000016_bottom.png',
    cu_00000032_00000016_top:            'assets/world/cu_00000032_00000016_top.png',
    cu_00000032_00000017_bottom:         'assets/world/cu_00000032_00000017_bottom.png',
    cu_00000032_00000017_top:            'assets/world/cu_00000032_00000017_top.png',
    cu_00000032_00000018_bottom:         'assets/world/cu_00000032_00000018_bottom.png',
    cu_00000032_00000018_top:            'assets/world/cu_00000032_00000018_top.png',
    cu_00000032_00000019_bottom:         'assets/world/cu_00000032_00000019_bottom.png',
    cu_00000032_00000019_top:            'assets/world/cu_00000032_00000019_top.png',
    cu_00000032_00000020_bottom:         'assets/world/cu_00000032_00000020_bottom.png',
    cu_00000032_00000020_top:            'assets/world/cu_00000032_00000020_top.png',
    mouse_trap:                          'assets/world/mouse_trap.png',
    prof_bush_vogria:                    'assets/world/prof_bush_vogria.png',
    prof_tree_beech:                     'assets/world/prof_tree_beech.png'
  };

  /* ── Loading ── */

  function loadImage(key, src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        loaded[key] = img;
        loadedCount++;
        if (onProgress) onProgress(loadedCount, totalAssets);
        resolve(img);
      };
      img.onerror = () => {
        console.warn('[Assets] Failed to load: ' + src);
        loadedCount++;
        if (onProgress) onProgress(loadedCount, totalAssets);
        resolve(null);
      };
      img.src = src;
    });
  }

  function collectAll(manifest, prefix) {
    const entries = [];
    for (const [key, val] of Object.entries(manifest)) {
      const src = typeof val === 'string' ? val : val.src;
      entries.push({ key: prefix + '.' + key, src });
    }
    return entries;
  }

  async function loadAll(progressCb) {
    onProgress = progressCb || null;
    const all = [
      ...collectAll(CHARACTERS, 'char'),
      ...collectAll(EQUIPMENT_HEAD, 'eq_head'),
      ...collectAll(EQUIPMENT_CHEST, 'eq_chest'),
      ...collectAll(EQUIPMENT_FEET, 'eq_feet'),
      ...collectAll(EQUIPMENT_HANDS, 'eq_hands'),
      ...collectAll(EQUIPMENT_LEGS, 'eq_legs'),
      ...collectAll(EQUIPMENT_SHOULDERS, 'eq_shoulders'),
      ...collectAll(ICONS, 'icon'),
      ...collectAll(ITEMS, 'item'),
      ...collectAll(TOOLS, 'tool'),
      ...collectAll(TUTORIAL, 'tut'),
      ...collectAll(EFFECTS_VISUAL, 'fx'),
      ...collectAll(EFFECT_SHEETS, 'efx'),
      ...collectAll(TARGET_SHEETS, 'tfx'),
      ...collectAll(CREATURES, 'creature'),
      ...collectAll(WORLD_ASSETS, 'world')
    ];
    totalAssets = all.length;
    loadedCount = 0;
    await Promise.all(all.map(e => loadImage(e.key, e.src)));
    return loaded;
  }

  /* ── Sprite-sheet frame extraction ── */

  function getFrame(sheetKey, frameIndex) {
    const img = loaded[sheetKey];
    if (!img) return null;
    const defs = EFFECT_SHEETS[sheetKey.replace('efx.', '')] ||
                 TARGET_SHEETS[sheetKey.replace('tfx.', '')];
    if (!defs) return img;
    const fw = defs.fw, fh = defs.fh;
    const cols = Math.floor(img.width / fw);
    const sx = (frameIndex % cols) * fw;
    const sy = Math.floor(frameIndex / cols) * fh;
    return { img, sx, sy, sw: fw, sh: fh };
  }

  function drawFrame(ctx, sheetKey, frameIndex, dx, dy, dw, dh) {
    const f = getFrame(sheetKey, frameIndex);
    if (!f) return;
    if (f instanceof HTMLImageElement) {
      ctx.drawImage(f, dx, dy, dw || f.width, dh || f.height);
    } else {
      ctx.drawImage(f.img, f.sx, f.sy, f.sw, f.sh, dx, dy, dw || f.sw, dh || f.sh);
    }
  }

  /* ── Public API ── */

  return {
    loadAll,
    get: key => loaded[key] || null,
    getFrame,
    drawFrame,
    get count() { return loadedCount; },
    get total() { return totalAssets; },
    manifests: {
      CHARACTERS, EQUIPMENT_HEAD, EQUIPMENT_CHEST, EQUIPMENT_FEET,
      EQUIPMENT_HANDS, EQUIPMENT_LEGS, EQUIPMENT_SHOULDERS,
      ICONS, ITEMS, TOOLS, TUTORIAL, EFFECTS_VISUAL,
      EFFECT_SHEETS, TARGET_SHEETS, CREATURES, WORLD_ASSETS
    }
  };
})();
