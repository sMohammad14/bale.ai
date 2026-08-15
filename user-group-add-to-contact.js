(async function() {
  // Configuration
  const ROW_HEIGHT = 58;          //  عرض ریدف عا
  const STEP_DELAY = 1000;        // تاخیر بین هر مرحله از عملیات
  const POLL_MS = 100;            // تاخیر بررسی المنت

  let totalChecked = 0;
  let alreadyContacts = 0;
  let addedCount = 0;

  const processedUIDs = new Set();

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  function isVisible(el) {
    if (!el) return false;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  async function waitForVisibleSelector(selector, timeout = 5000, scope = document) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const els = Array.from(scope.querySelectorAll(selector));
      const visible = els.find(isVisible);
      if (visible) return visible;
      await sleep(POLL_MS);
    }
    throw new Error(`Timeout waiting for ${selector}`);
  }

  async function findVisibleByTextAndTag(text, tag, timeout = 5000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const xpath = `//${tag}[text()='${text}']`;
      const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      const el = result.singleNodeValue;
      if (el && isVisible(el)) return el;
      await sleep(POLL_MS);
    }
    throw new Error(`Timeout waiting for ${tag} with text "${text}"`);
  }

  async function findVisibleByText(text, timeout = 4000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const all = Array.from(document.querySelectorAll('div, span, button, a'));
      const found = all.find(el => isVisible(el) && (el.textContent || '').trim().includes(text));
      if (found) return found;
      await sleep(POLL_MS);
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
    if (!modal) return false;
    const closeBtn = findCloseButton(modal);
    if (closeBtn) {
      closeBtn.click();
      await sleep(STEP_DELAY);
    } else {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27 }));
      document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27 }));
      await sleep(STEP_DELAY);
    }

    const start = Date.now();
    while (Date.now() - start < 5000) {
      if (!isVisible(modal)) return true;
      await sleep(POLL_MS);
    }
    return false;
  }

  async function returnToListAfterClosing(modal) {
    const closed = await closeCurrentModal(modal);
    if (!closed) return false;
    try {
      await waitForVisibleSelector('tbody[data-testid="virtuoso-item-list"]', 4000);
      return true;
    } catch (e) {
      return false;
    }
  }

  
  async function waitForSuccessToast(timeout = 10000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const toasts = Array.from(document.querySelectorAll('.Toastify__toast'));
      const found = toasts.find(t => isVisible(t) && (t.textContent || '').includes('به مخاطبین اضافه شد'));
      if (found) return found;
      await sleep(POLL_MS);
    }
    throw new Error('Success toast not appeared.');
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

  
  const tbody = await waitForVisibleSelector('tbody[data-testid="virtuoso-item-list"]', 10000);
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
    totalChecked++;

    const uid = getUIDFromRow(row);
    const nameText = (row.querySelector('div.ivqFHl')?.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40);
    console.log(`\n Processing index ${index} | UID: ${uid || 'unknown'} | Name: ${nameText}`);

    if (uid && processedUIDs.has(uid)) {
      console.log(`User ${uid} already processed, skipped.`);
      return 'skipped';
    }

    if (uid) processedUIDs.add(uid);

    
    const nameDiv = row.querySelector('div.ivqFHl');
    if (!nameDiv) {
      console.warn(`Name element not found for index ${index}.`);
      return false;
    }
    nameDiv.click();
    await sleep(STEP_DELAY);

    
    const profileModal = getProfileModal();
    if (!profileModal) {
      console.warn(`Profile modal not opened for index ${index}.`);
      return false;
    }

    
    const nameParagraph = profileModal.querySelector('p.kSqtzD');
    if (nameParagraph) {
      const profileName = nameParagraph.textContent.trim();
      if (profileName === 'Deleted Account' || profileName === 'حساب پاک‌شده') {
        console.log('Deleted Account detected in profile, skipping...');
        
        const closed = await closeCurrentModal(profileModal);
        if (closed) {
          await waitForVisibleSelector('tbody[data-testid="virtuoso-item-list"]', 4000);
          return 'skipped-deleted';
        } else {
          console.warn('Failed to close Deleted Account profile properly.');
          return false;
        }
      }
    }

    
    let moreBtn = null;
    const start = Date.now();
    while (!moreBtn && (Date.now() - start) < 5000) {
      moreBtn = findMoreButton(profileModal);
      if (!moreBtn) await sleep(POLL_MS);
    }
    if (!moreBtn) {
      console.warn(`More button not found for index ${index}.`);
      await returnToListAfterClosing(profileModal);
      return false;
    }

    console.log('🔘 Clicking more button');
    moreBtn.click();
    await sleep(STEP_DELAY);

    
    try {
      await findVisibleByText('ویرایش نام', 1500);
      alreadyContacts++;
      console.log('User already in contacts, skipped.');
      document.body.click();
      await returnToListAfterClosing(profileModal);
      return 'already';
    } catch (e) {}

    
    let addSpan;
    try {
      addSpan = await findVisibleByTextAndTag('افزودن به مخاطبین', 'span', 4000);
    } catch (e) {
      try {
        addSpan = await findVisibleByText('افزودن به مخاطبین', 4000);
      } catch (e2) {
        console.warn(`Add option not found for index ${index}.`);
        await returnToListAfterClosing(profileModal);
        return false;
      }
    }
    addSpan.click();
    await sleep(STEP_DELAY);

    
    let saveBtn;
    try {
      saveBtn = await findVisibleByTextAndTag('ذخیره', 'button', 5000);
    } catch (e) {
      console.warn(`Save button not found for index ${index}.`);
      await returnToListAfterClosing(profileModal);
      return false;
    }
    saveBtn.click();
    console.log('Waiting for server confirmation...');
    await waitForSuccessToast(10000);
    console.log('Success toast received.');

    await sleep(STEP_DELAY);

    
    const returned = await returnToListAfterClosing(profileModal);
    if (!returned) {
      console.error('Failed to return to member list. Stopping.');
      stopRequested = true;
      return false;
    }

    addedCount++;
    console.log('Contact added.');
    return 'added';
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
      await sleep(STEP_DELAY);
      continue;
    }

    const result = await processRow(row, targetIndex);
    console.log(`   Result: ${result}`);

    if (stopRequested) break;

    targetIndex++;

    
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 5 && targetIndex > 0) {
      const nextRow = tbody.querySelector(`tr.GUqHyZ[data-index="${targetIndex}"]`);
      if (!nextRow) {
        console.log('Reached end of list.');
        break;
      }
    }
  }

  console.log('\n Operation finished.');
  console.log(`Total checked: ${totalChecked}`);
  console.log(`Already in contacts: ${alreadyContacts}`);
  console.log(`Added to contacts: ${addedCount}`);
})();
