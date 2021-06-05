import styled from 'styled-components'
import {Button} from './Button'

const Title = styled.h1`
    margin-top: 4em;
    font-size: 48px;
`;

const Points = styled.p`
    font-size: 24px;
    margin-bottom: 3em;
`;

const GameOver = ({pts}) => {

    const refreshPage = () => window.location.reload();

    return (
        <>
            <Title>Trò chơi kết thúc</Title>
            <Points>Bạn đã đúng {pts} trên 5 câu!</Points>
            <Button onClick={refreshPage}>Thử lại</Button>
        </>
    )
}

export default GameOver
