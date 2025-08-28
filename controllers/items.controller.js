const express = require('express');
const router = express.Router();
const authorize = require('../helpers/jwt_helper');
const itemsService = require('../services/items.service');
const validator = require('../helpers/schema_validator');

module.exports = router;

router.get('/:id', authorize(), getItem);
router.post('/:collectionId', authorize(), validator.createItemSchema, createItem);
router.post('/:id/values', authorize(), validator.createPropertyValueSchema, createPropertyValue);
router.put('/', authorize(), validator.updateItemSchema, updateItem);
router.put('/:id/values', authorize(), validator.updatePropertyValueSchema, updatePropertyValue);
router.delete('/:id', authorize(), deleteItem);

function getItem(req, res, next){
    itemsService.getItem(req.params.id, req.auth.id)
    .then((item) => res.json({item}))
    .catch(next);
}

function createItem(req, res, next){
    itemsService.createItem(req.body, req.params.collectionId, req.auth.id)
    .then((item) => res.json({item}))
    .catch(next);
}

function createPropertyValue(req, res, next){
    itemsService.createPropertyValues(req.body.data, req.params.id, req.auth.id)
    .then((response) => res.json({response}))
    .catch(next);
}

function updateItem(req, res, next){
    itemsService.updateItem(req.body, req.auth.id)
    .then((item) => res.json({item}))
    .catch(next);
}

function updatePropertyValue(req, res, next){
    itemsService.updatePropertyValues(req.body.data, req.params.id, req.auth.id)
    .then((response) => res.json({response}))
    .catch(next);
}

function deleteItem(req, res, next){
    itemsService.deleteItem(req.params.id, req.auth.id)
    .then((response) => res.json({response}))
    .catch(next);
}