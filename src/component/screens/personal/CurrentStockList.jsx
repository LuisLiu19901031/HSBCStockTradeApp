import styled from "@emotion/styled"
import { Table,Space, Button } from "antd"
import { useNavigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import { StockContext } from "../../../context/context";
import axios from "axios";
import { SERVER_ADDRESS,SET_CURRENT_STOCK_LIST, SET_SELECTED_TABLE_ROW, UPDATE_MYSTOCK_LIST } from "../../../context/constants";
import { useGetStockPrice, getStockPrice, getStockPriceTask } from "../../../utils";
  


const CurrentStockStatus = ({tradeFlag}) => {
    const navigate = useNavigate();
    const [state, dispatch] = useContext(StockContext);
    const [stock, setStock] = useState(null);


        
    let columns = [
        {
            title: 'Stock Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Stock Code',
            dataIndex: 'stockCode',
            key: 'stockCode',
            render:(text, record) => {
                return Number(record.profit_Lost) < 0?
                    <span style={{color: 'green'}}>{text}</span>:
                    <span style={{color: 'green'}}>{text}</span>      
            }
        },
        {
            title: 'Area',
            dataIndex: 'area',
            key: 'area',
            className:"hide",
            render:(text, record) => {
                return Number(record.profit_Lost) < 0?
                    <span style={{color: 'green'}}>{text}</span>:
                    <span style={{color: 'green'}}>{text}</span>      
            }
        },
        {
            title: 'Market Value',
            dataIndex: 'marketValue',
            key: 'marketValue',
            render:(text, record) => {
                return Number(record.profit_Lost) < 0?
                    <span style={{color: 'green'}}>{text}</span>:
                    <span style={{color: 'green'}}>{text}</span>      
            }
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render:(text, record) => {
                return Number(record.profit_Lost) < 0?
                    <span style={{color: 'green'}}>{text}</span>:
                    <span style={{color: 'green'}}>{text}</span>      
            }
        },
        {
            title: 'CurrentPrice/Cost',
            dataIndex: 'currentPrice_Cost',
            key: 'currentPrice_Cost',
            render:(text, record) => {
                return Number(record.profit_Lost) < 0?
                    <span style={{color: 'green'}}>{text}</span>:
                    <span style={{color: 'green'}}>{text}</span>      
            }
        },
        {
            title: 'Profit/Lost',
            dataIndex: 'profit_Lost',
            key: 'profit_Lost',
            render:(text, record) => {
                return Number(record.profit_Lost) < 0?
                    <span style={{color: 'green'}}>{text}</span>:
                    <span style={{color: 'green'}}>{text}</span>      
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                <Button type="primary" onClick={() => navigate('/buyStock',{ state: { stock: record.stockCode, area: record.area, name: record.name }})}>Buy</Button>
                <Button onClick={() => navigate('/sellStock',{ state: { stock: record.stockCode, area: record.area, name: record.name } })}>Sell</Button>
                </Space>
            ),
            },
    ];

    

    useEffect(() => {
        axios.get(SERVER_ADDRESS + "/user/getCurrentStockList",{
            'Access-Control-Allow-Origin': '*',
            params: {
               username: state.user,
            }
         }).then(res => res.data )
           .then(data => {
               return data.map(item => {
                   getStockPrice(item.stockCode, item.area.toLowerCase()).then(res => {
                      item.currentPrice = res[3]; 
                   });
                   return item
               })              
           })
           .then(data => {
               setStock(data)
           })
    },[])  

    useEffect(() => {
        setTimeout(() => {
            dispatch({type: SET_CURRENT_STOCK_LIST, payload: stock})
        },200)   

    },[stock])

    useEffect(() => {
        const time = 5*1000;
        const interval = setInterval(() => {
           let codeList = state.myStockList.reduce((res, val) => {
                return res + val.area.toLowerCase() + val.stockCode + ',' 
           }, "")
           codeList = codeList.substr(0,codeList.length-1);
           getStockPriceTask(codeList).then(res => {
               const priceList = res.result.split(';').map(item => {
                   return {
                             code: item.split('~')[2],
                             currentPrice: item.split('~')[3]
                          }
               })
               priceList.splice(priceList.length - 1)
               dispatch({type: UPDATE_MYSTOCK_LIST, payload: priceList});
               
           });
           
        }, time)

        return () => clearInterval(interval)
    })



    if (tradeFlag) {
        columns.splice(columns.length-1);
    }

    return (
        <StockStatusTable 
            dataSource={state.myStockList} 
            columns={columns}  
            rowKey={record => record.key}
            onRow={record => {
                return {
                  onClick: event => { event.preventDefault(); dispatch({type: SET_SELECTED_TABLE_ROW, payload: record}) }, // 点击行
                //  onDoubleClick: event => {  },
                //   onContextMenu: event => {},
                //   onMouseEnter: event => {}, // 鼠标移入行
                //   onMouseLeave: event => {},
                };
              }}
        />
    )
}

export default CurrentStockStatus

const StockStatusTable = styled(Table)`
    width: 60rem;
    margin-top: 2rem;
    font-weight: 600;
    min-height: 100%;

`