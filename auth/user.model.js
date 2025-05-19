const { DataTypes } = require('sequelize');

module.exports = (sequelize, type) => {
    return sequelize.define('user',{
            id:{type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
            email:{type:DataTypes.STRING(100), allowNull: false},
            username:{type:DataTypes.STRING(50), allowNull: false},            
            createdDate:{type:DataTypes.DATE, allowNull: false},
            updatedDate:{type:DataTypes.DATE},
            disabled:{type:DataTypes.BOOLEAN, defaultValue: 0},
            disabledDate:{type:DataTypes.DATE},
        },
        {            
            createdAt: 'createdDate',
            updatedAt: 'updatedDate'
        }    
    );
}
