const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config');
const contacts = require('./contacts');

const app = express();

app.use(express.static('public'));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  const help = `
  <pre>
    Welcome to the Address Book API!

    Use an Authorization header to work with your own data:

    fetch(url, { headers: { 'Authorization': 'whatever-you-want' }})

    The following endpoints are available:

    GET /contacts
    DELETE /contacts/:id
    POST /contacts { name, handle, avatarURL }
  </pre>
  `;

  res.send(help);
});
function createData(restaurantName, listTime) {
  return {
    restaurantName,
    listTime,
    orderList: [
      {
        orderID: '121343',
        studentName: 'Sam Saston',
        dropOff: 'Bunnkin Street, NYC',
      },
      {
        orderID: '121453',
        studentName: 'Maven Carter',
        dropOff: 'Meryinl Garden, Brooklyn',
      },
      {
        orderID: '152903',
        studentName: 'Lashy Johns',
        dropOff: 'Trump Tower, Seattle',
      },
      {
        orderID: '143211',
        studentName: 'Sarah Zalt',
        dropOff: 'Wells Street, Boston',
      },
    ],
  };
}
const rows = [
  createData('Spicy Village', '12/01/2021 13:15'),
  createData('Indian Foods', '12/01/2021 14:10'),
  createData('Japan Corner', '12/01/2021 14:35'),
  createData("Smith's Dinner", '12/01/2021 15:15'),
  createData('Cream Town', '12/01/2021 16:20'),
];
app.get('/listData', (req, res) => {
  res.send(rows);
});
const orderListData = {
  page: '0',
  pageSize: '10',
  totalRestaurantCount: 1,
  restaurants: [
    {
      id: 14,
      accountId: 1,
      name: 'Apple World',
      pickupTimeForDriver: '2021-04-27T04:00:00.000Z',
      orders: [
        {
          id: '100020',
          orderStatusId: 1,
          payoutStatusId: 1,
          customerName: 'Ronn Amont',
          chefLocation: '85 New Avenue, Seattle',
        },
        {
          id: '112320',
          orderStatusId: 1,
          payoutStatusId: 2,
          customerName: 'Ronn Amont',
          chefLocation: '85 New Avenue, Seattle',
        },
        {
          id: '154420',
          orderStatusId: 4,
          payoutStatusId: 2,
          customerName: 'Ronn Amont',
          chefLocation: '85 New Avenue, Seattle',
        },
      ],
    },
    {
      id: 12,
      accountId: 2,
      name: 'Cream Castle',
      pickupTimeForDriver: '2021-04-27T04:00:00.000Z',
      orders: [
        {
          id: '100020',
          orderStatusId: 1,
          payoutStatusId: 1,
          customerName: 'Ronn Amont',
          chefLocation: '85 New Avenue, Seattle',
        },
        {
          id: '10030',
          orderStatusId: 4,
          payoutStatusId: 1,
          customerName: 'Ronn Amont',
          chefLocation: '85 New Avenue, Seattle',
        },
      ],
    },
    {
      id: 14,
      accountId: 3,
      name: 'Pie Sky',
      pickupTimeForDriver: '2021-04-27T04:00:00.000Z',
      orders: [
        {
          id: '143020',
          orderStatusId: 4,
          payoutStatusId: 1,
          customerName: 'Ronn Amont',
          chefLocation: '85 New Avenue, Seattle',
        },
        {
          id: '100320',
          orderStatusId: 1,
          payoutStatusId: 1,
          customerName: 'Ronn Amont',
          chefLocation: '85 New Avenue, Seattle',
        },
        {
          id: '10730',
          orderStatusId: 4,
          payoutStatusId: 1,
          customerName: 'Ronn Amont',
          chefLocation: '85 New Avenue, Seattle',
        },
      ],
    },
  ],
};
app.get('/getAllOrderList', (req, res) => {
  res.send(orderListData);
});

app.post('/changeStatus', (req, res) => {
  var ok = '';
  ok += '*';
  for (let i = 0; i < orderListData.restaurants.length; i += 1) {
    ok += '*';
    const sizeer = orderListData.restaurants[i].orders.length;
    for (let j = 0; j < sizeer; j += 1) {
      if (orderListData.restaurants[i].orders[j].id === req.body.id)
        res.send(i + ' ' + j);
    }
  }
  console.log(req.body.id);
  res.send('no');
});

// app.use((req, res, next) => {
//   const token = req.get('Authorization');

//   if (token) {
//     req.token = token;
//     next();
//   } else {
//     res.status(403).send({
//       error:
//         'Please provide an Authorization header to identify yourself (can be whatever you want)',
//     });
//   }
// });

app.get('/contacts', (req, res) => {
  res.send(contacts.get(req.token));
});

app.delete('/contacts/:id', (req, res) => {
  res.send(contacts.remove(req.token, req.params.id));
});

app.post('/contacts', bodyParser.json(), (req, res) => {
  const { name, handle } = req.body;

  if (name && handle) {
    res.send(contacts.add(req.token, req.body));
  } else {
    res.status(403).send({
      error: 'Please provide both a name and a handle',
    });
  }
});

app.listen(config.port, () => {
  console.log('Server listening on port %s, Ctrl+C to stop', config.port);
});
