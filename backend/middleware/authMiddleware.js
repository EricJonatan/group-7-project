const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'group_7_project');
    req.user = verified; 
    next(); 
  } catch (err) {
    res.status(401).json({ message: 'Token tidak valid atau sudah expired.' });
  }
};

module.exports = verifyToken;