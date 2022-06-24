import app from './app.js';
import './database/conection.js';

app.listen(app.get('port'));

console.log('Listen on ' + app.get('port'));