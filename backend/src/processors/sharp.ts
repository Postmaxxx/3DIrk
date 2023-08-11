import { IImageSizes, allPaths, sizes } from "../data/consts"
import { IMulterFile } from "../routes/user"
import { filesUploaderS3, folderCleanerS3 } from "./aws"
import { extChanger } from "./filenameChanger";
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
    const filesList = []
    for (const file of files) {
        try {
            const filePathName = file.path;
            const newFileName = extChanger(filePathName, 'webp').filenameFull
            filesList.push(newFileName)
            for (const size of sizesConvertTo) {
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

                
                const fileToUpload = {
                    content: resized,
                    fileName: newFileName
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
    
    return {
        paths: sizesConvertTo.reduce((acc, size) => ({...acc, [size.type]: `${process.env.pathToStorage}/${size.path}`}), {}) as Record<keyof IImageSizes, string>,
        filesList
    }
    
}



interface IResizeAndSave {
    baseFolder: string
    sizes: (keyof IImageSizes)[] // ["thumb", "preview", "small", "medium", "full", "spliderMain"]
    saveFormat?: string
    clearDir?: boolean
    files: IMulterFile[]
}




const resizeAndSaveS3 = async ({files=[], clearDir = false, baseFolder = allPaths.pathToTemp, saveFormat = 'webp', sizes = []}: IResizeAndSave) => {
    try {
        if (clearDir) {
            for (const size of sizes) {
                await folderCleanerS3(process.env.s3BucketName, `${baseFolder}/${size}/`)
            }
        }
    
        const sizesConvertTo = sizes.map(size => ({type: size, path: `${baseFolder}/${size}`}))
        const { paths, filesList } = await imagesResizerUploaderS3({
            files,
            format: saveFormat,
            sizesConvertTo
        })
        return { paths, filesList }
        
    } catch (error) {
        throw error        
    }
    
}

export { resizeAndSaveS3, imagesResizerUploaderS3 } 