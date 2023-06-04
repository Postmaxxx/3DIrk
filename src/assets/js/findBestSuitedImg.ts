type TImage = {
	width: number
	height: number
	url: string
}


type TfindBestSuitedImg = {
	width: number
	height: number | undefined
	images: Array<TImage>
}

type TfindBestSuitedImgHeight = {
	height: number | undefined
	images: Array<Omit<TImage, "width">>
}


const findBestSuitedImg = ({width, height, images}: TfindBestSuitedImg): string => { //images must be sorted from smallest to biggest
	const resultImage = images.find(image => ((image.width >= width) || (image.height >= (height ? height : 0))));
	
	return resultImage?.url || images[images.length - 1].url;
};

const findBestSuitedImgHeight = ({height, images}: TfindBestSuitedImgHeight): string => { //images must be sorted from smallest to biggest
	const resultImage = images.find(image => ((image.height >= (height ? height : 0))));
	
	return resultImage?.url || images[images.length - 1].url;
};

export { findBestSuitedImg, findBestSuitedImgHeight };