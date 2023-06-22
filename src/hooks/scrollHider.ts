import { useCallback, useState, useEffect } from 'react';


export const useScrollHider = () => {
    const [list, selList] = useState<{el: HTMLElement, threshold: number}[]>([])
   
    const onScroll = () => {   
        list.forEach(item => {
            if (document.body.scrollTop > item.threshold || document.documentElement.scrollTop > item.threshold) {
                item.el.classList.add('scrolled')
            } else {
                item.el.classList.remove('scrolled')
            }
        })
    }

    const add = (newEl: HTMLElement, threshold: number) => {
        selList(prev => [...prev, {el: newEl, threshold}])
    }

    const clear = () => {
        selList([])
    }


    useEffect(() => {       
        document.addEventListener('scroll', onScroll)
        return () => document.removeEventListener('scroll', onScroll)
    }, [list])

    
    return {add, clear}
}

