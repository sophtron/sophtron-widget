import axios from 'axios'
import mockData from './mockData'
import broker from './broker';
var prefix = 'http://localhost:3000';
var meta = ''; // a temporary metadata token for this session

axios.interceptors.response.use(undefined, function (err) {
    broker.postMessage({error: (err.response || {}).status});
    return Promise.reject(err);
})

export default {
    post(url, data){
        if(window.mock){
            return new Promise((resolve) => {
                console.log('Mocking: ' + url);
                if(mockData[url]){
                    var data = mockData[url]();
                    console.log('returning:' + JSON.stringify(data))
                    resolve( data );
                }else{
                    resolve( {} );
                }
            });
        }else{
            return axios.post(prefix + url, data, {headers: getHeaders(meta)})
                .then(res => {
                    if(res.headers.meta){
                        meta = res.headers.meta
                    }
                    return res.data
                });
        }
    }
}

function getHeaders(meta) {
    return {
        Meta: meta,
        "Content-Type": 'application/json', 
        'Access-Control-Allow-Origin': "*"
    }
}