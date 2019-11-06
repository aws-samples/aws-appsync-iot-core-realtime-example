import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import SensorDetailScreen from './src/screens/SensorDetailScreen';
import { withAuthenticator } from 'aws-amplify-react-native'

// define the navigation of the app - this app has 1 screen
const AppNavigator = createStackNavigator(
  {
    SensorDetailScreen: { screen: SensorDetailScreen }
  },
  {
    initialRouteName: 'SensorDetailScreen',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#2A4B7C',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      }
    },
  }
);

//configure the Signup page to only require email and password
const signUpConfig = {
  hideAllDefaults: true,
  signUpFields: [
    {
      label: 'Email',
      key: 'username',
      required: true,
      placeholder: 'Email',
      type: 'email',
      displayOrder: 1,
    },
    {
      label: 'Password',
      key: 'password',
      required: true,
      placeholder: 'Password',
      type: 'password',
      displayOrder: 2,
    },
  ],
}

//initializing the app with 'withAuthenticator' forces the user to logon via Cognito
export default withAuthenticator(createAppContainer(AppNavigator), false, [], null, null, signUpConfig);
