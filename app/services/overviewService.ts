import { fetchApi } from "./api";

export const getStatsCardData = () =>{
    return fetchApi<{success : boolean, data : {
        productCount : number,
        userCount : number,
        orderCount : number,
        categoriesCount : number
    }}>('/overview/stats')
}