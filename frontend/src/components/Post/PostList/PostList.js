import Header from "../../Header/Header";
import './PostList.css'

/** 
 * 포스트 관련 import 
 */
import { FiMoreHorizontal, FiSend } from 'react-icons/fi'
import { IoMdHeartEmpty} from 'react-icons/io'
import { BsChat, BsEmojiSmile, BsBookmark} from 'react-icons/bs'
import { IconContext } from 'react-icons/lib'

/* 파일 3개로 나누면 백엔드 3번 호출로 인해 불필요 
import { StoryList } from '../StoryList/StoryList'
import { PostList } from '../PostList/PostList'
import { SuggestionList } from '../SuggestionList/SuggestionList' */
 
/** 
 * navigate , cookies , useState , useEffect , commonAxios 사용 위한 import
 */
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import React, { useState , useEffect } from 'react';
import commonAxios from '../../../commonAxios';
/* 
 * 설명 : PostList.js
 * ------------------------------------------------------------- 
 * 작업일         작업자    작업내용
 * ------------------------------------------------------------- 
 * 2022.10.13    김영일    최초작성 
 * 2022.10.20    김요한    헤더 영역 추가
 * 2022.10.26    김요한    쿠키 추가
 * 2022.10.28    김요한    컴포넌트 나누어 놓은거 합치기 (백엔드 세번 호출 불필요 -> 1번으로 변경 위함)
 * -------------------------------------------------------------
 */

function PostList() {

    const [cookies, setCookie , removeCookie] = useCookies(['loginCookie']); // 쿠키 훅 
    const navigate = useNavigate();

    const userId = cookies.loginId; // 쿠키에서 id 를 꺼내기

    const [loading, setLoading] = useState(true);
    const [totalList, resultData] = useState([]);
    
    /**
     * 2022.10.28.김요한.추가 - 프론트 , 백엔드 데이터 송/수신 내용
     * 
     * 프론트엔드 request 데이터 형태
     * -> 데이터 가져오는 곳이므로 현재는 없음
     * 
     * 백엔드 response 데이터 형태
     * -> totalList : {
     *       "storyList"  : {.... , .... },
     *       "postList"   : {.... , .... } ,
     *       "followList" : {.... , .... } 
     *    }
     */
    useEffect(() => {

        if (userId === undefined) {
            alert('세션이 만료되었습니다.')
            navigate('/login')
        } else {
            commonAxios('/post/postList' , {} , callback);

            function callback(data) {
                resultData(data);
                setLoading(false);
            }
        }
        return () => {
        };
    }, []); 
    
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
                                {totalList.storyList.map((story) => (
                                    <div className="user-elements" >
                                        <div>
                                            {/* <img className="image-user-story" src="C:\dev\06.img" alt="profile" /> */}
                                            <img className="image-user-story" src="https://github.com/peas.png" alt="profile" />
                                        </div>
                                        <span style={{textAlign: "center"}}>{story.userentity.userNick}</span>       
                                    </div> 
                                ))}
                            </div>
                        </div>
                        {/* 게시글 영역 */}
                        {totalList.postList.map((post) => (
                            <div className="box" style={{margin: "30px 0"}} >
                                <header className="header-post" >
                                    <div className="infos-post" >
                                        <img className="img-header-post" src="https://github.com/maykbrito.png" alt="profile"/>
                                        {/* 2022.10.27.김요한.수정 - 게시글 ID가 아닌 Nick으로 표현 변경 (userId > userentity.userNick) */}
                                        <p>{post.userentity.userNick}</p>
                                    </div>
                                        <FiMoreHorizontal />
                                </header>
                                <div className="img-post" >
                                    <img src="https://github.com/maykbrito.png" alt="profile"/>
                                </div>
                                <div className="footer-post" >
                                <IconContext.Provider value={{size: "30px"}} >
                                    <section className="engagement-post" >
                                        <div className="icons-1" >
                                            <div className="icon"><IoMdHeartEmpty /></div>
                                            <div className="icon"><BsChat /></div>
                                            <div className="icon"><FiSend /></div>
                                        </div>
                                        <div className="icon"><BsBookmark /></div>
                                    </section>
                                </IconContext.Provider>
                                <section className="like" >
                                    <span>61 curtidas</span>
                                </section>
                                <div className="legend" >
                                    <p>
                                        <span>{post.userentity.userNick}</span> {post.postContent}
                                    </p>
                                </div>
                                <div className="time-post" >
                                    <time>{post.createDt}</time>
                                </div>
                                <div className="comment" >
                                    <div className="fake-comment" >
                                        <IconContext.Provider value={{size: '25px'}}>
                                            <div className="icon">
                                                <BsEmojiSmile />
                                            </div>
                                        </IconContext.Provider>
                                        <input placeholder="댓글달기..." />
                                    </div>
                                    <button>게시</button>
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
                                <img src={`https://github.com/gabrieldiasss.png`} alt="profile"/>
                                <div className="user-infos-suggestion" >
                                    <div className="infos" >
                                        <span>{cookies.loginId}</span>
                                        <p>{cookies.loginNick}</p>
                                    </div>
                                    <button className="switch" style={{margin: "0 -50px 0 0"}}>계정전환</button>
                                </div>
                            </div>
                            <div className="header-main-suggestion" >
                                <p>회원님을 위한 추천</p>
                                <span style={{margin: "0 -50px 0 0"}}>모두 보기</span>
                            </div>
                            <div className="user-suggestion" >
                            {totalList.followList.map((follow, key) => (
                                    <div className="infos-suggestion" key={key}>
                                    {/* <img src={`https://github.com/${suggestion.login}.png`} alt="profile"/> */}
                                    <img className="image-user-story" src="https://github.com/peas.png" alt="profile" />
                                    <div className="info-suggestion" >
                                        <span>{follow.userId}</span>
                                        <p>{follow.userNick}</p>
                                    </div>
                                    <button className='follow' style={{margin: "0 -50px 0 0"}} >팔로우</button>
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