import koa from 'koa'
import fs from 'co-fs'
import {join} from 'path'
import request from 'supertest'
import browserSync from '../dist'

describe('browserSync', () => {
    it('text/html', (done) => {
        var app = koa()

        app.use(browserSync())
        app.use(function *(next){
            this.type = 'html'
            this.body = yield fs.createReadStream(join(process.cwd(), './test/views/index.html'))
        })

        request(app.listen())
            .get('/')
            .expect(function(res){
                res.text.should.containEql('browser-sync')
            })
            .end(done)
    })

    it('text/plain', (done) => {
        var app = koa()

        app.use(browserSync())
        app.use(function *(next){
            this.type = 'text'
            this.body = yield fs.createReadStream(join(process.cwd(), './test/views/index.html'))
        })

        request(app.listen())
            .get('/')
            .expect(function(res){
                res.text.should.not.containEql('browser-sync')
            })
            .end(done)
    })
})
