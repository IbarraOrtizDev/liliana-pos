window.onload = function(){
    let empresa =JSON.parse(sessionStorage.getItem('company'))
    let a = document.querySelector('a').innerHTML=`<img width="60px" src="${empresa.pathLogo}"/>`
}