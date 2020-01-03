import { getConfig, getEmbed } from '../service/getData';
import Promise from 'promise-polyfill';

export default {
    data() {
        return {
            data: {}
        }
    },

    methods: {
        initData() {

        },

        getConfigData() {
            return new Promise((resolve, reject)=>{ 
                getConfig()
                .then(result => {
                    result = result.data;
                    const {
                    code,
                        desc,
                        data,
                        success
                    } = result;
                    if (success && data) {
                        console.log(data)
                        this.data =  Object.assign({}, this.data, data)
                        console.log(this.data);
                        resolve();

                    } else {
                        console.error(desc);
                        reject();
                    }
                })
                .catch(err => {
                    console.error(err);
                    reject();
                });
            })
        },

        getEmbedData() {
            return new Promise((resolve, reject)=>{
                getEmbed()
                .then(result => {
                    result = result.data;
                    const {
                    code,
                        desc,
                        data,
                        success
                } = result;
                    if (success && data) {
                        console.log(data)
                        this.$embed.update(data);
                        resolve();

                    } else {
                        console.error(desc);
                        reject();
                    }

                })
                .catch(err => {
                    console.error(err);
                    reject();

                });
            })

        }
    }
}