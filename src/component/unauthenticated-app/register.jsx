import React, { useContext, useState } from "react";
import {Form,Input} from 'antd'
import { LongButton } from './index'
import axios from "axios";
import { REGISTER, SERVER_ADDRESS } from "../../context/constants";
import { StockContext } from "../../context/context";
// import { cleanObject, useMount, useDebounce, useThrotte } from '../../utils' 

// 鸭子类型，面向接口编程，而不是面向对象编程


export const RegisterScreen = () => {
    const [state, dispatch] = useContext(StockContext);
    const [exist, setExist] = useState(false)
    const handleSubmit = async (formData) => {
        const existRecord = await axios.get(SERVER_ADDRESS + "/user/find",{
            'Access-Control-Allow-Origin': '*',
            params: {
               username: formData.username,
               password: formData.password
            }
        })
        if (existRecord.data === "") {
            axios.get(SERVER_ADDRESS + "/user/register",{
                'Access-Control-Allow-Origin': '*',
                params: {
                   username: formData.username,
                   password: formData.password
                }
             }).then(res =>{
                console.log(res.data)
                if (res.data === "success") {
                    dispatch({type:REGISTER, payload: {user: formData.username} })
                } else {
                    
                }
            })
        } else {
           setExist(true)
        }
    }

    return <Form onFinish={handleSubmit}>
        <Form.Item name={'username'} rules={[{required:true, message: 'Please enter user name'}]}>
           
            <Input placeholder="user name" type="text" id={"username"} />
        </Form.Item>
        <Form.Item name={'password'} rules={[{required:true, message: 'Please enter passowrd'}]}>
           
            <Input placeholder="password" type="password" id={'password'} />
        </Form.Item>
        <Form.Item name={'cpassword'} rules={[{required:true, message: 'Please confirm password'}]}>
           
            <Input placeholder="confirm password" type="password" id={'cpassword'} />
        </Form.Item>
        <Form.Item>
            <LongButton htmlType={'submit'} type={"primary"}>Register</LongButton>
        </Form.Item>
        { exist && <span style={{color: 'red'}}>User name already exist!</span> }
    </Form>
}
