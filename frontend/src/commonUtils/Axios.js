import axios from 'axios'; // 액시오스

/* 
 * 설명 : Axios.js
 * ------------------------------------------------------------- 
 * 작업일         작업자    작업내용
 * ------------------------------------------------------------- 
 * 2022.10.11    김요한    최초작성 - 백엔드와 연결
 * 2022.10.19    김요한    axios 연결 공통화 및 params 추가
 * -------------------------------------------------------------
*/

export default async function Axios(url, params , callback) {

  await axios(
    {
      url: url,
      method: 'post',
      baseURL: 'http://localhost:9999',
      data: params,
      withCredentials: true,
    }
  ).then(function (response) {
    callback(response.data);
  })
  .catch((err) => {
    callback(err.response.data.errors);
  });
}