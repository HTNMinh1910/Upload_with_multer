const express = require('express')
const app = express()
const port = 3030
const bodyParser = require('body-parser')
const multer = require('multer');
const fs = require('fs');

app.use(bodyParser.urlencoded({ extended: true }))

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        let dir = './uploads'
            if(!fs.existsSync(dir)){
                fs.mkdirSync(dir , {recursive:true});
            }
      let fileName = file.originalname;
      let arr = fileName.split('.');
      let newfile = arr[0] + '-' + Date.now() + '.' + arr[1];
        cb(null, newfile)
    }
})

var upload = multer({ storage: storage, limits:{fieldSize: 1*1024*1024}})

app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
    upload(req, res, function (err){
        if (err instanceof multer.MulterError) {
            return res.send("file upload is 1MB limit")
        }else {
            res.send("unsupported file")
        }
        res.send("file upload success")
    })
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(file)
})

//Uploading multiple files
app.post('/uploadmultiple', upload.array('myFiles', 12), (req, res, next) => {
    const files = req.files
    if (!files) {
        const error = new Error('Please choose files')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(files)
})
    
app.post("/upload/photo", upload.single('myImage'), (req, res, next) => {
    const file = req.file;
    if (!file) {
      const err = new Error("Please choose files");
      return next(err);
    }else if (file.mimetype != "image.jpeg"){
        res.send("File is not jpeg file")
    }
    res.send("Upload success!");
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/upload.html');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});