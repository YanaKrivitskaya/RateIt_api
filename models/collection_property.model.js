const { DataTypes } = require('sequelize');

module.exports = (sequilize, type) =>{
    return sequilize.define('collection_property', {
        id:{type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
        name:{type:DataTypes.STRING(50), allowNull: false},
        type:{type:DataTypes.STRING(50), allowNull: false},
        comment:{type:DataTypes.STRING(50)},
        isFilter:{type:DataTypes.BOOLEAN},
        isDropdown:{type:DataTypes.BOOLEAN},
        isRequired:{type:DataTypes.BOOLEAN},
        createdDate:{type:DataTypes.DATE, allowNull: false},
        updatedDate:{type:DataTypes.DATE, allowNull: false},
    },
        {            
            createdAt: 'createdDate',
            updatedAt: 'updatedDate'
        });
}