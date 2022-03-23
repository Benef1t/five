import { five } from "../../declarations/five";

async function post() {
  let post_button = document.getElementById("post");
  post_button.disabled = true;
  let textarea = document.getElementById("message");
  let otp = document.getElementById("otp").value;
  let text = textarea.value;
  try {
    await five.post(otp, text);
  } catch(e) {
    console.log(e);
    document.getElementById("error").innerText = "Post failed";
  }
  post_button.disabled = false;
}

function timeConverter(UNIX_timestamp){
  var a = new Date(Number(UNIX_timestamp / 1000000n));
  const humanDateFormat = a.toLocaleString()
  return humanDateFormat;
}

var num_posts = 0;

async function load_posts() {
  let posts_section = document.getElementById("posts")
  let posts = await five.posts();
  if (num_posts == posts.length) return;
  posts_section.replaceChildren([]);
  num_posts = posts.length;
  for ( var i = 0; i < posts.length; i++) {
    let post_metainfo= document.createElement("p")
    post_metainfo.innerText = posts[i].author + " post in " + timeConverter(posts[i].time)
    let post_msg = document.createElement("p")
    post_msg.innerText = posts[i].msg;

    posts_section.appendChild(post_metainfo)
    posts_section.appendChild(post_msg)

  }
}

var num_follows = 0;

async function load_follows() {
  let follows_section = document.getElementById("follows")
  let follows = await five.follows();
  if (num_follows == follows.length) return;
  follows_section.replaceChildren([]);
  num_follows = follows.length;
  for ( var i = 0; i < follows.length; i++) {
    let post = document.createElement("p")
    post.innerText = follows[i]
    follows_section.appendChild(post)
  }
}

var num_timeline = 0;

async function load_timeline() {
  let timeline_section = document.getElementById("timeline")
  let timeline = await five.timeline();
  if (num_timeline == timeline.length) return;
  timeline_section.replaceChildren([]);
  num_timeline = timeline.length;
  for ( var i = 0; i < timeline.length; i++) {
    let timeline_metainfo= document.createElement("p")
    timeline_metainfo.innerText = timeline[i].author + " post in " + timeConverter(timeline[i].time)
    let timeline_msg = document.createElement("p")
    timeline_msg.innerText = timeline[i].msg;

    timeline_section.appendChild(timeline_metainfo)
    timeline_section.appendChild(timeline_msg)
  }
}


function load() {
  let post_button = document.getElementById("post")
  post_button.onclick = post;
  load_posts()
  load_follows()
  load_timeline()
  setInterval(load_posts, 3000)
}

window.onload = load