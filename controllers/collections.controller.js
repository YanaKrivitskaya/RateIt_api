const express = require('express');
const router = express.Router();
const Joi = require('joi');
const authorize = require('../helpers/jwt_helper');
const collectionsService = require('../services/collections.service');
const validateRequest = require('../helpers/validate_request');

module.exports = router;

router.get('/', authorize(), getCollections);
router.get('/:id', authorize(), getCollectionById);
router.get('/:id/properties', authorize(), getCollectionProperties);
router.get('/:id/items/:itemId', authorize(), getItemWithProperties);
router.post('/', authorize(), createCollectionSchema, createCollection);
router.put('/', authorize(), updateCollectionSchema, updateCollection);
router.post('/:id/properties', authorize(), createPropertySchema, createProperty);
router.put('/:id/properties', authorize(), updatePropertySchema, updateProperty);
router.post('/:id/items', authorize(), createItemSchema, createItem);
router.put('/:id/items', authorize(), updateItemSchema, updateItem);
router.post('/:id/properties/:propertyId/dropdown', authorize(), createDropdownSchema, createDropdownValue);
router.post('/:id/properties/values', authorize(), createPropertyValue);

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

function getCollectionById(req, res, next){
    collectionsService.getCollectionExpanded(req.params.id, req.auth.id)
    .then((collection) => res.json({collection}))
    .catch(next);
}

function getItemWithProperties(req, res, next){
    collectionsService.getItemWithProperties(req.params.id, req.params.itemId, req.auth.id)
    .then((item) => res.json({item}))
    .catch(next);
}

function createCollectionSchema(req, res, next) {
    const schema = Joi.object({        
        name: Joi.string().required(),
        description: Joi.string(),
        icon: Joi.number().allow(null, ''),
        color: Joi.number().allow(null, '')
    });
    validateRequest(req, next, schema);
}

function createCollection(req, res, next){
    collectionsService.createCollection(req.body, req.auth.id)
    .then((collection) => res.json({collection}))
    .catch(next);
}

function updateCollectionSchema(req, res, next) {
    const schema = Joi.object({
        id: Joi.number().required(),
        name: Joi.string().required(),
        description: Joi.string(),
        icon: Joi.number().allow(null, ''),
        color: Joi.number().allow(null, '')
    });
    validateRequest(req, next, schema);
}

function updateCollection(req, res, next){
    collectionsService.updateCollection(req.body, req.auth.id)
    .then((collection) => res.json({collection}))
    .catch(next);
}

function createPropertySchema(req, res, next) {
    const schema = Joi.object({        
        name: Joi.string().required(),
        type: Joi.string().required(),
        comment: Joi.string(),
        isFilter: Joi.boolean(),
        isDropdown: Joi.boolean(),
    });
    validateRequest(req, next, schema);
}

function createProperty(req, res, next){
    collectionsService.createProperty(req.body, req.params.id, req.auth.id)
    .then((property) => res.json({property}))
    .catch(next);
}

function updatePropertySchema(req, res, next) {
    const schema = Joi.object({
        id: Joi.number().required(),
        name: Joi.string().required(),
        type: Joi.string().required(),
        comment: Joi.string(),
        isFilter: Joi.boolean(),
        isDropdown: Joi.boolean(),
    });
    validateRequest(req, next, schema);
}

function updateProperty(req, res, next){
    collectionsService.updateProperty(req.body, req.params.id, req.auth.id)
    .then((property) => res.json({property}))
    .catch(next);
}

function createItemSchema(req, res, next) {
    const schema = Joi.object({        
        name: Joi.string().required(),
        description: Joi.string().allow(null, ''),
        rating: Joi.number().required()
    });
    validateRequest(req, next, schema);
}

function createItem(req, res, next){
    collectionsService.createItem(req.body, req.params.id, req.auth.id)
    .then((item) => res.json({item}))
    .catch(next);
}

function updateItemSchema(req, res, next) {
    const schema = Joi.object({       
        id: Joi.number().required(), 
        name: Joi.string().required(),
        description: Joi.string().allow(null, ''),
        rating: Joi.number().required()
    });
    validateRequest(req, next, schema);
}

function updateItem(req, res, next){
    collectionsService.updateItem(req.body, req.params.id, req.auth.id)
    .then((item) => res.json({item}))
    .catch(next);
}

function createDropdownSchema(req, res, next) {
    const schema = Joi.object({        
        value: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function createDropdownValue(req, res, next){
    collectionsService.createDropdownValue(req.body, req.params.id, req.params.propertyId, req.auth.id)
    .then((value) => res.json({value}))
    .catch(next);
}

function createPropertyValue(req, res, next){
    collectionsService.createPropertyValues(req.body.itemId, req.body.data, req.params.id, req.auth.id)
    .then((item) => res.json({item}))
    .catch(next);
}
