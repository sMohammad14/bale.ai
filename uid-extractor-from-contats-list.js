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

  const output = JSON.stringify(ids);
  console.log(output);

  copy(ids);

  console.log(`Total contacts: ${ids.length}`);

  db.close();
})();
