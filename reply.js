"use strict";
// ******************* REPLY ***************** ////
import {
  commentContainer,
  timeSince,
  deleteComment,
  openModal,
  closeModal,
  removeFirstWord,
} from "./script.js";

import { updateReply, updateText } from "./update.js";
import {
  clicksArray,
  getUserClicks,
  updateSavedClicks,
  commentsArray,
  getSavedColumns,
  updateSaved,
} from "./localStorage.js";
window.removeFirstWord = removeFirstWord;
window.deleteComment = deleteComment;
window.getSavedColumns = getSavedColumns;
window.updateSaved = updateSaved;
window.deleteReply = deleteReply;
window.deleteReplySec = deleteReplySec;
window.closeModal = closeModal;
window.updateSavedClicks = updateSavedClicks;
window.getUserClicks = getUserClicks;
window.updateReply = updateReply;
window.updateText = updateText;

let currentUser = {
  image: {
    png: "./images/avatars/image-juliusomo.png",
    webp: "./images/avatars/image-juliusomo.webp",
  },
  username: "juliusomo",
};

function replyTemplate(
  replyingTo,
  uniqueID,
  img,
  userName,
  commentDate,
  text,
  score,
  deletef,
  margin = ""
) {
  let replyT = `<div
class="comment-card-container ${margin} open"
dataset="first-comment"
id="first-reply"
><div class="comment comment-secondary" id="${uniqueID}">
<div class="avatar-container">
  <img src="${img}" class="avatar" />
  <h3 class="user-name">${userName} <span class="you-tag">you</span></h3>
  <div class="comment-date-time">${commentDate}</div>
</div>
<div class="delete" onclick="${deletef}(this)" >
  <span
    >
    <svg width="12" height="14" xmlns="http://www.w3.org/2000/svg"><path class="icon-delete" d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z" fill="#ED6368"/></svg>
    &nbsp</span
  >Delete
</div>
<div class="edit" onClick="updateReply(this)">
  <span
    ><svg width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path class="icon-edit" d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z" fill="#5357B6"/></svg>
    &nbsp</span
  >Edit
</div>
<div class="text-container">
  <p >
  <span class="replyingTo">@${replyingTo}</span>
    <span class="comment-text comment1-text">${text}</span>
    </p>
</div>

<div class="comment-value">
  <div class="btn-react btn-like" onClick="vote(this)">+</div>
  <div class="score">${score}</div>
  <div class="btn-react btn-dislike" onClick="annullingVote(this)">-</div>
</div>
</div>   </div>`;
  return replyT;
}
function replyFormHtml(targetedUser, id, f, formID, inputClass) {
  let form = `<form id="${formID}" class="comment new-comment" action="/" data-id="${id}" data-user="${targetedUser}">
    <textarea
    id='output'
      cols="30"
      rows="10"
      class="comment-input ${inputClass}"
    >@${targetedUser}, </textarea>
    <div class="avatar-container">
      <img
        src="images/avatars/image-juliusomo.png"
        class="avatar avatar-you"
      />
      <h3 class="user-name-new-comment">juliusomo &nbsp; &nbsp;</h3>
    </div>
    <input onClick="${f}(this)" class="btn-send" type="button" value="REPLY" />
  </form> `;

  return form;
}

function renderCommentSecondary(reply, currentUser, deleteF) {
  const commentSecondary = `<div
    class="comment-card-container open"
    dataset="first-comment"
    id="first-reply"
  ><div class="comment comment-secondary" id="${reply.id}">
  <div class="avatar-container">
    <img src="${reply.user.image.png}" class="avatar" />
    <h3 class="user-name">${reply.user.username}</h3>
    <div class="comment-date-time">${reply.createdAt}</div>
  </div>

  <div class="reply" onclick="newReplySecondary(this)">
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
  <div class="text-content">
  
  <p >
  <span class="replyingTo">@${reply.replyingTo}</span>
    <span class="comment-text comment1-text">${reply.content}</span>
    </p>
  </div>

  <div class="comment-value">
    <div class="btn-react btn-like" onClick="vote(this)">+</div>
    <div class="score" >${reply.score}</div>
    <div class="btn-react btn-dislike" onClick="annullingVote(this)">-</div>
  </div>
</div></div>`;
  let html = ``;
  if (reply.id > 10) {
    let createdAt = timeSince(reply.id);
    html = replyTemplate(
      reply.replyingTo,
      reply.id,
      reply.user.image.png,
      reply.user.username,
      createdAt,
      reply.content,
      reply.score,
      deleteF,
      ""
    );
  } else {
    html = replyTemplate(
      reply.replyingTo,
      reply.id,
      reply.user.image.png,
      reply.user.username,
      reply.createdAt,
      reply.content,
      reply.score,
      deleteF,
      ""
    );
  }

  if (reply.user.username !== currentUser) {
    commentContainer.insertAdjacentHTML("beforeend", commentSecondary);
  } else if (reply.user.username === currentUser) {
    commentContainer.insertAdjacentHTML("beforeend", html);
  }
  updateSaved();
}

