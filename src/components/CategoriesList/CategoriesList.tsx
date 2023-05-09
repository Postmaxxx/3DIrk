import "./categories-list.scss";
import { ICategoriesList, IDataLoading, IFullState, TId, TLang } from "src/interfaces";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { useEffect, useState } from "react";

import { setCategoriesList, setLoadDataStatusCategoriesList, setLoadDataStatusCategoriey, setSelectedCategory, setSelectedImage, setSelectedProduct, loadCategoriesList }  from "../../redux/actions/catalog"
import Preloader from "../Preloader/Preloader";

const actionsList = { setCategoriesList, setLoadDataStatusCategoriesList, setLoadDataStatusCategoriey, setSelectedCategory, setSelectedImage, setSelectedProduct, loadCategoriesList  }


interface IPropsState {
    list: ICategoriesList[]
	selectedCategory: TId
	lang: TLang
	loading: IDataLoading
}

interface IPropsActions {
    setState: {
        catalog: typeof actionsList
    }
}

interface IProps extends IPropsState, IPropsActions {}


const CatalogList: React.FC<IProps> = ({list, selectedCategory, loading, lang, setState}): JSX.Element => {

	const selectPortfolio = (id: TId) => {
		setState.catalog.setSelectedCategory(id)
	};

	useEffect(() => {
		if (loading.status !== 'success') {
			setState.catalog.loadCategoriesList()
		}
	}, [])

	return(
		<div className="categories-list__container">
			<div className="list">
				{loading.status === 'success' ? 
				<ul>
					{list.map((category: ICategoriesList, index: number): JSX.Element => {
						return (
							<li 
								key={category.id} 
								className={category.id === selectedCategory ? "selected" : ""}
								onClick={():void => selectPortfolio(category.id)}
							>
								{category.name[lang]}
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
	loading: state.catalog.categoriesListLoading,
	list: state.catalog.categoriesList,
	selectedCategory: state.catalog.selectedCategory
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		catalog: bindActionCreators(actionsList, dispatch)
	}
})
export default connect(mapStateToProps, mapDispatchToProps)(CatalogList);