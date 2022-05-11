import SearchBar from "./SearchBar"
import PublicInfo from "./PublicInfoArea"
import StockList from "./StockList"
import SingleStockDetail from "./SingleStockDetail"
import styled from "@emotion/styled"

const MainPage = () => {
    return ( 
        <Container>
            <MainPageContainer>
                <SearchBar />
                <PublicInfo />
                <StockList />
                
            </MainPageContainer>
            <SingleStockDetail>

            </SingleStockDetail>
        </Container>
    )
    
}

export default MainPage


const Container = styled.div`
    display: flex;
    padding: 1rem;
    justify-content: flex-start;
`

const MainPageContainer = styled.div`
    margin: 2rem 0 2rem 5rem;
    background-color: #f2f2f2;
    padding: 1rem;
    border-radius: 0.4rem;
    /* box-shadow:rgba(0,0,0,0.1) 0 0 10px; */
    display: flex;
    flex-direction: column;
    overflow: scroll;
    
   
`






