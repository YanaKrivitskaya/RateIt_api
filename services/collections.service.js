const db = require('../db');
const auth = require('../auth/auth.service');
const fs = require('fs');
const { Op, where } = require("sequelize");
var moment = require('moment'); // require
moment().format(); 

module.exports = {
    getCollections,
    getCollectionExpanded,
    getCollectionProperties
}

async function getCollections(userId){
    const user = await auth.getUserById(userId);

    const response = await user.getCollections();
    return response;
}

async function getCollectionById(id){
    const response = await db.Collection.findByPk(id);
    return response;
}

async function getCollectionExpanded(id){
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