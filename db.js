const redis = require("redis");
const client = redis.createClient();

client.on("error", err => console.log('Redis client error: ', err));

client.connect();

// connection mysql
async function connect() {
  // check whether there is a global connection connected;
  if (global.connection && global.connection.state !== "disconnected")
    return global.connection;

  const mysql = require("mysql2/promise");

  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "crud",
  });

  console.log("Conectou ao MySql");
  global.connection = connection;
  return connection;
}

// velocity test select
async function selectCustomers() {
  const conn = await connect();

  console.time("dbselect");
  for (let i = 1; i <= 100; i++) {
    const [rows] = await conn.query(
      "SELECT * FROM clientes WHERE id=? limit 1",
      [i]
    );

    console.log(rows[0].nome);
  }
  console.timeEnd("dbselect"); // 60.979ms - 55.315ms
}

// insert 100 rows test
async function insertCustomers() {
  const conn = await connect();

  for (let i = 0; i < 100; i++) {
    await conn.query(`INSERT INTO clientes(nome,idade,uf) VALUES (?,?,?);`, [
      `nome${i}`,
      i,
      "RS",
    ]);
  }

  console.log('Terminou de inserir');
}

// test speed cache
async function redisTestSelect() {
  const conn = await connect();

  console.time("redisselect");
  for (let i = 1; i <= 100; i++) {
    // let cliente = await client.get(`${i}`);
    await client.get(`${i}`);

    // if (!cliente) {
    //   const [rows] = await conn.query(
    //     "SELECT * FROM clientes WHERE id=? limit 1",
    //     [i]
    //   );
    //   cliente = rows[0];

    //   await client.set(`${i}`, JSON.stringify(cliente));
    // } else {
    //   console.log(JSON.parse(cliente).nome);
    // }
  }
  console.timeEnd("redisselect");

  // await client.disconnect();
}

module.exports = {
  selectCustomers,
  insertCustomers,
  redisTestSelect
};
