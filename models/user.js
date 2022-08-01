var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        default: 'user',
        enum: ['user', 'admin', 'superAdmin', 'dedicatedUser', 'superUser']
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'companies',
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
    },

    // companyIds: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'companies',
    //     required: true
    // }],
    // lastCompanyWorkspace: {
    //     type: String,
    //     required: false,
    // },
    // ip: {
    //     type: String,
    //     required: true,
    //     default: '85.34.78.112',
    // }
}, {
    timestamps: true
});

User.plugin(passportLocalMongoose);
const myDB = mongoose.connection.useDb("main-database");
module.exports = myDB.model('User', User);