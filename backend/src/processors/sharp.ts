import { IImageSizes, allPaths, sizes } from "../data/consts"

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
    
    return sizesConvertTo.reduce((acc, size) => ({...acc, [size.type]: `${allPaths.pathToServer}/${size.path}`}), {})
}


export { imagesResizer }