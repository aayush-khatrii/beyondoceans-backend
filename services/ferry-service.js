import { fatchAllFerryNTK } from '../api/Ferry/nautika'
import { fatchAllFerryMKZ, MKZSavePassenger } from '../api/Ferry/makruzz'
import makFerryService from './makFerry-service.js';
import { getProfileMKZ } from '../api/Ferry/makruzz'
import { Operator } from '@aws-sdk/client-pinpoint';
import { ErrorHandler } from '../errors/ErrorHandler';
import { searchNumbers } from 'libphonenumber-js';

class ferryService{

    async fatchallferry(searchQuery){

        const islandCode = {
            1: "Port Blair",
            2: "Swaraj Dweep",
            3: "Shaheed Dweep",
        }

        const [year, month, day] = searchQuery.date.split('-');
        const validDate = `${day}-${month}-${year}`;

        const NTKModSearchQuery = {
            ...searchQuery,
            date: validDate,
            dest: islandCode[searchQuery.dest],
            dept: islandCode[searchQuery.dept]
        }

        const NTKFerryList = await fatchAllFerryNTK(NTKModSearchQuery)

        const MKZFerryList = await fatchAllFerryMKZ(searchQuery)
        
        const NTKFerryListMarged = NTKFerryList.data.length > 0 ? NTKFerryList.data.map(item => ({ ...item, ferryOPR: "NTK", ship_title: "Nautika", operator: "Sea Link India", dest_code: searchQuery.dest, dept_code: searchQuery.dept  })) : [];
        

        let MakFerryListMarged = []
        
        if(MKZFerryList.data){
            MakFerryListMarged = await makFerryService.makFerryMergeList(MKZFerryList.data)
        }


        const mergedFerryList = [...NTKFerryListMarged, ...MakFerryListMarged];

        // const mergedFerryList = [
        //         {
        //             "id": "667b33522d721d9ec56a701d",
        //             "tripId": 1721613600,
        //             "from": "Port Blair",
        //             "to": "Swaraj Dweep",
        //             "dTime": {
        //                 "hour": 7,
        //                 "minute": 30
        //             },
        //             "aTime": {
        //                 "hour": 8,
        //                 "minute": 45
        //             },
        //             "vesselID": 2,
        //             "fares": {
        //                 "pBaseFare": 1700,
        //                 "bBaseFare": 1900,
        //                 "pBaseFarePBHLNL": 2500,
        //                 "bBaseFarePBHLNL": 2700,
        //                 "pIslanderFarePBHLNL": 800,
        //                 "bIslanderFarePBHLNL": 1000,
        //                 "infantFare": 105
        //             },
        //             "bClass": {
        //                 "1A": {
        //                     "tier": "B",
        //                     "number": "1A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "1B": {
        //                     "tier": "B",
        //                     "number": "1B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "1I": {
        //                     "tier": "B",
        //                     "number": "1I",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "1J": {
        //                     "tier": "B",
        //                     "number": "1J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "1K": {
        //                     "tier": "B",
        //                     "number": "1K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "2A": {
        //                     "tier": "B",
        //                     "number": "2A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "2B": {
        //                     "tier": "B",
        //                     "number": "2B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "2I": {
        //                     "tier": "B",
        //                     "number": "2I",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "2J": {
        //                     "tier": "B",
        //                     "number": "2J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "2K": {
        //                     "tier": "B",
        //                     "number": "2K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "3A": {
        //                     "tier": "B",
        //                     "number": "3A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "3B": {
        //                     "tier": "B",
        //                     "number": "3B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "3J": {
        //                     "tier": "B",
        //                     "number": "3J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "3K": {
        //                     "tier": "B",
        //                     "number": "3K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "4A": {
        //                     "tier": "B",
        //                     "number": "4A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "4B": {
        //                     "tier": "B",
        //                     "number": "4B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "4J": {
        //                     "tier": "B",
        //                     "number": "4J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "4K": {
        //                     "tier": "B",
        //                     "number": "4K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5A": {
        //                     "tier": "B",
        //                     "number": "5A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5B": {
        //                     "tier": "B",
        //                     "number": "5B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5C": {
        //                     "tier": "B",
        //                     "number": "5C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5D": {
        //                     "tier": "B",
        //                     "number": "5D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5E": {
        //                     "tier": "B",
        //                     "number": "5E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5F": {
        //                     "tier": "B",
        //                     "number": "5F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5G": {
        //                     "tier": "B",
        //                     "number": "5G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5H": {
        //                     "tier": "B",
        //                     "number": "5H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5J": {
        //                     "tier": "B",
        //                     "number": "5J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5K": {
        //                     "tier": "B",
        //                     "number": "5K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6A": {
        //                     "tier": "B",
        //                     "number": "6A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6B": {
        //                     "tier": "B",
        //                     "number": "6B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6C": {
        //                     "tier": "B",
        //                     "number": "6C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6D": {
        //                     "tier": "B",
        //                     "number": "6D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6E": {
        //                     "tier": "B",
        //                     "number": "6E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6F": {
        //                     "tier": "B",
        //                     "number": "6F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6G": {
        //                     "tier": "B",
        //                     "number": "6G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6H": {
        //                     "tier": "B",
        //                     "number": "6H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6J": {
        //                     "tier": "B",
        //                     "number": "6J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6K": {
        //                     "tier": "B",
        //                     "number": "6K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "7A": {
        //                     "tier": "B",
        //                     "number": "7A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "7B": {
        //                     "tier": "B",
        //                     "number": "7B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "7C": {
        //                     "tier": "B",
        //                     "number": "7C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "7D": {
        //                     "tier": "B",
        //                     "number": "7D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "7E": {
        //                     "tier": "B",
        //                     "number": "7E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "7F": {
        //                     "tier": "B",
        //                     "number": "7F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "7G": {
        //                     "tier": "B",
        //                     "number": "7G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "7H": {
        //                     "tier": "B",
        //                     "number": "7H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "7J": {
        //                     "tier": "B",
        //                     "number": "7J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "7K": {
        //                     "tier": "B",
        //                     "number": "7K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "8A": {
        //                     "tier": "B",
        //                     "number": "8A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "8B": {
        //                     "tier": "B",
        //                     "number": "8B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "8C": {
        //                     "tier": "B",
        //                     "number": "8C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "8D": {
        //                     "tier": "B",
        //                     "number": "8D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "8E": {
        //                     "tier": "B",
        //                     "number": "8E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "8F": {
        //                     "tier": "B",
        //                     "number": "8F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "8G": {
        //                     "tier": "B",
        //                     "number": "8G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "8H": {
        //                     "tier": "B",
        //                     "number": "8H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "8J": {
        //                     "tier": "B",
        //                     "number": "8J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "8K": {
        //                     "tier": "B",
        //                     "number": "8K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9A": {
        //                     "tier": "B",
        //                     "number": "9A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9B": {
        //                     "tier": "B",
        //                     "number": "9B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9C": {
        //                     "tier": "B",
        //                     "number": "9C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9D": {
        //                     "tier": "B",
        //                     "number": "9D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9E": {
        //                     "tier": "B",
        //                     "number": "9E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9F": {
        //                     "tier": "B",
        //                     "number": "9F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9G": {
        //                     "tier": "B",
        //                     "number": "9G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9H": {
        //                     "tier": "B",
        //                     "number": "9H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9J": {
        //                     "tier": "B",
        //                     "number": "9J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9K": {
        //                     "tier": "B",
        //                     "number": "9K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10A": {
        //                     "tier": "B",
        //                     "number": "10A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10B": {
        //                     "tier": "B",
        //                     "number": "10B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10C": {
        //                     "tier": "B",
        //                     "number": "10C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10D": {
        //                     "tier": "B",
        //                     "number": "10D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10E": {
        //                     "tier": "B",
        //                     "number": "10E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10F": {
        //                     "tier": "B",
        //                     "number": "10F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10G": {
        //                     "tier": "B",
        //                     "number": "10G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10H": {
        //                     "tier": "B",
        //                     "number": "10H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10J": {
        //                     "tier": "B",
        //                     "number": "10J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10K": {
        //                     "tier": "B",
        //                     "number": "10K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "11A": {
        //                     "tier": "B",
        //                     "number": "11A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "11B": {
        //                     "tier": "B",
        //                     "number": "11B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "11C": {
        //                     "tier": "B",
        //                     "number": "11C",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "11D": {
        //                     "tier": "B",
        //                     "number": "11D",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "11E": {
        //                     "tier": "B",
        //                     "number": "11E",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "11F": {
        //                     "tier": "B",
        //                     "number": "11F",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "11G": {
        //                     "tier": "B",
        //                     "number": "11G",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "11H": {
        //                     "tier": "B",
        //                     "number": "11H",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "11J": {
        //                     "tier": "B",
        //                     "number": "11J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "11K": {
        //                     "tier": "B",
        //                     "number": "11K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "12A": {
        //                     "tier": "B",
        //                     "number": "12A",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "12B": {
        //                     "tier": "B",
        //                     "number": "12B",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "12J": {
        //                     "tier": "B",
        //                     "number": "12J",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "12K": {
        //                     "tier": "B",
        //                     "number": "12K",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 }
        //             },
        //             "pClass": {
        //                 "1E": {
        //                     "tier": "P",
        //                     "number": "1E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "1F": {
        //                     "tier": "P",
        //                     "number": "1F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "1G": {
        //                     "tier": "P",
        //                     "number": "1G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "1H": {
        //                     "tier": "P",
        //                     "number": "1H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "1I": {
        //                     "tier": "P",
        //                     "number": "1I",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "2A": {
        //                     "tier": "P",
        //                     "number": "2A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "2B": {
        //                     "tier": "P",
        //                     "number": "2B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "2C": {
        //                     "tier": "P",
        //                     "number": "2C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "2D": {
        //                     "tier": "P",
        //                     "number": "2D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "2E": {
        //                     "tier": "P",
        //                     "number": "2E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "2F": {
        //                     "tier": "P",
        //                     "number": "2F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "2G": {
        //                     "tier": "P",
        //                     "number": "2G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "2H": {
        //                     "tier": "P",
        //                     "number": "2H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "2I": {
        //                     "tier": "P",
        //                     "number": "2I",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "2J": {
        //                     "tier": "P",
        //                     "number": "2J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "2K": {
        //                     "tier": "P",
        //                     "number": "2K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "2L": {
        //                     "tier": "P",
        //                     "number": "2L",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "3A": {
        //                     "tier": "P",
        //                     "number": "3A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "3B": {
        //                     "tier": "P",
        //                     "number": "3B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "3C": {
        //                     "tier": "P",
        //                     "number": "3C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "3D": {
        //                     "tier": "P",
        //                     "number": "3D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "3E": {
        //                     "tier": "P",
        //                     "number": "3E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "3F": {
        //                     "tier": "P",
        //                     "number": "3F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "3G": {
        //                     "tier": "P",
        //                     "number": "3G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "3H": {
        //                     "tier": "P",
        //                     "number": "3H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "3I": {
        //                     "tier": "P",
        //                     "number": "3I",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "3J": {
        //                     "tier": "P",
        //                     "number": "3J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "3K": {
        //                     "tier": "P",
        //                     "number": "3K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "3L": {
        //                     "tier": "P",
        //                     "number": "3L",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "4A": {
        //                     "tier": "P",
        //                     "number": "4A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "4B": {
        //                     "tier": "P",
        //                     "number": "4B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "4C": {
        //                     "tier": "P",
        //                     "number": "4C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "4D": {
        //                     "tier": "P",
        //                     "number": "4D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "4E": {
        //                     "tier": "P",
        //                     "number": "4E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "4F": {
        //                     "tier": "P",
        //                     "number": "4F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "4G": {
        //                     "tier": "P",
        //                     "number": "4G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "4H": {
        //                     "tier": "P",
        //                     "number": "4H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "4I": {
        //                     "tier": "P",
        //                     "number": "4I",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "4J": {
        //                     "tier": "P",
        //                     "number": "4J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "4K": {
        //                     "tier": "P",
        //                     "number": "4K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "4L": {
        //                     "tier": "P",
        //                     "number": "4L",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5A": {
        //                     "tier": "P",
        //                     "number": "5A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5B": {
        //                     "tier": "P",
        //                     "number": "5B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5C": {
        //                     "tier": "P",
        //                     "number": "5C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5D": {
        //                     "tier": "P",
        //                     "number": "5D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5E": {
        //                     "tier": "P",
        //                     "number": "5E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5F": {
        //                     "tier": "P",
        //                     "number": "5F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5G": {
        //                     "tier": "P",
        //                     "number": "5G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5H": {
        //                     "tier": "P",
        //                     "number": "5H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5I": {
        //                     "tier": "P",
        //                     "number": "5I",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5J": {
        //                     "tier": "P",
        //                     "number": "5J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5K": {
        //                     "tier": "P",
        //                     "number": "5K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5L": {
        //                     "tier": "P",
        //                     "number": "5L",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6A": {
        //                     "tier": "P",
        //                     "number": "6A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6B": {
        //                     "tier": "P",
        //                     "number": "6B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6C": {
        //                     "tier": "P",
        //                     "number": "6C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6D": {
        //                     "tier": "P",
        //                     "number": "6D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6E": {
        //                     "tier": "P",
        //                     "number": "6E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6F": {
        //                     "tier": "P",
        //                     "number": "6F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6G": {
        //                     "tier": "P",
        //                     "number": "6G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6H": {
        //                     "tier": "P",
        //                     "number": "6H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6I": {
        //                     "tier": "P",
        //                     "number": "6I",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6J": {
        //                     "tier": "P",
        //                     "number": "6J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6K": {
        //                     "tier": "P",
        //                     "number": "6K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6L": {
        //                     "tier": "P",
        //                     "number": "6L",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "7A": {
        //                     "tier": "P",
        //                     "number": "7A",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "7B": {
        //                     "tier": "P",
        //                     "number": "7B",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "7C": {
        //                     "tier": "P",
        //                     "number": "7C",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "7D": {
        //                     "tier": "P",
        //                     "number": "7D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "7E": {
        //                     "tier": "P",
        //                     "number": "7E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "7F": {
        //                     "tier": "P",
        //                     "number": "7F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "7G": {
        //                     "tier": "P",
        //                     "number": "7G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "7H": {
        //                     "tier": "P",
        //                     "number": "7H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "7I": {
        //                     "tier": "P",
        //                     "number": "7I",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "7J": {
        //                     "tier": "P",
        //                     "number": "7J",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "7K": {
        //                     "tier": "P",
        //                     "number": "7K",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "7L": {
        //                     "tier": "P",
        //                     "number": "7L",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "8A": {
        //                     "tier": "P",
        //                     "number": "8A",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "8B": {
        //                     "tier": "P",
        //                     "number": "8B",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "8C": {
        //                     "tier": "P",
        //                     "number": "8C",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "8D": {
        //                     "tier": "P",
        //                     "number": "8D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "8E": {
        //                     "tier": "P",
        //                     "number": "8E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "8F": {
        //                     "tier": "P",
        //                     "number": "8F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "8G": {
        //                     "tier": "P",
        //                     "number": "8G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "8H": {
        //                     "tier": "P",
        //                     "number": "8H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "8I": {
        //                     "tier": "P",
        //                     "number": "8I",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "8J": {
        //                     "tier": "P",
        //                     "number": "8J",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "8K": {
        //                     "tier": "P",
        //                     "number": "8K",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "8L": {
        //                     "tier": "P",
        //                     "number": "8L",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "9A": {
        //                     "tier": "P",
        //                     "number": "9A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9B": {
        //                     "tier": "P",
        //                     "number": "9B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9C": {
        //                     "tier": "P",
        //                     "number": "9C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9D": {
        //                     "tier": "P",
        //                     "number": "9D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9E": {
        //                     "tier": "P",
        //                     "number": "9E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9F": {
        //                     "tier": "P",
        //                     "number": "9F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9G": {
        //                     "tier": "P",
        //                     "number": "9G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9H": {
        //                     "tier": "P",
        //                     "number": "9H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9I": {
        //                     "tier": "P",
        //                     "number": "9I",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9J": {
        //                     "tier": "P",
        //                     "number": "9J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9K": {
        //                     "tier": "P",
        //                     "number": "9K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9L": {
        //                     "tier": "P",
        //                     "number": "9L",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10A": {
        //                     "tier": "P",
        //                     "number": "10A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10B": {
        //                     "tier": "P",
        //                     "number": "10B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10C": {
        //                     "tier": "P",
        //                     "number": "10C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10D": {
        //                     "tier": "P",
        //                     "number": "10D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10E": {
        //                     "tier": "P",
        //                     "number": "10E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10F": {
        //                     "tier": "P",
        //                     "number": "10F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10G": {
        //                     "tier": "P",
        //                     "number": "10G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10H": {
        //                     "tier": "P",
        //                     "number": "10H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10I": {
        //                     "tier": "P",
        //                     "number": "10I",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10J": {
        //                     "tier": "P",
        //                     "number": "10J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10K": {
        //                     "tier": "P",
        //                     "number": "10K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10L": {
        //                     "tier": "P",
        //                     "number": "10L",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "11A": {
        //                     "tier": "P",
        //                     "number": "11A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "11B": {
        //                     "tier": "P",
        //                     "number": "11B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "11C": {
        //                     "tier": "P",
        //                     "number": "11C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "11D": {
        //                     "tier": "P",
        //                     "number": "11D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "11E": {
        //                     "tier": "P",
        //                     "number": "11E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "11F": {
        //                     "tier": "P",
        //                     "number": "11F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "11G": {
        //                     "tier": "P",
        //                     "number": "11G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "11H": {
        //                     "tier": "P",
        //                     "number": "11H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "11I": {
        //                     "tier": "P",
        //                     "number": "11I",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "11J": {
        //                     "tier": "P",
        //                     "number": "11J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "11K": {
        //                     "tier": "P",
        //                     "number": "11K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "11L": {
        //                     "tier": "P",
        //                     "number": "11L",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "12A": {
        //                     "tier": "P",
        //                     "number": "12A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "12B": {
        //                     "tier": "P",
        //                     "number": "12B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "12C": {
        //                     "tier": "P",
        //                     "number": "12C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "12D": {
        //                     "tier": "P",
        //                     "number": "12D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "12E": {
        //                     "tier": "P",
        //                     "number": "12E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "12F": {
        //                     "tier": "P",
        //                     "number": "12F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "12G": {
        //                     "tier": "P",
        //                     "number": "12G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "12H": {
        //                     "tier": "P",
        //                     "number": "12H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "12I": {
        //                     "tier": "P",
        //                     "number": "12I",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "12J": {
        //                     "tier": "P",
        //                     "number": "12J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "12K": {
        //                     "tier": "P",
        //                     "number": "12K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "12L": {
        //                     "tier": "P",
        //                     "number": "12L",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "13A": {
        //                     "tier": "P",
        //                     "number": "13A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "13B": {
        //                     "tier": "P",
        //                     "number": "13B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "13C": {
        //                     "tier": "P",
        //                     "number": "13C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "13D": {
        //                     "tier": "P",
        //                     "number": "13D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "13E": {
        //                     "tier": "P",
        //                     "number": "13E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "13F": {
        //                     "tier": "P",
        //                     "number": "13F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "13G": {
        //                     "tier": "P",
        //                     "number": "13G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "13H": {
        //                     "tier": "P",
        //                     "number": "13H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "13I": {
        //                     "tier": "P",
        //                     "number": "13I",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "13J": {
        //                     "tier": "P",
        //                     "number": "13J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "13K": {
        //                     "tier": "P",
        //                     "number": "13K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "13L": {
        //                     "tier": "P",
        //                     "number": "13L",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "14A": {
        //                     "tier": "P",
        //                     "number": "14A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "14B": {
        //                     "tier": "P",
        //                     "number": "14B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "14C": {
        //                     "tier": "P",
        //                     "number": "14C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "14D": {
        //                     "tier": "P",
        //                     "number": "14D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "14E": {
        //                     "tier": "P",
        //                     "number": "14E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "14F": {
        //                     "tier": "P",
        //                     "number": "14F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "14G": {
        //                     "tier": "P",
        //                     "number": "14G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "14H": {
        //                     "tier": "P",
        //                     "number": "14H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "14I": {
        //                     "tier": "P",
        //                     "number": "14I",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "14J": {
        //                     "tier": "P",
        //                     "number": "14J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "14K": {
        //                     "tier": "P",
        //                     "number": "14K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "14L": {
        //                     "tier": "P",
        //                     "number": "14L",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "15A": {
        //                     "tier": "P",
        //                     "number": "15A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "15B": {
        //                     "tier": "P",
        //                     "number": "15B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "15C": {
        //                     "tier": "P",
        //                     "number": "15C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "15D": {
        //                     "tier": "P",
        //                     "number": "15D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "15E": {
        //                     "tier": "P",
        //                     "number": "15E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "15F": {
        //                     "tier": "P",
        //                     "number": "15F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "15G": {
        //                     "tier": "P",
        //                     "number": "15G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "15H": {
        //                     "tier": "P",
        //                     "number": "15H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "15I": {
        //                     "tier": "P",
        //                     "number": "15I",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "15J": {
        //                     "tier": "P",
        //                     "number": "15J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "15K": {
        //                     "tier": "P",
        //                     "number": "15K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "15L": {
        //                     "tier": "P",
        //                     "number": "15L",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "16A": {
        //                     "tier": "P",
        //                     "number": "16A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "16B": {
        //                     "tier": "P",
        //                     "number": "16B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "16C": {
        //                     "tier": "P",
        //                     "number": "16C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "16D": {
        //                     "tier": "P",
        //                     "number": "16D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "16E": {
        //                     "tier": "P",
        //                     "number": "16E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "16F": {
        //                     "tier": "P",
        //                     "number": "16F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "16G": {
        //                     "tier": "P",
        //                     "number": "16G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "16H": {
        //                     "tier": "P",
        //                     "number": "16H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "16I": {
        //                     "tier": "P",
        //                     "number": "16I",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "16J": {
        //                     "tier": "P",
        //                     "number": "16J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "16K": {
        //                     "tier": "P",
        //                     "number": "16K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "16L": {
        //                     "tier": "P",
        //                     "number": "16L",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "17A": {
        //                     "tier": "P",
        //                     "number": "17A",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "17B": {
        //                     "tier": "P",
        //                     "number": "17B",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "17C": {
        //                     "tier": "P",
        //                     "number": "17C",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "17E": {
        //                     "tier": "P",
        //                     "number": "17E",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "17F": {
        //                     "tier": "P",
        //                     "number": "17F",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "17G": {
        //                     "tier": "P",
        //                     "number": "17G",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "17H": {
        //                     "tier": "P",
        //                     "number": "17H",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "17I": {
        //                     "tier": "P",
        //                     "number": "17I",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "17J": {
        //                     "tier": "P",
        //                     "number": "17J",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "17K": {
        //                     "tier": "P",
        //                     "number": "17K",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "17L": {
        //                     "tier": "P",
        //                     "number": "17L",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 }
        //             },
        //             "ferryOPR": "NTK",
        //             "ship_title": "Nautika",
        //             "operator": "Sea Link India"
        //         },
        //         {
        //             "id": "667b33532d721d9ec56a7020",
        //             "tripId": 1721632500,
        //             "from": "Port Blair",
        //             "to": "Swaraj Dweep",
        //             "dTime": {
        //                 "hour": 12,
        //                 "minute": 45
        //             },
        //             "aTime": {
        //                 "hour": 14,
        //                 "minute": 0
        //             },
        //             "vesselID": 2,
        //             "fares": {
        //                 "pBaseFare": 1700,
        //                 "bBaseFare": 1900,
        //                 "pBaseFarePBHLNL": 2500,
        //                 "bBaseFarePBHLNL": 2700,
        //                 "pIslanderFarePBHLNL": 800,
        //                 "bIslanderFarePBHLNL": 1000,
        //                 "infantFare": 105
        //             },
        //             "bClass": {
        //                 "1A": {
        //                     "tier": "B",
        //                     "number": "1A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "1B": {
        //                     "tier": "B",
        //                     "number": "1B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "1I": {
        //                     "tier": "B",
        //                     "number": "1I",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "1J": {
        //                     "tier": "B",
        //                     "number": "1J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "1K": {
        //                     "tier": "B",
        //                     "number": "1K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "2A": {
        //                     "tier": "B",
        //                     "number": "2A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "2B": {
        //                     "tier": "B",
        //                     "number": "2B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "2I": {
        //                     "tier": "B",
        //                     "number": "2I",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "2J": {
        //                     "tier": "B",
        //                     "number": "2J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "2K": {
        //                     "tier": "B",
        //                     "number": "2K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "3A": {
        //                     "tier": "B",
        //                     "number": "3A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "3B": {
        //                     "tier": "B",
        //                     "number": "3B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "3J": {
        //                     "tier": "B",
        //                     "number": "3J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "3K": {
        //                     "tier": "B",
        //                     "number": "3K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "4A": {
        //                     "tier": "B",
        //                     "number": "4A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "4B": {
        //                     "tier": "B",
        //                     "number": "4B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "4J": {
        //                     "tier": "B",
        //                     "number": "4J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "4K": {
        //                     "tier": "B",
        //                     "number": "4K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5A": {
        //                     "tier": "B",
        //                     "number": "5A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5B": {
        //                     "tier": "B",
        //                     "number": "5B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5C": {
        //                     "tier": "B",
        //                     "number": "5C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5D": {
        //                     "tier": "B",
        //                     "number": "5D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5E": {
        //                     "tier": "B",
        //                     "number": "5E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5F": {
        //                     "tier": "B",
        //                     "number": "5F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5G": {
        //                     "tier": "B",
        //                     "number": "5G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5H": {
        //                     "tier": "B",
        //                     "number": "5H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5J": {
        //                     "tier": "B",
        //                     "number": "5J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5K": {
        //                     "tier": "B",
        //                     "number": "5K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6A": {
        //                     "tier": "B",
        //                     "number": "6A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6B": {
        //                     "tier": "B",
        //                     "number": "6B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6C": {
        //                     "tier": "B",
        //                     "number": "6C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6D": {
        //                     "tier": "B",
        //                     "number": "6D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6E": {
        //                     "tier": "B",
        //                     "number": "6E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6F": {
        //                     "tier": "B",
        //                     "number": "6F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6G": {
        //                     "tier": "B",
        //                     "number": "6G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6H": {
        //                     "tier": "B",
        //                     "number": "6H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6J": {
        //                     "tier": "B",
        //                     "number": "6J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6K": {
        //                     "tier": "B",
        //                     "number": "6K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "7A": {
        //                     "tier": "B",
        //                     "number": "7A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "7B": {
        //                     "tier": "B",
        //                     "number": "7B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "7C": {
        //                     "tier": "B",
        //                     "number": "7C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "7D": {
        //                     "tier": "B",
        //                     "number": "7D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "7E": {
        //                     "tier": "B",
        //                     "number": "7E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "7F": {
        //                     "tier": "B",
        //                     "number": "7F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "7G": {
        //                     "tier": "B",
        //                     "number": "7G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "7H": {
        //                     "tier": "B",
        //                     "number": "7H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "7J": {
        //                     "tier": "B",
        //                     "number": "7J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "7K": {
        //                     "tier": "B",
        //                     "number": "7K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "8A": {
        //                     "tier": "B",
        //                     "number": "8A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "8B": {
        //                     "tier": "B",
        //                     "number": "8B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "8C": {
        //                     "tier": "B",
        //                     "number": "8C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "8D": {
        //                     "tier": "B",
        //                     "number": "8D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "8E": {
        //                     "tier": "B",
        //                     "number": "8E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "8F": {
        //                     "tier": "B",
        //                     "number": "8F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "8G": {
        //                     "tier": "B",
        //                     "number": "8G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "8H": {
        //                     "tier": "B",
        //                     "number": "8H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "8J": {
        //                     "tier": "B",
        //                     "number": "8J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "8K": {
        //                     "tier": "B",
        //                     "number": "8K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9A": {
        //                     "tier": "B",
        //                     "number": "9A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9B": {
        //                     "tier": "B",
        //                     "number": "9B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9C": {
        //                     "tier": "B",
        //                     "number": "9C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9D": {
        //                     "tier": "B",
        //                     "number": "9D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9E": {
        //                     "tier": "B",
        //                     "number": "9E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9F": {
        //                     "tier": "B",
        //                     "number": "9F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9G": {
        //                     "tier": "B",
        //                     "number": "9G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9H": {
        //                     "tier": "B",
        //                     "number": "9H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9J": {
        //                     "tier": "B",
        //                     "number": "9J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9K": {
        //                     "tier": "B",
        //                     "number": "9K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10A": {
        //                     "tier": "B",
        //                     "number": "10A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10B": {
        //                     "tier": "B",
        //                     "number": "10B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10C": {
        //                     "tier": "B",
        //                     "number": "10C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10D": {
        //                     "tier": "B",
        //                     "number": "10D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10E": {
        //                     "tier": "B",
        //                     "number": "10E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10F": {
        //                     "tier": "B",
        //                     "number": "10F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10G": {
        //                     "tier": "B",
        //                     "number": "10G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10H": {
        //                     "tier": "B",
        //                     "number": "10H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10J": {
        //                     "tier": "B",
        //                     "number": "10J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10K": {
        //                     "tier": "B",
        //                     "number": "10K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "11A": {
        //                     "tier": "B",
        //                     "number": "11A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "11B": {
        //                     "tier": "B",
        //                     "number": "11B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "11C": {
        //                     "tier": "B",
        //                     "number": "11C",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "11D": {
        //                     "tier": "B",
        //                     "number": "11D",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "11E": {
        //                     "tier": "B",
        //                     "number": "11E",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "11F": {
        //                     "tier": "B",
        //                     "number": "11F",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "11G": {
        //                     "tier": "B",
        //                     "number": "11G",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "11H": {
        //                     "tier": "B",
        //                     "number": "11H",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "11J": {
        //                     "tier": "B",
        //                     "number": "11J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "11K": {
        //                     "tier": "B",
        //                     "number": "11K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "12A": {
        //                     "tier": "B",
        //                     "number": "12A",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "12B": {
        //                     "tier": "B",
        //                     "number": "12B",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "12J": {
        //                     "tier": "B",
        //                     "number": "12J",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "12K": {
        //                     "tier": "B",
        //                     "number": "12K",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 }
        //             },
        //             "pClass": {
        //                 "1E": {
        //                     "tier": "P",
        //                     "number": "1E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "1F": {
        //                     "tier": "P",
        //                     "number": "1F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "1G": {
        //                     "tier": "P",
        //                     "number": "1G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "1H": {
        //                     "tier": "P",
        //                     "number": "1H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "1I": {
        //                     "tier": "P",
        //                     "number": "1I",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "2A": {
        //                     "tier": "P",
        //                     "number": "2A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "2B": {
        //                     "tier": "P",
        //                     "number": "2B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "2C": {
        //                     "tier": "P",
        //                     "number": "2C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "2D": {
        //                     "tier": "P",
        //                     "number": "2D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "2E": {
        //                     "tier": "P",
        //                     "number": "2E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "2F": {
        //                     "tier": "P",
        //                     "number": "2F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "2G": {
        //                     "tier": "P",
        //                     "number": "2G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "2H": {
        //                     "tier": "P",
        //                     "number": "2H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "2I": {
        //                     "tier": "P",
        //                     "number": "2I",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "2J": {
        //                     "tier": "P",
        //                     "number": "2J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "2K": {
        //                     "tier": "P",
        //                     "number": "2K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "2L": {
        //                     "tier": "P",
        //                     "number": "2L",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "3A": {
        //                     "tier": "P",
        //                     "number": "3A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "3B": {
        //                     "tier": "P",
        //                     "number": "3B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "3C": {
        //                     "tier": "P",
        //                     "number": "3C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "3D": {
        //                     "tier": "P",
        //                     "number": "3D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "3E": {
        //                     "tier": "P",
        //                     "number": "3E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "3F": {
        //                     "tier": "P",
        //                     "number": "3F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "3G": {
        //                     "tier": "P",
        //                     "number": "3G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "3H": {
        //                     "tier": "P",
        //                     "number": "3H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "3I": {
        //                     "tier": "P",
        //                     "number": "3I",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "3J": {
        //                     "tier": "P",
        //                     "number": "3J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "3K": {
        //                     "tier": "P",
        //                     "number": "3K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "3L": {
        //                     "tier": "P",
        //                     "number": "3L",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "4A": {
        //                     "tier": "P",
        //                     "number": "4A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "4B": {
        //                     "tier": "P",
        //                     "number": "4B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "4C": {
        //                     "tier": "P",
        //                     "number": "4C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "4D": {
        //                     "tier": "P",
        //                     "number": "4D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "4E": {
        //                     "tier": "P",
        //                     "number": "4E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "4F": {
        //                     "tier": "P",
        //                     "number": "4F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "4G": {
        //                     "tier": "P",
        //                     "number": "4G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "4H": {
        //                     "tier": "P",
        //                     "number": "4H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "4I": {
        //                     "tier": "P",
        //                     "number": "4I",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "4J": {
        //                     "tier": "P",
        //                     "number": "4J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "4K": {
        //                     "tier": "P",
        //                     "number": "4K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "4L": {
        //                     "tier": "P",
        //                     "number": "4L",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5A": {
        //                     "tier": "P",
        //                     "number": "5A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5B": {
        //                     "tier": "P",
        //                     "number": "5B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5C": {
        //                     "tier": "P",
        //                     "number": "5C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5D": {
        //                     "tier": "P",
        //                     "number": "5D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5E": {
        //                     "tier": "P",
        //                     "number": "5E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5F": {
        //                     "tier": "P",
        //                     "number": "5F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5G": {
        //                     "tier": "P",
        //                     "number": "5G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5H": {
        //                     "tier": "P",
        //                     "number": "5H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5I": {
        //                     "tier": "P",
        //                     "number": "5I",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5J": {
        //                     "tier": "P",
        //                     "number": "5J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5K": {
        //                     "tier": "P",
        //                     "number": "5K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "5L": {
        //                     "tier": "P",
        //                     "number": "5L",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6A": {
        //                     "tier": "P",
        //                     "number": "6A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6B": {
        //                     "tier": "P",
        //                     "number": "6B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6C": {
        //                     "tier": "P",
        //                     "number": "6C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6D": {
        //                     "tier": "P",
        //                     "number": "6D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6E": {
        //                     "tier": "P",
        //                     "number": "6E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6F": {
        //                     "tier": "P",
        //                     "number": "6F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6G": {
        //                     "tier": "P",
        //                     "number": "6G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6H": {
        //                     "tier": "P",
        //                     "number": "6H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6I": {
        //                     "tier": "P",
        //                     "number": "6I",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6J": {
        //                     "tier": "P",
        //                     "number": "6J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6K": {
        //                     "tier": "P",
        //                     "number": "6K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "6L": {
        //                     "tier": "P",
        //                     "number": "6L",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "7A": {
        //                     "tier": "P",
        //                     "number": "7A",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "7B": {
        //                     "tier": "P",
        //                     "number": "7B",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "7C": {
        //                     "tier": "P",
        //                     "number": "7C",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "7D": {
        //                     "tier": "P",
        //                     "number": "7D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "7E": {
        //                     "tier": "P",
        //                     "number": "7E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "7F": {
        //                     "tier": "P",
        //                     "number": "7F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "7G": {
        //                     "tier": "P",
        //                     "number": "7G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "7H": {
        //                     "tier": "P",
        //                     "number": "7H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "7I": {
        //                     "tier": "P",
        //                     "number": "7I",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "7J": {
        //                     "tier": "P",
        //                     "number": "7J",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "7K": {
        //                     "tier": "P",
        //                     "number": "7K",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "7L": {
        //                     "tier": "P",
        //                     "number": "7L",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "8A": {
        //                     "tier": "P",
        //                     "number": "8A",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "8B": {
        //                     "tier": "P",
        //                     "number": "8B",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "8C": {
        //                     "tier": "P",
        //                     "number": "8C",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "8D": {
        //                     "tier": "P",
        //                     "number": "8D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "8E": {
        //                     "tier": "P",
        //                     "number": "8E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "8F": {
        //                     "tier": "P",
        //                     "number": "8F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "8G": {
        //                     "tier": "P",
        //                     "number": "8G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "8H": {
        //                     "tier": "P",
        //                     "number": "8H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "8I": {
        //                     "tier": "P",
        //                     "number": "8I",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "8J": {
        //                     "tier": "P",
        //                     "number": "8J",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "8K": {
        //                     "tier": "P",
        //                     "number": "8K",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "8L": {
        //                     "tier": "P",
        //                     "number": "8L",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "9A": {
        //                     "tier": "P",
        //                     "number": "9A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9B": {
        //                     "tier": "P",
        //                     "number": "9B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9C": {
        //                     "tier": "P",
        //                     "number": "9C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9D": {
        //                     "tier": "P",
        //                     "number": "9D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9E": {
        //                     "tier": "P",
        //                     "number": "9E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9F": {
        //                     "tier": "P",
        //                     "number": "9F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9G": {
        //                     "tier": "P",
        //                     "number": "9G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9H": {
        //                     "tier": "P",
        //                     "number": "9H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9I": {
        //                     "tier": "P",
        //                     "number": "9I",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9J": {
        //                     "tier": "P",
        //                     "number": "9J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9K": {
        //                     "tier": "P",
        //                     "number": "9K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "9L": {
        //                     "tier": "P",
        //                     "number": "9L",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10A": {
        //                     "tier": "P",
        //                     "number": "10A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10B": {
        //                     "tier": "P",
        //                     "number": "10B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10C": {
        //                     "tier": "P",
        //                     "number": "10C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10D": {
        //                     "tier": "P",
        //                     "number": "10D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10E": {
        //                     "tier": "P",
        //                     "number": "10E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10F": {
        //                     "tier": "P",
        //                     "number": "10F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10G": {
        //                     "tier": "P",
        //                     "number": "10G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10H": {
        //                     "tier": "P",
        //                     "number": "10H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10I": {
        //                     "tier": "P",
        //                     "number": "10I",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10J": {
        //                     "tier": "P",
        //                     "number": "10J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10K": {
        //                     "tier": "P",
        //                     "number": "10K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "10L": {
        //                     "tier": "P",
        //                     "number": "10L",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "11A": {
        //                     "tier": "P",
        //                     "number": "11A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "11B": {
        //                     "tier": "P",
        //                     "number": "11B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "11C": {
        //                     "tier": "P",
        //                     "number": "11C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "11D": {
        //                     "tier": "P",
        //                     "number": "11D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "11E": {
        //                     "tier": "P",
        //                     "number": "11E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "11F": {
        //                     "tier": "P",
        //                     "number": "11F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "11G": {
        //                     "tier": "P",
        //                     "number": "11G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "11H": {
        //                     "tier": "P",
        //                     "number": "11H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "11I": {
        //                     "tier": "P",
        //                     "number": "11I",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "11J": {
        //                     "tier": "P",
        //                     "number": "11J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "11K": {
        //                     "tier": "P",
        //                     "number": "11K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "11L": {
        //                     "tier": "P",
        //                     "number": "11L",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "12A": {
        //                     "tier": "P",
        //                     "number": "12A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "12B": {
        //                     "tier": "P",
        //                     "number": "12B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "12C": {
        //                     "tier": "P",
        //                     "number": "12C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "12D": {
        //                     "tier": "P",
        //                     "number": "12D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "12E": {
        //                     "tier": "P",
        //                     "number": "12E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "12F": {
        //                     "tier": "P",
        //                     "number": "12F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "12G": {
        //                     "tier": "P",
        //                     "number": "12G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "12H": {
        //                     "tier": "P",
        //                     "number": "12H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "12I": {
        //                     "tier": "P",
        //                     "number": "12I",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "12J": {
        //                     "tier": "P",
        //                     "number": "12J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "12K": {
        //                     "tier": "P",
        //                     "number": "12K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "12L": {
        //                     "tier": "P",
        //                     "number": "12L",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "13A": {
        //                     "tier": "P",
        //                     "number": "13A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "13B": {
        //                     "tier": "P",
        //                     "number": "13B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "13C": {
        //                     "tier": "P",
        //                     "number": "13C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "13D": {
        //                     "tier": "P",
        //                     "number": "13D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "13E": {
        //                     "tier": "P",
        //                     "number": "13E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "13F": {
        //                     "tier": "P",
        //                     "number": "13F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "13G": {
        //                     "tier": "P",
        //                     "number": "13G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "13H": {
        //                     "tier": "P",
        //                     "number": "13H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "13I": {
        //                     "tier": "P",
        //                     "number": "13I",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "13J": {
        //                     "tier": "P",
        //                     "number": "13J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "13K": {
        //                     "tier": "P",
        //                     "number": "13K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "13L": {
        //                     "tier": "P",
        //                     "number": "13L",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "14A": {
        //                     "tier": "P",
        //                     "number": "14A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "14B": {
        //                     "tier": "P",
        //                     "number": "14B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "14C": {
        //                     "tier": "P",
        //                     "number": "14C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "14D": {
        //                     "tier": "P",
        //                     "number": "14D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "14E": {
        //                     "tier": "P",
        //                     "number": "14E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "14F": {
        //                     "tier": "P",
        //                     "number": "14F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "14G": {
        //                     "tier": "P",
        //                     "number": "14G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "14H": {
        //                     "tier": "P",
        //                     "number": "14H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "14I": {
        //                     "tier": "P",
        //                     "number": "14I",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "14J": {
        //                     "tier": "P",
        //                     "number": "14J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "14K": {
        //                     "tier": "P",
        //                     "number": "14K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "14L": {
        //                     "tier": "P",
        //                     "number": "14L",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "15A": {
        //                     "tier": "P",
        //                     "number": "15A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "15B": {
        //                     "tier": "P",
        //                     "number": "15B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "15C": {
        //                     "tier": "P",
        //                     "number": "15C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "15D": {
        //                     "tier": "P",
        //                     "number": "15D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "15E": {
        //                     "tier": "P",
        //                     "number": "15E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "15F": {
        //                     "tier": "P",
        //                     "number": "15F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "15G": {
        //                     "tier": "P",
        //                     "number": "15G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "15H": {
        //                     "tier": "P",
        //                     "number": "15H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "15I": {
        //                     "tier": "P",
        //                     "number": "15I",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "15J": {
        //                     "tier": "P",
        //                     "number": "15J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "15K": {
        //                     "tier": "P",
        //                     "number": "15K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "15L": {
        //                     "tier": "P",
        //                     "number": "15L",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "16A": {
        //                     "tier": "P",
        //                     "number": "16A",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "16B": {
        //                     "tier": "P",
        //                     "number": "16B",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "16C": {
        //                     "tier": "P",
        //                     "number": "16C",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "16D": {
        //                     "tier": "P",
        //                     "number": "16D",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "16E": {
        //                     "tier": "P",
        //                     "number": "16E",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "16F": {
        //                     "tier": "P",
        //                     "number": "16F",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "16G": {
        //                     "tier": "P",
        //                     "number": "16G",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "16H": {
        //                     "tier": "P",
        //                     "number": "16H",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "16I": {
        //                     "tier": "P",
        //                     "number": "16I",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "16J": {
        //                     "tier": "P",
        //                     "number": "16J",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "16K": {
        //                     "tier": "P",
        //                     "number": "16K",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "16L": {
        //                     "tier": "P",
        //                     "number": "16L",
        //                     "isBooked": 0,
        //                     "isBlocked": 0
        //                 },
        //                 "17A": {
        //                     "tier": "P",
        //                     "number": "17A",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "17B": {
        //                     "tier": "P",
        //                     "number": "17B",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "17C": {
        //                     "tier": "P",
        //                     "number": "17C",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "17E": {
        //                     "tier": "P",
        //                     "number": "17E",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "17F": {
        //                     "tier": "P",
        //                     "number": "17F",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "17G": {
        //                     "tier": "P",
        //                     "number": "17G",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "17H": {
        //                     "tier": "P",
        //                     "number": "17H",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "17I": {
        //                     "tier": "P",
        //                     "number": "17I",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "17J": {
        //                     "tier": "P",
        //                     "number": "17J",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "17K": {
        //                     "tier": "P",
        //                     "number": "17K",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 },
        //                 "17L": {
        //                     "tier": "P",
        //                     "number": "17L",
        //                     "isBooked": 1,
        //                     "isBlocked": 0
        //                 }
        //             },
        //             "ferryOPR": "NTK",
        //             "ship_title": "Nautika",
        //             "operator": "Sea Link India"
        //         },
        //         {
        //             "id": "742",
        //             "source_location_id": "1",
        //             "destination_location_id": "2",
        //             "departure_time": "12:30:00",
        //             "arrival_time": "14:00:00",
        //             "from_date": "2024-04-01",
        //             "to_date": "2024-08-31",
        //             "booking_start_date": "2024-03-07",
        //             "booking_end_date": "2024-08-31",
        //             "ticket_code": "A412",
        //             "schedule_type": "1",
        //             "ship_id": "5",
        //             "is_active": "Y",
        //             "is_deleted": "N",
        //             "display_name": "MAK 1",
        //             "is_package": "N",
        //             "source_name": "Port Blair",
        //             "destination_name": "Swaraj Dweep  (Havelock) ",
        //             "ship_title": "Makruzz",
        //             "ferryOPR": "MAK",
        //             "Classes": [
        //                 {
        //                     "class_title": "Premium",
        //                     "total_seat": "192",
        //                     "ship_class_id": "17",
        //                     "meal_description": "",
        //                     "meal_price": "",
        //                     "is_meal": "N",
        //                     "ship_class_price": "1725",
        //                     "via": "",
        //                     "seat": 156,
        //                     "cgst": 9,
        //                     "ugst": 9,
        //                     "cgst_amount": 155.25,
        //                     "ugst_amount": 155.25,
        //                     "psf": 50
        //                 },
        //                 {
        //                     "class_title": "Deluxe",
        //                     "total_seat": "64",
        //                     "ship_class_id": "18",
        //                     "meal_description": "",
        //                     "meal_price": "",
        //                     "is_meal": "N",
        //                     "ship_class_price": "2250",
        //                     "via": "",
        //                     "seat": 51,
        //                     "cgst": 9,
        //                     "ugst": 9,
        //                     "cgst_amount": 202.5,
        //                     "ugst_amount": 202.5,
        //                     "psf": 50
        //                 },
        //                 {
        //                     "class_title": "Royal",
        //                     "total_seat": "8",
        //                     "ship_class_id": "19",
        //                     "meal_description": "",
        //                     "meal_price": "",
        //                     "is_meal": "Y",
        //                     "ship_class_price": "3100",
        //                     "via": "",
        //                     "seat": 8,
        //                     "cgst": 9,
        //                     "ugst": 9,
        //                     "cgst_amount": 279,
        //                     "ugst_amount": 279,
        //                     "psf": 50
        //                 }
        //             ]
        //         },
        //         {
        //             "id": "778",
        //             "source_location_id": "1",
        //             "destination_location_id": "2",
        //             "departure_time": "08:00:00",
        //             "arrival_time": "09:30:00",
        //             "from_date": "2024-05-10",
        //             "to_date": "2024-08-31",
        //             "booking_start_date": "2024-05-06",
        //             "booking_end_date": "2024-08-31",
        //             "ticket_code": "A412",
        //             "schedule_type": "1",
        //             "ship_id": "5",
        //             "is_active": "Y",
        //             "is_deleted": "N",
        //             "display_name": "MAK 1",
        //             "is_package": "N",
        //             "source_name": "Port Blair",
        //             "destination_name": "Swaraj Dweep  (Havelock) ",
        //             "ship_title": "Makruzz",
        //             "ferryOPR": "MAK",
        //             "Classes": [
        //                 {
        //                     "class_title": "Premium",
        //                     "total_seat": "192",
        //                     "ship_class_id": "17",
        //                     "meal_description": "",
        //                     "meal_price": "",
        //                     "is_meal": "N",
        //                     "ship_class_price": "1725",
        //                     "via": "",
        //                     "seat": 133,
        //                     "cgst": 9,
        //                     "ugst": 9,
        //                     "cgst_amount": 155.25,
        //                     "ugst_amount": 155.25,
        //                     "psf": 50
        //                 },
        //                 {
        //                     "class_title": "Deluxe",
        //                     "total_seat": "64",
        //                     "ship_class_id": "18",
        //                     "meal_description": "",
        //                     "meal_price": "",
        //                     "is_meal": "N",
        //                     "ship_class_price": "2250",
        //                     "via": "",
        //                     "seat": 57,
        //                     "cgst": 9,
        //                     "ugst": 9,
        //                     "cgst_amount": 202.5,
        //                     "ugst_amount": 202.5,
        //                     "psf": 50
        //                 },
        //                 {
        //                     "class_title": "Royal",
        //                     "total_seat": "8",
        //                     "ship_class_id": "19",
        //                     "meal_description": "",
        //                     "meal_price": "",
        //                     "is_meal": "Y",
        //                     "ship_class_price": "3100",
        //                     "via": "",
        //                     "seat": 8,
        //                     "cgst": 9,
        //                     "ugst": 9,
        //                     "cgst_amount": 279,
        //                     "ugst_amount": 279,
        //                     "psf": 50
        //                 }
        //             ]
        //         }
        //     ]

        return mergedFerryList
    }

