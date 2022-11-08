// React 선언
import React, { useState , useEffect } from 'react';
// 해당 페이지 css
import "./UserProfilePage.css";
// 헤더 영역
import Header from "../../Header/Header";
// 아이콘 영역
import {IoMdSettings} from 'react-icons/io'
import {FaHeart} from 'react-icons/fa'
import {FaComment } from 'react-icons/fa'
// navigate , cookies , Axios , modal
import {useNavigate} from "react-router-dom";
import {useCookies}  from 'react-cookie';
import Axios         from '../../../commonUtils/Axios';

/* 
 * 설명 : UserProfilePage.js
 * ------------------------------------------------------------- 
 * 작업일         작업자    작업내용
 * ------------------------------------------------------------- 
 * 2022.10.13    김영일    최초작성 
 * 2022.10.26    김요한    쿠키추가
 * 2022.10.27    김요한    개인 페이지 프로필 부분 완료 (추후 게시글 이미지 영역 진행 예정)
 * 2022.11.03    김요한    소스 정리
 * 2022.11.04    김요한    유저 프로필 올린 게시글 리스트 가져오기 추가
 * 2022.11.04    김요한    파일 데이터 바인딩 추가
 * -------------------------------------------------------------
*/

function UserProfilePage() {
    
    /**
     * 2022.10.28.김요한.추가 - 프론트 , 백엔드 데이터 송/수신 내용
     * 
     * 프론트엔드 request 데이터 형태
     * -> 백엔드에서 Session을 체크하므로 데이터 보낼 필요 없음
     * 
     * 백엔드 response 데이터 형태
     * 성공 사례
     * -> totalList : {
     *       "resultCd"     : "SUCC",
     *       "resultMsg"    : "~~~~~~~~",
     *       "followCnt"    : {.... , .... },
     *       "postCnt"      : {.... , .... },
     *       "userProfile"  : {.... , .... },
     *       "postList"     : {.... , .... } ,
     *       "fileList"     : {.... , .... } ,
     *    }
     * 
     * 실패 사례
     * -> totalList : {
     *       "resultCd"   : "FAIL",
     *       "resultMsg"  : "~~~~~~~~",
     *    }
     * 
     */
     
    // 2022.10.26.김요한.추가 - 쿠키 훅 추가
    const [cookies, setCookie , removeCookie] = useCookies(['loginId']);
    const userId = cookies.loginId; 
    const userNick = cookies.loginNick;
    //2022.10.19.김요한.추가 - 페이지 이동(navigate)
    const navigate = useNavigate();
    
    //2022.10.19.김요한.추가 - 페이지 로딩
    const [loading, setLoading] = useState(true);
    const [totalList, resultData] = useState([]);
    
    useEffect(() => {
        if (userId === undefined) {
            alert('세션이 만료되었습니다.')
            navigate('/login')
        } else {
          Axios('/user/UserProfile' , {} , callback);
          function callback(data) {
            resultData(data);
            setLoading(false);
          }
        }
        return () => {
        };
    }, []); 
  
    if (loading) return <div className="box" style={{margin: "30px 0"}} > Loading... </div>;
    
    // 화면 영역
    return (
        <>
        <Header />
        <div className="personalPage-container">
            <div className="profile">
                <div className="profile-image">
                    <img src={cookies.loginUserImg.fileLocation} style={{ height: '180px' , width : '180px'}} alt="userProfileImg" />
                </div>
                <div className="profile-user-settings">
                    <h1 className="profile-user-name">{userNick}</h1>
                    <button className="btn profile-edit-btn">프로필 편집</button>
                    <button className="btn profile-settings-btn" aria-label="profile settings"><IoMdSettings className="setting-btn" aria-hidden="true" /></button>
                </div>
                <div className="profile-stats">
                    <ul>
                        <li><span className="profile-stat-count">{totalList.postCnt}</span> 게시물</li>
                        <li><span className="profile-stat-count">{totalList.followerCnt}</span> 팔로워</li>
                        <li><span className="profile-stat-count">{totalList.followingCnt}</span> 팔로잉</li>
                    </ul>
                </div>
                <div className="profile-bio">
                    <p><span className="profile-real-name">{userNick}</span> {totalList.userProfile} </p>
                </div>
            </div>
        </div>
        {/* start post contianer */}
        <div className="personalPage-container">
            <div className="gallery">
                {totalList.postList.map((post, key) => (
                    <div className="gallery-item" tabIndex="0" key = {key}>
                        <img src={totalList.fileList[key].fileLocation} className="gallery-image" alt="" />
                        <div className="gallery-item-info">
                            <ul>
                                <li className="gallery-item-likes"><span className="visually-hidden">Likes:</span><FaHeart className="io-text" aria-hidden="true"/> 56</li>
                                <li className="gallery-item-comments"><span className="visually-hidden">Comments:</span><FaComment className="io-text fa-comment" aria-hidden="true" /> 2</li>
                            </ul>
                        </div>
                    </div>
                ))}        
            </div>
        </div>
        </>
    );
}

export default UserProfilePage;
