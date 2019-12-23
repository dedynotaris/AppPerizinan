import React, { Component } from 'react';
import {Dimensions,StyleSheet,Image,Keyboard,AsyncStorage } from 'react-native';
import {createAppContainer,StackActions,NavigationActions } from 'react-navigation';
import {createStackNavigator } from 'react-navigation-stack';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Right, Body,List,ListItem, Text } from 'native-base';
import PageLogin from './Login';

class Pagesidebar extends React.Component {
  logout = () => {
    AsyncStorage.clear();
    this.props.navigation.dispatch(resetAction); 
  }
    render() {
    return (
      <Container>
        
        <Content>
          <List>
            <ListItem>
              <Text>Profile</Text>
            </ListItem>
            <ListItem>
              <Text>Reset Password</Text>
            </ListItem>
          </List>
        </Content>
        <Footer>
          <FooterTab>
            <Button onPress={this.logout } full danger>
              <Text>Keluar</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }

  
}


const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'PageLogin' })],
});

const stackConfig = {
 Pagesidebar : {
   screen:Pagesidebar,
   navigationOptions:{
     header:null
   }
 }
}

const AppNavigator  = createStackNavigator(stackConfig,{
  initialRouteName: 'Pagesidebar',
});

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;