import { IAction, IDispatch, IFetch, IFetchImage, IImgWithThumb, TLangText } from "src/interfaces";
import { makeDelay } from "./makeDelay";
import { delayBetweenImagesPost } from "./consts";

/*
const imageUploader = async (image: File): Promise<IFetchImage> => {
    try {
        let form = new FormData();
        form.append("image", image)

        const response: Response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMGBB}`, {
            method: 'POST',
            body: form
        })

        const result = await response.json()
        
        if (!result.success) {
            return {status: 'error', message: {en:`Problem with the file ${image.name}, unable to upload`, ru: `Проблемы с файлом ${image.name}, невозможно выложить`}}
        }

        return {status: 'success', message: {en: 'File uploaded', ru: 'Файл выгружен'}, urls: {full: result.data.image?.url, medium: result.data.medium?.url, thumb: result.data.thumb?.url, fileName: image.name.split(".").slice(0,-1).join(".") || image.name}}
      
    } catch (e) {
        return {status: 'error', message: {en:`Error while deploying image ${image.name}: ${e}`, ru: `Ошибка при выгрузке файла ${image.name}: ${e}`}}
    }  
}





interface IImagesUploader {
    files: File[], 
    dispatch:IDispatch, 
    errorHandler: <T extends IFetch>(payload: T) => IAction<T>
}



interface IImagesUploaderReturn {
    urls: IImgWithThumb[]
    err: TLangText
}

const imagesUploader = async({files, dispatch, errorHandler}: IImagesUploader): Promise<IImagesUploaderReturn> => {
    const imageUrls: IImgWithThumb[] = []
    let err = {en: '', ru: ''}
    const success = await files.reduce(async (acc: Promise<string>, file: File, i) => {
        return new Promise(async (res, rej) => {
            await acc            
            const response = await imageUploader(file)
            if (response.status !== 'success') {
                err = response.message
                rej(`Error while uploading image ${file.name}`)
                return dispatch(errorHandler(response))
            }
            imageUrls.push(response.urls as IImgWithThumb)
            await makeDelay(delayBetweenImagesPost)
            res('ok')
        })
    }, Promise.resolve('start fetching images'))

    return {urls: imageUrls, err: err}
}


export { imageUploader, imagesUploader }*/