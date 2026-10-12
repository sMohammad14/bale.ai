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

  const ids = all.map(record => String(record.id));

  const uniqueIds = [...new Set(ids)];

  console.log(`تعداد اعضا یکتا: ${uniqueIds.length}`);

  const output = JSON.stringify(ids);
  console.log(output);

  copy(ids);

  db.close();
})();
