const db = require('../db');
const auth = require('../auth/auth.service');
var moment = require('moment'); // require
moment().format(); 

module.exports = {
    getCollectionById,
    getCollections,
    getCollectionBasic,
    getCollectionExpanded,
    getCollectionProperties,
    createCollection,
    updateCollection,
    deleteCollection,
    userOwnsCollection
}

async function getCollections(userId){
    const user = await auth.getUserById(userId);    
    return await user.getCollections({where: {deleted: 0}});
}

async function getCollectionById(id){    
    var collection =  await db.Collection.findByPk(id);
    if(!collection) throw 'Collection not found';
    return collection;
}

async function getCollectionBasic(id, userId){
    await userOwnsCollection(userId, id);
    return await getCollectionById(id);
}

async function getCollectionExpanded(id, userId){
    await userOwnsCollection(userId, id);

    var collection = await getCollectionById(id);
    
    var res = collection.get({plain: true});

    res.items = await getItems(id);    

    return res;
}

async function getItems(collectionId){
    const items = await db.Item.findAll(
        {            
            where: {collectionId: collectionId},
            attributes: ["id", "name", "description", "rating", "date","createdDate", "updatedDate"],
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

    return items;
}

async function getCollectionProperties(collectionId){
    const items = await db.Property.findAll(
        {            
            where: {collectionId: collectionId},
            order: [
                ['order', 'ASC']
            ],
            include:[
                {
                    model: db.DropdownValue,
                    attributes: ['value'],
                }
        ]
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

async function deleteCollection(collectionId, userId){
    await userOwnsCollection(userId, collectionId);

    await db.Collection.update({ 
        deleted: 1,
        deletedDate: Date.now()
     }, {
        where: {
          id: collectionId
        }
      });
    return "Ok";
}

async function destroyCollection(collectionId, userId){
    await userOwnsCollection(userId, collectionId);

    const collection = await db.Collection.findByPk(collectionId);

    const items = await collection.getCollection_items();
    for (const item of items){
        await destroyItem(item.id);
    } 

    const properties = await collection.getCollection_properties();
    for (const prop of properties){
        await destroyProperty(prop.id);
    }  

    return "Ok";
}

async function userOwnsCollection(userId, collectionId){
    const user = await auth.getUserById(userId);    

    const userCollections = await user.getCollections({ where: {id: collectionId}});

    if(userCollections.length == 0) throw "No permissions for this collection";
    return true;
}