const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = require('./user');
const ApiKey = require('./apiKey');
const Admin = require('./admin');

// KITA PAKAI 'userId' (Standar Sequelize)
// Ini adalah "Kabel Penghubung" yang wajib sama
const relationSet = { foreignKey: 'userId' }; 

User.hasMany(ApiKey, { ...relationSet, onDelete: 'CASCADE' });
ApiKey.belongsTo(User, relationSet);

const db = {
    Sequelize,
    sequelize,
    User,
    ApiKey,
    Admin
};

module.exports = db;