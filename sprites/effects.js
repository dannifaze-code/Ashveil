/* ═══════════════════════════════════════════
   Ashveil — Sprite-Sheet Effect Renderer
   Plays animated effects from PNG strip sheets
   ═══════════════════════════════════════════ */

const SpriteEffects = (function () {
  'use strict';

  const active = [];

  /* spawn a new sprite-sheet effect
     opts: { key, x, y, scale, speed, loop, onEnd } */
  function spawn(opts) {
    const sheetKey = 'efx.' + opts.key;
    const img = GameAssets.get(sheetKey);
    if (!img) return null;
    const defs = GameAssets.manifests.EFFECT_SHEETS[opts.key];
    if (!defs) return null;
    const fw = defs.fw, fh = defs.fh;
    const totalFrames = defs.frames || Math.floor(img.width / fw);
    const fx = {
      img,
      fw, fh,
      totalFrames,
      frame: 0,
      timer: 0,
      speed: opts.speed || 0.12,
      x: opts.x || 0,
      y: opts.y || 0,
      scale: opts.scale || 1,
      loop: !!opts.loop,
      done: false,
      onEnd: opts.onEnd || null,
      followTarget: opts.followTarget || null
    };
    active.push(fx);
    return fx;
  }

  /* spawn a target/combat effect
     opts: { key, x, y, scale, speed, loop } */
  function spawnTarget(opts) {
    const sheetKey = 'tfx.' + opts.key;
    const img = GameAssets.get(sheetKey);
    if (!img) return null;
    const defs = GameAssets.manifests.TARGET_SHEETS[opts.key];
    if (!defs) return null;
    const fw = defs.fw, fh = defs.fh;
    const totalFrames = Math.floor(img.width / fw);
    const fx = {
      img,
      fw, fh,
      totalFrames,
      frame: 0,
      timer: 0,
      speed: opts.speed || 0.08,
      x: opts.x || 0,
      y: opts.y || 0,
      scale: opts.scale || 1,
      loop: !!opts.loop,
      done: false,
      onEnd: opts.onEnd || null,
      followTarget: opts.followTarget || null
    };
    active.push(fx);
    return fx;
  }

  function update(dt) {
    for (let i = active.length - 1; i >= 0; i--) {
      const fx = active[i];
      if (fx.done) { active.splice(i, 1); continue; }

      /* follow a moving entity */
      if (fx.followTarget) {
        fx.x = fx.followTarget.x;
        fx.y = fx.followTarget.y;
      }

      fx.timer += dt;
      if (fx.timer >= fx.speed) {
        fx.timer -= fx.speed;
        fx.frame++;
        if (fx.frame >= fx.totalFrames) {
          if (fx.loop) {
            fx.frame = 0;
          } else {
            fx.done = true;
            if (fx.onEnd) fx.onEnd();
            active.splice(i, 1);
          }
        }
      }
    }
  }

  function draw(ctx, camX, camY) {
    for (const fx of active) {
      if (fx.done) continue;
      const sx = fx.frame * fx.fw;
      const dw = fx.fw * fx.scale;
      const dh = fx.fh * fx.scale;
      const dx = fx.x - camX - dw / 2;
      const dy = fx.y - camY - dh / 2;
      ctx.drawImage(fx.img, sx, 0, fx.fw, fx.fh, dx, dy, dw, dh);
    }
  }

  function clear() {
    active.length = 0;
  }

  return { spawn, spawnTarget, update, draw, clear, active };
})();
