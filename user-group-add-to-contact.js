(async function() {
  // ---------- تاخیرهای ثابت بعد از کلیک‌ها ----------

  // بعد از کلیک روی نام عضو تا باز شدن کامل پروفایل
 // این تاخیر به صفحه فرصت می‌دهد تا مودال پروفایل کاربر را کامل رندر کند.
  const CLICK_MEMBER_NAME_DELAY = 1;

  // بعد از کلیک روی دکمه «بیشتر» (سه‌نقطه) تا باز شدن منوی گزینه‌ها
  // اگر خیلی کم باشد، ممکن است منو هنوز باز نشده باشد.
  const CLICK_MORE_BUTTON_DELAY = 1;

  // بعد از کلیک روی «افزودن به مخاطبین» تا باز شدن صفحهٔ ویرایش نام
  // این صفحه نیاز به بارگذاری بیشتری دارد، بنابراین ۱ ثانیه گذاشته‌ایم.
  const CLICK_ADD_TO_CONTACTS_DELAY = 3000;

  // بعد از کلیک روی «ذخیره» تا بسته شدن صفحهٔ ویرایش و بازگشت به پروفایل
  // این مرحله باید منتظر بماند تا عملیات ذخیره روی سرور انجام شود.
  const CLICK_SAVE_BUTTON_DELAY = 3000;

  // بعد از بستن پنجره/مودال تا بازگشت به لیست اعضا
  // این تاخیر برای ناپدید شدن مودال و ظاهر شدن دوباره لیست است.
  const CLOSE_MODAL_DELAY = 1;

  // بعد از اسکرول به موقعیت تقریبی یک ایندکس نامرئی
  // وقتی ردیف موردنظر در DOM نیست، اسکرول می‌کنیم و این تاخیر را می‌دهیم.
  const SCROLL_STEP_DELAY = 1;

  // ---------- فاصله بین بررسی‌های مجدد در حلقه‌های انتظار ----------

  // در همهٔ توابع انتظار استفاده می‌شود؛ هر چند میلی‌ثانیه وضعیت را چک می‌کنیم.
  // هرچه کمتر باشد، واکنش سریع‌تر اما مصرف CPU بیشتر.
  const POLL_INTERVAL = 1;

  // ---------- حداکثر زمان انتظار برای هر مورد خاص ----------

  // انتظار اولیه برای پیدا شدن لیست اعضا (tbody) در ابتدای کار
  // اگر لیست باز نشود، این مدت منتظر می‌مانیم.
  const TIMEOUT_INITIAL_MEMBER_LIST = 10000;

  // انتظار برای باز شدن و پیدا شدن مودال پروفایل کاربر
  // اگر پروفایل باز نشود، این مدت صبر می‌کنیم.
  const TIMEOUT_PROFILE_MODAL = 5000;

  // انتظار برای پیدا شدن نام کاربر در پروفایل (p.kSqtzD)
  // برای تشخیص سریع حساب‌های پاک‌شده استفاده می‌شود.
  const TIMEOUT_PROFILE_NAME_P = 2000;

  // انتظار برای ظاهر شدن دکمه «بیشتر» در مودال پروفایل
  // اگر دکمه دیرتر رندر شود، این مدت صبر می‌کنیم.
  const TIMEOUT_MORE_BUTTON = 5000;

  // انتظار برای تشخیص گزینه «ویرایش نام» در منو (یعنی کاربر قبلاً مخاطب است)
  // چون این گزینه سریع ظاهر می‌شود، ۱.۵ ثانیه کافی است.
  const TIMEOUT_CHECK_ALREADY_CONTACT = 1500;

  // انتظار برای تشخیص گزینه «مسدود و حذف کردن» در منو (یعنی ربات است)
  // بررسی سریع‌تر، چون این گزینه هم فوراً دیده می‌شود.
  const TIMEOUT_CHECK_BOT = 2000;

  // انتظار برای پیدا کردن گزینه «افزودن به مخاطبین» در منو
  // معمولاً بلافاصله وجود دارد.
  const TIMEOUT_FIND_ADD_OPTION = 2000;

  // انتظار برای پیدا کردن دکمه «ذخیره» در صفحهٔ ویرایش نام
  // بعد از باز شدن صفحه، دکمه باید به سرعت دیده شود.
  const TIMEOUT_FIND_SAVE_BUTTON = 2000;

  // انتظار برای ظاهر شدن دکمه «بیشتر» هنگام تایید نهایی بعد از ذخیره
  // بعد از بسته شدن صفحهٔ ویرایش، باید دوباره دکمه بیشتر را ببینیم.
  const TIMEOUT_VERIFY_MORE_BUTTON = 2000;

  // انتظار برای تایید موفقیت با دیدن «ویرایش نام» در منوی تایید
  // اگر این متن دیده شود، یعنی کاربر به‌درستی اضافه شده است.
  const TIMEOUT_VERIFY_EDIT_NAME = 2000;

  // انتظار برای تایید عدم موفقیت با دیدن «افزودن به مخاطبین» در منوی تایید
  // اگر هنوز این گزینه باشد، یعنی کاربر اضافه نشده است.
  const TIMEOUT_VERIFY_ADD_OPTION = 2000;

  // حداکثر انتظار برای بسته شدن کامل یک مودال
  // بعد از کلیک روی بستن، این مدت صبر می‌کنیم تا مودال ناپدید شود.
  const TIMEOUT_MODAL_CLOSE = 2000;

  // حداکثر انتظار برای بازگشت به لیست اعضا (دیده شدن دوباره tbody)
  // بعد از بستن پروفایل، صبر می‌کنیم تا لیست دوباره ظاهر شود.
  const TIMEOUT_LIST_RETURN = 2000;

  // ---------- ارتفاع تقریبی هر ردیف ----------

  // ارتفاع تقریبی هر ردیف در لیست اعضا (پیکسل).
  // برای محاسبه موقعیت اسکرول به ایندکس‌هایی که در DOM نیستند استفاده می‌شود.
  const ROW_HEIGHT = 58;

  // ---------- پارامترهای پیش‌بارگذاری لیست ----------

  // نسبت اسکرول در هر گام پیش‌بارگذاری (۰.۸ یعنی ۸۰٪ ارتفاع قابل مشاهده)
  // این مقدار تعیین می‌کند در هر مرحله چقدر از لیست را اسکرول کنیم.
  const PRELOAD_SCROLL_STEP_RATIO = 0.8;

  // تأخیر بعد از هر گام اسکرول پیش‌بارگذاری (میلی‌ثانیه)
  // این زمان برای بارگذاری ردیف‌های جدید پس از اسکرول در نظر گرفته می‌شود.
  // برای لیست‌های طولانی، بهتر است مقدار آن را ۵۰۰ یا ۱۰۰۰ بگذارید.
  const PRELOAD_WAIT_AFTER_SCROLL_MS = 500;

  // اگر این تعداد دفعه پشت‌سرهم ایندکس حداکثر افزایش نیافت، پیش‌بارگذاری متوقف شود
  // مقدار ۵ یعنی بعد از ۵ اسکرول بدون ردیف جدید، فرض می‌کنیم به انتها رسیده‌ایم.
  // برای اطمینان در لیست‌های مجازی، این عدد را می‌توانید ۵ یا ۱۰ بگذارید.
  const PRELOAD_STABLE_END_COUNT = 5;

  // حداکثر تعداد اسکرول‌های پیش‌بارگذاری (جلوگیری از حلقه بی‌نهایت)
  // اگر لیست خیلی طولانی باشد، این محدودیت مانع اجرای بی‌پایان می‌شود.
  const PRELOAD_MAX_SCROLL_ATTEMPTS = 5000;

  // ---------- توقف دوره‌ای پس از افزودن تعداد مشخصی مخاطب ----------

  // بعد از هر چند کاربر اضافه‌شده، توقف کنیم؟
  // مثلاً ۱۰۰۰۰ یعنی عملاً غیرفعال است؛ برای فعال‌سازی مقدار کمتری بگذارید.
  const PAUSE_INTERVAL_ADDED = 50;

  // مدت زمان توقف (به میلی‌ثانیه) پس از رسیدن به تعداد بالا
  // مثلاً ۵ دقیقه = 300000 میلی‌ثانیه
  const PAUSE_DURATION_ADDED_MS = 30000;

  // ---------- تنظیمات جدید ----------

  // تعداد کل اعضای گروه را اگر دقیق می‌دانید اینجا وارد کنید.
  // اگر 0 باشد، کد خودش با پیش‌بارگذاری لیست حداکثر ایندکس را تشخیص می‌دهد.
  // مثال: برای گروهی با 2000 عضو، این مقدار را 1995 بگذارید.
  const TOTAL_MEMBERS_COUNT = 1975;

  // حداکثر تعداد تلاش برای هر کاربر در صورت نتیجهٔ not-added
  // اگر بعد از این تعداد تلاش کاربر هنوز اضافه نشد، در لیست ناموفق‌ها ثبت می‌شود.
  const MAX_NOT_ADDED_RETRIES = 10;

  // حداکثر تعداد تلاش برای بارگذاری یک ردیف نامرئی
  // اگر بعد از این تعداد تلاش ردیف پیدا نشد، به ایندکس بعدی می‌رویم.
  const MAX_ROW_LOAD_ATTEMPTS = 15;

  // =====================================================
  // متغیرهای آمار و ردیابی
  // =====================================================

  // تعداد کل کاربران بررسی‌شده
  let totalChecked = 0;

  // تعداد کاربرانی که از قبل در مخاطبین بودند
  let alreadyContacts = 0;

  // تعداد کاربرانی که با موفقیت به مخاطبین اضافه شدند
  let addedCount = 0;

  // تعداد ربات‌هایی که رد شدند
  let botSkipped = 0;

  // مجموعه UID کاربرانی که پردازش شده‌اند (برای جلوگیری از پردازش تکراری)
  const processedUIDs = new Set();

  // نقشه شمارنده تلاش برای هر ایندکس (برای مدیریت not-added)
  const attemptsMap = new Map();

  // لیست کاربرانی که بعد از MAX_NOT_ADDED_RETRIES اضافه نشدند
  const failedUsersList = [];

  // لیست ایندکس‌هایی که بعد از MAX_ROW_LOAD_ATTEMPTS بارگذاری نشدند
  const skippedRowList = [];

  // حداکثر ایندکس دیده‌شده در پیش‌بارگذاری
  // (اگر TOTAL_MEMBERS_COUNT=0 باشد، از این مقدار برای تشخیص انتها استفاده می‌شود)
  let maxKnownIndex = -1;

  // =====================================================
  // ابزار کمکی
  // =====================================================

  // تابع ثبت زمان اجرای هر مرحله
  function logStep(stepName, startTime) {
    const duration = Date.now() - startTime;
    console.log(`⏱️ ${stepName} → ${duration} ms`);
  }

  // تابع خواب (تاخیر)
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // بررسی اینکه آیا عنصر در دید است یا خیر
  function isVisible(el) {
    if (!el) return false;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  // انتظار برای پیدا شدن یک سلکتور قابل مشاهده
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

  // انتظار برای پیدا شدن یک تگ با متن دقیق
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

  // انتظار برای پیدا شدن هر عنصر با متن عمومی
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

  // گرفتن مودال پروفایل کاربر (نه پنجرهٔ گروه)
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

  // پیدا کردن دکمهٔ بیشتر (نیمهٔ راست)
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

  // پیدا کردن دکمهٔ بستن (نیمهٔ چپ)
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

  // بستن یک مودال و انتظار برای ناپدید شدن آن
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

  // بستن پروفایل و بازگشت به لیست اعضا
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

  // استخراج UID از ردیف
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

  // =====================================================
  // تابع پیش‌بارگذاری کامل لیست
  // =====================================================

  // استخراج حداکثر data-index از ردیف‌های فعلی
  function getMaxDataIndex(tbody) {
    const rows = tbody.querySelectorAll('tr.GUqHyZ');
    let max = -1;
    rows.forEach(r => {
      const idx = parseInt(r.getAttribute('data-index'), 10);
      if (!isNaN(idx) && idx > max) max = idx;
    });
    return max;
  }

  // پیش‌بارگذاری لیست با اسکرول تدریجی
  // این تابع بدون تکیه بر scrollHeight، فقط بر اساس افزایش ایندکس‌ها و تعداد اسکرول‌ها عمل می‌کند
  async function preloadMemberList(container, tbody) {
    console.log('🔄 Preloading member list...');
    container.scrollTop = 0;
    await sleep(SCROLL_STEP_DELAY);

    let prevMaxIndex = -1;
    let noIncreaseCount = 0;
    let scrollAttempts = 0;

    // اگر تعداد کل اعضا مشخص است، هدف آخرین ایندکس را می‌دانیم
    const targetMaxIndex = (TOTAL_MEMBERS_COUNT > 0) ? TOTAL_MEMBERS_COUNT - 1 : -1;

    while (true) {
      const currentMax = getMaxDataIndex(tbody);
      if (currentMax > prevMaxIndex) {
        prevMaxIndex = currentMax;
        noIncreaseCount = 0;
      } else {
        noIncreaseCount++;
      }

      // اگر تعداد کل مشخص است و به ایندکس هدف رسیدیم، توقف
      if (targetMaxIndex >= 0 && prevMaxIndex >= targetMaxIndex) {
        console.log(`📌 Reached target max index ${targetMaxIndex}.`);
        break;
      }

      // اگر تعداد کل مشخص نیست و چند بار افزایش نداشتیم، توقف
      if (targetMaxIndex < 0 && noIncreaseCount >= PRELOAD_STABLE_END_COUNT) {
        console.log(`📌 Preload stopped after ${noIncreaseCount} stable scrolls.`);
        break;
      }

      // اگر تعداد گام‌ها از حد مجاز گذشت
      if (scrollAttempts >= PRELOAD_MAX_SCROLL_ATTEMPTS) {
        console.warn('⚠️ Max scroll attempts reached.');
        break;
      }

      // اسکرول یک گام
      const step = container.clientHeight * PRELOAD_SCROLL_STEP_RATIO;
      container.scrollTop += step;
      scrollAttempts++;

      // صبر برای بارگذاری ردیف‌های جدید
      await sleep(PRELOAD_WAIT_AFTER_SCROLL_MS);
    }

    maxKnownIndex = prevMaxIndex;
    console.log(`✅ Preload finished. Max index seen: ${maxKnownIndex}. Scrolling back to top...`);
    container.scrollTop = 0;
    await sleep(SCROLL_STEP_DELAY);
  }

  // =====================================================
  // تابع تلاش برای بارگذاری یک ردیف با اسکرول هوشمند
  // =====================================================
  async function tryLoadRow(targetIndex) {
    for (let attempt = 0; attempt < MAX_ROW_LOAD_ATTEMPTS; attempt++) {
      // 1) ابتدا بررسی می‌کنیم که آیا ردیف اکنون در DOM هست یا خیر
      let row = tbody.querySelector(`tr.GUqHyZ[data-index="${targetIndex}"]`);
      if (row) return row;

      // 2) موقعیت تقریبی را محاسبه و اسکرول می‌کنیم
      container.scrollTop = targetIndex * ROW_HEIGHT - container.clientHeight / 2;
      await sleep(SCROLL_STEP_DELAY);

      row = tbody.querySelector(`tr.GUqHyZ[data-index="${targetIndex}"]`);
      if (row) return row;

      // 3) اگر پیدا نشد، از ایندکس‌های فعلی برای اصلاح جهت اسکرول استفاده می‌کنیم
      const visibleRows = tbody.querySelectorAll('tr.GUqHyZ');
      if (visibleRows.length > 0) {
        const firstIndex = parseInt(visibleRows[0].getAttribute('data-index'), 10);
        const lastIndex = parseInt(visibleRows[visibleRows.length - 1].getAttribute('data-index'), 10);

        if (targetIndex < firstIndex) {
          // باید بالاتر برویم
          container.scrollTop -= (firstIndex - targetIndex) * ROW_HEIGHT * 0.5;
        } else if (targetIndex > lastIndex) {
          // باید پایین‌تر برویم
          container.scrollTop += (targetIndex - lastIndex) * ROW_HEIGHT * 0.5;
        } else {
          // ایندکس بین ردیف‌های دیده‌شده است اما ردیف پیدا نشد (وضعیت عجیب)
          // کمی اسکرول به سمت آن
          container.scrollTop += (targetIndex - firstIndex) * ROW_HEIGHT * 0.2;
        }
      } else {
        // اگر هیچ ردیفی دیده نشد، اسکرول به موقعیت کلی
        container.scrollTop = targetIndex * ROW_HEIGHT;
      }

      await sleep(SCROLL_STEP_DELAY);
    }

    console.warn(`⚠️ Row ${targetIndex} could not be loaded after ${MAX_ROW_LOAD_ATTEMPTS} attempts.`);
    return null;
  }

  // =====================================================
  // آماده‌سازی اولیه
  // =====================================================

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

  // ---------- پیش‌بارگذاری لیست ----------
  await preloadMemberList(container, tbody);

  // اگر تعداد کل اعضا به‌صورت دستی تنظیم شده، از آن استفاده کن
  let totalMembers = TOTAL_MEMBERS_COUNT > 0 ? TOTAL_MEMBERS_COUNT : maxKnownIndex + 1;
  console.log(`ℹ️ Total members to process: ${totalMembers} (max index: ${totalMembers - 1})`);

  // =====================================================
  // پردازش یک ردیف
  // =====================================================

  async function processRow(row, index) {
    const rowStart = Date.now();
    totalChecked++;

    const uid = getUIDFromRow(row);
    const nameText = (row.querySelector('div.ivqFHl')?.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40);
    console.log(`\n🔄 Processing index ${index} | UID: ${uid || 'unknown'} | Name: ${nameText}`);

    if (uid && processedUIDs.has(uid)) {
      console.log(`ℹ️ User ${uid} already processed, skipped.`);
      return 'skipped';
    }

    // 1) کلیک روی نام عضو
    let stepStart = Date.now();
    const nameDiv = row.querySelector('div.ivqFHl');
    if (!nameDiv) {
      console.warn(`⚠️ Name element not found for index ${index}.`);
      return false;
    }
    nameDiv.click();
    await sleep(CLICK_MEMBER_NAME_DELAY);
    logStep('Click member name', stepStart);

    // 2) پیدا کردن مودال پروفایل
    stepStart = Date.now();
    const profileModal = getProfileModal();
    if (!profileModal) {
      console.warn(`❌ Profile modal not opened for index ${index}.`);
      return false;
    }
    logStep('Find profile modal', stepStart);

    // 3) بررسی حساب پاک‌شده
    stepStart = Date.now();
    const nameParagraph = profileModal.querySelector('p.kSqtzD');
    if (nameParagraph) {
      const profileName = nameParagraph.textContent.trim();
      if (profileName === 'Deleted Account' || profileName === 'حساب پاک‌شده') {
        console.log('ℹ️ Deleted Account detected in profile, skipping...');
        if (uid) processedUIDs.add(uid);
        await closeCurrentModal(profileModal);
        await waitForVisibleSelector('tbody[data-testid="virtuoso-item-list"]', TIMEOUT_LIST_RETURN);
        logStep('Check deleted account', stepStart);
        return 'skipped-deleted';
      }
    }
    logStep('Check deleted account (not found)', stepStart);

    // 4) انتظار برای دکمه بیشتر
    stepStart = Date.now();
    let moreBtn = null;
    while (!moreBtn && (Date.now() - stepStart) < TIMEOUT_MORE_BUTTON) {
      moreBtn = findMoreButton(profileModal);
      if (!moreBtn) await sleep(POLL_INTERVAL);
    }
    if (!moreBtn) {
      console.warn(`⚠️ More button not found for index ${index}.`);
      if (uid) processedUIDs.add(uid);
      await returnToListAfterClosing(profileModal);
      return false;
    }
    logStep('Wait for more button', stepStart);

    // 5) کلیک روی دکمه بیشتر و باز شدن منو
    stepStart = Date.now();
    console.log('🔘 Clicking more button');
    moreBtn.click();
    await sleep(CLICK_MORE_BUTTON_DELAY);
    logStep('Click more button + delay', stepStart);

    // 6) بررسی «ویرایش نام» (کاربر قبلاً مخاطب است)
    stepStart = Date.now();
    try {
      await findVisibleByText('ویرایش نام', TIMEOUT_CHECK_ALREADY_CONTACT);
      alreadyContacts++;
      if (uid) processedUIDs.add(uid);
      console.log('ℹ️ User already in contacts, skipped.');
      document.body.click(); // بستن منو
      await returnToListAfterClosing(profileModal);
      logStep('Check already in contacts', stepStart);
      return 'already';
    } catch (e) {}
    logStep('Check already in contacts (not found)', stepStart);

    // 7) بررسی ربات بودن («مسدود و حذف کردن»)
    stepStart = Date.now();
    try {
      await findVisibleByText('مسدود و حذف کردن', TIMEOUT_CHECK_BOT);
      botSkipped++;
      if (uid) processedUIDs.add(uid);
      console.log('ℹ️ Bot detected (block and delete option found), skipping...');
      document.body.click(); // بستن منو
      await returnToListAfterClosing(profileModal);
      logStep('Check bot', stepStart);
      return 'bot';
    } catch (e) {}
    logStep('Check bot (not found)', stepStart);

    // 8) کلیک روی «افزودن به مخاطبین»
    stepStart = Date.now();
    let addSpan;
    try {
      addSpan = await findVisibleByTextAndTag('افزودن به مخاطبین', 'span', TIMEOUT_FIND_ADD_OPTION);
    } catch (e) {
      try {
        addSpan = await findVisibleByText('افزودن به مخاطبین', TIMEOUT_FIND_ADD_OPTION);
      } catch (e2) {
        console.warn(`⚠️ Add option not found for index ${index}.`);
        if (uid) processedUIDs.add(uid);
        await returnToListAfterClosing(profileModal);
        return false;
      }
    }
    addSpan.click();
    await sleep(CLICK_ADD_TO_CONTACTS_DELAY);
    logStep('Click add to contacts', stepStart);

    // 9) پیدا کردن و کلیک روی «ذخیره»
    stepStart = Date.now();
    let saveBtn;
    try {
      saveBtn = await findVisibleByTextAndTag('ذخیره', 'button', TIMEOUT_FIND_SAVE_BUTTON);
    } catch (e) {
      console.warn(`⚠️ Save button not found for index ${index}.`);
      if (uid) processedUIDs.add(uid);
      await returnToListAfterClosing(profileModal);
      return false;
    }
    saveBtn.click();
    console.log('💾 Save clicked, verifying contact status...');
    await sleep(CLICK_SAVE_BUTTON_DELAY);
    logStep('Click save + delay', stepStart);

    // 10) تایید نهایی با باز کردن دوباره منو
    stepStart = Date.now();
    let verifyBtn = null;
    while (!verifyBtn && (Date.now() - stepStart) < TIMEOUT_VERIFY_MORE_BUTTON) {
      verifyBtn = findMoreButton(profileModal);
      if (!verifyBtn) await sleep(POLL_INTERVAL);
    }
    if (!verifyBtn) {
      console.warn(`⚠️ Could not find more button to verify status for index ${index}.`);
      if (uid) processedUIDs.add(uid);
      await returnToListAfterClosing(profileModal);
      return false;
    }

    verifyBtn.click();
    await sleep(CLICK_MORE_BUTTON_DELAY);
    logStep('Verify: click more button + delay', stepStart);

    // 11) بررسی منوی تایید
    stepStart = Date.now();
    try {
      await findVisibleByText('ویرایش نام', TIMEOUT_VERIFY_EDIT_NAME);
      console.log('✅ Contact added successfully (verified via menu).');
      if (uid) processedUIDs.add(uid);
      addedCount++;
      document.body.click(); // بستن منو
      await returnToListAfterClosing(profileModal);
      logStep('Verify: added confirmed', stepStart);
      return 'added';
    } catch (e) {}

    try {
      await findVisibleByText('افزودن به مخاطبین', TIMEOUT_VERIFY_ADD_OPTION);
      console.warn('⚠️ Contact not added (still shows add option).');
      document.body.click(); // بستن منو
      await returnToListAfterClosing(profileModal);
      logStep('Verify: not added', stepStart);
      return 'not-added';
    } catch (e) {}

    console.warn('⚠️ Verification menu unknown state.');
    await returnToListAfterClosing(profileModal);
    logStep('Verify: unknown state', stepStart);
    console.log(`   Row total time: ${Date.now() - rowStart} ms`);
    return false;
  }

  // =====================================================
  // حلقه اصلی
  // =====================================================

  console.log('🚀 Starting automatic contact addition (sequential)...');
  console.log('To stop manually, type stopAutomation() in console.');

  let stopRequested = false;
  window.stopAutomation = () => { stopRequested = true; };

  let targetIndex = 0;

  while (!stopRequested && targetIndex < totalMembers) {
    // سعی می‌کنیم ردیف هدف را بارگذاری کنیم
    let row = await tryLoadRow(targetIndex);

    if (!row) {
      // اگر بعد از تلاش‌های مجاز ردیف بارگذاری نشد، این ایندکس را رد کرده و به ایندکس بعدی می‌رویم
      skippedRowList.push({ index: targetIndex });
      console.warn(`⏭️ Skipping index ${targetIndex} due to row load failure.`);
      targetIndex++;
      continue;
    }

    const result = await processRow(row, targetIndex);
    console.log(`   Result: ${result}`);

    if (stopRequested) break;

    // ---------- مدیریت تلاش مجدد برای not-added ----------
    if (result === 'not-added') {
      const currentAttempt = (attemptsMap.get(targetIndex) || 0) + 1;
      attemptsMap.set(targetIndex, currentAttempt);

      if (currentAttempt >= MAX_NOT_ADDED_RETRIES) {
        // ثبت در لیست کاربران ناموفق
        const uid = getUIDFromRow(row);
        const name = (row.querySelector('div.ivqFHl')?.textContent || '').trim();
        failedUsersList.push({ index: targetIndex, uid: uid || null, name });
        console.warn(`❌ Skipped index ${targetIndex} after ${currentAttempt} attempts (not-added).`);
        attemptsMap.delete(targetIndex);
        targetIndex++;
      } else {
        console.log(`   🔁 Retrying same index ${targetIndex} (attempt ${currentAttempt}/${MAX_NOT_ADDED_RETRIES})...`);
        await sleep(SCROLL_STEP_DELAY);
        continue;
      }
    } else {
      // برای سایر نتایج، شمارنده تلاش ریست شود
      attemptsMap.delete(targetIndex);
      targetIndex++;
    }

    // ⏸️ توقف دوره‌ای پس از افزودن موفق
    if (result === 'added' && addedCount > 0 && addedCount % PAUSE_INTERVAL_ADDED === 0) {
      console.log(`⏸️ Reached ${addedCount} added contacts. Pausing for ${PAUSE_DURATION_ADDED_MS} ms...`);
      await sleep(PAUSE_DURATION_ADDED_MS);
      console.log('▶️ Pause finished. Continuing...');
    }

    // اگر از آخرین ایندکس رد شدیم، توقف
    if (targetIndex >= totalMembers) {
      console.log('📌 Reached end of list.');
      break;
    }
  }

  // ---------- گزارش نهایی ----------
  console.log('\n🎯 Operation finished.');
  console.log(`📊 Total checked: ${totalChecked}`);
  console.log(`👥 Already in contacts: ${alreadyContacts}`);
  console.log(`🤖 Bot skipped: ${botSkipped}`);
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
