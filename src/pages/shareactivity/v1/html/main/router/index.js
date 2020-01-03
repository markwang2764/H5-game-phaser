import App from '../App.vue';

const toshare = r => require.ensure([], () => r(require('../../../page/toshare')), 'toshare');
const aftershare = r => require.ensure([], () => r(require('../../../page/aftershare')), 'aftershare');
const todownload = r => require.ensure([], () => r(require('../../../page/todownload')), 'todownload');

export default [{
    path: '/',
    component: App,
    children: [{
        path: '/toshare',
        component: toshare
    }, {
        path: '/aftershare',
        component: aftershare
    }, {
        path: '/todownload',
        component: todownload
    },  {
        path: '',
        component: toshare
    }]
}];
