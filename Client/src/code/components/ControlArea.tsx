import React from 'react'

const ControlArea = ({state}: any) => {
    console.log(state.gameState)
    return (
        <>
            <div style={{float:"left", width: "130px"}}>
                Your score: 
            </div>
            <div>{state.scores.player}</div>
            <div style={{float:"left", width: "130px"}}>
                Opponent score: 
            </div>
            <div>{state.scores.opponent}</div>
            <br />
            <hr style={{width: "75%", textAlign:"center"}}/>
            <br />

            {
                state.gameState === "awaitingOpponent" && 
                <div style={{ color:"#ff0000", fontWeight:"bold", textAlign:"center" }}>
                    Waiting opponent to join!
                </div>
            }

            {
                state.gameState === "deadEnd" &&  
                <div style={{ color:"#ff0000", fontWeight:"bold", textAlign:"center" }}>
                    You have no moves left!<br/><br/>
                    Waiting for opponent to finish...
                </div>
            }

            {
                state.gameState === "cleared" &&
                <div style={{ color:"#ff0000", fontWeight:"bold", textAlign:"center" }}>
                    Congratulations!
                    <br/><br/>
                    You've cleared the board!
                    <br/><br/>
                    Waiting for opponent!
                </div>
            }

            {
                state.gameState === "gameOver" &&
                <div style={{ color:"#ff0000", fontWeight:"bold", textAlign:"center" }}>
                    The game is over!
                    <br/><br/>
                    { state.gameOutcome}
                </div>
            }
        </>
    )
}
export default ControlArea;