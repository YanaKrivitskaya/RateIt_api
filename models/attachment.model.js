const { DataTypes } = require('sequelize');

module.exports = (sequilize, type) =>{
    return sequilize.define('attachment', {
        id:{type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
        originalName:{type:DataTypes.STRING(250), allowNull: false}, 
        fileName:{type:DataTypes.STRING(250), allowNull: false}, 
        itemId: {type: DataTypes.INTEGER, allowNull: false},        
        path:{type:DataTypes.STRING(250)},
        source:{type:DataTypes.BLOB()},
        blurHash :{type:DataTypes.STRING(500), allowNull: false}, 
        createdDate:{type:DataTypes.DATE, allowNull: false},
        updatedDate:{type:DataTypes.DATE, allowNull: false},
    },
        {            
            createdAt: 'createdDate',
            updatedAt: 'updatedDate'
        }
);
}