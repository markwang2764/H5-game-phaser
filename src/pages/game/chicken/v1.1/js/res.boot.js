var CK = CK || {};

(function () {
	var res = [
		{
			type: 'image',
			name: 'bg',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/bg1.jpg'
		},
		{
			type: 'image',
			name: 'bullet_0',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/bullet_0.png'
		},
		{
			type: 'image',
			name: 'bullet_1',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/bullet_1.png'
		},
		{
			type: 'image',
			name: 'hurt',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/chicken_red_6.png'
		},
		{
			type: 'image',
			name: 'reduce',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/one.png'
		},
		{
			type: 'image',
			name: 'dead',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/dead.png'
		},
		{
			type: 'image',
			name: 'item',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/tool.png'
		},
		{
			type: 'image',
			name: 'b_increace',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/bullet_incr.png'
		},
		{
			type: 'image',
			name: 'bg_head_1',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/bg_head_1.png'
		},
		{
			type: 'image',
			name: 'bg_head_0',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/bg_head_0.png'
		},
		{
			type: 'image',
			name: 'ripe',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/ripe1.png'
		},
		{
			type: 'image',
			name: 'ready',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/ready.png'
		},
		{
			type: 'image',
			name: 'go',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/go.png'
		},
		{
			type: 'image',
			name: 'arrow',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/arrow.png'
		},
		{
			type: 'image',
			name: 'I',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/I.png'
		},
		{
			type: 'image',
			name: 'heart',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/heart.png'
		},
		{
			type: 'image',
			name: 'win_0',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/chicken_blue_4.png'
		},
		{
			type: 'image',
			name: 'win_1',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/chicken_red_4.png'
		},
		{
			type: 'image',
			name: 'emoji_1',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/emoji_1.png'
		},
		{
			type: 'image',
			name: 'emoji_2',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/emoji_2.png'
		},
		{
			type: 'image',
			name: 'emoji_3',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/emoji_3.png'
		},
		{
			type: 'image',
			name: 'emoji_4',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/emoji_4.png'
		},
		{
			type: 'image',
			name: 'tip',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/font.png'
		},
		{
			type: 'image',
			name: 'guide',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/guide.png'
		},
		{
			type: 'image',
			name: 'item_1',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/item_1.png'
		},
		{
			type: 'image',
			name: 'item_2',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/item_2.png'
		},

		{
			type: 'spritesheet',
			name: 'buildup_1',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/buildup_1.png',
			w: 88,
			h: 100,
			frame: 8
		},
		{
			type: 'spritesheet',
			name: 'wing_1',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/wing_1.png',
			w: 67,
			h: 91,
			frame: 6
		},
		{
			type: 'spritesheet',
			name: 'wing_2',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/wing_2.png',
			w: 67,
			h: 91,
			frame: 6
		},
		{
			type: 'spritesheet',
			name: 'attack',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/attack.png',
			w: 190,
			h: 175,
			frame: 6
		},
		{
			type: 'spritesheet',
			name: 'buff',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/buff.png',
			w: 204,
			h: 260,
			frame: 10
		},
		{
			type: 'spritesheet',
			name: 'buildup_2',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/buildup_2.png',
			w: 88,
			h: 92,
			frame: 8
		},
		{
			type: 'spritesheet',
			name: 'jet',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/jet.png',
			w: 74,
			h: 115,
			frame: 6
		},
		{
			type: 'spritesheet',
			name: 'mouth',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/mouth.png',
			w: 44,
			h: 52,
			frame: 2
		},
		{
			type: 'spritesheet',
			name: 'reborn',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/reborn.png',
			w: 176,
			h: 158,
			frame: 12
		},
		{
			type: 'spritesheet',
			name: 'chicken_0',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/chicken_0.png',
			w: 119,
			h: 126,
			frame: 3
		},
		{
			type: 'spritesheet',
			name: 'chicken_1',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/chicken_1.png',
			w: 119,
			h: 126,
			frame: 3
		},
		{
			type: 'spritesheet',
			name: 'cover',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/cover.png',
			w: 186,
			h: 198,
			frame: 5
		},
		{
			type: 'spritesheet',
			name: 'break',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/breaks.png',
			w: 186,
			h: 198,
			frame: 5
		},
		{
			type: 'spritesheet',
			name: 'click',
			url: '//yun.dui88.com/h5-mami/webgame/chicken/asset/click.png',
			w: 100,
			h: 100,
			frame: 14
		},
	];

	CK.res = res;
})();