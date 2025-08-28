const db = require('../db');
const itemsService = require('./items.service');
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

async function createAttachments(data, itemId, userId){
    await itemsService.userOwnsItem(userId, itemId);

    let attachments = [];

    for(const att of data){        
        attachments.push({itemId: itemId, originalName: att.originalname, path: att.path, fileName: att.filename});
    }

    await db.Attachment.bulkCreate(attachments);
    return await db.Attachment.findAll({where: {itemId: itemId}});
}

async function getCoverAttachment(itemId, userId){
    await itemsService.userOwnsItem(userId, itemId);
    return await db.Attachment.findOne({where: {itemId: itemId}});    
}

async function getAttachment(id, userId){
    var att =  await db.Attachment.findByPk(id);
    var item = await att.getItem();
    await itemsService.userOwnsItem(userId, item.id);
    
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

async function deleteAttachment(id, userId){
    var att =  await db.Attachment.findByPk(id);
    var item = await att.getItem();
    await itemsService.userOwnsItem(userId, item.id);

    await fs.unlink(att.path, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return res.status(500).send('Error deleting file.');
        }        
    });

    await db.Attachment.destroy({where:{id: id}});
    return "Ok";
}