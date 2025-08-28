const db = require('../db');
const collectionService = require('./collections.service');
var moment = require('moment'); // require
moment().format(); 

module.exports = {
    getItem,
    createItem,
    updateItem,   
    createPropertyValues,   
    updatePropertyValues,    
    deleteItem,
    userOwnsItem
}

async function getItemById(id){    
    var item =  await db.Item.findByPk(id);
    if(!item) throw 'Collection item not found';
    return item;
}

async function getItem(itemId, userId){    
    await userOwnsItem(userId, itemId);

    const item = await db.Item.findByPk(itemId, {            
           
            attributes: ["id", "collectionId", "name", "description", "rating", "date", "createdDate", "updatedDate"],
            include: [     
            {                
                model: db.Property, 
                    attributes: ["id", "name", "type", "comment", "isFilter", "isDropdown", "isRequired", "minValue", "maxValue", "order", "createdDate", "updatedDate"],
                    as: "properties",                    
                    through: {
                        attributes: ["id", 'value'],
                    },
            },                 
            {                
                model: db.Attachment, 
                    attributes: ["id", "originalName", "path", "createdDate", "updatedDate"],
                    as: "attachments"
            }
        ],
        order: [[{ model: db.Property, as: "properties" }, 'order', 'ASC']]
        }
    );  

    return item;
}

async function createItem(item, collectionId, userId){
    await collectionService.userOwnsCollection(userId, collectionId);

    const collection  = await collectionService.getCollectionById(collectionId);    

    const newItem = await db.Item.create(item);

    await newItem.setCollection(collection);

    return await getItemById(newItem.id);
}

async function updateItem(updItem, userId){
    await userOwnsItem(userId, updItem.id);

    const item = await getItemById(updItem.id);

    await item.update(updItem);

    return await getItemById(item.id);
}

async function createPropertyValues(data, itemId, userId){
    await userOwnsItem(userId, itemId);

    await db.PropertyValue.bulkCreate(data);
    return "Ok";
}

async function updatePropertyValues(data, itemId, userId){
    await userOwnsItem(userId, itemId);

    await db.PropertyValue.bulkCreate(data, { updateOnDuplicate: ["value"] });
    return "Ok";
}

async function deleteItem(itemId, userId){
    await userOwnsItem(userId, itemId);

    const item = await getItemById(itemId);
        
    const properties = await item.getProperties();
    for (const prop of properties){
        await db.PropertyValue.destroy({where:{propertyId: prop.id, itemId: item.id}});
    } 

    await destroyItem(itemId);
    
    return "Ok";
}

async function destroyItem(itemId){
    await db.Attachment.destroy({where:{itemId: itemId}});
    await db.Item.destroy({where:{id: itemId}});
}

async function userOwnsItem(userId, itemId){
    const item = await getItemById(itemId);
    const collection = await item.getCollection();

    await collectionService.userOwnsCollection(userId, collection.id);
}