package com.meem.stagram.user;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.meem.stagram.dto.RequestDTO;

import lombok.RequiredArgsConstructor;

/**
 * 설명 : UserController.java
 * ------------------------------------------------------------- 
 * 작업일          작업자    작업내용
 * ------------------------------------------------------------- 
 * 2022.10.01    김요한    최초작성 
 * 2022.10.24    김요한    RequstDTO를 통해 Exception 관리 및 공통 데이터 관리 추가
 * 2022.10.26    김요한    로그아웃 추가 (세션 삭제)
 * 2022.11.03    김요한    프론트 데이터 처리 위해 유저로그인 , 회원가입 return 값 변경 ( HashMap -> List<HashMap> )
 * 2022.11.07    김요한    회원가입 시 이미지 파일 추가
 * 2022.11.12    김요한    회원가입 시 데이터 받는 형식 변경 (@RequestBody -> @RequestPart)
 * -------------------------------------------------------------
 */

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor 
public class UserController {
    
    private final IUserService iuserservice;
    
    /**
     * 2022.10.17.김요한.추가 - 로그인 프로세스 관리 컨트롤러
     * 2022.10.24.김요한.추가 - @Valid 추가 - 잘못 입력시 Exception 오류 처리
     * */
    @PostMapping("/Login")
    public List<HashMap<String, Object>> Login(HttpServletRequest request , @RequestBody @Valid RequestDTO.userLogin userLogin) throws Exception{
        
        // 세션에 유저 아이디 저장
        HttpSession session = request.getSession();
        String userId = userLogin.getUserId().toString();
        session.setAttribute("user_id", userId);
        
        // 결과 값을 담는 변수 선언
        List<HashMap<String, Object>> resultList = new ArrayList<>();
        HashMap<String, Object> resultMap = new HashMap<>();
        
        try {
            // 해당 유저에 대한 유효한 아이디 및 패스워드 점검처리
            resultMap = iuserservice.findByUserId(userLogin);
        } catch (Exception e) {
            e.printStackTrace();
            resultMap.put("resultCd", "FAIL");
            resultMap.put("resultMsg", e.getMessage().toString());
        }
        
        // 결과 List에 결과Map 담기
        resultList.add(resultMap);
        
        return resultList;
    }
    
    /**
     * 2022.10.26.김요한.추가 - 로그아웃 프로세스 관리 컨트롤러
     * */
    @PostMapping("/Logout")
    public List<HashMap<String, Object>> Logout(HttpServletRequest request) throws Exception{
        
        // 결과 값을 담는 변수 선언
        List<HashMap<String, Object>> resultList = new ArrayList<>();
        HashMap<String, Object> resultMap = new HashMap<>();
        
        // 세션에 유저 아이디 삭제
        HttpSession session = request.getSession();
        session.removeAttribute("user_id");
        resultMap.put("resultCd", "SUCC");
        resultMap.put("resultMsg", "로그아웃에 성공하였습니다.");
        // 결과 List에 결과Map 담기
        resultList.add(resultMap);
        
        return resultList;
    }
    
    /**
     * 2022.10.21.김요한.추가 - 회원가입 프로세스 컨트롤러
     * 2022.10.24.김요한.수정 - @Valid 추가 - 잘못 입력시 Exception 오류 처리
     * 2022.11.07.김요한.수정 - 파일 추가 예정
     * 2022.11.12.김요한.수정 - 데이터 받는 형식 변경 (@RequestBody -> @RequestPart)
     * */
    @PostMapping("/SignUp")
    public List<HashMap<String, Object>> SignUp(HttpServletRequest request , 
            @RequestPart("fileInfo") @Valid @NotNull(message = "파일을 넣어주세요.") MultipartFile fileInfo,
            @RequestPart("userInfo") @Valid RequestDTO.userRegister userRegister
            ) throws Exception{
        
        HttpSession session = request.getSession();
        
        List<HashMap<String, Object>> resultList = new ArrayList<>();
        
        HashMap<String, Object> resultMap = new HashMap<>();
        
        //try {
        //    resultMap = iuserservice.userSave(fileInfo , userRegister);
        //} catch (Exception e) {
        //    resultMap.put("resultCd", "FAIL");
        //    resultMap.put("resultMsg", e.getMessage().toString());
        //}
        resultMap.put("resultCd", "SUCC");
        
        resultList.add(resultMap);
        
        return resultList;
    }
    
    /**
     * 2022.10.27.김요한.추가 - 개인 페이지 프로세스(데이터 가져오기) 컨트롤러
     * */
    @PostMapping("/UserProfile")
    public HashMap<String, Object> UserProfile(HttpServletRequest request) throws Exception{
        
        HashMap<String, Object> resultMap = new HashMap<>();
        // 세션에 유저 아이디 저장
        HttpSession session = request.getSession();
        String userId = session.getAttribute("user_id").toString();
        
        try {
            resultMap = iuserservice.findUserProfile(userId);
        } catch (Exception e) {
            resultMap.put("resultCd", "FAIL");
            resultMap.put("resultMsg", e.getMessage().toString());
        }
        
        return resultMap;
    }
    
}