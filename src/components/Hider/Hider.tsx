import './hider.scss'



interface IProps {
    hidden: boolean
    onClick: () => void
}

const Hider = ({hidden, onClick}: IProps) => {
    return (
        <div className={`hider ${hidden ? 'hide' : ''}`} onClick={onClick}>
            <svg viewBox='0 0 193.5 116'>
                <circle className='eye pupil' cx='96.8' cy='58' r='24'/>
                <path className='eye lid' d='M5,58L5,58C23.4,26.3,57.6,5,96.8,5c39.3,0,73.8,21.3,91.8,53l0,0c0,0-26.7,53-91.8,53S5,58,5,58z'/>
            </svg>
        </div>
    )
}


export default Hider