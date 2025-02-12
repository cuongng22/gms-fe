export const dataExample = {
    "isHotel": true,
    "isTransport": true,
    "isCompleted": true,
    "airportCode": "BVH",
    "startDate": "2025-02-10",
    "endDate": "2025-02-10",
    "exchangeRate": 1234444,
    "rateVat": 10,
    "priceHotelsList":
        [
            {
                "hotelCode": "HOTEL_1",
                "hotelName": "Hotel 1",
                "twinRoomPrice": 1200000,
                "singleRoomPrice": 1000000,
            },
            {
                "hotelCode": "HOTEL_3",
                "hotelName": "Hotel 3",
                "twinRoomPrice": 1300000,
                "singleRoomPrice": 1100000,
            }
        ],
    "priceTransports": [
        {
            "carRentalCode": "CAR_1",
            "carRentalName": "Car 1",
            "unitPrice": 1100000
        },
        {
            "carRentalCode": "CAR_2",
            "carRentalName": "Car 2",
            "unitPrice": 1200000
        }
    ],
    "planHotel": [
        {
            "wetLeaseDate": "2025-02-10",
            "hotelItem": {
                HOTEL_1: {
                    "hotelCode": "HOTEL_1",
                    "hotelName": "Hotel 1",
                    // "twinRoomPrice": 1200000,
                    // "singleRoomPrice": 23423,
                    "totalSingleRoom": 15,
                    "totalTwinRoom": 24323,
                },
                HOTEL_3: {
                    "hotelCode": "HOTEL_3",
                    "hotelName": "Hotel 3",
                    // "twinRoomPrice": 1200000,
                    // "singleRoomPrice": 23423,
                    "totalSingleRoom": 15,
                    "totalTwinRoom": 24323,
                }
            },
            "totalCountForeign": 0,
            "totalIncVAT": 0,
            "totalExcVAT": 0
        }
    ],
    "planTransports": [
        {
            "transportCode": "CAR_1",
            "transportName": "Car 1",
            "numberOfTrip": 10,
            "totalAmountForex": 0,
            "totalAmountIncVAT": 0,
            "totalAmountExcVAT": 0
        },
        {
            "transportCode": "CAR_2",
            "transportName": "Car 2",
            "numberOfTrip": 102,
            "totalAmountForex": 0,
            "totalAmountIncVAT": 0,
            "totalAmountExcVAT": 0
        }
    ],
    "totalCountForeign": 0,
    "totalSingleRoom": 0,
    "totalTwinRoom": 0,
    "totalNumberOfTrip": 0,
    "totalIncVat": 0,
    "totalExcVat": 0
}