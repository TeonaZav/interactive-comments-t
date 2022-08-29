"use strict";
import {
  clicksArray,
  getUserClicks,
  updateSavedClicks,
  commentsArray,
  getSavedColumns,
  updateSaved,
} from "./localStorage.js";
window.getUserClicks = getUserClicks;
window.updateSavedClicks = updateSavedClicks;
window.getSavedColumns = getSavedColumns;
window.updateSaved = updateSaved;
export let clickedPlus = 0;
export let clickedMinus = 0;
export let plus = false;
export let minus = false;
export function vote(el) {
  plus = true;
  minus = false;
  el.style.transition = "all 2s";
  let score = el.nextElementSibling.textContent;
  clickedPlus = clickedPlus + 1;
  clicksArray.filter((x) => {
    if (x.id == el.parentElement.parentElement.id) {
      if (clickedPlus > 1 || Number(x.clicks) > 0) {
        el.nextElementSibling.innerText = `${Number(score)}`;
        clickedPlus = 0;
      } else if (clickedPlus <= 1 && Number(x.clicks) == 0) {
        el.nextElementSibling.innerText = `${Number(score) + 1}`;
        x.clicks = Number(x.clicks) + 1;
        updateSavedClicks();
        checkComment1(el);
        checkReply1(el);
        checkReply2(el);
        clickedPlus = 0;
      }
    }
  });
}

export function annullingVote(el) {
  minus = true;
  plus = false;
  el.style.transition = "all 2s";
  let score = el.previousElementSibling.textContent;
  clickedMinus = clickedMinus + 1;
  clicksArray.filter((x) => {
    if (x.id == el.parentElement.parentElement.id) {
      if (clickedMinus <= 1 && Number(x.clicks) > 0) {
        el.previousElementSibling.innerText = `${Number(score) - 1}`;

        x.clicks = Number(x.clicks) - 1;
        updateSavedClicks();
        checkComment1(el);
        checkReply1(el);
        checkReply2(el);
        clickedMinus = 0;
      } else if (clickedMinus > 1 || Number(x.clicks) <= 0) {
        el.previousElementSibling.innerText = `${Number(score)}`;
        clickedMinus = 0;
      }
    }
  });
}
function checkComment1(el) {
  let target;
  commentsArray.filter((comment) => {
    if (comment.id == el.parentElement.parentElement.id) {
      if (plus == true) {
        comment.score = Number(comment.score) + 1;
        updateSaved();
      } else if (minus == true) {
        comment.score = Number(comment.score) - 1;
        updateSaved();
      }

      target = comment;
    }
  });
  return target;
}
function checkReply1(el) {
  let target;
  commentsArray.forEach((element) => {
    element.replies.filter((x) => {
      x.id == el.parentElement.parentElement.id;
      if (x.id == el.parentElement.parentElement.id) {
        if (plus == true) {
          x.score = Number(x.score) + 1;
          updateSaved();
        } else if (minus == true) {
          x.score = Number(x.score) - 1;
          updateSaved();
        }

        target = x;
      }
    });
  });
  return target;
}

function checkReply2(el) {
  let target;
  commentsArray.forEach((element) => {
    element.replies.forEach((reply) => {
      if (reply.replies) {
        reply.replies.filter((x) => {
          if (x.id == el.parentElement.parentElement.id) {
            if (plus == true) {
              x.score = Number(x.score) + 1;
              updateSaved();
            } else if (minus == true) {
              x.score = Number(x.score) - 1;
              updateSaved();
            }

            target = x;
          }
        });
      }
    });
  });
  return target;
}
