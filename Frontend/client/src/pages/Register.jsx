import { useState } from "react";

 function Register(){

const [form,setForm]=useState({
name:"",
email:"",
password:"",
role:"farmer"
});

const changeHandler=(e)=>{
setForm({
...form,
[e.target.name]:e.target.value
});
};

const submitHandler=async(e)=>{

e.preventDefault();
console.log("Register clicked");
const res=await fetch(
"http://localhost:5000/api/auth/register",
{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(form)
}
);

const data=await res.json();

console.log(data);

alert(data.message);

};

return(

<div>

<h1>Register</h1>

<form onSubmit={submitHandler}>

<input
name="name"
placeholder="Name"
onChange={changeHandler}
/>

<br/>

<input
name="email"
placeholder="Email"
onChange={changeHandler}
/>

<br/>

<input
name="password"
placeholder="Password"
onChange={changeHandler}
/>

<br/>

<select
name="role"
onChange={changeHandler}
>

<option value="farmer">
Farmer
</option>

<option value="buyer">
Buyer
</option>

<option value="storage_owner">
Storage Owner
</option>

</select>

<br/>

<button type="submit">
Register
</button>

</form>

</div>

);

}
export default Register;