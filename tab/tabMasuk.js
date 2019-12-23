import React, { Component } from 'react';
import Dialog , {DialogContent,DialogFooter,SlideAnimation,DialogTitle,DialogButton} from  'react-native-popup-dialog';
import {AsyncStorage,Modal,View,TouchableHighlight,Alert,StyleSheet,Dimensions } from 'react-native';
import FetchingIndicator from 'react-native-fetching-indicator';
import { Container,Card,CardItem,Body,DatePicker, Text, Content,Item,Input,Right,Left,Button,Icon,Form,Textarea } from 'native-base';
import style_custom from '../stye_custom';
import moment from 'moment';
import { ScrollView } from 'react-native-gesture-handler';

export default class tabMasuk extends Component {
  constructor(props){
    super(props)
    this.state={
      no_user:'',
      proses :'Masuk',
      isFetching  :false,
      key :'',
      pekerjaan_masuk : 'Data Pekerjaan Masuk',
      data_masuk :'',
      userObject:'',
      users : '',
      chosenDate: new Date(),
      modalVisible :false,
      titleModal :'',
      alasan_penolakan :null,
      KontenModal :'',
      no_berkas_perizinan : '',
      chosenDate :null,
      modalTolak :false
      
    }
    this.onPress = this.proses.bind(this);
    this.onPress = this.tolak.bind(this);
    this.setDate = this.setDate.bind(this);
  }

  setDate(newDate) {
    const format = moment(newDate).format('YYYY/MM/DD');
    this.setState({ chosenDate: format });
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
         status  :'Masuk'
        })
     
      }).then((Response)=>Response.json())
        .then((responseJson)=>{
          console.log(responseJson);
          this.setState({data_masuk :responseJson });
          this.setState( {isFetching:false});
       }
      ) .catch((error)=>{
     console.error(error);
     this.setState( {isFetching:false});
     });
    });
  }
  

  proses = (no_berkas_perizinan,nama_dokumen)=>{
   this.setState({modalVisible:true});
   this.setState({no_berkas_perizinan : no_berkas_perizinan});
   this.setState({titleModal:"Perkiraan selesai "+nama_dokumen});
   this.setState({chosenDate : null});
  }

  
  tolak = (no_berkas_perizinan,nama_dokumen)=>{
    this.setState({alasan_penolakan :null});
    this.setState({modalTolak:true}); 
    this.setState({no_berkas_perizinan : no_berkas_perizinan});
    this.setState({titleModal:"Tolak Tugas "+nama_dokumen});
  }

  simpan_penolakan(){
    const { alasan_penolakan} = this.state;
 if(alasan_penolakan == null || alasan_penolakan == ''){
  Alert.alert("Anda belum memasukan alasan penolakan");
  }else{
    this.setState( {isFetching:true});
    fetch('http://192.168.0.109/-notaris/DashboardPerizinanMobile',{
      method:'POST',
      headers:{
        Accept :'application/json',
        'Content-Type':'application/json',
        'api_notaris'   : '9cd7fd2a70471602c11ec4e39112cd4c',
         },
      body:JSON.stringify({
       status          : 'SimpanPenolakan',
       no_berkas        : this.state.no_berkas_perizinan,
       alasan_penolakan : this.state.alasan_penolakan 

      })
   
    }).then((Response)=>Response.json())
      .then((responseJson)=>{
        console.log(responseJson);
           if(responseJson == 'success'){
           console.log(responseJson);
          this.setState({isFetching:false});
        this.setState({ modalTolak :false});
        this.componentDidMount();
       }
    }
    ).catch((error)=>{
   console.error(error);
   this.setState( {isFetching:false});
   });
  }
}

