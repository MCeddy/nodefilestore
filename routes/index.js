var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'upload',
    angularApp: 'UploadApp'
  });
});

router.post('/upload', function(req, res) {
  res.status(204).end();
});

module.exports = router;
