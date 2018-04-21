function log(str){
  if(process.env.NODE_ENV == "dev"){
    console.log(str);
  }
}

module.exports = { log };