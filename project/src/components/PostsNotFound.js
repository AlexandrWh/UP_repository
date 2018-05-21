import { stringToDOMElement } from '../util';

export default function PostsNotFound() {
  const element = stringToDOMElement(`
    <div class = "post posts-not-found">
      No posts found.
    </div>
  `.trim());
  return element;
}
