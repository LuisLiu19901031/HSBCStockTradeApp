import styled from "@emotion/styled"
import { StockContext } from "../../../context/context"
import { useContext, useEffect } from "react"
import { getStockPriceTask, checkIfInTimeSlot } from "../../../utils"
import { UPDATE_DEFAULT_STOCK_LIST, SET_SELECTED_STOCK_DETAILS } from "../../../context/constants"



const StockList = () => {
   const [state, dispatch] = useContext(StockContext);
   useEffect(() => {
       const time = 3*1000;
       let codeList = state.defaultStockList.reduce((res, val) => {
          return res + val.area + val.code + ','
       },"")
       codeList = codeList.substr(0, codeList.length - 1)
       const interval = setInterval(() => {
           getStockPriceTask(codeList).then(res => {
            const priceList = res.result.split(';').map(item => {
                return {
                          code: item.split('~')[2],
                          currentPrice: item.split('~')[3],
                          range: item.split('~')[32]
                       }
            })
            priceList.splice(priceList.length - 1);
            dispatch({type: UPDATE_DEFAULT_STOCK_LIST, payload: priceList});
        })

           

       },time)
       return () => clearInterval(interval)
   },[])

   const handleStockOnClick = (code, area) => {
        getStockPriceTask(area+code).then(res => {
            dispatch({
                type: SET_SELECTED_STOCK_DETAILS,
                payload: {
                    data: res.result.split('~'),
                    area: area
                }
            })
        })
    }


   return <StockListTable>
       <tbody>
            <tr>
                <th>stock</th>
                <th>price</th>
                <th>range</th>
            </tr>
            {
                state.defaultStockList.map((obj,objIdx) => {
                    return <TrStock key={objIdx} onClick={() => handleStockOnClick(obj.code, obj.area)}>
                        <td>
                            <StockCodeTD>
                                <span>{obj.name}</span>
                                <span>{obj.code}</span>    
                            </StockCodeTD>
                            </td>
                        <td>{obj.price}</td>
                        <td style={{display: 'flex',justifyContent:'center'}}><RangeTag negative={obj.range < 0}><span>{obj.range+'%'}</span></RangeTag></td>
                    </TrStock>
                })
            }
       </tbody>
   </StockListTable>
}
export default StockList

const TrStock = styled.tr`
    text-align: center;
    &:hover {
        background-color: #dfdddd;
        cursor: pointer;
    }

`

const StockListTable = styled.table`
    border: none;
    
    width: 100%;
    background-color: white;
    margin-top: 1.5rem;
    border-radius: 1rem;
    font-size: 1.5rem;
    
    & > tbody > tr:not(:last-child) {
       border-bottom: 1px solid #cec5c5;
       height: 4rem;
       
    }
    & > tbody > tr > td {
        padding: 1rem;
        text-align: center;
        
    }
`
const StockCodeTD = styled.div`
    display: flex;
    flex-direction: column;
    font-size: 1rem;
    font-weight: 700;
`

const RangeTag = styled.div`
    width: 7rem;
    height: 3rem;
    color: white;
    background-color: ${(props) => (props.negative ? "green" : "red")};
    border-radius: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
   
`
