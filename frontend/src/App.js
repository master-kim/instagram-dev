import { BrowserRouter as Router, Route, Routes, Redirect } from "react-router-dom";
import Header from "./components/Header/Header";
import PostPage  from "./components/Post/PostList/PostList";
import SignupPage from "./components/SignupPage/SignupPage";
import LoginPage from "./components/LoginPage/LoginPage";
import PersonalPage from "./components/PersonalPage/PersonalPage";
import "./css/common/global.css";
import PostDetailPage from "./components/PostDetailPage/PostDetailPage";

/* 
 * 설명 : App.js
 * ------------------------------------------------------------- 
 * 작업일         작업자    작업내용
 * ------------------------------------------------------------- 
 * 2022.10.11    김요한    최초작성
 * 2022.10.14    김영일    메인페이지 , 로그인 페이지 , 개인페이지 추가
 * 2022.10.28    김요한    메인페이지 (통합) : PostPage [layout : story , suggestion , post] 을 -> postList.js 한개로 통합 
 * -------------------------------------------------------------
*/

function App() {

  return (
    <Router>
     {/* <Header /> 
      <Layout /> */}
      <Routes>
        <Route exact path="/" element={<LoginPage />} />
        <Route exact path="/login" element={<LoginPage />} />
        {/* <Route exact path="/signup" element={<SignupPage />} />
        <Route exact path="/personal-page" element={<PersonalPage />} />
        <Route exact path="/mainpage" element={<PostPage />}/>
        <Route exact path="/post-detail-page" element={<PostDetailPage />}/>*/}
        {/* <ProtectedRoute exact path="/" component={Home} /> */}
        {/* <ProtectedRoute exact path="/my-profile" component={MyProfile} /> */}
        {/* <ProtectedRoute
              exact
              path="/users/:userId"
              component={UserDetailsRoute}
              />
              <Route path="/not-found" component={NotFound} />
            <Redirect to="/not-found" /> */}
          
      </Routes>
    </Router>
  );
}

export default App;
