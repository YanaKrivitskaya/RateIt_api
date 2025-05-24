const { DataTypes } = require('sequelize');

module.exports = (sequilize, type) =>{
    return sequilize.define('collection_item', {
        id:{type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
        name:{type:DataTypes.STRING(50), allowNull: false},
        description:{type:DataTypes.STRING(250)},
        imageSrc:{type:DataTypes.BLOB()},
        rating:{type:DataTypes.DECIMAL},
        createdDate:{type:DataTypes.DATE, allowNull: false},
        updatedDate:{type:DataTypes.DATE, allowNull: false},
    },
        {            
            createdAt: 'createdDate',
            updatedAt: 'updatedDate'
        });
}