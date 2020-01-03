class State{
    constructor(name){
        this.name = name;
    }

    enter(){
        console.log(`[${this.name} enter]`);
        setTimeout(()=>{
            $(".tip").html(`[${this.name}  enter]`);
        }, 600);
    }

    exit(){
        console.log(`[${this.name} exit]`);
        $(".tip").html(`[${this.name} exit]`);
    }
}

export default State;