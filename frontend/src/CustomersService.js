import axios from 'axios';

const BASE_API_URL = "http://localhost:8000";


export default class CustomersService{

    getCustomers(){
        const url = `${BASE_API_URL}/api/customers/`;
        return axios.get(url).then(response => response.data);
    }
    getCustomersByURL(link) {                                   // for requests with pagination
        const url = `${BASE_API_URL}${link}`;
        return axios.get(url).then(response => response.data);
    }
    getCustomer(pk){
        const url = `${BASE_API_URL}/api/customers/${pk}`;
        return axios.get(url).then(response => response.data);
    }
    createCustomer(customer){
        const url = `${BASE_API_URL}/api/customers/`;
        return axios.post(url, customer);
    }
    updateCustomer(customer){
        const url = `${BASE_API_URL}/api/customers/${customer.pk}`
        return axios.put(url, customer)
    }
    deleteCustomer(customer){
        const url = `${BASE_API_URL}/api/customers/${customer.pk}`;
        return axios.delete(url)
    }
}