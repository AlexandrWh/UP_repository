import handle from '../handlers';
import { stringToDOMElement } from '../util';

export default function Filter() {
  const element = stringToDOMElement(`
    <form class="search menu-panel">
      <span class="search__title bright">Filter</span>
      <div class="search__panel">
        <div class="search__option">
        <input type="text" name="author" class="search__input" placeholder="By author">
      </div>
      <div class="search__option">
        <label>From date</label>
        <input type="date" name="fromDate" class="search__input">
        <label>To date</label>
        <input type="date" name="toDate" class="search__input">
      </div>
      <div class="search__option">
        <input type="text" name="tags" class="search__input" placeholder="By tag">
      </div>
      <button class="search__button button">Filter</button>
    </form>
  `.trim());

  element.querySelector('.search__button').onclick = (e) => {
    e.preventDefault();
    const formData = new FormData(element);
    const tags = formData.get('tags').split(/[#, ]/).filter(s => s !== '');
    const author = formData.get('author').trim();
    const fromDate = formData.get('fromDate') === '' ? null : new Date(formData.get('fromDate'));
    const toDate = formData.get('toDate') === '' ? null : new Date(formData.get('toDate'));
    handle({
      type: 'FILTER_POSTS',
      filterConfig: {
        fromDate,
        toDate,
        tags,
        author,
      },
    });
  };

  return element;
}