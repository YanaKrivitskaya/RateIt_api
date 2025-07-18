const express = require('express');
const router = express.Router();
const Joi = require('joi');
const authorize = require('../helpers/jwt_helper');
const collectionsService = require('../services/collections.service');
const validator = require('../helpers/schema_validator');
const multer = require('multer');

// Configure storage for uploaded files
const upload = multer({ storage: multer.memoryStorage() })

module.exports = router;

router.get('/', authorize(), getCollections);
router.get('/basic/:id', authorize(), getCollectionBasic);
router.get('/:id', authorize(), getCollectionById);
router.get('/:id/properties', authorize(), getCollectionProperties);
router.get('/:id/properties/:propertyId', authorize(), getPropertyBasic);
router.get('/:id/items/:itemId', authorize(), getItemWithProperties);
router.post('/', authorize(), validator.createCollectionSchema, createCollection);
router.put('/', authorize(), validator.updateCollectionSchema, updateCollection);
router.post('/:id/properties', authorize(), validator.createPropertySchema, createProperty);
router.put('/:id/properties', authorize(), validator.updatePropertySchema, updateProperty);
router.post('/:id/items', authorize(), validator.createItemSchema, createItem);
router.put('/:id/items', authorize(), validator.updateItemSchema, updateItem);
router.post('/:id/properties/dropdown', authorize(), validator.createDropdownSchema, updateDropdownValue);
router.post('/:id/properties/values', authorize(), validator.createPropertyValueSchema, createPropertyValue);
router.put('/:id/properties/values', authorize(), validator.updatePropertyValueSchema, updatePropertyValue);
router.post('/:id/:itemId/attachments', authorize(), upload.array('files', 5), createAttachments);

router.delete('/dropdown/:id', authorize(), deleteDropdownValue);
router.delete('/properties/:id', authorize(), deleteProperty);
router.delete('/items/:id', authorize(), deleteItem);
router.delete('/:id', authorize(), deleteCollection);

function getCollections(req, res, next){
    collectionsService.getCollections(req.auth.id)
    .then((collections) => res.json({collections}))
    .catch(next);
}

function getCollectionProperties(req, res, next){
    collectionsService.getCollectionProperties(req.params.id, req.auth.id)
    .then((properties) => res.json({properties}))
    .catch(next);
}

function getCollectionBasic(req, res, next){
    collectionsService.getCollectionBasic(req.params.id, req.auth.id)
    .then((collection) => res.json({collection}))
    .catch(next);
}

function getCollectionById(req, res, next){
    collectionsService.getCollectionExpanded(req.params.id, req.auth.id)
    .then((collection) => res.json({collection}))
    .catch(next);
}

function getPropertyBasic(req, res, next){
    collectionsService.getPropertyBasic(req.params.id, req.params.propertyId, req.auth.id)
    .then((property) => res.json({property}))
    .catch(next);
}

function getItemWithProperties(req, res, next){
    collectionsService.getItemWithProperties(req.params.id, req.params.itemId, req.auth.id)
    .then((item) => res.json({item}))
    .catch(next);
}

function createCollection(req, res, next){
    collectionsService.createCollection(req.body, req.auth.id)
    .then((collection) => res.json({collection}))
    .catch(next);
}

function updateCollection(req, res, next){
    collectionsService.updateCollection(req.body, req.auth.id)
    .then((collection) => res.json({collection}))
    .catch(next);
}

function createProperty(req, res, next){
    collectionsService.createProperty(req.body, req.params.id, req.auth.id)
    .then((property) => res.json({property}))
    .catch(next);
}

function updateProperty(req, res, next){
    collectionsService.updateProperty(req.body, req.params.id, req.auth.id)
    .then((property) => res.json({property}))
    .catch(next);
}

function createItem(req, res, next){
    collectionsService.createItem(req.body, req.params.id, req.auth.id)
    .then((item) => res.json({item}))
    .catch(next);
}

function updateItem(req, res, next){
    collectionsService.updateItem(req.body, req.params.id, req.auth.id)
    .then((item) => res.json({item}))
    .catch(next);
}

function updateDropdownValue(req, res, next){
    collectionsService.updateDropdownValue(req.body.data, req.params.id, req.body.propertyId, req.auth.id)
    .then((values) => res.json({values}))
    .catch(next);
}

function createPropertyValue(req, res, next){
    collectionsService.createPropertyValues(req.body.data, req.params.id, req.body.itemId, req.auth.id)
    .then((item) => res.json({item}))
    .catch(next);
}

function updatePropertyValue(req, res, next){
    collectionsService.updatePropertyValues(req.body.data, req.params.id, req.auth.id)
    .then((response) => res.json({response}))
    .catch(next);
}

function createAttachments(req, res, next){
    collectionsService.createAttachments(req.files, req.params.id, req.params.itemId, req.auth.id)
    .then((attachments) => res.json({attachments}))
    .catch(next);
}

function deleteDropdownValue(req, res, next){
    collectionsService.deleteDropdownValue(req.params.id, req.auth.id)
    .then((response) => res.json({response}))
    .catch(next);
}

function deleteProperty(req, res, next){
    collectionsService.deleteProperty(req.params.id, req.auth.id)
    .then((response) => res.json({response}))
    .catch(next);
}

function deleteItem(req, res, next){
    collectionsService.deleteItem(req.params.id, req.auth.id)
    .then((response) => res.json({response}))
    .catch(next);
}

function deleteCollection(req, res, next){
    collectionsService.deleteCollection(req.params.id, req.auth.id)
    .then((response) => res.json({response}))
    .catch(next);
}

