const { DataTypes } = require('sequelize');

module.exports = (sequilize, type) =>{
    return sequilize.define('collection', {
        id:{type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
        name:{type:DataTypes.STRING(50), allowNull: false},
        description:{type:DataTypes.STRING(250)},
        icon:{type:DataTypes.INTEGER},
        colorPrimary:{type:DataTypes.BIGINT}, 
        colorAccent:{type:DataTypes.BIGINT}, 
        imageSrc:{type:DataTypes.BLOB()},
        createdDate:{type:DataTypes.DATE, allowNull: false},
        updatedDate:{type:DataTypes.DATE, allowNull: false},
        deleted:{type:DataTypes.BOOLEAN, defaultValue: 0},
        deletedDate:{type:DataTypes.DATE}
    },
        {            
            createdAt: 'createdDate',
            updatedAt: 'updatedDate'
        }
);
}
