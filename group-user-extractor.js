(async function autoExtract() {
  // یکم وایسه برای لود اولیه
  await new Promise(r => setTimeout(r, 1000));

  // تلاش برای یافتن کانتینر اسکرول (N9_tF_)
  const container = document.querySelector('.N9_tF_');
  if (!container) {
    console.log(' کانتینر .N9_tF_ پیدا نشد. صفحهٔ اعضای گروه را باز نکرده.');
    return;
  }

  // پیدا کردن tbody
  const tbody = container.querySelector('tbody[data-testid="virtuoso-item-list"]') || container.querySelector('tbody');
  if (!tbody) {
    console.error('tbody پیدا نکرد .');
    return;
  }

  // ═══════════════════════════════════════════
  // ⚙️ ثابت‌های اسکرول (منطق کد دوم)
  // ═══════════════════════════════════════════
  const PRELOAD_SCROLL_STEP_RATIO = 0.8;          // نسبت اسکرول در هر گام
  const PRELOAD_STABLE_END_COUNT = 10;            // تعداد اسکرول بدون افزایش → توقف
  const PRELOAD_MAX_SCROLL_ATTEMPTS = 10000;      // سقف اسکرول‌ها
  const PRELOAD_SCROLL_DELAY_RANGE = "200-1500";  // تأخیر تصادفی بین اسکرول‌ها

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  function getDelay(range) {
    if (typeof range === 'string' && range.includes('-')) {
      const parts = range.split('-');
      if (parts.length === 2) {
        const min = parseInt(parts[0].trim(), 10);
        const max = parseInt(parts[1].trim(), 10);
        if (!isNaN(min) && !isNaN(max)) {
          if (min === max) return min;
          return Math.floor(Math.random() * (max - min + 1)) + min;
        }
      }
    }
    return range;
  }

  const uidSet = new Set();

  // استخراج UID از یک ردیف با استفاده از React Fiber
  function getUID(row) {
    const key = Object.keys(row).find(k => k.startsWith('__reactFiber$'));
    if (!key) return null;
    let fiber = row[key];
    while (fiber) {
      const p = fiber.memoizedProps;
      if (p) {
        const uid = p.uid || p.userId || p.peerId ||
          (p.user && p.user.id) ||
          (p.member && p.member.uid) ||
          (p.item && (p.item.uid || p.item.id));
        if (uid) return String(uid);
      }
      fiber = fiber.return;
    }
    return null;
  }

  // گرفتن بیشترین data-index موجود در tbody
  function getMaxDataIndex(tb) {
    const rows = tb.querySelectorAll('tr.GUqHyZ');
    let max = -1;
    rows.forEach(r => {
      const idx = parseInt(r.getAttribute('data-index'), 10);
      if (!isNaN(idx) && idx > max) max = idx;
    });
    return max;
  }

  // جمع‌آوری UID از ردیف‌های فعلی
  const collectUIDs = () => {
    const rows = tbody.querySelectorAll('tr.GUqHyZ');
    rows.forEach(r => {
      const uid = getUID(r);
      if (uid) uidSet.add(uid);
    });
  };

  // Observer برای ردیف‌های جدید
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType === 1 && node.tagName === 'TR' && node.classList.contains('GUqHyZ')) {
          const uid = getUID(node);
          if (uid) uidSet.add(uid);
        }
      }
    }
  });
  observer.observe(tbody, { childList: true, subtree: true });

  console.log('🔄 شروع اسکرول از ابتدا تا انتها...');

  // برگرد به بالا و جمع‌آوری اولیه
  container.scrollTop = 0;
  await sleep(getDelay(PRELOAD_SCROLL_DELAY_RANGE));
  collectUIDs();

  let prevMaxIndex = -1;
  let noIncreaseCount = 0;
  let scrollAttempts = 0;

  // ═══════════════════════════════════════════
  // 🔁 حلقهٔ اسکرول با منطق کد دوم
  // ═══════════════════════════════════════════
  while (true) {
    const currentMax = getMaxDataIndex(tbody);
    if (currentMax > prevMaxIndex) {
      prevMaxIndex = currentMax;
      noIncreaseCount = 0;
    } else {
      noIncreaseCount++;
    }

    // ✅ تشخیص رسیدن به انتهای لیست
    const atBottom = (container.scrollTop + container.clientHeight) >= (container.scrollHeight - 5);
    if (atBottom && scrollAttempts > 0) {
      console.log(`📌 Reached bottom of list. Last row index detected: ${prevMaxIndex}`);
      break;
    }

    if (noIncreaseCount >= PRELOAD_STABLE_END_COUNT) {
      console.log(`📌 Preload stopped after ${noIncreaseCount} stable scrolls.`);
      break;
    }

    if (scrollAttempts >= PRELOAD_MAX_SCROLL_ATTEMPTS) {
      console.warn('⚠️ Max scroll attempts reached.');
      break;
    }

    const step = container.clientHeight * PRELOAD_SCROLL_STEP_RATIO;
    container.scrollTop += step;
    scrollAttempts++;

    await sleep(getDelay(PRELOAD_SCROLL_DELAY_RANGE));
    collectUIDs();
  }

  collectUIDs();
  observer.disconnect();

  console.log(`پایان اسکرول. تعداد UID های یکتا: ${uidSet.size}`);
  console.log(JSON.stringify(Array.from(uidSet)));
  console.log('آرایه کپی بشه.');
})();
