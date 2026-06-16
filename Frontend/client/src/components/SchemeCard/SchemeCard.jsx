import { Link } from "react-router-dom";

function SchemeCard({

id,
title,
image,
category,
description

}){

return(

<div
className="bg-white rounded-3xl overflow-hidden shadow-lg hover:scale-105 transition"
>

<img

src={image}

alt={title}

className="w-full h-56 object-cover"

/>

<div className="p-6">

<span
className="bg-green-100 text-green-700 px-3 py-1 rounded-full"

>

{category}

</span>

<h2 className="text-2xl font-bold mt-4">

{title}

</h2>

<p className="mt-4 text-gray-600">

{description}

</p>

<Link to={`/schemes/${id}`}>

<button

className="mt-6 w-full bg-green-600 text-white p-3 rounded-xl"

>

View Details

</button>

</Link>

</div>

</div>

);

}

export default SchemeCard;
