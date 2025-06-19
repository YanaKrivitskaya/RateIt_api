const { DataTypes } = require('sequelize');

module.exports = (sequilize, type) =>{
    return sequilize.define('collection', {
        id:{type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
        name:{type:DataTypes.STRING(50), allowNull: false},
        description:{type:DataTypes.STRING(250)},
        icon:{type:DataTypes.INTEGER},
        colorPrimary:{type:DataTypes.INTEGER}, 
        colorAccent:{type:DataTypes.INTEGER}, 
        imageSrc:{type:DataTypes.BLOB()},
        createdDate:{type:DataTypes.DATE, allowNull: false},
        updatedDate:{type:DataTypes.DATE, allowNull: false},
    },
        {            
            createdAt: 'createdDate',
            updatedAt: 'updatedDate'
        }
);
}
