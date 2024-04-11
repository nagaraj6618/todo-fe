import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {AiFillDelete} from 'react-icons/ai'
import {TbEdit} from 'react-icons/tb'
import {GrStatusGood} from 'react-icons/gr'
import {GrStatusUnknown} from 'react-icons/gr'
import {BE_URL} from '../Info/BACK_END.js'


import './TodoList.css'
const TodoListComponent = () => {
  const [text,setText] = useState('')
  const [taskList,setTaskList] = useState([])
  const [button,setButton] = useState('Add')
  const [listId,setListId] = useState('')
  const [taskStatus,setTaskStatus] = useState(false)

  async function getAllTask(){
    try{
      const response = await axios.get(`${BE_URL}/list`)
      console.log(response.data);
       setTaskList(await (response).data);
    }
    catch(err){
      console.log(err);
    }
  }

  useEffect(() => {
    getAllTask();
  },[])
  const addTodoList = () => {
    if(button === 'Add' && text !== ''){
      try{
        axios.post(`${BE_URL}/list`,
          {
            text:text
          }
        ).then((response) => {
          console.log(response.data);
          getAllTask()
        })
      }
      catch(error){
        console.log(error)
      }
      
    }
    if(button === 'Update' && text !== ''){
      const id =listId;
      try{
        axios.patch(`${BE_URL}/list/${id}`,{
          text:text,
          id:id,
          status:taskStatus
        }).then((response) => {console.log(response)
        getAllTask()
        })
      }
      catch(err){
        console.log(err)
      }
      setButton('Add')
      setText('')
    }

  }



  function updateTodo(id,text) {
    
    setListId(id)
    setButton('Update')
    setText(text)
    console.log(text);
   
    
  }

  async function deleteAList (id){
    try{
      const response = axios.delete(`${BE_URL}/list/${id}`);
      console.log((await response).data)
      await getAllTask();
    }
    catch(err){

    }
   
    
  }
  const checkBoxHandler = () => {
    
    if(taskStatus === false){
      setTaskStatus(true)
      
    }
    if(taskStatus === true){
      setTaskStatus(false)
      
    }
    
    
  }
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodoList();
    }
  };

return (
  <div className='container'>
    <div className='container-box'>
      <div className='header'>
        <input
          onKeyPress={handleKeyPress}
          className='input'
          type='text'
          placeholder='Add task..'
          
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
     
      
        <button className='button' onClick={addTodoList}>{button}</button>
        </div>
    </div>
    <div>
      {taskList.map((task) => (
        <ul className='display-body-list' key={task._id}>
          <div className='list-container'>
            <li className='list-item'>
              <div className='text-container'>
                <input type='checkbox' onChange={checkBoxHandler} />
                {task.text}
              </div>
              <div className='button-container'>
                <div>
                  <button
                    onClick={() => updateTodo(task._id,task.text)}
                    className='upd-btn btn'
                  >
                    <TbEdit />
                  </button>
                </div>
                <button
                  className='dlt-btn btn'
                  onClick={() => deleteAList(task._id)}
                >
                  <AiFillDelete />
                </button>
              </div>
              <div className='status-bar'>
                {task.status ? <GrStatusGood /> : <GrStatusUnknown />}
              </div>
            </li>
          </div>
        </ul>
      ))}
    </div>
    
  </div>
);
};

export default TodoListComponent;