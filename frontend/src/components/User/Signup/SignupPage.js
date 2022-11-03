// React 선언
import React, { useState} from "react";
// 해당 페이지 css
import "./SignupPage.css";
// 이미지 영역
import insta_logo from "../../../images/insta_logo.png";
// navigate , cookies , Axios , modal , utils
import { useNavigate }  from "react-router-dom";
import Modal         from '../../Common/Modal';
import Axios         from '../../../commonUtils/Axios';
import * as commonUtils from "../../../commonUtils/Utils";

/*
 * 설명 : suggestion.js
 * -------------------------------------------------------------
 * 작업일         작업자    작업내용
 * -------------------------------------------------------------
 * 2022.10.13    김영일    최초작성
 * 2022.10.19    김요한    회원가입 취소 버튼 추가 (취소 시 login 페이지로 변경)
 * 2022.10.20    김영일    input 사항들 추가
 * 2022.10.24    김요한    회원가입 양식 유효성 검증 및 데이터 처리 진행완료
 * 2022.11.01    김요한    모달 팝업 추가
 * 2022.11.03    김요한    소스 정리
 * -------------------------------------------------------------
 */

function SignupPage(props) {
    
    /**
     * 프론트 , 백엔드 데이터 송/수신 내역 작성 영역
     * 
     * 프론트엔드 request 데이터 형태
     * inputData = { "userId" : "test" , "userPwd" : "test" , .....}
     *
     * 백엔드 response 데이터 형태
     * -> 성공 사례 
     *    data : [{
     *              "resultCd"   : "SUCC",
     *              "resultMsg"  : "~~~~~",
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
    //2022.10.24.김요한.추가 - form 데이터...
    const [inputData, setinputData] = useState({
      userId         : '',
      userNick       : '',
      userName       :  '',
      userPwd        : '',
      userPwdChk     : '',
      userEmail      : '',
      userPhone      : ''
    });
    const { 
      userId,    
      userNick, 
      userName,  
      userPwd,   
      userPwdChk,
      userEmail, 
      userPhone 
    } = inputData; 
    const onChange = (e) => {
      const { value, id } = e.target;  
      setinputData({
        ...inputData,                     
        [id]: value                    
      });
    };
    
    // 2022.10.24.김요한.추가 - 백엔드 연결(데이터 송수신)
    const handleSubmit = async (event) => {
      event.preventDefault();
      const result = commonUtils.isEqualCheck(userPwd , userPwdChk);
      if (result === true) {
        await Axios('/user/SignUp' , inputData , callback);
        function callback(data) {
          if ( data[0].resultCd === 'SUCC' ) {
            navigate('/login')
          } else {;}
          setModalData(data);
        }
      } else {
        const data = [{
          resultMsg : "유저 비밀번호와 유저 비밀번호 확인 부분이 맞지 않습니다."
        }]
        setModalData(data);
      }
      setModalOpen(true);
    }
    
    // 화면 영역
    return (
      <>
      <Modal open={modalOpen} close={closeModal} header="회원 가입">
          <main> {props.children} </main>
          {modalData.map((result) => (
            <span>{result.resultMsg}<br/></span>
          ))}
      </Modal>
          <div className="signup--form-container">
              <form className="form-container" onSubmit={handleSubmit}>
                  <img className="signup-website-logo-desktop-img" src={insta_logo} />
                  <div className="input-container">
                      <label className="input-label" htmlFor="userid">유저 아이디</label>
                      <input type="text" id="userId" className="input-field" onChange={onChange} value={userId} placeholder="아이디를 입력해주세요." />
                  </div>
                  <div className="input-container">
                      <label className="input-label" htmlFor="username"> 유저 이름 </label>
                      <input type="text" id="userName" className="input-field" onChange={onChange} value={userName} placeholder="이름을 입력해주세요." />
                  </div>
                  <div className="input-container">
                      <label className="input-label" htmlFor="usernickname"> 유저 닉네임 </label> 
                      <input type="text" id="userNick" className="input-field" onChange={onChange} value={userNick} placeholder="닉네임을 입력해주세요." />
                  </div>
                  <div className="input-container">
                      <label className="input-label" htmlFor="password"> 유저 비밀번호 </label>
                      <input type="password" id="userPwd" className="input-field" onChange={onChange} value={userPwd} placeholder="비밀번호를 입력해주세요." />
                  </div>
                  <div className="input-container">
                      <label className="input-label" htmlFor="password-check"> 유저 비밀번호 확인 </label>
                      <input type="password" id="userPwdChk" className="input-field" onChange={onChange} value={userPwdChk} placeholder="비밀번호를 입력해주세요." />
                  </div>
                  <div className="input-container">
                      <label className="input-label" htmlFor="email"> 유저 이메일 </label>
                      <input type="email" id="userEmail" className="input-field" onChange={onChange} value={userEmail} placeholder="이메일을 입력해주세요."/>
                  </div>
                  <div className="input-container">
                      <label className="input-label" htmlFor="phone"> 유저 핸드폰 </label>
                      <input type="text" id="userPhone" className="input-field" onChange={onChange} value={userPhone} placeholder="핸드폰 번호를 입력해주세요." />
                  </div>
                  <button className="register-button" type="submit"> 등록 </button>
                  <button className="register-button" type="button" onClick={() => pageMove("/login")} > 취소 </button>
            </form>
        </div>
      </>
    );
}

export default SignupPage;
