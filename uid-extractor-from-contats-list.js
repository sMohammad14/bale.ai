

(async function() {

  const db = await new Promise((resolve, reject) => {
    const req = indexedDB.open('db');
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });


  const tx = db.transaction('users', 'readonly');
  const store = tx.objectStore('users');
  const allUsers = await new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });


  const uidSet = new Set();
  allUsers.forEach(user => {
    if (user && user.id !== undefined) {
      uidSet.add(String(user.id));
    }
  });

  console.log(` تعداد UIDهای یکتا: ${uidSet.size}`);
  console.log(JSON.stringify(Array.from(uidSet)));

  db.close();
})();
