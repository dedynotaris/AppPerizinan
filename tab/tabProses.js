import React, { Component } from 'react';
import {Modal,View,TouchableHighlight,TouchableOpacity,ScrollView,AsyncStorage,Alert } from 'react-native';
import FetchingIndicator from 'react-native-fetching-indicator';
import { Container,Card,CardItem,Body,Item,Input,Footer,Title,Header, Text,Textarea,Grid,Col, Content,Button,Icon, FooterTab } from 'native-base';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator } from 'react-navigation-stack';
import moment from 'moment';
import style_custom from '../stye_custom';
import stye_custom from '../stye_custom';
import CameraScreen from './CameraScreen';
import { RNCamera } from 'react-native-camera';
import ImagePicker from 'react-native-image-crop-picker';
import { IosCIConstantColorGenerator } from 'react-native-image-filter-kit';
import RNTesseractOcr from 'react-native-tesseract-ocr';

import RNTextDetector from "react-native-text-detector";
class CameraText extends React.Component{
  state = {
    flash: 'off',
    zoom: 0,
    autoFocus: 'on',
    depth: 0,
    type: 'back',
    whiteBalance: 'auto',
    ratio: '16:9',
    canDetectText: true,
    textBlocks: [],
  };
  toggle = value => () => this.setState(prevState => ({ [value]: !prevState[value] }));

  renderTextBlocks = () => (
    <View pointerEvents="none">
      {this.state.textBlocks.map(this.renderTextBlock)}
    </View>
  );

  renderTextBlock = ({ bounds, value }) => (
      <Text>{value})</Text>
  );


  textRecognized = object => {
    const { textBlocks } = object;
    this.setState({ textBlocks });
  };
  
  takePicture = async () => {
    const options = {
      base64: true,
      chace :true,
      pauseAfterCapture : false,
    };
  //  const data = await this.camera.takePictureAsync(options);

  const { uri } = await this.camera.takePictureAsync(options);
     
console.log(uri);
      const visionResp = await RNTextDetector.detect({
          imagePath: uri, // this can be remote url as well, package will handle such url internally
          language: "eng",
          pageIteratorLevel: "textLine",
          pageSegmentation: "SparseTextOSD", // optional
          charWhitelist: "01234567", // optional
          charBlacklist: "01234567", // optional
          imageTransformationMode: 2, // optional | 0 => none | 1 => g8_grayScale | 2 => g8_blackAndWhite
      });
      console.log('visionResp', visionResp);

/*    const tessOptions = {
      whitelist: null, 
      //blacklist: '1234567890\'!"#$%&/()={}[]+*-_:;<>'
    };




   /* ImagePicker.openCropper({
      path: data.uri ,
      width: 900,
      height: 1000,
      freeStyleCropEnabled :true,
      hideBottomControls :true,
      showCropGuidelines :false,
      compressImageQuality :1
    }).then(image => {
    const path = image.path.replace("file://","")

      RNTesseractOcr.recognize(path, "LANG_INDONESIAN", tessOptions)
        .then((result) => {
          //this.setState({ ocrResult: result });
          console.log("OCR Result: ", result);
        })
        .catch((err) => {
          console.log("OCR Error: ", err);
        })
        .done();
  

    });  

    
    /*this.props.navigation.navigate('PageUpload',{
      data_text: this.state.textBlocks,
     })*/


    this.setState( {isFetching:false});
  };

  render(){
    const { canDetectText } = this.state;
    return(
      <RNCamera
      ref={ref => {
        this.camera = ref;
      }}
      style={{
        flex: 1,
      }}
      type={this.state.type}
      flashMode={this.state.flash}
      autoFocus={this.state.autoFocus}
      zoom={this.state.zoom}
      whiteBalance={this.state.whiteBalance}
      ratio={this.state.ratio}
      focusDepth={this.state.depth}
      trackingEnabled
      androidCameraPermissionOptions={{
        title: 'Permission to use camera',
        message: 'We need your permission to use your camera',
        buttonPositive: 'Ok',
        buttonNegative: 'Cancel',
      }}
      onTextRecognized={canDetectText ? this.textRecognized : null}
      >
    
    <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
            alignItems:"stretch",
            justifyContent:"center"
          }}
         >
         
         
          
        </View>
        
        <TouchableOpacity style={{ flex: 0.3, alignSelf: 'flex-end' }}
           
            onPress={this.takePicture}
          >
            <Text ><Icon  name="camera"></Icon> </Text>
          </TouchableOpacity>
      </RNCamera>
    );
  }
}

