const LEAD_ENDPOINT = 'https://lead-relay.leestygpt.workers.dev/lead/TZR29YZM32';

(() => {
  'use strict';
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const fmt = n => Math.round(n).toLocaleString('ru-RU');

  // ===== year / header / burger =====
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  const header = $('#header');
  const burger = $('#burger');
  const nav = $('#nav');
  burger?.addEventListener('click', () => {
    const open = burger.classList.toggle('is-open');
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
  });
  $$('a', nav).forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('is-open');
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }));

  // ===== smooth anchors =====
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href.length <= 1) return;
      const t = $(href);
      if (!t) return;
      e.preventDefault();
      const top = t.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: RM ? 'auto' : 'smooth' });
    });
  });

  // ===== phone mask =====
  $$('input[type="tel"]').forEach(input => {
    input.addEventListener('input', e => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.startsWith('8')) v = '7' + v.slice(1);
      if (!v.startsWith('7')) v = '7' + v;
      v = v.slice(0, 11);
      let out = '+7';
      if (v.length > 1) out += ' (' + v.slice(1, 4);
      if (v.length >= 4) out += ') ' + v.slice(4, 7);
      if (v.length >= 7) out += '-' + v.slice(7, 9);
      if (v.length >= 9) out += '-' + v.slice(9, 11);
      e.target.value = out;
    });
  });

  // ===== split headline by words =====
  $$('[data-split]').forEach(el => {
    const words = el.textContent.trim().split(/ +/);
    el.setAttribute('aria-label', el.textContent.trim());
    el.textContent = '';
    words.forEach((w, i) => {
      const o = document.createElement('span');
      o.className = 'w';
      o.setAttribute('aria-hidden', 'true');
      const s = document.createElement('span');
      s.textContent = w;
      s.style.setProperty('--i', i);
      o.appendChild(s);
      el.appendChild(o);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });

  // ===== counters =====
  const runCount = el => {
    const target = parseInt(el.dataset.count, 10);
    if (RM || Number.isNaN(target)) return;
    const dur = 1400, t0 = performance.now();
    const tick = t => {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(tick);
    };
    el.textContent = '0';
    requestAnimationFrame(tick);
  };

  // ===== reveal on scroll (rAF check, not IO: robust on fast jumps) =====
  const rv = $$('[data-r],[data-split],.cmp__scroll');
  $$('.cmp__t tbody tr').forEach((tr, i) => {
    tr.style.setProperty('--r', i);
    Array.from(tr.children).slice(1).forEach((td, k) => { td.dataset.l = ['YPage', 'Craftum', 'Tilda'][k]; });
  });
  const countDone = new WeakSet();
  const checkReveal = () => {
    const vh = window.innerHeight;
    rv.forEach(el => {
      if (el.classList.contains('on')) return;
      if (el.getBoundingClientRect().top < vh * 0.93) {
        el.classList.add('on');
        $$('[data-count]', el).forEach(c => { if (!countDone.has(c)) { countDone.add(c); runCount(c); } });
      }
    });
  };

  // ===== scroll-driven things =====
  const prog = $('#prog');
  const pars = $$('[data-par]');
  const marq = $('#marq');
  let marqX = 0, lastY = window.scrollY, marqHalf = 0, ticking = false;
  const measureMarq = () => { if (marq) marqHalf = marq.scrollWidth / 2; };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const y = window.scrollY;
      header?.classList.toggle('scrolled', y > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (prog && !RM) prog.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
      checkReveal();
      if (!RM) {
        const vh = window.innerHeight;
        pars.forEach(img => {
          const r = img.parentElement.getBoundingClientRect();
          if (r.bottom < -50 || r.top > vh + 50) return;
          const k = (r.top + r.height / 2 - vh / 2) / vh;
          img.style.transform = 'translateY(' + (k * -34).toFixed(1) + 'px) scale(1.06)';
        });
      }
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { measureMarq(); onScroll(); });

  // marquee: constant drift plus scroll push
  if (marq && !RM) {
    const loop = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      marqX -= 0.7 + Math.min(Math.abs(dy), 60) * 0.35;
      if (marqHalf && -marqX >= marqHalf) marqX += marqHalf;
      marq.style.transform = 'translate3d(' + marqX.toFixed(1) + 'px,0,0)';
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  // ===== BUILDER DEMO =====
  const ICONS = {
    cup: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M12 22h32v16a14 14 0 0 1-14 14h-4A14 14 0 0 1 12 38z" fill="currentColor"/><path d="M44 26h4a6 6 0 0 1 0 12h-4" fill="none" stroke="currentColor" stroke-width="4"/><path d="M22 6c-3 4 3 6 0 11M32 6c-3 4 3 6 0 11" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
    bag: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M10 22h44l-3 34H13z" fill="currentColor"/><path d="M22 22v-5a10 10 0 0 1 20 0v5" fill="none" stroke="currentColor" stroke-width="4"/></svg>',
    tooth: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M16 10c-6 0-9 5-8 12 1 7 4 9 5 18 1 8 5 12 8 4 1-5 3-9 6-9s5 4 6 9c3 8 7 4 8-4 1-9 4-11 5-18 1-7-2-12-8-12-4 0-6 2-11 2s-7-2-11-2z" fill="currentColor" transform="translate(4 2)"/></svg>'
  };
  const NICHES = [
    { prompt: 'Кофейня в Казани: меню, доставка и заявки на кейтеринг', domain: 'zerno-kazan', name: 'Зерно', links: ['Меню', 'Доставка'], h: 'Свежий кофе в центре Казани', sub: 'Обжариваем сами. Доставка за 40 минут.', btn: 'Заказать', cards: [['Эспрессо', '150 ₽'], ['Флэт уайт', '230 ₽'], ['Фильтр', '190 ₽']], form: 'Кейтеринг на мероприятие', formBtn: 'Заявка', acc: '#8a4a24', tint: '#f4ece4', icon: 'cup', lead: 'Анна: кофе на 30 человек' },
    { prompt: 'Интернет-магазин беговых кроссовок с каталогом и доставкой по России', domain: 'temp-run', name: 'Темп', links: ['Каталог', 'Доставка'], h: 'Кроссовки для бега на любой темп', sub: 'Каталог на 300 моделей. Доставка по России.', btn: 'В каталог', cards: [['Лёгкие', '6 490 ₽'], ['Городские', '5 990 ₽'], ['Трейл', '8 290 ₽']], form: 'Подберём пару под ваш бег', formBtn: 'Подобрать', acc: '#1668e8', tint: '#e6effd', icon: 'bag', lead: 'Игорь: нужен трейл 43 размера' },
    { prompt: 'Стоматология в Новосибирске: услуги, цены и запись на приём', domain: 'ulybka-nsk', name: 'Улыбка', links: ['Услуги', 'Цены'], h: 'Лечим без боли и очередей', sub: 'Осмотр, план лечения и цены сразу.', btn: 'Записаться', cards: [['Чистка', '3 500 ₽'], ['Кариес', '4 200 ₽'], ['Имплант', '38 000 ₽']], form: 'Запись на приём', formBtn: 'Записаться', acc: '#0b8f7a', tint: '#e3f5f1', icon: 'tooth', lead: 'Мария: запись на чистку в субботу' }
  ];

  const tpl = `
    <div class="bw" data-ui>
      <div class="bw__bar"><i></i><i></i><i></i><span class="bw__url">ypage.site/new</span></div>
      <div class="bw__prompt"><p class="bw__typed"><span data-t></span><b class="bw__caret"></b></p><span class="bw__go" aria-hidden="true">Собрать сайт</span></div>
      <div class="bw__status" aria-hidden="true"><span class="bw__stxt" data-s></span><div class="bw__chip" data-chip></div></div>
      <div class="bw__site" data-site>
        <div class="bs-nav"><b data-name></b><span data-l0></span><span data-l1></span><em data-nbtn></em></div>
        <div class="bs-hero"><div><h4 data-h></h4><p data-sub></p><span class="bs-btn" data-btn></span></div><div class="bs-pic" data-pic></div></div>
        <div class="bs-cards" data-cards></div>
        <div class="bs-form"><span data-form></span><em data-fbtn></em></div>
      </div>
      <div class="bw__toast" data-toast><b>Новая заявка в Telegram</b><span data-lead></span></div>
    </div>`;

  function builder(root) {
    root.innerHTML = tpl;
    const bw = $('.bw', root);
    const q = s => $(s, root);
    const typed = q('[data-t]');
    const status = q('[data-s]');
    const site = q('[data-site]');
    const blocks = Array.from(site.children);
    const chip = q('[data-chip]');
    const toast = q('[data-toast]');
    const url = q('.bw__url');
    let tok = 0, cur = 0, visible = true;
    const sleep = (ms, t) => new Promise(r => setTimeout(() => r(t === tok), ms));

    function fill(i) {
      const n = NICHES[i];
      cur = i;
      site.style.setProperty('--tint', n.tint);
      site.style.setProperty('--acc2', n.acc);
      q('[data-name]').textContent = n.name;
      q('[data-l0]').textContent = n.links[0];
      q('[data-l1]').textContent = n.links[1];
      q('[data-nbtn]').textContent = n.btn;
      q('[data-h]').textContent = n.h;
      q('[data-sub]').textContent = n.sub;
      q('[data-btn]').textContent = n.btn;
      q('[data-pic]').innerHTML = ICONS[n.icon];
      q('[data-cards]').innerHTML = n.cards.map(c => '<div class="bs-card"><b>' + c[0] + '</b><span>' + c[1] + '</span></div>').join('');
      q('[data-form]').textContent = n.form;
      q('[data-fbtn]').textContent = n.formBtn;
      q('[data-lead]').textContent = n.lead;
      chip.textContent = 'Опубликовано · ' + n.domain + '.ypage.site';
    }
    function clear() {
      blocks.forEach(b => b.classList.remove('is-in'));
      chip.classList.remove('on');
      toast.classList.remove('on');
      bw.classList.remove('is-press');
      url.textContent = 'ypage.site/new';
      setStatus('');
    }
    function setStatus(txt) {
      status.textContent = txt;
      status.classList.toggle('on', !!txt);
    }
    function instant(fn) {
      bw.classList.add('fast');
      fn();
      void bw.offsetWidth;
      requestAnimationFrame(() => bw.classList.remove('fast'));
    }
    async function type(t) {
      const text = NICHES[cur].prompt;
      typed.textContent = '';
      for (let i = 1; i <= text.length; i++) {
        typed.textContent = text.slice(0, i);
        if (!(await sleep(24 + Math.random() * 22, t))) return false;
      }
      return true;
    }
    async function build(t) {
      bw.classList.add('is-press');
      if (!(await sleep(260, t))) return false;
      bw.classList.remove('is-press');
      const steps = ['Продумываю структуру…', 'Пишу тексты…', 'Подбираю картинки и стиль…', 'Собираю страницу…'];
      for (let i = 0; i < blocks.length; i++) {
        setStatus(steps[i]);
        if (!(await sleep(430, t))) return false;
        blocks[i].classList.add('is-in');
      }
      setStatus('');
      return true;
    }
    async function publish(t) {
      if (!(await sleep(350, t))) return false;
      url.textContent = NICHES[cur].domain + '.ypage.site';
      chip.classList.add('on');
      if (!(await sleep(900, t))) return false;
      toast.classList.add('on');
      return true;
    }
    function finalState(i) {
      tok++;
      fill(i);
      typed.textContent = NICHES[i].prompt;
      instant(() => { blocks.forEach(b => b.classList.add('is-in')); });
      chip.classList.add('on');
      toast.classList.add('on');
      url.textContent = NICHES[i].domain + '.ypage.site';
      setStatus('');
    }
    async function play(i) {
      const t = ++tok;
      instant(clear);
      fill(i);
      typed.textContent = '';
      while (!visible) { if (!(await sleep(300, t))) return false; }
      if (!(await sleep(500, t))) return false;
      if (!(await type(t))) return false;
      if (!(await build(t))) return false;
      return publish(t);
    }
    // phase-driven mode for the "how it works" scene
    async function phase(p, i = 0) {
      const t = ++tok;
      instant(clear);
      fill(i);
      if (p === 1) {
        typed.textContent = '';
        await sleep(250, t);
        await type(t);
        return;
      }
      typed.textContent = NICHES[i].prompt;
      if (p === 2) { await build(t); return; }
      instant(() => blocks.forEach(b => b.classList.add('is-in')));
      await publish(t);
    }
    return { play, phase, finalState, setVisible: v => { visible = v; }, stop: () => { tok++; } };
  }

  // hero demo
  const heroEl = $('#demoHero');
  if (heroEl) {
    const hero = builder(heroEl);
    const chips = $$('.chip');
    let idx = 0, auto = true, token = 0;
    const setChip = i => chips.forEach((c, k) => {
      c.classList.toggle('is-on', k === i);
      c.setAttribute('aria-pressed', String(k === i));
    });
    if (RM) {
      hero.finalState(0);
      chips.forEach((c, k) => c.addEventListener('click', () => { setChip(k); hero.finalState(k); }));
    } else {
      const run = async () => {
        const my = ++token;
        while (auto && my === token) {
          setChip(idx);
          const ok = await hero.play(idx);
          if (!ok || my !== token) return;
          await new Promise(r => setTimeout(r, 3600));
          if (my !== token) return;
          idx = (idx + 1) % NICHES.length;
        }
      };
      chips.forEach((c, k) => c.addEventListener('click', () => {
        auto = false; token++; idx = k; setChip(k);
        hero.play(k).then(ok => { if (ok) setTimeout(() => { if (!auto) { auto = true; idx = (k + 1) % NICHES.length; run(); } }, 9000); });
      }));
      new IntersectionObserver(es => es.forEach(e => hero.setVisible(e.isIntersecting))).observe(heroEl);
      run();
    }
  }

  // how-it-works stage
  const stageEl = $('#demoStage');
  if (stageEl) {
    const stage = builder(stageEl);
    const steps = $$('.step');
    let current = 0;
    const go = n => {
      if (n === current) return;
      current = n;
      steps.forEach((s, k) => s.classList.toggle('is-on', k === n - 1));
      if (RM) stage.finalState(0); else stage.phase(n, 0);
    };
    if (RM) { stage.finalState(0); steps.forEach(s => s.classList.add('is-on')); }
    else {
      const narrow = () => window.matchMedia('(max-width:900px)').matches;
      const pick = () => {
        if (narrow()) return;
        const mid = window.innerHeight * 0.5;
        let best = 0, bd = 1e9;
        steps.forEach((s, k) => {
          const r = s.getBoundingClientRect();
          const d = Math.abs((r.top + Math.min(r.height * 0.3, 160)) - mid);
          if (r.bottom > 0 && r.top < window.innerHeight && d < bd) { bd = d; best = k + 1; }
        });
        if (best) go(best);
      };
      window.addEventListener('scroll', pick, { passive: true });
      // narrow screens: play once, looped, while the stage is visible
      let looping = false;
      new IntersectionObserver(es => es.forEach(e => {
        if (!e.isIntersecting || !narrow() || looping) return;
        looping = true;
        (async () => { for (let n = 1; n <= 3; n++) { current = 0; go(n); await new Promise(r => setTimeout(r, n === 1 ? 3200 : 4200)); } looping = false; })();
      }), { threshold: 0.5 }).observe(stageEl);
      steps[0] && steps[0].classList.add('is-on');
      current = 1; stage.phase(1, 0);
      // restart phase 1 when the scene first comes into view
      let started = false;
      new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting && !started && !narrow()) { started = true; current = 0; go(1); }
      }), { threshold: 0.4 }).observe(stageEl);
    }
  }

  // ===== calculator =====
  const calc = $('#calc');
  if (calc) {
    const packs = $('#packs'), packsOut = $('#packsOut'), shop = $('#shop'), cat = $('#cat');
    const outMonth = $('#outMonth'), outExtra = $('#outExtra'), outList = $('#outList');
    const planName = { 280: 'Старт', 440: 'Pro', 1200: 'Бизнес' };
    const catName = { 1271: '100 товаров', 5928: '1 000 товаров', 25404: '10 000 товаров' };
    const cur = { month: 0, extra: 0 };
    const tween = (el, key, to) => {
      if (RM) { el.textContent = fmt(to); cur[key] = to; return; }
      const from = cur[key], t0 = performance.now(), d = 520;
      cur[key] = to;
      const step = t => {
        const p = Math.min(1, (t - t0) / d);
        el.textContent = fmt(from + (to - from) * (1 - Math.pow(1 - p, 3)));
        if (p < 1 && cur[key] === to) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const plural = n => (n % 10 === 1 && n % 100 !== 11) ? 'пакет' : ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) ? 'пакета' : 'пакетов';
    const update = () => {
      const plan = +calc.elements.plan.value;
      const n = +packs.value;
      const shopOn = shop.checked;
      const catVal = shopOn ? +calc.elements.cat.value : 0;
      const credits = n * 1000;
      const extra = credits + (shopOn ? 10000 : 0) + catVal;
      packsOut.textContent = n === 0 ? 'не нужны' : n + ' ' + plural(n) + ' · ' + fmt(n * 10000) + ' кредитов';
      cat.hidden = !shopOn;
      tween(outMonth, 'month', plan);
      tween(outExtra, 'extra', extra);
      const rows = [['Тариф «' + planName[plan] + '»', fmt(plan) + ' ₽ в месяц']];
      if (n) rows.push(['Кредиты: ' + n + ' ' + plural(n), fmt(credits) + ' ₽']);
      if (shopOn) { rows.push(['Публикация магазина', '10 000 ₽']); rows.push(['Каталог: ' + catName[catVal], fmt(catVal) + ' ₽']); }
      outList.innerHTML = rows.map(r => '<li><span>' + r[0] + '</span><b>' + r[1] + '</b></li>').join('');
    };
    calc.addEventListener('input', update);
    calc.addEventListener('change', update);
    cur.month = 440; cur.extra = 1000;
    update();
  }

  // ===== form -> Cloudflare Worker -> Telegram =====
  const form = $('#leadForm');
  form?.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const label = btn.querySelector('span');
    const orig = label.textContent;
    const fd = new FormData(form);
    const payload = {};
    fd.forEach((v, k) => { payload[k] = v; });
    if (payload._gotcha) return;
    if (!payload.name || !payload.phone || payload.phone.replace(/\D/g, '').length < 11) {
      label.textContent = 'Заполните имя и телефон';
      setTimeout(() => { label.textContent = orig; }, 2400);
      return;
    }
    btn.disabled = true;
    label.textContent = 'Отправляем...';
    try {
      const resp = await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      label.textContent = 'Заявка отправлена';
      form.reset();
    } catch (err) {
      console.error(err);
      label.textContent = 'Ошибка, попробуйте ещё раз';
    } finally {
      setTimeout(() => { label.textContent = orig; btn.disabled = false; }, 3200);
    }
  });

  // ===== init =====
  measureMarq();
  requestAnimationFrame(() => { checkReveal(); onScroll(); });
  window.addEventListener('load', () => { measureMarq(); checkReveal(); });
  setTimeout(checkReveal, 600);
})();
