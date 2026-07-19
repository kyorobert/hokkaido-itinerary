const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const DAYS = [
    { title:'直衝旭川',            date:'8月16日（日）', icon:'🛬' },
    { title:'大雪山秘境＋旭川散策', date:'8月17日（一）', icon:'🏔' },
    { title:'一路南下看花海',       date:'8月18日（二）', icon:'💜' },
    { title:'小樽一日遊',           date:'8月19日（三）', icon:'⛵' },
    { title:'札幌市區散策',         date:'8月20日（四）', icon:'⛩' },
    { title:'回台灣',               date:'8月21日（五）', icon:'✈️' },
  ];
  const TRIP_DATES = ['2026-08-16','2026-08-17','2026-08-18','2026-08-19','2026-08-20','2026-08-21'];
  const CN_NUM = ['一','二','三','四','五','六'];

  let currentToday = null; // 1-6 = 旅行天, 0 = 出發前, 9 = 回國後, null = 非旅程期間也顯示

  // ✅ 用「裝置本地時區」取得今天日期（避免 UTC 換日 bug；蘋果/安卓通用）
  function localDateStr(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  function markTodayInFab(dayNum) {
    document.querySelectorAll('.fab-day').forEach((el, i) => {
      const isT = (i + 1) === dayNum;
      el.classList.toggle('is-today-item', isT);
      const old = el.querySelector('.today-tag');
      if (old) old.remove();
      if (isT) {
        const tag = document.createElement('span');
        tag.className = 'today-tag';
        tag.textContent = '今天';
        el.appendChild(tag);
      }
    });
  }

  function applyToday(dayNum) {
    currentToday = dayNum;
    const banner = document.getElementById('todayBanner');
    document.querySelectorAll('.day-section').forEach(s => s.classList.remove('is-today'));
    banner.className = 'today-banner';
    markTodayInFab(dayNum >= 1 && dayNum <= 6 ? dayNum : 0);

    if (dayNum >= 1 && dayNum <= 6) {
      const sec = document.getElementById('day' + dayNum);
      sec.classList.add('is-today');
      const info = DAYS[dayNum - 1];
      banner.classList.add('d' + dayNum);
      banner.hidden = false;
      document.getElementById('tbIcon').textContent = info.icon;
      document.getElementById('tbLabel').textContent = '今天 · 第' + CN_NUM[dayNum-1] + '天 · ' + info.date;
      document.getElementById('tbMain').textContent = info.title;
      document.getElementById('tbJump').textContent = '回到今天 ↑';
      setTimeout(() => { sec.scrollIntoView({ behavior:prefersReducedMotion.matches ? 'auto' : 'smooth', block:'start' }); }, 400);

    } else if (dayNum === 0) {
      banner.classList.add('before');
      banner.hidden = false;
      document.getElementById('tbIcon').textContent = '🧳';
      // 計算距離出發還有幾天（本地時區，跨月正確）
      const now = new Date();
      const todayMid = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const departMid = new Date(2026, 7, 16); // 2026-08-16 (monthIndex 7 = 8月)
      const daysLeft = Math.round((departMid - todayMid) / 86400000);
      document.getElementById('tbLabel').textContent = '即將出發 · ' + localDateStr(now);
      if (daysLeft > 1) {
        document.getElementById('tbMain').textContent = '距離北海道還有 ' + daysLeft + ' 天！';
      } else if (daysLeft === 1) {
        document.getElementById('tbMain').textContent = '明天就出發囉，準備好行李了嗎？';
      } else {
        document.getElementById('tbMain').textContent = '北海道夏日之旅，準備好了嗎？';
      }
      document.getElementById('tbJump').textContent = '看行程 ↓';

    } else if (dayNum === 9) {
      banner.classList.add('after');
      banner.hidden = false;
      document.getElementById('tbIcon').textContent = '🌸';
      document.getElementById('tbLabel').textContent = '旅程回顧';
      document.getElementById('tbMain').textContent = '北海道の夏，辛苦了！';
      document.getElementById('tbJump').textContent = '重溫 ↑';
    }
  }

  function jumpToToday() {
    if (currentToday >= 1 && currentToday <= 6) {
      document.getElementById('day' + currentToday).scrollIntoView({ behavior:prefersReducedMotion.matches ? 'auto' : 'smooth', block:'start' });
    } else if (currentToday === 0) {
      document.getElementById('tocSection').scrollIntoView({ behavior:prefersReducedMotion.matches ? 'auto' : 'smooth', block:'start' });
    } else {
      window.scrollTo({ top:0, behavior:prefersReducedMotion.matches ? 'auto' : 'smooth' });
    }
  }

  // 浮動快速跳轉
  let fabOpen = false;
  function toggleFab(force) {
    fabOpen = (typeof force === 'boolean') ? force : !fabOpen;
    document.getElementById('fabMenu').classList.toggle('open', fabOpen);
    document.getElementById('fabMain').classList.toggle('open', fabOpen);
    document.getElementById('fabBackdrop').classList.toggle('show', fabOpen);
    document.getElementById('fabMain').setAttribute('aria-expanded', String(fabOpen));
  }
  function gotoDay(n) {
    document.getElementById('day' + n).scrollIntoView({ behavior:prefersReducedMotion.matches ? 'auto' : 'smooth', block:'start' });
    toggleFab(false);
  }

  // ✅ 自動偵測裝置日期 → 對應旅程哪一天（本地時區，蘋果/安卓皆可）
  (function autoDetectToday() {
    const iso = localDateStr(new Date());
    const idx = TRIP_DATES.indexOf(iso);
    if (idx >= 0) {
      applyToday(idx + 1);            // 旅程中：跳到當天
    } else if (iso < TRIP_DATES[0]) {
      applyToday(0);                  // 出發前
    } else if (iso > TRIP_DATES[TRIP_DATES.length - 1]) {
      applyToday(9);                  // 回國後
    }
    // 若日期無法判斷（極少數），則不顯示 banner，頁面照常從頂端瀏覽
  })();
  // ══ Redesign interactions ══
  const reduceMotion = prefersReducedMotion;
  const dayColors = ['#3E86C8','#4E9455','#7E58B8','#3B9C9C','#D19A1F','#E87F4F'];

  function setupReveal() {
    const revealItems = document.querySelectorAll('.tl-item, .meal-block, .season-banner');
    if (reduceMotion.matches || !('IntersectionObserver' in window)) {
      revealItems.forEach(item => item.classList.add('is-revealed'));
      return;
    }
    revealItems.forEach((item, index) => {
      item.classList.add('reveal-ready');
      item.style.setProperty('--reveal-delay', ((index % 5) * 70) + 'ms');
    });
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    }, { threshold:.12, rootMargin:'0px 0px -7% 0px' });
    revealItems.forEach(item => observer.observe(item));
  }

  function setupMealToggles() {
    document.querySelectorAll('.meal-block').forEach((block, index) => {
      const options = [...block.querySelectorAll(':scope > .meal-option')];
      if (options.length <= 3 || block.closest('.booking-card,.time-card')) return;
      const key = 'hokkaido-meal-open-' + index;
      let expanded = false;
      try { expanded = localStorage.getItem(key) === 'true'; } catch (_) {}
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'meal-toggle';
      button.setAttribute('aria-expanded', String(expanded));
      const render = () => {
        options.slice(3).forEach(option => option.classList.toggle('is-collapsed', !expanded));
        button.textContent = expanded ? '收合 ▲' : '展開 ' + options.length + ' 家 ▾';
        button.setAttribute('aria-expanded', String(expanded));
      };
      button.addEventListener('click', () => {
        expanded = !expanded;
        try { localStorage.setItem(key, String(expanded)); } catch (_) {}
        render();
      });
      block.appendChild(button);
      render();
    });
  }

  const hero = document.querySelector('.hero');
  const parallaxTargets = [
    ...document.querySelectorAll('.cloud').values()].map(el => ({el,rate:.2,cssVar:true}));
  parallaxTargets.push({el:document.querySelector('.sun'),rate:.35});
  parallaxTargets.push({el:document.querySelector('.hero-hills'),rate:.5});
  const sections = [...document.querySelectorAll('.day-section')];
  const progress = document.getElementById('readingProgress');
  let scrollQueued = false;

  function updateScrollUI() {
    scrollQueued = false;
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    progress.style.transform = 'scaleX(' + Math.min(1, scrollY / max) + ')';
    let current = 0;
    sections.forEach((section, index) => {
      if (section.getBoundingClientRect().top <= Math.min(180, innerHeight * .35)) current = index;
    });
    document.documentElement.style.setProperty('--progress-color', dayColors[current]);
    document.querySelectorAll('.fab-day').forEach((item, index) => item.classList.toggle('is-current', index === current));
    if (!reduceMotion.matches && hero && scrollY < hero.offsetHeight * 1.3) {
      parallaxTargets.forEach(target => {
        if (!target.el) return;
        const y = (scrollY * target.rate) + 'px';
        if (target.cssVar) target.el.style.setProperty('--parallax-y', y);
        else target.el.style.transform = 'translate3d(0,' + y + ',0)';
      });
    }
  }
  function queueScrollUI() {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(updateScrollUI);
  }
  addEventListener('scroll', queueScrollUI, {passive:true});
  addEventListener('resize', queueScrollUI, {passive:true});
  reduceMotion.addEventListener?.('change', queueScrollUI);

  setupReveal();
  setupMealToggles();
  updateScrollUI();