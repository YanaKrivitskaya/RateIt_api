const Sequelize = require("sequelize").Sequelize

module.exports = db = {};

initialize();

async function initialize(){
    const sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {            
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            dialect: "mysql",
            timezone: '+00:00',
        }
    );
    
    db.User = require('./auth/user.model')(sequelize);    
    db.UserToken = require('./auth/userToken.model')(sequelize);    
    db.Otp = require('./auth/otp.model')(sequelize);
    db.Collection = require('./models/collection.model')(sequelize);
    db.CollectionItem = require('./models/collection_item.model')(sequelize);
    db.CollectionProperty = require('./models/collection_property.model')(sequelize);
    db.CollectionItemValue = require('./models/collection_item_value.model')(sequelize);
    db.DropdownValue = require('./models/dropdown_value.model')(sequelize);
    db.Attachment = require('./models/attachment.model')(sequelize);
    
    //relations
    db.User.hasMany(db.UserToken, {onDelete: 'CASCADE'});
    db.UserToken.belongsTo(db.User);
    
    db.User.hasMany(db.Collection);
    db.Collection.belongsTo(db.User);

    db.Collection.hasMany(db.CollectionItem);
    db.CollectionItem.belongsTo(db.Collection);

    db.Collection.hasMany(db.CollectionProperty);
    db.CollectionProperty.belongsTo(db.Collection);

    db.CollectionItem.belongsToMany(db.CollectionProperty, {through: 'collection_item_value', as: 'properties', foreignKey: 'itemId' });
    db.CollectionProperty.belongsToMany(db.CollectionItem, {through: 'collection_item_value', as: 'items', foreignKey: 'propertyId'});

    db.CollectionProperty.hasMany(db.CollectionItemValue, {as: 'value', foreignKey: 'propertyId'});
    db.CollectionItemValue.belongsTo(db.CollectionProperty, {as: 'property', foreignKey: 'propertyId'});

    db.CollectionItem.hasMany(db.CollectionItemValue, {as: 'values', foreignKey: 'itemId'});
    db.CollectionItemValue.belongsTo(db.CollectionItem, {foreignKey: 'itemId'});

    db.CollectionProperty.hasMany(db.DropdownValue, {foreignKey: 'propertyId'});
    db.DropdownValue.belongsTo(db.CollectionProperty, {foreignKey: 'propertyId'}); 

    db.CollectionItem.hasMany(db.Attachment, {foreignKey: 'itemId'});
    db.Attachment.belongsTo(db.CollectionItem, {foreignKey: 'itemId'});
    

    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        //print db associations
        /*const models = db;

        for (let model of Object.keys(models)) {
          if(models[model].name === 'Sequelize')
              continue;
          if(!models[model].name)
              continue;

          console.log("\n\n----------------------------------\n", 
          models[model].name, 
          "\n----------------------------------");
        
          console.log("\nAssociations");
          for (let assoc of Object.keys(models[model].associations)) {
              for (let accessor of Object.keys(models[model].associations[assoc].accessors)) {
              console.log(models[model].name + '.' + models[model].associations[assoc].accessors[accessor]+'()');
              }
          }
        }*/


      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}