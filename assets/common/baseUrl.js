import { Platform } from 'react-native'
    
let baseURL = '';

{Platform.OS == 'android'
? baseURL = 'https://store-be-w6me.onrender.com/api/v1/'
: baseURL = 'https://store-be-w6me.onrender.com/api/v1/'
}

export default baseURL;