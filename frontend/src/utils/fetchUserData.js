import Axios from "./Axios";

const fetchUserData= async()=>{
    try{
        const res = await Axios({apiName:"userdetails"})
        return res.data;
    }catch(err){
       console.log(err)
    }
}

export default fetchUserData;