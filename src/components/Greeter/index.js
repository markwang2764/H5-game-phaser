/**
 * @note
 * @author  miaokefu <alfred>
 * @create  2018-04-03
 * @des
 */
require('./index.scss');

const Greeter = name => {
  let greet = document.createElement('div');
  greet.className = 'root';
  greet.textContent = `Hi there and greetings from ${name}!!!`;
  return greet;
};

export default Greeter;
