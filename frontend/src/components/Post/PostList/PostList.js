// React 선언
import React, { useState , useEffect } from 'react';
// 해당 페이지 css
 import './PostList.css'
// 헤더 영역
import Header from "../../Header/Header";
// 아이콘 영역
import { FiMoreHorizontal, FiSend }        from 'react-icons/fi'
import { IoMdHeart, IoMdHeartEmpty}        from "react-icons/io";
import { BsChat, BsEmojiSmile, BsBookmark} from 'react-icons/bs'
import { IconContext }                     from 'react-icons/lib'
// navigate , cookies , Axios , modal
import { useNavigate }  from "react-router-dom";
import { useCookies }   from 'react-cookie';
import * as commonAxios from '../../../commonUtils/Axios';

/* 
 * 설명 : PostList.js
 * ------------------------------------------------------------- 
 * 작업일         작업자    작업내용
 * ------------------------------------------------------------- 
 * 2022.10.13    김영일    최초작성 
 * 2022.10.20    김요한    헤더 영역 추가
 * 2022.10.26    김요한    쿠키 추가
 * 2022.10.28    김요한    컴포넌트 나누어 놓은거 합치기 (백엔드 세번 호출 불필요 -> 1번으로 변경 위함)
 * 2022.11.03    김요한    소스 정리
 * 2022.11.04    김요한    파일 데이터 바인딩 추가
 * 2022.11.05    이강현    게시글 상세페이지 호출기능 추가
 * 2022.11.05    김요한    팔로우 리스트 -> 팔로잉 리스트로 변경 , 게시글 파일 데이터 가져오기 추가
 * 2022.11.07    김요한    팔로우맺기 추가
 * 2022.11.14    김요한    좋아요 기능 추가 및 표시 추가
 * 2022.11.19    김요한    댓글 기능 추가
 * 2022.11.21    김요한    댓글 삭제 추가 (수정은 진행중)
 * -------------------------------------------------------------
 */

