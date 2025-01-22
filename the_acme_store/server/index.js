const express = require('express');
const app = express();
const db = require('./db');

app.use(express.json());

app.get('/api/users', async (req, res, next) => {
  try {
    const users = await db.getUsers();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

app.get('/api/products', async (req, res, next) => {
  try {
    const products = await db.getProducts();
    res.send(products);
  } catch (error) {
    next(error);
  }
});

app.get('/api/favorites', async (req, res, next) => {
  try {
    const favorites = await db.getFavorites();
    res.send(favorites);
  } catch (error) {
    next(error);
  }
});

app.post('/api/favorites', async (req, res, next) => {
  try {
    const favorite = await db.createFavorite(req.body);
    res.send(favorite);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/favorites/:id', async (req, res, next) => {
  try {
    await db.deleteFavorite(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

const start = async () => {
  await db.sync();
  app.listen(3000, () => console.log('App running on port 3000'));
};

start();
