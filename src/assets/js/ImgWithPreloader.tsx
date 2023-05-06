import { useEffect, useRef, useState } from "react";
import Preloader from "../../components/Preloader/Preloader";

interface IProps {
	link: string
	alt: string
}


const ImgWithPreloader = ({link, alt}: IProps) => {

	const [loaded, setLoaded] = useState(false);
	const img = useRef<HTMLImageElement>(null);


	return (
		<>
			{loaded || <Preloader />}
			<img ref={img} src={link} alt={alt} onLoad={() => setLoaded(true)} style={{display: loaded ? "block" : "none"}} />
		</>
	);
};


export default ImgWithPreloader;