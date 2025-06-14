const db = require('../db');
const auth = require('../auth/auth.service');
const fs = require('fs');
const { Op, where } = require("sequelize");
var moment = require('moment'); // require
moment().format(); 

module.exports = {
    getCollections,
    getCollectionExpanded,
    getCollectionProperties,
    createCollection,
    updateCollection,
    createProperty,
    updateProperty,
    createItem,
    updateItem,
    createDropdownValue,
    createPropertyValues,
    getItemWithProperties,
    createAttachments
}

async function getCollections(userId){
    const user = await auth.getUserById(userId);
    
    return await user.getCollections();
}

async function getCollectionById(id){    
    var collection =  await db.Collection.findByPk(id);
    if(!collection) throw 'Collection not found';
    return collection;
}

async function getPropertyById(id){    
    var property =  await db.CollectionProperty.findByPk(id);
    if(!property) throw 'Collection property not found';
    return property;
}

async function getItemById(id){    
    var item =  await db.CollectionItem.findByPk(id);
    if(!item) throw 'Collection item not found';
    return item;
}

async function getItemWithProperties(collectionId, itemId, userId){
    await userOwnsCollection(userId, collectionId);

    var item = await getItemExpanded(itemId);
    return item;
}

async function getItemExpanded(itemId){    

    const item = await db.CollectionItem.findByPk(itemId, {            
           
            attributes: ["id", "collectionId", "name", "description", "rating", "createdDate", "updatedDate"],
            include: [                      
            {                
                model: db.Attachment, 
                    attributes: ["id", "name", "source", "createdDate", "updatedDate"],
                    as: "attachments"
            }
        ]
        }
    ); 
    
    var res = item.get({plain: true});

    res.properties = await db.CollectionProperty.findAll(
        {            
            where: {collectionId: item.collectionId},
            include:[{
                model: db.DropdownValue,
                attributes: ['value'],
            },
            {
                association: 'value',
                attributes: ['value'],
            }            
        ]
        }
    );

    return res;
}

async function getCollectionExpanded(id, userId){
    await userOwnsCollection(userId, id);

    var collection = await getCollectionById(id);
    
    var res = collection.get({plain: true});

    res.items = await getCollectionItems(id);    

    return res;
}

async function getCollectionItems(collectionId){
    const items = await db.CollectionItem.findAll(
        {            
            where: {collectionId: collectionId},
            attributes: ["id", "name", "description", "rating", "createdDate", "updatedDate"],
            include: [
            {                
                model: db.CollectionProperty, 
                    attributes: ["id", "name", "type", "comment", "isFilter", "isDropdown", "createdDate", "updatedDate"],
                    as: "properties",
                    through: {
                        attributes: ['value'],
                    },
            },
            {                
                model: db.Attachment, 
                    attributes: ["id", "name", "source", "createdDate", "updatedDate"],
                    as: "attachments"
            }
        ]
        }
    );

    return items;
}

async function getCollectionProperties(collectionId){
    const items = await db.CollectionProperty.findAll(
        {            
            where: {collectionId: collectionId},
            include:[{
                model: db.DropdownValue,
                attributes: ['value'],
            }]
        }
    );

    return items;
}

async function createCollection(collection, userId){
    const user = await auth.getUserById(userId);

    const newCollection = await db.Collection.create(collection);

    await newCollection.setUser(user);

    return await getCollectionById(newCollection.id);
}

async function updateCollection(updCollection, userId){
    await userOwnsCollection(userId, updCollection.id);

    const collection  = await getCollectionById(updCollection.id);   

    await collection.update(updCollection);

    return await getCollectionById(collection.id);
}

async function createProperty(property, collectionId, userId){
    await userOwnsCollection(userId, collectionId);

    const collection  = await getCollectionById(collectionId);    

    const newProperty = await db.CollectionProperty.create(property);

    await newProperty.setCollection(collection);

    return await getPropertyById(newProperty.id);
}

async function updateProperty(updProperty, collectionId, userId){
    await userOwnsCollection(userId, collectionId);

    const property = await getPropertyById(updProperty.id);

    await property.update(updProperty);

    return getPropertyById(property.id);
}

async function createItem(item, collectionId, userId){
    await userOwnsCollection(userId, collectionId);

    const collection  = await getCollectionById(collectionId);    

    const newItem = await db.CollectionItem.create(item);

    await newItem.setCollection(collection);

    return await getItemById(newItem.id);
}

async function updateItem(updItem, collectionId, userId){
    await userOwnsCollection(userId, collectionId);

    const item = await getItemById(updItem.id);

    await item.update(updItem);

    return getItemExpanded(item.id);
}

async function createDropdownValue(data, collectionId, propertyId, userId){
    await userOwnsCollection(userId, collectionId);

    await db.DropdownValue.bulkCreate(data);

    return await db.DropdownValue.findAll({where: {propertyId: propertyId}});
}

async function createPropertyValues(data, collectionId, itemId, userId){
    await userOwnsCollection(userId, collectionId);

    await db.CollectionItemValue.bulkCreate(data);
    return await getItemExpanded(itemId);
}

async function createAttachments(data, collectionId, itemId, userId){
    await userOwnsCollection(userId, collectionId);

    await db.Attachment.bulkCreate(data);
    return await getItemExpanded(itemId);
}

async function userOwnsCollection(userId, collectionId){
    const user = await auth.getUserById(userId);    

    const userCollections = await user.getCollections({ where: {id: collectionId}});

    if(userCollections.length == 0) throw "No permissions for this collection";
    return true;
}