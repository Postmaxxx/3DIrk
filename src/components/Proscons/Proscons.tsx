import './proscons.scss'


const Proscons = ({proscons}: {proscons: {pros: string[], cons: string[]}}) => {
    
    return (
        <div className="proscons">
            <ul className='pros'>
                {proscons.pros.map((pro,i) => <li key={i}>{pro}</li> )}
            </ul>
            <ul className='cons'>
                {proscons.cons.map((con,i) => <li key={i}>{con}</li> )}
            </ul>

        </div>
    )
}

export default Proscons