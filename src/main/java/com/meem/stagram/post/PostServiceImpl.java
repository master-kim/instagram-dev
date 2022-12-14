package com.meem.stagram.post;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.meem.stagram.common.utils.CommonUtils;
import com.meem.stagram.common.utils.FileUtils;
import com.meem.stagram.dto.RequestDTO;
import com.meem.stagram.file.FileEntity;
import com.meem.stagram.file.IFileRepository;
import com.meem.stagram.postComment.IPostCommentRepository;
import com.meem.stagram.postComment.PostCommentEntity;
import com.meem.stagram.postLike.IPostLikeRepository;
import com.meem.stagram.postLike.PostLikeEntity;

import lombok.RequiredArgsConstructor;

/**
 * 설명 : PostServiceImpl.java 
 * ------------------------------------------------------------- 
 * 작업일          작업자    작업내용
 * ------------------------------------------------------------- 
 * 2022.10.01    김요한    최초작성 
 * 2022.10.01    김요한    최초작성 
 * 2022.11.04    김요한    파일 정보 가져오기 공통 함수 사용 x 
 * 2022.11.08    김요한    메인 페이지 파일 가져오기 추가 및 네이밍 변경 
 * 2022.11.14    김요한    좋아요 기능 추가 
 * 2022.11.19    김요한    게시글 상세보기 댓글기능 , 좋아요기능 추가
 * 2022.11.21    김요한    게시글 상세보기 댓글 앞 유저 이미지 가져오기 , 댓글 삭제 , 수정 기능 추가
 * -------------------------------------------------------------
 */

/*
 * @RequiredArgsConstructor 이용 해석
 * 기존 방법
 * (1) Autowired
 * @Autowired
 * TestSampleRepository TestSampleRepository;
 * 
 * (2) 생성자 함수 생성
 * 
 * TestSampleRepository TestSampleRepository;
 * 
 * @Autowired
 * public TestServiceImpl(TestSampleRepository TestSampleRepository) {
 *     this.TestSampleRepository = TestSampleRepository;
 * }
 * 
 * (3) 롬복 이용
 * TestSampleRepository TestSampleRepository;
 * 
 * */

@Service("postserviceimpl")
@RequiredArgsConstructor
public class PostServiceImpl implements IPostService {
    
    private final IPostRepository ipostrepository;
    
    private final IFileRepository ifilerepository;
    
    private final IPostLikeRepository ipostlikerepository;
    
    private final IPostCommentRepository ipostcommentrepository;
    
    // 전체 리스트 조회
    public HashMap<String, Object> postList(String sessionUserId) throws Exception{
        // 결과값을 담는 배열 선언
        HashMap<String, Object> resultMap = new HashMap<>();
        
        // 해당 유저에 대한 followingList를 가져오는 스트링 배열 (공통 함수 처리)
        List<String> followingList = CommonUtils.followingList(sessionUserId);
        followingList.add(sessionUserId);

        List<PostEntity> postList = ipostrepository.findByUserIdIn(followingList);
        List<String> postIdList = CommonUtils.postIdList(postList);
        List<FileEntity> postImgList = ifilerepository.findByCommonIdInAndFileFolderType(postIdList , "post");
        List<String> userIdList = CommonUtils.postAndUserIdList(postList);
        List<FileEntity> postUserImgList = ifilerepository.findByCommonIdInAndFileFolderType(userIdList , "user");
        
        // 2022.11.14.김요한.추가 - 좋아요 리스트 가져오기
        List<Integer> postLikeCnt = new ArrayList<Integer>();
        // 좋아요 누가 했는지 알기 위한 리스트
        List<List<PostLikeEntity>> postLikeList = new ArrayList<List<PostLikeEntity>>();
        for (int postIdx=0; postIdx < postList.size(); postIdx++) {
            List<PostLikeEntity> postLike = ipostlikerepository.findBypostId(postList.get(postIdx).getPostId());
            postLikeList.add(postLike);
            postLikeCnt.add(postLike.size());
        } 
        
        // 2022.11.19.김요한.추가 - 댓글 리스트
        List<List<PostCommentEntity>> postCommentList = new ArrayList<List<PostCommentEntity>>();
        List<Integer> postCommentCnt = new ArrayList<Integer>();
        // 2022.11.21.김요한.추가 - 댓글 유저 이미지리스트
        List<FileEntity> postCommentUserImgList = new ArrayList<FileEntity>();
        
        for (int postIdx=0; postIdx < postList.size(); postIdx++) {
            List<PostLikeEntity> postLike = ipostlikerepository.findBypostId(postList.get(postIdx).getPostId());
            postLikeList.add(postLike);
            postLikeCnt.add(postLike.size());
            List<PostCommentEntity> postComment = ipostcommentrepository.findBypostId(postList.get(postIdx).getPostId());
            postCommentList.add(postComment);
            postCommentCnt.add(postComment.size());
            // 2022.11.21.김요한.수정 - 댓글에 이미지 가져오기
            for (int commentIdx=0; commentIdx < postComment.size(); commentIdx++) {
                FileEntity commentUserImg  = ifilerepository.findByCommonIdAndFileFolderType(postComment.get(commentIdx).getUserId().toString(), "user");
                postCommentUserImgList.add(commentUserImg);
            } 
        } 
        
        
        // 실질적인 결과값
        resultMap.put("postList", postList);
        resultMap.put("postImgList", postImgList);
        resultMap.put("postUserImgList", postUserImgList);
        
        resultMap.put("postLikeList", postLikeList);
        resultMap.put("postLikeCnt", postLikeCnt);
        
        resultMap.put("postCommentList", postCommentList);
        resultMap.put("postCommentUserImgList", postCommentUserImgList);
        resultMap.put("postCommentCnt", postCommentCnt);
        
        return resultMap;
    }
    
