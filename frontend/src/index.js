import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { CookiesProvider } from 'react-cookie';

/* 
 * 설명 : index.js
 * ------------------------------------------------------------- 
 * 작업일         작업자    작업내용
 * ------------------------------------------------------------- 
 * 2022.10.11   김요한    최초작성
 * 2022.10.26   김요한    CookiesProvider (모든 페이지에 쿠키 사용 위해)
 * -------------------------------------------------------------
*/

ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider> 
      <App />
    </CookiesProvider> 
  </React.StrictMode>,
  document.getElementById('root')
);
