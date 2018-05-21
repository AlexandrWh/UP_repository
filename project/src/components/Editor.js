import { stringToDOMElement } from '../util';
import EditPost from './EditPost';
import Header from './Header';
import Footer from './Footer';

export default function Editor(post) {
  const content = stringToDOMElement(`
    <div class="content main-content">
      <main class="main" id = "main">
        <div class="posts"></div>
      </main>
    </div>
  `.trim());
  content.querySelector('.posts').appendChild(EditPost(post));
  return [Header(), content, Footer()];
}
