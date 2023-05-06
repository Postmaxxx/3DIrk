import './info-portfolio.scss'

interface IProps {
    text: string
}

const InfoPortfolio: React.FC<IProps> = ({text}) => {
    return (
        <div className="info_portfolio">
            <p>{text}</p>
        </div>
    )
}

export default InfoPortfolio