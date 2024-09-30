import api from "@/api.js";
import { popupInfo } from './util.js';
export async function checkToken(confirmandoEmail) {
    const token = localStorage.getItem('token');
    if (token) {
        return await api.get('/login/getUser')
        .then((res) => {
            return {
                valid: true, 
                tipo: res.data.tipo, 
                id:res.data.id, 
                nome:res.data.nome
            };
        }).catch(() => {
            localStorage.removeItem('token');
            window.location.reload();
            return {valid: false, tipo: 'user'};
        });
    } else if(confirmandoEmail){
        let emailConfirmado = false;
        await api.get('/login/confirmarEmail', {params:{confirmandoEmail}})
        .then((res) => {
            emailConfirmado = true;
            popupInfo().success(res?.data?.msg);
        }).catch((e) => {
            console.log(e?.response?.data?.msg || e) 
        });
        return {valid: false, tipo: 'user', emailConfirmado};
    }else {
        return {valid: false, tipo: 'user'};
    }
}