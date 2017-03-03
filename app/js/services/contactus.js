angular.module('basketWeather', [])
  .factory('weather', ['$http', function($http) {
    return $http.get('http://api.openweathermap.org/data/2.5/weather?lat=33.72&lon=-116.37&units=imperial&appid=ffd7e7d03b1e3c1f5ae429dd2a42ddfd')
      .then(function(data) {
        return data;
      }, function(err) {
        return err;
      });
  }])
