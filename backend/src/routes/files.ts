import { allPaths } from "../data/consts";
import { filenameChanger } from "../processors/filenameChanger";
import { IMulterFile } from "./user";

const multer = require('multer');
const sharp = require('sharp')




const storageUser = multer.diskStorage({
	destination: (req, file: IMulterFile, cb) => {
	  	cb(null, `${allPaths.pathToTemp}`); // Set the destination folder for uploaded files
	},
	filename: (req, file, cb) => {
		file.filename = filenameChanger(Buffer.from(file.originalname, 'latin1').toString('utf8'))
	  	cb(null, file.filename); 
	}
}); 

const fileSaver = multer({ storage: storageUser }).array('files');


/*
const storageImages = multer.diskStorage({
	destination: (req, file, cb) => {
	  	cb(null, `${allPaths.pathToTemp}/`); 
	},
	filename: (req, file, cb) => {
		file.filename = filenameChanger(Buffer.from(file.filename, 'latin1').toString('utf8'))
	  	cb(null, file.filename); 
	}
}); 

const uploadImages = multer({ storage: storageImages }).array('files');

*/






/*
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
	  cb(null, allPaths.pathToUploadsImages); // Set the destination folder for uploaded files
	},
	filename: (req, file, cb) => {
	  cb(null, file.filename); // Keep the original file name
	}
  });
   


const upload = multer({ storage });
 
*/
/*
router.post('/upload', upload.array('files'), async (req, res) => {

	const filesDest =  req.body.filesDest;
	const files = req.files;

	try {
		for (const file of files) {
			const { path: imagePath, filename } = file;
			console.log( imagePath, filename );
			const outputPath = `uploads/resized-${filename}`; // Replace 'uploads/' with your desired output directory
			
		    await sharp(imagePath)
			.resize(100, 100) // Replace with your desired dimensions
			.toFile(outputPath);
		}
	
		res.status(200).send('Images uploaded, resized, and saved successfully.');
	} catch (err) {
		console.error('Error:', err);
		res.status(500).send('An error occurred while processing the images.');
	}


});
*/
/*

const uploaders = {
	user: uploadUser,
	//images: uploadImages
}

interface IUploaders {
	user: typeof uploadUser
	//images: typeof uploadImages
}
*/

module.exports = fileSaver
export {}
//export {IUploaders}