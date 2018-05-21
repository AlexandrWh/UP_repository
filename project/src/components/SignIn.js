import { stringToDOMElement } from '../util';
import Footer from './Footer';
import handle from '../handlers';

export default function SignIn() {
  const form = `
    <form class="sign-in__form">
      <h1 class="sign-in__form__header bright">Sign in</h1>
      <input type="email" required class="sign-in__input input" name="email" placeholder="Email Address">
      <input type="password" required class="sign-in__input input" name="password" placeholder="Password">
      <button type="submit" class="button bright sign-in__button">Sign in</button>
      <button id="signAsGuest" class="button bright sign-in__button">Sign in as a guest</button>  
    </form>
  `.trim();

  const element = stringToDOMElement(`
    <div class="sign-in">
      <div class="sign-in__content">
        <h1 class="sign-in__header bright">Impression</h1>
        ${form}
      </div>
    </div>
  `.trim());
  element.appendChild(Footer());

  element.querySelector('.sign-in__form').onsubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    handle({
      type: 'LOGIN',
      email: formData.get('email'),
      password: formData.get('password'),
      onLoggedIn: () => handle({
        type: 'SET_PAGE',
        pageName: 'app',
      }),
      onError: () => {
        alert('Wrong email or password');
      },
    });
  };

  element.querySelector('#signAsGuest').onclick = (event) => {
    event.preventDefault();
    handle({
      type: 'LOGIN',
      asGuest: true,
      onLoggedIn: () => handle({
        type: 'SET_PAGE',
        pageName: 'app',
      }),
    });
  };

  return element;
}
