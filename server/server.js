const express = require('express')
const mongoose = require('mongoose')
const Images = require('./Images')

const multer = require('multer');
const path = require('path');


const app = express()


mongoose.connect('mongodb://localhost:27017/image-gallery', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });


  const storage = multer.diskStorage({
    destination: './uploads/', // folder to store images
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
  // Initialize upload
  const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
    fileFilter: (req, file, cb) => {
      const filetypes = /jpeg|jpg|png|gif/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);
  
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb('Error: Images Only!');
      }
    }
  }).single('image'); // 'image' is the field name for the file in the request



app.post('/images', (req, res) => {
  upload(req, res, async (err) => {
      if (err) {
          return res.status(400).json({ message: err.message });
      }

      if (req.file) {
          try {
              // Create and save ImageData first
              const imageData = new ImageData({
                  filename: req.file.filename,
                  url: `/uploads/${req.file.filename}`,
                  contentType: req.file.mimetype,
                  size: req.file.size,
              });
              const savedImageData = await imageData.save();

              // Then create and save the Images document
              const images = new Image({
                  title: req.body.title || 'Default Title',
                  userName: req.body.userName || 'Default User',
                  description: req.body.description || 'Default Description',
                  imageInfo: savedImageData._id, // Reference to the saved ImageData
              });
              const savedImages = await images.save();

              res.status(201).json({
                  message: "Image and metadata saved successfully",
                  data: savedImages
              });
          } catch (e) {
              res.status(500).json({
                  message: 'Could not insert data',
                  error: e.message
              });
          }
      } else {
          res.status(400).json({ message: 'No file uploaded' });
      }
  });
});



  app.get("/test", async (req, res) => {
    try {
        const images = new Images({
            path: 'sdf',
            title: 'asdf',
            userName: '24234',
            description: 'sdfsdfk'
        });
        const savedImage = await images.save();
        res.status(200).json({
            message: "Image saved successfully",
            data: savedImage
        });
    } catch (e) {
        console.log('Error is: ' + e);
        res.status(500).json({
            message: "An error occurred while saving the image",
            error: e.message
        });
    }
});


app.get("/images" , (req , res) =>{
    res.sendStatus(200)
})


app.get("/images/user" , (req , res) =>{
    
})

app.get("/images/title" , (req , res) =>{

})
app.delete("/images/title" , (req , res) =>{

})

app.listen(3000 , ()=>{
    console.log('listening....')
})