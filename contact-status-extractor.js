(async function() {
  // ════════════════════════════════════════════════════════════
  // 📋 لیست UIDهایی که باید بررسی شوند
  // ════════════════════════════════════════════════════════════
  const TARGET_UID_LIST = [
    // UIDها را اینجا اضافه کن، مثال:
    // "52", "4532", "34545"
  ];

  // ════════════════════════════════════════════════════════════
  // ⛔ UIDهایی که نباید بررسی شوند
  // ════════════════════════════════════════════════════════════
  const SKIP_UID_LIST = [
    // "49538", "327373"
  ];
  const SKIP_UID_SET = new Set(SKIP_UID_LIST.map(String));

  // ════════════════════════════════════════════════════════════
  // ⏱️ تایمرها و زمان‌بندی‌ها
  // ════════════════════════════════════════════════════════════

  const POLL_INTERVAL = 1; // فاصله چک کردن المنت‌ها (هر چند میلی‌ثانیه یک‌بار DOM بررسی شود)

  const TIMEOUT_CONTACT_NAME = 60000; // حداکثر انتظار برای ظاهر شدن نام مخاطب
  const TIMEOUT_STATUS = 60000;       // حداکثر انتظار برای ظاهر شدن متن وضعیت
  const TIMEOUT_MESSAGE_BOX = 60000;  // حداکثر انتظار برای ظاهر شدن باکس پیام

  const DELAY_AFTER_NAVIGATION_RANGE = "20-200";        // تأخیر تصادفی بعد از رفتن به چت
  const DELAY_BEFORE_READING_STATUS_RANGE = "20-200";    // تأخیر تصادفی قبل از خواندن وضعیت
  const DELAY_BETWEEN_USERS_RANGE = "20-200";           // تأخیر تصادفی بین هر کاربر و کاربر بعدی

  // 🆕 رفتن به صفحه flow بعد از تعداد تصادفی کاربر
  const FLOW_URL = 'https://web.bale.ai/flow';
  const FLOW_VISIT_AFTER_N_USERS_RANGE = "100-200";   // بعد از چند کاربر (تصادفی) برو به flow
  const FLOW_VISIT_PAUSE_RANGE = "5000-10000";     // مدت مکث تصادفی در صفحه flow (میلی‌ثانیه)

  // ════════════════════════════════════════════════════════════
  // 🎯 سلکتورهای DOM
  // ════════════════════════════════════════════════════════════

  const CONTACT_NAME_SELECTOR = '.nMlHDG'; // نام مخاطب بالای چت
  const STATUS_SELECTOR = '#app_main_wrapper > div.main-section-container._ftgZa > div.kvGVCY > div.EFGTGm > div.QHs5iA > p > span'; // متن وضعیت زیر اسم
  const MESSAGE_BOX_SELECTOR = '#editable-message-text'; // باکس پیام

  // 🆕 سلکتور وضعیت برای اکانت‌های پاک‌شده (ساختار DOM متفاوت است)
  const DELETED_STATUS_ALT_SELECTOR = '#app_main_wrapper > div.main-section-container._ftgZa > div.kvGVCY > div.EFGTGm > div.QHs5iA > div > p';

  // 🆕 مقادیر تشخیص اکانت پاک‌شده (نسخه نرمال‌شده — فقط حروف فارسی، بدون فاصله و نیم‌فاصله)
  const DELETED_ACCOUNT_NAME_NORM = 'حسابپاکشده';
  const DELETED_ACCOUNT_STATUS_NORM = 'مدتهاپیشاینجابوده';

  // 🆕 نرمال‌سازی: فقط حروف فارسی (\u0600-\u06FF) نگه داشته می‌شود،
  // همه‌چیز دیگر (فاصله، نیم‌فاصله ZWNJ، علائم، اعداد لاتین و ...) حذف می‌شود
  function normalizePersian(s) {
    return (s || '').replace(/[^\u0600-\u06FF]/g, '');
  }

  // ════════════════════════════════════════════════════════════
  // 🧠 ذخیره‌سازی گروه‌ها
  // ════════════════════════════════════════════════════════════
  const STORAGE_KEY = 'statusGroups';
  const FAILED_STORAGE_KEY = 'statusGroupsFailed'; // کلید ذخیره‌سازی UIDهای ناموفق
  const UNKNOWN_KEY = 'Unknown';

  // 🆕 گروه‌هایی که باید مجدداً بررسی شوند
  const RECHECK_GROUP_KEYWORDS = ['درحال اتصال', 'همگام‌سازی'];
  function isRecheckGroup(name) {
    if (!name) return false;
    return RECHECK_GROUP_KEYWORDS.some(k => name.includes(k));
  }

  // ════════════════════════════════════════════════════════════
  // 🛠️ توابع کمکی
  // ════════════════════════════════════════════════════════════

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms)); // توقف به مدت مشخص

  // Returns current time formatted like "10:20:54 PM"
  function nowTime() {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  }

  // Log helpers with timestamp prefix
  const log = (...args) => console.log(`[${nowTime()}]`, ...args);
  const warn = (...args) => console.warn(`[${nowTime()}]`, ...args);

  // Convert "min-max" range string into a random integer
  function getRandomDelay(rangeStr) {
    const parts = String(rangeStr).split('-');
    const min = parseInt(parts[0], 10);
    const max = parts.length > 1 ? parseInt(parts[1], 10) : min;
    if (isNaN(min) || isNaN(max)) return 1000;
    if (min === max) return min;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Poll the DOM every POLL_INTERVAL ms until the element appears or timeout hits
  async function waitForElement(selector, timeout) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const el = document.querySelector(selector);
      if (el && (el.offsetParent !== null || el.getClientRects().length > 0)) {
        const elapsed = Date.now() - start;
        return { el, elapsed };
      }
      await sleep(POLL_INTERVAL);
    }
    const elapsed = Date.now() - start;
    throw new Error(`Not found after ${elapsed} ms: ${selector}`);
  }

  // Navigate to a contact's chat without a full page reload
  function navigateToContact(uid) {
    const url = `https://web.bale.ai/chat?uid=${uid}`;
    history.pushState({}, '', url);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  // 🆕 Navigate to the flow page without a full page reload
  function navigateToFlow() {
    history.pushState({}, '', FLOW_URL);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  // 🆕 تشخیص اکانت پاک‌شده بر اساس نام و وضعیت (با نرمال‌سازی فارسی)
  function isDeletedAccount() {
    const nameEl = document.querySelector(CONTACT_NAME_SELECTOR);
    const nameText = nameEl ? (nameEl.textContent || '') : '';
    if (normalizePersian(nameText) !== DELETED_ACCOUNT_NAME_NORM) return false;

    let statusText = '';
    const stEl = document.querySelector(STATUS_SELECTOR);
    if (stEl) statusText = (stEl.textContent || '');
    if (!statusText.trim()) {
      const altEl = document.querySelector(DELETED_STATUS_ALT_SELECTOR);
      if (altEl) statusText = (altEl.textContent || '');
    }
    return normalizePersian(statusText) === DELETED_ACCOUNT_STATUS_NORM;
  }

  // ════════════════════════════════════════════════════════════
  // 🗂️ مدیریت گروه‌ها (دائمی از طریق localStorage)
  // ════════════════════════════════════════════════════════════
  let groups = {};
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) groups = JSON.parse(saved);
  } catch (e) {
    warn('Failed to load previous groups:', e);
  }

  // ════════════════════════════════════════════════════════════
  // 🗂️ مدیریت UIDهای ناموفق (تایم‌اوت‌شده‌ها)
  // ساختار: { uid: reason }
  // ════════════════════════════════════════════════════════════
  let failedUIDs = {};
  try {
    const savedFailed = localStorage.getItem(FAILED_STORAGE_KEY);
    if (savedFailed) failedUIDs = JSON.parse(savedFailed);
  } catch (e) {
    warn('Failed to load previous failed UIDs:', e);
  }

  // Save failed UIDs to localStorage
  function persistFailed() {
    try {
      localStorage.setItem(FAILED_STORAGE_KEY, JSON.stringify(failedUIDs));
    } catch (e) {
      warn('Failed to save failed UIDs:', e);
    }
  }

  // ثبت یک UID به‌عنوان ناموفق همراه با دلیل
  function markFailed(uid, reason) {
    failedUIDs[uid] = reason;
    persistFailed();
  }

  // Save groups to localStorage
  function persistGroups() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
    } catch (e) {
      warn('Failed to save groups:', e);
    }
  }

  // Add UID to a group named statusText; skips duplicates
  function addToGroup(statusText, uid) {
    const key = statusText && statusText.trim() ? statusText.trim() : UNKNOWN_KEY;

    // اگر UID قبلاً در گروه دیگری بود، از آن حذفش کن
    for (const k of Object.keys(groups)) {
      if (groups[k].includes(uid)) {
        groups[k] = groups[k].filter(x => x !== uid);
        if (groups[k].length === 0) delete groups[k];
      }
    }

    if (!groups[key]) groups[key] = [];

    // فقط اگر UID تکراری نبود، اضافه کن
    if (!groups[key].includes(uid)) {
      groups[key].push(uid);
    }

    persistGroups();
  }

  // ════════════════════════════════════════════════════════════
  // 🖥️ دستورهای کنسول
  // ════════════════════════════════════════════════════════════

  // نمایش همه آرایه‌ها
  window.showGroups = function() {
    const keys = Object.keys(groups);
    if (keys.length === 0) {
      log('No groups recorded yet.');
      return groups;
    }

    log('=======================================');
    log(`Total groups: ${keys.length}`);
    log('=======================================');

    for (const key of keys) {
      const arr = groups[key];
      log(`\n"${key}" — ${arr.length} users`);
      log(JSON.stringify(arr));
    }

    log('\n---------------------------------------');
    log('Full JSON output:');
    log(JSON.stringify(groups, null, 2));

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(JSON.stringify(groups))
        .then(() => log('Copied to clipboard.'))
        .catch(() => {});
    }
    return groups;
  };

  // نمایش آرایه‌های ذخیره‌شده در localStorage (بدون اجرای اسکریپت اصلی)
  window.showStoredGroups = function() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        log('localStorage is empty (no groups saved).');
        return {};
      }
      const stored = JSON.parse(raw);
      log('Stored groups from localStorage:');
      const keys = Object.keys(stored);
      for (const key of keys) {
        console.log(`"${key}" → ${JSON.stringify(stored[key])}`);
      }
      return stored;
    } catch (e) {
      warn('Failed to read stored groups:', e);
      return {};
    }
  };

  // 📛 نمایش UIDهای ناموفق (تایم‌اوت‌شده‌ها)
  window.showFailedUIDs = function() {
    const keys = Object.keys(failedUIDs);
    if (keys.length === 0) {
      log('No failed UIDs recorded yet.');
      return failedUIDs;
    }

    log('=======================================');
    log(`Failed UIDs: ${keys.length}`);
    log('=======================================');

    const uidsArray = keys;
    log(`Array of failed UIDs:`);
    log(JSON.stringify(uidsArray));

    log('\nDetails (uid → reason):');
    log(JSON.stringify(failedUIDs, null, 2));

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(JSON.stringify(uidsArray))
        .then(() => log('Failed UIDs copied to clipboard.'))
        .catch(() => {});
    }
    return failedUIDs;
  };

  // پاک کردن لیست UIDهای ناموفق
  window.clearFailedUIDs = function() {
    failedUIDs = {};
    try { localStorage.removeItem(FAILED_STORAGE_KEY); } catch (e) {}
    log('Failed UIDs list cleared.');
    return failedUIDs;
  };

  // پاک کردن همه گروه‌ها (حافظه + localStorage)
  window.clearGroups = function() {
    groups = {};
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    log('All groups cleared (memory + localStorage).');
    return groups;
  };

  // فقط localStorage را پاک کن (حافظه دست‌نخورده)
  window.clearStoredGroups = function() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    log('localStorage cleared (in-memory groups untouched).');
    return groups;
  };

  // بارگذاری مجدد گروه‌ها از localStorage به حافظه
  window.reloadGroupsFromStorage = function() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      groups = raw ? JSON.parse(raw) : {};
      log('Groups reloaded from localStorage.');
      log(JSON.stringify(groups, null, 2));
    } catch (e) {
      warn('Failed to reload groups:', e);
    }
    return groups;
  };

  // دانلود فایل JSON از گروه‌ها
  window.downloadGroups = function() {
    const content = JSON.stringify(groups, null, 2);
    const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `status_groups_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    log('File downloaded.');
  };

  // حذف یک UID مشخص از همه گروه‌ها
  window.removeUid = function(uid) {
    const target = String(uid);
    let removed = false;
    for (const k of Object.keys(groups)) {
      if (groups[k].includes(target)) {
        groups[k] = groups[k].filter(x => x !== target);
        removed = true;
        if (groups[k].length === 0) delete groups[k];
      }
    }
    persistGroups();
    log(removed ? `UID ${target} removed from all groups.` : `UID ${target} not found.`);
    return groups;
  };

  // حذف یک گروه کامل با نام مشخص
  window.removeGroup = function(groupName) {
    if (groups[groupName]) {
      delete groups[groupName];
      persistGroups();
      log(`Group "${groupName}" removed.`);
    } else {
      warn(`Group "${groupName}" not found.`);
    }
    return groups;
  };

  // ════════════════════════════════════════════════════════════
  // 🚀 شروع عملیات
  // ════════════════════════════════════════════════════════════
  const targetUIDs = Array.from(new Set(TARGET_UID_LIST.map(String)))
    .filter(uid => !SKIP_UID_SET.has(uid));

  if (targetUIDs.length === 0) {
    log('UID list is empty. Nothing to do.');
    log('Commands:');
    log('  showGroups()              → show current groups');
    log('  showStoredGroups()        → show groups saved in localStorage');
    log('  showFailedUIDs()          → show failed (timed-out) UIDs');
    log('  clearGroups()             → clear memory + localStorage');
    log('  clearStoredGroups()       → clear only localStorage');
    log('  clearFailedUIDs()         → clear failed UIDs list');
    log('  reloadGroupsFromStorage() → reload groups from localStorage');
    log('  downloadGroups()          → download JSON file');
    log('  removeUid(uid)            → remove a UID from all groups');
    log('  removeGroup(name)         → remove an entire group');
    return;
  }

  log(`Starting check of ${targetUIDs.length} UIDs...`);
  log(`Poll interval: ${POLL_INTERVAL} ms`);
  log(`Flow visit after N users: ${FLOW_VISIT_AFTER_N_USERS_RANGE}`);
  log(`Flow visit pause: ${FLOW_VISIT_PAUSE_RANGE} ms`);
  log('To stop: stopChecking()');

  let stopRequested = false;
  window.stopChecking = () => { stopRequested = true; };

  // 🆕 تعیین تعداد کاربران تا رفتن به flow بعدی (تصادفی)
  let usersSinceLastFlowVisit = 0;
  let nextFlowVisitAfter = getRandomDelay(FLOW_VISIT_AFTER_N_USERS_RANGE);
  log(`First flow visit will occur after ${nextFlowVisitAfter} users.`);

  for (let i = 0; i < targetUIDs.length; i++) {
    if (stopRequested) {
      log('Stopped by user.');
      break;
    }

    const uid = targetUIDs[i];

    // محاسبه درصد پیشرفت
    const progressPercent = (((i + 1) / targetUIDs.length) * 100).toFixed(1);

    log(`\n──────── ${i + 1}/${targetUIDs.length} (${progressPercent}%) | UID: ${uid} ────────`);

    try {
      // ── مرحله ۱: رفتن به چت ──────────────────────────────
      navigateToContact(uid);

      const navDelay = getRandomDelay(DELAY_AFTER_NAVIGATION_RANGE);
      log(`Navigation delay: ${navDelay} ms`);
      await sleep(navDelay);

      // ── مرحله ۲: انتظار برای نام مخاطب ────────────────────
      log('Waiting for contact name...');
      try {
        const { elapsed } = await waitForElement(CONTACT_NAME_SELECTOR, TIMEOUT_CONTACT_NAME);
        log(`Contact name found after ${elapsed} ms.`);
      } catch (e) {
        warn(`Contact name not found (${uid}) — ${e.message}`);
      }

      const beforeStatusDelay = getRandomDelay(DELAY_BEFORE_READING_STATUS_RANGE);
      log(`Delay before reading status: ${beforeStatusDelay} ms`);
      await sleep(beforeStatusDelay);

      // 🆕 ── بررسی اکانت پاک‌شده ────────────────────────────
      if (isDeletedAccount()) {
        log(`Deleted account detected (${uid}) — skipping without recording.`);
        // پاک کردن UID از همه گروه‌ها (اگر قبلاً جایی بوده)
        for (const k of Object.keys(groups)) {
          if (groups[k].includes(uid)) {
            groups[k] = groups[k].filter(x => x !== uid);
            if (groups[k].length === 0) delete groups[k];
          }
        }
        persistGroups();
        // حذف از لیست failed (اگر قبلاً ثبت شده بود)
        if (failedUIDs[uid]) {
          delete failedUIDs[uid];
          persistFailed();
        }

        usersSinceLastFlowVisit++;

        // رفتن به flow در صورت لزوم
        if (usersSinceLastFlowVisit >= nextFlowVisitAfter) {
          log(`Going to flow page after ${usersSinceLastFlowVisit} users...`);
          navigateToFlow();
          const flowPause = getRandomDelay(FLOW_VISIT_PAUSE_RANGE);
          log(`Pausing on flow page for ${flowPause} ms...`);
          await sleep(flowPause);
          log('Flow visit finished. Continuing...');
          usersSinceLastFlowVisit = 0;
          nextFlowVisitAfter = getRandomDelay(FLOW_VISIT_AFTER_N_USERS_RANGE);
          log(`Next flow visit will occur after ${nextFlowVisitAfter} users.`);
        }

        const betweenDelaySkip = getRandomDelay(DELAY_BETWEEN_USERS_RANGE);
        log(`Delay until next user: ${betweenDelaySkip} ms`);
        await sleep(betweenDelaySkip);
        continue;
      }

      // ── مرحله ۳: انتظار برای متن وضعیت ────────────────────
      log('Waiting for status text...');
      let statusText = UNKNOWN_KEY;
      let statusOk = false;
      try {
        const { el, elapsed } = await waitForElement(STATUS_SELECTOR, TIMEOUT_STATUS);
        statusText = (el.textContent || '').trim().replace(/\s+/g, ' ');
        if (!statusText) statusText = UNKNOWN_KEY;
        statusOk = true;
        log(`Status found after ${elapsed} ms: "${statusText}"`);
      } catch (e) {
        warn(`Status not found (${uid}) — ${e.message} → recorded as failed`);
        // ثبت UID به‌عنوان ناموفق با دلیل
        markFailed(uid, `Status timeout: ${e.message}`);
      }

      // ── مرحله ۴: انتظار برای باکس پیام ────────────────────
      log('Waiting for message box...');
      try {
        const { elapsed } = await waitForElement(MESSAGE_BOX_SELECTOR, TIMEOUT_MESSAGE_BOX);
        log(`Message box found after ${elapsed} ms.`);
      } catch (e) {
        warn(`Message box not found for ${uid} — ${e.message}`);
      }

      // ── مرحله ۵: ثبت در گروه ─────────────────────────────
      // اگر وضعیت با موفقیت خوانده شد، در گروه ثبت کن
      if (statusOk) {
        addToGroup(statusText, uid);
        log(`Saved in group "${statusText}".`);
      } else {
        log(`Skipped group assignment for ${uid} (status was not found).`);
      }
      usersSinceLastFlowVisit++;

      // 🆕 ── رفتن به صفحه flow بعد از تعداد مشخصی کاربر ─────
      if (usersSinceLastFlowVisit >= nextFlowVisitAfter) {
        log(`Going to flow page after ${usersSinceLastFlowVisit} users...`);
        navigateToFlow();
        const flowPause = getRandomDelay(FLOW_VISIT_PAUSE_RANGE);
        log(`Pausing on flow page for ${flowPause} ms...`);
        await sleep(flowPause);
        log('Flow visit finished. Continuing...');
        usersSinceLastFlowVisit = 0;
        nextFlowVisitAfter = getRandomDelay(FLOW_VISIT_AFTER_N_USERS_RANGE);
        log(`Next flow visit will occur after ${nextFlowVisitAfter} users.`);
      }

      const betweenDelay = getRandomDelay(DELAY_BETWEEN_USERS_RANGE);
      log(`Delay until next user: ${betweenDelay} ms`);
      await sleep(betweenDelay);

    } catch (err) {
      warn(`Unexpected error for ${uid}: ${err.message}`);
      addToGroup(UNKNOWN_KEY, uid);
      markFailed(uid, `Unexpected error: ${err.message}`);
    }
  }

  // ════════════════════════════════════════════════════════════
  // 🔁 بررسی مجدد UIDهای «درحال اتصال...» و «همگام‌سازی...»
  // ════════════════════════════════════════════════════════════
  const recheckUIDs = [];
  for (const key of Object.keys(groups)) {
    if (isRecheckGroup(key)) {
      for (const uid of groups[key]) {
        if (!recheckUIDs.includes(uid)) recheckUIDs.push(uid);
      }
    }
  }

  if (recheckUIDs.length === 0) {
    log('\nNo UIDs in "درحال اتصال..." / "همگام‌سازی..." groups to recheck.');
  } else {
    log('\n=======================================');
    log(`Rechecking ${recheckUIDs.length} UIDs from "درحال اتصال..." / "همگام‌سازی..."`);
    log('=======================================');

    for (let j = 0; j < recheckUIDs.length; j++) {
      if (stopRequested) {
        log('Recheck stopped by user.');
        break;
      }

      const uid = recheckUIDs[j];
      log(`\n──── recheck ${j + 1}/${recheckUIDs.length} | UID: ${uid} ────`);

      try {
        navigateToContact(uid);
        await sleep(getRandomDelay(DELAY_AFTER_NAVIGATION_RANGE));

        try {
          await waitForElement(CONTACT_NAME_SELECTOR, TIMEOUT_CONTACT_NAME);
        } catch (e) {
          warn(`Contact name not found (${uid}) — ${e.message}`);
        }

        await sleep(getRandomDelay(DELAY_BEFORE_READING_STATUS_RANGE));

        // 🆕 بررسی اکانت پاک‌شده در فاز recheck
        if (isDeletedAccount()) {
          log(`Deleted account detected during recheck (${uid}) — removing from all groups.`);
          for (const k of Object.keys(groups)) {
            if (groups[k].includes(uid)) {
              groups[k] = groups[k].filter(x => x !== uid);
              if (groups[k].length === 0) delete groups[k];
            }
          }
          persistGroups();
          if (failedUIDs[uid]) {
            delete failedUIDs[uid];
            persistFailed();
          }
          await sleep(getRandomDelay(DELAY_BETWEEN_USERS_RANGE));
          continue;
        }

        let newStatus = null;
        try {
          const { el } = await waitForElement(STATUS_SELECTOR, TIMEOUT_STATUS);
          newStatus = (el.textContent || '').trim().replace(/\s+/g, ' ');
          if (!newStatus) newStatus = UNKNOWN_KEY;
        } catch (e) {
          warn(`Recheck: status not found (${uid}) — ${e.message}`);
        }

        if (newStatus && !isRecheckGroup(newStatus)) {
          // addToGroup خودش UID را از گروه قبلی حذف می‌کند
          addToGroup(newStatus, uid);
          log(`UID ${uid} moved to group "${newStatus}".`);
        } else if (newStatus) {
          log(`UID ${uid} still in "${newStatus}" — kept as is.`);
        } else {
          log(`UID ${uid} skipped (status not read).`);
        }

        await sleep(getRandomDelay(DELAY_BETWEEN_USERS_RANGE));
      } catch (err) {
        warn(`Recheck error for ${uid}: ${err.message}`);
      }
    }
  }

  // ════════════════════════════════════════════════════════════
  // 📊 خلاصه پایانی
  // ════════════════════════════════════════════════════════════
  log('\n=======================================');
  log('Operation finished.');
  log('=======================================');
  window.showGroups();

  // نمایش آرایه UIDهای ناموفق
  const failedArray = Object.keys(failedUIDs);
  log('\n=======================================');
  log(`Failed UIDs array (${failedArray.length}):`);
  log('=======================================');
  log(JSON.stringify(failedArray));

  log('\nCommands:');
  log('  showGroups()              → show current groups');
  log('  showStoredGroups()        → show groups saved in localStorage');
  log('  showFailedUIDs()          → show failed (timed-out) UIDs');
  log('  clearGroups()             → clear memory + localStorage');
  log('  clearStoredGroups()       → clear only localStorage');
  log('  clearFailedUIDs()         → clear failed UIDs list');
  log('  reloadGroupsFromStorage() → reload groups from localStorage');
  log('  downloadGroups()          → download JSON file');
  log('  removeUid(uid)            → remove a UID from all groups');
  log('  removeGroup(name)         → remove an entire group');

})();
