const Logger = require('../logger');

function getHello(req,res){
	res.status(200) 
		.send('Hello World!');
}

function postHello(req,res){
	Logger.log(req.body);
	res.status(200) 
		.send('Hello World!');
}

module.exports = { getHello, postHello };