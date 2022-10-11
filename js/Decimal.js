
export function countDecimals(num) {
    if (Math.floor(num) !== num)
        return num.toString().split(".")[1].length || 0;
    return 0;
}

export function toNFixed(num, precision) {
    let re = new RegExp(`^-?\\d+(?:\.\\d{0,${precision}})?`);
    console.log(num);
    return num.toString().match(re)[0];
}