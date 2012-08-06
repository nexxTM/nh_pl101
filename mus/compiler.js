var endTime = function (time, expr) {
    if(expr.tag === 'seq') {
        return endTime(endTime(time, expr.left) , expr.right);
    } else if(expr.tag === 'note' || expr.tag === 'rest') {
        return time + expr.dur;
    } else if(expr.tag === 'par') {
        return time + Math.max(endTime(time, expr.left),
                               endTime(time, expr.right));
    }
};       

var compileH = function (time, exp) {
    var l;
    var r;
    if(exp.tag === 'note') {
        return [{tag: 'note', pitch: exp.pitch, start: time, dur: exp.dur}];
    } else if(exp.tag === 'rest') {
        return [{tag: 'rest', start: time, dur: exp.dur}];
    } else if(exp.tag === 'seq') {  
        l = compileH(time, exp.left);
        r = compileH(endTime(time, exp.left), exp.right);
        return l.concat(r);
    } else if(exp.tag === 'par') {
        l = compileH(time, exp.left);
        r = compileH(time, exp.right);
        return l.concat(r);
    }
};


var compile = function (musexpr) {
    return compileH(0,musexpr);
};

var melody_mus = 
    { tag: 'seq',
      left: 
       { tag: 'seq',
         left: { tag: 'note', pitch: 'a4', dur: 250 },
         right: { tag: 'note', pitch: 'b4', dur: 250 } },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'c4', dur: 500 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } } };

console.log(melody_mus);
console.log(compile(melody_mus));
