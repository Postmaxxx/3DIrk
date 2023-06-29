import "./catalog-list.scss";
import { ICatalog, ICatalogItem, IFullState, TId, TLang } from "../../interfaces";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { allActions } from "../../redux/actions/all";
import Preloader from "../Preloaders/Preloader";


interface IPropsState {
    catalog: ICatalog
	lang: TLang
	selectedCategory: TId
}

interface IPropsActions {
    setState: {
        catalog: typeof allActions.catalog
    }
}
interface IProps extends IPropsState, IPropsActions {}




const CatalogList: React.FC<IProps> = ({catalog, lang, selectedCategory, setState}): JSX.Element => {

	const loadCategory = (_id: TId) => {
		setState.catalog.loadCategory({_id, from: 0, to: 6})
		//console.log({_id, from: 0, to: 6});
	};


	useEffect(() => {
		if (catalog.load.status !== 'success' && catalog.load.status !== 'fetching') {
			setState.catalog.loadCatalog()
		}
	}, [])



	return(
		<div className="catalog-list__container">
			<div className="list">
				{catalog.load.status === 'success' ? 
				<ul>
					{catalog.list.map((category: ICatalogItem, index: number): JSX.Element => {
						return (
							<li 
								key={category._id} 
								className={category._id === selectedCategory ? "selected" : ""}
								onClick={():void => loadCategory(category._id)}
							>
								{category.name[lang]} ({category.total || 0})
							</li>
						);
					})}
				</ul>
				:
				<Preloader />
			}
			</div>
		</div>
	);
};




const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
	catalog: state.catalog.catalog,
	selectedCategory: state.catalog.category._id
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		catalog: bindActionCreators(allActions.catalog, dispatch),
	}
})
export default connect(mapStateToProps, mapDispatchToProps)(CatalogList);