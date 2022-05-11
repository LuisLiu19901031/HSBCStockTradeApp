// import { useLocation } from 'react-router-dom'
import styled from '@emotion/styled';
import { useState, useContext, useEffect } from 'react';
import { Button } from 'antd';
import CurrentStockStatus from '../personal/CurrentStockList';
import { StockContext } from '../../../context/context';
import axios from 'axios';
import { SERVER_ADDRESS,RESET_SELL_BUY_STOCK,SET_CURRENT_STOCK_LIST } from '../../../context/constants';
import { getStockPrice } from '../../../utils';


const BuyStock = () => {
  //  const location = useLocation();
    const [stockState, dispatch] = useContext(StockContext);
    const [codeExistError, setCodeExistError] = useState(false);
    const [stockName, setStockName] = useState('No stock detected');
    const [code, setCode] = useState("");
    const [maxAvailable, setMaxAvailable] = useState(0)
    const [price, setPrice] = useState("");
    const [amount, setAmount] = useState(100);
    const [limit, setLimit] = useState([]);

    const [stockData, setStockData] = useState([]);
     
    useEffect(() => {
        if (stockState.selectedTableRow.code) {
            setCode(() => stockState.selectedTableRow.code);
            setStockName(() => stockState.selectedTableRow.name+' '+stockState.selectedTableRow.area);

            setCodeExistError(false);
                   
                getStockPrice(stockState.selectedTableRow.code, stockState.selectedTableRow.area.toLowerCase()).then(res => {
                    setPrice(res[3]);
                //    setYesterdayPrice(res[4]);
                    setLimit([res[4]*0.9, res[4]*1.1])
                    const maxAvailable = Math.floor(stockState.availableFunds/res[3]);
                    setMaxAvailable(maxAvailable - maxAvailable%100)
                })
            
        }
        

    },[stockState.availableFunds, stockState.selectedTableRow])

    const handleStockCodeInput = (e) => {
        const value = e.target.value;
        const length = value.length;
        setCode(() => value);
       
        if (length < 6) {
            setCodeExistError(false);
            setStockName("No stock detected");
            setPrice(0);
            setMaxAvailable(0);
        }
        if (length === 6) {
            axios.get(SERVER_ADDRESS + '/user/searchCode',{
                'Access-Control-Allow-Origin': '*',
                params: {
                   code: value
                }
            }).then(res => {
                if (res.data === "") {
                    setCodeExistError(true);
                    setStockName("No stock detected");
                    setMaxAvailable(0);
                    setPrice(0);
                } else {
                    setCodeExistError(false);
                    setStockName(res.data.name + ' ' + res.data.areaEn);
                    getStockPrice(value, res.data.areaEn.toLowerCase()).then(res => {
                        setPrice(res[3]);
                    //    setYesterdayPrice(res[4]);
                        setLimit([res[4]*0.9, res[4]*1.1])
                        const maxAvailable = Math.floor(stockState.availableFunds/res[3]);
                        setMaxAvailable(maxAvailable - maxAvailable%100)
                    })
                }
            })
        }
        if (length > 6) {
           setCodeExistError(true);
           setStockName("No stock detected");
           setPrice(0);
           setMaxAvailable(0);
        }
    }

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
        const maxAvailable = Math.floor(stockState.availableFunds/price);
        setMaxAvailable(maxAvailable - maxAvailable%100)
    }

    const handleInputAmount = (e) => {
        const value = e.target.value;
        let inputAmount = value < 0? 100 : value 
        inputAmount = inputAmount > maxAvailable? maxAvailable : inputAmount;
      //  if (inputAmount > 100) inputAmount = inputAmount - inputAmount%100;
        setAmount(inputAmount);
    }

    useEffect(() => {
        setTimeout(() => {
            dispatch({type: SET_CURRENT_STOCK_LIST, payload: stockData})
        },200)   

    },[stockData,dispatch])


    const handleBuy = () => {
        const checkSameStockRecord = stockState.myStockList.filter(item => item.stockCode === code);
        if (!checkSameStockRecord.length) { // 本来就没有的，插入
            axios.get(SERVER_ADDRESS + '/user/buyStock',{
                'Access-Control-Allow-Origin': '*',
                params: {
                   code: code,
                   amount: amount,
                   name: stockName.split(' ')[0],
                   area: stockName.split(' ')[1],
                   cost: price,
                   user: stockState.user
                }
            }).then(res => {
                reset();
                return res.data;
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




        } else { // 本来就有的，合并
            const oldRecord = checkSameStockRecord[0];
            const newAmount =oldRecord.amount + amount;
            const newCost = (oldRecord.amount * oldRecord.cost + amount * Number(price)) / newAmount;
            console.log(newAmount, newCost)
            axios.get(SERVER_ADDRESS + '/user/mergeStock',{
                'Access-Control-Allow-Origin': '*',
                params: {
                   code: code,
                   amount: newAmount,
                   name: stockName.split(' ')[0],
                   area: stockName.split(' ')[1],
                   cost: newCost,
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

        }
        
    }

    const reset = () => {
        dispatch({type: RESET_SELL_BUY_STOCK});
        setCode(null);
        setPrice(null);
        setAmount(100);

    }



    return (
            <BuyStockContainer>
            <BuyStockTitle>Buy Stock</BuyStockTitle>
            <Row>
                    <span>Stock Code</span>
                    <Input type='text' value={code} onChange={(e) => handleStockCodeInput(e)} placeholder='type to search' />             
            </Row>  
            <Detail>
                <div>{ codeExistError && <span style={{color: 'red'}}>Code does not exists!</span> }</div>  
                <div>{ stockName }</div> 
            </Detail>      
            <Row>
                    <span>Price</span>
                    <Input type='number' value={price} onBlur={() => handleInputPriceBlur()} onChange={(e) => handleInputPrice(e)} placeholder='transaction price' />                      
            </Row>
            <Detail>
                <div>High limit: <span style={{color:'red', fontWeight:'700'}}>{Number(limit[1]).toFixed(2)}</span></div>
                <div>Low limit: <span style={{color:'green', fontWeight:'700'}}>{Number(limit[0]).toFixed(2)}</span></div>
            </Detail>
            <Row>
                    <span>Amount</span>
                    <Input type='number' value={amount} onBlur={() => setAmount(amount => amount<100? 100: amount - amount%100)} onChange={(e) => handleInputAmount(e)} placeholder='transaction amount' />                   
            </Row>
            <Detail>
                <div>Available <b>{maxAvailable}</b></div>
            </Detail>
            <LongButton disabled={codeExistError || code.length !== 6} onClick={() => handleBuy()}>Buy</LongButton>
            {/* <SubmitError>error</SubmitError> */}
            <CurrentStockStatus tradeFlag={true} />
        </BuyStockContainer>
    )

}

export default BuyStock

const BuyStockContainer = styled.div`
    margin: 2rem 0 2rem 5rem;
    /* height: 50rem; */
    width: 70rem;
    /* box-shadow:rgba(0,0,0,0.1) 0 0 10px; */
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-items: flex-start;
`
const BuyStockTitle = styled.h1`
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
    background-color: #c32b2b;
    color: white;
    font-weight: 800;
    &:hover {     
        background-color: #b31919;
        color: white;
        outline: none;
    }
`
