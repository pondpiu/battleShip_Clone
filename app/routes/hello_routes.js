function getHello(req,res){
	res.status(200) 
		.send('Hello World!');
}

function postHello(req,res){
	console.log(req.body);
	res.status(200) 
		.send('Hello World!');
}

module.exports = { getHello, postHello };