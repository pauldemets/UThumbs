import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Image, BackHandler, BackAndroid } from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux'
import Dialog, { DialogContent, DialogFooter, DialogButton } from 'react-native-popup-dialog';


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userIsDriver: null,
      dialogOpen: false,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    this.onQuitPage();
    return true;
  };

  onQuitPage() {
    this.setState({ dialogOpen: true });
  }


  render() {
    return (
      <View style={styles.container}>

        <Image style={styles.logoStyle}
          source={require('./public/imgs/logoFullWhite.png')} />
        <Text style={styles.welcomeText}>Bienvenue {this.props.username}  !</Text>
        <View style={styles.buttonsContainer}>
          <View style={styles.buttonContainer}>
            <Text style={styles.titleStyle}>Vous avez un imprévu ? </Text>
            <TouchableOpacity style={styles.touchableStyle} onPress={() => {
              BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
              this.props.navigation.navigate('Workplace');
              this.setUserStatus("PEDESTRIAN");
            }}>
              <Text style={styles.buttonStyle}>JE SUIS PIETON</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <Text style={styles.titleStyle}>Vous souhaitez aider ? </Text>
            <TouchableOpacity style={styles.touchableStyle} onPress={() => {
              BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
              this.props.navigation.navigate('Workplace');
              this.setUserStatus('DRIVER');
            }}>
              <Text style={styles.buttonStyle}>JE SUIS CONDUCTEUR</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Image style={styles.bottomImage}
          source={require('./public/imgs/homeImage.png')} />

        < Dialog
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
                  this.setState({ dialogOpen: false })
                  BackHandler.exitApp()
                }}
              />
            </DialogFooter>
          }
        >
          <DialogContent>
            <Text style={styles.dialogContent}>Quitter l'application ?</Text>
          </DialogContent>
        </Dialog>
      </View>
    )
  }
  setUserStatus(userStatus) {
    const action = {
      type: userStatus,
      value: this.state.userIsDriver
    }
    this.props.dispatch(action)
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a64253',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  buttonStyle: {
    backgroundColor: 'white',
    borderRadius: 100,
    padding: 15,
    color: "#a64253",
    textAlign: 'center',
    fontWeight: "bold",
    fontSize: 16,
    marginTop: '5%',
    width: 250
  },
  titleStyle: {
    color: "white",
    fontSize: 18
  },
  buttonsContainer: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    marginTop: '20%',
  },
  logoStyle: {
    width: 250,
    height: 60,
  //  marginBottom: '1%',
    marginTop: '17%'
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: '15%'
  },
  bottomImage: {
    width: '100%',
    height: '30%',
  },
  dialogContent: {
    marginTop: 20,
    fontSize: 17,
    textAlign: 'center',
  },
  welcomeText: {
    color: 'white',
    fontSize: 18,
    marginBottom:'5%'
  }
});


const mapStateToProps = (state) => {
  return {
    userIsDriver: state.userIsDriver,
    username: state.username.username
  };
}
export default connect(mapStateToProps)(Home);
