import styled from "@emotion/styled"
import { useEffect, useState, useContext } from "react"
import { VscSearch } from 'react-icons/vsc'
import { StockContext } from "../../../context/context"
import { getSuggestStockList, getStockPriceTask } from "../../../utils"
import { SET_SELECTED_STOCK_DETAILS } from "../../../context/constants"

const SearchBar = () => {
    const [state, dispatch] = useContext(StockContext);
    const [showSuggestList, setShowSuggestList] = useState(false);
    const [suggestList, setSuggestList] = useState([]);
    const [emptyFlag, setEmptyFlag]  =useState(false);
    const [code, setCode] = useState(null);
    const handleInputSearch = e => {
        const value = e.target.value;
        setCode(value);
        if (value.length >= 4 && value.length <= 6) {
            getSuggestStockList(value).then(res => {
               const data = res.data;
               setShowSuggestList(true);
               if (!!data.length) {
                    setSuggestList(data.slice(0,10));           
                    setEmptyFlag(false);
               } else {
                    setEmptyFlag(true);                   
               }
            })
        } else {
            setShowSuggestList(false);
        }
    }

    const handleStockOnClick = (e, code, area) => {
        setCode(code);
        setShowSuggestList(false);
        getStockPriceTask(area.toLowerCase()+code).then(res => {   
            dispatch({
                type: SET_SELECTED_STOCK_DETAILS,
                payload: {
                    data: res.result.split('~'),
                    area: area
                }
            })      
        })       
    }



    return <Search>
        <VscSearch size='1.3em' />
        <Input type='text' value={code} onChange={(e) => {handleInputSearch(e)}} placeholder='type to search stock code' />

        <SuggestListBlock show={showSuggestList}>
            <List>
                { 
                   emptyFlag? <NoData>No stock data is found</NoData> :
                                suggestList.map((item, index) => {
                                    return <li onClick={(e) => handleStockOnClick(e, item.ts_code, item.areaEn)} key={index}>
                                                <ListLeft>
                                                        <span>{item.ts_code}</span>
                                                </ListLeft>
                                                <ListRight>
                                                        <span style={{marginRight: '0.5rem'}}>{item.name}</span>
                                                        <span>{item.areaEn}</span>
                                                </ListRight>
                                        
                                    </li>
                                }) 
                }
            </List>
        </SuggestListBlock>
        
    </Search>
}

export default SearchBar

const List = styled.ul`
   padding: 0 0.5rem;
   list-style:none;
   font-size: 1rem;
    & > li {
        padding: 0.5rem;
        display: flex;
        justify-content:space-between;
        list-style:none;  
    }
    & > li:hover {
        background-color: #5151cc;
        cursor: pointer;
    }
`
const ListLeft = styled.div`
    
`
const ListRight = styled.div`
    
`

const SuggestListBlock = styled.div`
    width: 20rem;
    min-height: 5rem;
    position: absolute;
    top: 2.5rem;
    opacity: 0.85;
    background-color: #545458;
    color: #fff;
    border-radius: 0.5rem;
    display: ${props => props.show? 'block':'none'};
    padding: 1rem;
    
`

const Search = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    background-color: #e1e1e1;
    border-radius: 10px;
    padding: 5px;
    margin-bottom: 1.5em;
    width: 40rem;
`
const Input = styled.input`
    background-color: #e1e1e1;
    border: none;
    margin-left: 5px;
    width: 100%;

    &:focus {     
        outline: none;
    }

`

const NoData = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 700;
    font-size: 1rem;
`