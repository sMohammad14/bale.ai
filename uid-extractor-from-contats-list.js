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

  console.log(`تعداد رکوردهای contacts: ${all.length}`);
  all.forEach((record, i) => {
    console.log(`\n🔹 رکورد ${i + 1}:`, record);
  });

  db.close();
})();
