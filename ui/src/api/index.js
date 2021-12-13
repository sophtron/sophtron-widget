import http from '@/utils/http'

export default {
    selectBank: (bank) => http.post('/api/selectBank', bank),
    banks: (request) => http.post('/api/banks', request),
    mfa: (jobId) =>  http.post('/api/mfa', {jobId}),
    search: (term) => http.post('/search?term=' + encodeURIComponent(term) ),
    login: (userName, password, bankId, bankName) =>  http.post('/api/login', { userName,  password, id: bankId, name: bankName}),
    captchaInput: (input) =>  http.post('/api/captcha', {captchaInput: input}),
    tokenMethod: (tokenMethod) => http.post('/api/tokenMethod', {tokenMethod}),
    securityAnswers: (securityAnswers) =>  http.post('/api/securityAnswer', {securityAnswers}),
    tokenInput: (tokenInput) => http.post('/api/tokenInput', {tokenInput}),
    tokenConfirm: () => http.post('/api/tokenConfirm')    
}