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
  const topic = props.data.filter(el=>el.id === id)[0]; 
  return <Article title={topic.title} body={topic.body}></Article>
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
  const [nextId, setNextId] = useState(3); //no-need
  const [topics, setTopics] = useState([]);
  const navigate = useNavigate();
  return (
    <div style={{border:'1px solid red'}}> 
      <Header></Header>
      <Nav data={topics}></Nav> 
      {/*content*/}
      <Routes>
        <Route path="/" element={<Article title="welcome" body="Hello, wel!!!"></Article>}></Route> 
        <Route path="/read/:id" element={<Read data={topics}></Read>}></Route>
        <Route path='/create' element={<Create onCreate={(title, body)=>{
          //topic의 불변성 보장
          const newTopics = [...topics]; 
          newTopics.push({id:nextId, title:title, body:body});
          setTopics(newTopics);
          navigate("/read/"+nextId);
          setNextId(nextId+1); 
        }}></Create>}></Route>
      </Routes>
      <Link to="/create">create</Link>
    </div>
  );
}

export default App;
/*
event : context이다. 
closure : 함수가 정의된 순간 함수가 가지고 있던 지역변수 element같은 것들 사라지지 않고 유지가 된다. 
-----> 다른 말로 하면, 태그가 형성되고 난 이후 버튼을 누르기에 id를 저장할 수 있나 싶은데, 자바스크립트는 그게 가능하다는 이야기.
filter : for문 대신, filter을 통해 원하는 조건의 데이터만 필터링해서 가져올 수 있다. 
-----> topics.filter((el)=>{el.id===2})
Routing : 페이지를 만드는 것? 
-----> 추후 설명 : 특정 url로 ui를 구성해 주는 것. (url <-> ui 연결)
-----> :id의 기능 = 가변적인 결과를 보여준다.
Params : id값을 얻을 수 있음.(어떻게? : 가변적으로 처리한 값을 알려줌(id를) 
Link를 통해서 URL을 바꾸는 것. 
read가 렌더링됨 (Route가 진행될 때, ':id'로 표기했기 때문에 뒤의 read태그가 읽히게 된다.)

<<create 기능 구현>>
push는 원본 객체 배열을 바꿈. 
concat은 원본의 복제본을 바꿈. 

props vs state : component외부에서 쓰느냐, 내부에서 쓰느냐. 
데이터 추가 : host
jason은 id값을 1씩 알아서 증가시켜 주면서 db에 저장한다. 
*/
/*
1. 강의 소스 코드 : https://www.dropbox.com/sh/1kjltwexxp9cryo/AABrKNB-VX8zlRC38Gwg-5Sfa/main-app/src?dl=0&preview=App.js&subfolder_nav_tracking=1
2. json (db 연습) : $ npx json-server --watch -p 3333 db.json
3. 새로운 라이브러리 : useNavigate / Route / Routes / Params
4. 새로운 함수 : filter(반복문 대체) / Params (from useParams)
*/