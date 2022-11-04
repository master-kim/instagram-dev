package com.meem.stagram.user;

import java.util.HashMap;
import java.util.List;

import org.springframework.stereotype.Service;

import com.meem.stagram.common.utils.CommonUtils;
import com.meem.stagram.common.utils.DataCipher;
import com.meem.stagram.dto.RequestDTO;
import com.meem.stagram.file.FileEntity;
import com.meem.stagram.file.IFileRepository;
import com.meem.stagram.follow.FollowEntity;
import com.meem.stagram.follow.IFollowRepository;
import com.meem.stagram.post.IPostRepository;
import com.meem.stagram.post.PostEntity;

import lombok.RequiredArgsConstructor;

/**
 * 설명 : UserServiceImpl
 * ------------------------------------------------------------- 
 * 작업일          작업자    작업내용
 * ------------------------------------------------------------- 
 * 2022.10.01    김요한    최초작성 
 * 2022.10.20    김요한    데이터 암호화 추가 (login) 
 * 2022.10.27    김요한    로그인 시 userId , userNick 넘겨주기 추가 
 * 2022.10.27    김요한    유저 프로필 가져오기 (파일 정보 가져오기 추가)
 * 2022.11.04    김요한    파일 정보 가져오기 공통 함수 사용 x 
 * -------------------------------------------------------------
 */


@Service("userserviceimpl")
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {
    
    private final IUserRepository iuserrepository;

    private final IPostRepository ipostrepository;
    
    private final IFollowRepository ifollowrepository;

    private final IFileRepository ifilerepository;
    
    //전체 리스트 조회
    public List<UserEntity> findAll() {
        
        List<UserEntity> resultList = iuserrepository.findAll();
        
        return resultList;
        
    }
    
    // 2022.10.20.김요한.수정 - 로그인 시 암호화된 데이터 확인 후 성공 여부 뿌려주기
    public HashMap<String, Object> findByUserId(RequestDTO.userLogin userLogin) throws Exception {
        
        HashMap<String, Object> result = new HashMap<>();
        
        List<UserEntity> userList = iuserrepository.findByUserId(userLogin.getUserId().toString());
        
        // 암호화 방식 : sha256 단방향 암호화 방식 (salt 함수 사용하지 않고 간단하게 구현) 
        String encUserPwd = DataCipher.encryptDataToString(userLogin.getUserId().toString(), userLogin.getUserPwd().toString());
        //String encUserPwd = param.get("password").toString();
            
        if (userList.size() == 0) {
            
            result.put("resultCd", "FAIL");
            result.put("resultMsg", "해당 아이디가 존재하지 않습니다.");
            
        } else {
            
            String userDbPwd = userList.get(0).userPwd;
            
            if (userDbPwd.equals(encUserPwd)) {
                result.put("resultCd", "SUCC");
                result.put("resultMsg" , "로그인에 성공하셨습니다.");
                
                // 2022.10.27.김요한.수정 - 로그인 시 userId , userNick 넘겨주기 추가 
                result.put("userId", userList.get(0).userId);
                result.put("userNick" , userList.get(0).userNick);
            } else {
                result.put("resultCd", "FAIL");
                result.put("resultMsg", "비밀번호가 맞지않습니다.");
            }
        }
        
        return result;
    }
    
    public HashMap<String, Object> userSave(RequestDTO.userRegister userRegister) throws Exception {
        
        HashMap<String, Object> result = new HashMap<>();
        
        String userId = userRegister.getUserId().toString();
        String userPwd = userRegister.getUserPwd().toString();
        
        List<UserEntity> userList = iuserrepository.findByUserId(userId);
        
        if (0 == userList.size()) {
            
            String encUserPwd = DataCipher.encryptDataToString(userId, userPwd);
            
            // 유저에 대한 정보 (t_user_info 테이블) 인서트
            UserEntity fileSaveInfo = UserEntity.UserRegister(userRegister , encUserPwd);
            iuserrepository.save(fileSaveInfo);
            
            // 유저에 대한 초기 팔로우 리스트 (t_follow 테이블) 인서트 
            FollowEntity userFollowCreate = FollowEntity.followCreate(userRegister);
            ifollowrepository.save(userFollowCreate);
            
            result.put("resultCd", "SUCC");
            result.put("resultMsg", "가입에 성공하셨습니다.");
            
        } else {
            result.put("resultCd", "FAIL");
            result.put("resultMsg", "동일한 아이디가 존재합니다.");
        }
        
        return result;
    }

    public HashMap<String, Object> findUserProfile(String userId) throws Exception {
        
        // 결과 값을 담는 해시맵
        HashMap<String, Object> resultMap = new HashMap<>();
        
        // 1단계 : 해당 유저에 대한 정보 가져오기 (클라이언트에 필요 정보 : userNick , userProfile , followerList)
        List<UserEntity> userList = iuserrepository.findByUserId(userId);
        
        // 2단계 : 해당 유저에 대한 followingList를 가져오는 스트링 배열 (공통 함수 이용)
        //      : -1 이유 CommonUtils.followingList 에는 나 자신을 포함하므로 나 자신을 빼기위함.
        List<String> strList = CommonUtils.followingList(userId);
        int followCnt = strList.size() - 1;
        
        // 3단계 : 해당 유저가 올린 게시글 개수 체크 및 게시물 리스트 가져오기
        List<PostEntity> postList = ipostrepository.findByUserId(userId);
        int postCnt = postList.size();
        
        // 4단계 : 해당 유저가 올린 게시물에 postId를 가져오는 공통 클래스
        List<String> postIdList = CommonUtils.postIdList(postList);
        // 5단계 : postIdList 를 가지고 해당 파일에 대한 정보를 가져오기
        List<FileEntity> fileList = ifilerepository.findByCommonIdInAndFileFolderType(postIdList , "post");
        // 아래 6단계 필요없음 (데이터를 가져올때 순서대로 가져오기때문에...)
        // 6단계 : postId + fileId 정보를 만들어주는 공통 클래스 
        //List<HashMap<String, Object>> resultList = CommonUtils.postListAndFileList(postList, fileList);
        
        resultMap.put("userProfile" , userList.get(0).getUserProfile().toString());
        resultMap.put("followCnt" , followCnt);                                       
        resultMap.put("postList" , postList);                                       
        resultMap.put("fileList" , fileList);                                       
        resultMap.put("postCnt" , postCnt);                                           
        resultMap.put("resultCd" , "SUCC");                                           
        resultMap.put("resultMsg" , "성공했습니다."); 
        
        return resultMap;                                                                    
    }
}

















