const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()

const apiKey ='2c0330cd8ec9a2ed3f349c2f60b84615';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index', {weather: null, error: null});
})

app.post('/', function (req, res) {
  let city = req.body.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

  getRequest(url).then(function(val){
    res.render('index', {weather: val, error: null});
  }).catch(function(err){
    res.render('index', {weather: null, error: 'Error, please try again'});
  });
})


function getRequest(url){
  return new Promise(function(resolve,reject){
      request(url, function (err, response, body) {
        if(err){return reject(err);}
        else{
          let weather = JSON.parse(body)
          if(weather.main == undefined){return reject(err);}
          else{
            let weatherConverter = Math.round((weather.main.temp - 32)/1.8)
            let weatherText = `It's ${weatherConverter} degrees in ${weather.name}!`;
            return resolve(weatherText);
          }
        }
      });
    });
  }


app.listen(3001, function () {
  console.log('listening on port 3001!')
})
