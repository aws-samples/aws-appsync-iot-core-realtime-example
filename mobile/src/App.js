import React from 'react';
import { StatusBar } from 'react-native';
import { withAuthenticator } from 'aws-amplify-react-native'

import Navigation from './screens/Navigation'

const App = () => {
  
  StatusBar.setBarStyle('light-content', true);

  return (
    <Navigation />
  );
};

const signUpConfig = {
  header: 'Register for Sensor View',
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

export default withAuthenticator(App, {signUpConfig});
