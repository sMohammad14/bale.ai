(async function autoExtract() {
  // یکم وایسه برای لود اولیه
  await new Promise(r => setTimeout(r, 300));

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

  const uidSet = new Set();
  let stableCount = 0;

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

  console.log('هر 0.2 ثانیه');

  // اسکرول تا انتها
  while (stableCount < 5) {
    const prevScroll = container.scrollTop;
    const prevRows = tbody.querySelectorAll('tr.GUqHyZ').length;

    container.scrollTop += container.clientHeight * 0.3;
    await new Promise(r => setTimeout(r, 200));

    const currScroll = container.scrollTop;
    const currRows = tbody.querySelectorAll('tr.GUqHyZ').length;

    if (Math.abs(currScroll - prevScroll) < 1 && currRows === prevRows) {
      stableCount++;
    } else {
      stableCount = 0;
    }
  }

  observer.disconnect();
  console.log(`پایان اسکرول. تعداد UID های یکتا: ${uidSet.size}`);
  console.log(JSON.stringify(Array.from(uidSet)));
  console.log('آرایه کپی بشه.');
})();
