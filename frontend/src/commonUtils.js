/* 
 * 설명 : commonUtils.js
 * ------------------------------------------------------------- 
 * 작업일         작업자    작업내용
 * ------------------------------------------------------------- 
 * 2022.10.24    김요한    최초작성 (공통 Utils 함수 모아두는 장소)
 * -------------------------------------------------------------
*/

export function isEqualCheck(i_value , i_value2) {
  if (i_value === i_value2 ) {
    return true;
  } else {
    return false;
  }
}

export function isNullOrEmpty(i_value) {

  if (i_value === ""
      || i_value === null
      || i_value === undefined
      || (i_value !== null && typeof i_value === "object" && !Object.keys(i_value).length)) {
      return true;
  } else {
      return false;
  }
}
