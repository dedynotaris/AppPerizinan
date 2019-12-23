import React, { Component } from 'react';
import {View,StyleSheet, Dimensions, TouchableOpacity,Image,PermissionsAndroid,ScrollView,Alert,AsyncStorage,Modal } from 'react-native';
import FetchingIndicator from 'react-native-fetching-indicator';
import {createAppContainer ,NavigationEvents} from 'react-navigation';
import {createStackNavigator } from 'react-navigation-stack';
import style_custom from '../stye_custom';
import {Header,Tabs,Tab,TabHeading, Container,Text,Textarea,Grid,Col, Content,Button,Icon,Footer,FooterTab } from 'native-base';
import RNFetchBlob from 'react-native-fetch-blob';
import {FlatList} from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';
import moment from 'moment';
import Gallery from 'react-native-image-gallery';
import Slider from '@react-native-community/slider';
import CameraRoll, { saveToCameraRoll } from "@react-native-community/cameraroll";
import ScanCamera from "./ScanCamera";
import PDFLib, { PDFDocument, PDFPage } from 'react-native-pdf-lib';
import {
  ImageFilter,
  SoftLightBlend,
  Emboss,
  Earlybird,
  Invert,
  RadialGradient,
  Brightness,
  Grayscale,
  brightness,
  Contrast
} from 'react-native-image-filter-kit';

const styles = StyleSheet.create({ bgContainer: { flex:3, width: null, height: null } });

class PageEffect extends React.Component{
  constructor(props){
    super(props)
    this.state={
    DiEdit         : "",
    visible        : false,
    Efek           : "Asli",
    kecerahan      : "2.5",
    kejelasan      : "0.7",
    SimpanImage    : false,
    Image          : "",
    NamaImageBaru  : "",
    isFetching     : false

    }
    }
    
    componentDidMount(){
      async function ambil_data(key) {
        const a = await  AsyncStorage.getItem(key).then((value) =>{ return value });     
        return a  
        }
       ambil_data('FotoDiEdit').then((FotoDiEdit)=>{
        this.setState({DiEdit :`${RNFetchBlob.fs.dirs.DCIMDir}/AppPerizinan/`+FotoDiEdit});
        this.setState({NamaImageBaru : FotoDiEdit});
        }); 
    
        this.setState({visible : true});
    }

  BeriEfek(JenisEfek){
    this.setState({Efek : JenisEfek});
  }
  
  
  saveImage = () => {
  this.setState( {isFetching:true});
  const nama = "SCNAppPerizinan"+`${moment().unix()}.jpg`;
  RNFetchBlob.fs.unlink(this.state.DiEdit)
  console.log(this.state.DiEdit);
  CameraRoll.saveToCameraRoll(this.state.Image).then((data)=>{
    RNFetchBlob.fs.mv(this.state.Image.replace("file:///data/user/0/com.appperizinan/cache/",RNFetchBlob.fs.dirs.PictureDir+"/"), `${RNFetchBlob.fs.dirs.DCIMDir}/AppPerizinan/`+nama)
  });

 this.props.navigation.navigate("HasilFoto");
 this.setState( {isFetching:false});
  }
 render()  {
    let gambar = [];
       gambar.push(
       <Contrast amount={this.state.kejelasan}
       extractImageEnabled={true}
       onFilteringError={({ nativeEvent }) => console.log(nativeEvent)}
       onExtractImage={({nativeEvent})=> this.setState({Image : nativeEvent.uri})}   
        image = {  
        <Brightness amount={this.state.kecerahan}
        image= {
            <Gallery
             style={{ flex: 1, backgroundColor: 'white' }}
             images={[
             {source:{uri:'file://'+this.state.DiEdit} , dimensions: { width: 150, height: 150 } }
            ]}/>
          }/>
        }/>
      );

  return (
    <Container>
    <Header style={{backgroundColor:"rgba(0,0,0,0.5)"}} androidStatusBarColor="#000">
     <Grid>
       <Col style={{width:40,justifyContent:"center",alignItems:"center"}}><Icon style={{color:"#fff"}} name="contrast"></Icon></Col>
       <Col style={{justifyContent:"center"}}><Icon><Slider
       style={{width: 300, height: 40}}
       minimumValue={0}
       value = {2.5}
       maximumValue={5}
       minimumTrackTintColor="#fff"
       maximumTrackTintColor="#000000"
       onValueChange={e => {
        console.log(e)
        this.setState(() => {
          return { kejelasan: e }
          console.log(e)
        })
      }}
      onSlidingComplete={e => {
        console.log(e)
        this.setState(() => {
          return { kejelasan: e }
        })
      }}
      /></Icon>
      </Col>
     </Grid>
   </Header>
  <Content>
  { gambar }
    </Content>
   <Footer style={{backgroundColor:"rgba(0,0,0,0.5)"}} >
   <Grid>
       <Col style={{width:40,justifyContent:"center",alignItems:"center"}}><Icon style={{color:"#fff"}} name="sunny"></Icon></Col>
       <Col style={{justifyContent:"center"}}><Icon><Slider
       style={{width: 300, height: 40}}
       minimumValue={0}
       maximumValue={1.5}
       value = {0.7}
       minimumTrackTintColor="#fff"
       maximumTrackTintColor="#000000"
       onValueChange={e => {
        console.log(e)
        this.setState(() => {
          return { kecerahan: e }
          console.log(e)
        })
      }}
      onSlidingComplete={e => {
        console.log(e)
        this.setState(() => {
          return { kecerahan: e }
        })
      }}
      /></Icon>
      </Col>
     </Grid>
   </Footer>
   <FetchingIndicator isFetching={this.state.isFetching} />
     <Footer>
          <FooterTab style={style_custom.bg_header}>
             <Button onPress={()=>this.saveImage()}  >
              <Icon name="save"> </Icon>
              <Text>Simpan</Text>
            </Button>
          </FooterTab>
         </Footer> 
      </Container>
  );
}
    
}

