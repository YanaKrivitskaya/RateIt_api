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
    db.Item = require('./models/item.model')(sequelize);
    db.Property = require('./models/property.model')(sequelize);
    db.PropertyValue = require('./models/property_value.model')(sequelize);
    db.DropdownValue = require('./models/dropdown_value.model')(sequelize);
    db.Attachment = require('./models/attachment.model')(sequelize);
    
    //relations
    db.User.hasMany(db.UserToken, {onDelete: 'CASCADE'});
    db.UserToken.belongsTo(db.User);
    
    db.User.hasMany(db.Collection);
    db.Collection.belongsTo(db.User);

    db.Collection.hasMany(db.Item);
    db.Item.belongsTo(db.Collection);

    db.Collection.hasMany(db.Property);
    db.Property.belongsTo(db.Collection);

    db.Item.belongsToMany(db.Property, {through: 'property_value', as: 'properties', foreignKey: 'itemId' });
    db.Property.belongsToMany(db.Item, {through: 'property_value', as: 'items', foreignKey: 'propertyId'});

    db.Property.hasMany(db.PropertyValue, {as: 'value', foreignKey: 'propertyId'});
    db.PropertyValue.belongsTo(db.Property, {as: 'property', foreignKey: 'propertyId'});

    db.Item.hasMany(db.PropertyValue, {as: 'values', foreignKey: 'itemId'});
    db.PropertyValue.belongsTo(db.Item, {foreignKey: 'itemId'});

    db.Property.hasMany(db.DropdownValue, {foreignKey: 'propertyId'});
    db.DropdownValue.belongsTo(db.Property, {foreignKey: 'propertyId'}); 

    db.Item.hasMany(db.Attachment, {foreignKey: 'itemId'});
    db.Attachment.belongsTo(db.Item, {foreignKey: 'itemId'});
    

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