'use strict'

const hello = (req, res, next) => {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var name = req.swagger.params.name.value || 'stranger';
  // this sends back a JSON response which is a single string
  res.send({message: `hello ${name}`});
}

module.exports = {
  hello,

}
