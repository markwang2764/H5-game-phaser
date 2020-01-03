

class Tree {
    constructor(data) {
        this.tree = data || []; 
        this.groups = {}; // 根据pid进行分组
    }

    init(pid) {
        this.group();
        let data = this.getData(this.groups[pid])
        return data;
    }

    group() {
        for (let i = 0 ; i < this.tree.length; i++){
            if (this.groups[this.tree[i].pid] === undefined) {
                this.groups[this.tree[i].pid] = [];
            }
            this.groups[this.tree[i].pid].push(this.tree[i]); 
        }
    }

    getData(group) {
        if (!group) {
            return [];
        }
        let result = [];
        for (let i = 0; i < group.length; i++ ){
            let item = group[i];
            if (!item.children) {
                item.children = [];
            }
            item.children = item.children.concat(this.getData(this.groups[item.id]))
            result.push(item);
        }
        return result;
    }
}
export default Tree;