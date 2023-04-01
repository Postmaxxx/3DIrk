import { IPortfolioData, TLang } from "src/interfaces"


interface props {
    portfoliosList: Array<IPortfolioData>
    siteLang: TLang
    selected: string
    onSelect: ({id, index} : {id: string, index: number}) => void
}   

const ListImages = ({portfoliosList, siteLang, selected, onSelect} : props) => {
    return (
		<div className="portfolios__list">
			{portfoliosList.map((portfolio, i) => {
				return (
					<div 
						className={portfolio.id === selected ? 'porfolio__container selected' : 'porfolio__container'} 
						key={portfolio.id}
						onClick={() => onSelect({id: portfolio.id, index: i})}
						>
						<img src={portfolio.images[0].path} alt={portfolio.images[0].descr} />
					</div>
				)
			})}
		</div>
    )
}

export default ListImages