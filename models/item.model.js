const { DataTypes } = require('sequelize');

module.exports = (sequilize, type) =>{
    return sequilize.define('item', {
        id:{type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
        name:{type:DataTypes.STRING(50), allowNull: false},
        description:{type:DataTypes.STRING(250)},        
        rating:{type:DataTypes.DECIMAL},
        date:{type:DataTypes.DATE, allowNull: false},
        createdDate:{type:DataTypes.DATE, allowNull: false},
        updatedDate:{type:DataTypes.DATE, allowNull: false},
    },
        {            
            createdAt: 'createdDate',
            updatedAt: 'updatedDate'
        });
}