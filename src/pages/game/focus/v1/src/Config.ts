/**
 * @author zoney
 * @desc 游戏配置文件
 */
var gcf = {
    /** */
    WIDTH: 750,
    /** */
    HEIGHT: 1206,
    /** */
    DEFAULT_ASSETS: '',
    /** */
    PLAY_WIDTH: 730,
    /** */
    PLAY_HEIGHT: 760,
    /** */
    PLAY_HSLIDE: 10,
    /** */
    PLAY_VSLIDE: 20,

    HOST: "//yun.dui88.com/h5-mami/webgame/game/focus/v1/",
    /**音效音量 */
    VOLUME: 5
}
gcf.HEIGHT = gcf.WIDTH / (window.innerWidth / window.innerHeight);
export default gcf