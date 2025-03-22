const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname);

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/submit', (req, res) => {
  console.log(`Received request: POST /submit`);

  const cleanedData = {
    name: req.body.name,
    age: req.body.age,
    country: req.body.country,
    password: req.body.password,
    timestamp: new Date().toISOString(), 
  };

  console.log('Cleaned Form Data:', cleanedData);

  fs.readFile('data.json', (err, data) => {
    let jsonData = [];
    if (err) {
      console.error('Error reading data file', err);
      jsonData = [];
    } else {
      if (data.length > 0) {
        jsonData = JSON.parse(data); 
      } else {
        jsonData = []; 
      }
    }

    jsonData.push({
      name: cleanedData.name,
      age: cleanedData.age,
      country: cleanedData.country,
      password: cleanedData.password,
      timestamp: cleanedData.timestamp
    }); 

    console.log('Writing data to file:', jsonData);

    fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error('Error writing to file', err);
        return res.status(500).json({ message: 'Error saving data' });
      }
      console.log('Data successfully written to file');
      res.redirect('/success'); 
    });
  }); 
});

app.get('/data', (req, res) => {
  fs.readFile('data.json', (err, data) => {
    if (err) {
      console.error('Error reading data file', err);
      res.status(500).send('Error reading data');
      return;
    }
    res.json(JSON.parse(data)); 
  });
});

app.get('/success', (req, res) => {
  res.render('success', { message: 'Form submitted successfully!' });
});

const port = 3001;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
