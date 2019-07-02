export function Item () {

    this.init = (options) => {
        Object.keys(options).forEach((key)=>{this[key] = options[key]});
    }
}