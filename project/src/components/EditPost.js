import { stringToDOMElement } from '../util';
import handle from '../handlers';

function makeTag(tag) {
  const element = stringToDOMElement(`
    <span 
      type="text" 
      class="post__tag post__tag--editable input" 
      contenteditable="true">
      ${tag}
    </span>&nbsp
  `.trim());

  element.onkeypress = (event) => {
    if (event.code === 'Enter') {
      event.preventDefault();
      event.target.blur();
    }
  };

  element.onblur = (event) => {
    if (event.target.innerText.length === 0) {
      event.target.parentNode.removeChild(event.target);
    }
  };
  return element;
}

export default function EditPost(post = {
  tags: [],
  photoLink: '',
  description: '',
}) {
  const element = stringToDOMElement(`
    <div class="post">
      <form class="post__edit-form">
        <img class="post__photo" alt="Photo preview" src=${post.photoLink} />
        <div>Photo link: <input id="photoLink" type="text" value="${post.photoLink}" class="input"/></div>
        <div><label class="input" for="photoFile">Load photo</label><input type="file" accept="image/*" id="photoFile"></div>
        <div class="post__tags">
          Tags:
          <span id="tags"></span>
          <a class="post__tag post__tag--add input">Add tag</a>
        </div>
        <div>
          Description:
          <div>
            <textarea 
              required 
              maxlength="200"
              class="input post__description post__description--editable">${post.description}
            </textarea>
          </div>
        </div>
        <button type="submit" class="input bright">Save</button>
        <button id="cancel" class="input bright">Cancel</button>
    </div>
  `.trim());
  const tagsWrapper = element.querySelector('#tags');
  post.tags.forEach(tag => tagsWrapper.appendChild(makeTag(tag)));

  let state = {
    usePhotoLink: true,
    photoLink: post.photoLink,
  };

  element.querySelector('#photoLink').onblur = (event) => {
    const url = event.target.value;
    if (url !== state.photoLink && url !== '') {
      element.querySelector('.post__photo').src = url;
      state = {
        usePhotoLink: true,
        photoLink: url,
      };
    }
  };

  element.querySelector('#photoFile').onchange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      state = {
        usePhotoLink: false,
        photoFile: file,
      };
      element.querySelector('.post__photo').src = reader.result;
      element.querySelector('#photoLink').value = '';
    };
    reader.readAsDataURL(file);
  };

  element.querySelector('.post__tag--add').onclick = () => {
    const newTag = makeTag('');
    tagsWrapper.appendChild(newTag);
    newTag.focus();
  };

  element.querySelector('.post__edit-form').onsubmit = (event) => {
    event.preventDefault();
    if (!state.photoLink && !state.photoFile) {
      alert('Please, provide either photo link, either photo file');
      return;
    }
    const tags = Array.prototype.map.call(
      element.querySelectorAll('.post__tag--editable'),
      node => node.innerText,
    );
    const description = element.querySelector('.post__description').value;
    const postToSend = Object.assign({}, post, {
      tags,
      description,
    });
    if (state.usePhotoLink) {
      postToSend.photoLink = state.photoLink;
    } else {
      delete postToSend.photoLink;
      postToSend.photoFile = state.photoFile;
    }
    handle({
      type: 'SAVE_POST',
      photo: state,
      post: postToSend,
    });
  };

  element.querySelector('#cancel').onclick = (event) => {
    event.preventDefault();
    handle({
      type: 'CANCEL_EDITING',
    });
  };

  element.querySelector('#photoLink').onkeypress = (event) => {
    if (event.code === 'Enter') {
      event.preventDefault();
    }
  };

  return element;
}
