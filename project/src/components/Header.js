import { stringToDOMElement } from '../util';
import { getState } from '../state';
import handle from '../handlers';

export default function Header() {
  let user = getState().user || {
    name: 'Guest',
    avatarLink: 'user_icon.png',
  };
  user.avatarLink = user.avatarLink || 'user_icon.png';
  
  const element = stringToDOMElement(`
    <header class="header panel">
      <div class="header__user-wrapper header__sideblock header__user">
        <img class="header__user__avatar" src="${user.avatarLink}"> &nbsp
        <span class="header__user__name">${user.name}</span>
      </div>
      <h1 class="header__title">IMPRESSION</h1>
      <div class="header__sideblock header__logout-wrapper">
        <a class="header__logout">
          <i class="material-icons icon-button">exit_to_app</i>
        </a>
      </div>
    </header>
  `.trim());

  element.querySelector('.header__logout').onclick = () => {
    handle({
      type: 'LOGOUT',
    });
    handle({
      type: 'SET_PAGE',
      pageName: 'signIn',
    });
  };

  return element;
}
