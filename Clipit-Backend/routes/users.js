const express = require('express');
const router = express.Router();
const db = require('../db');
router.post('/', async (req, res) => {
    const { username, email, password } = req.body;
    try {
      const result = await db.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
        [username, email, password]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create user' });
    }
  });
  router.get('/', async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM users');
      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });
  router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await db.query('SELECT * FROM users WHERE user_id = $1', [id]);
      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  });
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { username, email } = req.body;
    try {
      const result = await db.query(
        'UPDATE users SET username = $1, email = $2 WHERE user_id = $3 RETURNING *',
        [username, email, id]
      );
      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update user' });
    }
  });
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await db.query('DELETE FROM users WHERE user_id = $1', [id]);
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  });
  
  module.exports = router;