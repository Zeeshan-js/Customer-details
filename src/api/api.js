import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_STICKY_URI,
  auth: {
    username: import.meta.env.VITE_USER_NAME,
    password: import.meta.env.VITE_USER_PASSWORD,
  },
  headers: {
    "Content-Type": "application/json",
  },
});

const handleLogin = async (
  zip,
  phone
) => {
  // Use default date range
  const startDate = "01/01/2010";
  const endDate = "12/31/2100";

  const req_body = {
    campaign_id: "all",
    start_date: startDate,
    end_date: endDate,
    criteria: {
      phone,
      zip,
    },
    search_type: "all",
    return_type: "customer_view"
  };

  try {
    const response = await api.post("customer_find", req_body);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};


const productFind = async (orderId, startDate = "01/01/2000", endDage = "01/01/2100") => {


    const req_body = {
    order_id: orderId
    }
    try {
        const response = await api.post(`order_view`, req_body);

        const { is_recurring, recurring_date, products, } = response.data

        // const minimalResponse = responseArray.map((item) => ({
        //     subscription: item.is_recurring,
        //     next_subscription: item.recurring_date,
        //     price: item.product.price,
        //     billing_model: item.product.billing_model.name,
        // }))

        const minimalResponse = {
            subscription: is_recurring,
            next_subscription: recurring_date,
            price: products.forEach(product => product.billing_model.price),
        }

        return response.data;
        
    } catch (error) {
        console.error("Product find failed:", error);
        throw error;
    }
}


export { handleLogin, productFind };
