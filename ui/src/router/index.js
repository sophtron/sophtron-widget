
import { createWebHistory, createRouter } from "vue-router"

import SelectBank from "@/components/SelectBank.vue"
import ThirdParty from "@/components/ThirdParty.vue"
import Login from "@/components/Login.vue"
import Progress from "@/components/Progress.vue"
import Success from "@/components/Success.vue"
import TokenMethod from "@/components/challenges/TokenMethod.vue"
import TokenInput from "@/components/challenges/TokenInput.vue"
import TokenRead from "@/components/challenges/TokenRead.vue"
import Captcha from "@/components/challenges/Captcha.vue"
import SecurityQuestion from "@/components/challenges/SecurityQuestion.vue"
import PageNotFound from "@/components/shared/PageNotFound.vue"
import ErrorPage from "@/components/shared/Error.vue"
import InvalidRequest from "@/components/shared/InvalidRequest.vue"
import store from "../store"
const routes = [
  {
    path: "/",
    name: "Home",
    component: SelectBank,
  },
  {
    path: "/demo",
    name: "QuickDemo",
    component: SelectBank,
  },
  {
    path: "/mock",
    name: "QuickMock",
    component: SelectBank,
  },
  {
    path: "/:partner/mock",
    name: "Mock",
    component: SelectBank,
  },
  {
    path: "/:partner/thirdparty",
    name: "Provider_ThirdParty",
    component: ThirdParty,
  },
  {
    path: "/:partner/demo",
    name: "Demo",
    component: SelectBank,
  },
  {
    path: "/:partner/add",
    name: "Add",
    component: SelectBank,
  },
  {
    path: "/:partner/refresh",
    name: "Refresh",
    component: SelectBank,
  },
  {
    path: "/:partner/verify",
    name: "Verify",
    component: SelectBank,
  },
  {
    path: "/:partner/util",
    name: "Util",
    component: SelectBank,
  },
  {
    path: "/:partner/utils",
    name: "Utils",
    component: SelectBank,
  },
  {
    path: "/:partner/auth",
    name: "Auth",
    component: SelectBank,
  },
  {
    path: "/:partner/bankauth",
    name: "BankAuth",
    component: SelectBank,
  },
  {
    path: "/:partner/success",
    name: "Success",
    component: Success,
  },
  {
    path: "/:partner/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/:partner/progress",
    name: "In progress",
    component: Progress,
  },
  {
    path: "/:partner/tokenmethod",
    name: "TokenMethod",
    component: TokenMethod,
  },
  {
    path: "/:partner/captcha",
    name: "Captcha",
    component: Captcha,
  },
  {
    path: "/:partner/tokenInput",
    name: "TokenInput",
    component: TokenInput,
  },
  {
    path: "/:partner/tokenRead",
    name: "TokenRead",
    component: TokenRead,
  },
  {
    path: "/:partner/securityQuestion",
    name: "SecurityQuestion",
    component: SecurityQuestion,
  },
  {
    path: "/:partner/error",
    name: "Error",
    component: ErrorPage,
  },
  {
    path: "/:partner/invalidrequest",
    name: "InvalidRequest",
    component: InvalidRequest,
  },
  {
    path: '/:catchAll(.*)*',
    name: "PageNotFound",
    component: PageNotFound,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
    switch(to.name){
        case 'Home':
        case 'QuickDemo':
            next({ name: 'Demo', query: to.query, params: {partner: 'default'} });
            break;
        case 'QuickMock':
            next({ name: 'Mock', query: to.query, params: {partner: 'default'} });
            break;
        case 'Mock':
        case 'Demo':
        case 'ProviderDemo':
        case 'Add':
        case 'Auth':
        case 'BankAuth':
        case 'Refresh':
        case 'Verify':
        case 'Util':
        case 'Utils':
            window.mock = to.name === 'Mock';
            window.noFishing = to.query.nofishing
            var query = {};
            Object.keys(to.query).forEach(q => {
              query[q.toLowerCase()] = to.query[q];
            });
            var request = {
              institutionId: to.name != 'Refresh' ? query.institution_id : null, 
              routingNumber: to.name != 'Refresh' ? query.routing_number: null, 
              userInstitutionId: to.name == 'Refresh' ? query.userinstitution_id : null,
              requestId: query.request_id,
              integrationKey: query.integration_key,
              providerToken: query.provider_token,
              providerName: query.provider_name,
              action: to.name,
              partner: to.params.partner
            };
            store.dispatch('SetRequest', request);
            next();
            break;
          case 'Error':
          case 'InvalidRequest':
          case 'PageNotFound':
            next();
            break;
        default:
            if(to.name.startsWith('Provider_')){
              next();
            }
            else if(!store.state.bank.name){
              next({ name: store.state.request.action, query: to.query })
            }
            else {
              next();
            }
            break;
    }
})
export default router