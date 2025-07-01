const express = require('express');
const router = express.Router();
const Joi = require('joi');
const authorize = require('../helpers/jwt_helper');
const attachmentsService = require('../services/attachments.service');
const validator = require('../helpers/schema_validator');
const multer = require('multer');

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
})

const upload = multer({ storage: storage })

module.exports = router;

router.post('/:collectionId/:itemId', authorize(), upload.array('files', 5), createAttachment);
router.get('/:collectionId/:id', authorize(), getAttachment)

function createAttachment(req, res, next){
    attachmentsService.createAttachments(req.files, req.params.collectionId, req.params.itemId, req.auth.id)
        .then((attachments) => res.json({attachments}))
        .catch(next);
}

function getAttachment(req, res, next){
    attachmentsService.getAttachment(req.params.collectionId, req.params.id, req.auth.id)
        .then(({fileName, options}) =>  res.sendFile(fileName, options, (err) => {
            if (err) {
            next(err)
            } else {
            console.log('Sent:', fileName);
            }
        }))
        .catch(next);
}

function getAttachmentBase64(req, res, next){
    attachmentsService.getAttachmentBase64(req.params.collectionId, req.params.id, req.auth.id)
        .then((attachment) => res.json({attachment}))
        .catch(next);
}
