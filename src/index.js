import chokidar from 'chokidar'
import browserSync from 'browser-sync'
import {normalize, resolve} from 'path'

export default function(){
    let sync, scripts, roots, version

    roots = ['./views']
    sync = browserSync.create()
    version = require('browser-sync/package').version

    sync.init({
        ui: false,
        logSnippet : false
    })

    roots = roots.map((root) => {
        return normalize(resolve(root))
    })

    scripts = [
        '<script type="text/javascript" id="__bs_script__">',
        'document.write("<script async src=\'http://HOST:3000/browser-sync/browser-sync-client.' + version + '.js\'><\\/script>".replace("HOST", location.hostname));',
        '</script>',
        '</body>'
    ].join('')
    
    chokidar.watch(roots, {
        ignored: /[\/\\]\./
    }).on('all', (event, path) => {
        if(event === 'change'){
            sync.reload()
        }
    })

    return function *(next){
        yield next

        if(~this.type.indexOf('html') && this.body){
            this.body = ('' + this.body).replace('</body>', scripts)
        }
    }
}
