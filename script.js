"use strict";
import {
  renderCommentSecondary,
  newReplySecondary,
  postReplySecondary,
  postReply,
  newReply,
} from "./reply.js";
import { updateComment } from "./update.js";
import { vote, annullingVote } from "./vote.js";
import { clicksArray, commentsArray } from "./localStorage.js";
window.newReply = newReply;
window.postReply = postReply;
window.newReplySecondary = newReplySecondary;
window.postReplySecondary = postReplySecondary;
window.updateComment = updateComment;
window.vote = vote;
window.annullingVote = annullingVote;
let currentUser = {
  image: {
    png: "./images/avatars/image-juliusomo.png",
    webp: "./images/avatars/image-juliusomo.webp",
  },
  username: "juliusomo",
};
export const commentContainer = document.querySelector("#first-comment");
export const replyPrimaryContainer = document.querySelector("#first-reply");
export const newComment = document.querySelector("#post-new");
export const textField = document.querySelector(".comment-input1");
export const btnCreate = document.querySelector(".btn-send");
export const reply = document.querySelectorAll(".reply");

reply.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let parent = e.target.closest(".comment-card-container");
    let parentId = parent.id;
    if (parentId) {
      let childrenContainer = parent.querySelectorAll(`[dataset=${parentId}]`);
      childrenContainer.forEach((child) => {
        child.classList.add("open");
      });
    }
  });
});

let data1 = JSON.parse(window.localStorage.getItem("commentItem"));

data1.forEach((comment) => {
  renderCommentPrimary(comment, currentUser.username);
  comment.replies.forEach((reply) => {
    renderCommentSecondary(reply, currentUser.username, "deleteReply");
    if (reply.replies) {
      reply.replies.forEach((rep) => {
        renderCommentSecondary(rep, currentUser.username, "deleteReplySec");
      });
    }
  });
});

// ******************* COMMENT ***************** ////
function commentTemplate(uniqueID, img, userName, commentDate, text, score) {
  let commentT = `<div class="comment" id="${uniqueID}">
<div class="avatar-container">
  <img src="${img}" class="avatar" />
  <h3 class="user-name">${userName} <span class="you-tag">you</span></h3>
  <div class="comment-date-time">${commentDate}</div>
</div>
<div class="delete" onclick="deleteComment(this)" >
  <span
    >
    <svg width="12" height="14" xmlns="http://www.w3.org/2000/svg"><path class="icon-delete" d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z" fill="#ED6368"/></svg>
    &nbsp</span
  >Delete
</div>
<div class="edit" onClick="updateComment(this)">
  <span
    ><svg width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path class="icon-edit" d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z" fill="#5357B6"/></svg>
    &nbsp</span
  >Edit
</div>
<div class="text-container1"> <div class="comment-text">
<p>
${text}
</p>
</div></div>



<div class="comment-value">
  <div class="btn-react btn-like" onClick="vote(this)">+</div>
  <div class="score">${score}</div>
  <div class="btn-react btn-dislike" onClick="annullingVote(this)">-</div>
</div>
</div> `;
  return commentT;
}
function renderCommentPrimary(comment, currentUser) {
  const commentPrimary1 = `<div class="comment" id="${comment.id}">
    <div class="avatar-container">
      <img src="${comment.user.image.png}" class="avatar" />
      <h3 class="user-name">${comment.user.username}</h3>
      <div class="comment-date-time">${comment.createdAt}</div>
    </div>

    <div class="reply" onclick="newReply(this)" >
      <span
        ><svg width="14" height="13" xmlns="http://www.w3.org/2000/svg">
          <path
            class="icon-reply"
            d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z"
            fill="#5357B6"
          />
        </svg>
        &nbsp</span
      >Reply
    </div>
    <div class="comment-text">
      <p>
        ${comment.content}
      </p>
    </div>

    <div class="comment-value">
      <div class="btn-react btn-like" onClick="vote(this)">+</div>
      <div class="score">${comment.score}</div>
      <div class="btn-react btn-dislike" onClick="annullingVote(this)">-</div>
    </div>
  </div>`;
  let commentPrimary2 = ``;
  if (comment.id > 10) {
    let createdAt = timeSince(comment.id);
    commentPrimary2 = commentTemplate(
      comment.id,
      comment.user.image.png,
      comment.user.username,
      createdAt,
      comment.content,
      comment.score
    );
  } else {
    commentPrimary2 = commentTemplate(
      comment.id,
      comment.user.image.png,
      comment.user.username,
      comment.createdAt,
      comment.content,
      comment.score
    );
  }

  if (comment.user.username !== currentUser) {
    commentContainer.insertAdjacentHTML("beforeend", commentPrimary1);
  } else if (comment.user.username === currentUser) {
    commentContainer.insertAdjacentHTML("beforeend", commentPrimary2);
  }
  updateSaved();
}
function postCommentPrimary(comment, commenSecondary = "") {
  let uniqueID = new Date().valueOf();
  const text = document.querySelector(".comment-input");
  const create = document.querySelector(".btn-send");
  if (text.value == "") {
    create.disabled = true;
  }
  text.addEventListener("input", () => {
    create.disabled = false;
  });
  if (text.value !== "") {
    create.disabled = false;
    let commentDate = timeSince(new Date());
    const commentPrimary = commentTemplate(
      uniqueID,
      currentUser.image.png,
      currentUser.username,
      commentDate,
      text.value,
      0
    );

    let newData = {
      id: `${uniqueID}`,
      content: `${text.value}`,
      createdAt: `${commentDate}`,
      score: `${0}`,
      user: {
        image: {
          png: "./images/avatars/image-juliusomo.png",
          webp: "./images/avatars/image-juliusomo.webp",
        },
        username: "juliusomo",
      },
      replies: [],
    };
    let clicksData = { id: `${uniqueID}`, clicks: 0 };
    clicksArray.push(clicksData);
    updateSavedClicks();
    commentContainer.insertAdjacentHTML("beforeend", commentPrimary);
    btnCreate.disabled = false;
    textField.value = "";
    textField.focus();
    commentsArray.push(newData);
    updateSaved();
  }
}
newComment.addEventListener("submit", (e) => {
  e.preventDefault();
  if (textField.value == "") {
    btnCreate.disabled = true;
  }
  textField.addEventListener("input", (e) => {
    btnCreate.disabled = false;
  });
  if (textField.value !== "") {
    btnCreate.disabled = false;
    postCommentPrimary(textField.value);
  }
});
//////////////////////////////////////////////////////////////////////
// *************** Delete Comment / Delete Reply **************//
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");

export function openModal() {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
}
export function closeModal() {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}

export function deleteComment(el) {
  openModal();
  document.querySelector(".btn-delete").addEventListener("click", (e) => {
    e.preventDefault();
    closeModal();
    el.style.transition = "all 2s";
    el.parentElement.remove();
    commentsArray.filter((x) => {
      x.id === Number(el.parentElement.id);
      if (x.id == Number(el.parentElement.id)) {
        commentsArray.splice(commentsArray.indexOf(x), 1);
        updateSaved();
      }
    });
  });
}
//////////////////////////////////////////////////////////////////////

// ****************  Helpler functions *************//
export function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}
export function removeFirstWord(str, repl) {
  const indexOfSpace = str.indexOf(" ");
  const first = str.split(" ")[0];
  if (indexOfSpace === -1 && first == `@${repl}`) {
    return "";
  }
  return str.substring(indexOfSpace + 1);
}
