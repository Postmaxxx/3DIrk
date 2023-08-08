import { IImageSizes, allPaths, sizes } from "../data/consts"
import { IMulterFile } from "../routes/user"
import { filesUploaderS3, folderCleanerS3 } from "./aws"
const path = require('path');

const sharp = require('sharp')
//sharp.cache(false);

interface ISizeItem {
    type: keyof typeof sizes
    path: string
}

interface IImageResizer {
    files: IMulterFile[]
    format?: string
    sizesConvertTo: ISizeItem[]
}




const imagesResizerUploaderS3 = async ({files = [], format = 'webp', sizesConvertTo = []}: IImageResizer) => {
    sharp.cache(false);
    for (const file of files) {
        try {
            for (const size of sizesConvertTo) {
                const filePathName = file.path;
                let resized
                if (size.type !== 'spliderMain') {
                    resized = await sharp(filePathName) //original path, temp folder
                        .resize({
                            width: sizes[size.type].w,
                            height: sizes[size.type].h,
                            fit: 'outside',
                            withoutEnlargement: true
                        }) 
                        .toFormat(format)
                        .toBuffer()
                } else {
                    if (size.type === 'spliderMain') {
                        resized = await sharp(filePathName)
                            .resize({
                                width: sizes[size.type].w,
                                height: sizes[size.type].h,
                                fit: 'outside',
                                withoutEnlargement: true,
                                position: 'centre'
                            })
                            .resize({
                                width: sizes[size.type].w,
                                height: sizes[size.type].h,
                                withoutEnlargement: true,
                                fit: 'cover',
                                position: 'centre'
                            })  
                            .toFormat(format)
                            .toBuffer()
                    }
                }

                const originalFilenameWithoutExtension = path.basename(filePathName, path.extname(filePathName));

                const newFilename = `${originalFilenameWithoutExtension}.${format}`;
                const fileToUpload = {
                    content: resized,
                    fileName: newFilename
                }
                await filesUploaderS3({
                    bucketName: '3di',
                    folderName: `${size.path}/`,
                    files: [fileToUpload],
                    checkFolder: false,
                })
                
            }
        } catch (error) {
            throw error
        }
    }
    
    return sizesConvertTo.reduce((acc, size) => ({...acc, [size.type]: `${process.env.pathToStorage}/${size.path}`}), {}) as Record<keyof IImageSizes, string>
}



interface IResizeAndSave {
    baseFolder: string
    formats: (keyof IImageSizes)[] // ["medium", "full", "thumb", "spliderMain"]
    saveFormat?: string
    clearDir?: boolean
    files: IMulterFile[]
}




const resizeAndSaveS3 = async ({files=[], clearDir = false, baseFolder = allPaths.pathToTemp, saveFormat = 'webp', formats = []}: IResizeAndSave) => {
    try {
        if (clearDir) {
            for (const format of formats) {
                await folderCleanerS3(process.env.s3BucketName, `${baseFolder}/${format}/`)
            }
        }
    
        const sizesConvertTo = formats.map(format => ({type: format, path: `${baseFolder}/${format}`}))
        const paths = await imagesResizerUploaderS3({
            files,
            format: saveFormat,
            sizesConvertTo
        })
        return paths
        
    } catch (error) {
        throw error        
    }
    
}

export { resizeAndSaveS3, imagesResizerUploaderS3 } 