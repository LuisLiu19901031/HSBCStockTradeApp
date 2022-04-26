import axios from "axios";
import { createContext,useReducer } from "react";
import * as constants from './constants'


const initialState = {
   user: null,
   balance: 100000,
   stock_list: [],
   selectedTableRow: {},
   positionProfit: 0,
   availableFunds: 0,
   marketValueOfPosition: 0,
   search_stock_detail: {
       currentPrice: 0,
       rate: 0,
       volumn: 0
   },
   myStockList: [],
   defaultStockList:[
        {
            name: '工商银行',
            price: 0,
            range: 0,
            code: '601398',
            area: 'sh'
        },
        {
            name: '贵州茅台',
            price: 0,
            range: 0,
            code: '600519',
            area: 'sh'
        },
        {
            name: '比亚迪',
            price: 0,
            range: 0,
            code: '002594',
            area: 'sz'
        },
        {
            name: '宁德时代',
            price: 0,
            range: 0,
            code: '300750',
            area: 'sz'
        },
        {
            name: '复星医药',
            price: 0,
            range: 0,
            code: '600196',
            area: 'sh'        
        },
        {
            name: '格力电器',
            price: 0,
            range: 0,
            code: '000651',
            area: 'sz'   
        },
        {
            name: '京东方A',
            price: 0,
            range: 0,
            code: '000725',
            area: 'sz'   
        }
   ],
   stockPublicData: [{
        code: '000001',
        area: 'sh',
        name: 'Shanghai Stock Index',
        value: 0,
        points: 0,
        range: 0
    },{
        code: '399001',
        area: 'sz',
        name: 'Shenzhen Stock Index',
        value: 0,
        points: 0,
        range: 0
    },{
        code: '399006',
        area: 'sz',
        name: 'GEM Index',
        value: 0,
        points: 0,
        range: 0
    }],
    selectedStockDetail: {
        name: '工商银行',
        code: 601398,
        area: 'sh',
        price: 0,
        openPrice: 0, // 开市价
        high: 0, // 最高
        low: 0, // 最低
        deal: 0, // 成交
        closePriceYesterday: 0, // 昨收
        changeHands: 0, // 换手
        PE_D: 0, // 市盈
        volumn: 0, // 市值
        priceRange: 0, // 价格变动
        percentageRange: 0, // 百分比变动，
        turnover: 0// 成交量
    }
}


const reducer = (state, action) => {
    switch(action.type) {
        case constants.LOGIN: {
           return {
               ...state,
               user:action.payload.user, 
               balance: action.payload.balance
           }
        }
        case constants.SET_BALANCE: {
          const balance = Number(action.payload.balance);
          return {
            ...state,
            balance
          }
        }
        case constants.LOGOUT: {
            return {
                ...state,
                user:null, 
            }
        }
        case constants.REGISTER: {
            return {
                ...state,
                user:action.payload.user, 
            }
        }
        case constants.SET_CURRENT_STOCK_LIST: {
            
            const myStockList = action.payload?.map(item => {
                return {
                    name: item.stockName,
                    stockCode: item.stockCode,
                    area: item.area,
                    marketValue: Number((parseFloat(item.currentPrice)*item.amount).toFixed(2)),
                    amount: item.amount,
                    currentPrice_Cost: item.currentPrice+'/'+item.cost,
                    profit_Lost: parseFloat((parseFloat(item.currentPrice) - item.cost)*item.amount).toFixed(2),
                    cost: item.cost
                }
            })

            let totalProfitLoss = myStockList?.reduce((res,val) => { return res + Number(val.profit_Lost) },0);
            const balance = state.balance + totalProfitLoss??0;

            const marketValueOfPosition = myStockList?.reduce((res,val) => { return res + Number(val.marketValue) },0);
          
            return {
                ...state,
                myStockList,
                balance: balance,
                positionProfit: myStockList?.reduce((res,val) => { return res + Number(val.profit_Lost) },0),
                availableFunds: balance - marketValueOfPosition,
                marketValueOfPosition: marketValueOfPosition
            }
        }
        case constants.SET_AVAILABLE_FUNDS: {
            return {
                ...state,
                availableFunds: 100000 - state.marketValueOfPosition,
            }
        }
        case constants.UPDATE_MYSTOCK_LIST: {
            const priceList = action.payload;
            const myStockList = state.myStockList.map(item => {
                const selectedObj = priceList.filter(obj => obj.code === item.stockCode)[0];
                return {
                    ...item,                    
                    // name: item.stockName,
                    // stockCode: item.stockCode,
                    // area: item.area,
                    marketValue: Number((item.amount * Number(selectedObj.currentPrice)).toFixed(2)),
                    // amount: item.amount,
                    currentPrice_Cost: selectedObj.currentPrice+'/'+item.cost,
                    profit_Lost: parseFloat((parseFloat(selectedObj.currentPrice) - item.cost)*item.amount).toFixed(2),
                }
            })
            const balance = 100000 + myStockList?.reduce((res,val) => { return res + Number(val.profit_Lost) },0);

            const marketValueOfPosition = myStockList?.reduce((res,val) => { return res + Number(val.marketValue) },0);
            return {
                ...state,
                myStockList,
                balance: balance,
                positionProfit: myStockList?.reduce((res,val) => { return res + Number(val.profit_Lost) },0),
                availableFunds: balance - marketValueOfPosition,
                marketValueOfPosition: marketValueOfPosition
            }
        }
        case constants.UPDATE_DEFAULT_STOCK_LIST: {
            const priceList = action.payload;
            const defaultStockList = state.defaultStockList.map(item => {
                const selectedObj = priceList.filter(_item => _item.code === item.code)[0];
             //   console.log(selectedObj)
                return {
                    ...item,
                   // name: '贵州茅台',
                    price: selectedObj.currentPrice,
                    range: selectedObj.range,
                   // code: '600123',
                   // area: 'sh'
                }
            })

            return {
                ...state,
                defaultStockList
            }
        }
        case constants.UPDATE_PUBLIC_INDEX: {
            const priceList = action.payload;
            const stockPublicData = state.stockPublicData.map(item => {
                const selectedObj = priceList.filter(_item => _item.code === item.code)[0];
             //   console.log(selectedObj)
                return {
                    ...item,
                    value: selectedObj.currentIndex,
                    points: selectedObj.rangePoints,
                    range: selectedObj.range
                }
            })

            return {
                ...state,
                stockPublicData
            }
        }
        case constants.SET_SELECTED_STOCK_DETAILS: {
            console.log(action.payload)
            const dataList = action.payload.data;
            
            const selectedStockDetail = {
                name: dataList[1],
                area: action.payload.area,
                code: dataList[2],
                price: dataList[3],
                openPrice: dataList[5], // 开市价
                high: dataList[33], // 最高
                low: dataList[34], //最低
                deal: dataList[37], // 成交
                closePriceYesterday: dataList[4], // 昨收
                changeHands: dataList[38], // 换手
                PE_D: dataList[51], // 市盈
                volumn: dataList[45], // 市值
                priceRange: dataList[31],
                percentageRange: dataList[32],
                turnover: dataList[36] // 成交量
            }
            return {
                ...state,
                selectedStockDetail
            }
        }
        case constants.SET_SELECTED_TABLE_ROW: {
            const record = action.payload;
            return {
                ...state,
                selectedTableRow: {
                    code: record.stockCode,
                    area: record.area,
                    name: record.name
                }
            }
        }
        default: return state
    }
    
}

export const StockContext = createContext()
export const StockProvider = ({children}) => {
    const value = useReducer(reducer, initialState)
    return <StockContext.Provider value={value}>{children}</StockContext.Provider>
}