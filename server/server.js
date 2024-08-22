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

//can't figure out the f***in problem . 
app.get('/images-test', async (req, res) => {
  try {
    // Fetch all ImageData documents
    const imageDataList = await ImageData.find({});

    // Create an array of promises for fetching the related Image documents
    const combinedData = await Promise.all(
      imageDataList.map(async (item) => {
        // Fetch the corresponding Image document
        const imageinfo = await Image.findOne({ _id: item._id });

        // Combine the ImageData and Image document fields
        return {
          ...item.toObject(),   // Convert Mongoose document to plain object
          imageinfo: imageinfo ? imageinfo.toObject() : null  // Handle cases where no Image is found
        };
      })
    );

    // Send the combined data as the response
    res.status(201).json({ Combined_data: combinedData });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'An error occurred', error: err.message });
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

    // console.log(result)
    res.sendStatus(200)
  }
  catch(e){
    console.log(e);
    res.sendStatus(400 )
  }
  
  
})


app.patch("/images/:id" , (req, res)=>{
      const id = req.params.id
      console.log(id)

      console.log('updating image ....')

      upload(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ message: err.message });
        }
    
        const filePath = req.file ? req.file.path : req.body.acceptedFiles[0].path; // Ensure this path exists

        if (req.file || filePath) {
          try {
            // Create and save ImageData

            await ImageData.findByIdAndUpdate(id , {    
              filename: req.file ? req.file.filename : path.basename(filePath),
              url: req.file ? `/uploads/${req.file.filename}` : `/uploads/${path.basename(filePath)}`,
              contentType: req.file ? req.file.mimetype : 'none',
              size: req.file ? req.file.size : 'none'
            }, { new: true })

    
            res.status(201).json({
              message: "Image and metadata saved successfully"
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

})

app.post("/test-upload" , (req , res) =>{
  //insert into the uploads folder 

  const acceptedFiles = req.body.acceptedFiles
  console.log(acceptedFiles[0].path)
})

app.listen(3000 , ()=>{ console.log('listening ... ')})