// React 선언
import React, {useState} from "react";
// 해당 페이지 css
import "./LoginPage.css";
// 푸터 영역
import Footer from "../../footer/footer";
// 이미지 가져오는 영역
import insta_image from "../../../images/insta_image.svg";
import insta_logo  from "../../../images/insta_logo.png";
// navigate , cookies , Axios , modal
import {useNavigate} from "react-router-dom";
import {useCookies}  from 'react-cookie';
import Modal         from '../../Common/Modal';
import Axios         from '../../../commonUtils/Axios';

/* 
 * 설명 : LoginPage.js 
 * ------------------------------------------------------------- 
 * 작업일         작업자    작업내용
 * ------------------------------------------------------------- 
 * 2022.10.13    김영일    최초작성 
 * 2022.10.19    김요한    로그인 form 데이터 추가, 회원가입 페이지 이동 추가
 * 2022.10.24    김요한    로그인 프로세스 완료 (input id = userId , input password = userPwd)
 * 2022.10.26    김요한    쿠키 훅 추가
 * 2022.11.01    김요한    모달 팝업 추가 ( alert -> modal 팝업 변경)
 * 2022.11.03    김요한    소스 정리
 * -------------------------------------------------------------
*/

function LoginPage(props) {
    
    /**
     * 프론트 , 백엔드 데이터 송/수신 내역 작성 영역
     * 
     * 프론트엔드 request 데이터 형태
     * inputData = { "userId" : "test" , "userPwd" : "test"}
     *
     * 백엔드 response 데이터 형태
     * -> 성공 사례 
     *    data : [{
     *              "resultCd"   : "SUCC",
     *              "resultMsg"  : "~~~~~",
     *              "userId"     : "test",
     *              "userNick"   : "로그인닉네임",
     *           }]
     * -> 실폐 사례
     *     data : 
     *           [{
     *              "resultCd"  : "FAIL",
     *              "resultMsg"   : "~~~~~"
     *           } ,
     *           {
     *              "resultCd"  : "FAIL",
     *              "resultMsg"   : "~~~~~"
     *           }]
     */
     
    // 2022.10.26.김요한.추가 - 쿠키 훅 추가
    const [cookies,setCookie,removeCookie] = useCookies(['loginCookie']);
    //2022.10.19.김요한.추가 - 페이지 이동(navigate)
    const navigate = useNavigate();
    const pageMove = (url) => {
        navigate(url)
    }
    // 2022.11.01.김요한.추가 - 모달창 추가
    const [modalOpen,setModalOpen] = useState(false);
    const [modalData,setModalData] = useState([]);
    const closeModal = () => {
        setModalOpen(false);
    };

    //2022.10.19.김요한.추가 - form 데이터 (userId , userPwd)
    const [inputData, setinputData] = useState({
        userId  : '',
        userPwd : ''
    });
    const {userId,userPwd} = inputData; 
    const onChange = (e) => {
      const { value, id } = e.target;  
      setinputData({
        ...inputData,                     
        [id]: value                   
      });
    };
    // 2022.10.19.김요한.추가 - 백엔드 연결(데이터 송수신)
    const handleSubmit = async (event) => {
        event.preventDefault();
        await Axios('/user/Login' , inputData , callback);
        function callback(data) {
            if ( data[0].resultCd === 'SUCC' ) {
              setCookie('loginId', data[0].userId);
              setCookie('loginNick', data[0].userNick);
              navigate('/postList')
            } else {;}
            setModalData(data);
            setModalOpen(true);
        }
    }
    
    // 화면 영역
    return (
      <>
      <Modal open={modalOpen} close={closeModal} header="로그인">
        <main> {props.children} </main>
        {modalData.map((result) => (
          <span>{result.resultMsg}<br/></span>
        ))}
      </Modal>
      <div className="login--form-container">
          <img className="login-img" src={insta_image} alt="website login" />
          <form className="form-container" onSubmit={handleSubmit}>
              <img className="login-website-logo-desktop-img" src={insta_logo} alt="logo img"/>
              <div className="input-container">
                  <label className="input-label" htmlFor="userId">유저 아이디</label>
                  <input type="text"id="userId" className="input-field" onChange={onChange} value={userId} placeholder="아이디를 입력해주세요."/>
              </div>
              <div className="input-container">
                  <label className="input-label" htmlFor="userPwd">유저 비밀번호</label>
                  <input type="password" id="userPwd" className="input-field" onChange={onChange} value={userPwd} placeholder="비밀번호를 입력해주세요."/>
              </div>
              <button className="login-button" type="submit">로그인</button>
              <button className="login-button" type="button" onClick={() => pageMove('/signup')}>회원가입</button>
              <button className="login-button" type="button" onClick={() => pageMove('/find')}>아이디 & 비밀번호 찾기</button>
          </form>
      </div>
      {/*<Footer /> */}
      </>
    );
}
export default LoginPage;
