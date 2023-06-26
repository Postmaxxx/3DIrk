import './catalog.scss'
import SpliderSingle from '../../components/Spliders/Single/SpliderSingle';
import "@splidejs/react-splide/css"; 
import CategoriesList from '../../components/CatalogList/CatalogList';
import CatalogIntro from '../../components/CatalogIntro/CatalogIntro';




const Catalog = (): JSX.Element => {
    return (
        <div className="page page_catalog">
            <div className="container_page">
                <div className="container">
                    <CatalogIntro />
                    <div className="splider_catalog__main">
                        <CategoriesList />
                        <SpliderSingle />
                    </div>
                </div>
            </div>
        </div>
    )
}



  
  
export default Catalog
