import insta_image from "../../images/insta_image.svg";
import insta_logo from "../../images/insta_logo.png";
import "./LoginPage.css";

import React, { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import commonAxios from '../../commonAxios';
import { useCookies } from 'react-cookie'; // useCookies import

import Modal from '../Common/Modal';

/* 
 * 설명 : LoginPage.js 
 * ------------------------------------------------------------- 
 * 작업일         작업자    작업내용
 * ------------------------------------------------------------- 
 * 2022.10.13    김영일    최초작성 
 * 2022.10.19    김요한    - 로그인 form 데이터 백엔드 연결 
 *                        - 회원가입 페이지 이동 완료
 * 2022.10.24    김요한    로그인 프로세스 완료 (input id = userId , input password = userPwd)
 * 2022.11.01    김요한    모달 팝업 추가
 * -------------------------------------------------------------
*/

function LoginPage(props) {

	const [cookies, setCookie , removeCookie] = useCookies(['loginCookie']); // 쿠키 훅 

  /* 2022.11.01.김요한.추가 - 모달창 노출 여부 */
  const [modalOpen, setModalOpen] = useState(false);

  /* 2022.11.01.김요한.추가 - 해당 데이터를 모달창에서 뿌리기 위함 */
  const [resultData , setResultData] = useState([]);

  /* 2022.11.01.김요한.추가 - 모달창 닫기 */
  const closeModal = () => {
    setModalOpen(false);
  };

  /* 2022.10.19.김요한.추가 - 페이지 이동 */
  const navigate = useNavigate();

  const pageMove = (url) => {
    navigate(url)
  }

  /* 2022.10.19.김요한.추가 - form 데이터 (id , password) */
  const [inputs, setInputs] = useState({
    userId: '',
    userPwd: ''
  });
  
  const { userId, userPwd } = inputs; 
  const onChange = (e) => {
    const { value, id } = e.target;  // 우선 e.target 에서 id 과 value 를 추출
    setInputs({
      ...inputs,                     // 기존의 input 객체를 복사한 뒤
      [id]: value                    // id 키를 가진 값을 value 로 설정
    });
  };

  /* 2022.10.19.김요한.추가 - 백엔드와 연결 후 사용하는 데이터 */
  const handleSubmit = async (event) => {

    event.preventDefault();

    await commonAxios('/user/userLogin' , inputs , callback);

    function callback(data) {
      if ( data[0].resultCd === 'SUCC' ) {
        setCookie('loginId', data[0].userId);      // 쿠키에 토큰 저장
        setCookie('loginNick', data[0].userNick);  // 쿠키에 토큰 저장
        navigate('/mainpage')
      } else {;}
      setResultData(data);
      setModalOpen(true);
    }
  }

  return (
    <>
      <Modal open={modalOpen} close={closeModal} header="로그인">
        <main> {props.children} </main>
        {resultData.map((result) => (
          <span>{result.resultMsg}<br/></span>
        ))}
      </Modal>
      <div className="login--form-container">
        <img className="login-img" src={insta_image} alt="website login" />

        <form className="form-container" onSubmit={handleSubmit}>
          <img className="login-website-logo-desktop-img" src={insta_logo} alt="logo img"/>
          <div className="input-container">
            <label className="input-label" htmlFor="userId">
              유저 아이디
            </label>
            <input
              type="text"   
              id="userId" 
                className="username-input-field"
                onChange={onChange} value={userId}
                placeholder="아이디를 입력해주세요."
            />
          </div>
          <div className="input-container">
            <label className="input-label" htmlFor="userPwd">
              유저 비밀번호
            </label>
            <input
              type="password"
              id="userPwd"
                className="password-input-field"
                onChange={onChange} value={userPwd}
                placeholder="비밀번호를 입력해주세요."
            />
          </div>
          <button className="login-button" type="submit">
            로그인
          </button>
          <button className="login-button" type="button" onClick={() => pageMove('/signup')}>
            회원가입
          </button>
          <button className="login-button" type="button" onClick={() => pageMove('/find')}>
            아이디 & 비밀번호 찾기
          </button>
        </form>
      </div>
    </>
  );
}
export default LoginPage;
