import styled from "@emotion/styled";
import { StockContext } from "../../../context/context";
import React, { useContext, useEffect } from "react";
import { UPDATE_PUBLIC_INDEX } from "../../../context/constants"; 
import { getStockPriceTask, checkIfInTimeSlot } from "../../../utils";


const PublicInfo = () => {
    const [state, dispatch] = useContext(StockContext);
    const time = 3 * 1000;
    useEffect(() => {
        let interval;
     //   if (checkIfInTimeSlot("9:30","11:30") || checkIfInTimeSlot("13:00","15:00")) {
            let codeList = state.stockPublicData.reduce((res, val) => {
                return res + val.area + val.code + ','
             },"")
            codeList = codeList.substr(0, codeList.length - 1)
            interval = setInterval(() => {
                getStockPriceTask(codeList).then(res => {
                    const priceList = res.result.split(';').map(item => {
                        return {
                                code: item.split('~')[2],
                                currentIndex: item.split('~')[3],
                                rangePoints: item.split('~')[31],
                                range: item.split('~')[32]
                            }
                    })
                    priceList.splice(priceList.length - 1)
                    dispatch({type: UPDATE_PUBLIC_INDEX, payload: priceList});
                })
            
      //      return () => clearInterval(interval)
              
           },time)          
      //  }
        return () => clearInterval(interval)
    },[])
    
    return <PublicInfoArea>
        { state.stockPublicData.map((obj, objIdx) => {
             return <Block 
                       key={objIdx}
                       name={obj.name}
                       value={obj.value} 
                       points={obj.points}  
                       range={obj.range}
                    />  
        }) }
    </PublicInfoArea>
}

const Block = React.memo(({key, name, value, points,range}) => {
    return <BlockDiv key={key}>
        <BlockUp>{name}</BlockUp>
        <BlockMiddle>
            <span style={{color: points>0?'red':'green'}}>{value}</span>
        </BlockMiddle>
        <BlockBottom style={{color: points>0?'red':'green'}}>
            <span>{points>0? '+'+points:points}</span>
            <span>[{range}%]</span>
        </BlockBottom>
    </BlockDiv>
})

export default PublicInfo

const PublicInfoArea = styled.div`
    display: flex;
    justify-content: space-between;
    width: 40rem;
`
const BlockDiv = styled.div`
    border-radius: 1rem;
    background-color: white;
    margin: 0.2rem 0.2rem;
    height: 5rem;
    width: 15rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 2px;
`
const BlockUp = styled.div`
    text-align: center;
    font-size: 1rem;
    font-weight: 600;
`
const BlockMiddle = styled.div`
    font-size: 1rem;
    font-weight: 800;
    text-align: center;
`
const BlockBottom = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-around;
    font-weight: 700;
`