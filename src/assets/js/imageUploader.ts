import { IFetchImage } from "src/interfaces";


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


export { imageUploader }