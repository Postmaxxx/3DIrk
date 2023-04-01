import './portfoliosEdit.scss'
import { IFeature, IPortfolioData, IProtfolioState, IState, TLang, TPortfoliosStatus } from "src/interfaces";
import * as actions from "../../../redux/actions";
import { bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
/*import img1 from '../../../assets/img/portfolio/1.png'
import img2 from '../../../assets/img/portfolio/2.jpeg'
import img3 from '../../../assets/img/portfolio/3.jpeg'
import img4 from '../../../assets/img/portfolio/4.jpeg'
import img6 from '../../../assets/img/portfolio/5.png'
import img5 from '../../../assets/img/portfolio/6.png'*/
import ListFeatures from './ListFeatures/ListFeatures';
import EditFeatures from './EditFeatures/EditFeatures';
import ListImages from './ListImages/ListImages';


interface IProps {
    lang: TLang
	status: TPortfoliosStatus,
	portfoliosList: Array<IPortfolioData>
    setState: typeof actions
}

/*
const localState: Array<IPortfolioData> = [
	{
		id: '1',
		images: [
			{
				path: img1,
				descr: 'Model 42 1'
			},
			{
				path: img3,
				descr: 'Model 42 3'
			},
			{
				path: img6,
				descr: 'Model 42 6'
			},
		],
		descr: 'Model 42',
		colors: [{id: '0011', colorId: '001'}, {colorId: '002'}, {colorId: '003'}], //ids of colors
		features: {
			En: [
				{
					name: 'Name',
					value: 'Model 42'
				},
				{
					name: 'Fiber',
					value: 'ABS'
				},
			],
			Ru: [
				{
					name: 'Название',
					value: 'Модель 42'
				},
				{
					name: 'Материал',
					value: 'ABS пластик'
				},
			],
		}
	},
	{
		id: '2',
		images: [
			{
				path: img2,
				descr: 'Model 43 2'
			},
			{
				path: img3,
				descr: 'Model 43 3'
			},
			{
				path: img4,
				descr: 'Model 43 4'
			},
			{
				path: img5,
				descr: 'Model 43 5'
			},
			{
				path: img6,
				descr: 'Model 43 5'
			},
			{
				path: img1,
				descr: 'Model 43 1'
			},
		],
		descr: 'Model 43',
		colors: [{colorId: '003'}], //ids of colors
		features: {
			En: [
				{
					name: 'Name',
					value: 'Model 43'
				},
				{
					name: 'Volume',
					value: '120 cm'
				},
				{
					name: '111',
					value: '1111111111'
				},
				{
					name: '222',
					value: '222222222'
				},
			],
			Ru: [
				{
					name: 'Название',
					value: 'Модель 43'
				},
				{
					name: 'Объем',
					value: '120 см'
				},
				{
					name: '111',
					value: '1111111111'
				},
				{
					name: '222',
					value: '222222222'
				},
			],
		}
	},
	{
		id: '3',
		images: [
			{
				path: img3,
				descr: 'Model 44 3'
			},
			{
				path: img4,
				descr: 'Model 44 3'
			},
			{
				path: img5,
				descr: 'Model 44 3'
			},
		],
		descr: 'Model 44',
		colors: [{colorId: '002'}, {colorId: '003'}, {colorId: '001'}], //ids of colors
		features: {
			En: [
				{
					name: 'Name',
					value: 'Model 44'
				},
				{
					name: 'Volume',
					value: '124 cm'
				},
			],
			Ru: [
				{
					name: 'Название',
					value: 'Модель 44'
				},
				{
					name: 'Объем',
					value: '124 см'
				},
			],
		}
	},

]
*/


const PortfoliosEdit:React.FC<IProps> = (props) => {

	const [selectedPortfolio, setSelectedPortfolio] = useState<IProtfolioState>({} as IProtfolioState)

	const onSelect = ({id, index}: {id: string, index: number}) => {
		if (!selectedPortfolio.status) {
			setSelectedPortfolio(prev => {
				const newSelectedPortfolio = {...prev}
				newSelectedPortfolio.id = id
				newSelectedPortfolio.index = index
				newSelectedPortfolio.portfolioData = props.portfoliosList[index]
				return newSelectedPortfolio
			})
		}
	}

	const removeFeature = ({index, lang} : {index: number, lang: TLang}) => {
		//save to localState and selectedPortfolio
		setSelectedPortfolio(prev => {
			const newSelectedPortfolio = {...prev}
			newSelectedPortfolio.portfolioData.changed = true
			newSelectedPortfolio.portfolioData.features[lang].splice(index, 1)
			return newSelectedPortfolio
		})
	}

	const editFeature = ({index, lang}: {index: number, lang: TLang}) => {
		setSelectedPortfolio(prev => {
			const newSelectedPortfolio = {...prev}
			newSelectedPortfolio.status = 'editing'
			newSelectedPortfolio.editingLang = lang
			newSelectedPortfolio.editingFeatureIndex = index
			return newSelectedPortfolio
		})
	}

	
	const saveFeature =({name, value}: IFeature) => {
		//save to localState
		const  {editingLang, editingFeatureIndex } = selectedPortfolio
		setSelectedPortfolio(prev => {
			const newSelectedPortfolio = {...prev}
			newSelectedPortfolio.status = ''
			newSelectedPortfolio.portfolioData.changed = true
			newSelectedPortfolio.portfolioData.features[editingLang][editingFeatureIndex] = {name, value}
			return newSelectedPortfolio
		})
	}
	

	const cancelEdit =() => {
		setSelectedPortfolio(prev => ({...prev, status: ''}))
	}


	const addFeature = ({addLang}: {addLang: TLang}) => {
		setSelectedPortfolio(prev => {
			const newSelectedPortfolio = {...prev}
			newSelectedPortfolio.status = 'adding'
			newSelectedPortfolio.editingFeatureIndex = prev.portfolioData.features[addLang].length
			newSelectedPortfolio.editingLang = addLang
			newSelectedPortfolio.portfolioData.features[addLang].push({name: '', value: ''})
			return newSelectedPortfolio
		});
	}
	
	const loadDB = () => {
		props.setState.getPortfolios()
	}

	const saveDB = () => {
		console.log(props.portfoliosList);
		//props.setState.savePortfolios()
	}


	useEffect(() => {
		//props.setState.createPortfolios(localState);
	}, [])


    return (
		<div className="container">
			<div className="dbm">
				<h2>{props.lang === 'En' ? 'Portfolio editing' : 'Редактирование портфолио'}</h2>
				<ListImages 
					portfoliosList={props.portfoliosList} 
					siteLang={props.lang}
					selected={selectedPortfolio.id}
					onSelect={({id, index}) => onSelect({id, index})} 
				/>
				{selectedPortfolio.id ? <ListFeatures 
					portfolio={selectedPortfolio} 
					siteLang={props.lang} 
					remove={({index, lang}) => removeFeature({index, lang})} 
					edit={({index, lang}) => editFeature({index, lang})}
					add={({addLang}) => addFeature({addLang})}
				/> : <></>}
				{selectedPortfolio.status ? <EditFeatures 
					portfolio={selectedPortfolio} 
					siteLang={props.lang}
					save={({name, value}: IFeature) => saveFeature({name: name, value: value})}
					cancel={() => cancelEdit()}
				/> : <></>}
				<button onClick={loadDB}>Load</button>
				<button onClick={saveDB}>Save</button>
			</div>
		</div>
    )
}




const mapStateToProps = (state: IState) => ({
    lang: state.lang,
	status: state.portfolios.status,
	portfoliosList: state.portfolios.list
  })
  
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    setState: bindActionCreators(actions, dispatch)
})
    
export default connect(mapStateToProps, mapDispatchToProps)(PortfoliosEdit)
