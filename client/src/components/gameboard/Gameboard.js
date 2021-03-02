import React, {
  useState, useCallback, useContext, useEffect,
} from 'react';
import './gameboard.scss';
import '../../assets/img/old-paper.svg';
import Score from '../score/Score';
import useHttp from '../../hooks/http.hook';
import AuthContext from '../../context/AuthContext';

const getRandomNumber = (min, max) => {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

const Gameboard = () => {
  const chips = ['rock', 'paper', 'scissor'];
  const { token } = useContext(AuthContext);

  const [isChoose, setGameType] = useState(false);
  const [myChoice, setMyChoice] = useState(null);
  const [enemyThinking, setEnemyThinking] = useState(true);
  const [enemyChoice, setEnemyChoice] = useState(null);
  const [winTimes, setWintimes] = useState('');
  const [loseTimes, setLosetimes] = useState('');
  const { loading, request } = useHttp();

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

  const chooseHandler = async (e) => {
    setGameType(true);
    setMyChoice(e.target.id);
    setTimeout(() => {
      setEnemyChoice(chips[getRandomNumber(0, chips.length - 1)]);
      setEnemyThinking(false);
      setWintimes(winTimes + 1);
    }, 3000);
  };

  const retryHandler = () => {
    setGameType(false);
    setMyChoice(null);
    setEnemyThinking(true);
    setEnemyChoice(null);
    sendResult();
  };

  const countScoreHandler = (user, myChoice, enemyChice) => {
    console.log(user);
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
      && <div className="preloader-wrapper big active">
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
