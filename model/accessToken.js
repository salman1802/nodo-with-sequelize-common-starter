const { DataTypes } = require('sequelize');
const db = require('./connection'); // Assuming this is your Sequelize connection instance

const AccessToken = db.define('AccessToken', {
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    // unique: true,
  },
  userId: {
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onUpdate: 'CASCADE', 
    onDelete: 'CASCADE', 
  },
  isRevoked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    // allowNull: true, 
  },
}, {
  tableName: 'access_tokens',
  timestamps: true, 
  
});

module.exports = AccessToken;
