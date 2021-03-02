import React from 'react';

const Score = (props) => (
    <div className="score-wrapper white-text">
    <p>Yor Current score {props.win}</p>
    <p>You you have lost {props.lose} times</p>
      </div>
);

export default Score;
