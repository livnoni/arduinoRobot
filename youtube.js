const stream = require('youtube-audio-stream');
const decoder = require('lame').Decoder;
const speaker = require('speaker');



class Youtube{
    constructor(){
        this.currenUrl = "";
        this.streams = [];
    }

    play(url){
        if(this.currenUrl !== url){
            this.stop();
            this.currenUrl = url;
            console.log(`start playing youtube -> ${url}`)
            var s = stream(url)
                .pipe(decoder())
                .pipe(new speaker())

            this.streams.push(s);

        }else{
            console.log(`already play this url: ${url}`)
        }

    }

    stop(){
        for(var i=0; i<this.streams.length; i++){
            this.streams[i].destroy();
        }
        this.streams = [];
        this.currenUrl = "";

    }
}

module.exports = Youtube;



