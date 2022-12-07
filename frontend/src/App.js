// BrowserRouter 선언
import { BrowserRouter as Router, Route, Routes, Redirect } from "react-router-dom";
// 전체적인 css 선언
import "./css/common/global.css";

// 각 페이지 선언
import LoginPage       from "./components/User/Login/LoginPage";
import SignupPage      from "./components/User/Signup/SignupPage";
import UserProfilePage from "./components/User/UserProfile/UserProfilePage";
import PostList        from "./components/Post/PostList/PostList";
import PostDetailPage  from "./components/Post/PostDetail/PostDetailPage";
import FollowSuggPage  from "./components/Follow/FollowSugg/FollowSuggPage";

/* 
 * 설명 : App.js
 * ------------------------------------------------------------- 
 * 작업일         작업자    작업내용
 * ------------------------------------------------------------- 
 * 2022.10.11    김요한    최초작성
 * 2022.10.14    김영일    메인페이지 , 로그인 페이지 , 개인페이지 추가
 * 2022.10.28    김요한    메인페이지 (통합) : PostPage [layout : story , suggestion , post] 을 -> postList.js 한개로 통합 
 * 2022.11.03    김요한    페이지 호출 URL 및 소스 변경 
 * 2022.11.08    김요한    팔로우 추천 페이지 추가 
 * 2022.11.30    김영일    업로드페이지 -> 모달로 변경 
 * -------------------------------------------------------------
*/

function App() {

  return (
    <Router>
        <Routes>
            <Route exact path="/"               element={<LoginPage />} />
            <Route exact path="/login"          element={<LoginPage />} />
            <Route exact path="/signUp"         element={<SignupPage />} />
            <Route exact path="/userProfile"    element={<UserProfilePage />} />
            <Route exact path="/postList"       element={<PostList />}/>
            <Route exact path="/postDetailPage" element={<PostDetailPage />}/>
            <Route exact path="/followSuggPage" element={<FollowSuggPage />}/>
        </Routes>
    </Router>
  );
}

export default App;
