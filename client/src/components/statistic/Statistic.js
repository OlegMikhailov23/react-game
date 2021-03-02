import React, {
  useState, useCallback, useContext, useEffect,
} from 'react';
import AuthContext from '../../context/AuthContext';
import useHttp from '../../hooks/http.hook';
import './statistic.scss';

const Statistic = () => {
  const { token } = useContext(AuthContext);
  const { loading, request } = useHttp();
  const [data, setData] = useState([]);
  const getUsers = useCallback(
    async () => {
      try {
        const data = await request('/api/auth/statistic', 'GET', null, {
          Authorization: `Bearer ${token}`,
        });
        console.log(data);
        data.sort((a, b) => b.win - a.win);
        setData(data);
      } catch (e) {
      }
    },
    [token, request],
  );

  useEffect(() => {
    getUsers();
  }, []);

  if (loading) {
    return (
      <div className="statistic-wrapper">
      <div className="preloader-wrapper preloader-wrapper-statistic active">
        <div className="spinner-layer spinner-red-only">
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
      </div>
      </div>
    );
  }

  return (
    <div className="statistic-wrapper">
      <table className="white-text highlight">
        <thead>
        <tr>
          <th>Name</th>
          <th>Lose</th>
          <th>Win</th>
        </tr>
        </thead>

        <tbody>
        {
          data.map((user, index) => (
            <tr key={index}>
              <td className="blue-text">{user.login}</td>
              <td className="red-text">{user.lose}</td>
              <td className="green-text">{user.win}</td>
            </tr>
          ))
        }
        </tbody>
      </table>
    </div>
  );
};

export default Statistic;
