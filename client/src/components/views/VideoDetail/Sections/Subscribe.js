import React, { useEffect, useState } from 'react'
import Axios from 'axios'

function Subscribe(props) {

    const [SubscribeNumber, setSubscribeNumber] = useState(0)  // 구독자 0명으로 시작
    const [Subscribed, setSubscribed] = useState(false)  // false : 구독 안한 상태

    useEffect(() => {
        
        let variable = { userTo: props.userTo }
        Axios.post('/api/subscribe/subscribeNumber', variable)
            .then(response =>{
                if(response.data.success){
                    setSubscribeNumber(response.data.subscribeNumber)
                }else{
                    alert("구독자 수를 가져오지 못하였습니다.")
                }
            })

        // localStorage : 로그인 정보가 Local Stoarage에 담겨 있다. 
        let subscribedVariable = { userTo: props.userTo, userFrom : localStorage.getItem('userId') }
        Axios.post('/api/subscribe/subscribed')
            .then(response => {
                if(response.data.success){
                    console.log(response.data.subscribed)
                    setSubscribed(response.data.subscribed)
                }else{
                    alert("정보를 받아오지 못했습니다.")
                }
            })



    }, [])
    
    const onSubscribe = () => {
     
        let subscribedVariable = {
            userTo : props.userTo,
            userFrom : localStorage.getItem('userId')
        }
        if(Subscribed){
            Axios.post('/api/subscribe/unSubscribe', subscribedVariable)
            .then(response => {
                if(response.data.success){
                    setSubscribeNumber(SubscribeNumber -1)
                    setSubscribed(!Subscribed)
                }else{
                    alert("구독 취소를 실패하였습니다.")
                }
            })
        }else{
            Axios.post('/api/subscribe/subscribe', subscribedVariable)
            .then(response => {
                if(response.data.success){
                    setSubscribeNumber(SubscribeNumber +1)
                    setSubscribed(!Subscribed)
                }else{
                    alert("구독을 실패하였습니다.")
                }
            })
        }
    }

    return (
        <div>
            <button style={{ backgroundColor:`${Subscribed ? '#AAAAAA' : '#CC0000'}`, borderRadius: '4px', color:'white'
                , padding:'10px 16px', fontWeight:'500', fontSize:'1rem', textTransform:'uppercase'}}
                onClick={onSubscribe}
                >
                {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
    )
}

export default Subscribe
