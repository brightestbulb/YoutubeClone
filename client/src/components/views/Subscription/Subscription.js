import React, {useEffect, useState} from 'react'
import { Card, Icon, Avatar, Col, Typography, Row } from 'antd';
import moment from 'moment';
import Axios from 'axios';
const { Title } = Typography;
const { Meta } = Card;

function Subscription() {

    const [Video, setVideo] = useState([])
    
    useEffect(() => {  // 페이지가 로드 되자마자 처리
        Axios.get('/api/video/getVideos')
        .then(response => {
            if(response.data.success){
                console.log(response.data)
                setVideo(response.data.videos)
            }else{
                alert('비디오 가져오기를 실패하였습니다.')
            }
        })
    }, [])  // [input] 이 없다면 계속 처리, [] 면 한번만 처리


    const renderCards = Video.map((video, index)=>{

        // video.duration는 전체 시간 초로 구성
        var minutes = Math.floor(video.duration/60);
        var seconds = Math.floor(video.duration - minutes * 60);

        return <Col lg={6} md={8} xs={24}>  {/* 화면 전체는 24 사이즈, lg:4개, md:3개, xs:1개 */}
            <div key={index} style={{ position:'relative'}}>
                <a href={`/video/${video._id}`} >
                    <img style={{ width: '100%' }} src={`http://localhost:5000/${video.thumbnail}`} alt="thumbnail"/>
                    <div className="duration">
                        <span>{minutes} : {seconds}</span>
                    </div>
                </a>
            </div>
        <br />
        <Meta 
            avatar={<Avatar src={video.writer.image} />}        
            title={video.title}
        />
        <span>{video.writer.name}</span><br />
        <span style={{ marginLeft: '3rem' }}>{video.views} views<span> - </span>{moment(video.createdAt).format("MMM Do YY")}</span>
        </Col>
    })

    return (
        <div style={{ width : '85%', margin: '3rem auto' }}>
            <Title level={2}> Recommand </Title>
            <hr/ >
            <Row gutter={[32, 16]}>
            
                {renderCards}
                
            </Row>
        </div>
    )
}

export default Subscription
