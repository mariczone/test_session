var mongoose = require('mongoose')
var Shema = mongoose.Schema;

//Create schema
var userSchema = new Shema({
    'USERNAME': {
        'type': String,
        'required': true
    },
    'PASSWORD': {
        'type': String,
        'required': true
    },
    'NAME': {
        'type': String,
        'required': true
    }
}, { 'timestamps': true });


userSchema.methods.toJSON = function() {
  //Hide password from return json
  var obj = this.toObject();
  delete obj['PASSWORD'];
  return obj;
}

userSchema.on('init', function (model) {
    // do stuff with the model after command 'mongoose.model' is completed.
});

//  tell mongodb to create collection 'dishes' and item inside have dishSchema.
//  note that collection 'dish' will be convert to plural -> 'dishes' automatically. 
var usersModel = mongoose.model('user', userSchema);
//  if you have multiple database, 'mongoose.model()' will be changed to 'db.model()' where 'db' variable is 'mongoose.connection' in server1.js file
//var dishesModel = db.model('dish', dishSchema);

//make this module available to node app.
module.exports = usersModel;