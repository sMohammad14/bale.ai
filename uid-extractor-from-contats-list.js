(async () => {
  const db = await new Promise((resolve, reject) => {
    const req = indexedDB.open('db');
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

  const tx = db.transaction('contacts', 'readonly');
  const store = tx.objectStore('contacts');

  const all = await new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

  // تبدیل id ها به رشته و ساخت آرایه
  const ids = all.map(record => String(record.id));

  // نمایش آرایه با فرمت JSON
  const output = JSON.stringify(ids);
  console.log(output);

  // کپی در کلیپ‌بورد
  copy(ids);
  console.log('📋 در کلیپ‌بورد کپی شد.');

  db.close();
})();
