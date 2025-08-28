const db = require('../db');
const collectionService = require('./collections.service');
const Sequelize = require('sequelize');
var moment = require('moment'); // require
moment().format(); 

module.exports = {    
    getProperty,
    getPropertyValuesDistinct,
    createProperty,
    updateProperty,
    deleteProperty,
    updateDropdownValue,
    deleteDropdownValue,
}

async function getPropertyById(propertyId){
    var property =  await db.Property.findByPk(propertyId);
    if(!property) throw 'Collection property not found';
    return property;
}

async function getProperty(propertyId, userId){
    await userOwnsProperty(userId, propertyId);

   return await db.Property.findByPk(propertyId, 
        {            
            include:[{
                model: db.DropdownValue,
                attributes: ['value'],
            }]
        }
    );    
}

async function getPropertyValuesDistinct(propertyId, userId){
    await userOwnsProperty(userId, propertyId);

    const values = await db.PropertyValue.findAll(
        {            
            where: {propertyId: propertyId},            
            attributes:[Sequelize.fn('DISTINCT', Sequelize.col('value')), 'value']
        }
    );

    return values;
}

async function createProperty(property, collectionId, userId){
    await collectionService.userOwnsCollection(userId, collectionId);

    const collection  = await collectionService.getCollectionById(collectionId);    

    const newProperty = await db.Property.create(property);

    await newProperty.setCollection(collection);

    return await getPropertyById(newProperty.id);
}

async function updateProperty(updProperty, userId){
    await userOwnsProperty(userId, updProperty.id);

    const property = await getPropertyById(updProperty.id);

    await property.update(updProperty);

    return await getPropertyById(property.id);
}

async function deleteProperty(propertyId, userId){
    await userOwnsProperty(userId, propertyId);

    await destroyProperty(propertyId);

    return "Ok";
}

async function updateDropdownValue(data, propertyId, userId){
    await userOwnsProperty(userId, propertyId);

    await db.DropdownValue.destroy({where:{propertyId: propertyId}});

    await db.DropdownValue.bulkCreate(data);

    return await db.DropdownValue.findAll({where: {propertyId: propertyId}});
}

async function deleteDropdownValue(dropdownId, userId){
    const dropdown = await db.DropdownValue.findByPk(dropdownId);
    const property = await dropdown.getProperty();
    await userOwnsProperty(userId, property.id);

    await db.DropdownValue.destroy({where:{id: dropdownId}});
    return "Ok";
}

async function destroyProperty(propertyId){
    await db.DropdownValue.destroy({where:{propertyId: propertyId}});
    await db.PropertyValue.destroy({where:{propertyId: propertyId}});
    await db.Property.destroy({where:{id: propertyId}});
}

async function userOwnsProperty(userId, propertyId){
    const property = await getPropertyById(propertyId);
    const collection = await property.getCollection();

    await collectionService.userOwnsCollection(userId, collection.id);
}