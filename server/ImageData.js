
const mongoose = require('mongoose')


const ImageDataSchema = new mongoose.Schema({
    filename: String,
    url: String,
    contentType: String,
    size: Number,
})


module.exports = mongoose.model('ImageData' , ImageDataSchema)