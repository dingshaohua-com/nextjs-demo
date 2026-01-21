import axios from 'axios'
import useSWR from "swr";

type GetWeatherParams = {
    city: string
}

export const getWeather = async (params: GetWeatherParams) => {
    const res = await axios.get('/api/weather', { params })
    return res.data.data;
}


export const useGetWeather = (params: GetWeatherParams) => {
    const key = {
        url: '/api/weather',
        params
    }
    return useSWR(key, () => getWeather(params))
}