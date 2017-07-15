import { Router } from 'express';
import * as gravatar from 'gravatar';

const index: Router = Router();

index.get('/', function(req, res, next) {
    res.render('index', { 
        title: 'Introducing Mr. Whale', 
        gravatar: gravatar.url('mrwhale.bot@outlook.com', { s: '200' }) 
    });
});

export default index;