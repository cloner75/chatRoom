const mongoose = require('mongoose'),
    objId = mongoose.Types.ObjectId,
    db = mongoose.connection;

mongoose.connect('mongodb://localhost:27017/chatRoom', {useNewUrlParser: true});
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('mongoDB start')
});


let Models = [],
    Schemas =[];

Schemas['Users'] = new mongoose.Schema({
    _id: {type: String},
    na: {type: String},//name
    em: {type: String},//email unique
    se: {type: String},//secret password
    ci: {type: String},//city
    opt: {type: String},//otp code generate

});

Schemas['Rooms'] = new mongoose.Schema({
    _id: {type: String},
    na: {type: String},//name
    uid: {type: String,ref:'Users'},//to user id
    to: {type: String,ref:'Users'},//to user id
    ca: {type:String,default: Date.now},//Created_at
});

Schemas['Chats'] = new mongoose.Schema({
    _id: {type: String},
    rid: {type: String,ref:'Rooms'},//user id
    uid: {type: String,ref:'Users'},//user id
    co: {type:String},//content
    ca: {type:String,default: Date.now},//Created_at
    ty: {type:String},//Type
    st: {type:String},//Type
});

Schemas['Files'] = new mongoose.Schema({
    _id: {type: String},
    ca: {type: Date, default: Date.now},
    uid: {type: String, ref: 'Users'},
    fn: {type: String, required: false},
    or: {type: String, required: false},
    en: {type: String, required: false},
    mi: {type: String, required: false},
    de: {type: String, required: false},
    na: {type: String, required: false},
    pa: {type: String, required: false},
    si: {type: String, required: false}
});

Schemas['Onlines'] = new mongoose.Schema({
    _id: {type: String},
    ca: {type: Date, default: Date.now},
    uid: {type: String, ref: 'Users',required:true},
    rid: {type: String, required: true,ref:'Rooms'},
    sid: {type: String, required: true},//socket id
    st: {type: String, required: true},//status
});


for (let item in Schemas) {

    Schemas[item].pre('save', function (next) {
        this._id = new objId;
        next();
    })

    Models[item] = mongoose.model(item, Schemas[item])
}
module.exports = Models;