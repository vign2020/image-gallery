
const mongoose = require('mongoose')
const ImageData = require('./ImageData')


const ImageSchema = new mongoose.Schema({
    title : String,
    userName : String,
    description : String,
    imageInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ImageData', // Reference to the ImageInfo schema
    },
})


module.exports = mongoose.model('Images' , ImageSchema)