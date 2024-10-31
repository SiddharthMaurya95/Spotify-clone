
var folder='cs';
var songs=[];
const song="";
function convertSecondsToMinSec(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    
}
let currSong= new Audio();
async function getsongs(folder){
    let s= await fetch(`/${folder}`);
    let a = await s.text();
    let div=document.createElement("div");
    div.innerHTML=a;
    let ele=div.getElementsByTagName("a");
    songs=[]
    for(let i=0;i<ele.length;i++){
        if(ele[i].href.endsWith(".mp3")){
            songs.push(ele[i].href);
        }
    }
    ele=document.querySelector(".songList").getElementsByTagName("ul")[0];
    ele.innerHTML="";
    for (const song of songs) {
        ele.innerHTML=ele.innerHTML+
       ` <li><img class="invert logo2 p1" src="./music-svgrepo-com.svg" alt="">
                <div class="songinfo">
                    <div>${((song.split(`${folder}/`)[1]).replaceAll("%20"," ")).replaceAll("%5B"," ").replaceAll("%5D"," ").replaceAll("%3D","")}</div>
                    <div>Artist</div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
            <img class="logo2 invert" src="./play-svgrepo-com.svg" alt=""></div></li>`;
    }
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(element => {
        element.addEventListener("click",(e)=>{
           
            for(const song of songs){
                if(
                    element.querySelector(".songinfo").firstElementChild.innerHTML==(((song.split(`${folder}/`)[1]).replaceAll("%20"," ")).replaceAll("%5B"," ").replaceAll("%5D"," ").replaceAll("%3D",""))){
                   document.querySelector(".songInfo").innerHTML=element.querySelector(".songinfo").firstElementChild.innerHTML;
                   document.querySelector(".duration").innerHTML="00:00/00:00";
                    playMusic(song);
                }
            }
        });
    });
}
const playMusic=(audio,pause=false)=>{
    currSong.src = audio;
    if(!pause){
        currSong.play();
        play.src="./pause.svg";
    }
   
    console.log(decodeURI(audio));
    document.querySelector(".songInfo").innerHTML=(((audio.split(`${folder}/`)[1]).replaceAll("%20"," ")).replaceAll("%5B"," ").replaceAll("%5D"," ").replaceAll("%3D",""));
    document.querySelector(".duration").innerHTML="00:00/00:00";
}
async function getalbum(){
    let s= await fetch(`Spotify-clone/tree/main/Songs`);
    let a = await s.text();
    let div=document.createElement("div");
    div.innerHTML=a;
    let anchor=div.getElementsByTagName("a");
    Array.from(anchor).forEach( async e=>{
      if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]
            let s= await fetch(`/songs/${folder}/info.json`);
            let a = await s.json();
            document.querySelector(".spotifyPlaylist").innerHTML=document.querySelector(".spotifyPlaylist").innerHTML+
            `<div data-folder=${folder} class="card">
            <div class="circle1"><img src="./play1.svg" alt=""></div>
            <img src="/songs/${folder}/cover.JPG" alt="">
            <h4 class="he">${a.title}</h4>
            <p class="dis">${a.discription}</p>
        </div>`
        }
    })
}
async function main(){
    await getalbum();
    await getsongs("songs/cs");
    playMusic(songs[0],true);
   
    play.src="./play-svgrepo-com.svg"
    play.addEventListener("click",()=>{
        if(currSong.paused){
            currSong.play()
            play.src="./pause.svg"
            
        }
        else{
            currSong.pause()
            play.src="./play-svgrepo-com.svg"
        }
    })
    currSong.addEventListener("timeupdate",()=>{
        document.querySelector(".duration").innerHTML=`${convertSecondsToMinSec(currSong.currentTime)} / ${convertSecondsToMinSec(currSong.duration)}`;
        document.querySelector(".circle2").style.left=((currSong.currentTime)/(currSong.duration))*100+"%";
    })
    document.querySelector(".seekbar").addEventListener("click",(e)=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle2").style.left=percent+"%";
        currSong.currentTime=(currSong.duration*percent)/100
    })
   
    document.querySelector("#prev").addEventListener("click",(e)=>{
        if(songs.indexOf(currSong.src)-1>=0){
            playMusic(songs[songs.indexOf(currSong.src)-1]);
        }
    })
    document.querySelector("#next").addEventListener("click",(e)=>{
        if(songs.indexOf(currSong.src)+1<songs.length){
           
            playMusic(songs[songs.indexOf(currSong.src)+1]);
        }
    })
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currSong.volume=parseInt(e.target.value)/100;
    })
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async i=>{
           
            folder=i.currentTarget.dataset.folder;
          await getsongs(`songs/${i.currentTarget.dataset.folder}`);
        })
    })
    document.querySelector(".vol").addEventListener("click",e=>{
        if(e.target.src.includes("volume-max-svgrepo-com.svg")){
            e.target.src=e.target.src.replace("volume-max-svgrepo-com.svg","mute.svg");
            currSong.volume=0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0
        }
        else{
            e.target.src=e.target.src.replace("mute.svg","volume-max-svgrepo-com.svg");
            currSong.volume=0.10;
            document.querySelector(".range").getElementsByTagName("input")[0].value=10
        }
    })
    document.querySelector(".hamberger").addEventListener("click",e=>{
        if(document.querySelector(".left.box").style.left=="0"){
        document.querySelector(".left.box").style.left="-110%";
       }
        else{
            document.querySelector(".left.box").style.left="0";
        }
    })
    document.querySelector(".close").addEventListener("click",e=>{
        document.querySelector(".left.box").style.left="-110%";
    })
}
main();
