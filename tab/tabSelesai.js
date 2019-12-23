import React, { Component } from 'react';
import {Dimensions,StyleSheet,Image,Keyboard,AsyncStorage } from 'react-native';
import { Container, Header,Card,CardItem,Body, Text, Content,Button,Icon } from 'native-base';
import FetchingIndicator from 'react-native-fetching-indicator';
import style_custom from '../stye_custom';
import moment from 'moment';

export default class tabSelesai extends Component {
  constructor(props){
    super(props)
    this.state={
      no_user:'',
      proses :'Masuk',
      isFetching  :false,
      key :'',
      pekerjaan_masuk : 'Data Pekerjaan Masuk',
      data_selesai :'',
      ObjectSelesai:'',
      users : ''
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
         status  :'Selesai'
       })
       
      }).then((Response)=>Response.json())
        .then((responseJson)=>{
          console.log(responseJson);
          this.setState({data_selesai :responseJson });
          this.setState( {isFetching:false});
       }).catch((error)=>{
     console.error(error);
     this.setState( {isFetching:false});
     });
    });
  }
  
  render() {
   var s =  [];
     for(let userObject of this.state.data_selesai){
      if(userObject.status_data == "kosong"){
        s.push(
          <Content style={{flex:1,alignContent:"center"}}>
             <Text style={{justifyContent:"center",textAlign:"center"}}>Belum Ada Pekerjaan selesai Tersedia</Text>
          </Content>
        );
        }else{
         s.push(
          <Card>
            <CardItem  bordered style={style_custom.bg_header2}>
             <Text style={style_custom.text_color2}>{userObject.nama_dokumen }</Text>
          </CardItem>
          <CardItem bordered>
          <Body>
            <Text>Nama Client        : {userObject.nama_client}</Text>
              <Text>Tugas Dari         : {userObject.nama_petugas}</Text>
           </Body>
         </CardItem>
        <CardItem style={{alignContent:"center", justifyContent: 'center',}}>
            <Button  primary block small >
              <Icon active name="cloud-upload" />
                  <Text>upload</Text>
                </Button>
                <Button  style={{ marginLeft :12}} success block small>
                <Icon active name="done-all" />
                  <Text>
                   selesai</Text>
                </Button>
         </CardItem>
       </Card>);
        }
    }
    return (
        <Container>
        <Content padder>

         { s }        
        </Content>
        <FetchingIndicator isFetching={this.state.isFetching} />
     
      </Container>
    );
  }
}