import "./postfolio-list.scss";
import { IModal, IState, ProjectItemListItem, TLang, TTheme } from "src/interfaces";
import * as actions from "../../redux/actions";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";


interface IList {
    list: Array<ProjectItemListItem>
	selectedPortfolio: number
	lang: TLang
    setState: typeof actions
}


const PortfolioList: React.FC<IList> = ({list, selectedPortfolio, lang, setState}): JSX.Element => {

	const selectPortfolio = (index: number = 0) => {
		setState.setSelectedPortfolio(index);
	};

	return(
		<div className="portfolio-list__container">
			<div className="list">
				<ul>
					{list.map((portfolio: ProjectItemListItem, index: number): JSX.Element => {
						return (
							<li 
								key={index} 
								className={index === selectedPortfolio ? "selected" : ""}
								onClick={():void => selectPortfolio(index)}
							>
								{portfolio.name}
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
};


const mapStateToProps = (state: IState) => {
	return {
		lang: state.lang,
		list: state.components.portfolios.list,
		selectedPortfolio: state.components.portfolios.selectedPortfolio,
	};
};


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
	setState: bindActionCreators(actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioList);