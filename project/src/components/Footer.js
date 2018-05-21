import { stringToDOMElement } from '../util';

export default function Footer() {
  return stringToDOMElement(`
    <footer class="footer panel">
      <span class="footer__description bright">
        Impression by Simon Karasik,
        <a class="footer__email" href="mailto:senich10@mail.ru">
            senich10@mail.ru
        </a>
        ,&nbsp FAMCS, group 5
      </span>
      <span class="footer__update bright">
        Last update:
         <span id="update-date">19.02.18</span>
      </span>
    </footer>
    `.trim());
}
