# coffee-backend

### :gear: Running locally

- Clone this repository, set up your stripe secret key (env.example.js has most of the settings already) inside src/main/config/env.js.
- Issue on terminal:
```
docker-compose up
```
- Open a REST API client like insomnia and make some requests to the endpoint http://127.0.0.1:5858 

### :chopsticks: Using the API

#### Create a order:

Make a post request to http://localhost:5858/api/v2/manage-order with a json body like this:

```
{
	"name": "valid_name",
	"email": "valid_mail@mail.com",
	"phone": "valid_phone",
	"address": "valid_adress",
	"zip": "valid_zip",
	"paymentMethod":"mastercard",
	"orderNumber":"valid_orderNumber",
	"price": 49.90,
	"date": "2020-12-28T14:56:05.905Z",
	"quantity": 3,
	"orderStatus": "não" // or "sim"
}
```
And get a response like this:

```
{
  "orderId": "6004b868df2c39001da495e8"
}
```

#### Make a Stripe order and get a session id to proceed the payment :

Make a post request to http://localhost:5858/api/v2/create-customer-order/stripe with a json body like this:

```
{
	"value": 49.90,
	"quantity": 3,
	"currency": "brl",
	"orderId": "6004b868df2c39001da495e8" // orderId obteined before
}
```
And get a response like this:

```
{
  "sessionId": "cs_test_a1GP49udUMEwEpStcmlnDbv7fCmJZo0wxgwcZv6w1y7HabzNRR8teAG49m"
}
```

#### Update the order status to paid ("sim"):

Make a post request to http://localhost:5858/api/v2/update-order-status with the following json body:

```
{
	"success": "true",
	"canceled": "false",
	"orderId": "6004b868df2c39001da495e8"
}
```
#### Show orders:

Make a get request to http://localhost:5858/api/v2/show-orders and you should receive something like this:

```
{
  "orders": [
    {
      "_id": "6004b868df2c39001da495e8",
      "paymentMethod": "mastercard",
      "price": 149.9,
      "quantity": 3,
      "orderStatus": "não",
      "customerId": "6004b868df2c39001da495e7",
      "createdAt": "2021-01-17T22:21:28.569Z",
      "customer": [
        {
          "_id": "6004b868df2c39001da495e7",
          "name": "valid_name10",
          "email": "antonio@gmail.com",
          "phone": "valid_phone5",
          "address": "valid_adress5",
          "zip": "valid_zip5",
          "createdAt": "2021-01-17T22:21:28.190Z"
        }
      ]
    }
  ]
}
```

### :test_tube: Testing

- On terminal and inside root project folder, issue:
```
npm run test:unit
```

