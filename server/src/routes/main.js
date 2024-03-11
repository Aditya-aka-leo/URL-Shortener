const express  = require('express');
const { post_url, get_url } = require('../controller/controller');


const router  = express.Router();

router.post('/url',post_url);
router.get('/url/bitly_clone.com/:identifier',get_url);
module.exports = router;

