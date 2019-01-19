import { createAppContainer, createDrawerNavigator } from 'react-navigation';

import World from './World';
import Login from './Login';

const DrawerNavigator = createDrawerNavigator({
  World: {
    screen: World,
  },
  'Login/Sign Up': {
    screen: Login,
  },
});

export default createAppContainer(DrawerNavigator);
