import React, { Component } from 'react';
import MapView, { PROVIDER_GOOGLE, AnimatedRegion, Marker } from 'react-native-maps';
import { AppRegistry, View, StyleSheet, Dimensions, TouchableOpacity, Text, BackHandler } from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import { connect } from 'react-redux'
import PubNubReact from "pubnub-react";
import AnimatedEllipsis from 'react-native-animated-ellipsis';
import * as Font from 'expo-font';
import * as Location from 'expo-location';
import Dialog, { SlideAnimation, DialogContent, DialogFooter, DialogButton, PopupDialog } from 'react-native-popup-dialog';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA_HAUT = 0.015;
const LATITUDE_DELTA_BAS = 0.007;
const LONGITUDE_DELTA_HAUT = LATITUDE_DELTA_HAUT * ASPECT_RATIO;
const LONGITUDE_DELTA_BAS = LATITUDE_DELTA_BAS * ASPECT_RATIO;

const SPACE = 0.01;
const GOOGLE_MAPS_APIKEY = 'AIzaSyB2sGMhio_-YehtPloM5a2qjFnojLzil2k';

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: LATITUDE_DELTA_HAUT,
      longitudeDelta: LONGITUDE_DELTA_HAUT,
      coordinate: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: 0,
        longitudeDelta: 0
      }),
      markers: [],
      actualDestination: this.props.destination,
      fontLoaded: false,
      courseStarted: false,
      ready: false,
      intervalId: null,
      intervalIdWalker: null,
      pedestrian: null,
      dialogOpen: false,
      dialogWalkerFound: false,
      waitingAnswer: false,
      dialogCatch: false
    };

    this.pubnub = new PubNubReact({
      publishKey: "pub-c-4e1007f6-a370-4538-8465-630ea4cc6ab6",
      subscribeKey: "sub-c-b6c24fd6-4ce6-11ea-80a4-42690e175160"
    });
    this.pubnub.init(this);
  }

  async componentDidMount() {
    await Location.requestPermissionsAsync();

    await Font.loadAsync({
      'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
      'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
    });
    this.setState({ fontLoaded: true });

    this.watchLocation();
  }

  UNSAFE_componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  checkLatitude = () => {
    if (!this.state.courseStarted) {
      this.setState({ latitudeDelta: LATITUDE_DELTA_BAS, longitudeDelta: LONGITUDE_DELTA_BAS })
    } else {
      this.setState({ latitudeDelta: LATITUDE_DELTA_HAUT, longitudeDelta: LONGITUDE_DELTA_HAUT })
    }
  }

  watchLocation = () => {
    const { coordinate } = this.state;

    this.watchID = navigator.geolocation.watchPosition(
      position => {
        const { latitude, longitude } = position.coords;

        const newCoordinate = {
          latitude,
          longitude,
        };
        if (this.marker) {
          coordinate.timing(newCoordinate).start();
        }
        this.setState({
          latitude,
          longitude,
        });

      },
      error => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
        distanceFilter: 1,
      }
    );
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.latitude !== prevState.latitude) {
      this.pubnub.publish({
        message: {
          latitude: this.state.latitude,
          longitude: this.state.longitude,
        },
        channel: 'location',
      });
    }
  }

  UNSAFE_componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    this.onButtonQuitClick();
    return true;
  };

  focusLoc = () => {
    if (this.state.ready) {
      if (this.state.courseStarted) {
        let region = {
          latitude: this.state.latitude,
          longitude: this.state.longitude,
          latitudeDelta: this.state.latitudeDelta,
          longitudeDelta: this.state.longitudeDelta
        };

        this.map.animateToRegion(region, 1000);
      }
    }
  }

  acceptDriver() {
    //requete update a mettre a true
    fetch('http://185.212.225.143/api/waiting_user/edit/' + this.state.pedestrian.name, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accept_walker: null,
        accept_driver: true,
        driver_name: this.props.username
      }),
    });
  }

  searchingPedestrians() {
    return fetch('http://185.212.225.143/api/waiting_users/getuserinradius/radius?latitude=' + this.state.latitude + '&longitude=' + this.state.longitude + '&radius=1&limit=5&destination=' + this.props.destination.nom)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.length) {
          
          for (let pedestrian of responseJson) {
            if (pedestrian.accept_driver == false ) {
              

              this.setState({
                pedestrian: pedestrian,
                dialogWalkerFound: true
              });
            }
          }
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  searchPedestrian() {
    fetch('http://185.212.225.143/api/waiting_users/getbyname/' + this.state.pedestrian.name)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.length) {
          if (responseJson[0].accept_walker) {
            this.setState({ waitingAnswer: false, actualDestination: { latitude: this.state.pedestrian.latitude, longitude: this.state.pedestrian.longitude }, dialogCatch: true });
            this.clearIntervals();
          } else if (responseJson[0].accept_walker == false) {
            this.clearIntervals();
            this.setState({ waitingAnswer: false, intervalId: setInterval(this.searchingPedestrians.bind(this)) });
          }
        } else {
          this.clearIntervals();
          this.setState({ waitingAnswer: false, intervalId: setInterval(this.searchingPedestrians.bind(this)) });
        }

      })
      .catch((error) => {
        console.error(error);
      });
  }

  onMapReady = (e) => {
    if (!this.state.ready) {
      this.setState({ ready: true });
    }
  }

  clearIntervals = () => {
    this.setState({ waitingAnswer: false });
    clearInterval(this.state.intervalId);
    clearInterval(this.state.intervalIdWalker);
  }

  render() {
    return (
      <View style={styles.container}>

        <MapView
          ref={ref => (this.map = ref)}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          onMapReady={this.onMapReady}
          region={{ latitude: this.state.latitude, longitude: this.state.longitude, latitudeDelta: this.state.latitudeDelta, longitudeDelta: this.state.longitudeDelta }}
          followsUserLocation={true}
          onRegionChangeComplete={this.focusLoc}>
          <MapView.Marker
            coordinate={
              this.state.actualDestination
            }
            title={"title"}
            description={"description"}
          />
          <Marker.Animated
            ref={marker => {
              this.marker = marker;
            }}
            coordinate={this.state.coordinate}
          />
          <MapViewDirections
            origin={{ latitude: this.state.latitude, longitude: this.state.longitude }}
            destination={this.state.actualDestination}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={5}
            strokeColor="#a64253"
          />
        </MapView>
        {
          this.state.waitingAnswer ? (
            <View style={styles.textWaiting}>
              {
                this.state.fontLoaded ? (
                  <Text style={{ fontSize: 21, fontFamily: 'Montserrat-Bold' }}>En attente d'une réponse de {this.state.pedestrian.name}
                  </Text>
                ) : null
              }
              <AnimatedEllipsis numberOfDots={3}
                animationDelay={150}
                style={{
                  color: 'black',
                  fontSize: 20,
                  fontWeight: 'bold'
                }}
              />
            </View>
          ) : null
        }
        {
          this.state.dialogCatch ? 
          (
        <View style={styles.buttonCatch}>
          {
            this.state.fontLoaded ? (
              <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 21, paddingBottom: "5%", paddingTop: "5%" }}> { this.state.pedestrian != null ? ( "Avez-vous récupéré " + this.state.pedestrian.name + " ?" ) : null}</Text>
            ) : null
          }
          <TouchableOpacity style={{ borderWidth: 1, borderColor: 'black', marginBottom: "5%", borderRadius: 10 }} onPress={() => {this.setState({actualDestination: {latitude: this.props.destination.latitude, longitude: this.props.destination.longitude}, dialogCatch: false})} }>
            {
              this.state.fontLoaded ? (
                <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 21, paddingBottom: "2%", paddingTop: "2%", paddingRight: "7%", paddingLeft: "7%" }}>Oui</Text>
              ) : null
            }
          </TouchableOpacity>

        </View>
          ): null 
        }
        <View style={styles.buttonArea}>
          {
            this.state.fontLoaded ? (
              <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => { this.checkLatitude(); this.setState({ courseStarted: !this.state.courseStarted }); { this.state.courseStarted ? this.clearIntervals() : this.setState({ intervalId: setInterval(this.searchingPedestrians.bind(this), 5000) }) } }}>
                <Text style={{ fontSize: 21, fontFamily: 'Montserrat-Bold', paddingTop: '7%', paddingBottom: '7%' }}>{this.state.courseStarted ? 'Terminé' : 'Départ'}</Text>
              </TouchableOpacity>
            ) : null
          }
        </View>
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
                  console.log(this.state.intervalId);
                  clearInterval(this.state.intervalId);
                  this.props.navigation.push('Home');
                }}
              />
            </DialogFooter>
          }
        >
          <DialogContent>
            <Text style={styles.dialogContent}>Voulez-vous vraiment quitter la map ?</Text>
          </DialogContent>
        </Dialog>
        <Dialog
          style={styles.popUp}
          visible={this.state.dialogWalkerFound}
          onTouchOutside={() => {
            this.setState({ dialogWalkerFound: false });
          }}
          footer={
            <DialogFooter>
              <DialogButton
                text="Refuser"
                onPress={() => { this.setState({ dialogWalkerFound: false }) }}
              />
              <DialogButton
                text="Accepter"
                onPress={() => {
                  this.acceptDriver();
                  clearInterval(this.state.intervalId);
                  this.setState({ intervalIdWalker: setInterval(this.searchPedestrian.bind(this), 2000), dialogWalkerFound: false, waitingAnswer: true });
                }}
              />
            </DialogFooter>
          }
        >
          <DialogContent>
            {
              this.state.pedestrian != null ? (
                <Text style={styles.dialogContent}>{this.state.pedestrian.name} se trouve dans les environs, acceptes-tu de le dépanner ?</Text>
              ) : null
            }
          </DialogContent>
        </Dialog>
      </View>
    );
  }

  onButtonQuitClick() {
    this.setState({ dialogOpen: true });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonCatch: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: "20%",
    backgroundColor: "#FAFAFA",
    width: 280,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5
  },
  textWaiting: {
    flex: 1,
    alignSelf: 'center',
    position: 'absolute',
    top: "10%"
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
  buttonArea: {
    flex: 1,
    alignSelf: 'center',
    position: 'absolute',
    bottom: "10%",
    backgroundColor: "#FAFAFA",
    width: 280,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5
  }
});

const mapStateToProps = (state) => {
  return {
    destination: state.destination.destination,
    username: state.username.username
  };
}
export default connect(mapStateToProps)(Map);
