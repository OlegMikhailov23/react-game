import React from 'react';
import './score.scss';

const Score = (props) => (
  <div className="score-wrapper white-text">
    <div className="score-container">
      <p>Yor current score <span className="green-text">{props.win}</span></p>
      <p>You you have lost <span className="red-text">{props.lose}</span> times</p>
    </div>
  </div>
);

export default Score;
