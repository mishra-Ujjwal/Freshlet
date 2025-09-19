import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import { useSelector } from "react-redux";
import { MdVerified } from "react-icons/md";
import dayjs from 'dayjs';
const OrderPage = () => {
  const [order, setOrder] = useState([]);
  const products = useSelector((state) => state.product.product);

  const orderData = async () => {
    try {
      const res = await Axios({ apiName: "getOrderDetail" });
      if (res.data.success) {
        console.log(res);
        setOrder(res.data.order);
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    orderData();
  }, []);
  return (
    <section className="p-6 flex flex-col-reverse gap-3 ">
      {order.map((each, idx) => {
        const date = dayjs(each.createdAt).format('DD MMM YYYY, hh:mm A')
        return (
          <div key={idx} className="border  border-gray-200 shadow-md rounded-xl px-4 py-2 relative space-y-1.5">
            <p className="absolute top-2 left-2 text-green-600"><MdVerified size={30} />
</p>
           
            <p className="text-xl font-medium px-6">{each.orderId}</p>
            <div className="flex items-center gap-3 px-6">
                   <p className="text-xl font-semibold">Rs.{each.totalAmt}</p>
                   <p className="text-base font-normal">{date}</p>
                   </div>
                   <hr className="text-gray-300" />

            <div className="flex gap-3">
            {each.listItems.map((prod, idx) => {
              const items = products.find((p)=>String(p._id)===String(prod.productId));
              console.log(items)
              return(
                
                 <div key={idx} className="border-1 border-gray-400 rounded-xl w-25 overflow-hidden ">
                   <img src={items?.images} alt="" className="" />


                 </div>

            )
              ;
            })}
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default OrderPage;
