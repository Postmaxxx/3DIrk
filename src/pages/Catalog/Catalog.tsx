import './catalog.scss'
import { IFetch, IFullState, TLang } from "../../interfaces";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { useEffect } from "react";
import SpliderSingle from '../../components/Spliders/Single/SpliderSingle';
import "@splidejs/react-splide/css"; 

import CategoriesList from '../../components/CatalogList/CatalogList';
import CatalogIntro from '../../components/CatalogIntro/CatalogIntro';
import { allActions } from "../../redux/actions/all";


interface IPropsState {
    colorsLoading: IFetch
    fibersLoading: IFetch
}

interface IPropsActions {
    setState: {
        fibers: typeof allActions.fibers
        colors: typeof allActions.colors
    }
}


interface IProps extends IPropsState, IPropsActions {}


const Catalog:React.FC<IProps> = ({colorsLoading, fibersLoading, setState}): JSX.Element => {

    useEffect(() => {
        if (colorsLoading.status === 'idle') {
            setState.colors.loadColors()
        }
        if (fibersLoading.status === 'idle') {
            setState.fibers.loadFibers()
        }
    }, [])
   


    

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


const mapStateToProps = (state: IFullState): IPropsState => ({
    colorsLoading: state.colors.load,
    fibersLoading: state.fibers.load
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		fibers: bindActionCreators(allActions.fibers, dispatch),
		colors: bindActionCreators(allActions.colors, dispatch),
	}
})
  
  
export default connect(mapStateToProps, mapDispatchToProps)(Catalog)
