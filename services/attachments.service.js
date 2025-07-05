const db = require('../db');
const collectionsService = require('../services/collections.service');
const path = require('path');
var moment = require('moment'); // require
moment().format(); 

module.exports = {    
    createAttachments,
    getAttachment,
    deleteAttachment
}

async function createAttachments(data, collectionId, itemId, userId){
    await collectionsService.userOwnsCollection(userId, collectionId);

    let attachments = [];

    data.forEach((att) => {        
        attachments.push({itemId: itemId, originalName: att.originalname, path: att.path, fileName: att.filename});
    });    

    await db.Attachment.bulkCreate(attachments);
    return await db.Attachment.findAll({where: {itemId: itemId}});
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

    await db.Attachment.destroy({where:{id: id}});
    return "Ok";
}