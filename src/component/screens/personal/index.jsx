import Balance from "./Balance"
import styled from "@emotion/styled"
import CurrentStockStatus from "./CurrentStockList"

const PersonalPage = () => {
    return (
        <Container>
            <Balance />
            <CurrentStockStatus />
        </Container>
    ) 
}

export default PersonalPage

const Container = styled.div`
    margin-top: 2rem;
    margin-left: 5rem;

`