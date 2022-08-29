"use strict";
import {
  commentContainer,
  timeSince,
  deleteComment,
  openModal,
  closeModal,
  removeFirstWord,
} from "./script.js";
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
window.closeModal = closeModal;
window.updateSavedClicks = updateSavedClicks;
window.getUserClicks = getUserClicks;
let editClick = 0;
export function updateComment(el) {
  editClick = editClick + 1;
  let parent = el.parentElement;
  let textC = parent.lastElementChild.previousElementSibling.firstElementChild;
  let text = `<p> ${textC.textContent}</p>`;
  parent.classList.add("updating");
  let formHtml = `<form  data-id="${el.parentElement.id}">
            <textarea
             type="text"
              class="comment-input update-mode"           
            > ${textC.innerText} </textarea>         
            <input onClick="updateText(this)" class="btn-update" type="button" value="UPDATE" />
          </form> `;

  textC.innerHTML = formHtml;
  if (editClick % 2 == 0) {
    parent.classList.remove("updating");
    textC.innerHTML = text;
    editClick = 0;
  }
}

export function updateText(el) {
  let editedText = el.parentElement.firstElementChild.value;
  let targetedId = el.parentElement.dataset.id;
  let parent = document.getElementById(`${targetedId}`);
  if (parent.classList.contains("comment-secondary")) {
    editedText = el.parentElement.firstElementChild.value;
    const firstWord = editedText.split(" ")[0];
    const substr = removeFirstWord(editedText, `@${firstWord}`);
    let text = `<p >
    <span class="replyingTo">${firstWord}</span>
          <span class="comment-text comment1-text">${substr}</span>
      </p>`;
    parent.lastElementChild.previousElementSibling.insertAdjacentHTML(
      "beforeend",
      text
    );
    commentsArray.forEach((element) => {
      element.replies.filter((x) => {
        x.id == targetedId;
        if (x.id == targetedId) {
          x.content = substr;
          updateSaved();
        }
      });
    });
    commentsArray.forEach((element) => {
      element.replies.forEach((reply) => {
        if (reply.replies) {
          reply.replies.filter((x) => {
            if (x.id == targetedId) {
              x.content = substr;
              updateSaved();
            }
          });
        }
      });
    });
  } else {
    parent.lastElementChild.previousElementSibling.firstElementChild.textContent =
      editedText;
  }

  commentsArray.filter((comment) => {
    if (comment.id == targetedId) {
      comment.content = editedText;
      updateSaved();
    }
  });
  parent.classList.remove("updating");
  el.parentElement.remove();
  editClick = 0;
}
export function updateReply(el) {
  editClick = editClick + 1;

  let parent = el.parentElement;
  let textC = parent.lastElementChild.previousElementSibling;
  let replyingTo =
    parent.lastElementChild.previousElementSibling.firstElementChild
      .firstElementChild;
  let mainText =
    parent.lastElementChild.previousElementSibling.firstElementChild
      .lastElementChild.textContent;

  let text = `<p>
    <span class="replyingTo">${replyingTo.textContent}</span>
    <span class="comment-text comment1-text">${mainText}</span>
      </p>`;
  replyingTo.remove();
  parent.classList.add("updating");
  let formHtml = `<form  data-id="${el.parentElement.id}">
            <textarea
             type="text"
              class="comment-input comment-input-reply-sec update-mode"
            >${replyingTo.textContent} ${mainText}</textarea>
            <input onClick="updateText(this)" class="btn-update" type="button" value="UPDATE" />
          </form> `;

  textC.innerHTML = formHtml;
  let firstWord;
  let substr;
  if (editClick % 2 == 0) {
    if (replyingTo.textContent.split(" ").length > 1) {
      firstWord = replyingTo.textContent.split(" ")[0];
      substr = removeFirstWord(replyingTo.textContent, `@${firstWord}`);
    } else {
      firstWord = replyingTo.textContent;
    }

    let text = `<p >
    <span class="replyingTo">${firstWord}</span>
          <span class="comment-text comment1-text">${substr}</span>
      </p>`;
    parent.classList.remove("updating");
    textC.innerHTML = text;
    editClick = 0;
  }
}
