const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ApiKey = sequelize.define('ApiKey', {
    key_string: { type: DataTypes.STRING, allowNull: false, unique: true },
    status: { type: DataTypes.ENUM('active', 'inactive'), defaultValue: 'active' }
});

module.exports = ApiKey;