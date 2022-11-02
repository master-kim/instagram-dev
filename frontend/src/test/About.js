import React, {useState, useEffect} from 'react';

const About = ()=>{
  const [message, setMessage] = useState("");
  useEffect(() => {
  fetch('/about')
  .then(response => response.text())
  .then(message => {
  setMessage(message);
  });
  },[])
  return (
    <div>
      어바웃
      <div>{message}</div>
    </div>
  );
}

export default About;