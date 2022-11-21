## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

```
## API Description

#### Initialize

`POST /parking/`

    {
	    "numberOfSlots" : 2
    }
    
##### Response

    {
	    "totalSlots": 2
    }

#### Add slots

`PATCH /parking/`

    {
	    "numberOfSlots" : 2
    }
    
##### Response

    {
	    "totalSlots": 4
    }

#### Park a car

`POST /parking/park`

    {
      "regNumber" : "UP80AA1001",
      "color" : "red"
    }
    
##### Response

    {
      "allocatedSlot": 2,
      "ticketId": "00000002"
    }

#### Get registration numbers of all cars of a color

`GET /parking/registration-numbers?color=red`

##### Response
    [
      "UP80AA1001",
      "UP80AA1003"
    ]
    

#### Get slot numbers occupied by all cars of a color

`GET /parking/slot-numbers?color=red`

##### Response
    [
      2,
      3
    ]


#### Get slot number occupied by car with given registration number

`GET /parking/slot-numbers?regNumber=UP80AA1003`

##### Response
    {
      "slotNumber":2
    }
    
    
#### Free slot by slot number

`POST /parking/clear`

    {
	    "slotNumber" : 2
    }
    
##### Response

    {
	    "freedSlot": 2
    }

#### Free slot by registration number

`POST /parking/clear`

    {
	    "regNumber" : "UP80AA1004"
    }
    
##### Response

    {
	    "freedSlot": 3
    }
    
    
#### Get all occupied slots

`GET /parking/status`
    
##### Response

    [
      {
        "regNumber": "UP80AA0003",
        "color": "c3",
        "slot": 3
      },
      {
        "regNumber": "UP80AA0004",
        "color": "c4",
        "slot": 4
      },
      {
        "regNumber": "UP80AA0005",
        "color": "c3",
        "slot": 1
      },
      {
        "regNumber": "UP80AA0006",
        "color": "c4",
        "slot": 2
      }
    ]

