import { useState } from "react";

import SchemeCard from "../../components/SchemeCard/SchemeCard";

import schemes from "../../data/schemesData";

function Schemes(){

const [search,setSearch]=useState("");

const [category,setCategory]=useState("All");

const filtered=schemes.filter((scheme)=>{

const matchSearch=

scheme.title
.toLowerCase()
.includes(search.toLowerCase());

const matchCategory=

category==="All"

||

scheme.category===category;

return matchSearch && matchCategory;

});

return(

<div className="min-h-screen bg-gray-100">

<div className="bg-green-700 text-white py-16">

<h1 className="text-center text-5xl font-bold">

Government Schemes

</h1>

<p className="text-center mt-4">

Explore schemes for farmers

</p>

</div>

<div className="max-w-7xl mx-auto p-8">

<input

className="w-full p-4 rounded-xl mb-6"

placeholder="Search schemes"

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>

<select

className="p-3 rounded mb-8"

value={category}

onChange={(e)=>setCategory(e.target.value)}

>

<option>All</option>

<option>Financial</option>

<option>Insurance</option>

<option>Loan</option>

<option>Soil</option>

<option>Irrigation</option>

</select>

<div className="grid md:grid-cols-3 gap-8">

{

filtered.map((scheme)=>(

<SchemeCard

key={scheme.id}

{...scheme}

/>

))

}

</div>

</div>

</div>

);

}

export default Schemes;
