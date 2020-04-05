import React, { useEffect, useState, memo, useCallback } from "react";
import ReactDOM from "react-dom";
import useScrollBottom from 'react-scroll-bottom-hook'

let renderCount = 0
const Comment = memo(function ({ name, id, onClick }) {
  renderCount += 1

  return (
    <li onClick={() => onClick(id)} style={{ cursor: "pointer" }}>
      {id}: {name}
    </li>
  );
});

function App() {
  renderCount = 1

  const [isBottom, scrollRef] = useScrollBottom()
  const [comments, setComments] = useState([]);

  const fetchData = async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/comments")
    const data = await response.json()
    setComments([...comments, ...data.slice(0, 9)])
  }

  useEffect(() => {
    fetchData()
  }, []);

  useEffect(function () {
    if (isBottom) {
      fetchData()
    }
  }, [isBottom]);

  useEffect(function () {
    console.log(renderCount)
  });

  const handleClick = useCallback(id => {
    setComments(comments => comments.filter(c => c.id !== id));
  }, []);

  return (
    <ul style={{ height: '100px', overflowY: 'auto' }} ref={scrollRef} >
      {comments.map((item, i) => {
        return <Comment {...item} key={item.id} onClick={handleClick} />;
      })}
    </ul>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
