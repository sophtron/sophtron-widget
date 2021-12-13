import Vuex from 'vuex'
import router from '@/router'
//import { useRoute } from 'vue-router'
import api from '../api'

const store = new Vuex.Store({
    state: {
        defaultBanks: [],
        banks: [],
        bank: {},
        job: {},
        mfa: {},
        request: {},
        provider: {},
        error: ''
    },
    mutations: {
        SET_BANKS(state, banks) {
            state.banks = banks
        },
        SET_DEFAULTBANKS(state, banks) {
            state.defaultBanks = banks
        },
        SET_BANK(state, bank) {
            state.bank = bank
        },
        SET_JOB(state, job){
            state.job = job
        },
        SET_PROVIDER(state, provider){
            state.provider = provider
        },
        SET_MFA(state, mfa){
            state.mfa = mfa
        },
        SET_REQUEST(state, request){
            state.request = request
        },
        SET_ERROR(state, error){
            state.error = error
        }
    },
    actions: {
        SetError ({ commit }, payload) {
            commit('SET_ERROR', payload)
            router.push('/error')
        },
        SetBank ({ commit }, payload) {
            commit('SET_BANK', payload)
            if(payload.name){
                api.selectBank(payload).then(data => {
                    if(data.provider){
                        this.dispatch('SetProvider', data.provider)
                    }else if(data.id){
                        commit('SET_BANK', data);
                        router.push('/login');
                    }
                });
            }else{
                router.push('/error');
            }
        },
        SetBanks ({ commit }, payload) {
            commit('SET_BANKS', payload)
        },
        SetProvider ({ commit }, payload) {
            if(!payload){
                commit('SET_PROVIDER', {});
                commit('SET_BANK', {});
                if(router.currentRoute.value.name.startsWith('Provider_')){
                    router.back();
                }
                return;
            }
            commit('SET_PROVIDER', payload);
            if(payload.name){
                router.push({name: 'Provider_' + payload.name});
            }else{
                router.push('/login');
            }
        },
        SetJob ({ commit, dispatch }, payload) {
            if(payload.error){
                dispatch('SetError', payload.error);
                return;
            }
            commit('SET_JOB', payload)
            if(payload && payload.JobID){
                dispatch('SetMfa', {});
            }else{
                router.push('/error')
            }
        },
        SetRequest ({commit, dispatch}, payload){
            commit('SET_REQUEST', payload);
            if(payload.action.indexOf('Demo') == -1 && payload.action.indexOf('Mock') == -1){
                if((payload.requestId || '') == '' || (payload.integrationKey || '') == ''){
                    commit('SET_ERROR', 'Mssing request_id or integration_key')
                    router.push('/invalidrequest');
                    return;
                }
            }
            if(payload.action === 'Refresh'){
                if(!payload.userInstitutionId){
                    console.log('refrsh without userinstitution_id')
                    commit('SET_ERROR', 'Must provide "userInstitution_id" for "Refresh"')
                    router.push('/invalidrequest');
                    return;
                }
            }
            var request = store.state.request;
            api.banks(request)
                .then(data => {
                    var banks = data.banks;
                    if(data.provider){
                        dispatch('SetProvider', data.provider)
                    }else if(banks.length == 1 && (request.userInstitutionId || request.institutionId || request.routingNumber)){
                        dispatch('SetBank', banks[0])
                    }else{
                        commit('SET_DEFAULTBANKS', banks)
                    }
                });
        },
        SetMfa ({ commit, dispatch, state }, data) {
            let wait = false;
            if(data.error){
                dispatch('SetError', data.error);
                return;
            }
            if(data.SuccessFlag == 'Success'){
                window.parent.postMessage({ success: true }, "*");
                router.push('/success')
            }else if(data.SuccessFlag == 'Failed'){
                window.parent.postMessage({ success: false }, "*");
                router.push('/error')
            }else if((data.SecurityQuestion || '').length > 0){
                data.SecurityQuestion = JSON.parse(data.SecurityQuestion);
                router.push('/securityquestion')
            }else if((data.TokenMethod || '').length > 0){
                data.TokenMethod = JSON.parse(data.TokenMethod)
                router.push('/choosephone')
            }else if(data.TokenRead){
                router.push('/tokenRead')
            }else if(data.CaptchaImage){
                router.push('/captcha')
            }else if(data.TokenSentFlag){
                router.push('/tokeninput')
            }else{
                wait = true;
            }
            commit('SET_MFA', data)
            if(wait){
                router.push('/progress/')
                setTimeout(() => {
                    api.mfa(state.job.JobID)
                        .then(data => {
                            store.dispatch('SetMfa', data)
                        });
                }, 3000)
            }
        }
    }
})
  
export default store