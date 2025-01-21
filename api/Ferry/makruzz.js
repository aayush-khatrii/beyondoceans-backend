import axios from "axios";
import { ErrorHandler } from "../../errors/ErrorHandler";


const api = axios.create({
    baseURL: Bun.env.MAKRUZZ_BASEURL,
    headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json',
    },
})


export const fatchAllFerryMKZ = async(searchQuery) => {

    const ferrySearchParams = {
        apiEndpoint: "/schedule_search",
        authKey: Bun.env.MAKRUZZ_TOKEN,
        apiData:{
            "data": {
                "trip_type": "single_trip",
                "from_location": searchQuery.dept,
                "to_location": searchQuery.dest,
                "travel_date": searchQuery.date,
                "no_of_passenger": searchQuery.trav,
            }
        }
    }

    try {
        const {data} = await api.post('/api/ferry/proxy/makruzz-api', ferrySearchParams );
        return data
    } catch (error) {
        console.log(error.response.data)
        return error
    }
}

export const getProfileMKZ = async(searchQuery) => {

    const ferrySearchParams = {
        apiEndpoint: "/login",
        // authKey: Bun.env.MAKRUZZ_TOKEN,
        apiData:{
            "data": {
                "username": "beyondoceans@makruzz.com",
                "password": "9933200140",
            }
        }
    }

    try {
        const {data} = await api.post('/api/ferry/proxy/makruzz-api', ferrySearchParams );
        return data
    } catch (error) {
        console.log(error.response.data)
        return error
    }
}


export const MKZSelectschedule = async(selectSCH) => {

    const ferrySearchParams = {
        apiEndpoint: "/get_passenger_details",
        authKey: Bun.env.MAKRUZZ_TOKEN,
        apiData:{
            "data": {
                "schedule_id": selectSCH.scheduleID,
                "travel_date": selectSCH.date,
                "class_id": selectSCH.classID,
            }
        }
    }

    try {
        const {data} = await api.post('/api/ferry/proxy/makruzz-api', ferrySearchParams );
        return data
    } catch (error) {
        console.log({errorconfig: error})
        return error
    }
}

export const MKZSavePassenger = async(passangerParams) => {

    const ferrySearchParams = {
        apiEndpoint: "/savePassengers",
        authKey: Bun.env.MAKRUZZ_TOKEN,
        apiData:{
            data: passangerParams
        }
    }

    try {
        const {data} = await api.post('/api/ferry/proxy/makruzz-api', ferrySearchParams );
        console.log(data)
        return data
    } catch (error) {
        console.log({errorconfig: error})
        return error
    }
}
