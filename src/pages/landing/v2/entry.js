import './entry.less';

const item_tansy_dir = 40 / 100;
const ele_count = 4;
const item_transy_durantion = 1400;
function linkTo() {
    countLog.init(function () {
        let apkUrl = document.querySelector('#helper').getAttribute('data-href');
        window.location.href = apkUrl;
        // $!{downUrl};
    });
}

document.querySelector('#main').onclick = ()=>{
    linkTo();
};
let i = 0;
setInterval(function () {
    stepAnimate(i % (ele_count * 2));
    i++;
}, item_transy_durantion);
function stepAnimate(i) {
    let helper = document.getElementById('helper');
    let container = document.getElementById('container');
    if (i === 0) {
        container.style.display = 'block';
        container.style.transform = 'translateY(0)';
        helper.style.display = 'block';
        helper.style.transform = 'translateY(' + -ele_count * item_tansy_dir + 'rem)';
    }
    if (i > 0 && i <= ele_count - 1) {
        container.style.display = 'block';
        container.style.transform = 'translateY(' + -item_tansy_dir * i + 'rem)';
        helper.style.display = 'none';
        helper.style.transform = 'translateY(' + item_tansy_dir + 'rem)';
        if (i === ele_count - 1) {
            helper.style.display = 'block';
        }
    }
    if (i === ele_count) {
        container.style.display = 'block';
        container.style.transform = 'translateY(' + -ele_count * item_tansy_dir + 'rem)';
        helper.style.display = 'block';
        helper.style.transform = 'translateY(0)';
    }
    if (i > ele_count && i <= 2 * ele_count - 1) {
        container.style.display = 'none';
        container.style.transform = 'translateY(' + item_tansy_dir + 'rem)';
        helper.style.display = 'block';
        helper.style.transform = 'translateY(' + -item_tansy_dir * (i - ele_count) + 'rem)';
        if (i === 2 * ele_count - 1) {
            container.style.display = 'block';
        }
    }

}