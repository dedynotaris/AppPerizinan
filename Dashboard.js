import React, { Component } from 'react';
import {StyleSheet,AsyncStorage,Keyboard,Alert} from 'react-native';
import { Container, Header, Content, Footer, FooterTab, Button, Text,Icon,Right, Col,Grid } from 'native-base';
import tabMasuk from './tab/tabMasuk';
import tabProses from './tab/tabProses';
import tabSelesai from './tab/tabSelesai';
import ScanCamera from './tab/ScanCamera';
import Sidebar  from './Sidebar'; 
import {createAppContainer,StackActions,NavigationActions,NavigationEvents } from 'react-navigation';
import {createStackNavigator } from 'react-navigation-stack';
import FetchingIndicator from 'react-native-fetching-indicator';
import style_custom from './stye_custom'
import stye_custom from './stye_custom';

class PageDashboard extends React.Component {
  constructor(props){
    super(props)
    this.state={
      isFetching      :false,
      nama_lengkap    :'',
      no_user         :'',
      jumlah_masuk    :'',
      jumlah_proses   :'',
      jumlah_selesai  : '',
      isFetching      :false

    }
  }


 componentDidMount = () =>{
  this.setState( {isFetching:true});
   
    async function ambil_data(no_user) {
    const a = await  AsyncStorage.getItem(no_user).then((value) =>{ return value });     
    return a  
    }

  
    ambil_data('no_user').then((no_user)=>{
      fetch('http://192.168.0.109/-notaris/DashboardPerizinanMobile',{
        method:'POST',
        headers:{
          Accept :'application/json',
          'Content-Type':'application/json',
          'api_notaris'   : '9cd7fd2a70471602c11ec4e39112cd4c',
           },
        body:JSON.stringify({
         no_user : no_user,
         status  :'DataJumlah'
        })
     
      }).then((Response)=>Response.json())
        .then((responseJson)=>{
          console.log(responseJson);
          this.setState({jumlah_masuk :responseJson.jumlah_masuk });
          this.setState({jumlah_proses :responseJson.jumlah_proses });
          this.setState({jumlah_selesai :responseJson.jumlah_selesai });
        this.setState({isFetching:false});
        }
      ) .catch((error)=>{
     console.error(error);
     this.setState( {isFetching:false});
     });
    });
} 

  render() {
    return (
      <Container>
        <Header androidStatusBarColor="#000"  style={style_custom.bg_header}>
          <Text style={style_custom.text_color}> App Document Perizinan </Text>
            <Right><Button
              transparent
              onPress={() => this.props.navigation.navigate("Sidebar")}
              t6>
              <Icon name="menu" />
            </Button>
           </Right>   
          </Header>    
        <Content>
       <Grid>
        <Col onPress={() => this.props.navigation.navigate('tabMasuk')}  style ={style_custom.bg_data}><Text style={style_custom.text_data}>Jumlah  masuk</Text>
        <Grid style ={style_custom.bg_header}>
            <Col>
            <Text style= {{fontSize:30,color:"#fff",textAlign:"center"}}>{this.state.jumlah_masuk}</Text>
           </Col>
         </Grid>
         </Col>
       
         <Col onPress={() => this.props.navigation.navigate('tabProses')} style ={style_custom.bg_data}><Text  style={style_custom.text_data}>Jumlah Proses</Text>
         <Grid style ={style_custom.bg_header}>
            <Col>
            <Text style= {{fontSize:30,color:"#fff",textAlign:"center"}}>{this.state.jumlah_proses}</Text>
           </Col>
         </Grid>
         </Col>

         <Col onPress={() => this.props.navigation.navigate('tabSelesai')} style ={style_custom.bg_data}><Text  style={style_custom.text_data}>Jumlah  Selesai</Text>
         <Grid style ={style_custom.bg_header}>
            <Col>
            <Text style= {{fontSize:30,color:"#fff",textAlign:"center"}}>{this.state.jumlah_selesai}</Text>
           </Col>
         </Grid>
         </Col>
        
       </Grid>
        </Content>

        <Footer >
          <FooterTab style={style_custom.bg_header}>
          <Button vertical onPress={() => this.props.navigation.navigate("ScanCamera")}>
              <Icon style = { stye_custom.text_color} name="camera" />
              <Text style = { stye_custom.text_color} >Scanner</Text>
            </Button>
            
            <Button  vertical onPress={() => this.props.navigation.navigate('tabMasuk')} >
              <Icon style = { stye_custom.text_color} name="document" />
              <Text style = { stye_custom.text_color}>Masuk</Text>
            </Button>
            
            <Button vertical onPress={() => this.props.navigation.navigate('tabProses')}  >
              <Icon style = { stye_custom.text_color} name="sync" />
              <Text style = { stye_custom.text_color}>Proses</Text>
            </Button>
            
            <Button vertical onPress={() => this.props.navigation.navigate('tabSelesai')} >
              <Icon style = { stye_custom.text_color} name="done-all" />
              <Text style = { stye_custom.text_color}>Selesai</Text>
            </Button>
          </FooterTab>
        </Footer>
        <FetchingIndicator isFetching={this.state.isFetching} />
      </Container>
    );
  }
}

const stackConfig = {
  PageDashboard : {
    screen:PageDashboard,
    navigationOptions:{
      header:null
    }
  },
  Sidebar : {
    screen:Sidebar,
    navigationOptions:{
      header:null
    }
  },ScanCamera : {
    screen:ScanCamera,
    navigationOptions:{
      header:null
    }
  },
  tabMasuk : {
    screen:tabMasuk,
    navigationOptions:{
      
    }
  },
  tabProses : {
    screen:tabProses,
    navigationOptions:{
      header:null,
    }
  },
  tabSelesai : {
    screen:tabSelesai,
    navigationOptions:{
      
    }
  }            
   
 }
 
 const AppNavigator  = createStackNavigator(stackConfig,{
   initialRouteName: 'PageDashboard',
 });
 const AppContainer = createAppContainer(AppNavigator);
 
 export default AppContainer;
