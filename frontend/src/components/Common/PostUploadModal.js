import React, { useEffect, useRef, useState } from "react";
import "./PostUploadModal.css";
import { useLocation, useNavigate } from "react-router-dom";
import { FiMoreHorizontal, FiSend } from "react-icons/fi";
import { BsArrowLeft, BsFillCloudDownloadFill } from "react-icons/bs";
import {IoMdHeartEmpty, IoIosArrowBack, IoIosArrowForward, IoIosClose} from "react-icons/io";
import { BsChat, BsEmojiSmile, BsBookmark } from "react-icons/bs";
import { IconContext } from "react-icons/lib";
import * as commonAxios from "../../commonUtils/Axios";
import { useCookies } from 'react-cookie';

/*
 * 설명 : PostUploadModal.js
 * -------------------------------------------------------------
 * 작업일         작업자    작업내용
 * -------------------------------------------------------------
 * 2022.11.29    김영일    최초작성
 * 2022.12.07    김요한    모달창을 통한 게시글 업로드 추가
 * -------------------------------------------------------------
 */
function PostUploadModal({ open, onClose }) {

  const [cookies, setCookie , removeCookie] = useCookies(['loginCookie']); // 쿠키 훅 

  const fileInput = useRef(null);
  const navigate = useNavigate();

  const goToBack = () => {
    noneUpload();
    setPostImages([]);
    setDataImages();
  };
  const [postImages, setPostImages] = useState([]);
  const [dataImages, setDataImages] = useState();
  const [fileFolderType] = useState("");
  const [userId] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postLocation] = useState("");
  const [postCommentYn] = useState("");
  const [postLikeYn] = useState("");

  const postData = {
    postImages,
    fileFolderType,
    userId,
    postContent,
    postLocation,
    postCommentYn,
    postLikeYn
  }

  useEffect(()=>{
    if(!open){setPostImages([])}
  })
  const onPostImage = (e) => {
    if (e.target.files[0]) {
      // 2022.11.12.김요한.추가 - userImage 는 화면에 바뀌는 데이터 형식(String) , dataImg는 실질적인 데이터 전송 형식 (File) // 합칠 수 있으면 합치길 원함!
      setPostImages(() => e.target.files[0]);
      setDataImages(() => e.target.files[0]);
    } else {
      //업로드 취소할 시
      setPostImages([]);
    }

    //FileReader 를 통해 비동기로 읽을 수 있음.
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setPostImages(reader.result);
      } else {
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleSubmit = async () => {

    postData.fileFolderType = "post";
    postData.userId = cookies.loginId;
    postData.postLocation = "";
    postData.postCommentYn = "Y";
    postData.postLikeYn = "Y";

    if (postImages.length >= 1) {
      // 2022.11.12.김요한.추가 - FormData 선언 및 inputData => 이 부분은 헤더를 application/json 로 데이터 변경
      const formData = new FormData();
      const inputs = new Blob([JSON.stringify(postData)], {type: "application/json",});
      formData.append("fileInfo", dataImages);
      formData.append("postInfo", inputs);

      await commonAxios.MultiPart("/post/postCreate",formData,callback);

      function callback(data) {
        if (data[0].resultCd === "SUCC") {
          setChooseModal(false);
          navigate("/postList");
        }
      }
    } else {
      const data = [
        {
          resultMsg: "적어도 한장의 사진을 올려주셔야 합니다.",
        },
      ];
      alert(data);
    }
  };

  // 오픈 아니면 안일어남.
  if (!open) return null && setPostImages([]);

  {
    /* 사진 업로드 페이지 */
  }
  function noneUpload() {
    return (
      <>
        <div className="post-upload-box-inner">
          <div
            className="post-upload-box-title"
            style={{ justifyContent: "center" }}
          >
            <div style={{ "font-size": "1.8em" }}>새 게시물 만들기</div>
          </div>
          <div
            className="post-upload-box-inner-inner"
            style={{ display: "block", padding: "15%" }}
          >
            {/* 사진 넣어지는 부분 */}
            <div style={{ width: "100%", textAlign: "center" }}>
              <BsFillCloudDownloadFill style={{ fontSize: "8rem" }} />
            </div>
            <div
              style={{ textAlign: "center", fontSize: "2rem", margin: "15px" }}
            >
              사진과 동영상을 여기에 끌어다 놓으세요
            </div>
            <div style={{ textAlign: "center" }}>
              <label for="upload"
                style={{
                  cursor: "pointer",
                  padding: "8px 6px",
                  background: "rgb(0,169,246)",
                  color: "white",
                  "border-radius": "10px",
                  "font-size": "1.5rem",
                }}
              > 컴퓨터에서 선택
              </label>
              <input
                id="upload"
                style={{ display: "none" }}
                onChange={onPostImage}
                ref={fileInput}
                type="file"
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  {
    /* 사진 업데이트 직전 페이지! */
  }
  function uploadedPage() {
    return (
      <>
        <div className="post-upload-box-inner">
          <div className="post-upload-box-title">
            <div style={{ width: "3vw" }}>
              <BsArrowLeft
                style={{
                  "font-size": "20pt",
                  display: "flex",
                  cursor: "pointer",
                }}
                onClick={() => goToBack()}
              />
            </div>
            <div>
                <button style={{ border:"none" , fontSize: "1.5em", color: "rgb(0 149 246)",cursor: "pointer"}} onClick={() => handleSubmit()}>공유하기</button>
            </div>
            {/* <button className="register-button" style={{ "font-size": "1.5em", color: "rgb(0 149 246)", cursor: "pointer", }} onClick={() => handleSubmit()}>
              공유하기
            </button> */}
          </div>
          <div className="post-upload-box-inner-inner">
            {/* 사진 넣어지는 부분 */}
            <div className="img-post-upload">
              <img
                className="img-header-post"
                src={postImages}
                alt="post"
              />
            </div>
            {/* 글쓰는 부분 */}
            <div className="post-upload-footer-post">
              <div className="post-upload-username">
                <div className="infos-post">
                  <img
                    className="img-header-post"
                    src={cookies.loginUserImg.fileLocation}
                    alt="post"
                  />
                  <p>{cookies.loginNick}</p>
                </div>
              </div>
              <textarea rows="10" cols="40" placeholder="문구입력.." style={{
                  border: "0",
                  resize: "none",
                  margin: "0 10px 10px 10px",
                  "font-size": "1.7rem",
                }}
                onChange={(e)=>setPostContent(e.target.value)}></textarea>
              <IconContext.Provider value={{ size: "30px" }}>
                <div className="post-upload-engagement-post">
                  <div className="icons-1">
                    <div className="icon">
                      <IoMdHeartEmpty />
                    </div>
                    <div className="icon">
                      <BsChat />
                    </div>
                    <div className="icon">
                      <FiSend />
                    </div>
                  </div>
                  <div className="icon">
                    <BsBookmark />
                  </div>
                </div>
              </IconContext.Provider>
              <div className="post-upload-legend">
                <p>
                </p>
              </div>
              <div className="post-upload-time-post">
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div onClick={onClose} className="header-modal-container">
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="post-upload-box"
        >
          {postImages == false ? noneUpload() : uploadedPage()}
        </div>
        <div class="upload-close" onClick={onClose}  >
          <IoIosClose style={{ width: "5vw", height: "9vh" }} />
        </div>
      </div>

    </>
  );
}
export default PostUploadModal;