simpan_target_perizinan = () =>{
if(this.state.chosenDate == null){
 
  Alert.alert('Anda Belum menentukan perkiraan selesai');
  
}else{
  this.setState( {isFetching:true});
  fetch('http://192.168.0.109/-notaris/DashboardPerizinanMobile',{
        method:'POST',
        headers:{
          Accept :'application/json',
          'Content-Type':'application/json',
          'api_notaris'   : '9cd7fd2a70471602c11ec4e39112cd4c',
           },
        body:JSON.stringify({
         status         : 'SimpanProsesPerizinan',
         no_berkas      : this.state.no_berkas_perizinan,
         target_selesai : this.state.chosenDate 

        })
     
      }).then((Response)=>Response.json())
        .then((responseJson)=>{
        if(responseJson == 'success'){
          console.log(responseJson);
          this.setState({isFetching:false});
          this.setState({ modalVisible :false});
          this.componentDidMount();
         }
      }
      ).catch((error)=>{
     console.error(error);
     this.setState( {isFetching:false});
     });
 }
} 
   
  render() {
  
  
    var d =  [];
     for(let userObject of this.state.data_masuk){
      
      if(userObject.status_data == "kosong"){
      
      d.push(
        <Content style={{flex:1,alignContent:"center"}}>
           <Text style={{justifyContent:"center",textAlign:"center"}}>Belum Ada Data Masuk Tersedia</Text>
      
        </Content>
     );
      }else{

      var dateB = moment(userObject.tanggal_penugasan);
      var dateC = moment(new Date());
      var waktu = dateB.from(dateC); 
  
      d.push(
        <Card>
        <CardItem  bordered style={style_custom.bg_header2}>
          <Text style={style_custom.text_color2}>{userObject.nama_dokumen }</Text>
          
        </CardItem>
        <CardItem bordered>
          <Body>
            <Text>Nama Client        : {userObject.nama_client}</Text>
            <Text>Tugas Dari         : {userObject.nama_petugas}</Text>
            <Text>Tanggal penugasan  : {waktu}</Text>
         </Body>
        </CardItem>
        <CardItem style={{alignContent:"center", justifyContent: 'center',}}>
              
                <Button onPress={() =>this.tolak(userObject.no_berkas_perizinan , userObject.nama_dokumen)} danger block small >
                  <Icon active name="trash" />
                  <Text>Tolak</Text>
                </Button>
              
                <Button onPress={() =>{ this.proses(userObject.no_berkas_perizinan , userObject.nama_dokumen)  }} style={{ marginLeft :12}} success block small>
                <Icon active name="sync" />
                  <Text>
                   Proses</Text>
                </Button>
   </CardItem>
      </Card>);
    }
  }
   
  
    return (
        <Container>
       
         <Modal 
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
          this.setState({modalVisible :false})}}>
         <View onTouchMove={() => {
          this.setState({modalVisible :false})}} style={{backgroundColor:"rgba(0,0,0,0.5)"}}>
          <View style ={{alignItems: 'center',justifyContent:"center"}}>
            <View style={style_custom.viewmodall}>
            <View style={style_custom.viewmodal2}>
            <Text style={style_custom.headermodal}>{this.state.titleModal}</Text>
            </View >
            <View style={style_custom.HeaderModalBody}>
           <Item>
             <Text>Pilih Tanggal</Text>
             <DatePicker
                  locale={"en"}
                  timeZoneOffsetInMinutes={undefined}
                  modalTransparent={false}
                  animationType={""}
                  androidMode={"default"}
                  placeHolderText="Piih Tanggal"
                  textStyle={{ color: "green" }}
                  placeHolderTextStyle={{ color: "#d3d3d3" }}
                  onDateChange={this.setDate}
                  disabled={false}
              />
            </Item>
            <Text>
            {"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}            </Text>
          <Button onPress={()=>this.simpan_target_perizinan()} block success><Text>Proses Perizinan</Text></Button>
          </View>  
          </View>
          </View>
          <FetchingIndicator isFetching={this.state.isFetching} />
          </View>
        </Modal>

        <Modal
    
          transparent={true}
          visible={this.state.modalTolak}
          onRequestClose={() => {
          this.setState({modalTolak :false})}}>
            
         <View 
           style={{backgroundColor:"rgba(0,0,0,0.5)",justifyContent: 'space-around'}}>
          <View style ={{alignItems: 'center',justifyContent:"center"}}>
            <View style={style_custom.viewmodall}>
            <View style={style_custom.viewmodal2}>
            <Text style={style_custom.headermodal}>{this.state.titleModal}</Text>
            </View >
            <View style={style_custom.HeaderModalBody}>
              <ScrollView>
 <Text style={{textAlign:"center"}}>Anda yakin ingin menolak tugas perizinan ? </Text>
              <Text style={{textAlign:"center"}}>Jika yakin tolong berikan alasan penolakannya dibawah ini  </Text>
              
      
                
              <Textarea onChangeText={alasan_penolakan=>this.setState({alasan_penolakan})} rowSpan={5} bordered placeholder="Masukan alasan penolakan" />
      <Text>{"\n"}{"\n"} </Text>
          <Button danger onPress={()=>this.simpan_penolakan()} block ><Text>Tolak Tugas</Text></Button>
          </ScrollView>
              </View>  
          </View>
          </View>
          <FetchingIndicator isFetching={this.state.isFetching} />
          </View>
        </Modal>
       
        <Content padder>
         { d }        
      </Content>
    <FetchingIndicator isFetching={this.state.isFetching} />
      </Container>
    );
  }
}