    // 게시글 상세 페이지 조회
    // 2022.11.21.김요한.수정 - 소스정리 및 추가
    public HashMap<String, Object> postDetail(Integer postId) throws Exception{
        
        HashMap<String, Object> resultMap  = new HashMap<String, Object>();
        String strPostId = Integer.toString(postId);
        //선택한 게시글에 대한 postId로 post 데이터 가져와서 리턴
        PostEntity postInfo = ipostrepository.findByPostId(postId);
        FileEntity postImg = ifilerepository.findByCommonIdAndFileFolderType(strPostId, "post");
        
        String postUserId = postInfo.getUserId().toString();
        FileEntity postUserImg = ifilerepository.findByCommonIdAndFileFolderType(postUserId, "user");
        
        List<PostCommentEntity> postComment = ipostcommentrepository.findBypostId(postId);
        List<FileEntity> postCommentUserImgList = new ArrayList<FileEntity>();
        List<PostLikeEntity> postLike = ipostlikerepository.findBypostId(postId);
        
        // 2022.11.21.김요한.수정 - 댓글에 이미지 가져오기
        for (int commentIdx=0; commentIdx < postComment.size(); commentIdx++) {
            FileEntity commentUserImg  = ifilerepository.findByCommonIdAndFileFolderType(postComment.get(commentIdx).getUserId().toString(), "user");
            postCommentUserImgList.add(commentUserImg);
        } 
        
        resultMap.put("resultCd", "SUCC");
        resultMap.put("resultMsg", "성공");
        resultMap.put("postInfo", postInfo);
        resultMap.put("postImg", postImg);
        resultMap.put("postUserImg", postUserImg);
        resultMap.put("postCommentList", postComment);
        resultMap.put("postCommentUserImgList", postCommentUserImgList);
        resultMap.put("postCommentCnt", postComment.size());
        resultMap.put("postLikeList", postLike);
        resultMap.put("postLikeCnt", postLike.size());
        
        return resultMap ;
    }
    
    // 게시글 작성
    public HashMap<String, Object> postCreate(MultipartFile fileInfo , RequestDTO.postCreate postCreateInfo) throws Exception{
        
        // 결과값을 담는 배열 선언
        HashMap<String, Object> resultList = new HashMap<>();
        
        // 파일 생성에 대한 결과값을 담는 해시맵
        HashMap<String, Object> fileResult = new HashMap<>();
        
        // 파일 생성 시 필요한 String 값
        String folderType = postCreateInfo.getFileFolderType().toString();
        
        // 게시글 테이블 (t_post) 에 데이터 넣기 위한 정보
        PostEntity fileSaveInfo = PostEntity.postCreate(postCreateInfo);
        
        // 반환하는 값은 int 이지만 FileUtils.fileCreate > kind_id 값을 통해 구분해야하므로 String으로 변경
        String postResult = ipostrepository.save(fileSaveInfo).getPostId().toString();
        
        if (postResult.equals(null) || postResult.equals("")) {
            resultList.put("resultCd" , "FAIL");
            resultList.put("resultMsg" , "게시글 생성이 오류");
        } else {
            fileResult = FileUtils.fileCreate( folderType ,postResult , fileInfo);
            
            if (fileResult.get("resultCd").toString().toUpperCase().equals("FAIL")) {
                resultList.put("resultCd" , fileResult.get("resultCd"));
                resultList.put("resultMsg" , fileResult.get("resultMsg"));
            } else {
                resultList.put("resultCd" , "SUCC");
                resultList.put("resultMsg" , "정상작동");
            }
        }
        
        return resultList;
    }

