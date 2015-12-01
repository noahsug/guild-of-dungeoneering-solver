export default class App {
  constructor(root) {
    this.root = root;
  }

  render() {
    console.log('rendering mah');
    const title = document.createElement('h1');
    title.innerText = 'Steph is #1';
    this.root.appendChild(title);
  }
}
