Phaser.Filter.MyShader = function (game) {
  Phaser.Filter.call(this, game);
  // this.uniforms.gray = {
  // 	type: '1f',
  // 	value: 0.99
  // };
  this.uniforms.saturation = {
    	type: '1f',
    	value: 0.0
  };

  this.uniforms.intensity = {
    	type: '1f',
    	value: 0.0
  };

  this.fragmentSrc = [
    	'precision mediump float;',
    	'varying vec2 vTextureCoord;',
    	// "varying vec4 vColor;",
    	'uniform sampler2D uSampler;',
    	// "uniform float gray;",
    	'uniform float saturation;',
    	'uniform float intensity;',

    	// "const mediump vec3 luminanceWeighting = vec3(1.0, 1.4, 1.4);", //光亮度里三个值相加要为1，各个值代表着颜色的百分比.

    	'void main(void){',
    	'vec4 textureColor = texture2D(uSampler, vTextureCoord);',
    	
    	// "vec3 greyScaleColor = vec3(luminanceWeighting);",
    	// "gl_FragColor.rgb = mix(textureColor.rgb, vec3(0.3333 * textureColor.r + 0.3334 * textureColor.g + 0.3333 * textureColor.b), gray);" ,
    	// "gl_FragColor.rgb = mix(textureColor.rgb, greyScaleColor, saturation);" ,
    	'gl_FragColor.rgb = mix(textureColor.rgb, vec3(intensity * textureColor.r + intensity * textureColor.g + intensity * textureColor.b), saturation);',
    	// "gl_FragColor = vec4(mix(greyScaleColor, textureColor.rgb, saturation), textureColor.w);",
    	'}'
  ];
};

Phaser.Filter.MyShader.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.MyShader.prototype.constructor = Phaser.Filter.MyShader;

Phaser.Filter.MyShader.prototype.init = function (width, height) {
  this.setResolution(width, height);
};

Object.defineProperty(Phaser.Filter.MyShader.prototype, 'saturation', {

  get: function () {
    return this.uniforms.saturation.value;
  },

  set: function (value) {
    this.uniforms.saturation.value = value;
  }

});

Object.defineProperty(Phaser.Filter.MyShader.prototype, 'intensity', {

  get: function () {
    return this.uniforms.intensity.value;
  },

  set: function (value) {
    this.uniforms.intensity.value = value;
  }

});
