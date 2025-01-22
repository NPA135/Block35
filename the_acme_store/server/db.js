const { Client } = require('pg');
const bcrypt = require('bcrypt');

const client = new Client({
  connectionString: 'postgres://localhost/the_acme_store'
});

client.connect();

const sync = async () => {
  const SQL = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );
    CREATE TABLE IF NOT EXISTS favorites (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      product_id INTEGER REFERENCES products(id),
      UNIQUE(user_id, product_id)
    );
  `;
  await client.query(SQL);
};

// Fetch users
const getUsers = async () => {
  const response = await client.query('SELECT * FROM users');
  return response.rows;
};

// Fetch products
const getProducts = async () => {
  const response = await client.query('SELECT * FROM products');
  return response.rows;
};

// Fetch favorites
const getFavorites = async () => {
  const response = await client.query('SELECT * FROM favorites');
  return response.rows;
};

// Create user
const createUser = async ({ username, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const SQL = 'INSERT INTO users(username, password) VALUES($1, $2) RETURNING *';
  const response = await client.query(SQL, [username, hashedPassword]);
  return response.rows[0];
};

// Create favorite
const createFavorite = async ({ userId, productId }) => {
  const SQL = 'INSERT INTO favorites(user_id, product_id) VALUES($1, $2) RETURNING *';
  const response = await client.query(SQL, [userId, productId]);
  return response.rows[0];
};

// Remove favorite
const deleteFavorite = async (id) => {
  const SQL = 'DELETE FROM favorites WHERE id = $1';
  await client.query(SQL, [id]);
};

module.exports = {
  sync,
  getUsers,
  getProducts,
  getFavorites,
  createUser,
  createFavorite,
  deleteFavorite
};
