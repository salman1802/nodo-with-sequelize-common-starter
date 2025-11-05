const { DataTypes } = require('sequelize');
const db = require('./connection');

const User = db.define('User', {
  firstname : {
    type : DataTypes.STRING,
    allowNull : false
  },
  lastname : {
    type : DataTypes.STRING,
    allowNull : false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '', // Set default value as an empty string
  },
  countrycode : {
    type : DataTypes.STRING,
    allowNull : false
  },
  mobilenumber : {
    type : DataTypes.STRING,
    allowNull : false
  },
  zipcode : {
    type : DataTypes.STRING,
    allowNull : false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location : {
    type : DataTypes.STRING,
    allowNull : false
  },
  lat :{
    type : DataTypes.STRING,
    allowNull : false
  },
  long : {
    type : DataTypes.STRING,
    allowNull : false
  },
  termsAndPolicy : {
    type : DataTypes.BOOLEAN,
    default: false,
  },
  profileImage : {
    type : DataTypes.STRING,
    allowNull : false
  },
  isVerify : {
    type : DataTypes.BOOLEAN,
    default: false,
  },
  refKey : {
    type : DataTypes.BOOLEAN,
    default: false,
  }
}, {
  tableName: 'users',
  timestamps: true, 
  
});

module.exports = User;
