import "../../../common/http.js"
export function getProducts(params){
    return new Promise((resolve, reject)=>{
        http('GET', `/mallv2/subjectsController/getProducts`,params).then((res) => {
            if (res.code == 200) {
                resolve(res.data)
            }else{
                reject(res)
            }
        }).catch((error) => {
            reject(error)
        })
    })
}
export function queryListByPage(params){
    return new Promise((resolve, reject)=>{
        http('GET', `/mallv2/h5/activity/queryListByPage`,params).then((res) => {
            if (res.code == 200) {
                resolve(res.data)
            }else{
                reject(res)
            }
        }).catch((error) => {
            reject(error)
        })
    })
}
export function getProductReviews(params){
    return new Promise((resolve, reject)=>{
        http('GET', `/mallv2/product/getProductReviews`,params).then((res) => {
            if (res.code == 200) {
                resolve(res.data)
            }else{
                reject(res)
            }
        }).catch((error) => {
            reject(error)
        })
    })
}
export function getFakeUsers(params){
    return new Promise((resolve, reject)=>{
        http('GET', `/mallv2/common/getFakeUsers`,params).then((res) => {
            if (res.code == 200) {
                resolve(res.data)
            }else{
                reject(res)
            }
        }).catch((error) => {
            reject(error)
        })
    })
}