module.exports = function(app, http) {

  http.get('/test', function(req, res) {
    res.send('test success')
  });
};