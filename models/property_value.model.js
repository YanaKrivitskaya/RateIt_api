const { DataTypes } = require('sequelize');

module.exports = (sequilize, type) =>{
    return sequilize.define('property_value', {
        id:{type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
        itemId:{type: DataTypes.INTEGER, allowNull: false},
        propertyId:{type: DataTypes.INTEGER, allowNull: false},
        value:{type:DataTypes.STRING(250), allowNull: false},        
        createdDate:{type:DataTypes.DATE, allowNull: false},
        updatedDate:{type:DataTypes.DATE, allowNull: false},
    },
        {            
            createdAt: 'createdDate',
            updatedAt: 'updatedDate'
        });
}
