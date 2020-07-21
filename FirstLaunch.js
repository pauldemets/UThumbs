import { ViewPagerAndroid, View, Text, AsyncStorage } from 'react-native';
import React, { Component } from 'react';


export default class firstLaunch extends React.Component {
    constructor(props) {
        super(props);
        this.state = { firstLaunch: null };
    }
    componentDidMount() {
        AsyncStorage.getItem("alreadyLaunched").then(value => {
            if (value == null) {
                AsyncStorage.setItem('alreadyLaunched', 'true');
                
                this.setState({ firstLaunch: 'true' });
            }
            else {
                this.setState({ firstLaunch: 'false' });
            }
        }) 
    }
    render() {
        if (this.state.firstLaunch === null) {
            return null; 
        } else if (this.state.firstLaunch == 'true') {
            return this.props.navigation.navigate('Swiper');
        } else {
            return this.props.navigation.navigate('Connection');
        }
    }
}