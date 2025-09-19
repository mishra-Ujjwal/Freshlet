import React, { useEffect, useState } from "react";
import UploadCategoryModel from "../components/UploadCategoryModel";
import Axios from "../utils/Axios";
import NoData from "../components/NoData";
import EditCategoryModel from "../components/EditCategoryModel";
import{toast} from 'react-toastify'
import { useDispatch } from "react-redux";
const Category = () => {
  const dispatch = useDispatch()
  const [openCategoryModel, setOpenCategoryModel] = useState(false);
  const [editCategoryModel, setEditCategoryModel] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCategoryData, setEditCategoryData] = useState({
    name: "",
    image: "",
  });

  const fetchCategoryData = async () => {
    try {
      const res = await Axios({ apiName: "getCategoryData" });
      if (res.data.success) {
        setCategoryData(res.data.data);

      } else {
        console.error("Failed to fetch categories:", res.data.message);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  });
  const handleDelete = async(id)=>{
    console.log("delete button")
    try{
      const res = await Axios({apiName:"deleteCategory",formData: { _id: id }})
      console.log("working")
       if(res.data.success){
        toast.success("Category deleted ")
       fetchCategoryData();
       }
       else{
        console.log(res.data)
       }
    }catch(err){
      console.log(err)
    }
  }

  return (
    <section className="p-4 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-medium">Category</h2>
        <button
          className="text-white font-bold px-4 py-2 rounded"
          style={{ backgroundColor: "blue" }}
          onClick={() => setOpenCategoryModel(true)}
        >
          Add Category
        </button>
      </div>

      {/* Upload Modal */}
      {openCategoryModel && (
        <UploadCategoryModel close={() => setOpenCategoryModel(false)} />
      )}

      {/* No Data State */}
      {!loading && categoryData.length === 0 && (
        <div className="text-gray-500">
          <NoData />
        </div>
      )}

      {/* Category Grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 -ml-3">
        {categoryData.map((category) => (
          <div
            key={category._id}
            className="flex flex-col justify-between items-center bg-gray-100 shadow-md rounded-lg p-3 w-[180px] sm:w-[180px]"
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-[180px] h-[180px] object-cover rounded-lg"
            />
            <p className="mt-2 text-lg font-normal text-center">{category.name}</p>
            <div className="flex gap-2 mt-2">
              {/* <button
                onClick={() => {
                  setEditCategoryModel(true);
                  setEditCategoryData({
                    id: category._id,
                    name: category.name,
                    image: category.image,
                  });
                }}
                className="bg-white px-3 py-1.5 rounded-lg shadow-sm border cursor-pointer hover:bg-gray-50"
              >
                Edit
              </button> */}
              <div onClick={()=>handleDelete(category._id)} style={{backgroundColor:"#FE4545"}} className="px-3 py-1 rounded-lg shadow-sm border cursor-pointer text-white border-none">
                Delete
              </div>
              {/* {editCategoryModel && (
                <EditCategoryModel
                  data={editCategoryData}
                  close={() => setEditCategoryModel(false)}
                />
              )} */}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Category;
