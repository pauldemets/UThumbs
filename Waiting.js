import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Image, ActivityIndicator, AppRegistry, BackHandler, Alert, AppState } from 'react-native';
import AnimatedEllipsis from 'react-native-animated-ellipsis';
import Dialog, { SlideAnimation, DialogContent, DialogFooter, DialogButton, PopupDialog } from 'react-native-popup-dialog';
import { connect } from 'react-redux';


import * as Font from 'expo-font';



class Waiting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false,
      fontLoaded: false,
      isDriverAvailable: false,
      latitude: 0,
      longitude: 0,
      interval: null,
      titleText: 'En attente d\'un conducteur à destination de ',
      driverName: null,
      waitingTimeText: null
    };
  }

  UNSAFE_componentWillMount() {
    this.setState({ interval: setInterval(() => this.searchDriver(), 5000) });
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    this.onButtonQuitClick();
    return true;
  };

  searchDriver() {
    fetch('http://185.212.225.143/api/waiting_users/getbyname/' + this.props.username)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson != null) {
          if (responseJson.length > 0) {
            if (responseJson[0].accept_driver && (responseJson[0].accept_walker == null)) {
              this.driverName = responseJson[0].driver_name;
              this.setState({ isDriverAvailable: true });
              clearInterval(this.state.interval);
            }
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async componentDidMount() {
    await Font.loadAsync({
      'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
      'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
    });

    this.setState({ fontLoaded: true });

    this.findCoordinates();
  }



  findCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({ latitude: position.coords.latitude, longitude: position.coords.longitude }, function () {
          fetch('http://185.212.225.143/api/waiting_user', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: this.props.username,
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              destination: this.props.destination.nom
            }),
          });
        });
      },
      error => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  deleteUser() {
    fetch('http://185.212.225.143/api/waiting_user/name/' + this.props.username, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({

      }),
    });
  }

  render() {
    return (
      <View style={styles.container}>

        {
          this.state.fontLoaded ? (
            <View style={styles.titleContainer}>
              <Text style={styles.title}> {this.state.titleText}{this.props.destination.nom}
                {"\n"}
                {"\n"}
                {this.state.waitingTimeText}
              </Text>
              <AnimatedEllipsis numberOfDots={4}
                animationDelay={150}
                style={{
                  color: 'black',
                  fontSize: 20,
                  fontWeight: 'bold',
                }}
              />
            </View>
          ) : null
        }

        <Image style={styles.image}
          source={require('./public/imgs/waitingImage.png')} />

        {
          this.state.fontLoaded ? (
            <View style={styles.touchableCancelButton}>
              <TouchableOpacity onPress={() => { this.onButtonQuitClick() }}>
                <Text
                  style={styles.buttonCancel}>Annuler</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }

        <Dialog
          style={styles.popUp}
          visible={this.state.dialogOpen}
          onTouchOutside={() => {
            this.setState({ dialogOpen: false });
          }}
          footer={
            <DialogFooter>
              <DialogButton
                text="Annuler"
                onPress={() => { this.setState({ dialogOpen: false }) }}
              />
              <DialogButton
                text="OK"
                onPress={() => {
                  this.setState({ dialogOpen: false });
                  this.deleteUser();
                  clearInterval(this.state.interval);
                  this.props.navigation.push('Home');
                }}
              />
            </DialogFooter>
          }
        >
          <DialogContent>
            <Text style={styles.dialogContent}>Voulez-vous vraiment arrêter la recherche ?</Text>
          </DialogContent>
        </Dialog>


        <Dialog
          style={styles.popUp}
          visible={this.state.isDriverAvailable}
          footer={
            <DialogFooter>
              <DialogButton
                text="Non"
                onPress={() => {
                  this.setState({ isDriverAvailable: false });
                  this.deleteUser();
                  this.props.navigation.push('Home');
                }}
              />
              <DialogButton
                text="Oui"
                onPress={() => {
                  this.setState({ isDriverAvailable: false });
                  this.setState({ titleText: 'Le conducteur est en route pour vous prendre en charge en direction de : ' });
                  this.setState({ waitingTimeText: 'Temps d\'attente estimé : X minutes.' });                  //requete update a mettre a true
                  fetch('http://185.212.225.143/api/waiting_user/edit/' + this.props.username, {
                    method: 'PUT',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      accept_walker: true,
                      accept_driver: true,
                      driver_name: this.driverName
                    }),
                  });
                }}
              />
            </DialogFooter>
          }
        >
          <DialogContent>
            <Text style={styles.dialogContent}>{this.driverName} est prêt à venir vous chercher ! Accepter ? (refuser vous fera arrêter la recherche)</Text>
          </DialogContent>
        </Dialog>

      </View >
    )
  }
  onButtonQuitClick() {
    this.setState({ dialogOpen: true });
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: "center",
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  title: {
    color: "black",
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    margin: 10,
  },
  waitingTextStyle: {
    color: "black",
    fontSize: 15,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    margin: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: '15%',
    justifyContent: 'center'
  },
  dialogContent: {
    marginTop: 20,
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',
  },
  popUp: {
    width: 150,
    height: 400,
  },
  buttonCancel: {
    fontFamily: 'Montserrat-Bold',
    borderRadius: 10,
    fontSize: 19,
    padding: '5%',
    color: 'white'
  },
  touchableCancelButton: {
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    bottom: '4%',
    backgroundColor: '#a64253',
    paddingLeft: '4%',
    paddingRight: '4%',
  },
  image: {
    width: '100%',
    height: '40%',
  }
});

const mapStateToProps = (state) => {
  return {
    destination: state.destination.destination,
    username: state.username.username
  };
}
export default connect(mapStateToProps)(Waiting);
