package com.meem.stagram.common.error;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

/**
 * 설명 : CommonErrorController.java
 * ------------------------------------------------------------- 
 * 작업일          작업자    작업내용
 * ------------------------------------------------------------- 
 * 2022.11.03    김요한    최초작성 
 * -------------------------------------------------------------
 */

@RestController
@RequiredArgsConstructor 
public class CommonErrorController implements ErrorController{
    
    //@GetMapping("/error")
    //public String handleError() {
    //    return "서버 통신 Error입니다.";
    //}
    //
    //public String getErrorPath() {
    //    return "/error";
    //}
    
  
}