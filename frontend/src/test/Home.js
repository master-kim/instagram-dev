import React, {useState, useEffect} from 'react';

const Home = ()=>{
  const [message, setMessage] = useState("");
useEffect(() => {
fetch('/home')
.then(response => response.text())
.then(message => {
setMessage(message);
});
},[])

  return (
    <div>
      홈 입니다.
      <div>{message}</div>
    </div>
  );
}

export default Home;