class EditFoto extends React.Component{

constructor(props){
super(props)
this.state={
DiEdit : "",
visible :false
}
}

componentDidMount(){
  async function ambil_data(key) {
    const a = await  AsyncStorage.getItem(key).then((value) =>{ return value });     
    return a  
    }
  
    ambil_data('FotoDiEdit').then((FotoDiEdit)=>{
    this.setState({DiEdit :`${RNFetchBlob.fs.dirs.DCIMDir}/AppPerizinan/`+FotoDiEdit});
    }); 

    this.setState({visible : true});
}
crop(file){
ImagePicker.openCropper({
  path: "file://"+file ,
  width: 900,
  height: 1000,
  freeStyleCropEnabled :true,
  hideBottomControls :true,
  showCropGuidelines :false,
  compressImageQuality :1
}).then(image => {
  
this.props.navigation.navigate("HasilFoto");
  const nama = "SCNAppPerizinan"+`${moment().unix()}.jpg`;
  RNFetchBlob.fs.unlink(file)
  .then(()=>{
    RNFetchBlob.fs.mv(image.path.replace("file://",""), `${RNFetchBlob.fs.dirs.DCIMDir}/AppPerizinan/`+nama)
    this.setState({DiEdit :`${RNFetchBlob.fs.dirs.DCIMDir}/AppPerizinan/`+nama});
   })
  .catch((err)=> console.log(err))

  .then(() => { 
  })
  .catch((err) => { console.log(err) })

});  


}
beri_effect () {
this.props.navigation.navigate("PageEffect");
}

hapus_foto () {
RNFetchBlob.fs.unlink(this.state.DiEdit);
this.props.navigation.navigate("HasilFoto");
}

foto_ulang(){
this.props.navigation.navigate("ScanCamera");
}
  

render(){
  

 return(
   <Container>
   <Gallery
        style={{ flex: 1, backgroundColor: 'white' }}
        images={[
          {source:{uri:'file://'+this.state.DiEdit} , dimensions: { width: 150, height: 150 } }
         ]}
      />
 
    <Footer>
          <FooterTab style={style_custom.bg_header}>
            <Button onPress={()=>this.crop(this.state.DiEdit)}>
            <Icon  name="crop"></Icon>
             <Text>Crop { }</Text>
            </Button>
            <Button onPress={()=>this.beri_effect()}  >
            <Icon   name="brush"></Icon>
              <Text>Effect</Text>
            </Button>
            <Button>
            <Icon   onPress={()=>this.foto_ulang()}  name="sync"></Icon>
              <Text>Foto</Text>
            </Button>
           <Button onPress={()=>this.hapus_foto()}>
           <Icon  name="trash"></Icon>
           <Text>Hapus</Text>
            </Button>
          </FooterTab>
         </Footer> 
   </Container>
  
 ); 
}
}