class PageUpload extends React.Component{
  constructor(props){
    super(props)
    this.state={
      no_user     :'',
      isFetching  :false,
      data_meta   :'',
      data        :""
     }
    this.actionSheet = null;
  }

  componentWillReceiveProps=() =>{
  const { navigation } = this.props;
  this.setState({data : navigation.getParam('data_text')})
Alert.alert(this.state.data); 
}

  renderTextBlocks = () => (
    <View pointerEvents="none">
      {this.state.data.map(this.renderTextBlock)}
    </View>
  );

  renderTextBlock = ({ bounds, value }) => (
      <Text>
        {value}
      </Text>
     
  );

  componentDidMount = () =>{
    this.setState( {isFetching:true});
    this.ambilMeta();
  }
  
ambilMeta =()=>{
  const { navigation } = this.props;
  console.log(navigation.getParam('data_text'));
  fetch('http://192.168.0.109/-notaris/DashboardPerizinanMobile',{
    method:'POST',
    headers:{
      Accept :'application/json',
      'Content-Type':'application/json',
      'api_notaris'   : '9cd7fd2a70471602c11ec4e39112cd4c',
       },
    body:JSON.stringify({
     status :'ambil_meta',
     no_nama_dokumen :navigation.getParam('no_nama_dokumen'),
    })
 
  }).then((Response)=>Response.json())
    .then((responseJson)=>{
      this.setState({data_meta :responseJson });
      console.log(responseJson);
      this.setState( {isFetching:false});
    }
  ).catch((error)=>{
 console.error(error);
 });
}

  render() {
    
    const { navigation } = this.props;
    
    var data_inputan =  [];
     for(let userObject of this.state.data_meta){
      
        data_inputan.push(
           <View style={{margin:10}}>
           <Item regular>
            <Input placeholder={userObject.nama_meta} />
          </Item>
         </View>
       );
    }
var data_lampiran = [];
    data_lampiran.push(
      <View style={{margin:12}}>
        <Grid>
        <Col >
         <Button onPress={()=> this.props.navigation.navigate('CameraText')}>
          <Text>Kemera</Text>
          <Icon name="camera"></Icon>
          </Button>
        </Col>
        <Col style={{marginLeft:5}}>
        <Button >
          <Text >File </Text>
          <Icon name="filing"></Icon>
          </Button>
        </Col>
        </Grid>
     </View>
    );
    return (
     
     <Container>
       <Content>
       <Header  androidStatusBarColor="#000"  style={style_custom.bg_header}>
          <Title>{navigation.getParam('nama_dokumen')}</Title>
        </Header>
            {data_inputan}

         {data_lampiran}    

         <View style={{margin:12}}>
         <Button onPress={this.logout }   block>
              <Text style={{fontSize:14}}>Simpan</Text>
              <Icon name="save"></Icon>
              </Button>
        
         </View>
 
         {this.renderTextBlock}
                </Content>
        
        <FetchingIndicator isFetching={this.state.isFetching} />
      </Container>
      );
  }
}

class tabProses extends React.Component {
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
      modalVisible : false,
      ContentModal : '',
      titleModal :'',
      LaporanPerizinan : ''
     
    }
    this.actionSheet = null;
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
         status :'Proses'
        })
     
      }).then((Response)=>Response.json())
        .then((responseJson)=>{
          this.setState({data_masuk :responseJson });
          this.setState( {isFetching:false});
       }
      ) .catch((error)=>{
     console.error(error);
     this.setState( {isFetching:false});
     });
    });
  }

openModal =(key,title)=>{
this.props.navigation.navigate('CameraScreen');
this.setState({modalVisible:true});
this.setState({ContentModal : key});
this.setState({titleModal : title});
}

