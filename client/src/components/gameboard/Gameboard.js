import React, {
  useState, useCallback, useContext, useEffect,
} from 'react';
import useSound from 'use-sound';
import '../../assets/img/old-paper.svg';
import Score from '../score/Score';
import useHttp from '../../hooks/http.hook';
import AuthContext from '../../context/AuthContext';
import useMessage from '../../hooks/message.hook';

import './gameboard.scss';

import failureSound from '../../assets/sound/failure.mp3';
import successSound from '../../assets/sound/success.mp3';
import chooseSound from '../../assets/sound/swap.mp3';
import clickSound from '../../assets/sound/click.mp3';

const getRandomNumber = (min, max) => {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

const Gameboard = () => {
  const chips = ['rock', 'paper', 'scissor'];
  const { token } = useContext(AuthContext);
  const message = useMessage();

  const [playFailure] = useSound(failureSound);
  const [playSuccess] = useSound(successSound);
  const [playChoose] = useSound(chooseSound);
  const [playClick] = useSound(clickSound);

  const [soundButtonClass, setSoundButtonClass] = useState('sound-switcher red lighten-2 btn');
  const [isSound, setSound] = useState(false);
  const [isChoose, setGameType] = useState(false);
  const [myChoice, setMyChoice] = useState(null);
  const [enemyThinking, setEnemyThinking] = useState(true);
  const [enemyChoice, setEnemyChoice] = useState(null);
  const [winTimes, setWintimes] = useState(null);
  const [loseTimes, setLosetimes] = useState(null);
  const { request } = useHttp();

  const soundHandler = () => {
    if (isSound) {
      playClick();
    }
    setSound(!isSound);
    document.removeEventListener('keydown', pressSoundHandler, false);
  };

  useEffect(() => {
    if (isSound) {
      setSoundButtonClass('sound-switcher red lighten-2 btn');
      message('Sound on 🎺');
    } else {
      setSoundButtonClass('sound-switcher green lighten-2 btn');
      message('Sound off 🙉');
    }
  }, [isSound]);

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
      message('Hooray, u are lucky man! 😁');
      setWintimes(winTimes + 1);
      if (isSound) {
        playSuccess();
      }
    } else if (userChoice === 'paper' && iiChoice === 'scissor') {
      message('Holy 💩, try another time!');
      setLosetimes(loseTimes + 1);
      if (isSound) {
        playFailure();
      }
    } else if (userChoice === 'scissor' && iiChoice === 'paper') {
      message('Hooray, u are lucky man! 😁');
      setWintimes(winTimes + 1);
      if (isSound) {
        playSuccess();
      }
    } else if (userChoice === 'scissor' && iiChoice === 'rock') {
      message('Holy 💩, try another time!');
      setLosetimes(loseTimes + 1);
      if (isSound) {
        playFailure();
      }
    } else if (userChoice === 'rock' && iiChoice === 'paper') {
      message('Holy 💩, try another time!');
      setLosetimes(loseTimes + 1);
      if (isSound) {
        playFailure();
      }
    } else if (userChoice === 'rock' && iiChoice === 'scissor') {
      message('Hooray, u are lucky man! 😁');
      setWintimes(winTimes + 1);
      if (isSound) {
        playSuccess();
      }
    }
  };

  const enemyTurn = () => {
    setGameType(true);
    document.removeEventListener('keydown', pressHandler);
    if (isSound) {
      playChoose();
    }
    setTimeout(() => {
      setEnemyChoice(chips[getRandomNumber(0, chips.length - 1)]);
      setEnemyThinking(false);
    }, 3000);
  };

  const chooseHandler = async (e) => {
    setMyChoice(e.target.id);
    enemyTurn();
  };

  useEffect(() => {
    countScoreHandler(myChoice, enemyChoice);
  }, [enemyChoice]);

  const retryHandler = () => {
    setGameType(false);
    setMyChoice(null);
    setEnemyThinking(true);
    setEnemyChoice(null);
    if (isSound) {
      playClick();
    }
    sendResult();
    document.removeEventListener('keydown', pressRetryHandler, false);
  };

  const pressHandler = useCallback((e) => {
    if (e.key === 'a') {
      setMyChoice('rock');
      enemyTurn();
    } else if (e.key === 's') {
      setMyChoice('paper');
      enemyTurn();
    } else if (e.key === 'd') {
      setMyChoice('scissor');
      enemyTurn();
    }
  }, []);

  const pressRetryHandler = useCallback((e) => {
    if (e.key === 'r') {
      retryHandler();
    }
  }, []);

  const pressSoundHandler = useCallback((e) => {
    if (e.key === 'e') {
      soundHandler();
    }
  }, [isSound]);

  useEffect(() => {
    document.addEventListener('keydown', pressHandler, false);

    return () => {
      document.removeEventListener('keydown', pressHandler, false);
    };
  }, [myChoice]);

  useEffect(() => {
    document.addEventListener('keydown', pressRetryHandler, false);

    return () => {
      document.removeEventListener('keydown', pressRetryHandler, false);
    };
  }, [enemyChoice]);

  useEffect(() => {
    document.addEventListener('keydown', pressSoundHandler, false);
    return () => {
      document.removeEventListener('keydown', pressSoundHandler, false);
    };
  }, [isSound]);

  if (!isChoose) {
    return (
      <div className="gameboard">
        <button className={soundButtonClass} onClick={soundHandler} title="sound On/Off"><i className="material-icons">surround_sound</i></button>
        <h1 className="gameboard__title white-text">Choose your weapon</h1>
        {chips.map((chip, index) => (
          <div className={`game-chip ${chip}`}
               key={index} id={chip}
               title={chip}
               onClick={chooseHandler}
               tabIndex="0"
               >{chip}</div>
        ))}
      </div>
    );
  }
  if (isChoose) {
    return (
      <div className="gameboard">
        <button className={soundButtonClass} onClick={soundHandler} title="sound On/Off"><i className="material-icons">surround_sound</i></button>
        <h1 className="gameboard__title white-text">Let`s test your luck:)</h1>
        <div className={`game-chip ${myChoice}`}
             title={myChoice}
             tabIndex="0"
        >{myChoice}</div>

        <div className="button-wrapper">
          <button className="waves-effect waves-light green lighten-2 btn-large" disabled={enemyThinking} onClick={retryHandler} tabIndex="0">Retry</button>
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
                tabIndex="0"
        >{enemyChoice}</div>
        }
        <Score win={winTimes} lose={loseTimes} />
      </div>
    );
  }
};

export default Gameboard;