    // 게시글 수정
    public HashMap<String, Object> postUpdate(MultipartFile fileInfo, RequestDTO.postUpdate postUpdateInfo) throws Exception {
        
        // 결과값을 담는 해시맵
        HashMap<String, Object> resultList = new HashMap<>();
        
        // 파일 생성에 대한 결과값을 담는 해시맵
        HashMap<String, Object> fileResult = new HashMap<>();
        
        // 파일 생성 시 필요한 String 값
        String folderType = postUpdateInfo.getFileFolderType().toString();
        
        /**
         * int     : 산술 연산이 가능하다. null로 초기화 할 수 없다.
         * integer : null 값 처리가 용이하기 때문에 SQL과 연동할 경우 처리가 용이하다.
         * */
        
        // 기존 데이터 CreateDt 가져오기위해 Select
        PostEntity postList = ipostrepository.findByPostId(Integer.parseInt(postUpdateInfo.getPostId().toString()));
        
        // 게시글 테이블 (t_post) 에 데이터 넣기 위한 정보
        PostEntity postUpdate = PostEntity.postUpdate(postUpdateInfo , postList);
        
        // 반환하는 값은 int 이지만 FileUtils.fileCreate > kind_id 값을 통해 구분해야하므로 String으로 변경
        String postId = ipostrepository.save(postUpdate).getPostId().toString();
        
        if (postId.equals(null) || postId.equals("")) {
            resultList.put("resultCd" , "FAIL");
            resultList.put("resultMsg" , "게시글 생성이 오류");
        } else {
            fileResult = FileUtils.fileUpdate( folderType , postId , fileInfo);
            
            if (fileResult.get("resultCd").toString().toUpperCase().equals("FAIL")) {
                resultList.put("resultCd" , fileResult.get("resultCd"));
                resultList.put("resultMsg" , fileResult.get("resultMsg"));
            } else {
                resultList.put("resultCd" , "SUCC");
                resultList.put("resultMsg" , "정상작동");
            }
        }
        
        return resultList;
    }
    
    // 2022.11.19.김요한.추가 - 게시글 좋아요 기능 (상세보기 포함)
    public HashMap<String, Object> postDoLike(String sessionUserId , RequestDTO.postLike postLikeInfo) throws Exception {
        // 결과값을 담는 해시맵
        HashMap<String, Object> resultMap = new HashMap<>();
        Integer postId = postLikeInfo.getPostId();
        List<PostLikeEntity> postList = ipostlikerepository.findByPostIdAndUserId(postId , sessionUserId);
        // 좋아요 추가
        if (postList.size() == 0) {
            PostLikeEntity doPostLike = PostLikeEntity.doPostLike(sessionUserId , postId);
            ipostlikerepository.save(doPostLike);
        } else {
        // 좋아요 삭제
            ipostlikerepository.deleteByLikeId(postList.get(0).getLikeId());
        }
        
        resultMap.put("resultCd", "SUCC");
        resultMap.put("resultMsg", "정상작동");
        
        return resultMap;
    }
    
    // 2022.11.19.김요한.추가 - 게시글 댓글 기능 (상세보기 포함)
    public HashMap<String, Object> postDoComment(String sessionUserId, RequestDTO.postComment postCommentInfo) throws Exception {
        
        // 결과값을 담는 해시맵
        HashMap<String, Object> resultMap = new HashMap<>();
        
        PostCommentEntity doPostComment = PostCommentEntity.doPostComment(sessionUserId , postCommentInfo);
        ipostcommentrepository.save(doPostComment);
        
        resultMap.put("resultCd", "SUCC");
        resultMap.put("resultMsg", "정상작동");
        
        return resultMap;
    }
    
    // 2022.11.21.김요한.추가 - 게시글 댓글 수정 ,삭제 
    public HashMap<String, Object> updateComment(String sessionUserId, RequestDTO.updateComment updateCommentInfo) throws Exception {
        // 결과값을 담는 해시맵
        HashMap<String, Object> resultMap = new HashMap<>();
        String commentType = updateCommentInfo.getCommentType().toString();
        
        if (commentType.equals("D")) {
            ipostcommentrepository.deleteByCommentId(updateCommentInfo.getCommentId());
        } else {
            PostCommentEntity doPostComment = PostCommentEntity.updateComment(sessionUserId , updateCommentInfo);
            ipostcommentrepository.save(doPostComment);
        }
        
        resultMap.put("resultCd", "SUCC");
        resultMap.put("resultMsg", "정상작동");
        
        return resultMap;
    }
    
    
}