import { useState, useEffect } from 'react';
import { debounce } from '../assets/js/processors';


export const useScrollHider = () => {
    const [list, setList] = useState<{el: HTMLElement, threshold: number}[]>([])
   
    const processList = (): void => {
        list.forEach(item => {
            const scrolled = document.body.scrollTop > item.threshold || document.documentElement.scrollTop > item.threshold
            item.el.classList.toggle('scrolled', scrolled)
        })
    }
    
    const processListDebounced: (...args: any[]) => void = debounce(processList, 100)

    const onScroll = () => {
        processListDebounced()
    }

    const add = (newEl: HTMLElement, threshold: number) => {
        setList(prev => [...prev, {el: newEl, threshold}])
    }

    const clear = () => {
        setList([])
    }

    const remove = (elToDelete: HTMLElement) => {
        setList(prev => {
            return [...prev.filter(item => item.el !== elToDelete)]
        })
    }


    useEffect(() => {       
        document.addEventListener('scroll', onScroll)
        return () => document.removeEventListener('scroll', onScroll)
    }, [list])

    
    return {add, remove, clear}
}

