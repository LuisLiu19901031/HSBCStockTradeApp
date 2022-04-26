import { useContext, useEffect, useState } from "react";
import { StockContext } from "../../../context/context";
import styled from "@emotion/styled";
import { SET_AVAILABLE_FUNDS } from "../../../context/constants";

const Balance = () => {
    const [state, dispatch]  = useContext(StockContext);

    return (
        <BalanceContainer>
            <Top>
                <TopLeft>
                    <h2>Total Assets</h2>
                    <h1 style={{fontWeight: '700'}}>¥ {state.balance + state.positionProfit}</h1>
                </TopLeft>
                <TopRight>
                    <h2>Today's Profit and Loss</h2>
                    <h1 style={{float:'right', fontWeight: '700'}} id="balance">0.00</h1>
                </TopRight>
            </Top>
            <Bottom>
                <BottomLeft>
                  <h3>Market Value of Position</h3>
                  <h3 style={{fontWeight: '700'}}>{state.marketValueOfPosition}</h3>
                </BottomLeft>
                <BottomMiddle>
                  <h3>Position Profit and Loss</h3>
                  <h3 style={{fontWeight: '700', color: state.positionProfit > 0? 'red':'green'}}>{state.positionProfit}</h3>
                </BottomMiddle>
                <BottomRight>
                  <h3>Available Funds</h3>
                  <h3 style={{fontWeight: '700'}}>{state.availableFunds}</h3>
                </BottomRight>
            </Bottom>
            
        </BalanceContainer>
    )
 }
 
 export default Balance

 const BalanceContainer = styled.div`
     background-color: #dfd8a3;
     background-image: linear-gradient(180deg, #dfd8a3, #efeac2);
     height: 15rem;
     width: 60rem;
     padding: 2rem;
     border-radius: 10px;
     display: flex;
     flex-direction: column;
     justify-content: space-between;


 `
 const Top = styled.div`
     display: flex;
     justify-content: space-between;
 `

 const TopLeft = styled.div`
     
 `
 const TopRight = styled.div`
     
  `

  const Bottom = styled.div`
      display: flex;
      justify-content: space-between;
  `

  const BottomLeft = styled.div`
      
  `

  const BottomRight = styled.div`
        
  `
  const BottomMiddle = styled.div`
        
  `

