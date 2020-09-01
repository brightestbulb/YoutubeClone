const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = mongoose.Schema({
  
    writer : {
        type : mongoose.Schema.Types.ObjectId,  // 이렇게 하면 User.js 모델에 가서 모든 정보를 가져올 수 있다.
        ref : 'User'
    },
    title : {
        type: String,
        maxlength: 50
    },
    description : {
        type : String
    },
    privacy : {  // 0 : privacy , 1 : public
        type : Number
    },
    filePath : {
        type : String
    },
    category : {
        type : String
    },
    views : {
        type : Number,
        default : 0
    },
    duration : {
        type : String
    },
    thumbnail : {
        type : String
    }

}, { timestamps : true })  // 날짜 표시가 되도록 설정



const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }