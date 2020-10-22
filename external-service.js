const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

let count = 0

app.get('/', (req, res) => {
  count++

  var d = Math.random();
  if (d < 0.5) {
    console.log('success => ');
    res.send({
      status: 'success'
    })
  } else if (d < 0.9 && count > 50) {
    console.log('error =>')
    return res.status(500).send({
      status: 'server error'
    })
  } else {
    console.log('success => ');
    res.send({
      status: 'success'
    });
  }
});


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
