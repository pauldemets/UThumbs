import { Dimensions, StyleSheet, Text, View, AppRegistry, Image, TouchableOpacity, TextInput } from 'react-native'
import Swiper from 'react-native-page-swiper'
import React, { Component } from 'react';



export default class SwiperPage extends Component {
  constructor(props) {
    super(props);
}
  render() {
    return (
      <Swiper
        activeDotColor="black"
        style={styles.wrapper}>

        <View style={styles.slide1}>
          <Image style={styles.logoStyle}
            source={require('./public/imgs/logoFullWhite.png')} />
          <Image style={styles.image}
            source={require('./public/imgs/pieton.png')} />
          <Text style={styles.text}>Des problèmes de transport ? Un bus manqué ? Des trams bondés ? Tu as besoin d'aide ? {"\n"}{"\n"} Tu peux te faire aider instantanément!</Text>
        </View>

        <View style={styles.slide1}>
          <Image style={styles.logoStyle}
            source={require('./public/imgs/logoFullWhite.png')} />
          <Image style={styles.image}
            source={require('./public/imgs/conducteur.png')} />
          <Text style={styles.text}>Tu souhaites dépanner quelqu'un qui a des problèmes de transport ? {"\n"}{"\n"} Amène des personnes qui sont à la même fac que toi !</Text>
        </View>

        <View style={styles.slide1}>
          <Image style={styles.logoStyle}
            source={require('./public/imgs/logoFullWhite.png')} />
          <Image style={styles.image}
            source={require('./public/imgs/tutoImage2.png')}></Image>
          <Text style={styles.text}>Choisis ta destination afin d'être mis en relation avec les Thumbers autour de toi.</Text>
        </View>

        <View style={styles.slide3}>
          <Image style={styles.logoStyle}
            source={require('./public/imgs/logoFullWhite.png')} />


          <TouchableOpacity onPress={() => { this.props.navigation.navigate('Connection') }} style={styles.buttonConnection}>
            <Text style={styles.textConnection}>Démarer</Text>
          </TouchableOpacity>

        </View>
      </Swiper>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: "column",
  },
  logoStyle: {
    marginTop: '5%',
    width: '80%',
    height: '10%',
  },
  slide1: {
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#a64253',
  },

  slide3: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#a64253',
  },

  text: {
    color: '#fff',
    fontSize: 20,
    //fontWeight: 'bold',
    textAlign: 'center',
    marginTop: '4%',
    width: '90%',
    marginBottom: '40%',

  },

  image: {
    width: '80%',
    height: '37%',
    borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
    backgroundColor: 'white'
  },

  buttonConnection: {
    borderWidth: 2,
    borderColor: 'white',
    padding: '4%',
    borderRadius: 20,
    marginTop: '10%',
    width: '35%',
  },
  textConnection: {
    color: 'white',
    fontSize: 17,
    textAlign: 'center'

  },

  inputStyle: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'white',
    padding: '2%',
    textAlign: 'center',
    borderRadius: 10,
    width: '70%',
    backgroundColor: 'white'
  }

})