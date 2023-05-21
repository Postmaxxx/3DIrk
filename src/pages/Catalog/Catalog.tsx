import './catalog.scss'
import { IDataLoading, IFullState, TLang } from "src/interfaces";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { useEffect } from "react";
import SpliderSingle from 'src/components/Spliders/Single/SpliderSingle';
import "@splidejs/react-splide/css"; 

import CategoriesList from 'src/components/CategoriesList/CategoriesList';
import CatalogIntro from 'src/components/CatalogIntro/CatalogIntro';

import { loadColors }  from "../../redux/actions/colors"
import { loadFibers }  from "../../redux/actions/fibers"

const actionsListColors = { loadColors }
const actionsListFibers = { loadFibers }

interface IPropsState {
    colorsLoading: IDataLoading
    fibersLoading: IDataLoading
}

interface IPropsActions {
    setState: {
        colors: typeof actionsListColors,
        fibers: typeof actionsListFibers,
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
    colorsLoading: state.colors.dataLoading,
    fibersLoading: state.fibers.dataLoading
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		colors: bindActionCreators(actionsListColors, dispatch),
		fibers: bindActionCreators(actionsListFibers, dispatch),
	}
})
  
export default connect(mapStateToProps, mapDispatchToProps)(Catalog)
