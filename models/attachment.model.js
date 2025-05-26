const { DataTypes } = require('sequelize');

module.exports = (sequilize, type) =>{
    return sequilize.define('attachment', {
        id:{type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
        name:{type:DataTypes.STRING(250), allowNull: false},        
        source:{type:DataTypes.BLOB()},
        createdDate:{type:DataTypes.DATE, allowNull: false},
        updatedDate:{type:DataTypes.DATE, allowNull: false},
    },
        {            
            createdAt: 'createdDate',
            updatedAt: 'updatedDate'
        }
);
}