const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require('multer');  // 노드 서버에 파일을 저장하기 위해 사용
const ffmpeg = require('fluent-ffmpeg');

let storage = multer.diskStorage({
    // 파일을 저장할 경로 설정 ( uploads 폴더에 비디오 저장 )
    destination : (res, file, cb) => {
        cb(null, "uploads/");
    },
    // 저장할 때의 파일 이름 설정
    filename : (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter : (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if(ext !== '.mp4'){  // mp4만 되도록 설정 ( .png 하고싶으면 "|| ext !== '.png'" 추가 )
            return cb(res.status(400).end('only mp4 is allowed'), false);
        }
        cb(null, true)
    }
})

const upload = multer({ storage : storage }).single("file");  // single 파일 업로드

//=================================
//             Vidoe
//=================================

router.post('/uploadfiles', (req, res) => {

    // 비디오를 서버에 저장한다.
    upload(req, res, err => {
        if(err){
            return res.json({ success: false, err})
        }else{  // res.req.file.path : 서버에 업로드된 파일 경로 , res.req.file.filename : 업로드된 파일 이름
            return res.json({success : true, url : res.req.file.path, fileName : res.req.file.filename})
        }
    })
})

router.post('/uploadVideo', (req, res) => {

    // 비디오를 DB에 저장한다.
    const video = new Video(req.body);
    video.save((err, doc) => {  // save() : mongo DB Function
        if(err) {
            return res.json({ success : false, err })
        }else{
            res.status(200).json({ success : true })
        }
    });

})

router.get('/getVideos', (req, res) => {

    // 비디오를 DB에서 가져와서 클라이언트에 전송.
    Video.find()  // Video Collection 안에 있는 모든 비디오를 가져온다.
        .populate('writer')  // populate를 통해서 모든 user 정보를 가져온다
        .exec((err, videos) => {
            if(err){
                return res.status(400).send(err);
            }else{
                res.status(200).json({ success : true, videos })
            }
        })
})

router.post('/thumbnail', (req, res) => {

    let filePath = ""
    let fileDuration = ""

    //비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function(err, metadata){  // ffprobe를 사용하여 비디오 정보 가져오기
        console.dir(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration
    });


   // 썸네일 생성
   ffmpeg(req.body.url)  // req.body.url : 클라이언트에서 온 비디오 저장 경로 /uploads
   .on('filenames', function(filenames){     // 비디오 썸네일 파일 네임을 생성
       console.log('Will generate ' + filenames.join(', '))
       console.log(filenames)

       filePath = "uploads/thumbnails/" + filenames[0]
   })
   .on('end', function (){  // 썸네일을 생성한 후 할 일을 처리
       console.log("Screenshots taken");
       return res.json({ success : true, url: filePath, fileDuration: fileDuration});
   })
   .on('error', function (err){  // 에러 발생시 처리
       console.log(err);
       return res.json({success:false, err});
   })
   .screenshots({
       count: 1,  // 3개의 썸네일을 생성
       folder: 'uploads/thumbnails',  // 썸네일 파일 저장 위치
       size: '320x240',
       filename: 'thumbnail-%b.png' // '%b' : 파일 이름
   })
})

module.exports = router;
