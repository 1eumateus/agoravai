import api from "@/api.js";

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
        return await api.get('/login/confirmarEmail', {params:{confirmandoEmail}})
        .then((res) => {
            localStorage.setItem('token', confirmandoEmail);
            window.location.reload();
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
    }else {
        return {valid: false, tipo: 'user'};
    }
}