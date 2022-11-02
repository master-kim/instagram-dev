import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import commonAxios from '../../commonAxios';
import * as commonUtils from "../../commonUtils";

import insta_logo from "../../images/insta_logo.png";
import "./SignupPage.css";

import Modal from '../Common/Modal';

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
 * -------------------------------------------------------------
 */

function SignupPage(props) {
  const navigate = useNavigate();
  const pageMove = (url) => {
    navigate(url);
  };

  const [inputs, setInputs] = useState({
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
  } = inputs; 

  const onChange = (e) => {
    const { value, id } = e.target;  
    setInputs({
      ...inputs,                     
      [id]: value                    
    });
  };

  // 모달창 노출 여부 state
  const [modalOpen, setModalOpen] = useState(false);

  // 해당 데이터를 모달창에서 뿌리기 위함
  const [resultData , setResultData] = useState([]);

  // 모달창을 닫기
  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const result = commonUtils.isEqualCheck(userPwd , userPwdChk);

    if (result === true) {
      await commonAxios('/user/userRegister' , inputs , callback);
      
      function callback(data) {
        if ( data[0].resultCd === 'SUCC' ) {
          navigate('/login')
        } else {;}
        setResultData(data);
      }
      
    } else {
      const data = [{
        resultMsg : "유저 비밀번호와 유저 비밀번호 확인 부분이 맞지 않습니다."
      }]
      setResultData(data);
    }
    setModalOpen(true);
  }

  return (
    <>
      <Modal open={modalOpen} close={closeModal} header="회원 가입">
        <main> {props.children} </main>
        {resultData.map((result) => (
          <span>{result.resultMsg}<br/></span>
        ))}
      </Modal>
      <div className="signup--form-container">
        <form className="form-container" onSubmit={handleSubmit}>
          <img className="signup-website-logo-desktop-img" src={insta_logo} />
          <div className="input-container">
            <label className="input-label" htmlFor="userid">
              유저 아이디
            </label>
            <input
              type="text"
              id="userId"
              className="userid-input-field"
              onChange={onChange} value={userId}
              placeholder="아이디를 입력해주세요."
            />
          </div>
          <div className="input-container">
            <label className="input-label" htmlFor="username">
              유저 이름
            </label>
            <input
              type="text"
              id="userName"
              className="username-input-field"
              onChange={onChange} value={userName}
              placeholder="이름을 입력해주세요."
            />
          </div>
          <div className="input-container">
            <label className="input-label" htmlFor="usernickname">
              유저 닉네임
            </label>
            <input
              type="text"
              id="userNick"
              className="usernickname-input-field"
              onChange={onChange} value={userNick}
              placeholder="닉네임을 입력해주세요."
            />
          </div>
          <div className="input-container">
            <label className="input-label" htmlFor="password">
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
          <div className="input-container">
            <label className="input-label" htmlFor="password-check">
            유저 비밀번호 확인
            </label>
            <input
              type="password"
              id="userPwdChk"
              className="password-input-field"
              onChange={onChange} value={userPwdChk}
              placeholder="비밀번호를 입력해주세요."
            />
          <div className="input-container">
            <label className="input-label" htmlFor="email">
              유저 이메일
            </label>
            <input
              type="email"
              id="userEmail"
              className="email-input-field"
              onChange={onChange} value={userEmail}
              placeholder="이메일을 입력해주세요."
            />
          </div>
          </div>
          <div className="input-container">
            <label className="input-label" htmlFor="phone">
              유저 핸드폰
            </label>
            <input
              type="text"
              id="userPhone"
              className="phone-input-field"
              onChange={onChange} value={userPhone}
              placeholder="핸드폰 번호를 입력해주세요."
            />
          </div>

          <button className="register-button" type="submit">
            등록
          </button>
          
          <button
            className="register-button"
            type="button"
            onClick={() => pageMove("/login")}
          >
            취소
          </button>
        </form>
      </div>
    </>
  );
}

export default SignupPage;
