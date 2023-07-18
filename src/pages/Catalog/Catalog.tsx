import './catalog.scss'
import SpliderSingle from '../../components/Spliders/Single/SpliderSingle';
import "@splidejs/react-splide/css"; 
import CategoriesList from '../../components/CatalogList/CatalogList';
import CatalogIntro from '../../components/CatalogIntro/CatalogIntro';
import { memo } from 'react';


const CatalogIntroMemo = memo(CatalogIntro)
const CategoriesListMemo = memo(CategoriesList)
const SpliderSingleMemo = memo(SpliderSingle)

const Catalog = (): JSX.Element => {
    return (
        <div className="page page_catalog">
            <div className="container_page">
                <div className="container">
                    <CatalogIntroMemo />
                    <div className="splider_catalog__main">
                        <CategoriesListMemo />
                        <SpliderSingleMemo />
                    </div>
                </div>
            </div>
        </div>
    )
}



  
  
export default Catalog
