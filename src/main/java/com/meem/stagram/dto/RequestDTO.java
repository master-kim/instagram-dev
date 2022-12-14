package com.meem.stagram.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 설명 : RequstDTO.java
 * ------------------------------------------------------------- 
 * 작업일          작업자    작업내용
 * ------------------------------------------------------------- 
 * 2022.10.20    김요한    최초작성 
 * 2022.10.24    김요한    로그인 , 회원가입 DTO 이너클래스 생성 
 * 2022.10.27    이강현    파일 데이터 담는 이너클래스 추가 (3개) - FileCreateRequest , FileUpdateRequest , PostCreateRequest
 * 2022.10.27    김요한    파일 담는 이너클래스 삭제 -> post , story 생성 시 file 관련 정보 가져오도록 변경
 * 2022.10.27    김요한    게시글 상세보기 담는 클래스 추가
 * 2022.11.07    김요한    팔로우 리스트 팔로우 걸기를 담는 이너클래스 추가 , 상세보기 이너클래스 추가
 * 2022.11.14    김요한    게시글 좋아요 담는 변수
 * 2022.11.19    김요한    댓글 작성 시 정보 담는 클래스 추가
 * 2022.11.21    김요한    댓글 수정 시 담는 클래스 추가
 * -------------------------------------------------------------
 */

@Getter
@AllArgsConstructor
public class RequestDTO {
    
    /**
     * @NoArgsConstructor       : 파라미터가 없는 기본 생성자를 생성
     * @AllArgsConstructor      : 모든 필드 값을 파라미터로 받는 생성자를 만듦
     * @RequiredArgsConstructor : final이나 @NonNull인 필드 값만 파라미터로 받는 생성자 만듦
     * 예제)
     * User user1 = new User();                          // @NoArgsConstructor
     * User user2 = new User("user2", "1234");           // @RequiredArgsConstructor
     * User user3 = new User(1L, "user3", "1234", null); // @AllArgsConstructor
     * */
    
    // 2022.10.24.김요한.추가 - UserLogin시 담는 영역
    @Getter
    public static class userLogin {
        
        @NotNull
        @NotEmpty(message = "유저 아이디에는 공백문자 또는 빈 값은 불가능합니다.")
        private String userId;
        
        @NotNull
        @NotEmpty(message = "유저 비밀번호에는 공백문자 또는 빈 값은 불가능합니다.")
        private String userPwd;
    }
    
    // 2022.10.24.김요한.추가 - UserRegister 시 담는 영역
    @Getter
    public static class userRegister {
        
        @NotNull
        @NotEmpty(message = "유저 아이디를 공백문자 또는 빈 값은 불가능합니다.")
        /* @Size(min = 2, max = 16, message = "아이디를 2~16자 사이로 입력해주세요.") */
        @Pattern(regexp="[a-zA-Z1-9]{6,12}", message = "유저 아이디는 영어와 숫자로 포함해서 6~16자리 이내로 입력해주세요.")
        String userId;
        
        @NotNull
        @NotEmpty(message = "유저 닉네임에는 공백문자 또는 빈 값은 불가능합니다.")
        String userNick;
        
        @NotNull
        @NotEmpty(message = "유저 이름에는 공백문자 또는 빈 값은 불가능합니다.")
        /* @Pattern(regexp="[a-zA-Z|가-힣]", message = "유저이름에는 한글과 영어만 입력가능합니다.") */
        @Size(min = 2, max = 8, message = "유저이름은 2~8자 사이로 입력해주세요.")
        String userName;
        
        @NotNull
        @NotEmpty(message = "유저 패스워드 부분에는 공백문자 또는 빈 값은 불가능합니다.")
        @Pattern(regexp="[a-zA-Z1-9]{6,18}", message = "비밀번호는 영어와 숫자로 포함해서 6~18자리 이내로 입력해주세요.")
        String userPwd;
        
        @NotNull
        @NotEmpty(message = "유저 패스워드 확인 부분에는 공백문자 또는 빈 값은 불가능합니다.")
        String userPwdChk;
        
        @Email
        @NotEmpty(message = "유저 이메일에 부분에는 공백문자 또는 빈 값은 불가능합니다.")
        String userEmail;
        
