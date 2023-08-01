import http from '@/api';
import { ResPage } from '@/api/interface';
import { Celebrities } from '@/api/interface/celebrity';
import { AxiosRequestConfig } from 'axios';
import { File } from '../interface/file';

export const getCelebrityPage = (params: Celebrities.SearchCelebrityPage) => {
    return http.get<ResPage<Celebrities.CelebrityInfo>>(`/celebrities`, params);
};
export const setCelebrityFollow = (params: Celebrities.ReqCelebrity) => {
    return http.put(`/celebrities/${params.id}/follow`);
};
export const setCelebrityLike = (params: Celebrities.ReqCelebrity) => {
    return http.put(`/celebrities/${params.id}/like`);
};
export const getCelebrityDetail = (params: Celebrities.ReqCelebrity) => {
    return http.get(`/celebrities/${params.id}`);
};
export const editCelebrityDetail = (params: Celebrities.CelebrityDetail) => {
    return http.put(`/celebrities/${params.id}`, params);
};
export const uploadCelebrityFiles = (params: FormData, config: AxiosRequestConfig) => {
    return http.upload<File.File>('/celebrities/load', params, config);
};
export const ChunkCelebrityUploadFileData = (params: FormData, config: AxiosRequestConfig) => {
    return http.upload<File.File>('files/chunkupload', params, config);
};