    async fatchSingleFerryNtk(searchQuery){

        const islandCode = {
            1: "Port Blair",
            2: "Swaraj Dweep",
            3: "Shaheed Dweep",
        }

        const [year, month, day] = searchQuery.date.split('-');
        const validDate = `${day}-${month}-${year}`;

        const NTKModSearchQuery = {
            date: validDate,
            dest: islandCode[searchQuery.dest],
            dept: islandCode[searchQuery.dept]
        }

        const NTKFerryList = await fatchAllFerryNTK(NTKModSearchQuery)

        const NTKFerryListMarged = NTKFerryList.data.length > 0 ? NTKFerryList.data.map(item => ({ ...item, ferryOPR: "NTK", ship_title: "Nautika", operator: "Sea Link India", dest_code: searchQuery.dest, dept_code: searchQuery.dept })) : [];
        
        const singleFerry = NTKFerryListMarged.filter(obj => obj.id.toString() === searchQuery.ferryId && obj.tripId.toString() === searchQuery.tripId)

        if(!singleFerry){
            ErrorHandler.notAcceptableError()
        }

        if(singleFerry.length === 0){
            ErrorHandler.notFoundError("Ferry schedule not found...!")
        }
        return singleFerry[0]
    }
    
    async fatchSingleFerryMak(searchQuery){

        const fetchAllFerryParams = {
            dept: searchQuery.dept,
            dest: searchQuery.dest,
            date: searchQuery.date,
            trav: searchQuery.trav,
        }
        const MKZFerryList = await fatchAllFerryMKZ(fetchAllFerryParams)
        
        const singleFerry = MKZFerryList.data.filter(obj => obj.id.toString() === searchQuery.scheduleID)

        if(!singleFerry){
            ErrorHandler.notAcceptableError()
        }

        const MakFerryListMarged = await makFerryService.makFerryMergeList(singleFerry)

        if(MakFerryListMarged.length === 0){
            ErrorHandler.notFoundError("Ferry schedule not found...!")
        }
        return MakFerryListMarged[0]
    }

