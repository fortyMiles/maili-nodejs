var jwt = require('jsonwebtoken');

var token = jwt.sign({user: '18857453090'}, 'token', {expiresIn: 120});
console.log(token);
