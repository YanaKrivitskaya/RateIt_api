const express = require('express');
const router = express.Router();
const authorize = require('../helpers/jwt_helper');
const propertiesService = require('../services/properties.service');
const validator = require('../helpers/schema_validator');

module.exports = router;

router.get('/:id', authorize(), getProperty);
router.get('/:id/values', authorize(), getPropertyValuesDistinct);
router.post('/:collectionId', authorize(), validator.createPropertySchema, createProperty);
router.post('/:id/dropdown', authorize(), validator.createDropdownSchema, updateDropdownValue);
router.put('/', authorize(), validator.updatePropertySchema, updateProperty);
router.delete('/dropdown/:dropdownId', authorize(), deleteDropdownValue);
router.delete('/:id', authorize(), deleteProperty);

function getProperty(req, res, next){
    propertiesService.getProperty(req.params.id, req.auth.id)
    .then((property) => res.json({property}))
    .catch(next);
}

function getPropertyValuesDistinct(req, res, next){
    propertiesService.getPropertyValuesDistinct(req.params.id, req.auth.id)
    .then((values) => res.json({values}))
    .catch(next);
}

function createProperty(req, res, next){
    propertiesService.createProperty(req.body, req.params.collectionId, req.auth.id)
    .then((property) => res.json({property}))
    .catch(next);
}

function updateProperty(req, res, next){
    propertiesService.updateProperty(req.body, req.auth.id)
    .then((property) => res.json({property}))
    .catch(next);
}

function updateDropdownValue(req, res, next){
    propertiesService.updateDropdownValue(req.body.data, req.params.id, req.auth.id)
    .then((values) => res.json({values}))
    .catch(next);
}

function deleteDropdownValue(req, res, next){
    propertiesService.deleteDropdownValue(req.params.dropdownId, req.auth.id)
    .then((response) => res.json({response}))
    .catch(next);
}

function deleteProperty(req, res, next){
    propertiesService.deleteProperty(req.params.id, req.auth.id)
    .then((response) => res.json({response}))
    .catch(next);
}

