import axios from 'axios'
import mockData from './mockData'
var prefix = '';
var meta = ''; // a temporary metadata token for this session

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
            return axios.post(prefix + url, data, {headers: {meta}})
                .then(res => {
                    if(res.headers.meta){
                        meta = res.headers.meta
                    }
                    return res.data
                }).catch(err => {
                    console.log(err);
                });
        }
    }
}