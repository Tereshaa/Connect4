/* eslint-disable jsx-a11y/alt-text */
import { useRef, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import React from 'react'

import Winner from '../Winner'
import Pause from '../Pause'
import { Modal } from '../../../context/Modal';

import './index.css'

import boardBlack from '../../../assets/images/board-layer-black-large.svg'
import boardWhite from '../../../assets/images/board-layer-white-large.svg'
import counterRed from '../../../assets/images/counter-red-large-shadowless.svg'
import counterYellow from '../../../assets/images/counter-yellow-large-shadowless.svg'
import markerRed from '../../../assets/images/marker-red-2.svg'
import markerYellow from '../../../assets/images/marker-yellow-2.svg'
import turnBackgroundRed from '../../../assets/images/turn-background-red.svg'
import turnBackgroundYellow from '../../../assets/images/turn-background-yellow.svg'
import ovalWhite from '../../../assets/images/oval-white.svg'
import ovalWhiteSmall from '../../../assets/images/oval-white-small.svg'


const GameBoard = ({timer, currentPlayer, setTimer, pause,
                    setCurrentPlayer, setPlayer1Score, setPlayer2Score,
                    gameBottomRef, restart, setPause}) => {

    const markerRef = useRef();
    const time = useRef()
    const playerTurn = useRef()
    const whiteBoardRef = useRef();
    const blackBoardRef = useRef();

	const [ width, setWidth ] = useState(window.innerWidth)
	const [ height, setHeight ] = useState(window.innerHeight)
    const [ column, setColumn ] = useState('4')
    const [ row, setRow ] = useState('1')
    const [ counter, setCounter ] = useState(counterRed)
    const [ marker, setMarker ] = useState(markerRed)
    const [ turn, setTurn ] = useState(turnBackgroundRed)
    const [ winner, setWinner ] = useState('')


    const cellsRef = useRef({
        '1' : [],
        '2' : [],
        '3' : [],
        '4' : [],
        '5' : [],
        '6' : [],
        '7' : []
    })

	const handleWindowResize = useCallback((event) => {
		setHeight(window.innerHeight)
		setWidth(window.innerWidth)
	})

    const resetStyle = () => {
        gameBottomRef.current.style.backgroundColor = '#9bc391'
        whiteBoardRef.current.style.pointerEvents = 'none'
        blackBoardRef.current.style.pointerEvents = 'none'

        for(let c = 1; c <= 7; c++){
            const currentColumn = cellsRef.current[c]
            for(let r = 0; r < currentColumn.length; r++){
                const currentRow = currentColumn[r]
                const children = currentRow.children
                children[0].classList.remove('yellow')
                children[0].classList.remove('red')
                children[0].removeAttribute('src')
                if(children[1]) children[1].remove()
            }
        }
    }

    const playAgain = () => {
        resetStyle()
        if(winner === 'red'){
            restart(setColumn, setRow, setCounter, counterYellow,
                setMarker, markerYellow, setTurn, turnBackgroundYellow, setWinner, true, 'yellow')
        } else {
            restart(setColumn, setRow, setCounter, counterRed,
                setMarker, markerRed, setTurn, turnBackgroundRed, setWinner, true, 'red')
        }
    }

    const colorChecker = (one, two, three, four) => {
        if(one === two &&
            two === three &&
            three === four){
             setWinner(one)
             whiteBoardRef.current.style.pointerEvents = 'unset'
             blackBoardRef.current.style.pointerEvents = 'unset'
             if(one === 'red') {
                setPlayer1Score(prevScore => prevScore + 1)
                gameBottomRef.current.style.backgroundColor = 'hsla(347,97%,70%,1)'
            }
             else {
                setPlayer2Score(prevScore => prevScore + 1)
                gameBottomRef.current.style.backgroundColor = 'hsla(41,100%,70%,1)'
            }
             return true
         }
    }

    const addWhiteOval = (...elements) => {
        for(let i = 0; i < elements.length; i++){
            const currentElement = elements[i]
            const imgElement = document.createElement('img')
            imgElement.classList.add('oval')
            const isMobile = width > 375 && height > 812 ? false : true
            if(!isMobile) imgElement.src = ovalWhite
            else imgElement.src = ovalWhiteSmall
            imgElement.alt = 'no-oval'
            currentElement.appendChild(imgElement)
        }
    }

    const checkWinner = () => {
        // horizontally
        for(let c = 1; c <= 4; c++){
            const columnOne = cellsRef.current[c]
            const columnTwo = cellsRef.current[c+1]
            const columnThree = cellsRef.current[c+2]
            const columnFour = cellsRef.current[c+3]

            for(let r = 0; r < columnOne.length; r++){
                const cellOneElement = columnOne[r]

                const cellOneColor = cellOneElement.firstChild.classList.value.split(' ')[1]
                if (cellOneColor){
                    const cellTwoElement = columnTwo[r]
                    const cellThreeElement = columnThree[r]
                    const cellFourElement = columnFour[r]

                    const cellTwoColor = cellTwoElement.firstChild.classList.value.split(' ')[1]
                    const cellThreeColor = cellThreeElement.firstChild.classList.value.split(' ')[1]
                    const cellFourColor = cellFourElement.firstChild.classList.value.split(' ')[1]

                    if(colorChecker(cellOneColor, cellTwoColor, cellThreeColor, cellFourColor)) {
                        addWhiteOval(cellOneElement, cellTwoElement, cellThreeElement, cellFourElement)
                        return
                    }
                }
            }
        }

        // vertical
        for(let c = 1; c <= 7; c++){
            const currentColumn = cellsRef.current[c]
            for(let r = currentColumn.length - 4; r >= 0; r--){
                const rowOne = currentColumn[r]
                const cellOneColor = rowOne.firstChild.classList.value.split(' ')[1]

                if(cellOneColor) {
                    const rowTwo = currentColumn[r+1]
                    const rowThree = currentColumn[r+2]
                    const rowFour = currentColumn[r+3]

                    const cellTwoColor = rowTwo.firstChild.classList.value.split(' ')[1]
                    const cellThreeColor = rowThree.firstChild.classList.value.split(' ')[1]
                    const cellFourColor = rowFour.firstChild.classList.value.split(' ')[1]

                    if(colorChecker(cellOneColor, cellTwoColor, cellThreeColor, cellFourColor)) {
                        addWhiteOval(rowOne, rowTwo, rowThree, rowFour)
                        return
                    }
                }

            }
        }

        // diagonally
        for(let c = 1; c <= 4; c++){
            const columnOne = cellsRef.current[c]
            const columnTwo = cellsRef.current[c+1]
            const columnThree = cellsRef.current[c+2]
            const columnFour = cellsRef.current[c+3]

            for(let r = 5; r >= 3; r--){
                const oneRowColumn = columnOne[r]
                const cellOneColor = oneRowColumn.firstChild.classList.value.split(' ')[1]

                if(cellOneColor){
                    const twoRowColumn = columnTwo[r-1]
                    const threeRowColumn = columnThree[r-2]
                    const fourRowColumn = columnFour[r-3]

                    const cellTwoColor = twoRowColumn.firstChild.classList.value.split(' ')[1]
                    const cellThreeColor = threeRowColumn.firstChild.classList.value.split(' ')[1]
                    const cellFourColor = fourRowColumn.firstChild.classList.value.split(' ')[1]

                    if(colorChecker(cellOneColor, cellTwoColor, cellThreeColor, cellFourColor)) {
                        addWhiteOval(oneRowColumn, twoRowColumn, threeRowColumn, fourRowColumn)
                        return
                    }
                }
            }
        }

        // anti diagonally
        for(let c = 1; c <= 4; c++){
            const columnOne = cellsRef.current[c]
            const columnTwo = cellsRef.current[c+1]
            const columnThree = cellsRef.current[c+2]
            const columnFour = cellsRef.current[c+3]

            for(let r = 0; r < columnOne.length - 3; r++){
                const oneRowColumn = columnOne[r]
                const cellOneColor = oneRowColumn.firstChild.classList.value.split(' ')[1]

                if(cellOneColor){
                    const twoRowColumn = columnTwo[r+1]
                    const threeRowColumn = columnThree[r+2]
                    const fourRowColumn = columnFour[r+3]

                    const cellTwoColor = twoRowColumn.firstChild.classList.value.split(' ')[1]
                    const cellThreeColor = threeRowColumn.firstChild.classList.value.split(' ')[1]
                    const cellFourColor = fourRowColumn.firstChild.classList.value.split(' ')[1]

                    if(colorChecker(cellOneColor, cellTwoColor, cellThreeColor, cellFourColor)) {
                        addWhiteOval(oneRowColumn, twoRowColumn, threeRowColumn, fourRowColumn)
                        return
                    }
                }
            }
        }

    }

    const interValGenerator = () => {
        return setInterval(()=> {
            let currentTime = timer.slice(0,2)
            currentTime = parseInt(currentTime) - 1
            setTimer(`${currentTime}s`)
        }, 1000)
    }

    useEffect(()=> {

        let timerInterval = interValGenerator()

        if(pause){
            clearInterval(timerInterval)
            timerInterval = ''
        }

        if(!pause && !timerInterval){
            timerInterval = interValGenerator()
        }

        const currentTimer = timer.slice(0, timer.length - 1)

        if(currentTimer === '0' && !winner){
            whiteBoardRef.current.style.pointerEvents = 'unset'
            blackBoardRef.current.style.pointerEvents = 'unset'
            if(currentPlayer.split(' ')[1][0] === '2') {
                setPlayer1Score(prevScore => prevScore + 1)
                setWinner('red')
                gameBottomRef.current.style.backgroundColor = 'hsla(347,97%,70%,1)'
            }
            else {
                setPlayer2Score(prevScore => prevScore + 1)
                setWinner('yellow')
                gameBottomRef.current.style.backgroundColor = 'hsla(41,100%,70%,1)'
            }
            setTimer('-1s')
            clearInterval(timerInterval)
        }

		window.addEventListener('resize', handleWindowResize);

        return () => {
            clearInterval(timerInterval)
			window.removeEventListener('resize', handleWindowResize);
        }

    },[timer, pause])

    const menuButton = () => {
		setPause(prevPause => !prevPause)
    }


    const moveMarker = (e) => {
        const currentColumn = e.target.className.split(' ')[1][4];
        const currentRow = e.target.className.split(' ')[0][4];
        const isMobile = width <= 375 && height <= 812;
    
        const positions = {
            '1': isMobile ? '9px' : '32px',
            '2': isMobile ? '55px' : '120px',
            '3': isMobile ? '102px' : '208px',
            '4': 'unset',
            '5': isMobile ? '102px' : '210px',
            '6': isMobile ? '55px' : '120px',
            '7': isMobile ? '9px' : '32px',
        };
    
        if (currentColumn === '4') {
            markerRef.current.style.left = 'unset';
            markerRef.current.style.right = 'unset';
        } else if (currentColumn <= '3') {
            markerRef.current.style.left = positions[currentColumn];
            markerRef.current.style.right = '0px';
        } else {
            markerRef.current.style.right = positions[currentColumn];
            markerRef.current.style.left = 'unset';
        }
    
        setRow(currentRow);
        setColumn(currentColumn);
    };
    

    const dropCounter = () => {
        let droppedCounter = false
        const columnLength = cellsRef.current[column].length
        for(let i = columnLength - 1; i >= 0; i--){
            const currentCell = cellsRef.current[column][i]
            if(!currentCell.firstChild.src && !droppedCounter){
                currentCell.firstChild.src = counter
                droppedCounter = true
                if (counter === counterRed) {
                    currentCell.firstChild.classList.add('red')
                    setCounter(counterYellow)
                    setMarker(markerYellow)
                    setTurn(turnBackgroundYellow)
                    time.current.style.color = 'black'
                    playerTurn.current.style.color = 'black'
                    setTimer('30s')
                    setCurrentPlayer(`PLAYER 2'S TURN`)
                }
                else {
                    currentCell.firstChild.classList.add('yellow')
                    setCounter(counterRed)
                    setMarker(markerRed)
                    setTurn(turnBackgroundRed)
                    time.current.style.color = 'white'
                    playerTurn.current.style.color = 'white'
                    setTimer('30s')
                    setCurrentPlayer(`PLAYER 1'S TURN`)
                }
            }
        }
        checkWinner()
    }

    const createCells = () => {
        const cellArray = new Array(6).fill(null).map((e, index)=>{
            const currentRow = index + 1
            return (
                <React.Fragment key={`row-${currentRow}`}>
                    {
                        new Array(7).fill(null).map((e, index)=>{
                            const currentColumn = index + 1
                            return (
                                    <div
                                        className={`row-${currentRow} col-${currentColumn} cell`}
                                        key={`cell-${currentRow}-${currentColumn}`}
                                        ref={(element)=>{
                                            if(cellsRef.current[currentColumn].length < 6 && element){
                                                cellsRef.current[currentColumn].push(element)
                                            }
                                        }}
                                        onMouseEnter={moveMarker}
                                        onTouchStart={moveMarker}
										onMouseDown={moveMarker}
                                        onClick={dropCounter}
                                    >
                                    <img
                                        key={`counter-${currentRow}-${currentColumn}`}
                                        className='cell-image'
                                    />
                                </div>
                            )
                        })
                    }
                </React.Fragment>
            )
          })
        return cellArray
    }

    return (
        <>
            <div className='game-board-body'>
                <div className='game-board-top'>
                    <div className='menu' onClick={menuButton}>
                        MENU
                    </div>

                 

                    <div className='restart' onClick={()=>{
                        resetStyle()
                        restart(setColumn, setRow, setCounter, counterRed,
                                setMarker, markerRed, setTurn, turnBackgroundRed, setWinner)
                    }}>
                        RESTART
                    </div>
                </div>

                <div className='game-board'>
                    <img className='game-marker' src={marker} ref={markerRef} alt='no-gamemarker'/>
                    <div style={{'position' : 'relative'}}>

                        <div className='cells'>
                            {
                                createCells().map(e => e)
                            }
                        </div>
                        <img ref={whiteBoardRef} className='game-board-white' src={boardWhite} draggable={false} alt='no-whiteboard'/>
                    </div>


                    <img ref={blackBoardRef} className='game-board-black' src={boardBlack} draggable={false} alt='no-blackboard'/>

                    {
                        !winner ?
                        <div className='turn-background'>
                            <img style={{'position' : 'absolute'}} src={turn} alt='no-turn'/>
                            <div className='current-player' ref={playerTurn}>
                                {currentPlayer}
                            </div>
                            <div className='game-timer'ref={time}>
                                {timer}
                            </div>
                        </div>
						:
                        <Winner winner={winner} playAgain={playAgain}/>
                    }
                </div>
            </div>
            {pause &&
                <Modal onClose={()=> setPause(false)}>
                    <Pause setPause={setPause} restart={()=> {
                        restart(setColumn, setRow, setCounter, counterRed,
                            setMarker, markerRed, setTurn, turnBackgroundRed, setWinner)
                        }}
                        resetStyle={resetStyle}
                    />
                </Modal>
            }
        </>
    )
}

export default GameBoard;
