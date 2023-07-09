import { IImageSizes, allPaths, delayForFS, sizes } from "../data/consts"
import { IMulterFile } from "../routes/user"
import { foldersCleaner } from "./fsTools"
import { makeDelay } from "./makeDelay"

const sharp = require('sharp')
//sharp.cache(false);

interface ISizeItem {
    type: keyof typeof sizes
    path: string
}

interface IImageResizer {
    files: any[]
    format?: string
    sizesConvertTo: ISizeItem[]
}


const imagesResizer = async ({files = [], format = 'webp', sizesConvertTo = []}: IImageResizer) => {
    sharp.cache(false);
    for (const file of files) {
        const filePathName = file.path;
        const filename = file.filename;
        try {
            for (const size of sizesConvertTo) {
                if (size.type !== 'spliderMain') {
                    await sharp(filePathName) //original path, temp folder
                        .resize({
                            width: sizes[size.type].w,
                            height: sizes[size.type].h,
                            fit: 'outside',
                            withoutEnlargement: true
                        }) 
                        .toFormat(format)
                        .toFile(`${allPaths.pathToBase}/${size.path}/${filename}`) //path to save file
                } else {
                    if (size.type === 'spliderMain') {
                        await sharp(filePathName)
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
                            .toFile(`${allPaths.pathToBase}/${size.path}/${filename}`)
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    return sizesConvertTo.reduce((acc, size) => ({...acc, [size.type]: `${allPaths.pathToServer}/${size.path}`}), {}) as Record<keyof IImageSizes, string>
}



interface IResizeAndSave {
    baseFolder: string
    formats: (keyof IImageSizes)[] // ["medium", "full", "thumb", "spliderMain"]
    saveFormat?: string
    clearDir?: boolean
    files: IMulterFile[]
}

const resizeAndSave = async ({files=[], clearDir = false, baseFolder = allPaths.pathToTemp, saveFormat = 'webp', formats = []}: IResizeAndSave) => {
    if (clearDir) {
        await foldersCleaner(formats.map(format => `${allPaths.pathToBase}/${baseFolder}/${format}`))
    }
    await makeDelay(delayForFS)
    const sizesConvertTo = formats.map(format => ({type: format, path: `${baseFolder}/${format}`}))
    const paths = await imagesResizer({
        files,
        format: saveFormat,
        sizesConvertTo
    })

    return paths
}


export { imagesResizer, resizeAndSave }