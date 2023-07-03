const { Router } = require("express")
const router = Router()
const multer = require('multer');


const storageImages = multer.diskStorage({
    destination: (req, file, cb) => {
		console.log('fileType', req.body.fileType);
        cb(null, process.env.pathToUploads); // Set the destination folder for uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Keep the original file name
    },
	/*fileFilter: (req, res, cb) => {

	}*/
});

const uploadImages = multer({ storageImages });



const uploadImages2 = uploadImages.fields([
	{ name: 'colors', maxCount: 2 }, 
])







router.post('/upload', uploadImages.array('files'), (req, res) => {
	console.log('body: ', req.body);
    res.status(200).json({msg: 'File uploaded!'}); 
});



module.exports = router
export {}