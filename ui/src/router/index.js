
import { createWebHistory, createRouter } from "vue-router"

import SelectBank from "@/components/SelectBank.vue"
import ThirdParty from "@/components/ThirdParty.vue"
import Login from "@/components/Login.vue"
import Progress from "@/components/Progress.vue"
import Success from "@/components/Success.vue"
import ChoosePhone from "@/components/challenges/ChoosePhone.vue"
import TokenInput from "@/components/challenges/TokenInput.vue"
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
    path: "/mock",
    name: "Mock",
    component: SelectBank,
  },
  {
    path: "/thirdparty",
    name: "Provider_ThirdParty",
    component: ThirdParty,
  },
  {
    path: "/demo",
    name: "Demo",
    component: SelectBank,
  },
  {
    path: "/add",
    name: "Add",
    component: SelectBank,
  },
  {
    path: "/refresh",
    name: "Refresh",
    component: SelectBank,
  },
  {
    path: "/verify",
    name: "Verify",
    component: SelectBank,
  },
  {
    path: "/util",
    name: "Util",
    component: SelectBank,
  },
  {
    path: "/bankauth",
    name: "Auth",
    component: SelectBank,
  },
  {
    path: "/success",
    name: "Success",
    component: Success,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/progress",
    name: "In progress",
    component: Progress,
  },
  {
    path: "/choosePhone",
    name: "ChoosePhone",
    component: ChoosePhone,
  },
  {
    path: "/captcha",
    name: "Captcha",
    component: Captcha,
  },
  {
    path: "/tokenInput",
    name: "TokenInput",
    component: TokenInput,
  },
  {
    path: "/securityQuestion",
    name: "SecurityQuestion",
    component: SecurityQuestion,
  },
  {
    path: "/error",
    name: "Error",
    component: ErrorPage,
  },
  {
    path: "/invalidrequest",
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
            next({ name: 'Demo', query: to.query });
            break;
        case 'Mock':
        case 'Demo':
        case 'ProviderDemo':
        case 'Add':
        case 'Auth':
        case 'Refresh':
        case 'Verify':
        case 'Util':
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
              action: to.name
            };
            //console.log(request);
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