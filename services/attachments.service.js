const db = require('../db');
const collectionsService = require('../services/collections.service');
const path = require('path');
const fs = require('fs');
var moment = require('moment'); // require
moment().format(); 
const { encode } = require('blurhash');
const sharp = require('sharp');

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
        var hash = await encodeImageToBlurhash(att.path);
        attachments.push({itemId: itemId, originalName: att.originalname, path: att.path, fileName: att.filename, blurHash: hash});
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

async function encodeImageToBlurhash(imagePath, componentX = 4, componentY = 4) {
      try {
        const image = sharp(imagePath);
        const metadata = await image.metadata();

        // Ensure image has RGBA format for BlurHash
        const { data, info } = await image
          .raw()
          .ensureAlpha()
          .toBuffer({ resolveWithObject: true });

        // Encode the image data to a BlurHash string
        const blurhash = encode(
          data,
          info.width,
          info.height,
          componentX, // Number of components in X direction
          componentY  // Number of components in Y direction
        );

        return blurhash;
      } catch (error) {
        console.error('Error encoding BlurHash:', error);
        throw error;
      }
    }