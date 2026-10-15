(async function autoDeleteForever() {
    // ===== تنظیمات =====
    const WAIT_BETWEEN   = 1 * 50; 
    const MENU_WAIT      = 50;
    const MODAL_WAIT     = 50;
    const SCROLL_WAIT    = 50;
    const SCROLL_STEP    = 50;
    const TOP_RETRY_WAIT = 30 * 1000;

    
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const processed = new WeakSet();
    window.__stopAutoDelete = false;


    async function interruptibleWait(totalMs) {
        const start = Date.now();
        let lastLog = 0;
        while (Date.now() - start < totalMs) {
            if (window.__stopAutoDelete) return false;
            await sleep(200);
            const elapsed = Date.now() - start;
            if (elapsed - lastLog >= 50) {
                lastLog = elapsed;
                const remaining = Math.ceil((totalMs - elapsed) / 50);
                console.log(`%c⏳ ${remaining} ثانیه مانده...`, 'color:gray');
            }
        }
        return true;
    }

    const getMessages = () =>
        Array.from(document.querySelectorAll('.message-block.hKxhdG XLUUWK'.replace(' ', '.')))
             .filter(el => !processed.has(el));

    const getScroller = () =>
        document.querySelector('#message_list_scroller_id') ||
        document.scrollingElement;

    function rightClick(el) {
        const rect = el.getBoundingClientRect();
        const x = rect.left + Math.min(rect.width / 2, 60);
        const y = rect.top + rect.height / 2;
        const opts = { bubbles: true, cancelable: true, view: window,
                       clientX: x, clientY: y, button: 2, buttons: 2 };
        el.dispatchEvent(new MouseEvent('mousedown', opts));
        el.dispatchEvent(new MouseEvent('mouseup', opts));
        el.dispatchEvent(new MouseEvent('contextmenu', opts));
    }

    function findDeleteOption() {
        const exact = document.querySelector(
            '#context-menu-content > div > div.karN60.TFD52R > div > div > div:nth-child(5)'
        );
        if (exact && exact.textContent.includes('حذف')) return exact;
        const menu = document.querySelector('#context-menu-content');
        if (!menu) return null;
        const candidates = menu.querySelectorAll('div, button, li');
        for (const c of candidates) {
            const hasIcon = c.querySelector('use[href="#bi-Delete"], svg[aria-label="Delete-icon"]');
            if (hasIcon && c.textContent.trim() === 'حذف') return c;
        }
        for (const c of candidates) {
            if (c.textContent.trim() === 'حذف') return c;
        }
        return null;
    }

    function findConfirmButton() {
        const exact = document.querySelector(
            'body > div.anWA5J.ReactModal__Overlay > div > div > div.N2VXUy > button.Nkijhg.rA4OXx.JR9z3o.hLb988'
        );
        if (exact) return exact;
        const byAria = document.querySelector('button[aria-label="حذف پیام"]');
        if (byAria) return byAria;
        const overlays = document.querySelectorAll('.ReactModal__Overlay, [role="dialog"]');
        for (const ov of overlays) {
            const btns = ov.querySelectorAll('button');
            for (const b of btns) {
                if (b.textContent.trim() === 'حذف پیام') return b;
            }
        }
        return null;
    }

    function closeMenu() {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27, bubbles: true }));
    }

    function scrollToBottom() {
        const s = getScroller();
        s.scrollTop = s.scrollHeight;
    }

    // ===== شروع =====
    scrollToBottom();
    await sleep(SCROLL_WAIT);

    let count = 0;
    console.log('%c▶ شروع حذف دائمی...', 'color:lime; font-weight:bold');

    while (!window.__stopAutoDelete) {
        let messages = getMessages();

        // ---- اگه چیزی نبود، اسکرول ----
        if (messages.length === 0) {
            const s = getScroller();
            const atTop = s.scrollTop <= 5;
            if (atTop) {
                console.log(`%c🔁 به بالای لیست رسیدم. ${TOP_RETRY_WAIT/1000}s صبر و ریستارت...`, 'color:cyan');
                if (!(await interruptibleWait(TOP_RETRY_WAIT))) break;
                scrollToBottom();
                await sleep(SCROLL_WAIT);
            } else {
                s.scrollTop -= SCROLL_STEP;
                await sleep(SCROLL_WAIT);
            }
            continue;
        }

        const target = messages[messages.length - 1];
        processed.add(target);

        target.scrollIntoView({ block: 'center', behavior: 'instant' });
        await sleep(400);

        rightClick(target);
        await sleep(MENU_WAIT);

        const delBtn = findDeleteOption();
        if (!delBtn) {
            console.warn('⚠ گزینه حذف پیدا نشد.');
            closeMenu();
            document.body.click();
            if (!(await interruptibleWait(WAIT_BETWEEN))) break;
            continue;
        }
        delBtn.click();
        await sleep(MODAL_WAIT);

        const confirmBtn = findConfirmButton();
        if (confirmBtn) {
            confirmBtn.click();
            count++;
            console.log(`%c🗑 حذف شد (#${count})`, 'color:orange; font-weight:bold');
        } else {
            console.warn('⚠ دکمه‌ی «حذف پیام» پیدا نشد.');
            closeMenu();
        }

        await sleep(200);

        console.log(`%c⏳ مکث ۲۰۰ ثانیه تا پیام بعدی...`, 'color:gray');
        if (!(await interruptibleWait(WAIT_BETWEEN))) break;
    }

    console.log(`%c⏹ متوقف شد. مجموع حذف‌شده: ${count}`, 'color:cyan; font-weight:bold');
})();
