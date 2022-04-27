import {Axios} from './Axios';
function login(payload){
    return Axios.post('login',payload);
}
export const loginServices = {
    login
};