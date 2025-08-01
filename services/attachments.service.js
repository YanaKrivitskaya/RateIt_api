const db = require('../db');
const collectionsService = require('../services/collections.service');
const path = require('path');
const fs = require('fs');
var moment = require('moment'); // require
moment().format(); 

module.exports = {    
    createAttachments,
    getAttachment,
    deleteAttachment,
    getCoverAttachment
}

async function createAttachments(data, collectionId, itemId, userId){
    await collectionsService.userOwnsCollection(userId, collectionId);

    let attachments = [];

    for(const att of data){        
        attachments.push({itemId: itemId, originalName: att.originalname, path: att.path, fileName: att.filename});
    }

    await db.Attachment.bulkCreate(attachments);
    return await db.Attachment.findAll({where: {itemId: itemId}});
}

async function getCoverAttachment(itemId, userId){
    var item =  await db.CollectionItem.findByPk(itemId);
    var collection = await item.getCollection();

    await collectionsService.userOwnsCollection(userId, collection.id);

    return await db.Attachment.findOne({where: {itemId: itemId}});
    //var collection = db.Collection
}

async function getAttachment(collectionId, id, userId){
    await collectionsService.userOwnsCollection(userId, collectionId);
    var att =  await db.Attachment.findByPk(id);

    const options = {
    root: path.join(__dirname, '../uploads'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }

  return {
        fileName: att.fileName, 
        options: options};
}

async function deleteAttachment(collectionId, id, userId){
    await collectionsService.userOwnsCollection(userId, collectionId);
    var att =  await db.Attachment.findByPk(id);

    await fs.unlink(att.path, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return res.status(500).send('Error deleting file.');
        }        
    });

    await db.Attachment.destroy({where:{id: id}});
    return "Ok";
}