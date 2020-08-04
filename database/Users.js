const connection = require('./connection')
const sequelize = require('sequelize')

const Users = connection.define('Users', {
    name:{
        type: sequelize.STRING,
        allowNull: false
    },
    email:{
        type: sequelize.STRING,
        allowNull: false
    },
    password:{
        type: sequelize.STRING,
        allowNull: false
    }
})

Users.sync({force:false})

module.exports = Users