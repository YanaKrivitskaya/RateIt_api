const { DataTypes } = require('sequelize');

module.exports = (sequilize, type) =>{
    return sequilize.define('dropdown_value', {
        id:{type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
        value:{type:DataTypes.STRING(50)},        
        createdDate:{type:DataTypes.DATE, allowNull: false},
        updatedDate:{type:DataTypes.DATE, allowNull: false},
    },
        {            
            createdAt: 'createdDate',
            updatedAt: 'updatedDate'
        });
}
