import { Login } from '@/api/interface/auth';
import http from '@/api';

export const loginApi = (params: Login.ReqLoginForm) => {
    // return http.post<Login.ResLogin>(`/auth/login`, params);
    // return http.upload<Login.ResLogin>(`/login/access-token`, params);
    return http.upload(`/login/access-token`, params);
};

export const mfaLoginApi = (params: Login.MFALoginForm) => {
    // return http.post<Login.ResLogin>(`/auth/mfalogin`, params);
    // return http.upload<Login.ResLogin>(`/login/access-token`, params);
    return http.upload(`/login/access-token`, params);
};

export const getCaptcha = () => {
    return http.get<Login.ResCaptcha>(`/auth/captcha`);
};

export const logOutApi = () => {
    // return http.post<any>(`/auth/logout`);
    return http.delete<any>(`/logout`);
};

export const checkIsSafety = (code: string) => {
    return http.get<string>(`/auth/issafety?code=${code}`);
};

export const checkIsDemo = () => {
    return http.get<boolean>('/auth/demo');
};

export const getLanguage = () => {
    return http.get<string>(`/auth/language`);
};
