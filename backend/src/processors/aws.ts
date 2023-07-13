import { IMulterFile } from "../routes/user";

const AWS = require('aws-sdk');
var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
AWS.config.credentials = credentials;


AWS.config.update({
  accessKeyId: process.env.awsAC,
  secretAccessKey: process.env.awsSAC,
  region: process.env.awsRegion
});

const s3 = new AWS.S3();


const checkAndCreateFolder = async (bucketName, folderName): Promise<string> => { //return error
    try {
        // Append a trailing slash to the folder name
        if (!folderName.endsWith('/')) {
            folderName += '/';
        } 
        const params = {
            Bucket: bucketName,
            Prefix: folderName,
            MaxKeys: 1
          };
        await s3.listObjectsV2(params, (err, data) => {
            if (err) {
                return `Error creating folder S3: ${err}`
            }
    
            const folderExists = data.Contents.length > 0;
    
            if (!folderExists) {
                // Create the folder
                s3.putObject({
                    Bucket: bucketName,
                    Key: folderName
                }, (err) => {
                    return err
                });//Folder was created
            } else {
                return ''; // Folder already exists
            }
        });
    } catch (error) {
        return error
    }
    /*return new Promise((resolve, reject) => {
      // Append a trailing slash to the folder name
      if (!folderName.endsWith('/')) {
        folderName += '/';
      }
  
      const params = {
        Bucket: bucketName,
        Prefix: folderName,
        MaxKeys: 1
      };
  
      s3.listObjectsV2(params, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
  
        const folderExists = data.Contents.length > 0;
  
        if (!folderExists) {
          // Create the folder
          s3.putObject({
            Bucket: bucketName,
            Key: folderName
          }, (err) => {err ? reject(err) : resolve(false); });//Folder was created
        } else {
          resolve(true); // Folder already exists
        }
      });
    });*/
}


interface IFileUploader {
    bucketName: string
    folderName: string
    files: IMulterFile[]
}


const fileUploader = ({bucketName, folderName, files}: IFileUploader) => {
    checkAndCreateFolder(bucketName, folderName)
}



export { checkAndCreateFolder }