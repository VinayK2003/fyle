const API = "https://api.github.com/users/";

const button = document.querySelector(".submit");
const input = document.querySelector(".input");
const username = document.querySelector(".username");
const Description = document.querySelector(".desc");
const loc = document.querySelector(".location");
const twitter = document.querySelector(".twitter");
const image = document.querySelector(".image");
const githublink = document.querySelector(".githublink");
const repos = document.querySelector(".repos");

button.addEventListener('click', () => {
    const value = input.value;
    const apiurl = `https://api.github.com/users/${value}`;

    fetch(apiurl)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            const fetchedUsername = data.login;
            username.innerHTML=fetchedUsername;

            const bio=data.bio;
           if(bio!==null) desc.innerHTML=bio;

            const loca=data.location;
           if(loca!==null) loc.innerHTML=loca;

            const twit=data.twitter_username;
           if(twit!==null) twitter.innerHTML=twit;

            const img=data.avatar_url;
           image.src=img;

            const giturl=data.url;
           githublink.innerHTML=giturl;

            const repourl=data.repos_url;
            fetch(repourl)
            .then((data)=>data.json())
            .then((data)=>{
                console.log(data);
                let a=""
                data.map((value)=>{
                   a+=`<div>
                    <div>${value.name}</div>
                    <div>${value.description}</div>
                    <div>${value.language}</div>
                   </div>`
                })
                repos.innerHTML=a;
            })

        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
});
