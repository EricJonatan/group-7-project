const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// const User = require('../models/User'); 

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) return res.status(400).json({ message: 'Semua bagian wajib diisi' });
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // const newUser = new User({ name, email, password: hashedPassword });
    // await newUser.save();

    res.status(201).json({ message: 'Registrasi berhasil' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // const user = await User.findOne({ email });
    // if (!user) return res.status(400).json({ message: 'Email atau password salah' });

    // const validPass = await bcrypt.compare(password, user.password);
    // if (!validPass) return res.status(400).json({ message: 'Email atau password salah' });

    const token = jwt.sign(
      { _id: "dummy_id_dari_db", name: "Nama User" }, 
      process.env.JWT_SECRET || 'group_7_project',
      { expiresIn: '7d' }
    );

    res.json({ token: token, message: 'Login berhasil' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;