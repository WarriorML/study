var tool = {
    /**
     * 根据图片url获取图片的base64编码
     * @param {string} url 图片url
     * @param {string} ext 图片的格式（png、jpg等）
     * @param {Function} callback 回调函数，base64通过回调函数获取
     */
    getBase64WithImgUrl: function (url,ext,callback) {
        var canvas = document.createElement("canvas");   //创建canvas DOM元素
        var ctx = canvas.getContext("2d");
        var img = new Image;
        img.crossOrigin = 'Anonymous';
        img.src = url;
        img.onload = function () {
            canvas.height = 60; //指定画板的高度,自定义
            canvas.width = 85; //指定画板的宽度，自定义
            ctx.drawImage(img, 0, 0, 60, 85); //参数可自定义
            var dataURL = canvas.toDataURL("image/" + ext);
            callback.call(this, dataURL); //回掉函数获取Base64编码
            canvas = null;
        };
    },
    /**
     * 判断是否是一个数组
     * @param {any} obj 
     */
    isArray:function(obj){
        if(Array['isArray'] !== undefined){
            return Array.isArray(obj);
        }else{
            if(typeof obj === "object" && obj.constructor === Array){
                return true;
            }else{
                return false;
            }
        }
    },
    parse:function (str) {
        // str假如为某个DOM字符串
        // 1. result为处理之后的DOM节点
        let result = ''
        // 2. 解码
        let decode = he.unescape(str, {
            strict: true
        })
        HTMLParser(decode, {
            start (tag, attrs, unary) {
                // 3. 过滤常见危险的标签
                if (tag === 'script' || tag === 'img' || tag === 'link' || tag === 'style' || tag === 'iframe' || tag === 'frame') return
                result += `<${tag}`
                for (let i = 0; i < attrs.length; i++) {
                    let name = (attrs[i].name).toLowerCase()
                    let value = attrs[i].escaped
                    // 3. 过滤掉危险的style属性和js事件
                    if (name === 'style' || name === 'href' || name === 'src' || ~name.indexOf('on')) continue
                    result += ` ${name}=${value}`
                }
                result += `${unary ? ' /' : ''} >`
            },
            chars (text) {
                result += text
            },
            comment (text) {
                result += `<!-- ${text} -->`
            },
            end (tag) {
                result += `</${tag}>`
            }
        })
        return result
    }
}