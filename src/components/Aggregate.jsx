import React, { useState,useEffect } from 'react'
import axios from 'axios'

const Aggregate = () => {
    

    const [branch1,setBranch1] = useState([])
    const [branch2,setBranch2] = useState([])
    const [branch3,setBranch3] = useState([])
    const [state,setState] = useState([])
    
    const [merged,setMerged] = useState([])
const [searchQuery, setSearchQuery] = useState('');

    

    const getList = async()=>{
    

    let endpoints = [
        'branch1.json',
        'branch2.json',
        'branch3.json'
      ];

      try {
        
     

    const res =  await  axios.all(endpoints.map((endpoint) => axios.get(endpoint)))
    if(res){
        setBranch1(res[0]?.data?.products)
        setBranch2(res[1]?.data?.products)
        setBranch3(res[2]?.data?.products)
    }
} catch (error) {
        console.log(error) 
}
    }
    useEffect(() => {
      getList()
    }, [])
    
useEffect(()=>{
    setState([...branch1,...branch2,...branch3])
},[branch1,branch2,branch3])


useEffect(()=>{

 const mergedData = Object.values(state.reduce((acc, item) => {
    const key = item.id + item.name;
    const revenue = +(item?.unitPrice * item?.sold)
  

    if (!acc[key]) {
      acc[key] = {...item,revenue}
    } else {
     
       acc[key].revenue += +(item.unitPrice * item.sold);

    }
    return acc;
  }, {}));
  setMerged(mergedData)
  //sum of Total Revenue
//   if(state){
//    const t= merged.reduce((a,i)=> a + i)
//    console.log(t)
//   }
  

},[state,searchQuery])


const handleSearch = event => {
    setSearchQuery(event.target.value);
  };
  return (
    <>
     <input type="text" placeholder="Search by name" value={searchQuery} onChange={handleSearch} />
    <table>
  <tr>
    <th>Sr.No</th>
    <th>Product Name</th>
    <th>Total Revenue</th>
  </tr>
  {
    merged.sort((a,b)=> a.name.localeCompare(b.name)).filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())).map((item,key)=>{
    
       
        return (
            <>
                <tr>
                    <td>{key+1}</td>
                    <td>{item?.name}</td>
                    <td>{item?.revenue.toFixed(2)}</td> 
                </tr>
            </>
        )
    })
    
  }
<tr className='total'>
    <th></th>
    <th>Total Revenue</th>
    <th>{ 0}</th>
  </tr>

</table>
   
    </>
  )
}

export default Aggregate