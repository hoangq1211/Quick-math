import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import GameOver from './GameOver';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

const QuizWindow = styled.div`
    text-align: center;
    font-size: clamp(20px, 2.5vw, 24px);
    margin-top: 10vh;
`;

const Options = styled.div`
    display: flex;
    flex-direction: column;
    width: 70%;
    margin: 2em auto;

    @media screen and (min-width: 1180px) {
        width: 50%;
    }
`;

const Option = styled.button`
    display: block;
    border: 1px solid #616A94;
    border-radius: 15px;
    padding: 15px 30px;
    text-decoration: none;
    color: #616A94;
    background-color: #161A31;
    transition: 0.3s;
    font-size: 1em;
    outline: none;
    user-select: none;
    margin-top: 1em;
    cursor: default;
`;

const Question = styled.div`
    width: 70%;
    margin: 0 auto;
`;

const Button = styled.button`
    margin: auto;
    display: inline-block;
    border: 1px solid #616A94;
    border-radius: 15px;
    padding: 15px 30px;
    text-decoration: none;
    color: #616A94;
    background-color: #161A31;
    transition: 0.3s;
    font-size: 1em;
    outline: none;
    user-select: none;
    margin-top: 2em;
    cursor: default;

    @media screen and (min-width: 350px) {
        &:hover {
            color: white;
            background-color: #616A94;
        }
    }
`;

const renderTime = ({ remainingTime }) => {
  if (remainingTime === 0) {
    return <div className="timer">Time up!!!</div>;
  }

  return (
    <div className="timer">
      <div className="value">{remainingTime}</div>
    </div>
  );
};

const Quiz = () => {
    const { transcript, resetTranscript } = useSpeechRecognition();
    const mounted = useRef();
    const [quiz, setQuiz] = useState([]);
    const [number, setNumber] = useState(0);
    const [pts, setPts] = useState(0);
    const [key, setKey] = useState(0);
    const [timeUp, setTimeUp] = useState(false);
    
    const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

    const quiz1 = [
        {
            question: "2 + 2 = ?",
            correct_answer: "4",
            options: shuffle(["1", "2", "3","4"]),
        },
         {
            question: "2 x 2 + 2 x 4 = ?",
            correct_answer: "12",
            options: shuffle(["8", "10", "12","14"]),
        },
         {
            question: "33 + 77 = ?",
            correct_answer: "110",
            options: shuffle(["100", "1100", "110","1010"]),
        },
        {
            question: "1 Tỷ có bao nhiêu chữ số 0?",
            correct_answer: "9",
            options: shuffle(["9", "10", "100","1000000000"]),
        },
        {
            question: "1hm = ...m ?",
            correct_answer: "100",
            options: shuffle(["1000", "100", "10","10000"]),
        },
    ]


    useEffect(() => {
        if (!mounted.current) {
            setQuiz(quiz1);
            SpeechRecognition.startListening();
            setTimeUp(false);
            setTimeout(() => {
                setTimeUp(true);
            }, 9000);
            mounted.current = true;
        } else {
            SpeechRecognition.startListening();
            setTimeUp(false);
            setTimeout(() => {
                setTimeUp(true);
            }, 9000);
        }
    }, [number]);

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return null
    }

    const submitAnswer = () => {
        resetTranscript();
        if (quiz[number].correct_answer === transcript) setPts(pts + 1);
        setKey(prevKey => prevKey + 1)
        setNumber(number + 1);
        setTimeout(() => {
                setTimeUp(true);
        }, 9000);
    }

    return (
        <QuizWindow>
            { quiz[number] &&
                <>
                 <div style={{ marginLeft: "865px", marginBottom: "50px" }}>
                    <CountdownCircleTimer
                        key={key}
                        isPlaying
                        duration={9}
                        colors={[
                        ['#004777', 0.33],
                        ['#F7B801', 0.33],
                        ['#A30000', 0.33],
                        ]}
                        
                    >
                            {renderTime}
                        </CountdownCircleTimer>
                    </div>
                    <Question dangerouslySetInnerHTML={{ __html: quiz[number].question }}></Question>

                    <Options>
                        {quiz[number].options.map((item, index) => (
                            <Option key={index} dangerouslySetInnerHTML={{ __html: item }}></Option>
                        ))}
                    </Options>
                    <div style={{ display: 'inline-block'}}>
                        <Button onClick={submitAnswer}>{timeUp ? 'Câu tiếp' : 'Trả lời'}</Button>
                        <Button onClick={resetTranscript} style={{ marginTop: '0px', marginLeft: '10px'}}>Reset</Button>
                    </div>
                    <p style={{ marginTop: '1em' }}>{timeUp ? 'Câu trả lời không được ghi nhận !' : transcript}</p>
                </>
            }
            {
                number === 5 && <GameOver pts={pts} />
            }
        </QuizWindow>
    )
}

export default Quiz
