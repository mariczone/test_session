module.exports = {
    'gendummydata': function (done) {
        var User = require('./models/users');
        User.remove({}, function () {
            var _dummyUser = [
                {
                    "USERNAME": 'USERA',
                    "PASSWORD": 'PASSWORDA',
                    "NAME": "Mr. A"
                },
                {
                    "USERNAME": 'USERB',
                    "PASSWORD": 'PASSWORDB',
                    "NAME": "Mr. B"
                },
                {
                    "USERNAME": 'USERC',
                    "PASSWORD": 'PASSWORDC',
                    "NAME": "Mr. C"
                },
            ];
            User.insertMany(_dummyUser)
                .then(function (mongooseDocuments) {
                    done();
                })
                .catch(function (err) {
                    console.error("user dummy data write failed : ", err);
                });
        });
    }
};
