const privateKey = "13e5e88d97b0ee0f8779b4287c1a4d7b105bf2f5";
const publicKey = "a06ea6be407e8aed5d4b81c85a1bc7d0";
const maxCharacters = 1500;



//you can also create an MD5 through the website http://tool.h3399.cn/jsMD5/
//you will need to put the timestamp + your private key and then your public key
//to get the timestamp you can use the following code
//Math.floor(Date.now() / 1000) or Math.floor(Date.now())
function createHash(timeStamp) {

    const toBeHashed = timeStamp + privateKey + publicKey;
    const hashedMessage = md5(toBeHashed);
    return hashedMessage;

}

function getCharacterList() {

    //time now 
    const timeStamp = Date.now().toString();
    //random number of heroes
    const offset = Math.floor((Math.random() * maxCharacters) + 1);
    //hash to validate the request in the api
    const hash = createHash(timeStamp); 

    //api link concatenation + random number of heroes + time stamp + public key + hash
    const urlAPI = "http://gateway.marvel.com/v1/public/characters?limit=9&offset="+offset+"&ts="+timeStamp+"&apikey="+publicKey+"&hash="+hash;

    // XHR was used so we could update only part of the page without having to update it completely and disturb what the user is doing
    var res = new XMLHttpRequest();

    res.onreadystatechange = function() {
        //if the status is 4 and the server returns 200 which equals success do
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            getImages(data);
        }
    };
    res.open("GET", urlAPI, true);
    res.send();
}

// get historys
function showHistorys(elemento) {

    const codigo = elemento.parentNode.getElementsByTagName("h5")[1].textContent.substring(4, 11);//character code
    console.log(codigo);
    const timeStamp = Date.now().toString();//time now 
    const hash = createHash(timeStamp);//hash for request validation

    const urlAPI = "https://gateway.marvel.com:443/v1/public/characters/"+codigo+"/stories?ts="+timeStamp+"&apikey="+publicKey+"&hash="+hash;
    console.log(urlAPI);
    
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            getHistorys(data);
        }
    };
    xhttp.open("GET", urlAPI, true);
    xhttp.send();

}

$(document).ready(function () {
    var characterName;

    const ts = Math.floor(Date.now())
    const hash = md5(ts + privateKey + publicKey);

    $('#btn-search').click(function() {
        characterName = $('#input-name').val();
        url = `https://gateway.marvel.com:443/v1/public/characters?name=${characterName}&ts=${ts}&apikey=${publicKey}&hash=${hash}`;
        console.log(characterName);
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                const character = data.data.results[0];
                const html = `
                    <h2 style="color:white;">${character.name}</h2>
                    <img src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="${character.name}">
                    <p style="color:white;">${character.description}</p>
                    <a style="color:white;">${character.id}</a>
                    `;
                $('#hero-details').html(html);
                console.log(data)
            },
            error: function (xhr, status, error) {
                console.error(`Error: ${error}`);
            }
        }); 
    });
});