openScanCamera = () =>{
//  Alert.alert("asdasd");

this.props.navigation.navigate("ScanCamera");
this.setState({modalVisible :false});
}

 render() {
   var p =  [];
     for(let userObject of this.state.data_masuk){
      if(userObject.status_data == "kosong"){
      
        p.push(
          <Content style={{flex:1,alignContent:"center"}}>
             <Text style={{justifyContent:"center",textAlign:"center"}}>Belum Ada Pekerjaan Proses Tersedia</Text>
        
          </Content>
       );
        }else{
      var dateB = moment(userObject.target_selesai_perizinan);
      var dateC = moment(new Date());
      var waktu = dateB.from(dateC); 
  
      p.push(
        <Card>
        <CardItem  bordered style={style_custom.bg_header}>
          <Text style={style_custom.text_color2}>{userObject.nama_dokumen }</Text>
         
        </CardItem>
        <CardItem bordered>
          <Body>
            <Text>Nama Client        : {userObject.nama_client}</Text>
            <Text>Tugas Dari         : {userObject.nama_petugas}</Text>
            <Text>Target selesai  : {waktu}</Text>
            
         </Body>
        </CardItem>
        <CardItem style={{alignContent:"center", justifyContent: 'center',}}>
              
                <Button onPress={()=> this.props.navigation.navigate('PageUpload',{
                                                                        no_nama_dokumen: userObject.no_nama_dokumen,
                                                                        nama_dokumen: userObject.nama_dokumen,
                 }) } primary block small >
                <Icon active name="cloud-upload" />
                </Button>
              
                <Button onPress={()=>this.props.navigation.navigate('CameraScreen') }  style={{ marginLeft :12}} dark block small>
                <Icon active name="filing" />
                </Button>
                
                <Button onPress={()=>this.openModal('conten_lapor','Buat Laporan  ') }  style={{ marginLeft :12}} warning  block small>
                <Icon active name="clipboard" />
                </Button>
                
                <Button  style={{ marginLeft :12}} success block small>
                <Icon active name="done-all" />
                </Button>
   </CardItem>
      </Card>);
        }
    }

    var conten_upload = (
       <ScrollView>
         <Grid>
           <Col style={{backgroundColor:"#66bcd4",margin:12,padding:5}}><Text style={stye_custom.text_color2}>Galeri</Text><Icon style={stye_custom.text_color2}  name="image"></Icon></Col>
           <Col onPress={this.openScanCamera}  style={{backgroundColor:"#66bcd4",margin:12,padding:5}}><Text style={stye_custom.text_color2}>Scan Camera</Text><Icon style={stye_custom.text_color2} name="camera"></Icon></Col>
        </Grid>
       </ScrollView>
      );
   
    var conten_penunjang = (
      <Text>INI HALAMAN BERKAS</Text>
    );
   
    var conten_lapor = (
                <ScrollView>
                      <Text style={{textAlign:"center"}}>Berikan Laporan Perizinan</Text>
                          <Textarea onChangeText={LaporanPerizinan=>this.setState({LaporanPerizinan})} rowSpan={6} bordered placeholder="Masukan Laporan . . . ." />
                      <Text>{"\n"}{"\n"} </Text>
                    <Button success onPress={()=>this.SimpanLaporanPerizinan()} block ><Text>Lapor Perizinan</Text></Button>
                </ScrollView> 
                );
   
    var belumada = (
      <Text> </Text>
    );

    let halaman_modal;
   
    if(this.state.ContentModal =='conten_upload'){
     halaman_modal = conten_upload;
    }else if(this.state.ContentModal =='conten_penunjang'){
      halaman_modal = conten_penunjang;
    }else if(this.state.ContentModal =='conten_lapor'){
      halaman_modal = conten_lapor;
    }else{
      halaman_modal = belumada;
    }

    return (
      
      <Container >
        <Header  androidStatusBarColor="#000"  style={style_custom.bg_header}>
          <Title>Pekerjaan Proses</Title>
        </Header>
  
      <Content>
       { p }
      </Content>
       <FetchingIndicator isFetching={this.state.isFetching} />
      </Container>
    );
  }
}


const stackConfig = {
  tabProses : {
    screen:tabProses,
    navigationOptions:{
      header:null,
    }
  },
  CameraText : {
    screen:CameraText,
    navigationOptions:{
      header:null,
    }
  },
  PageUpload : {
    screen:PageUpload,
    navigationOptions:{
      header:null,
    }
  },
  CameraScreen : {
    screen:CameraScreen,
    navigationOptions:{
      header:null,
    }
  }
}
 
 const AppNavigator  = createStackNavigator(stackConfig,{
   initialRouteName: 'tabProses',
 });
 
 const AppContainer = createAppContainer(AppNavigator);
 
 export default AppContainer;