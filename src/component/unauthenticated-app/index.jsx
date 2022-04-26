import React, { useState } from "react";
import { LoginScreen } from "./login"
import { RegisterScreen } from "./register"
import styled from "@emotion/styled";
import bgImage from '../../assets/loginBG.webp'
import { Button, Card, Divider, Typography } from 'antd'
import { useDocumentTitle } from "../../utils";

const UnauthenticatedApp = () => {
    const [isRegister, setIsRegister] = useState(false)
    const [error, setError] = useState(null);

    useDocumentTitle('Please sign in or register to continue');

    return <Background>
             <Container>
                    <ShadowCard>
                    <Title>
                        {isRegister? 'Please Register': 'Please Sign In'}
                    </Title>
                    {(error && !isRegister && error.message !== 'Please confirm that the two passwords are the same')? <Typography.Text type={"danger"}>{error.message}</Typography.Text>: null}
                    {(error && isRegister && error.message === 'Please confirm that the two passwords are the same')? <Typography.Text type={"danger"}>{error.message}</Typography.Text>: null}
                    {
                        isRegister? <RegisterScreen onError={setError} />:<LoginScreen  onError={setError} />
                    }
                    <Divider />
                    <Button type={"link"} onClick={() => setIsRegister(!isRegister)}>{isRegister? 'Already have an account? Direct Login': 'No account? Register a new account'}</Button>
                </ShadowCard>    
             
            </Container>        
    </Background>
           
    
   
   
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    
`
const Background = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: left bottom, right bottom;
    background-size:cover;
    background-image: url(${bgImage});
`
const ShadowCard = styled(Card)`
   width: 25rem;
   min-height:36rem;
   padding:3.2rem;
   border-radius:0.8rem;
   box-sizing:border-box;
   box-shadow:rgba(0,0,0,0.1) 0 0 10px;
   text-align:center;
`
const Title = styled.h2`
    margin-bottom: 2.4rem;
    color: rgb(94, 108, 132)
`
export const LongButton = styled(Button)`
    width:100%;
`



export default UnauthenticatedApp