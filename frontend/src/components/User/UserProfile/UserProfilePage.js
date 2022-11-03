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
 * -------------------------------------------------------------
*/

function UserProfilePage() {
	
  // 2022.10.26.김요한 - 쿠키 추가
  const [cookies, setCookie , removeCookie] = useCookies(['loginId']); // 쿠키 훅 
  const navigate = useNavigate();

  const userId = cookies.loginId; // 쿠키에서 id 를 꺼내기
  const userNick = cookies.loginNick; // 쿠키에서 id 를 꺼내기
  
  const [loading, setLoading] = useState(true);
  const [pernalPageList, resultData] = useState([]);
  
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
  
  return (
    <>
    <Header   />
    <div className="personalPage-container">
      <div className="profile">
        <div className="profile-image">
          <img src="https://images.unsplash.com/photo-1513721032312-6a18a42c8763?w=152&h=152&fit=crop&crop=faces" alt="" />
        </div>
        <div className="profile-user-settings">
          <h1 className="profile-user-name">{userNick}</h1>
          <button className="btn profile-edit-btn">프로필 편집</button>
          <button className="btn profile-settings-btn" aria-label="profile settings"><IoMdSettings className="setting-btn" aria-hidden="true" /></button>
        </div>
        <div className="profile-stats">
          <ul>
            <li><span className="profile-stat-count">{pernalPageList.postCnt}</span> 게시물</li>
            <li><span className="profile-stat-count">{pernalPageList.followCnt}</span> 팔로워</li>
            <li><span className="profile-stat-count">{pernalPageList.followCnt}</span> 팔로잉</li>
          </ul>
        </div>
        <div className="profile-bio">
          <p><span className="profile-real-name">{userNick}</span> {pernalPageList.userProfile} </p>
        </div>
      </div>
      {/* <!-- End of profile section --> */}
    </div>
    {/* <!-- End of container --> */}
    {/* post contianer */}
    <div className="personalPage-container">
      <div className="gallery">
        <div className="gallery-item" tabIndex="0">
          <img src="https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?w=500&h=500&fit=crop" className="gallery-image" alt="" />
          <div className="gallery-item-info">
            <ul>
              <li className="gallery-item-likes"><span className="visually-hidden">Likes:</span><FaHeart className="io-text" aria-hidden="true"/> 56</li>
              <li className="gallery-item-comments"><span className="visually-hidden">Comments:</span><FaComment className="io-text fa-comment" aria-hidden="true" /> 2</li>
            </ul>
          </div>
        </div>
        <div className="gallery-item" tabIndex="0">
          <img src="https://images.unsplash.com/photo-1497445462247-4330a224fdb1?w=500&h=500&fit=crop" className="gallery-image" alt="" />
          <div className="gallery-item-info">
            <ul>
              <li className="gallery-item-likes"><span className="visually-hidden">Likes:</span><FaHeart className="io-text" aria-hidden="true"/>89</li>
              <li className="gallery-item-comments"><span className="visually-hidden">Comments:</span><FaComment className="io-text fa-comment" aria-hidden="true" /> 5</li>
            </ul>
          </div>
        </div>
        <div className="gallery-item" tabIndex="0">
          <img src="https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=500&h=500&fit=crop" className="gallery-image" alt="" />
          <div className="gallery-item-type">
            <span className="visually-hidden">Gallery</span><i className="fas fa-clone" aria-hidden="true"></i>
          </div>
          <div className="gallery-item-info">
            <ul>
              <li className="gallery-item-likes"><span className="visually-hidden">Likes:</span><FaHeart className="io-text" aria-hidden="true"/>42</li>
              <li className="gallery-item-comments"><span className="visually-hidden">Comments:</span><FaComment className="io-text fa-comment" aria-hidden="true" /> 1</li>
            </ul>
          </div>
        </div>
        <div className="gallery-item" tabIndex="0">
          <img src="https://images.unsplash.com/photo-1502630859934-b3b41d18206c?w=500&h=500&fit=crop" className="gallery-image" alt="" />
          <div className="gallery-item-type">
            <span className="visually-hidden">Video</span><i className="fas fa-video" aria-hidden="true"></i>
          </div>
          <div className="gallery-item-info">
            <ul>
              <li className="gallery-item-likes"><span className="visually-hidden">Likes:</span><FaHeart className="io-text" aria-hidden="true"/>38</li>
              <li className="gallery-item-comments"><span className="visually-hidden">Comments:</span><FaComment className="io-text fa-comment" aria-hidden="true" /> 0</li>
            </ul>
          </div>
        </div>
        <div className="gallery-item" tabIndex="0">
          <img src="https://images.unsplash.com/photo-1498471731312-b6d2b8280c61?w=500&h=500&fit=crop" className="gallery-image" alt="" />
          <div className="gallery-item-type">
            <span className="visually-hidden">Gallery</span><i className="fas fa-clone" aria-hidden="true"></i>
          </div>
          <div className="gallery-item-info">
            <ul>
              <li className="gallery-item-likes"><span className="visually-hidden">Likes:</span><FaHeart className="io-text" aria-hidden="true"/>47</li>
              <li className="gallery-item-comments"><span className="visually-hidden">Comments:</span><FaComment className="io-text fa-comment" aria-hidden="true" /> 1</li>
            </ul>
          </div>
        </div>
        
      </div>
    </div>
    </>
  );
}

export default UserProfilePage;
