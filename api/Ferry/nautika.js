import axios from "axios";
import { ErrorHandler } from "../../errors/ErrorHandler";

const api = axios.create({
    baseURL: Bun.env.NAUTIKA_BASEURL,
    headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json',
    },
})

export const fatchAllFerryNTK = async(searchQuery) => {

    const ferrySearchParams = {
        date: searchQuery.date,
        from: searchQuery.dept,
        to: searchQuery.dest,
        userName: Bun.env.NAUTIKA_USER,
        token: Bun.env.NAUTIKA_TOKEN,
    }

    try {
        const {data} = await api.post("/getTripData", ferrySearchParams);
        return data
    } catch (error) {
        console.log({errorconfig: error.response.data})
        return
    }
}