        @Pattern(regexp = "^01(?:0|1|[6-9])[.-]?(\\d{3}|\\d{4})[.-]?(\\d{4})$", message = "핸드폰 번호는 10 ~ 11 자리의 숫자만 입력 가능합니다.")
        @NotEmpty(message = "유저 핸드폰 부분에는 공백문자 또는 빈 값은 불가능합니다.")
        String userPhone;
        
    }
    
    // 2022.10.27.김요한.추가 - 게시글 상세보기
    @Getter
    public static class postDetail {
        @NotNull(message = "파일 폳더에 해당하는 데이터를 알려주세요.")
        private Integer postId;
    }
    
    // 2022.10.27.김요한.추가 - 게시글 작성 (파일 추가)
    @Getter
    public static class postCreate {
        
        @NotNull
        @NotEmpty(message = "파일 폳더에 해당하는 데이터를 알려주세요.")
        private String fileFolderType;
        
        @NotNull
        @NotEmpty(message = "유저 아이디에 해당하는 데이터를 알려주세요.")
        private String userId;
        
        @NotNull
        private String postContent;
        
        @NotNull
        private String postLocation;
        
        @NotNull
        @NotEmpty(message = "댓글 달기 여부에 데이터를 알려주세요.")
        private String postCommentYn;
        
        @NotNull
        @NotEmpty(message = "게시글 좋아요 여부에 데이터를 알려주세요.")
        private String postLikeYn;
        
    }
    
    // 2022.10.27.김요한.추가 - 게시글 수정 (파일 수정)
    @Getter
    public static class postUpdate {
        
        @NotNull
        @NotEmpty(message = "파일 폳더에 해당하는 데이터를 알려주세요.")
        private String fileFolderType;
        
        @NotNull
        @NotEmpty(message = "게시글에 아이디 값을 보내주세요.")
        private String postId;
        
        @NotNull
        @NotEmpty(message = "유저 아이디에 해당하는 데이터를 알려주세요.")
        private String userId;
        
        @NotNull
        private String postContent;
        
        @NotNull
        private String postLocation;
        
        @NotNull
        @NotEmpty(message = "댓글 달기 여부에 데이터를 알려주세요.")
        private String postCommentYn;
        
        @NotNull
        @NotEmpty(message = "게시글 좋아요 여부에 데이터를 알려주세요.")
        private String postLikeYn;
        
    }
    
    // 2022.10.27.김요한.추가 - 스토리 작성 (파일 추가)
    @Getter
    public static class storyCreate {
        
        @NotNull
        @NotEmpty(message = "파일 폳더에 해당하는 데이터를 알려주세요.")
        private String fileFolderType;
        
        @NotNull
        @NotEmpty(message = "유저 아이디에 해당하는 데이터를 알려주세요.")
        private String userId;
        
        @NotNull
        private String storyContent;
        
    }
    
    // 2022.11.07.김요한.추가 - 팔로우 리스트 팔로우 걸기
    @Getter
    public static class followInfo {
        @NotNull
        @NotEmpty(message = "유저 아이디가 정확하지 않습니다.")
        private String userId;
    }
    
    // 2022.11.14.김요한.추가 - 좋아요 누른 PostId 받기
    @Getter
    public static class postLike {
        @NotNull(message = "게시글 아이디값이 존재하지않습니다.")
        private Integer postId;
    }
    
    // 2022.11.19.김요한.추가 - 댓글 정보
    @Getter
    public static class postComment {
        @NotNull(message = "게시글 아이디값이 존재하지않습니다.")
        private Integer postId;
        @NotNull
        @NotEmpty(message = "빈 값은 게시 할 수 없습니다.")
        private String postComment;
    }
    
    // 2022.11.21.김요한.추가 - 댓글 수정 정보
    @Getter
    public static class updateComment {
        @NotNull(message = "게시글 아이디값이 존재하지않습니다.")
        private Integer commentId;
        @NotNull(message = "게시글 아이디값이 존재하지않습니다.")
        private Integer postId;
        @NotNull
        @NotEmpty(message = "댓글 구분 값이 존재하지않습니다.")
        private String commentType;
        @NotNull
        private String commentContent;
    }
    
    
}
