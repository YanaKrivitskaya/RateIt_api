const express = require('express');
const router = express.Router();
const authorize = require('../helpers/jwt_helper');
const collectionsService = require('../services/collections.service');
const validator = require('../helpers/schema_validator');

module.exports = router;

router.get('/', authorize(), getCollections);
router.get('/basic/:id', authorize(), getCollectionBasic);
router.get('/:id', authorize(), getCollectionById);
router.get('/:id/properties', authorize(), getCollectionProperties);
router.post('/', authorize(), validator.createCollectionSchema, createCollection);
router.put('/', authorize(), validator.updateCollectionSchema, updateCollection);

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

function deleteCollection(req, res, next){
    collectionsService.deleteCollection(req.params.id, req.auth.id)
    .then((response) => res.json({response}))
    .catch(next);
}

