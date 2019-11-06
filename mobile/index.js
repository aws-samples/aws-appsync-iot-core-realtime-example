import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import Amplify from 'aws-amplify'
import config from './src/aws-exports'

Amplify.configure(config)

console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => App);