function PostList() {

    /**
     * 2022.10.28.김요한.추가 - 프론트 , 백엔드 데이터 송/수신 내용
     * 
     * 프론트엔드 request 데이터 형태
     * -> 데이터 가져오는 곳이므로 현재는 없음
     * 
     * 백엔드 response 데이터 형태
     * -> totalList : {
     *       "storyList"               : {.... , .... } ,
     *       "storyUserImgList"        : {.... , .... } ,
     *       "postList"                : {.... , .... } ,
     *       "postImgList"             : {.... , .... } ,
     *       "postUserImgList"         : {.... , .... } ,
     *       "postCommentList"         : {.... , .... } ,
     *       "postCommentUserImgList"  : {.... , .... } ,
     *       "postCommentCnt"          : {.... , .... } ,
     *       "postLikeList"            : {.... , .... } ,
     *       "postLikeCnt"             : {.... , .... } ,
     *       "followSuggList"          : {.... , .... } ,
     *       "followSuggImgList"       : {.... , .... } 
     *    }
     */
     
    // 2022.10.26.김요한.추가 - 쿠키 훅 추가
    const [cookies, setCookie , removeCookie] = useCookies(['loginCookie']);
    const userId = cookies.loginId;
    
    //2022.10.19.김요한.추가 - 페이지 이동(navigate)
    const navigate = useNavigate();
    //게시글의 '말풍선(댓글)모양 icon' 버튼 클릭시 페이지이동 및 클린된 게시글번호 파라미터 전달
    const pageMove = (url , postId) => {
        if (postId === null) {
            navigate(url);
        } else {
            navigate(url, {state: {postId :postId}});
        }
    };
    
    //2022.10.19.김요한.추가 - 페이지 로딩
    const [loading, setLoading] = useState(true);
    const [totalList, resultData] = useState([]);
    
    useEffect(() => {
        if (userId === undefined) {
            alert('세션이 만료되었습니다.')
            navigate('/login')
        } else {
            commonAxios.Axios('/post/postList' , {} , callback);
            function callback(data) {
                resultData(data);
                setLoading(false);
            }
        }
        return () => {
        };
    }, []); 
    
    // 2022.11.07.김요한.추가 - 팔로우맺기
    const doFollow = (followId) => {
        const postData = {
            userId : followId
        }
        commonAxios.Axios('/follow/doFollow' , postData , callback);
        function callback(data) {
            if (data.resultCd === "SUCC") {
                window.location.reload();
            } else {;}
        }
    };
    
    // 2022.11.14.김요한.추가 - 좋아요
    const doLike = (postId) => {
        const postData = {
            postId : postId
        }
        commonAxios.Axios('/post/doLike' , postData , callback);
        function callback(data) {
            if (data.resultCd === "SUCC") {
                window.location.reload();
            } else {;}
        }
    };
    // 2022.11.14.김요한.추가 - 게시글 유저에 따른 렌더링
    const postLikeRendering = (postList , postLikeList) => {
        const result = [];
        var setCnt = 0;
        for (let likeIdx=0; likeIdx < postLikeList.length; likeIdx++) {
            if (postLikeList.length > 0) {
                if(cookies.loginId === postLikeList[likeIdx].userId && postLikeList[likeIdx].postId === postList.postId){
                    setCnt = 1;
                    break;
                } else {
                    setCnt = 0;
                }
            } else {
                setCnt = 0;
                break;
            }
        }
        if (setCnt > 0) {
            result.push(<div className="icon"><IoMdHeart onClick={() => {doLike(postList.postId);}} /></div>);
        } else {
            result.push(<div className="icon"><IoMdHeartEmpty onClick={() => {doLike(postList.postId);}} /></div>);
        }
        return result;
    };
    
    
    // 2022.11.19.김요한.추가 -댓글달기
    const [inputData, setinputData] = useState();
    const onChange = (e) => {
        const { value, id } = e.target;  
        setinputData({
          ...inputData,                     
          [id]: value                    
        });
    };
    const doComment = (postId) => {
        const postData = {
            postId      : postId ,
            postComment : inputData.postComment
        }
        commonAxios.Axios('/post/doComment' , postData , callback);
        function callback(data) {
            if (data.resultCd === "SUCC") {
                window.location.reload();
            } else {;}
        }
    };
    
    // 2022.11.21.김요한.추가 - 댓글 영역 렌더링
    const detailCommentRendering = (commentList , postId , commentUserImg) => {
        const result = [];
        if (cookies.loginId === commentList.userId) {
            result.push(
            <div className="post-detail-comment">
                <div className="post-detail-fake-comment">
                <img src={commentUserImg.fileLocation} alt="post" style={{width: "20px" , height:"20px" , borderRadius : "30%"}}/>
                <p className="commentP">{commentList.userentity.userNick}<span id={"comment_" + commentList.commentId} className="commentSpan">{commentList.content}</span></p>
                </div>
                {/* <button onClick={()=>{CommentUpdate(commentList.commentId , postId, "U");} } style={{margin: "0px 10px 0px"}}>수정</button> */}
                <button onClick={()=>{CommentUpdate(commentList.commentId ,postId , "D");} } style={{margin: "0px 10px 0px"}}>삭제</button>
                <button onClick={()=>{doCommentLike(commentList.commentId, postId);} }><IoMdHeartEmpty/></button>
            </div> 
            );
        } else {
            result.push(
            <div className="post-detail-comment">
                <div className="post-detail-fake-comment">
                <img src={commentUserImg.fileLocation} alt="post" style={{width: "20px" , height:"20px" , borderRadius : "30%"}}/>
                <p className="commentP">{commentList.userentity.userNick}<span className="commentSpan">{commentList.content}</span></p>
                </div>
                <button onClick={()=>{doCommentLike(commentList.commentId , postId);} }><IoMdHeartEmpty/></button>
            </div> 
            );
        }
        return result;
    };
    
    // 2022.11.21.김요한.추가 - 댓글 수정 ,삭제 [수정은 수정 폼 만들어서 넣어야하므로 추후 다시 만들 예정]
    const CommentUpdate = (commentId , postId, commentType) => {
        const commentData = {
            commentId      : commentId ,
            postId         : postId ,
            commentType    : "",
            commentContent : ""
        }
        if (commentType === "U") {
            commentData.commentType = "U";
        } else {
            commentData.commentType = "D";
        }
        commonAxios.Axios('/post/updateComment' , commentData , callback);
    
        function callback(data) {
            if (data.resultCd === "SUCC") {
                window.location.reload();
            } else {;}
        }
    };
    
    // 2022.11.21.김요한.추가 - 댓글 좋아요 추후 개발 예정
    const doCommentLike = (commentId) => {
        const commentData = {
        commentId : commentId , 
        userId    : cookies.loginId
        }
    };
    
    /* 페이지 호출 시 백엔드 호출 전 로딩 상태 표시 (계속 이상태면 백엔드 서버 꺼져있을 가능성 o) */
    if (loading) {
        return <div className="box" style={{margin: "30px 0"}} > Loading... </div>;
    } else {;}
    
    /* 로그인으로 접근이 아닌 url 직접 접근을 막기 위한 형태*/
    if (userId === undefined) {
    } else {
        return (
            <>
                <Header />
                <div className="MainGrid" >
                    <div className="first-column" style={{gridArea: "firstColumn"}}>
                        {/* 스토리 영역 */}
                        <div className="box" >
                            <div className="container" >
                                {totalList.storyList.map((story , key) => (
                                    <div className="user-elements" key={key}>
                                        <div>
                                            <img className="image-user-story" src={totalList.storyUserImgList[key].fileLocation} alt="profile" />
                                        </div>
                                        <span style={{textAlign: "center"}}>{story.userentity.userNick}</span>       
                                    </div> 
                                ))}
                            </div>
                        </div>
                        {/* 게시글 영역 */}
                        {totalList.postList.map((post , key) => (
                            <div className="box" style={{margin: "30px 0"}} key={key}>
                                <header className="header-post" >
                                    <div className="infos-post" >
                                        {totalList.postUserImgList.map((postImgList) => {
                                            if(post.userentity.userId === postImgList.commonId){
                                                return <img className="img-header-post" src={postImgList.fileLocation} alt="profile"/>
                                            } else {;}
                                        })}
                                        <p>{post.userentity.userNick}</p>
                                    </div>
                                    <FiMoreHorizontal />
                                </header>
                                <div className="img-post" >
                                    <img onClick={() => {pageMove('/postDetailPage' ,post.postId);} } src={totalList.postImgList[key].fileLocation} alt="profile"/>
                                </div>
                                <div className="footer-post" >
                                <IconContext.Provider value={{size: "30px"}} >
                                    <section className="engagement-post" >
                                        <div className="icons-1" >
                                            {postLikeRendering(post , totalList.postLikeList[key])}
                                            <div className="icon"><BsChat onClick={() => {pageMove('/postDetailPage' , post.postId);} } /></div>
                                            <div className="icon"><FiSend /></div>
                                        </div>
                                        <div className="icon"><BsBookmark /></div>
                                    </section>
                                </IconContext.Provider>
                                <section className="like" >
                                    <span>좋아요 {totalList.postLikeCnt[key]}개</span>
                                </section>
                                <div className="legend" >
                                    <p>
                                        <span>{post.userentity.userNick}</span> {post.postContent}
                                    </p>
                                </div>
                                <div className="time-post" >
                                    <time>{post.createDt}</time>
                                </div>
                                <div style={{margin: "6px 0 6px"}}>
                                    {totalList.postCommentList[key].map((commentList , commentKey) => {
                                        if(post.postId === commentList.postId){
                                            {return detailCommentRendering(commentList , post.postId ,  totalList.postCommentUserImgList[commentKey])}
                                        } else {;}
                                    })}
                                </div>
                                <div className="comment" >
                                    <div className="fake-comment" >
                                        <IconContext.Provider value={{size: '25px'}}>
                                            <div className="icon">
                                                <BsEmojiSmile />
                                            </div>
                                        </IconContext.Provider>
                                        <input id="postComment" type="text" placeholder="댓글달기..." onChange={onChange} />
                                    </div>
                                    <button onClick={()=>{doComment(post.postId);} }>게시</button>
                                </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* 팔로우 리스트 영역 */}
                    <div style={{ gridArea: "secondColumn" }} >
                        <div className="suggestionBox" >
                        <div className="container-suggestion">
                            <div className="header-suggestion" >
                                <img src={cookies.loginUserImg.fileLocation} alt="profile"/>
                                <div className="user-infos-suggestion" >
                                    <div className="infos" >
                                        <span>{cookies.loginId}</span>
                                        <p>{cookies.loginNick}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="header-main-suggestion" >
                                <p>회원님을 위한 추천</p>
                                <span style={{margin: "0 -50px 0 0"}} onClick={ () => {pageMove('/followSuggPage' , null);} } >모두 보기</span>
                            </div>
                            <div className="user-suggestion" >
                            {totalList.followSuggList.map((followInfo, key) => (
                                    <div className="infos-suggestion" key={key}>
                                    <img className="image-user-story" src={totalList.followSuggImgList[key].fileLocation} alt="profile" />
                                    <div className="info-suggestion" >
                                        <span>{followInfo.userId}</span>
                                        <p>{followInfo.userNick}</p>
                                    </div>
                                    <button className='follow' style={{margin: "0 -50px 0 0"}} onClick={()=>{doFollow(followInfo.userId);} }>팔로우</button>
                                </div>
                            ))}
                            </div>
                            {/* 팔로우 리스트 아래 푸터 영역 */}
                            <footer className="footer-suggestion" >
                                <p>깃허브 주소 &bull; 개발자 소개 ......</p>
                                <p>&copy; 2022 INSTAGRAM FROM META</p>
                            </footer>
                        </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default PostList;