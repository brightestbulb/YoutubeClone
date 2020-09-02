const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriberSchema = mongoose.Schema({
  
    userTo : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    userFrom : {
        type: Schema.Types.ObjectId,
        ref : 'User'
    }
    
}, { timestamps : true })  // 날짜 표시가 되도록 설정



const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = { Subscriber }