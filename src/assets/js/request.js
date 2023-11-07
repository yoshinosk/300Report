import { store } from "../../composables/store";
import qs from 'qs';

export const request = (url, option) => {
    store.loading = true;
    return new Promise((resolve, reject) => {
        fetch(url, {
            mode:'cors',
            ...option
        }).then(res => res.json()).then(res => {
            store.loading = false;
            resolve(res)
        }).catch(err => {
            store.loading = false;
            reject(err)
        })
    })
}

export const post = (url, data, option) => {

    // let formData = new FormData();
    // Object.keys(data).forEach(key=>formData.append(key,data[key]))

    return request(url,{
        method: 'POST',
        body: qs.stringify(data),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        ...option,
    })
}

export const get = (url, data, option) => request(`${url}?${qs.stringify(data)}`,{
    method: 'GET',
    ...option,
})

