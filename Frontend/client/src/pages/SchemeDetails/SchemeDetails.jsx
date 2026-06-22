import { useParams } from "react-router-dom";
import schemes from "../../data/schemesData";

function SchemeDetails(){

const { id } = useParams();

const scheme =
schemes.find(
(s)=>s.id===Number(id)
);

if(!scheme){

return(

<div className="p-20 text-center">

<h1 className="text-5xl">
Scheme Not Found
</h1>

</div>

);

}

return(

<div className="min-h-screen bg-gray-50">

<div className="relative">

<img
src={scheme.image}
alt={scheme.title}
className="w-full h-[420px] object-cover"
/>

<div className="absolute inset-0 bg-black/40 flex items-end">

<div className="text-white p-10">

<span className="bg-green-600 px-4 py-2 rounded-full">

{scheme.category}

</span>

<h1 className="text-5xl font-bold mt-5">

{scheme.title}

</h1>

</div>

</div>

</div>

<div className="max-w-6xl mx-auto p-8">

<div className="bg-white rounded-3xl shadow-lg p-8">

<h2 className="text-3xl font-bold mb-5">

Overview

</h2>

<p className="text-lg text-gray-700">

{scheme.description}

</p>

</div>

<div className="grid md:grid-cols-2 gap-6 mt-8">

<div className="bg-white rounded-3xl p-8 shadow">

<h2 className="text-2xl font-bold mb-5">

Eligibility

</h2>

<p>

{scheme.eligibility}

</p>

</div>

<div className="bg-white rounded-3xl p-8 shadow">

<h2 className="text-2xl font-bold mb-5">

Application Deadline

</h2>

<p>

{scheme.deadline}

</p>

</div>

</div>

<div className="grid md:grid-cols-2 gap-6 mt-8">

<div className="bg-white rounded-3xl p-8 shadow">

<h2 className="text-2xl font-bold mb-5">

Benefits

</h2>

<ul className="space-y-3">

{

scheme.benefits?.map((b,index)=>(

<li key={index}>

✅ {b}

</li>

))

}

</ul>

</div>

<div className="bg-white rounded-3xl p-8 shadow">

<h2 className="text-2xl font-bold mb-5">

Required Documents

</h2>

<ul className="space-y-3">

{

scheme.documents?.map((d,index)=>(

<li key={index}>

📄 {d}

</li>

))

}

</ul>

</div>

</div>

<div className="mt-10 flex justify-center">

<a

href={scheme.applyLink}

target="_blank"

rel="noreferrer"

className="bg-green-600 text-white px-10 py-4 rounded-2xl text-xl"

>

Apply Now

</a>

</div>

</div>

</div>

);

}

export default SchemeDetails;
