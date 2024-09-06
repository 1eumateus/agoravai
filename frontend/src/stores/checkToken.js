import api from "@/api.js";

export function checkToken() {
    const token = localStorage.getItem('token');
    if (token) {
        return api.get('/login/getUser')
        .then((res) => {
            return {valid: true, tipo: res.data.tipo, email:res.data.email};
        }).catch(() => {
            localStorage.removeItem('token');
            window.location.reload();
            return {valid: false, tipo: 'user'};
        });
    } else {
        return {valid: false, tipo: 'user'};
    }
}