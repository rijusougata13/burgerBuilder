import axios from 'axios';

const instance=axios.create({
    baseURL:'https://burger-builder-834dd-default-rtdb.firebaseio.com/',
});

export default instance;