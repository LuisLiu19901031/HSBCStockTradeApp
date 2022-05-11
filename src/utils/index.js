import { useState, useContext, useEffect, useRef } from "react"
import { StockContext } from "../context/context";
import { SERVER_ADDRESS } from "../context/constants";
import axios from "axios";

export const useAuth = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [state, dispatch] = useContext(StockContext);
    const { user } = state;
    useEffect(() => {
       setCurrentUser(user)
    },[user])
    return currentUser
}

export const useDocumentTitle = (title, keepOnUnmount = true) => {
    const oldTitle = useRef(document.title).current // 相当于一个容器
    // const oldTitle = document.title;
    // 页面加载时， oldTitle = 旧title React App
    // 加载后 oldTitle = 新title


    useEffect(() => {
       document.title = title
    }, [title])

    useEffect(() => {
        return () => {
           if (!keepOnUnmount) {
               // 如果不指定依赖，读到的就是旧title
              document.title = oldTitle;
           }
        }
    },[keepOnUnmount, oldTitle])
}

export const useAxios = (url,method,params) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true)
    useEffect(() => {
         if (!url) return;
         axios({
               'Access-Control-Allow-Origin': '*',
                method: method,//指定请求方式
                url: url,//请求接口（相对接口，后面会介绍到）
                params: params
            }) 
            .then(data => {
                console.log(data)
                setData(data);
            }).catch(reason => {
                setError(reason.toString());
            }).finally(
                setLoading(false)
            )
         return [data, error, loading]
    },[url])
}

export const useGetStockPrice = (code, area) => {
    const [data, setData] = useState(null);
    useEffect(() => {
        axios.get(SERVER_ADDRESS + "/stockPrice",{
            'Access-Control-Allow-Origin': '*',
            params: {
                code: code,
                area: area
            }
        }).then(res => {
            setData(res.data.content.split('~')[3])
        })
    },[code, area])
    return data
}

export async function getStockPrice(code, area) {
    const result = await axios.get(SERVER_ADDRESS + "/stockPrice",{
        'Access-Control-Allow-Origin': '*',
        params: {
            code: code,
            area: area
        }
    }).then(res => res.data.content.split('~'))
    return result
}

export async function getStockPriceTask(codeList) {
    const result = await axios.get(SERVER_ADDRESS + "/stockPriceTask",{
        'Access-Control-Allow-Origin': '*',
        params: {
            codeList: codeList
        }
    }).then(res => res.data.content)
    return {
        result       
    }
}

export async function getSuggestStockList(code) {
    const result = await axios.get(SERVER_ADDRESS + "/user/suggestStockList",{
        'Access-Control-Allow-Origin': '*',
        params: {
            code: code
        }
    })
    return result       
}

// export function areEqual(prevProps, nextProps) {
//     if(prevProps.seconds===nextProps.seconds){
//         return true
//     }else {
//         return false
//     }

// }

export function checkIfInTimeSlot(beginTime, endTime) {
    let nowDate = new Date();
    let beginDate = new Date(nowDate);
    let endDate = new Date(nowDate);
    
    let beginIndex = beginTime.lastIndexOf("\:");
    let beginHour = beginTime.substring(0, beginIndex);
    let beginMinue = beginTime.substring(beginIndex + 1, beginTime.length);
    beginDate.setHours(beginHour, beginMinue, 0, 0);
    
    let endIndex = endTime.lastIndexOf("\:");
    let endHour = endTime.substring(0, endIndex);
    let endMinue = endTime.substring(endIndex + 1, endTime.length);
    endDate.setHours(endHour, endMinue, 0, 0);
    return nowDate.getTime() - beginDate.getTime() >= 0 && nowDate.getTime() <= endDate.getTime();
}

export function useFetch(url) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true)
    useEffect(() => {
         if (!url) return;
         fetch(url)
         .then(data => data.json())
         .then(data => {
             setData(data);
         }).catch(reason => {
             setError(reason.toString());
         }).finally(
             setLoading(false)
         )
    },[url])
     return [data, error, loading]
 }
