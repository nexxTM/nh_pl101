var endTime = function (time, exp) {
    switch(exp.tag) {
        case "note":
            return time + exp.dur;
            break;
        case "rest":
            return time + exp.dur;
            break;
        case "seq":
            return endTime(endTime(time, exp.left) , exp.right);
            break;
        case "par":
            return time + Math.max(endTime(time, exp.left),
                                   endTime(time, exp.right));
            break;
        case "repeat":
            return time + endTime(time, exp.section) * exp.count;
            break;
    }
};

var octave = function(p) {
    if(p.length === 2) {
        //e.g. c3
        return parseInt(p.charAt(1));
    } else {
        //e.g. c#3
        return parseInt(p.charAt(2));
    }
}

var letter = function(p) {
    // http://midikits.net23.net/midi_analyser/midi_note_numbers_for_octaves.htm
    var trans = { 'c' : 0, 'c#' : 1, 'd' : 2, 'd#' : 3, 'e' : 4, 'f' : 5, 'f#' : 6, 'g' : 7, 'g#' : 8, 'a' : 9, 'a#' : 10, 'b' : 11};
    
    if(p.length === 2) {
        //e.g. c3
        return trans[p.charAt(0)];
    } else {
        //e.g. c#3
        return trans[p.substring(0,1)];
    }
}

var convertPitch = function(p) {
    return 12 + 12 * octave(p) + letter(p);
}

var repeat = function(arr, times) {
    if(times < 1) {
        return [];
    }
    return arr.concat(repeat(arr,times-1));
}

var compileH = function (time, exp) {
    switch(exp.tag) {
        case "note":
            return [{tag: 'note', pitch: convertPitch(exp.pitch), start: time, dur: exp.dur}];
            break;
        case "rest":
            return [{tag: 'rest', start: time, dur: exp.dur}];
            break;
        case "seq":
            return compileH(time, exp.left).concat(compileH(endTime(time, exp.left), exp.right));
            break;
        case "par":
            return compileH(time, exp.left).concat(compileH(time, exp.right));
            break;
        case "repeat":
            return repeat(compileH(time, exp.section), exp.count);
            break;
        default:
            console.log("Unknown tag");
    }
};


var compile = function (musexpr) {
    return compileH(0,musexpr);
};

var simple = { tag: 'note', pitch: 'c1', dur: 23 };

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

var melody_mus2 = 
    { tag: 'seq',
      left: 
       { tag: 'repeat',
         section: { tag: 'seq',
                    left: { tag: 'note', pitch: 'a4', dur: 250 },
                    right: { tag: 'note', pitch: 'b4', dur: 250 } },
         count: 4 },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'c4', dur: 500 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } } };

console.log(simple);
console.log(compile(simple));
         
console.log(melody_mus);
console.log(compile(melody_mus));

console.log(melody_mus2);
console.log(compile(melody_mus2));
