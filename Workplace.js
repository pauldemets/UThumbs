import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Image, Dimensions, BackHandler} from 'react-native';
import { connect } from 'react-redux'

const dimensions = Dimensions.get('window');
const imageHeight = Math.round(dimensions.width * 9 / 40);
const imageWidth = dimensions.width - 20;


class Workplace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            destination: {
                latitude: 0,
                longitude: 0,
                nom: null
            }
        };
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
      }
    
      componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
      }
    
      handleBackPress = () => {
        this.props.navigation.push('Home');
        return true;
      };
    



    render() {
        return (
            <View style={styles.container}>
                <View >
                    <Text style={styles.title}>Je veux aller au campus ...</Text>
                </View>

                <View style={styles.touchableSyle}>
                        <TouchableOpacity onPress={() => { this.redirect(); this.setDestination('GRADIGNAN') }}>
                            <Image style={styles.image}
                                source={require('./public/imgs/gradignan.png')} />
                        </TouchableOpacity>
                    </View>

                <View style={styles.imagesContainer}>
                    <View style={styles.touchableSyle}>
                        <TouchableOpacity onPress={() => { this.redirect(); this.setDestination('TALENCE') }}>
                            <Image style={styles.image}
                                source={require('./public/imgs/talence.png')} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.touchableSyle}>
                        <TouchableOpacity onPress={() => { this.redirect(); this.setDestination('MONTAIGNE') }}>
                            <Image style={styles.image}
                                source={require('./public/imgs/montaigne.png')} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.touchableSyle}>
                        <TouchableOpacity onPress={() => { this.redirect(); this.setDestination('CARREIRE') }}>
                            <Image style={styles.image}
                                source={require('./public/imgs/carreire.png')} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.touchableSyle}>
                        <TouchableOpacity onPress={() => { this.redirect(); this.setDestination('VICTOIRE') }}>
                            <Image style={styles.image}
                                source={require('./public/imgs/victoire.png')} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.touchableSyle}>
                        <TouchableOpacity onPress={() => { this.redirect(); this.setDestination('BASTIDE') }}>
                            <Image style={styles.image}
                                source={require('./public/imgs/bastide.png')} />
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        )
    }
    setDestination(nomDestination) {
        const action = {
            type: nomDestination,
            value: this.state.destination
        }
        this.props.dispatch(action)
    }
    redirect() {
        if (this.props.userStatus == "pedestrian") {
            this.props.navigation.navigate('Waiting');
        } else {
            this.props.navigation.navigate('Map');
        }
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    button: {
        marginTop: '200'
    },
    image: {
        width: imageWidth,
        height: imageHeight,
        borderRadius: 10,
    },
    title: {
        fontSize: 30,
        textAlign: "center",
        margin: 5,
        color: 'black',
        fontWeight: 'bold',
        marginBottom: '6%',
        marginTop: '10%',
    },
    imagesContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    touchableSyle: {
        marginBottom: 20
    }
});

const mapStateToProps = (state) => {
    return {
        destination: state.destination,
        userStatus: state.userStatus.userStatus
    };
}

export default connect(mapStateToProps)(Workplace);
