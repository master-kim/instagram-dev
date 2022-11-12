// React 선언
import React, { useState, useEffect } from "react";
// 해당 페이지 css
import "./PostDetailPage.css";
// 해당페이지 아이콘
import { FiMoreHorizontal, FiSend }                          from "react-icons/fi";
import { IoMdHeartEmpty, IoIosArrowBack, IoIosArrowForward,} from "react-icons/io";
import { BsChat, BsEmojiSmile, BsBookmark }                  from "react-icons/bs";
import { IconContext }                                       from "react-icons/lib";
// navigate , cookies , Axios , modal
import * as commonAxios  from '../../../commonUtils/Axios';
import { useLocation }   from 'react-router-dom';

/* 
 * 설명 : PostDetailPage
 * ------------------------------------------------------------- 
 * 작업일         작업자    작업내용
 * ------------------------------------------------------------- 
 * 2022.10.20   김영일    최초작성 
 * 2022.10.26   김영일    ui fixed
 * 2022.11.03   김요한    소스 통합 및 수정 
 * 2022.11.03   김요한    소스 정리
 * 2022.11.04   이강현    백엔드연결, 데이터바인딩 완료
 * 2022.11.05   이강현    게시글 상세 클릭시 페이지 호출 완료
 * 2022.11.12   김요한    엑시오스 추가로 인해 소스 변경
 * -------------------------------------------------------------
 */

export default function PostDetailPage() {
    /**
     * 2022.11.04.김요한.추가 - 프론트 , 백엔드 데이터 송/수신 내용
     * 
     * 프론트엔드 request 데이터 형태
     * -> 데이터 가져오는 곳이므로 현재는 없음
     * 
     * 백엔드 response 데이터 형태
     * -> totalList : {
     *       "postList"   : {.... , .... }
     *    }
     */
     
    const [loading, setLoading] = useState(false);
    const [totalList, resultData] = useState([]);
    
     const location = useLocation();
     //PostList.js 에서 보내준 파라미터 postId 취득
     const postId = location.state.postId;
  
    useEffect(() => {
        
      const inputs = {postId};
      
      commonAxios.Axios('/post/postDetail', inputs, callback);
      function callback(data) {
        resultData(data);
        setLoading(false);
      }
      return () => {};
    }, []);

    /* 페이지 호출 시 백엔드 호출 전 로딩 상태 표시 (계속 이상태면 백엔드 서버 꺼져있을 가능성 o) */
    if (loading)  return( <div className="box" style={{margin: "30px 0"}} > {" "} Loading...  </div> );
    
    // 화면영역
    if (totalList.length === 0) {
    } else {
        return (
        <>
        <div className="post-detail-box">
            <div className="post-detail-box-inner">
                <div className="icon-arrow">
                    <IoIosArrowBack />
                </div>
                <div className="post-detail-box-inner-inner">
                    <div className="img-post">
                        <img className="img-header-post" src={`${totalList.fileInfo[0].uuidFileNm}`}  alt="post"/>
                    </div>
                    <div className="post-detail-footer-post">
                        <div className="post-detail-username">
                          <div className="infos-post">
                              <img className="img-header-post"  src={`${totalList.fileInfo[0].uuidFileNm}`}  alt="post"  />
                              <p>{totalList.postInfo.userId}</p>
                          </div>
                          <FiMoreHorizontal className="info-button" />
                          </div>
                          <div className="post-detail-contents">
                              <div className="infos-post">
                                  <img className="img-header-post"src={`${totalList.fileInfo[0].uuidFileNm}`} alt="post" />
                                  <p>{totalList.postInfo.userId}</p>
                              </div>
                          </div>
                          <IconContext.Provider value={{size : "30px"}}>
                          <div className="post-detail-engagement-post">
                              <div className="icons-1">
                                  <div className="icon"> <IoMdHeartEmpty /> </div>
                                  <div className="icon"> <BsChat /> </div>
                                  <div className="icon"> <FiSend /> </div>
                              </div>
                              <div className="icon"> <BsBookmark /> </div>
                          </div>
                          </IconContext.Provider>
                          <div className="post-detail-legend">
                            <p> <span>{totalList.postInfo.userId}</span> {totalList.postInfo.postContent} </p>
                          </div>
                          <div className="post-detail-time-post">
                              <time>{totalList.postInfo.createDt}</time>
                          </div>
                          <div className="post-detail-comment">
                              <div className="post-detail-fake-comment">
                                  <IconContext.Provider value={{ size: "25px" }}>
                                        <div className="icon"> <BsEmojiSmile /> </div>
                                  </IconContext.Provider>
                                  <input placeholder="댓글달기..." />
                              </div>
                              <button>게시</button>
                          </div>
                      </div>
                  </div>
                  <div className="icon-arrow">
                    <IoIosArrowForward />
                  </div>
              </div>
          </div>
      </>
      );
    }
}