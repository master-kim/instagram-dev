package com.meem.stagram.user;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    @PostMapping("/userLogin")
    public List<HashMap<String, Object>> userLogin(HttpServletRequest request , @RequestBody @Valid RequestDTO.userLogin userLogin) throws Exception{
        
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
    @PostMapping("/userLogout")
    public HashMap<String, Object> userLogout(HttpServletRequest request) throws Exception{
        
        HashMap<String, Object> resultMap = new HashMap<>();
        
        // 세션에 유저 아이디 저장
        HttpSession session = request.getSession();
        session.removeAttribute("user_id");
        
        resultMap.put("resultCd", "SUCC");
        resultMap.put("resultMsg", "로그아웃에 성공하였습니다.");
        
        return resultMap;
    }
    
    /**
     * 2022.10.21.김요한.추가 - 유저 회원가입
     * 2022.10.24.김요한.추가 - @Valid 추가 - 잘못 입력시 Exception 오류 처리
     * */
    @PostMapping("/userRegister")
    public List<HashMap<String, Object>> userRegister(HttpServletRequest request , @RequestBody @Valid RequestDTO.userRegister userRegister) throws Exception{
        
        HttpSession session = request.getSession();
        
        List<HashMap<String, Object>> resultList = new ArrayList<>();
        
        HashMap<String, Object> resultMap = new HashMap<>();
        
        try {
            resultMap = iuserservice.userSave(userRegister);
        } catch (Exception e) {
            resultMap.put("resultCd", "FAIL");
            resultMap.put("resultMsg", e.getMessage().toString());
        }
        
        resultList.add(resultMap);
        
        return resultList;
    }
    
    /**
     * 2022.10.27.김요한.추가 - 개인페이지 (personal-page)
     * */
    @PostMapping("/personalPage")
    public HashMap<String, Object> personalPage(HttpServletRequest request) throws Exception{
        
        HashMap<String, Object> resultMap = new HashMap<>();
        // 세션에 유저 아이디 저장
        HttpSession session = request.getSession();
        String userId = session.getAttribute("user_id").toString();
        
        try {
            resultMap = iuserservice.findByPersnolPage(userId);
        } catch (Exception e) {
            resultMap.put("resultCd", "FAIL");
            resultMap.put("resultMsg", e.getMessage().toString());
        }
        
        return resultMap;
    }
    
}