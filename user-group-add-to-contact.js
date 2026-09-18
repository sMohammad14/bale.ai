(async function() {
  // ⏱️ تاخیر بعد از کلیک روی نام عضو
  const CLICK_MEMBER_NAME_DELAY_RANGE = "100-500";

  // ⏱️ تاخیر بعد از کلیک روی دکمه بیشتر
  const CLICK_MORE_BUTTON_DELAY_RANGE = "100-500";

  // ⏱️ تاخیر بعد از کلیک روی افزودن به مخاطبین
  const CLICK_ADD_TO_CONTACTS_DELAY_RANGE = "100-500";

  // ⏱️ تاخیر بعد از کلیک روی ذخیره
  const CLICK_SAVE_BUTTON_DELAY_RANGE = "1000-2000";

  // ⏱️ تاخیر بعد از بستن مودال
  const CLOSE_MODAL_DELAY_RANGE = "100-1000";

  // ⏱️ تاخیر بعد از اسکرول برای بارگذاری ردیف
  const SCROLL_STEP_DELAY_RANGE = "100-1000";

  // ⏱️ فاصله بین بررسی‌ها در حلقه‌های انتظار
  const POLL_INTERVAL = 1;

  // ⏱️ حداکثر زمان انتظار برای پیدا شدن لیست اعضا
  const TIMEOUT_INITIAL_MEMBER_LIST = 10000;

  // ⏱️ حداکثر زمان انتظار برای باز شدن مودال پروفایل
  const TIMEOUT_PROFILE_MODAL = 5000;

  // ⏱️ حداکثر زمان انتظار برای پیدا شدن نام در پروفایل
  const TIMEOUT_PROFILE_NAME_P = 5000;

  // ⏱️ حداکثر زمان انتظار برای دکمه بیشتر
  const TIMEOUT_MORE_BUTTON = 5000;

  // ⏱️ حداکثر زمان انتظار برای بررسی ربات بودن
  const TIMEOUT_CHECK_BOT = 5000;

  // ⏱️ حداکثر زمان انتظار برای گزینه افزودن به مخاطبین
  const TIMEOUT_FIND_ADD_OPTION = 5000;

  // ⏱️ حداکثر زمان انتظار برای دکمه ذخیره
  const TIMEOUT_FIND_SAVE_BUTTON = 5000;

  // ⏱️ حداکثر زمان انتظار برای بسته شدن مودال
  const TIMEOUT_MODAL_CLOSE = 5000;

  // ⏱️ حداکثر زمان انتظار برای بازگشت به لیست
  const TIMEOUT_LIST_RETURN = 5000;

  // ⏱️ تاخیر تصادفی بعد از هر اسکرول پیش‌بارگذاری
  const PRELOAD_SCROLL_DELAY_RANGE = "200-1000";

  // ⏱️ توقف پس از افزودن هر تعداد مشخصی مخاطب
  const PAUSE_INTERVAL_ADDED = 1500;
  const PAUSE_DURATION_ADDED_MS = 7200000;

  // ⏱️ حداکثر زمان انتظار برای تایید افزوده شدن در IndexedDB
  const TIMEOUT_INDEXEDDB_ADD_CONFIRM = 5000;

  // ⏱️ فاصله بین بررسی‌های IndexedDB برای تایید
  const INDEXEDDB_POLL_INTERVAL = 1;
  
  const INDEXEDDB_NAME = 'db';
  const INDEXEDDB_STORE_NAME = 'contacts';
  const ROW_HEIGHT = 58;

  // نسبت اسکرول در هر گام پیش‌بارگذاری لیست (۰.۸ یعنی ۸۰٪ ارتفاع قابل مشاهده)
  const PRELOAD_SCROLL_STEP_RATIO = 0.8;

  // اگر این تعداد دفعه پشت‌سرهم ایندکس حداکثر افزایش نیافت، پیش‌بارگذاری متوقف شود
  const PRELOAD_STABLE_END_COUNT = 10;

  // حداکثر تعداد اسکرول‌های پیش‌بارگذاری (جلوگیری از حلقه بی‌نهایت)
  const PRELOAD_MAX_SCROLL_ATTEMPTS = 10000;

  // تعداد کل اعضای گروه (اگر 0 باشد، کد خودش تشخیص میده، بهتر هست 3 عدد از تعداد اعضای گروه کم ترباشه)
  const TOTAL_MEMBERS_COUNT = 6437;

  // حداکثر تعداد تلاش برای هر کاربر در صورت نتیجه not-added
  const MAX_NOT_ADDED_RETRIES = 10;

  // حداکثر تعداد تلاش برای بارگذاری یک ردیف نامرئی
  const MAX_ROW_LOAD_ATTEMPTS = 15;

  // لیست UID های مسدود که به مخاطبین اضافه نمی‌شوند (Set)
  const BLOCKED_UIDS = new Set(["-1", "10", "327373"]);

  let totalChecked = 0;
  let alreadyContacts = 0;
  let addedCount = 0;
  let botSkipped = 0;
  let blockedSkipped = 0;
  const processedUIDs = new Set();
  const attemptsMap = new Map();
  const failedUsersList = [];
  const skippedRowList = [];
  let maxKnownIndex = -1;

  function logStep(stepName, startTime) {
    const duration = Date.now() - startTime;
    console.log(`⏱️ ${stepName} → ${duration} ms`);
  }

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

  function isVisible(el) {
    if (!el) return false;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  async function waitForVisibleSelector(selector, timeout, scope = document) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const els = Array.from(scope.querySelectorAll(selector));
      const visible = els.find(isVisible);
      if (visible) return visible;
      await sleep(POLL_INTERVAL);
    }
    throw new Error(`Timeout waiting for ${selector}`);
  }

  async function findVisibleByTextAndTagInScope(text, tag, timeout, scope = document) {
    const start = Date.now();
    const xpathPrefix = (scope === document) ? '//' : './/';
    const xpath = `${xpathPrefix}${tag}[normalize-space(text())='${text}']`;
    while (Date.now() - start < timeout) {
      const result = document.evaluate(xpath, scope, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      const el = result.singleNodeValue;
      if (el && isVisible(el)) return el;
      await sleep(POLL_INTERVAL);
    }
    throw new Error(`Timeout waiting for ${tag} with text "${text}"`);
  }

  async function findVisibleByTextInScope(text, timeout, scope = document) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const all = Array.from(scope.querySelectorAll('div, span, button, a, bdi, p'));
      const found = all.find(el => isVisible(el) && (el.textContent || '').trim().includes(text));
      if (found) return found;
      await sleep(POLL_INTERVAL);
    }
    throw new Error(`Text "${text}" not found`);
  }

  async function waitForMenuOption(scope, text, timeout) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const allInScope = Array.from(scope.querySelectorAll('div, span, button, a, bdi, p'));
      const foundInScope = allInScope.find(el => isVisible(el) && (el.textContent || '').trim().includes(text));
      if (foundInScope) return foundInScope;

      const allDoc = Array.from(document.querySelectorAll('div, span, button, a, bdi, p'));
      const foundDoc = allDoc.find(el => isVisible(el) && (el.textContent || '').trim().includes(text));
      if (foundDoc) return foundDoc;

      await sleep(POLL_INTERVAL);
    }
    throw new Error(`Menu option "${text}" not found`);
  }

  async function waitForProfileName(modal, timeout) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const nameParagraph = modal.querySelector('p.kSqtzD');
      if (nameParagraph && isVisible(nameParagraph)) {
        return nameParagraph;
      }
      await sleep(POLL_INTERVAL);
    }
    return null;
  }

  function getTopOverlay() {
    const overlays = Array.from(document.querySelectorAll('.ReactModal__Overlay')).filter(isVisible);
    return overlays.length > 0 ? overlays[overlays.length - 1] : null;
  }

  function getProfileModal() {
    const overlays = Array.from(document.querySelectorAll('.ReactModal__Overlay')).filter(isVisible);
    for (let i = overlays.length - 1; i >= 0; i--) {
      const overlay = overlays[i];
      const hasMore = overlay.querySelector('.ZGzps0');
      const hasMemberList = overlay.querySelector('tbody[data-testid="virtuoso-item-list"]');
      if (hasMore && !hasMemberList) {
        return overlay;
      }
    }
    return null;
  }

  async function waitForProfileModal(timeout) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const modal = getProfileModal();
      if (modal) return modal;
      await sleep(POLL_INTERVAL);
    }
    throw new Error('Timeout waiting for profile modal');
  }

  function findMoreButton(modal) {
    const modalRect = modal.getBoundingClientRect();
    const buttons = Array.from(modal.querySelectorAll('.ZGzps0')).filter(isVisible);
    const rightHalf = buttons.filter(b => b.getBoundingClientRect().left > modalRect.left + modalRect.width * 0.5);
    if (rightHalf.length > 0) {
      rightHalf.sort((a, b) => b.getBoundingClientRect().left - a.getBoundingClientRect().left);
      return rightHalf[0];
    }
    return null;
  }

  function findCloseButton(modal) {
    const modalRect = modal.getBoundingClientRect();
    const buttons = Array.from(modal.querySelectorAll('.ZGzps0')).filter(isVisible);
    const leftHalf = buttons.filter(b => b.getBoundingClientRect().left < modalRect.left + modalRect.width * 0.5);
    if (leftHalf.length > 0) {
      leftHalf.sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left);
      return leftHalf[0];
    }
    return null;
  }

  async function closeOpenMenu(profileModal) {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27 }));
    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27 }));
    await sleep(getDelay(CLOSE_MODAL_DELAY_RANGE));
  }

  async function closeCurrentModal(modal) {
    const start = Date.now();
    if (!modal) return false;

    const closeBtn = findCloseButton(modal);
    if (closeBtn) {
      closeBtn.click();
      await sleep(getDelay(CLOSE_MODAL_DELAY_RANGE));
    } else {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27 }));
      document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27 }));
      await sleep(getDelay(CLOSE_MODAL_DELAY_RANGE));
    }

    const waitStart = Date.now();
    while (Date.now() - waitStart < TIMEOUT_MODAL_CLOSE) {
      if (!isVisible(modal)) {
        logStep('Close modal', start);
        return true;
      }
      await sleep(POLL_INTERVAL);
    }
    logStep('Close modal timeout', start);
    return false;
  }

  async function returnToListAfterClosing(modal) {
    const start = Date.now();

    let targetModal = modal;
    if (!isVisible(targetModal)) {
      targetModal = getTopOverlay();
    }
    if (!targetModal) return false;

    const closed = await closeCurrentModal(targetModal);
    if (!closed) return false;

    try {
      await waitForVisibleSelector('tbody[data-testid="virtuoso-item-list"]', TIMEOUT_LIST_RETURN);
      logStep('Return to list', start);
      return true;
    } catch (e) {
      logStep('Return to list timeout', start);
      return false;
    }
  }

  function getUIDFromRow(row) {
    const key = Object.keys(row).find(k => k.startsWith('__reactFiber$'));
    if (!key) return null;
    let fiber = row[key];
    while (fiber) {
      const props = fiber.memoizedProps;
      if (props) {
        const uid = props.uid || props.userId || props.peerId ||
          (props.user && props.user.id) ||
          (props.member && props.member.uid) ||
          (props.item && (props.item.uid || props.item.id));
        if (uid) return String(uid);
      }
      fiber = fiber.return;
    }
    return null;
  }

  async function checkUIDInContacts(uid) {
    const id = Number(uid);
    if (isNaN(id)) return false;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(INDEXEDDB_NAME);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        let found = false;
        let tx;
        try {
          tx = db.transaction(INDEXEDDB_STORE_NAME, 'readonly');
        } catch (e) {
          db.close();
          reject(e);
          return;
        }
        const store = tx.objectStore(INDEXEDDB_STORE_NAME);
        const cursorRequest = store.openCursor();

        cursorRequest.onerror = () => {
          db.close();
          reject(cursorRequest.error);
        };

        cursorRequest.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor && !found) {
            if (cursor.value && Number(cursor.value.id) === id) {
              found = true;
            } else {
              cursor.continue();
            }
          }
          if (!cursor || found) {
            db.close();
            resolve(found);
          }
        };
      };
    });
  }

  function getMaxDataIndex(tbody) {
    const rows = tbody.querySelectorAll('tr.GUqHyZ');
    let max = -1;
    rows.forEach(r => {
      const idx = parseInt(r.getAttribute('data-index'), 10);
      if (!isNaN(idx) && idx > max) max = idx;
    });
    return max;
  }

  async function preloadMemberList(container, tbody) {
    console.log('🔄 Preloading member list...');
    container.scrollTop = 0;
    await sleep(getDelay(SCROLL_STEP_DELAY_RANGE));

    let prevMaxIndex = -1;
    let noIncreaseCount = 0;
    let scrollAttempts = 0;

    const targetMaxIndex = (TOTAL_MEMBERS_COUNT > 0) ? TOTAL_MEMBERS_COUNT - 1 : -1;

    while (true) {
      const currentMax = getMaxDataIndex(tbody);
      if (currentMax > prevMaxIndex) {
        prevMaxIndex = currentMax;
        noIncreaseCount = 0;
      } else {
        noIncreaseCount++;
      }

      if (targetMaxIndex >= 0 && prevMaxIndex >= targetMaxIndex) {
        console.log(`📌 Reached target max index ${targetMaxIndex}.`);
        break;
      }

      if (targetMaxIndex < 0 && noIncreaseCount >= PRELOAD_STABLE_END_COUNT) {
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
    }

    maxKnownIndex = prevMaxIndex;
    console.log(`✅ Preload finished. Max index seen: ${maxKnownIndex}. Scrolling back to top...`);
    container.scrollTop = 0;
    await sleep(getDelay(SCROLL_STEP_DELAY_RANGE));
  }

  async function tryLoadRow(targetIndex) {
    for (let attempt = 0; attempt < MAX_ROW_LOAD_ATTEMPTS; attempt++) {
      let row = tbody.querySelector(`tr.GUqHyZ[data-index="${targetIndex}"]`);
      if (row) return row;

      container.scrollTop = targetIndex * ROW_HEIGHT - container.clientHeight / 2;
      await sleep(getDelay(SCROLL_STEP_DELAY_RANGE));

      row = tbody.querySelector(`tr.GUqHyZ[data-index="${targetIndex}"]`);
      if (row) return row;

      const visibleRows = tbody.querySelectorAll('tr.GUqHyZ');
      if (visibleRows.length > 0) {
        const firstIndex = parseInt(visibleRows[0].getAttribute('data-index'), 10);
        const lastIndex = parseInt(visibleRows[visibleRows.length - 1].getAttribute('data-index'), 10);

        if (targetIndex < firstIndex) {
          container.scrollTop -= (firstIndex - targetIndex) * ROW_HEIGHT * 0.5;
        } else if (targetIndex > lastIndex) {
          container.scrollTop += (targetIndex - lastIndex) * ROW_HEIGHT * 0.5;
        } else {
          container.scrollTop += (targetIndex - firstIndex) * ROW_HEIGHT * 0.2;
        }
      } else {
        container.scrollTop = targetIndex * ROW_HEIGHT;
      }

      await sleep(getDelay(SCROLL_STEP_DELAY_RANGE));
    }

    console.warn(`⚠️ Row ${targetIndex} could not be loaded after ${MAX_ROW_LOAD_ATTEMPTS} attempts.`);
    return null;
  }

  const tbody = await waitForVisibleSelector('tbody[data-testid="virtuoso-item-list"]', TIMEOUT_INITIAL_MEMBER_LIST);
  const container = (function() {
    let el = tbody.parentElement;
    while (el && el !== document.body) {
      const style = window.getComputedStyle(el);
      if (style.overflowY === 'auto' || style.overflowY === 'scroll') return el;
      el = el.parentElement;
    }
    return null;
  })();
  if (!container) {
    console.error('❌ Scroll container not found.');
    return;
  }
  console.log('🎯 Scroll container:', container.className);

  await preloadMemberList(container, tbody);

  let totalMembers = TOTAL_MEMBERS_COUNT > 0 ? TOTAL_MEMBERS_COUNT : maxKnownIndex + 1;
  console.log(`ℹ️ Total members to process: ${totalMembers} (max index: ${totalMembers - 1})`);

  // ✅ اصلاح شده: پیدا کردن والد کلیک‌پذیر برای <bdi>
  function findClickableAncestor(element) {
    let el = element;
    while (el && el !== document.body) {
      if (el.matches('[role="button"], [role="menuitem"], button, [data-testid], [tabindex]')) {
        return el;
      }
      el = el.parentElement;
    }
    // اگر والد کلیک‌پذیری پیدا نشد، خود عنصر را برگردان
    return element;
  }

  async function processRow(row, index) {
    const rowStart = Date.now();
    totalChecked++;

    const uid = getUIDFromRow(row);
    const nameText = (row.querySelector('div.ivqFHl')?.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40);
    console.log(`\n🔄 Processing index ${index} | UID: ${uid || 'unknown'} | Name: ${nameText}`);

    if (!uid) {
      console.warn(`⚠️ UID not found for index ${index}, skipping user.`);
      return false;
    }

    if (processedUIDs.has(uid)) {
      console.log(`ℹ️ User ${uid} already processed, skipped.`);
      return 'skipped';
    }

    if (BLOCKED_UIDS.has(uid)) {
      console.log(`ℹ️ User ${uid} is in blocked list, skipping...`);
      processedUIDs.add(uid);
      blockedSkipped++;
      return 'skipped-blocked';
    }

    try {
      const existsBefore = await checkUIDInContacts(uid);
      if (existsBefore) {
        alreadyContacts++;
        processedUIDs.add(uid);
        console.log('ℹ️ User already in contacts (IndexedDB), skipped.');
        return 'already';
      }
    } catch (e) {
      console.error(`❌ IndexedDB pre-check failed for UID ${uid}:`, e);
      return false;
    }

    let stepStart = Date.now();
    const nameDiv = row.querySelector('div.ivqFHl');
    if (!nameDiv) {
      console.warn(`⚠️ Name element not found for index ${index}.`);
      return false;
    }
    nameDiv.click();
    await sleep(getDelay(CLICK_MEMBER_NAME_DELAY_RANGE));
    logStep('Click member name', stepStart);

    stepStart = Date.now();
    let profileModal;
    try {
      profileModal = await waitForProfileModal(TIMEOUT_PROFILE_MODAL);
    } catch (e) {
      console.warn(`❌ Profile modal not opened for index ${index}.`);
      return false;
    }
    logStep('Wait for profile modal', stepStart);

    stepStart = Date.now();
    const nameParagraph = await waitForProfileName(profileModal, TIMEOUT_PROFILE_NAME_P);
    if (nameParagraph) {
      const profileName = nameParagraph.textContent.trim();
      if (profileName === 'Deleted Account' || profileName === 'حساب پاک‌شده') {
        console.log('ℹ️ Deleted Account detected in profile, skipping...');
        processedUIDs.add(uid);
        await closeOpenMenu(profileModal);
        await returnToListAfterClosing(profileModal);
        logStep('Check deleted account', stepStart);
        return 'skipped-deleted';
      }
    }
    logStep('Check deleted account (not deleted)', stepStart);

    stepStart = Date.now();
    let moreBtn = null;
    while (!moreBtn && (Date.now() - stepStart) < TIMEOUT_MORE_BUTTON) {
      moreBtn = findMoreButton(profileModal);
      if (!moreBtn) await sleep(POLL_INTERVAL);
    }
    if (!moreBtn) {
      console.warn(`⚠️ More button not found for index ${index}.`);
      processedUIDs.add(uid);
      await returnToListAfterClosing(profileModal);
      return false;
    }
    logStep('Wait for more button', stepStart);

    stepStart = Date.now();
    console.log('🔘 Clicking more button');
    moreBtn.click();
    await sleep(getDelay(CLICK_MORE_BUTTON_DELAY_RANGE));
    logStep('Click more button + delay', stepStart);

    stepStart = Date.now();
    try {
      await waitForMenuOption(profileModal, 'مسدود و حذف کردن', TIMEOUT_CHECK_BOT);
      botSkipped++;
      processedUIDs.add(uid);
      console.log('ℹ️ Bot detected (block and delete option found), skipping...');
      await closeOpenMenu(profileModal);
      await returnToListAfterClosing(profileModal);
      logStep('Check bot', stepStart);
      return 'bot';
    } catch (e) {}
    logStep('Check bot (not found)', stepStart);

    stepStart = Date.now();
    let addElement;
    // ✅ اصلاح اصلی: جستجوی bdi به جای span
    try {
      addElement = await findVisibleByTextAndTagInScope('افزودن به مخاطبین', 'bdi', TIMEOUT_FIND_ADD_OPTION, profileModal);
    } catch (e) {
      try {
        addElement = await waitForMenuOption(profileModal, 'افزودن به مخاطبین', TIMEOUT_FIND_ADD_OPTION);
      } catch (e2) {
        console.warn(`⚠️ Add option not found for index ${index}.`);
        processedUIDs.add(uid);
        await closeOpenMenu(profileModal);
        await returnToListAfterClosing(profileModal);
        return false;
      }
    }

    const clickTarget = findClickableAncestor(addElement);
    clickTarget.click();
    await sleep(getDelay(CLICK_ADD_TO_CONTACTS_DELAY_RANGE));
    logStep('Click add to contacts', stepStart);

    stepStart = Date.now();
    let saveBtn = null;
    try {
      saveBtn = await waitForVisibleSelector('button[data-testid="confirm-button"]', TIMEOUT_FIND_SAVE_BUTTON, document);
    } catch (e) {
      try {
        saveBtn = await findVisibleByTextAndTagInScope('ذخیره', 'button', TIMEOUT_FIND_SAVE_BUTTON, document);
      } catch (e2) {
        console.warn(`⚠️ Save button not found for index ${index}.`);
        processedUIDs.add(uid);
        await returnToListAfterClosing(profileModal);
        return false;
      }
    }

    saveBtn.click();
    console.log('💾 Save clicked, verifying via IndexedDB...');
    await sleep(getDelay(CLICK_SAVE_BUTTON_DELAY_RANGE));
    logStep('Click save + delay', stepStart);

    stepStart = Date.now();
    let addedConfirmed = false;
    const confirmStart = Date.now();
    while (Date.now() - confirmStart < TIMEOUT_INDEXEDDB_ADD_CONFIRM) {
      try {
        const existsAfter = await checkUIDInContacts(uid);
        if (existsAfter) {
          addedConfirmed = true;
          break;
        }
      } catch (e) {
        console.warn('⚠️ IndexedDB read error during confirmation:', e);
      }
      await sleep(INDEXEDDB_POLL_INTERVAL);
    }

    if (addedConfirmed) {
      console.log('✅ Contact added successfully (IndexedDB verified).');
      processedUIDs.add(uid);
      addedCount++;
      await returnToListAfterClosing(profileModal);
      logStep('Verify: added confirmed via IndexedDB', stepStart);
      return 'added';
    } else {
      console.warn('⚠️ Contact not added (not found in IndexedDB).');
      await returnToListAfterClosing(profileModal);
      logStep('Verify: not added via IndexedDB', stepStart);
      return 'not-added';
    }
  }

  console.log('🚀 Starting automatic contact addition (sequential)...');
  console.log('To stop manually, type stopAutomation() in console.');

  let stopRequested = false;
  window.stopAutomation = () => { stopRequested = true; };

  let targetIndex = 0;

  while (!stopRequested && targetIndex < totalMembers) {
    let row = await tryLoadRow(targetIndex);

    if (!row) {
      skippedRowList.push({ index: targetIndex });
      console.warn(`⏭️ Skipping index ${targetIndex} due to row load failure.`);
      targetIndex++;
      continue;
    }

    const result = await processRow(row, targetIndex);
    console.log(`   Result: ${result}`);

    if (stopRequested) break;

    if (result === 'not-added') {
      const currentAttempt = (attemptsMap.get(targetIndex) || 0) + 1;
      attemptsMap.set(targetIndex, currentAttempt);

      if (currentAttempt >= MAX_NOT_ADDED_RETRIES) {
        const uid = getUIDFromRow(row);
        const name = (row.querySelector('div.ivqFHl')?.textContent || '').trim();
        failedUsersList.push({ index: targetIndex, uid: uid || null, name });
        console.warn(`❌ Skipped index ${targetIndex} after ${currentAttempt} attempts (not-added).`);
        attemptsMap.delete(targetIndex);
        targetIndex++;
      } else {
        console.log(`   🔁 Retrying same index ${targetIndex} (attempt ${currentAttempt}/${MAX_NOT_ADDED_RETRIES})...`);
        await sleep(getDelay(SCROLL_STEP_DELAY_RANGE));
        continue;
      }
    } else {
      attemptsMap.delete(targetIndex);
      targetIndex++;
    }

    if (result === 'added' && addedCount > 0 && addedCount % PAUSE_INTERVAL_ADDED === 0) {
      console.log(`⏸️ Reached ${addedCount} added contacts. Pausing for ${PAUSE_DURATION_ADDED_MS} ms...`);
      await sleep(PAUSE_DURATION_ADDED_MS);
      console.log('▶️ Pause finished. Continuing...');
    }

    if (targetIndex >= totalMembers) {
      console.log('📌 Reached end of list.');
      break;
    }
  }

  console.log('\n🎯 Operation finished.');
  console.log(`📊 Total checked: ${totalChecked}`);
  console.log(`👥 Already in contacts: ${alreadyContacts}`);
  console.log(`🤖 Bot skipped: ${botSkipped}`);
  console.log(`🚫 Blocked by UID list: ${blockedSkipped}`);
  console.log(`➕ Added to contacts: ${addedCount}`);
  console.log(`❌ Failed after ${MAX_NOT_ADDED_RETRIES} attempts (not-added): ${failedUsersList.length}`);
  if (failedUsersList.length > 0) {
    console.log('📋 List of users not added:');
    failedUsersList.forEach(u => console.log(`   Index ${u.index} | UID: ${u.uid || '?'} | Name: ${u.name}`));
    console.log('📋 JSON:', JSON.stringify(failedUsersList));
  }
  console.log(`⏭️ Skipped rows (load failure): ${skippedRowList.length}`);
  if (skippedRowList.length > 0) {
    console.log('📋 Skipped row indices:', JSON.stringify(skippedRowList.map(s => s.index)));
  }
})();
