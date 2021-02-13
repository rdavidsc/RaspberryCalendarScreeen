const electron = require('electron');
const {ipcRenderer} = electron;

const form = document.querySelector('form');
form.addEventListener('submit', submitForm);

function submitForm(e){
    e.preventDefault();
    const authCode = document.querySelector('#authCode').value;
    alert(authCode);
    ipcRenderer.send('data:authCode', authCode);
}