    async checkSeatAvaliblityMAK(singleFerryData, traveler, ferryClassId) {

        const totalTraveler = traveler.Adults + traveler.Infants

        const ferryClasssObj = singleFerryData.Classes.find(obj => obj.ship_class_id === ferryClassId)
        if(ferryClasssObj.seat >= totalTraveler){
            return true
        }
        return false
    }

    async checkSeatAvaliblityNTK(singleFerryData, PaxData) {

        function mergeSeats(PaxData) {
            // Extract seats from adults and infants and merge into a single array
            const mergedSeats = [
              ...PaxData.adults.map((person) => person.seat || []), // Handle missing seat with fallback
              ...PaxData.infants.map((person) => person.seat || []),
            ].flat(); // Flatten the array in case 'seat' contains nested arrays
          
            // Separate seats by their tier
            const separatedSeats = mergedSeats.reduce(
              (result, seat) => {
                if (seat.tier === "P") {
                  result.pClass.push(seat);
                } else if (seat.tier === "B") {
                  result.bClass.push(seat);
                }
                return result;
              },
              { pClass: [], bClass: [] } // Initial structure for separated seats
            );
          
            return separatedSeats; // Return the separated seats
        }

        function verifySeatsAvailability(separatedSeats, ferryData) {
            const result = {
              pClass: separatedSeats.pClass.every((seat) => {
                const ferrySeat = ferryData.pClass[seat.number];
                return ferrySeat && ferrySeat.isBooked === 0;
              }),
              bClass: separatedSeats.bClass.every((seat) => {
                const ferrySeat = ferryData.bClass[seat.number];
                return ferrySeat && ferrySeat.isBooked === 0;
              }),
            };
          
            return result;
          }

        const selectedSeats = mergeSeats(PaxData);
        const availability = verifySeatsAvailability(selectedSeats, singleFerryData);

        if(availability.pClass === true && availability.bClass === true){
            return true
        }

        return false
    }

