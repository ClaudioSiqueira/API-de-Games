const sequelize = require('sequelize')
const connection = require('./connection')

const Table = connection.define('Table', {
    title:{
        type: sequelize.STRING,
        allowNull:false
    },
    price:{
        type: sequelize.FLOAT,
        allowNull:false
    },
    year:{
        type: sequelize.INTEGER,
        allowNull:false
    }
})

Table.sync({force:false})

module.exports = Table