class HasilFoto extends React.Component {
  constructor(props){
    super(props)
    this.state={
        hasil_foto:'',
        images: [],
        FotoEdit :""
     }
  }

  
  componentDidMount() {
    
    RNFetchBlob.fs.ls(RNFetchBlob.fs.dirs.DCIMDir+"/AppPerizinan/").then((files)=>{
    this.setState({images : files});
    });
    this.render();
    }
  
     EditFoto(item){
      AsyncStorage.setItem('FotoDiEdit',item);
      this.props.navigation.navigate("EditFoto");
     }
  
    renderItem(item){
      return(
        
        <TouchableOpacity   onPress={()=>this.EditFoto(item) } style ={{flex:1/3,aspectRatio:1}}>
          <Image style={{flex:1,margin:2}} resizeMode='cover' source={{uri:'file:///storage/emulated/0/DCIM/AppPerizinan/'+item}}/>
        </TouchableOpacity>
      )
     }
  
buatPdf = () => {


 
this.state.images.map((item) =>
console.log(RNFetchBlob.fs.dirs.DCIMDir+"/App/"+item)
)


var a = PDFPage.create()
.setMediaBox(210, 297)
.drawImage("/storage/emulated/0/DCIM/AppPerizinan/SCNAppPerizinan1575259297.jpg","jpg",{x: 0,y: 0,width: 210,height: 297});

var b = PDFPage.create()
.setMediaBox(210, 297)
.drawImage("/storage/emulated/0/DCIM/AppPerizinan/SCNAppPerizinan1575339450.jpg","jpg",{x: 0,y: 0,width: 210,height: 297});

var c = PDFPage.create()
.setMediaBox(210, 297)
.drawImage("/storage/emulated/0/DCIM/AppPerizinan/SCNAppPerizinan1575339450.jpg","jpg",{x: 0,y: 0,width: 210,height: 297});

var f = a,b,c;

const pdfPath = `${RNFetchBlob.fs.dirs.DCIMDir}/sample.pdf`;

  PDFDocument
    .create(a,b,c)
    .addPages(f)
    .write() // Returns a promise that resolves with the PDF's path
    .then(path => {
      console.log('PDF created at: ' + path);
      
  });
}

refresh(){
  RNFetchBlob.fs.ls(RNFetchBlob.fs.dirs.DCIMDir+"/AppPerizinan/").then((files)=>{
    this.setState({images : files});
  });
}

    render() {

      let data=[];
      if(this.state.images.length == 0 ){
      data.push(
       <Content style={{flex:1}}>

       <View style={{justifyContent:"center",alignContent:"center",alignItems:"center"}}>
          
          <Text style={{textAlign:"center",justifyContent:"center",alignContent:"center",alignItems:"center"}}>Belum ada Foto Scanan</Text>
     
        </View>
        </Content>
        );
      }else{
      data.push(
        <FlatList numColumns = {3}
          data = {this.state.images}
          renderItem = {({item,index})=>this.renderItem(item,index)}
          keyExtractor={(item, index) => index.toString()} 
          />        
      
      );
      }
      return (
        
       <Container>
            <NavigationEvents onDidFocus={() => this.componentDidMount()} />
        { data }  
        <Footer>
          <FooterTab style={style_custom.bg_header}>
            
            <Button  onPress={()=>this.props.navigation.navigate("ScanCamera")}>
            <Icon  name="camera"></Icon>
              <Text>Foto</Text>
            </Button>
           
            <Button onPress={()=>this.buatPdf()}>
            <Icon   name="save"></Icon>
              <Text >PDF</Text>
            </Button>
           
           </FooterTab>
         </Footer>
       </Container>
      );
    }
  }
  

const stackConfig = {
    HasilFoto : {
      screen:HasilFoto,
      navigationOptions:{
        header:null,
        
      }
    },EditFoto : {
      screen:EditFoto,
      navigationOptions:{
        header:null,
        
      }
  },PageEffect : {
    screen:PageEffect,
    navigationOptions:{
    header :null
    },
    
  }
  /*,ScanCamera : {
    screen:ScanCamera,
    navigationOptions:{
    header :null
    },
  
  }*/
}
   
   const AppNavigator  = createStackNavigator(stackConfig,{
     initialRouteName: 'HasilFoto',
   });
   
   const AppContainer = createAppContainer(AppNavigator);
   
   export default AppContainer;