    async saveMakPassanger(singleFerryData, checkoutFerryData, travelDate, contactData, PaxData, traveler){

        const ferryClassObj = singleFerryData.Classes.find(obj => obj.ship_class_id === checkoutFerryData.Ferry_class_Id)

        const formattedData = {
              passenger: {},
              c_name: contactData.Name,
              c_mobile: contactData.Phone,
              c_email: contactData.Email,
              p_contact: contactData.Phone,
              no_of_passenger: `${traveler.Adults + traveler.Infants}`,
              schedule_id: checkoutFerryData.Ferry_Id,
              travel_date: travelDate,
              class_id: checkoutFerryData.Ferry_class_Id,
              fare: ferryClassObj.ship_class_price,
              tc_check: true
          };
          
          // Merge adults and infants into a single passenger list with numbered keys
          let passengerCounter = 1;
          [...PaxData.adults, ...PaxData.infants].forEach((person) => {

            let age;
            let title
            if (PaxData.infants.includes(person)) {
                // For infants, calculate age from DOB (YYYY-MM-DD)
                const birthDate = new Date(person.age); // Convert DOB to Date object
                const today = new Date();
                age = today.getFullYear() - birthDate.getFullYear(); // Year difference
                title = "INFANT"
            
                // Check if birthday has occurred this year; adjust if not
                const isBirthdayPassed =
                  today.getMonth() > birthDate.getMonth() ||
                  (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
                if (!isBirthdayPassed) {
                  age--; // Adjust age if birthday hasn't passed this year
                }
              } else {
                // For adults, age is already an integer
                age = person.age;
                title = person.title;
              }

            formattedData.passenger[passengerCounter] = {
              title: title,
              name: person.name,
              age: age,
              sex: ["Mr", "Master"].includes(person.title) ? "male" : ["Mrs", "Miss"].includes(person.title) ? "female" : "",  // Assuming "male" as an example, adjust as needed
              nationality: person.country,
              fcountry: "",
              fpassport: person.passportNumber || "",
              fexpdate: person.passportExpiryDate || ""
            };
            passengerCounter++;
          });


          const makCNFdata = await MKZSavePassenger(formattedData)
          return makCNFdata

    }


}

export default new ferryService();