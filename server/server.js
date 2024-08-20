const express = require('express')
const mongoose = require('mongoose')
const Images = require('./Images')
const ImageData = require('./ImageData')

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

            console.log('INSIDE THE IF ....')
              // Create and save ImageData first
              const imageData = new ImageData({
                  filename: req.file.filename,
                  url: `/uploads/${req.file.filename}`,
                  contentType: req.file.mimetype,
                  size: req.file.size,
              });
              const savedImageData = await imageData.save();

              // Then create and save the Images document
              const images = new Images({
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

//for some reason res.sendStatus gives a 'cannot set headers after they are....' error . 
app.get("/images" , async (req , res) =>{
    try{
      const user = await Images.find({})
      res.status(201).json({user})
    }
    catch(e){
      res.status(401).json({
        error : e,
        message : 'could not find'
      })
    }
})


app.get("/images/user/:userName" , async (req , res) =>{
    try{
      const user = await Images.find({userName : req.params.userName})
      res.status(201).json({
        user
      })
      
    }
    catch(e){
      res.status(401).json({
        error : e,
      })
    }
})

app.get("/images/:title" , async (req , res) =>{
  try{
    const user = await Images.find({title : req.params.title})
    res.status(201).json({
      user
    })
    
  }
  catch(e){
    res.status(401).json({
      error : e,
    })
  }

})

app.delete("/images/:title" , async (req , res) =>{
  try{
    const user = await Images.deleteOne({title : req.params.title})
    res.status(201).json({
      user
    })
    
  }
  catch(e){
    res.status(401).json({
      error : e,
    })
  }

})

// app.get("/test", async (req, res) => {
//   try {
//       const images = new Images({
       
//           title: 'asdf',
//           userName: '24234',
//           description: 'sdfsdfk'
//       });
//       const savedImage = await images.save();
//       res.status(200).json({
//           message: "Image saved successfully",
//           data: savedImage
//       });
//   } catch (e) {
//       console.log('Error is: ' + e);
//       res.status(500).json({
//           message: "An error occurred while saving the image",
//           error: e.message
//       });
//   }
// });

app.listen(3000 , ()=>{
    console.log('listening....')
})