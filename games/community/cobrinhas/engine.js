(function (root) {
  "use strict";
  const WORLD = 4800,
    GAP = 8,
    RADIUS = 13;
  const FOOD_COUNT = 1000,
    FOOD_LIMIT = 1800;
  const POWERS = {magnet: {icon:"🧲",name:"Íman",duration:12},vision:{icon:"🔭",name:"Binóculos",duration:12},speed:{icon:"👟",name:"Sapatos velozes",duration:8}};
  const palette = ["#78c85d", "#b591ee", "#ffb752", "#58cddd", "#ef8db4"];
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  class Garden {
    constructor(random = Math.random) {
      this.random = random;
      this.reset();
    }
    point() {
      return {
        x: 70 + this.random() * (WORLD - 140),
        y: 70 + this.random() * (WORLD - 140),
      };
    }
    makeSnake(id, p, angle = 0) {
      return {
        id,
        angle,
        color: palette[id % palette.length],
        score: 0,
        effects: {magnet:0,vision:0,speed:0},
        targetLength: 34,
        grace: 2,
        respawn: 0,
        think: 0,
        foodTarget: null,
        previousBody: null,
        previousAngle: angle,
        body: Array.from({ length: 34 }, (_, i) => ({
          x: p.x - Math.cos(angle) * i * GAP,
          y: p.y - Math.sin(angle) * i * GAP,
        })),
      };
    }
    reset() {
      this.player = this.makeSnake(0, { x: WORLD / 2, y: WORLD / 2 });
      this.snakes = [this.player];
      for (let i = 1; i <= 12; i++) {
        const a = (i * Math.PI * 2) / 12;
        this.snakes.push(
          this.makeSnake(
            i,
            {
              x: WORLD / 2 + Math.cos(a) * (i % 2 ? 650 : 1250),
              y: WORLD / 2 + Math.sin(a) * (i % 2 ? 650 : 1250),
            },
            a + Math.PI / 2,
          ),
        );
      }
      this.food = Array.from({ length: FOOD_COUNT }, () => ({
        ...this.point(),
        value: 1,
        kind: Math.floor(this.random() * 5),
      }));
      this.powerups = Array.from({length:24},(_,i)=>({...this.point(),kind:Object.keys(POWERS)[i%3],cooldown:0}));
      ['magnet','vision','speed'].forEach((kind,i)=>Object.assign(this.powerups[i],{kind,x:WORLD/2+160+i*180,y:WORLD/2}));
      this.events = [];
      this.time = 0;
    }
    drop(snake) {
      // Trail positions are already closely spaced: distribute collectible points along it.
      snake.body.forEach((p, i) => {
        if (i % 3 === 0) this.food.push({ ...p, value: 3, kind: 5 });
      });
      snake.body = [];
      snake.effects = {magnet:0,vision:0,speed:0};
      snake.respawn = snake.id === 0 ? 1.8 : 3;
      this.events.push(snake.id === 0 ? "retry" : "drop");
    }
    update(dt, heading, boost = false, gentle = true) {
      dt = Math.min(dt, 0.04);
      this.time += dt;
      this.events = [];
      for(const item of this.powerups) if(item.cooldown>0){item.cooldown=Math.max(0,item.cooldown-dt);if(item.cooldown===0)Object.assign(item,this.point());}
      for (const s of this.snakes) {
        if (!s.body.length) {
          s.respawn -= dt;
          if (s.respawn <= 0) {
            // Keep new snakes away from existing bodies, with a grace period as a fallback.
            let p;
            for (let n = 0; n < 30; n++) {
              p = this.point();
              p.x = Math.max(340, Math.min(WORLD - 340, p.x));
              p.y = Math.max(340, Math.min(WORLD - 340, p.y));
              if (
                this.snakes.every((other) =>
                  other.body.every((b) => distance(p, b) > 200),
                )
              )
                break;
            }
            const fresh = this.makeSnake(s.id, p, this.random() * Math.PI * 2);
            fresh.color = s.color;
            Object.assign(s, fresh);
          }
          continue;
        }
        for(const kind of Object.keys(POWERS)) s.effects[kind]=Math.max(0,s.effects[kind]-dt);
        s.previousBody = s.body;
        s.previousAngle = s.angle;
        s.grace = Math.max(0, s.grace - dt);
        const head = s.body[0];
        let desired = heading;
        if (s.id !== 0) {
          s.think = (s.think || 0) - dt;
          let nearest = s.foodTarget,
            best = Infinity;
          if (s.think <= 0 || !nearest) {
            for (const f of this.food) {
              const d = distance(head, f);
              if (d < best) {
                best = d;
                nearest = f;
              }
            }
            s.foodTarget = nearest;
            s.think = 0.25;
          }
          desired = nearest
            ? Math.atan2(nearest.y - head.y, nearest.x - head.x)
            : s.angle;
          // Steer away from nearby bodies, while leaving opportunities to intercept a bot.
          const ahead = {
            x: head.x + Math.cos(s.angle) * 70,
            y: head.y + Math.sin(s.angle) * 70,
          };
          let danger = null;
          for (const other of this.snakes)
            if (other !== s && !other.grace) {
              for (let j = 0; j < other.body.length; j += 3)
                if (distance(ahead, other.body[j]) < 45) {
                  danger = other.body[j];
                  break;
                }
            }
          if (danger)
            desired = Math.atan2(head.y - danger.y, head.x - danger.x);
          if (
            head.x < 100 ||
            head.y < 100 ||
            head.x > WORLD - 100 ||
            head.y > WORLD - 100
          )
            desired = Math.atan2(WORLD / 2 - head.y, WORLD / 2 - head.x);
        }
        if (!Number.isFinite(desired)) desired = s.angle;
        const turn = Math.atan2(
          Math.sin(desired - s.angle),
          Math.cos(desired - s.angle),
        );
        s.angle += Math.max(-3.2 * dt, Math.min(3.2 * dt, turn));
        const speed =
          (s.id === 0 ? (gentle ? 105 : 140) : gentle ? 86 : 118) *
          (s.id === 0 && (boost || s.effects.speed>0) ? 1.55 : 1);
        const p = {
          x: head.x + Math.cos(s.angle) * speed * dt,
          y: head.y + Math.sin(s.angle) * speed * dt,
        };
        // The head touching any wall eliminates both player and computer snakes,
        // including during their initial protection from other snakes.
        if (
          p.x <= RADIUS ||
          p.x >= WORLD - RADIUS ||
          p.y <= RADIUS ||
          p.y >= WORLD - RADIUS
        ) {
          this.drop(s);
          if (s.id === 0) this.events.push("border");
          continue;
        }
        const old = s.body;
        s.body = [p];
        // Maintain constant body spacing, independent of frame rate.
        let anchor = p;
        for (let i = 1; i < old.length; i++) {
          const d = distance(anchor, old[i]) || 1;
          anchor = {
            x: anchor.x + ((old[i].x - anchor.x) * GAP) / d,
            y: anchor.y + ((old[i].y - anchor.y) * GAP) / d,
          };
          s.body.push(anchor);
        }
        if (s.body.length < s.targetLength)
          s.body.push({ ...s.body[s.body.length - 1] });
        if(s.id===0){
          for(const item of this.powerups) if(item.cooldown===0 && distance(p,item)<38){s.effects[item.kind]=POWERS[item.kind].duration;item.cooldown=20;this.events.push('power:'+item.kind);}
          if(s.effects.magnet>0) for(const f of this.food){const d=distance(p,f);if(d>0 && d<185){const pull=Math.min(d,300*dt);f.x+=(p.x-f.x)/d*pull;f.y+=(p.y-f.y)/d*pull;}}
        }
        for (let i = this.food.length - 1; i >= 0; i--)
          if (distance(p, this.food[i]) < 25) {
            const f = this.food.splice(i, 1)[0];
            s.score += f.value;
            s.targetLength = Math.min(200, 34 + s.score * 2);
            if (s.id === 0) this.events.push("eat");
          }
      }
      // Resolve against the same completed frame; head-to-head contact affects both snakes.
      const hit = new Set();
      for (const s of this.snakes)
        if (s.body.length && !s.grace) {
          for (const other of this.snakes)
            if (other !== s && other.body.length && !other.grace) {
              if (
                other.body.some((p) => distance(s.body[0], p) < RADIUS * 1.65)
              ) {
                hit.add(s);
                break;
              }
            }
        }
      hit.forEach((s) => this.drop(s));
      let missing =
        FOOD_COUNT - this.food.reduce((n, f) => n + (f.kind !== 5 ? 1 : 0), 0);
      while (missing-- > 0)
        this.food.push({
          ...this.point(),
          value: 1,
          kind: Math.floor(this.random() * 5),
        });
      if (this.food.length > FOOD_LIMIT) {
        let excess = this.food.length - FOOD_LIMIT;
        this.food = this.food.filter((f) => f.kind !== 5 || excess-- <= 0);
      }
    }
  }
  root.Cobrinhas = { Garden, WORLD, RADIUS, palette, FOOD_COUNT, FOOD_LIMIT, POWERS };
  if (typeof module !== "undefined") module.exports = root.Cobrinhas;
})(typeof window === "undefined" ? globalThis : window);
