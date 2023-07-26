import "./catalog-list.scss";
import { ICatalog, ICatalogItem, IFullState, TId, TLang } from "../../interfaces";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { useEffect } from "react";
import { allActions } from "../../redux/actions/all";
import Preloader from "../Preloaders/Preloader";
import { checkAndLoad } from "../../assets/js/processors"
import ErrorFetch from "../ErrorFetch/ErrorFetch";


interface IPropsState {
    catalog: ICatalog
	lang: TLang
	selectedCategory: TId
	isAdmin: boolean
}

interface IPropsActions {
    setState: {
        catalog: typeof allActions.catalog
    }
}
interface IProps extends IPropsState, IPropsActions {}




const CatalogList: React.FC<IProps> = ({catalog, lang, selectedCategory, isAdmin, setState}): JSX.Element => {

	const loadCategory = (_id: TId, total: number) => {
		setState.catalog.loadCategory({_id, from: 0, to: -1}) //load all products for category
	};


	useEffect(() => {
		if (catalog.load.status === 'success') {
			loadCategory(catalog.list[0]._id, catalog.list[0].total) //load first category
		}
	}, [catalog.load.status])
	
	
	useEffect(() => {
		checkAndLoad({
			fetchData: catalog.load,
			loadFunc: setState.catalog.loadCatalog,
			force: true
		})
	}, [isAdmin])


	return(
		<div className="catalog-list__container">
			<div className="list">
				{catalog.load.status === 'success' &&
					<ul>
						{catalog.list.map((category: ICatalogItem): JSX.Element => {
							return (
								<li 
									key={category._id} 
									className={category._id === selectedCategory ? "selected" : ""}
									onClick={():void => loadCategory(category._id, category.total)}
								>
									{category.name[lang]} ({category.total || 0})
								</li>
							);
						})}
					</ul>}
				{catalog.load.status === 'fetching' && <Preloader />}
				{catalog.load.status === 'error' && <ErrorFetch fetchData={catalog.load} lang={lang} />}
			</div>
		</div>
	);
};




const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
	catalog: state.catalog.catalog,
	selectedCategory: state.catalog.category._id,
	isAdmin: state.user.isAdmin,
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		catalog: bindActionCreators(allActions.catalog, dispatch),
	}
})
export default connect(mapStateToProps, mapDispatchToProps)(CatalogList);