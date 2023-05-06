type PImage = {
	width: number
	height: number
	image: string
}


type PfindBestSuitedImg = {
	width: number
	height: number
	images: Array<PImage>
}

const findBestSuitedImg = ({width, height, images}: PfindBestSuitedImg): PImage => {
	const resultImage = images.find(image => ((image.width >= width) || (image.height >= height)));
	return resultImage || images[images.length - 1];
};

export { findBestSuitedImg };