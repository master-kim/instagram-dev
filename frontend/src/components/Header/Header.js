// React 선언
import React, {useState} from "react";
// 해당 페이지 css
import './Header.css'
// 헤더 아이콘 영역
import { AiOutlineSearch, AiFillHome } from 'react-icons/ai'
import { BsPlusSquare } from 'react-icons/bs'
import {FiHeart} from 'react-icons/fi'
import {FiArrowRightCircle} from 'react-icons/fi'
import { IconContext } from 'react-icons'
//import { RiMessengerLine } from 'react-icons/ri'
//import {MdOutlineExplore} from 'react-icons/md'

// navigate , cookies , Axios , modal
import {useNavigate}     from "react-router-dom";
import {useCookies}      from 'react-cookie';
//import Modal             from '../Common/Modal';
import PostUploadModal   from "../Common/PostUploadModal";
import * as commonAxios  from '../../commonUtils/Axios';

/* 
 * 설명 : Header.js
 * ------------------------------------------------------------- 
 * 작업일         작업자    작업내용
 * ------------------------------------------------------------- 
 * 2022.10.13    김영일    최초작성 
 * 2022.10.20    김요한    메인페이지 이동 추가
 * 2022.10.25    김요한    개인페이지 이동 추가
 * 2022.10.26    김요한    로그아웃 아이콘 추가 (로그아웃 기능 추가)
 * 2022.11.03    김요한    소스 정리
 * 2022.11.08    김요한    유저 프로필 이미지 데이터 바인딩 추가 (쿠키에서 가져오기)
 * 2022.11.29    김영일    모달창 추가(게시물 업로드)
 * 2022.12.07    김요한    모달창 정리 (헤더 부분)
 * -------------------------------------------------------------
*/

function Header(props) {
    // 2022.10.26.김요한.추가 - 쿠키 훅 추가
    const [cookies,setCookie,removeCookie] = useCookies(['loginCookie']);
    //2022.10.19.김요한.추가 - 페이지 이동(navigate)
    const navigate = useNavigate();
    const pageMove = (url) => {
        navigate(url)
    }
    
    // 2022.11.29.김영일.수정 - 업로드 모달창 추가 
    const [modalOpen, setModalOpen] = useState(false);
    //const [selectModalOpen, selectSetModalOpen] = useState(false);
    // 모달창 노출
    const showModal = () => {
      //selectSetModalOpen(false);
      setModalOpen(true);
    };
    // 모달창 닫기
    const closeModal = () => {
      setModalOpen(false);
    };
    
    //const selectShowModal = () => {
    //  selectSetModalOpen(true);
    //};
    //// 모달창 닫기
    //const selectCloseModal = () => {
    //  selectSetModalOpen(false);
    //};
  
    // 2022.10.26.김요한.추가 - 백엔드 연결(데이터 송수신)
    const logout = async () => {
        await commonAxios.Axios('/user/Logout' , {} , callback);
        function callback(data) {
            if ( data[0].resultCd === 'SUCC' ) {
            navigate('/login')
            removeCookie('loginId');
            removeCookie('loginNick');
            removeCookie('loginUserImg');
            }  else {
                alert("서버오류");
            }
            //setModalData(data);
            //setModalOpen(true);
        }
    }
    
    // 화면 영역
    return (
        <header className="header" >
            {/* <Modal open={selectModalOpen} onClose={selectCloseModal} header="업로드">
              <main>{props.children}</main>
              <div className="selectDiv"style={{ textAlign: "center"}}>
                <button className="selectFont" onClick={()=>{showModal();} }>게시글 업로드</button>
                <hr/>
                <button className="selectFont" onClick={()=>{showModal();} }>스토리 업로드</button>
              </div>
              <div style={{ textAlign: "right"}}>
                <button className="close-button" onClick={selectCloseModal}>닫기</button>
              </div>
            </Modal>
            */}
            <div className="container" >
                <img className="logo" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="profile" onClick={() => pageMove('/postList')}/>
                <div className="input-fake">
                    <IconContext.Provider value={{ color: '#8e8e8e' }}>
                        <AiOutlineSearch />
                    </IconContext.Provider>
                    <input placeholder="pesquisar" />
                </div>
                <div className="menu-icons" >
                    <IconContext.Provider value={{ size: '26px' }}>
                        <div>
                            <AiFillHome onClick={() => pageMove('/postList')}/>
                        </div>
                        {/* <div>
                            <RiMessengerLine />
                        </div> 
                        - 추후 채팅 기능 추가 여부 논의
                        */}
                        <div>
                            {/* 2022.11.30.김영일.추가 - 업로드 모달*/}
                            <BsPlusSquare style={{ cursor: "pointer" }} onClick={showModal}/>
                            <PostUploadModal open={modalOpen} onClose={closeModal} />
                        </div>
                        <div>
                            <FiHeart />
                        </div>
                        {/* <div>
                            <MdOutlineExplore />
                        </div> 
                        - 추후 탐색 기능 추가 여부 논의
                        */}
                        <img className="img-user" src={cookies.loginUserImg.fileLocation} alt="profile" onClick={() => pageMove('/userProfile')}/>
                        <span className="span-user-nick" onClick={() => pageMove('/userProfile')} >{cookies.loginNick}</span>
                        <div>
                            <FiArrowRightCircle onClick={() => logout()} />
                        </div>
                    </IconContext.Provider>
                </div>
            </div>
        </header>
    )
}

export default Header;