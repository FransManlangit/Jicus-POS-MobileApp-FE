// import { Platform } from 'react-native'
    
// let baseURL = '';

// {Platform.OS == 'android'
// ? baseURL = 'http://192.168.100.206:4000/api/v1/'
// : baseURL = 'http://localhost:4000/api/v1/'
// }

// export default baseURL;





import { Platform } from 'react-native'
    
let baseURL = '';

{Platform.OS == 'android'
? baseURL = 'https://jicus-pos-mobileapp-be.onrender.com/api/v1/'
: baseURL = 'https://jicus-pos-mobileapp-be.onrender.com/api/v1/'
}

export default baseURL;