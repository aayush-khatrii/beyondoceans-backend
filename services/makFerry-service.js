class makFerryService{

    async makFerryMergeList(ferryList){

        const propertiesToExclude = [
            'ship_class_title', 
            'total_seat', 
            'ship_class_id',
            'meal_description',
            'meal_price',
            'is_meal',
            'ship_class_price',
            'via',
            'seat',
            'cgst%',
            'ugst%',
            'cgst_amount',
            'ugst_amount',
            'psf',
            'booking_type',
            'commision_type',
            'commision',
        ];

        function excludeProperties(obj, propertiesToExclude) {
            let result = { ...obj }; // Copy the original object

            propertiesToExclude.forEach(property => {
                delete result[property]; // Remove each property to exclude
            });

            return result;
        }

        const result = {};
        
        if(ferryList.length <= 0){
            return Object.values(result)
        }

        ferryList.forEach(item => {
            if (result[item.id]) {
                result[item.id].Classes.push({ 
                    class_title: item.ship_class_title,
                    total_seat: item.total_seat,
                    ship_class_id: item.ship_class_id,
                    meal_description: item.meal_description,
                    meal_price: item.meal_price,
                    is_meal: item.is_meal,
                    ship_class_price: item.ship_class_price,
                    via: item.via,
                    seat: item.seat,
                    cgst: item["cgst%"],
                    ugst: item["ugst%"],
                    cgst_amount: item.cgst_amount,
                    ugst_amount: item.ugst_amount,
                    psf: item.psf
                });
            } else {
                const commonProps = excludeProperties(item, propertiesToExclude);
                result[item.id] = {
                    ...commonProps,
                    ferryOPR: "MAK",
                    operator: "Makruzz",
                    Classes: [{
                        class_title: item.ship_class_title,
                        total_seat: item.total_seat,
                        ship_class_id: item.ship_class_id,
                        meal_description: item.meal_description,
                        meal_price: item.meal_price,
                        is_meal: item.is_meal,
                        ship_class_price: item.ship_class_price,
                        via: item.via,
                        seat: item.seat,
                        cgst: item["cgst%"],
                        ugst: item["ugst%"],
                        cgst_amount: item.cgst_amount,
                        ugst_amount: item.ugst_amount,
                        psf: item.psf
                    }]
                };
            }
        });

        return Object.values(result);

    }

}

export default new makFerryService()