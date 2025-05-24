const express = require('express');
const router = express.Router();
const Joi = require('joi');
const authorize = require('../helpers/jwt_helper');
const collectionsService = require('../services/collections.service');
const validateRequest = require('../helpers/validate_request');

module.exports = router;

router.get('/', authorize(), getCollections);
router.get('/properties', authorize(), getCollectionProperties);
router.get('/:id', authorize(), getCollectionById);

function getCollections(req, res, next){
    collectionsService.getCollections(req.auth.id)
    .then((collections) => res.json({collections}))
    .catch(next);
}

function getCollectionProperties(req, res, next){
    collectionsService.getCollectionProperties(req.auth.id)
    .then((properties) => res.json({properties}))
    .catch(next);
}

function getCollectionById(req, res, next){
    collectionsService.getCollectionExpanded(req.params.id, req.auth.id)
    .then((collection) => res.json({collection}))
    .catch(next);
}