function newReply(el) {
  let targetedParent = el.parentElement;
  let targetedUserName =
    targetedParent.firstElementChild.childNodes[3].textContent;
  let updatedArr = commentsArray.filter(
    (x) => x.id === Number(targetedParent.id)
  );
  let formHtml = replyFormHtml(
    targetedUserName,
    updatedArr[0].id,
    "postReply",
    "new-reply",
    "comment-input-reply"
  );
  targetedParent.insertAdjacentHTML("afterEnd", formHtml);
}
function newReplySecondary(el) {
  let targetedParent = el.parentElement;
  let targetedUserName =
    targetedParent.firstElementChild.childNodes[3].textContent;
  commentsArray.forEach((element) => {
    let formHtml;
    element.replies.filter((x) => {
      x.id === Number(targetedParent.id);

      if (x.id == Number(targetedParent.id)) {
        formHtml = replyFormHtml(
          targetedUserName,
          x.id,
          "postReplySecondary",
          "new-reply-secondary",
          "comment-input-reply-sec"
        );
        targetedParent.insertAdjacentHTML("afterEnd", formHtml);
      }
    });
  });
}
function postReply(el) {
  let commentDate = timeSince(new Date());
  let uniqueID = new Date().valueOf();
  let targetedId = el.parentElement.dataset.id;
  let tName = el.parentElement.dataset.user;
  let parent = document.getElementById(`${targetedId}`);
  const text = document.querySelector(".comment-input-reply");
  const create = document.querySelector(".btn-send");
  let updatedArr = commentsArray.filter((x) => x.id === Number(targetedId));
  let scoreCounter = 0;
  let newText = removeFirstWord(text.value, tName);
  if (text.value == "") {
    create.disabled = true;
  }
  text.addEventListener("input", () => {
    create.disabled = false;
  });
  if (text.value !== "") {
    create.disabled = false;
    let clicksData = { id: `${uniqueID}`, clicks: 0 };

    let newData = {
      id: `${uniqueID}`,
      content: `${newText}`,
      createdAt: `${commentDate}`,
      score: `${scoreCounter}`,
      user: {
        image: {
          png: "./images/avatars/image-juliusomo.png",
          webp: "./images/avatars/image-juliusomo.webp",
        },
        username: "juliusomo",
      },
      replyingTo: `${tName}`,
      replies: [],
    };
    updatedArr[0].replies.push(newData);
    updateSaved();
    let html = replyTemplate(
      tName,
      uniqueID,
      currentUser.image.png,
      currentUser.username,
      commentDate,
      newText,
      scoreCounter,
      "deleteReply",
      ""
    );
    clicksArray.push(clicksData);
    updateSavedClicks();
    parent.insertAdjacentHTML("afterEnd", html);
    el.parentElement.remove();
  }
}
function postReplySecondary(el) {
  let commentDate = timeSince(new Date());
  let uniqueID = new Date().valueOf();
  let targetedId = el.parentElement.dataset.id;
  let tName = el.parentElement.dataset.user;
  let parent = document.getElementById(`${targetedId}`);
  const text = document.querySelector(".comment-input-reply-sec");
  const replying = document.querySelector(".replyingTo");
  const create = document.querySelector(".btn-send");
  let scoreCounter = 0;
  let targArr = [];
  let newText = removeFirstWord(text.value, tName);
  let newData = {
    id: `${uniqueID}`,
    content: `${newText}`,
    createdAt: `${commentDate}`,
    score: `${scoreCounter}`,
    user: {
      image: {
        png: "./images/avatars/image-juliusomo.png",
        webp: "./images/avatars/image-juliusomo.webp",
      },
      username: "juliusomo",
    },
    replyingTo: `${tName}`,
    replies: [],
  };
  let clicksData = { id: `${uniqueID}`, clicks: 0 };

  if (text.value == "") {
    create.disabled = true;
  }
  text.addEventListener("input", () => {
    create.disabled = false;
  });
  if (text.value !== "") {
    create.disabled = false;
    commentsArray.forEach((element) => {
      element.replies.filter((x) => {
        x.id === Number(targetedId);
        if (x.id == targetedId) {
          targArr = x;
          if (targArr.replies) {
            targArr.replies.push(newData);
            updateSaved();
          } else {
            targArr.replies = [];
            targArr.replies.push(newData);
            updateSaved();
          }
        }
      });
    });

    let html = replyTemplate(
      tName,
      uniqueID,
      currentUser.image.png,
      currentUser.username,
      commentDate,
      newText,
      scoreCounter,
      "deleteReplySec",
      "no-margin"
    );
    parent.insertAdjacentHTML("afterEnd", html);
    clicksArray.push(clicksData);
    updateSavedClicks();
  }
  el.parentElement.remove();
}

function deleteReply(el) {
  openModal();
  document.querySelector(".btn-delete").addEventListener("click", (e) => {
    e.preventDefault();
    closeModal();
    el.style.transition = "all 2s";
    el.parentElement.remove();
    commentsArray.forEach((element) => {
      element.replies.filter((x) => {
        x.id === Number(el.parentElement.id);
        if (x.id == Number(el.parentElement.id)) {
          element.replies.splice(element.replies.indexOf(x), 1);
          updateSaved();
        }
      });
    });
  });
}
function deleteReplySec(el) {
  openModal();
  document.querySelector(".btn-delete").addEventListener("click", (e) => {
    e.preventDefault();
    closeModal();
    el.style.transition = "all 2s";
    el.parentElement.remove();
    commentsArray.forEach((element) => {
      element.replies.forEach((reply) => {
        if (reply.replies) {
          reply.replies.filter((x) => {
            x.id === Number(el.parentElement.id);
            if (x.id == Number(el.parentElement.id)) {
              reply.replies.splice(reply.replies.indexOf(x), 1);
              updateSaved();
            }
          });
        }
      });
    });
  });
}
export {
  renderCommentSecondary,
  newReplySecondary,
  postReplySecondary,
  postReply,
  newReply,
};
