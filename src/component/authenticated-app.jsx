import { BrowserRouter as Router,Route,Routes,Link, useNavigate } from "react-router-dom";
import { ButtonNoPadding, Row } from "./lib";
import { Button, Dropdown, Menu } from "antd"
import styled from "@emotion/styled";
import { useAuth, useDocumentTitle } from "../utils/index";

import PersonalPage from "./screens/personal";
import BuyStock from "./screens/trade/Buy";
import SellStock from "./screens/trade/Sell";
import MainPage from "./screens/mianPage";

import { useContext, useEffect } from "react";
import { StockContext } from "../context/context";
import { LOGOUT, SET_BALANCE } from "../context/constants";

const AuthenticatedApp = () => {
    useDocumentTitle('HSBC Stock Trade');
    return (
        <Router>
            <Container>  
                <PageHeader />   
                <Main>
                    <Routes>
                        <Route path='/' exact element={<MainPage />}></Route>
                        <Route path='/personal' exact element={<PersonalPage />}></Route>
                        <Route path='/buyStock' exact element={<BuyStock />}></Route>
                        <Route path='/sellStock' exact element={<SellStock />}></Route>
                    </Routes>                     
                </Main>     
            </Container> 
        </Router>     
    )
}

export default AuthenticatedApp

const PageHeader = () => {
    const navigate = useNavigate()
    return <Header between={true}>
      <HeaderLeft gap={true}>

        <ButtonNoPadding type={"link"} onClick={() => navigate('/')} sty>
            <Logo><img src='HSBClogo.webp' width={'220px'} height={'100px'} color={'rgb(38, 132, 255)'} alt=''/></Logo>   
        </ButtonNoPadding>
        {/* <ProjectPopover /> */}
      
     
        <Link to='/'>Main Page</Link>
        <Link to='/personal'>Personal</Link>
        <Link to='/buyStock'>Buy</Link>
        <Link to='/sellStock'>Sell</Link>
                 
      </HeaderLeft>
      <HeaderRight>
         <User />
      </HeaderRight>
    </Header>
  }


const User = () => {
    const user = useAuth();
    const [state, dispatch] = useContext(StockContext);
    

    const handleLogout = (e) => {
        e.preventDefault();
        dispatch({type: LOGOUT});
    }

    return (
      <Dropdown overlay={
            <Menu style={{marginTop: '10px', fontSize: '3rem'}}>
              <Menu.Item key={'logout'}>
                  <Button type={"link"} onClick={(e) => handleLogout(e)}>Log out</Button>                       
              </Menu.Item>
            </Menu>}>
            <Button style={{fontSize: '1.5rem', marginTop: "-0.5rem"}} type={"link"} onClick={e => e.preventDefault()}>
                Hi,{user}
            </Button>
    </Dropdown>  
    )
}

const Logo = styled.div`
   margin-top: -33px;
`

const Container = styled.div`
  display: grid;
  grid-template-rows: 6rem 1fr;
  height: 100vh;
`;

const Header = styled(Row)`
  
  padding: 1.2rem;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  z-index: 1;

`;
const HeaderLeft = styled(Row)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
`;
const HeaderRight = styled.div`
   
`;
const Main = styled.main`
  display: flex;
  overflow: hidden;
`;
