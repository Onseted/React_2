import './App.css';
import {useState, useEffect} from 'react';
import {Link, Routes, Route, useParams, useNavigate} from 'react-router-dom'; 

function Header(props) 
{
  return <header>
    <h1><Link to="/index.html">WEB</Link></h1>
  </header>
}
function Nav (props) //props는  
{
  return <nav> 
    <ol> 
      {props.data.map(element => <li key={element.id}>  
        <Link to={'/read/'+element.id}>
          {element.title}
          </Link></li>)}  
    </ol>
  </nav>
}
function Article(props)
{
  return <article>
  <h2>{props.title}</h2>
  {props.body}
  </article>;
}
function Read(props)
{
  const params = useParams(); 
  const id = Number(params.id); 
  const [title, setTitle] = useState(null); 
  const [body, setBody] = useState(null); 
  useEffect(()=>{
    fetch('http://localhost:3333/topics/'+id)
    .then(type=>type.json())
    .then(result=>{
      setTitle(result.title);
      setBody(result.body);
    });
  },[id]);
  //id가 바뀔 때마다 서버와 통신해야 하니까!
  //글을 추가하고, 목록을 refresh할 수 있어야 함. 
  return <Article title={title} body={body}></Article>
}

function Create (props) 
{
  return<article>
    <h1>Create</h1>
    <form action='/api/create' onSubmit={evt=>{
      evt.preventDefault(); 
      const title = evt.target.title.value; 
      /*form tag-> target / title-> 이름이 target인 것 / value는 그 값*/
      const body = evt.target.body.value; 
      props.onCreate(title, body); 
    }}>
      <p><input type="text" name="title" placeholder='제목'/></p>
      <p><textarea name="body" placeholder='본문'></textarea></p>
      <p><input type="submit" value='생성'></input></p>
    </form>
  </article>  
}

function App() {
  const [topics, setTopics] = useState([]);
  const navigate = useNavigate();
  function refreshTopics() {
    fetch('http://localhost:3333/topics')
      .then(type=>type.json())
      .then(result=>{setTopics(result);});
  }
  useEffect(()=>{
    refreshTopics();
  },[]);
  return (
    <div style={{border:'1px solid red'}}> 
      <Header></Header>
      <Nav data={topics}></Nav> 
      {/*content*/}
      <Routes>
        <Route path="/" element={<Article title="welcome" body="Hello, wel!!!"></Article>}></Route> 
        <Route path="/read/:id" element={<Read data={topics}></Read>}></Route>
        <Route path='/create' element={<Create onCreate={(title, body)=>{
          const param = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({title:title, body:body}) 
            // body의 데이터 유형은 반드시 "Content-Type" 헤더와 일치해야 함
            //param의 형식으로 db에 fetch하게됨
          }
          fetch('http://localhost:3333/topics/', param)
          .then(type=>type.json())
          .then(result=>{
            navigate('/read/'+result.id); 
          });
          refreshTopics(); 
        }}></Create>}></Route>
      </Routes>
      <Link to="/create">create</Link>
    </div>
  );
}

export default App;