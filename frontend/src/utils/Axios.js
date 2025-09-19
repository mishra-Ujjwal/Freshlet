import axios from "axios";
import SummaryApi, { baseUrl } from "../common/SummaryApi";
const Axios = async ({ apiName, formData,params }) => {
  const apiConfig = SummaryApi[apiName];
  let url = baseUrl + apiConfig.url; 
  if (params) {
    for (const key in params) {
      url = url.replace(`:${key}`, params[key]);
    }
  }
  const config = {
    method: apiConfig.method,
    url,
    withCredentials: true,
  };
  
  if(apiConfig.method.toLowerCase()!=="get"){
    config.data = formData;
  }
  const res = await axios(config);
  return res;
};
export default Axios;