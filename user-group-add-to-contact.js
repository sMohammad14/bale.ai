(async function() {
  // =====================================================
  //  تنظیمات تاخیرهای جداگانه برای هر بخش
  // =====================================================

  // ---------- تاخیرهای ثابت بعد از کلیک‌ها ----------

  // بعد از کلیک روی نام عضو تا باز شدن کامل پروفایل
  const CLICK_MEMBER_NAME_DELAY = 200;

  // بعد از کلیک روی دکمه «بیشتر» تا باز شدن منو
  const CLICK_MORE_BUTTON_DELAY = 200;

  // بعد از کلیک روی «افزودن به مخاطبین» تا باز شدن صفحهٔ ویرایش نام
  const CLICK_ADD_TO_CONTACTS_DELAY = 1000;

  // بعد از کلیک روی «ذخیره» تا بسته شدن صفحهٔ ویرایش و بازگشت به پروفایل
  const CLICK_SAVE_BUTTON_DELAY = 200;

  // بعد از بستن پنجره/مودال تا بازگشت به لیست اعضا
  const CLOSE_MODAL_DELAY = 200;

  // بعد از اسکرول به موقعیت تقریبی یک ایندکس نامرئی
  const SCROLL_STEP_DELAY = 200;

  //  فاضله بین بررسی‌های مجدد در حلقه‌های انتظار 

  // در همهٔ توابع انتظار استفاده می‌شود؛ هر چند میلی‌ثانیه وضعیت را چک می‌کنیم.
  const POLL_INTERVAL = 1;

  // ---------- حداکثر زمان انتظار برای هر مورد خاص ----------

  // انتظار اولیه برای پیدا شدن لیست اعضا (tbody) در ابتدای کار
  const TIMEOUT_INITIAL_MEMBER_LIST = 10000;

  // انتظار برای باز شدن و پیدا شدن مودال پروفایل کاربر
  const TIMEOUT_PROFILE_MODAL = 300;

  // انتظار برای پیدا شدن نام کاربر در پروفایل (p.kSqtzD)
  const TIMEOUT_PROFILE_NAME_P = 500;

  // انتظار برای ظاهر شدن دکمه «بیشتر» در مودال پروفایل
  const TIMEOUT_MORE_BUTTON = 300;

  // انتظار برای تشخیص گزینه «ویرایش نام» در منو (یعنی کاربر قبلاً مخاطب است)
  const TIMEOUT_CHECK_ALREADY_CONTACT = 300;

  // انتظار برای تشخیص گزینه «مسدود و حذف کردن» در منو (یعنی ربات است)
  const TIMEOUT_CHECK_BOT = 300;

  // انتظار برای پیدا کردن گزینه «افزودن به مخاطبین» در منو
  const TIMEOUT_FIND_ADD_OPTION = 300;

  // انتظار برای پیدا کردن دکمه «ذخیره» در صفحهٔ ویرایش نام
  const TIMEOUT_FIND_SAVE_BUTTON = 300;

  // انتظار برای ظاهر شدن دکمه «بیشتر» هنگام تایید نهایی بعد از ذخیره
  const TIMEOUT_VERIFY_MORE_BUTTON = 300;

  // انتظار برای تایید موفقیت با دیدن «ویرایش نام» در منوی تایید
  const TIMEOUT_VERIFY_EDIT_NAME = 300;

  // انتظار برای تایید عدم موفقیت با دیدن «افزودن به مخاطبین» در منوی تایید
  const TIMEOUT_VERIFY_ADD_OPTION = 300;

  // حداکثر انتظار برای بسته شدن کامل یک مودال
  const TIMEOUT_MODAL_CLOSE = 5000;

  // حداکثر انتظار برای بازگشت به لیست اعضا (دیده شدن دوباره tbody)
  const TIMEOUT_LIST_RETURN = 4000;

  // ارتفاع تقریبی هر ردیف در لیست برای محاسبه اسکرول
  const ROW_HEIGHT = 58;


  let totalChecked = 0;
  let alreadyContacts = 0;
  let addedCount = 0;
  let botSkipped = 0;
  const processedUIDs = new Set();


  function logStep(stepName, startTime) {
    const duration = Date.now() - startTime;
    console.log(`${stepName} → ${duration} ms`);
  }

  const sleep = ms => new Promise(r => setTimeout(r, ms));

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

  async function findVisibleByTextAndTag(text, tag, timeout) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const xpath = `//${tag}[text()='${text}']`;
      const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      const el = result.singleNodeValue;
      if (el && isVisible(el)) return el;
      await sleep(POLL_INTERVAL);
    }
    throw new Error(`Timeout waiting for ${tag} with text "${text}"`);
  }

  async function findVisibleByText(text, timeout) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const all = Array.from(document.querySelectorAll('div, span, button, a'));
      const found = all.find(el => isVisible(el) && (el.textContent || '').trim().includes(text));
      if (found) return found;
      await sleep(POLL_INTERVAL);
    }
    throw new Error(`Text "${text}" not found`);
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
    return overlays.length > 0 ? overlays[overlays.length - 1] : null;
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

  async function closeCurrentModal(modal) {
    const start = Date.now();
    if (!modal) return false;

    const closeBtn = findCloseButton(modal);
    if (closeBtn) {
      closeBtn.click();
      await sleep(CLOSE_MODAL_DELAY);
    } else {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27 }));
      document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27 }));
      await sleep(CLOSE_MODAL_DELAY);
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
    const closed = await closeCurrentModal(modal);
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
    console.error('Scroll container not found.');
    return;
  }
  console.log('Scroll container:', container.className);



  async function processRow(row, index) {
    const rowStart = Date.now();
    totalChecked++;

    const uid = getUIDFromRow(row);
    const nameText = (row.querySelector('div.ivqFHl')?.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40);
    console.log(`\n Processing index ${index} | UID: ${uid || 'unknown'} | Name: ${nameText}`);

    if (uid && processedUIDs.has(uid)) {
      console.log(`User ${uid} already processed, skipped.`);
      return 'skipped';
    }


    let stepStart = Date.now();
    const nameDiv = row.querySelector('div.ivqFHl');
    if (!nameDiv) {
      console.warn(` Name element not found for index ${index}.`);
      return false;
    }
    nameDiv.click();
    await sleep(CLICK_MEMBER_NAME_DELAY);
    logStep('Click member name', stepStart);


    stepStart = Date.now();
    const profileModal = getProfileModal();
    if (!profileModal) {
      console.warn(`❌ Profile modal not opened for index ${index}.`);
      return false;
    }
    logStep('Find profile modal', stepStart);


    stepStart = Date.now();
    const nameParagraph = profileModal.querySelector('p.kSqtzD');
    if (nameParagraph) {
      const profileName = nameParagraph.textContent.trim();
      if (profileName === 'Deleted Account' || profileName === 'حساب پاک‌شده') {
        console.log(' Deleted Account detected in profile, skipping...');
        if (uid) processedUIDs.add(uid);
        await closeCurrentModal(profileModal);
        await waitForVisibleSelector('tbody[data-testid="virtuoso-item-list"]', TIMEOUT_LIST_RETURN);
        logStep('Check deleted account', stepStart);
        return 'skipped-deleted';
      }
    }
    logStep('Check deleted account (not found)', stepStart);


    stepStart = Date.now();
    let moreBtn = null;
    while (!moreBtn && (Date.now() - stepStart) < TIMEOUT_MORE_BUTTON) {
      moreBtn = findMoreButton(profileModal);
      if (!moreBtn) await sleep(POLL_INTERVAL);
    }
    if (!moreBtn) {
      console.warn(` More button not found for index ${index}.`);
      if (uid) processedUIDs.add(uid);
      await returnToListAfterClosing(profileModal);
      return false;
    }
    logStep('Wait for more button', stepStart);


    stepStart = Date.now();
    console.log(' Clicking more button');
    moreBtn.click();
    await sleep(CLICK_MORE_BUTTON_DELAY);
    logStep('Click more button + delay', stepStart);


    stepStart = Date.now();
    try {
      await findVisibleByText('ویرایش نام', TIMEOUT_CHECK_ALREADY_CONTACT);
      alreadyContacts++;
      if (uid) processedUIDs.add(uid);
      console.log(' User already in contacts, skipped.');
      document.body.click(); 
      await returnToListAfterClosing(profileModal);
      logStep('Check already in contacts', stepStart);
      return 'already';
    } catch (e) {}
    logStep('Check already in contacts (not found)', stepStart);


    stepStart = Date.now();
    try {
      await findVisibleByText('مسدود و حذف کردن', TIMEOUT_CHECK_BOT);
      botSkipped++;
      if (uid) processedUIDs.add(uid);
      console.log(' Bot detected (block and delete option found), skipping...');
      document.body.click(); 
      await returnToListAfterClosing(profileModal);
      logStep('Check bot', stepStart);
      return 'bot';
    } catch (e) {}
    logStep('Check bot (not found)', stepStart);


    stepStart = Date.now();
    let addSpan;
    try {
      addSpan = await findVisibleByTextAndTag('افزودن به مخاطبین', 'span', TIMEOUT_FIND_ADD_OPTION);
    } catch (e) {
      try {
        addSpan = await findVisibleByText('افزودن به مخاطبین', TIMEOUT_FIND_ADD_OPTION);
      } catch (e2) {
        console.warn(`Add option not found for index ${index}.`);
        if (uid) processedUIDs.add(uid);
        await returnToListAfterClosing(profileModal);
        return false;
      }
    }
    addSpan.click();
    await sleep(CLICK_ADD_TO_CONTACTS_DELAY);
    logStep('Click add to contacts', stepStart);


    stepStart = Date.now();
    let saveBtn;
    try {
      saveBtn = await findVisibleByTextAndTag('ذخیره', 'button', TIMEOUT_FIND_SAVE_BUTTON);
    } catch (e) {
      console.warn(`Save button not found for index ${index}.`);
      if (uid) processedUIDs.add(uid);
      await returnToListAfterClosing(profileModal);
      return false;
    }
    saveBtn.click();
    console.log('Save clicked, verifying contact status...');
    await sleep(CLICK_SAVE_BUTTON_DELAY);
    logStep('Click save + delay', stepStart);


    stepStart = Date.now();
    let verifyBtn = null;
    while (!verifyBtn && (Date.now() - stepStart) < TIMEOUT_VERIFY_MORE_BUTTON) {
      verifyBtn = findMoreButton(profileModal);
      if (!verifyBtn) await sleep(POLL_INTERVAL);
    }
    if (!verifyBtn) {
      console.warn(`Could not find more button to verify status for index ${index}.`);
      if (uid) processedUIDs.add(uid);
      await returnToListAfterClosing(profileModal);
      return false;
    }

    verifyBtn.click();
    await sleep(CLICK_MORE_BUTTON_DELAY);
    logStep('Verify: click more button + delay', stepStart);


    stepStart = Date.now();
    try {
      await findVisibleByText('ویرایش نام', TIMEOUT_VERIFY_EDIT_NAME);
      console.log('Contact added successfully (verified via menu).');
      if (uid) processedUIDs.add(uid);
      addedCount++;
      document.body.click(); 
      await returnToListAfterClosing(profileModal);
      logStep('Verify: added confirmed', stepStart);
      return 'added';
    } catch (e) {}

    try {
      await findVisibleByText('افزودن به مخاطبین', TIMEOUT_VERIFY_ADD_OPTION);
      console.warn('Contact not added (still shows add option).');
      document.body.click(); 
      await returnToListAfterClosing(profileModal);
      logStep('Verify: not added', stepStart);
      return 'not-added';
    } catch (e) {}

    console.warn('Verification menu unknown state.');
    await returnToListAfterClosing(profileModal);
    logStep('Verify: unknown state', stepStart);
    console.log(`   Row total time: ${Date.now() - rowStart} ms`);
    return false;
  }

 
  console.log('Starting automatic contact addition (sequential)...');
  console.log('To stop manually, type stopAutomation() in console.');

  let stopRequested = false;
  window.stopAutomation = () => { stopRequested = true; };

  let targetIndex = 0;

  while (!stopRequested) {
    let row = tbody.querySelector(`tr.GUqHyZ[data-index="${targetIndex}"]`);

    if (!row) {
      container.scrollTop = targetIndex * ROW_HEIGHT - container.clientHeight / 2;
      await sleep(SCROLL_STEP_DELAY);
      continue;
    }

    const result = await processRow(row, targetIndex);
    console.log(`   Result: ${result}`);

    if (stopRequested) break;

    if (result === 'not-added') {
      console.log(`Retrying same index ${targetIndex}...`);
      await sleep(SCROLL_STEP_DELAY);
      continue;
    }

    targetIndex++;

    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 5 && targetIndex > 0) {
      const nextRow = tbody.querySelector(`tr.GUqHyZ[data-index="${targetIndex}"]`);
      if (!nextRow) {
        console.log(' Reached end of list.');
        break;
      }
    }
  }

  console.log('\n Operation finished.');
  console.log(` Total checked: ${totalChecked}`);
  console.log(` Already in contacts: ${alreadyContacts}`);
  console.log(` Bot skipped: ${botSkipped}`);
  console.log(` Added to contacts: ${addedCount}`);
})();
