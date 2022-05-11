// import { useLocation } from 'react-router-dom'
import styled from '@emotion/styled';
import axios from 'axios';
import { useState,useContext,useEffect } from 'react';
import { StockContext } from '../../../context/context';
import { Button } from 'antd';
import CurrentStockStatus from '../personal/CurrentStockList';
 import { getStockPrice } from '../../../utils';
 import { SERVER_ADDRESS,RESET_SELL_BUY_STOCK,SET_CURRENT_STOCK_LIST } from '../../../context/constants';


const SellStock = () => {
  //  const location = useLocation();
    const [stockState, dispatch] = useContext(StockContext);
  //  const { state } = location;

    const [stockName, setStockName] = useState('No stock detected');
    const [code, setCode] = useState('');
    const [maxAvailable, setMaxAvailable] = useState(0);
    const [price, setPrice] = useState(null);
    const [amount, setAmount] = useState(100);
  //  const [yesterdayPrice, setYesterdayPrice] = useState(null);
    const [limit, setLimit] = useState([]);
    const [stockData, setStockData] = useState([]);


    useEffect(() => { // 个人持股列表点击触发
        if (stockState.selectedTableRow.code) {
            setCode(() => stockState.selectedTableRow.code);
            setStockName(() => stockState.selectedTableRow.name+' '+stockState.selectedTableRow.area);
                   
                getStockPrice(stockState.selectedTableRow.code, stockState.selectedTableRow.area.toLowerCase()).then(res => {
                    setPrice(res[3]);
                //    setYesterdayPrice(res[4]);
                    setLimit([Number((res[4]*0.9).toFixed(2)), Number((res[4]*1.1).toFixed(2))]);
                    const maxAvailable = stockState.myStockList.filter(item => item.stockCode === stockState.selectedTableRow.code)[0].amount;
                    setMaxAvailable(maxAvailable);
                    setAmount(100);
                })      
        }
    },[stockState.selectedTableRow,stockState.myStockList])


    const handleInputPrice = (e) => {
        let value = e.target.value;
        setPrice(value)
    }
    const handleInputPriceBlur = () => {
        setPrice(price => { 
            if (price<limit[0])
                return limit[0]; 
            if(price>limit[1])
                return limit[1]; 
            return price  
        })
    }

    const handleInputAmount = (e) => {
        const value = e.target.value;
        let inputAmount = value < 0? 100 : value 
        inputAmount = inputAmount > maxAvailable? maxAvailable : inputAmount;
      //  if (inputAmount > 100) inputAmount = inputAmount - inputAmount%100;
        setAmount(inputAmount);
    }

    const reset = () => {
        dispatch({type: RESET_SELL_BUY_STOCK });
        setCode(null);
        setPrice(null);
        setAmount(100);
    }

    useEffect(() => {
        setTimeout(() => {
            dispatch({type: SET_CURRENT_STOCK_LIST, payload: stockData})
        },200)   

    },[stockData, dispatch])

    const handleSell = () => {
        const myStockList = stockState.myStockList;
        console.log(myStockList)
        const selectedStock = myStockList.filter(item => item.stockCode === code)[0];
        const profit_Loss = amount * (price - selectedStock.cost);
        if (amount === selectedStock.amount) { // 全部卖出一只股票
            
            axios.get(SERVER_ADDRESS + '/user/sellStockWhole',{
                'Access-Control-Allow-Origin': '*',
                params: {
                   profit_Loss: Math.round(profit_Loss),
                   code: code,
                   user: stockState.user
                }
            }).then(res => {
                reset();
                return res.data
            }).then(data => {
              return data.map(item => {
                  getStockPrice(item.stockCode, item.area.toLowerCase()).then(res => {
                     item.currentPrice = res[3]; 
                  });
                  return item
              })              
            }).then(data => {
                setStockData(data)
            })

        } else { // 卖出一只股票的一部分
            axios.get(SERVER_ADDRESS + '/user/sellStockPart',{
                'Access-Control-Allow-Origin': '*',
                params: {
                   profit_Loss: Math.round(profit_Loss),
                   code: code,
                   user: stockState.user,
                   remainAmount: selectedStock.amount - amount
                }
            }).then(res => {
                reset();
                return res.data
            })
            // .then(data => {
            //   return data.map(item => {
            //       getStockPrice(item.stockCode, item.area.toLowerCase()).then(res => {
            //          item.currentPrice = res[3]; 
            //       });
            //       return item
            //   })              
            // }).then(data => {
            //     setStockData(data)
            // })
        } 
    }

    return (
            <SellStockContainer>
            <SellStockTitle>Sell Stock</SellStockTitle>
            <Row>
                    <span>Stock Code</span>
                    <Input type='text' readOnly={true} value={code} />             
            </Row>   
            <Detail>
                <div></div>  
                <div>{ stockName }</div>     
            </Detail>
            <Row>
                    <span>Price</span>
                    <Input type='text' value={price} onBlur={() => handleInputPriceBlur()} onChange={(e) => handleInputPrice(e)} placeholder='transaction price' />                      
            </Row>
            <Detail>
                <div>High limit: <span style={{color:'red', fontWeight:'700'}}>{limit[1]}</span></div>
                <div>Low limit: <span style={{color:'green', fontWeight:'700'}}>{limit[0]}</span></div>
            </Detail>
            <Row>
                    <span>Amount</span>
                    <Input type='text' value={amount}  onBlur={() => setAmount(amount => amount<100? 100: amount - amount%100)} onChange={(e) => handleInputAmount(e)} placeholder='transaction amount' />                   
            </Row>
            <Detail>
                <div>Available <b>{maxAvailable}</b></div>
            </Detail>
            <LongButton onClick={() => handleSell()}>Sell</LongButton>
            <CurrentStockStatus tradeFlag={true} />
        </SellStockContainer>
    )

}

export default SellStock



const SellStockContainer = styled.div`
    margin: 2rem 0 2rem 5rem;
    /* height: 50rem; */
    width: 70rem;
    /* box-shadow:rgba(0,0,0,0.1) 0 0 10px; */
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-items: flex-start;
`
const SellStockTitle = styled.h1`
    font-weight: 700;
    margin-top: 2rem;
    
`

const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: #e1e1e1;
    border-radius: 5px;
    padding: 5px;
    margin-bottom: 0.5em;
    width: 27rem;
    font-size: 1.5rem;
   
`

const Input = styled.input`
    border: none; 
    margin-left: 5px;
    width: 16rem;
    &:focus {     
        outline: none;
    }
`
const Detail = styled.div`
    width: 27rem;
    display: flex;
    justify-content: space-between;
    font-size: 1rem;
    margin-top: -0.9rem;
    margin-bottom: 0.5rem;
`

export const LongButton = styled(Button)`
    width:27rem;
    background-color: #276a3b;
    color: white;
    font-weight: 800;
    &:hover {     
        background-color: #17572a;
        color: white;
        outline: none;
    }
`
