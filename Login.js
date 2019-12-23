import React, { Component } from 'react';
import {Dimensions,StyleSheet,Image,Keyboard,AsyncStorage } from 'react-native';
import {Text,Container,Button,Toast,Icon, Header, Content, Form, Item, Input ,Label, View} from 'native-base';
import {Col, Row, Grid } from 'react-native-easy-grid';
import {createAppContainer,StackActions,NavigationActions } from 'react-navigation';
import {createStackNavigator } from 'react-navigation-stack';
import FetchingIndicator from 'react-native-fetching-indicator';
import Dashboard from './Dashboard';
import style_custom from './stye_custom';
import RNFetchBlob from 'react-native-fetch-blob';




class PageLogin extends React.Component {
  
  constructor(props){
    super(props)
    this.state={
      username:'',
      password:'',
      isFetching:false,
      no_user :'',
      nama_lengkap : ''
    }
  }

  componentDidMount = () =>{
    
    RNFetchBlob.fs.exists(`${RNFetchBlob.fs.dirs.DCIMDir}/AppPerizinan`).then((exists) =>{ 
      if(exists == false ){
      RNFetchBlob.fs.mkdir(`${RNFetchBlob.fs.dirs.DCIMDir}/AppPerizinan`)
      }
      }).catch(()=>{
    });
     

    async function cek_login(no_user) {
      const a = await  AsyncStorage.getItem(no_user).then((value) =>{ return value });     
      return a
      }
  cek_login('no_user').then((value) =>{
   if(value != null){
    this.props.navigation.dispatch(resetAction);  
   } 
  }); 
  }


  login = () =>{
    const{username,password} = this.state;
    this.setState( {isFetching:true});
    
   fetch('http://192.168.0.109/-notaris/LoginPerizinanMobile',{
     method:'POST',
     headers:{
       Accept :'application/json',
       'Content-Type':'application/json',
       'api_notaris' : '9cd7fd2a70471602c11ec4e39112cd4c',
        },
     body:JSON.stringify({
       usernamed     : username,
       passwordd     : password,
     
     })
  
   }).then((Response)=>Response.json())
     .then((responseJson)=>{
      if(responseJson.status == 'Success'){
        AsyncStorage.setItem('no_user',responseJson.no_user);
        AsyncStorage.setItem('nama_lengkap',responseJson.nama_lengkap);
        AsyncStorage.setItem('email',responseJson.email);
        this.setState({'no_user':responseJson.no_user});
        this.props.navigation.dispatch(resetAction);
      }else{
        alert(responseJson);
     this.setState( {isFetching:false});
      }
      
     console.log(responseJson);
     }
   ) .catch((error)=>{
  console.error(error);
  this.setState( {isFetching:false});
  }); 
  
    Keyboard.dismiss();
    }
  

     
  
  render() {
    
    return (
      <Container androidStatusBarColor="#add8e6">
         <Grid >
          <Col style={{ justifyContent:"center",alignItems:"center"}}>
            <Content >
            <Image style={style_custom.bg_login}   source={require('./img/bg_login.png')}></Image>
              <Text style ={style_custom.Txt_theme}>Masuk APP Perizinan</Text>
          </Content>
         </Col>
        </Grid>
        <Grid>
          <Col style={{margin:12}}>
            <Item rounded>
             <Input  placeholder="Username . . ."
             onChangeText={username=>this.setState({username})}/>
            </Item>
            
            <Item style={{marginTop:12}} rounded>
             <Input secureTextEntry={true} placeholder="Password . . ."
             onChangeText={password=>this.setState({password})} />
            </Item>
          
            <Button onPress={this.login}  style={style_custom.btn_login} block rounded>
            <Text> Masuk </Text>
            </Button>
            
            
          </Col>
          </Grid>
          <FetchingIndicator isFetching={this.state.isFetching} />
      </Container>
      );
  }

  
}
const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'Dashboard' })],
});

const stackConfig = {
 PageLogin : {
   screen:PageLogin,
   navigationOptions:{
     header:null,
     
   }
 },Dashboard : {
  screen:Dashboard,
  navigationOptions:{
    header:null
  }
}  
}

const AppNavigator  = createStackNavigator(stackConfig,{
  initialRouteName: 'PageLogin',
});

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;