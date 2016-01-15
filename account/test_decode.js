var jwt = require('jsonwebtoken');

var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiMTg4NTc0NTMwOTAiLCJpYXQiOjE0NTI1ODk2MTIsImV4cCI6MTQ1MjU4OTczMn0.SrJywJbIfWoXaYfTtHQDL8rnZtG5tBnRvTckYihOKm4';

jwt.verify(token, 'token', function(err, decoded) {      
	if (err) {
		console.log('Failed to authenticate token.');    
	} else {
		// if everything is good, save to request for use in other routes
		console.log(decoded);
	}
});
