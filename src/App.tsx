/* eslint-disable no-undef */
/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React,{useState, useEffect} from 'react';
import { supabase } from './createClient';
import './App.css'

interface User {
  id: string;
  name: string;
  age: string;
}

const App: React.FC = () => {

  const [users, setUsers]=useState<User[]>([]);

  const [user, setUser]=useState<User>({ id: '', name: '', age: '' });

  const [user2, setUser2]=useState<User>({ id: '', name: '', age: '' });

  console.log(user2);

  useEffect(()=>{
    fetchUsers();
  }, []);


  async function fetchUsers(){ 
    const {data} = await supabase
    .from('users')
    .select('*')
    setUsers(data as User[]);

  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>){
    setUser((prevFormData)=>({
        ...prevFormData,
        [event.target.name]:event.target.value
    }));
  }

  function handleChange2(event: React.ChangeEvent<HTMLInputElement>){
    setUser2((prevFormData)=>({
        ...prevFormData,
        [event.target.name]:event.target.value
    }));
  }

  async function createUser(){
    await supabase
    .from('users')
    .insert({ name: user.name, age: user.age})

    fetchUsers();
  }

  async function deleteUser(userId: string){
    const {data, error}=await supabase
      .from('users')
      .delete()
      .eq('id', userId)

    fetchUsers()  

    if(error){
      console.log(error)
    }
    if(data){
      console.log(data)
    }
  }

  function displayUser(userId: string){

    users.forEach((user)=>{

      if(user.id==userId){
        setUser2({ id:user.id, name:user.name, age:user.age})
      }
    })
    }

  async function updateUser(userId: string){
    const { data, error } = await supabase
      .from('users')
      .update({ id:user2.id, name:user2.name, age:user2.age})
      .eq('id',userId)

      fetchUsers();

      if(error){
        console.log(error)
      }
      if(data){
        console.log(data)
      }
  }

  return (
    <div>
      <form onSubmit={createUser}>
        <input
          type="text"
          placeholder="Name"
          name="name"
          onChange={handleChange}
        />
        <input
          type="number"
          placeholder="Age"
          name="age"
          onChange={handleChange}
        />
        <button type="submit">Create</button>
      </form>

      <form onSubmit={() => updateUser(user2.id)}>
        <input
          type="text"
          name="name"
          onChange={handleChange2}
          defaultValue={user2.name}
        />
        <input
          type="number"
          name="age"
          onChange={handleChange2}
          defaultValue={user2.age}
        />
        <button type="submit">Save Changes</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.age}</td>
              <td>
                <button onClick={() => deleteUser(user.id)}>Delete</button>
                <button onClick={() => displayUser(user.id)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default App;
