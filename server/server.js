const express = require('express')
const mongoose = require('mongoose')
const Image = require('./Images')
const ImageData = require('./ImageData')

const multer = require('multer');
const path = require('path');
const cors = require("cors")


const app = express()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 



mongoose.connect('mongodb://localhost:27017/image-gallery', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });


  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Ensure this directory exists
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
  const upload = multer({ storage: storage }).single('file'); // when sending in postman , the key field has to be file



//changed endpoint from images to upload


app.post('/images', (req, res) => {
  //imp note : Multer adds a body object and a file or files object to the request object. The body object contains the values of the text fields of the form, the file or files object contains the files uploaded via the form.

  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const filePath = req.file ? req.file.path : req.body.acceptedFiles[0].path; // Ensure this path exists

    if (req.file || filePath) {
      try {
        // Create and save ImageData
        const imageData = new ImageData({
          filename: req.file ? req.file.filename : path.basename(filePath),
          url: req.file ? `/uploads/${req.file.filename}` : `/uploads/${path.basename(filePath)}`,
          contentType: req.file ? req.file.mimetype : 'none',
          size: req.file ? req.file.size : 'none',
        });
        const savedImageData = await imageData.save();

        // Create and save the Images document
        const images = new Image({
          title: req.body.title || 'Default Title',
          userName: req.body.userName || 'Default User',
          description: req.body.description || 'Default Description',
          imageInfo: savedImageData._id, // Reference to the saved ImageData
        });
        const savedImages = await images.save();

        res.status(201).json({
          message: "Image and metadata saved successfully",
          data: savedImages,
        });
      } catch (e) {
        res.status(500).json({
          message: 'Could not insert data',
          error: e.message,
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



//give the path of all the images
app.get("/images" , async (req , res) =>{
    //get all images
    const image = await ImageData.find({})
  
    // console.log('image is ' + image)
    //resolve the filename before giving sending
    const fileNames= image.map((item  ,idx) =>{ 
          let obj  = {
            fileName : item.filename,
            id : item._id.toString(),
            title : item.title,
            description : item.description,
            userName : item.userName
          }
          return obj;
        })
    console.log(fileNames)

    res.status(201).json({fileNames : fileNames})
})

//can't figure out the problem . 
app.get('/images-test', async (req, res) => {

  try{
  const combinedData = await Image.aggregate([
    {
      $lookup: {
        from: 'imagedatas',  // Collection name in the database
        localField: 'imageInfo',
        foreignField: '_id',
        as: 'imageDetails'
      }
    },
    {
      $unwind: {
        path: '$imageDetails',
        preserveNullAndEmptyArrays: true // If you want to keep images records without a match in imageData
      }
    },
    {
      $addFields: {
        filename: { $ifNull: ['$imageDetails.filename', null] },
        url: { $ifNull: ['$imageDetails.url', null] },
        contentType: { $ifNull: ['$imageDetails.contentType', null] },
        size: { $ifNull: ['$imageDetails.size', null] }
        // Add other fields from imageDetails as needed
      }
    },
    {
      $project: {
        imageDetails: 0 // Exclude imageDetails field if you don't want it in the final output
      }
    }
  ]);
    
 res.status(201).json({fileNames : combinedData})
  } catch (err) {
    console.error('Error combining data:', err);
  }
});



app.get("/images/user" , (req , res) =>{
    
})

app.get("/images/title" , (req , res) =>{

})
app.delete("/images/:id" , async (req , res) =>{
  try{
    const id = req.params.id
    console.log(id)
    // const Imagedelete = await Image.deleteOne({_id : id})
    const ImageDatadelete = await ImageData.deleteOne({_id : id})
    const ImageDelete = await Image.deleteOne({_id : id})

    // console.log(result)
    res.sendStatus(200)
  }
  catch(e){
    console.log(e);
    res.sendStatus(400 )
  }
  
  
})


app.patch("/images/:id", async (req, res) => {
  const imageId = req.params.id;

  console.log('Updating image...');

  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const filePath = req.file ? req.file.path : req.body.acceptedFiles[0].path;

    try {
      // First, find the `Image` document and retrieve the `imageInfo` reference
      const image = await Image.findById(imageId);

      if (!image) {
        return res.status(404).json({ message: 'Image not found' });
      }

      const imageDataId = image.imageInfo;  // This is the reference to the `ImageData` document

      // Update `ImageData` using the retrieved `imageDataId`
      await ImageData.findByIdAndUpdate(imageDataId, {
        filename: req.file ? req.file.filename : path.basename(filePath),
        url: req.file ? `/uploads/${req.file.filename}` : `/uploads/${path.basename(filePath)}`,
        contentType: req.file ? req.file.mimetype : 'none',
        size: req.file ? req.file.size : 'none'
      }, { new: true });

      // Update `Image` using the `imageId`
      await Image.findByIdAndUpdate(imageId, {
        title: req.body.title,
        userName: req.body.userName,
        description: req.body.description
      }, { new: true });

      res.status(201).json({
        message: "Image and metadata updated successfully"
      });
    } catch (e) {
      res.status(500).json({
        message: 'Could not update data',
        error: e.message,
      });
    }
  });
});


app.post("/test-upload" , (req , res) =>{
  //insert into the uploads folder 

  const acceptedFiles = req.body.acceptedFiles
  console.log(acceptedFiles[0].path)
})

app.listen(3000 , ()=>{ console.log('listening ... ')})