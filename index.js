(async () => {
    const db = require('./db');
    console.log('começou');

    // db.insertCustomers();
    // db.selectCustomers();
    db.redisTestSelect();
})();