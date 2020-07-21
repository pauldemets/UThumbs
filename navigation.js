import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Home from './Home';
import myMap from './Map';
import Workplace from './Workplace';
import Waiting from './Waiting';
import Swiper from './SwiperPage';
import Connection from './Connection';
import FirstLaunch from './FirstLaunch';

const MyStackNavigator = createStackNavigator({
  FirstLaunch: {
    screen: FirstLaunch
  },
  Swiper: {
    screen: Swiper
  },
  Home: {
    screen: Home
  },
  Map: {
    screen: myMap
  },
  Workplace: {
    screen: Workplace
  },
  Waiting: {
    screen: Waiting
  },
  Connection: {
    screen: Connection
  },
},
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
  })


export default createAppContainer(MyStackNavigator)