// backend/routes/admin.routes.js
const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/admin');

// Ruta para verificar si el usuario es administrador
router.get('/verify', isAdmin, (req, res) => {
    res.json({ 
        msg: 'Usuario verificado como administrador',
        user: req.user
    });
});

module.exports = router;
