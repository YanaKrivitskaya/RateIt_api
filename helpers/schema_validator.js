const Joi = require('joi');
const validateRequest = require('./validate_request');

module.exports = {
    createCollectionSchema,
    updateCollectionSchema,
    createPropertySchema,
    updatePropertySchema,
    createItemSchema,
    updateItemSchema,
    createDropdownSchema,
    createPropertyValueSchema,
    updatePropertyValueSchema
}

function createCollectionSchema(req, res, next) {
    const schema = Joi.object({        
        name: Joi.string().required().max(50),
        description: Joi.string().max(250).allow(null, ''),
        icon: Joi.number().allow(null, ''),
        colorPrimary: Joi.number().allow(null, ''),
        colorAccent: Joi.number().allow(null, '')
    });
    validateRequest(req, next, schema);
}

function updateCollectionSchema(req, res, next) {
    const schema = Joi.object({
        id: Joi.number().required(),
        name: Joi.string().required().max(50),
        description: Joi.string().max(250).allow(null, ''),
        icon: Joi.number().allow(null, ''),
        colorPrimary: Joi.number().allow(null, ''),
        colorAccent
        : Joi.number().allow(null, '')
    });
    validateRequest(req, next, schema);
}

function createPropertySchema(req, res, next) {
    const schema = Joi.object({        
        name: Joi.string().required().max(50),
        type: Joi.string().required().max(50),
        comment: Joi.string().max(50).allow(null, ''),
        isFilter: Joi.boolean(),
        isDropdown: Joi.boolean(),
        isRequired: Joi.boolean(),
        minValue: Joi.number().allow(null, ''),
        maxValue: Joi.number().allow(null, ''),
        order: Joi.number().allow(null, ''),
    });
    validateRequest(req, next, schema);
}

function updatePropertySchema(req, res, next) {
    const schema = Joi.object({
        id: Joi.number().required(),
        name: Joi.string().required().max(50),
        type: Joi.string().required().max(50),
        comment: Joi.string().max(50).allow(null, ''),
        isFilter: Joi.boolean(),
        isDropdown: Joi.boolean(),
        isRequired: Joi.boolean(),
        minValue: Joi.number().allow(null, ''),
        maxValue: Joi.number().allow(null, ''),
        order: Joi.number().allow(null, ''),
    });
    validateRequest(req, next, schema);
}

function createItemSchema(req, res, next) {
    const schema = Joi.object({        
        name: Joi.string().required().max(50),
        description: Joi.string().allow(null, '').max(250),
        rating: Joi.number().required(),
        date: Joi.date().required()
    });
    validateRequest(req, next, schema);
}

function updateItemSchema(req, res, next) {
    const schema = Joi.object({       
        id: Joi.number().required(), 
        name: Joi.string().required().max(50),
        description: Joi.string().allow(null, '').max(250),
        rating: Joi.number().required(),
        date: Joi.date().required()    
    });
    validateRequest(req, next, schema);
}

function createDropdownSchema(req, res, next){
    const schema = Joi.object({
        data: Joi.array().items(
            Joi.object({
                propertyId: Joi.number().required(),
                value: Joi.string().required().max(50),
            })
        )
    });
    validateRequest(req, next, schema);
}

function createPropertyValueSchema(req, res, next){
    const schema = Joi.object({
        data: Joi.array().items(
            Joi.object({
                itemId: Joi.number().required(),
                propertyId: Joi.number().required(),
                value: Joi.string().required().max(250),
            })
        )        
    });
    validateRequest(req, next, schema);
}

function updatePropertyValueSchema(req, res, next){
    const schema = Joi.object({        
        data: Joi.array().items(
            Joi.object({
                id: Joi.number().required(),               
                value: Joi.string().required().max(250),
            })
        )
    });
    validateRequest(req, next, schema);
}