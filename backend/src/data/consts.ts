const minTimeBetweenSendings: number = 500 //in ms
const sendNotificationsInTG: boolean = false


const orderStatus: string[] = [
    'new',
    'working',
    'finished',
    'canceled',
]

export {minTimeBetweenSendings, sendNotificationsInTG, orderStatus}