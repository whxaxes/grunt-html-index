/*
 * grunt-html-index
 * https://github.com/whxaxes/grunt-html-index
 *
 * Copyright (c) 2015 wanghx
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {
    'use strict';

    grunt.registerMultiTask('htmlindex', '', function () {
        var config = grunt.config.get('htmlindex')[this.nameArgs.split(":")[1]];

        var dex = __filename.split("\\");
        var htmlStr = grunt.file.read(dex.slice(0 , dex.length-2).join("/")+"/index.html");

        var hidest = config.dest;
        hidest = grunt.file.isDir(hidest) ? (hidest + (hidest.charAt(hidest.length - 1) === "/"?"":"/")) : "./";

        var html = '<body><div class="main">';
        var ha = hidest.split("/");

        this.files.forEach(function(file){
            for (var i = 0; i < file.src.length; i++) {
                var filePath = file.src[i];
                var fileName = filePath.split("/")[filePath.split("/").length - 1];

                //检查路径和文件合法性，同时忽略带下划线前缀文件
                if (!grunt.file.exists(filePath) || !grunt.file.isFile(filePath) || !fileName.match(/(.html/g) || fileName.match(/^_+/g) || fileName.match(/html-index/g)) continue;

                var str = grunt.file.read(filePath);

                var title = str.match(/<title>.*<\/title>/g);
                title = ((title && title[0]) || "<title></title>").replace(/<title>|<\/title>/g , '');

                //获取html-index.html所在目录 与 该文件的相对路径
                var fa = filePath.split("/");
                var nfa = [];
                //console.log(ha);console.log(fa);
                for(var i= 0,j=0;i<ha.length;i++){
                    if(ha[i] ===".")continue;

                    if(ha[i]){
                        if(!fa[i] || (ha[i] !== fa[i])){
                            nfa.push('..');
                        }else {
                            j++;
                        }
                    }else break;
                }
                nfa = nfa.concat(fa.slice(j , fa.length));
                //console.log(nfa.join("/"));
                html += '<a href="' + nfa.join("/") + '" target="_blank">' + title + '</a>';
            }
        });
        html += '</div></body>';

        grunt.file.write(hidest+"html-index.html" , htmlStr.replace(/<body>[\S\s]*?<\/body>/ , html))
    });
};
