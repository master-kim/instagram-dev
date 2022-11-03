// React 선언
import React, { useState , useEffect } from 'react';
// 해당 페이지 css
 import './footer.css'

/* 
 * 설명 : PostList.js
 * ------------------------------------------------------------- 
 * 작업일         작업자    작업내용
 * ------------------------------------------------------------- 
 * 2022.11.03    김영일    최초작성 
 * -------------------------------------------------------------
 */

function Footer() {

        return (
            <footer className="footer-suggestion" >
                <p>깃허브 주소 &bull; 개발자 소개 ......</p>
                <p>&copy; 2022 INSTAGRAM FROM META</p>
            </footer>
        )
}

export default Footer;