import { useContext, useState } from 'react'
import { Form,Input } from 'antd'
import { LongButton } from './index'
import axios from 'axios'
import { StockContext } from '../../context/context'
import { LOGIN, SERVER_ADDRESS, SET_BALANCE } from '../../context/constants'

export const LoginScreen = () => {
    const [state, dispatch] = useContext(StockContext);
    const [loginFail, setLoginFail] = useState(false)
    const handleSubmit = (formData) => {
        axios.get(SERVER_ADDRESS + "/user/login",{
            'Access-Control-Allow-Origin': '*',
            params: {
               username: formData.username,
               password: formData.password
            }
         }).then(res =>{
             console.log(res)
            if (res.data!=="") {
                dispatch({type:LOGIN, payload: {user: formData.username, balance: res.data.balance} })
            } else {
                setLoginFail(true);
            }
        })

        // axios.get(SERVER_ADDRESS + "/user/getBalance",{
        //     'Access-Control-Allow-Origin': '*',
        //     params: {
        //        user: formData.username,
        //     }
        //  }).then(res =>{
        //      dispatch({ type: SET_BALANCE, payload: { balance: res.data.balance } })
        // })
        
        
    }


    return <Form onFinish={handleSubmit}>
        <Form.Item name={'username'} rules={[{required:true, message: 'Please enter user name'}]}>
           
            <Input placeholder="user name" type="text" id={"username"} />
        </Form.Item>
        <Form.Item name={'password'} rules={[{required:true, message: 'Please enter password'}]}>
           
            <Input placeholder="password" type="password" id={'password'} />
        </Form.Item>
        <Form.Item>
            <LongButton loading={false} htmlType={'submit'} type={"primary"}>Login</LongButton>
        </Form.Item>
       { loginFail && <span style={{color: 'red'}}>Username or password incorrect!</span> }
    </Form>
}