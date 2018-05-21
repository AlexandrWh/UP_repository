import { stringToDOMElement } from '../util';
import { getState } from '../state';
import handle from '../handlers';
import PhotoPosts from './PhotoPosts';
import Filter from './Filter';

export default function Content() {
  const { user } = getState();

  const element = stringToDOMElement(`
    <div class="content main-content">
      <aside class="sidebar">
        <ul class="menu menu-panel">
          <li class="menu__item">
            <a href="#" class="bright">Impressions</a>
          </li>
          ${user ? `
          <li class="menu__item bright">
            <a href="#" class="bright">My impressions</a>
          </li>
          <li class="menu__item bright">
            <a href="#" class="bright">New impression</a>
          </li>`.trim() : ''}
        </ul>
      </aside>
      <main class="main" id = "main">
        <button class="show-more-button button">Load more...</button>
      </main>
    </div>
  `.trim());

  const menuItems = element.querySelector('.menu').children;
  menuItems[0].onclick = () => handle({
    type: 'SHOW_POSTS',
  });
  if (menuItems.length > 1) {
    menuItems[1].onclick = () => handle({
      type: 'FILTER_POSTS',
      filterConfig: {
        author: user.name,
      },
    });
    menuItems[2].onclick = () => handle({
      type: 'CREATE_POST',
    });
  }

  const main = element.querySelector('#main');
  main.insertBefore(PhotoPosts(), main.firstChild);
  element.querySelector('.sidebar').appendChild(Filter());

  element.querySelector('.show-more-button').onclick = () => {
    handle({
      type: 'SHOW_MORE_POSTS',
    });
  };

  handle({
    type: 'SHOW_POSTS',
  });
  return element;
}
