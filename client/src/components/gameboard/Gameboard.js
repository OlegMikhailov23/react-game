import React, {
  useState, useCallback, useContext, useEffect,
} from 'react';
import './gameboard.scss';
import '../../assets/img/old-paper.svg';
import Score from '../score/Score';
import useHttp from '../../hooks/http.hook';
import AuthContext from '../../context/AuthContext';
import useMessage from '../../hooks/message.hook';

const getRandomNumber = (min, max) => {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

const Gameboard = () => {
  const chips = ['rock', 'paper', 'scissor'];
  const { token } = useContext(AuthContext);
  const message = useMessage();

  const [isChoose, setGameType] = useState(false);
  const [myChoice, setMyChoice] = useState(null);
  const [enemyThinking, setEnemyThinking] = useState(true);
  const [enemyChoice, setEnemyChoice] = useState(null);
  const [winTimes, setWintimes] = useState(null);
  const [loseTimes, setLosetimes] = useState(null);
  const { request } = useHttp();

  const getWins = useCallback(
    async () => {
      try {
        const data = await request('/api/auth/win', 'GET', null, {
          Authorization: `Bearer ${token}`,
        });
        setWintimes(data.win);
        setLosetimes(data.lose);
      } catch (e) {}
    },
    [token, request],
  );

  const sendResult = async () => {
    try {
      await request('/api/auth/win', 'POST', { win: winTimes, lose: loseTimes }, {
        Authorization: `Bearer ${token}`,
      });
    } catch (e) {}
  };

  useEffect(() => {
    getWins();
  }, []);

  const countScoreHandler = (userChoice, iiChoice) => {
    if (userChoice === 'paper' && iiChoice === 'rock') {
      setWintimes(winTimes + 1);
    } else if (userChoice === 'paper' && iiChoice === 'scissor') {
      setLosetimes(loseTimes + 1);
      message('Holy 💩, try another time!');
    } else if (userChoice === 'scissor' && iiChoice === 'paper') {
      message('Hooray, u are lucky man! 😁');
      setWintimes(winTimes + 1);
      message('Hooray, u are lucky man! 😁');
    } else if (userChoice === 'scissor' && iiChoice === 'rock') {
      message('Holy 💩, try another time!');
      setLosetimes(loseTimes + 1);
    } else if (userChoice === 'rock' && iiChoice === 'paper') {
      message('Holy 💩, try another time!');
      setLosetimes(loseTimes + 1);
    } else if (userChoice === 'rock' && iiChoice === 'scissor') {
      message('Hooray, u are lucky man! 😁');
      setWintimes(winTimes + 1);
    }
  };

  const chooseHandler = async (e) => {
    setGameType(true);
    setMyChoice(e.target.id);
    setTimeout(() => {
      setEnemyChoice(chips[getRandomNumber(0, chips.length - 1)]);
      setEnemyThinking(false);
    }, 3000);
  };

  useEffect(() => {
    countScoreHandler(myChoice, enemyChoice);
  }, [enemyChoice]);

  const retryHandler = () => {
    setGameType(false);
    setMyChoice(null);
    setEnemyThinking(true);
    setEnemyChoice(null);
    sendResult();
  };

  if (!isChoose) {
    return (
      <div className="gameboard">
        <h1 className="gameboard__title white-text">Choose your weapon</h1>
        {chips.map((chip, index) => (
          <div className={`game-chip ${chip}`}
               key={index} id={chip}
               title={chip}
               onClick={chooseHandler}>{chip}</div>
        ))}
      </div>
    );
  }
  return (
    <div className="gameboard">
      <h1 className="gameboard__title white-text">Let's test your luck:)</h1>
      <Score win={winTimes} lose={loseTimes} />
      <div className={`game-chip ${myChoice}`}
           title={myChoice}
      >{myChoice}</div>

      <div className="button-wrapper">
        <button className="waves-effect waves-light btn-large" disabled={enemyThinking} onClick={retryHandler}>Retry</button>
      </div>

      {enemyThinking
      && <div className="preloader-wrapper preloader-wrapper-custom  big active">
        <div className="spinner-layer spinner-blue-only">
          <div className="circle-clipper left">
            <div className="circle"></div>
          </div>
          <div className="gap-patch">
            <div className="circle"></div>
          </div>
          <div className="circle-clipper right">
            <div className="circle"></div>
          </div>
        </div>
      </div>}
      {!enemyThinking
      && <div className={`game-chip ${enemyChoice}`}
              title={enemyChoice}
      >{enemyChoice}</div>
      }
    </div>
  );
};

export default Gameboard;
