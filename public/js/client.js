const socket=io();
var username;
var chat=document.querySelector(".chats")
var users_list=document.querySelector(".users-list")
var users_count=document.querySelector(".users-count")
var msg_send=document.querySelector("#user-send")
var user_msg=document.querySelector("#user-msg")

do{
   username= prompt("Enter Your Name:")
}while(!username)
// it will be called you will be joined
socket.emit("new-user-joind",username);
// notifing that user is joined
socket.on('user_connected',(socket_name)=>{
   userjoinLeft(socket_name,'joined')
})

// function join or left status div 
function userjoinLeft(name,status){
let div=document.createElement("div")
div.classList.add('user-join');
let content=`<p><b>${name}</b>${status}to chat </p>`;
div.innerHTML=content
chat.appendChild(div)
chat.scrollTop=chat.scrollHeight;
}
// / notifing that user is left
socket.on('user-disconnected',(usre)=>{
   userjoinLeft(usre,'left')
});
// for updating user list and count 
socket.on("user-list",(user)=>{
users_list.innerHTML="";
users_arr=Object.values(user);
var i;
for(i=0;i<users_arr.length;i++){
   let p=document.createElement('p');
   p.innerText=users_arr[i];
   users_list.appendChild(p);
}

users_count.innerHTML=users_arr.length

})
// for sending messige
msg_send.addEventListener('click',()=>{
   let data={
      user:username,
      msg:user_msg.value
   };
   if(user_msg.value!=''){
      appendMessage(data,'outgoing');
      socket.emit('message',data);
      user_msg.value='';
   }
   
});
function appendMessage(data,status){
   let div=document.createElement('div')
   div.classList.add('message',status);
   let content=`
   <h5>${data.user}</h5>
   <p>${data.msg}</p>
   `;
   div.innerHTML=content;
   chat.appendChild(div)
   chat.scrollTop=chat.scrollHeight;
}
socket.on('message',(data)=>{
   appendMessage(data,'incoming')
})