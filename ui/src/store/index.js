import Vuex from 'vuex'
import router from '@/router'
import api from '../api'
import broker from '../utils/broker'

var partner;
function pushRoute(path){
    if(partner){
        path = '/' + partner + path;
    }
    router.push(path);
}

const store = new Vuex.Store({
    state: {
        defaultBanks: [],
        banks: [],
        bank: {},
        job: {},
        mfa: {},
        request: {},
        provider: {},
        preference: {},
        closing: false,
        error: '',
    },
    mutations: {
        SET_BANKS(state, banks) {
            //broker.postMessage({step: 'Search'});
            state.banks = banks
        },
        SET_DEFAULTBANKS(state, banks) {
            //broker.postMessage({step: 'Loaded'});
            state.defaultBanks = banks
        },
        SET_PREFERENCE(state, preference) {
            state.preference = preference || {}
        },
        SET_BANK(state, bank) {
            broker.postMessage({step: 'SelectBank', });
            state.bank = bank
        },
        SET_JOB(state, job){
            if(job && job.JobID){
                broker.postMessage({step: 'Login', JobID: job.JobID});
            }
            state.job = job
        },
        SET_PROVIDER(state, provider){
            broker.postMessage({step: 'Provider', provider});
            state.provider = provider
        },
        SET_MFA(state, mfa){
            if(mfa.Step && state.mfa.Step !== mfa.Step){
                var message = {
                    step: mfa.Step,
                    status: mfa.LastStatus,
                    jobId: mfa.JobID,
                    accounts: mfa.Accounts,
                    userInstitutionId: mfa.UserInstitutionID,
                    institutionId: mfa.InstitutionID
                }
                broker.postMessage(message);
            }
            state.mfa = mfa
        },
        SET_REQUEST(state, request){
            broker.postMessage({step: 'Init'});
            partner = request.partner;
            state.request = request
        },
        SET_CLOSING(state, value){
            state.closing = value;
        },
        SET_ERROR(state, error){
            if(error && error.Code){
                broker.postMessage({error: error.Code});
                state.error = error.Message
            }else{
                broker.postMessage({error: (error || {}).message || error});
                state.error = (error || {}).message || error
            }
        }
    },
    actions: {
        SetError ({ commit }, payload) {
            commit('SET_ERROR', payload)
            pushRoute('/error')
        },
        SetBank ({ commit }, payload) {
            commit('SET_BANK', payload)
            if(payload.name){
                api.selectBank(payload).then(data => {
                    if(data.provider){
                        this.dispatch('SetProvider', data.provider)
                    }else if(data.id){
                        commit('SET_BANK', data);
                        pushRoute('/login');
                    }
                });
            }else{
                pushRoute('/error');
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
                pushRoute({name: 'Provider_' + payload.name});
            }else{
                pushRoute('/login');
            }
        },
        SetJob ({ commit, dispatch }, payload) {
            if(payload && payload.error){
                dispatch('SetError', payload.error);
                return;
            }
            commit('SET_JOB', payload)
            if(payload && payload.JobID){
                dispatch('SetMfa', {});
            }else{
                pushRoute('/error')
            }
        },
        SetRequest ({commit, dispatch}, payload){
            commit('SET_REQUEST', payload);
            if(payload.action.indexOf('Demo') == -1 && payload.action.indexOf('Mock') == -1){
                if((payload.requestId || '') == '' || (payload.integrationKey || '') == ''){
                    commit('SET_ERROR', 'Mssing request_id or integration_key')
                    pushRoute('/invalidrequest');
                    return;
                }
            }
            if(payload.action === 'Refresh'){
                if(!payload.userInstitutionId){
                    console.log('error: refresh without userinstitution_id')
                    commit('SET_ERROR', 'Must provide "userInstitution_id" for action "Refresh"')
                    pushRoute('/invalidrequest');
                    return;
                }
            }
            var request = store.state.request;
            api.banks(request)
                .then(data => {
                    commit('SET_PREFERENCE', data.preference)
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
            if(!data || data.Error || data.error){
                dispatch('SetError', (data || {}).Error || (data || {}).error);
                return;
            }
            if(data.Step === 'LoginSuccess' && state.preference.successWhenAccountsReady){
                data.Step = 'Success';
            }
            switch(data.Step){
                case 'Success':
                    if(state.preference.closeOnSuccess){
                        broker.postAction({action: 'close', reason: 'success'})
                    }
                    pushRoute('/success')
                    break;
                case 'Failure':
                    if(state.preference.closeOnError){
                        broker.postAction({action: 'close', reason: 'error'})
                    }
                    pushRoute('/error')
                    break;
                case 'SecurityQuestion':
                    data.SecurityQuestion = JSON.parse(data.SecurityQuestionJson);
                    pushRoute('/securityquestion')
                    break;
                case 'TokenMethod':
                    data.TokenMethod = JSON.parse(data.TokenMethodJson)
                    pushRoute('/tokenMethod')
                    break;
                case 'TokenRead':
                    data.token = data.TokenRead
                    pushRoute('/tokenRead')
                    break;
                case 'CaptchaImage':
                    pushRoute('/captcha')
                    break;
                case 'TokenSent':
                    data.TokenInputName
                    pushRoute('/tokeninput')
                    break;
                case 'LoginSuccess':
                default:
                    wait = true;
                    break;
            }
            commit('SET_MFA', data)
            if(wait){
                pushRoute('/progress/')
                setTimeout(() => {
                    api.mfa(state.job.JobID)
                        .then(data => {
                            dispatch('SetMfa', data)
                        });
                }, window.mock ? 1000 : 3000)
            }
        },
        close({ commit }, {route, confirmed} ){
            switch(route){
                case "In progress":
                case "ChoosePhone":
                case "Captcha":
                case "TokenInput":
                case "TokenMethod":
                case "SecurityQuestion":
                    if(!confirmed){
                        commit('SET_CLOSING', true);
                        return;
                    }
                    break;
                default:
                    break;
            }
            console.log(`Raising close widget event from : ${route}`);
            broker.postAction({action: 'close', reason: 'user'});
        },
        cancelClose({commit}){
            commit('SET_CLOSING', false);
        }
    }
})
  
export default store