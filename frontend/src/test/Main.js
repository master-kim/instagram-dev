import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import commonAxios from '../commonAxios';

const Main = (props) => {

    const [ip, setIp] = useState('');

    function callback(data) {
        setIp(data);
    }

    useEffect(
        () => {
          // 클라이언트의 IP주소를 알아내는 백엔드의 함수를 호출합니다.
          commonAxios('/ip', callback);
        }, []
      );

	return (
		<>
			<h3>안녕하세요. 메인페이지 입니다.</h3>
			<ul>
				<Link to="/product/1"><li>1번상품</li></Link>
				<Link to="/product/2"><li>2번상품</li></Link>
        <Link to="/product/3"><li>{ip}</li></Link>
			</ul>
		</>
	);
};

export default Main;