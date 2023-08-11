import { useEffect, useRef, useState, memo } from "react";
import Preloader from "../../components/Preloaders/Preloader";
import { sizesList } from "./consts";
import { IImageSizes } from "../../interfaces";
 
/*interface IImage {
	width: number
	url: string
}*/

export type TPartialPathList = {
    [key in keyof IImageSizes]?: string;
};

interface IProps {
	//images: IImage[]
	pathList: TPartialPathList
	alt?: string
	id?: string
	image: string
}



const PictureWithPreloader: React.FC<IProps> = ({pathList, alt, id, image}: IProps):JSX.Element => {
	
	const [loaded, setLoaded] = useState(false);
	const _img = useRef<HTMLImageElement>(null);
	const _spacer = useRef<HTMLDivElement>(null);
	const [containerWidth, setContainerWidth] = useState<number | undefined>(undefined)


	useEffect(() => {
		setContainerWidth(_spacer.current?.clientWidth)
	}, [])


	const hasLoaded = () => {
		setLoaded(true)
	}

	//sizesList is sorted by increasing width
	//search first existed (in pathList) sizename with width for this sizename >= container.width. or just get the last one in the list (the biggest) otherwise
	const bestSizeName = sizesList.find(size => size.w >= (containerWidth || 0) && pathList[size.name])?.name || sizesList[sizesList.length - 1].name
	console.log(containerWidth);
	
	
	return (
		<>
			{loaded || <Preloader />}
			{containerWidth ? 
				<img ref={_img} src={`${pathList[bestSizeName]}/${image}`} alt={alt} onLoad={hasLoaded} style={{display: loaded ? "block" : "none"}} id={id} />
				: 
				<div ref={_spacer} style={{width: '100%', height: '100%', position: 'absolute', top: '0', left: '0', border: '3px solid red'}}></div> //use mock to calculate the size of container
			}
		</>
	);
};

const PicWithPreloader = memo(PictureWithPreloader)
 
export default PicWithPreloader;

//<img ref={_img} src={images.find(image => image.width >= containerWidth)?.url || images[images.length-1].url} alt={alt} onLoad={hasLoaded} style={{display: loaded ? "block" : "none"}} id={id} />