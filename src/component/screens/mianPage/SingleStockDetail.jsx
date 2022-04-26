import styled from "@emotion/styled"
import React, { useContext, useEffect } from "react"
import { StockContext } from "../../../context/context"
import { getStockPriceTask } from "../../../utils"
import { SET_SELECTED_STOCK_DETAILS } from "../../../context/constants"

const SingleStockDetail = () => {
    const [state, dispatch] = useContext(StockContext);
    const { name, code, area, price, openPrice, high,low, deal,turnover,closePriceYesterday,changeHands, PE_D, volumn,priceRange, percentageRange } = state.selectedStockDetail;
    useEffect(() => {
        const time = 3 * 1000;
        const interval = setInterval(() => {
            if (!!name) {
                getStockPriceTask(state.selectedStockDetail.area+state.selectedStockDetail.code).then(res => {
                    dispatch({
                        type: SET_SELECTED_STOCK_DETAILS,
                        payload: {
                            data: res.result.split('~'),
                            area: state.selectedStockDetail.area
                        }
                    })
                })
            }        
        },time)
        return () => clearInterval(interval);
    },[state.selectedStockDetail,dispatch,name])

    return <SingleStockContainer>
         <Top>
             <TopName>{name}</TopName>
             <TopCode>{code}</TopCode>
         </Top>
         <Middle priceRange={priceRange}>
             <MiddlePrice>{price}</MiddlePrice>
             <MiddleRange><span>{priceRange} {percentageRange}%</span></MiddleRange>
             <div style={{width: '4rem'}}></div>
         </Middle>
         <Bottom>
             <Item><span>Open</span><ItemValue>{openPrice}</ItemValue></Item>
             <Item><span>High</span><ItemValue>{high}</ItemValue></Item>
             <Item><span>Deal</span><ItemValue>{deal/1000} k</ItemValue></Item>
             <Item><span>Close</span><ItemValue>{closePriceYesterday}</ItemValue></Item>
             <Item><span>Low</span><ItemValue>{low}</ItemValue></Item>
             <Item><span>Turnover</span><ItemValue>{turnover/1000} k</ItemValue></Item>
             <Item><span>changeHands</span><ItemValue>{changeHands}%</ItemValue></Item>
             <Item><span>PE(Dymanic)</span><ItemValue>{PE_D}</ItemValue></Item>
             <Item><span>Volumn</span><ItemValue>{Math.round((volumn/10),2)} BN</ItemValue></Item>
             
         </Bottom>
    </SingleStockContainer>
}

export default SingleStockDetail

const SingleStockContainer  =styled.div`
    margin: 2rem 0 2rem 5rem;
    width: 40rem;
    height: 50rem;
    background-color: #f2f2f2;
    padding: 0.3rem;
    border-radius: 0.4rem;
    /* box-shadow:rgba(0,0,0,0.1) 0 0 10px; */
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    overflow: scroll;
`

const Top = styled.div`
    display: flex;
    flex-direction: column;
    width: 70%;
`
const TopName = styled.div`
    font-weight: 700;
    font-size: 1.5rem;
    text-align: center;
`
const TopCode = styled.div`
    font-weight: 600;
    font-size: 1rem;
    text-align: center;
`
const Bottom  = styled.div`
    font-size: 1rem;
    width: 90%;
    display: grid;
    grid-template-columns: repeat(3, 33.00%);
    grid-template-rows: repeat(3, 33.00%);
    grid-row-gap: 0.3rem;
    grid-column-gap: 1rem;

`
const Middle = styled.div`
    display: flex;
    justify-content: space-between;
    color: ${props => props.priceRange >= 0? 'red':'green'};
    width: 90%;
` 
const MiddlePrice = styled.div`
    font-weight: 800;
    font-size: 2rem;
`
const MiddleRange = styled.div`
   line-height: 3rem;
   font-weight: 600;
   font-size: 1.2rem;
    
`
const Item = styled.div`
    display: flex;
    justify-content: space-between;
`
const ItemValue = styled.span`
    font-weight: 700;
`