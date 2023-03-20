const mongoose = require('mongoose');
const id_validator = require ('mongoose-id-validator');

var SiteSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    },


}, { timestamps: true });
SiteSchema.plugin(id_validator);
SiteSchema.index("completed");


const Site = mongoose.model('Site', SiteSchema );

module.exports = Site