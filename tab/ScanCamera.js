import React, { Component } from 'react';
import {View,TouchableOpacity,StyleSheet,Image,PermissionsAndroid,ScrollView,Alert,FlatList } from 'react-native';
import FetchingIndicator from 'react-native-fetching-indicator';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator } from 'react-navigation-stack';
import style_custom from '../stye_custom';
import { RNCamera } from 'react-native-camera';
import CameraRoll, { saveToCameraRoll } from "@react-native-community/cameraroll";
import { Container,Text,Textarea,Grid,Col,Header,Footer,FooterTab, Content,Button,Icon } from 'native-base';
import RNFetchBlob from 'react-native-fetch-blob';
import moment from 'moment';
import HasilFoto from './HasilFoto';
import ImagePicker from 'react-native-image-crop-picker';
const DESIRED_RATIO = "16:9";
const flashModeOrder = {
  off: 'on',
  on: 'auto',
  auto: 'torch',
  torch: 'off',
};

const wbOrder = {
  auto: 'sunny',
  sunny: 'cloudy',
  cloudy: 'shadow',
  shadow: 'fluorescent',
  fluorescent: 'incandescent',
  incandescent: 'auto',
};

class ScanCamera extends React.Component {
  constructor(props){
    super(props)
    this.state={
        hasil_foto:'',
        images: [],
        isCameraLoaded: false,
        isFetching:false,
        pauseAfterCapture :true,
        hasil_kamera : "",
        flash: 'off',
        zoom: 0,
        autoFocus: 'on',
        depth: 0,
        type: 'back',
        whiteBalance: 'auto',
        ratio: '16:9',
     }
  }
 
    state = {
      type: RNCamera.Constants.Type.back,
    };

    componentDidMount() {
    }
  
   

  
    takePhoto = async () => {
      this.setState( {isFetching:true});
 
      if (this.camera) {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      const options = {
          base64: true,
          chace :true,
          pauseAfterCapture : false,
        };
        const data = await this.camera.takePictureAsync(options);
      ImagePicker.openCropper({
        path: data.uri ,
        width: 900,
        height: 1000,
        freeStyleCropEnabled :true,
        hideBottomControls :true,
        showCropGuidelines :false,
        compressImageQuality :1
      }).then(image => {
        const nama = "SCNAppPerizinan"+`${moment().unix()}.jpg`;
        RNFetchBlob.fs.mv(image.path.replace("file://",""), `${RNFetchBlob.fs.dirs.DCIMDir}/AppPerizinan/`+nama)
        .then(() => { 
         this.setState({hasil_kamera : RNFetchBlob.fs.dirs.DCIMDir+"/AppPerizinan/"+nama})   
        })
        .catch((err) => { console.log(err) })
      this.props.navigation.navigate("HasilFoto");
      });  
      this.setState( {isFetching:false});
    
      }else{
        alert("Kamera Not Ready");
      }
      }else{
        alert("Permision camera denied");
      }
    
};

prepareRatio = async () => {
  if (Platform.OS === 'android' && this.camera) {
       const ratios = await this.camera.getSupportedRatiosAsync();

        const ratio = ratios.find((ratio) => ratio === DESIRED_RATIO) || ratios[ratios.length - 1];
       
       this.setState({ ratio });
  }
}

PotoUlang = () =>{
this.setState({pause:false});
this.camera.resumePreview();
}
toggleFacing() {
  this.setState({
    type: this.state.type === 'back' ? 'front' : 'back',
  });
}
toggleFlash() {
  this.setState({
    flash: flashModeOrder[this.state.flash],
  });
}
toggleWB() {
  this.setState({
    whiteBalance: wbOrder[this.state.whiteBalance],
  });
}
render() {
      const { type } = this.state;
    
       var halaman =  [];

     
      halaman.push(
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
           >
        

        <View
            style={{
              backgroundColor: 'transparent',
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
          >
            <TouchableOpacity style={styles.flipButton} onPress={this.toggleFacing.bind(this)}>
              <Text style={styles.flipText}> FLIP </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.flipButton} onPress={this.toggleFlash.bind(this)}>
              <Text style={styles.flipText}> FLASH: {this.state.flash} </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.flipButton} onPress={this.toggleWB.bind(this)}>
              <Text style={styles.flipText}> WB: {this.state.whiteBalance} </Text>
            </TouchableOpacity>
          </View>
        <View
          style={{
            flex: 5,
            backgroundColor: 'transparent',
            flexDirection: 'row',
            alignItems:"stretch",
            justifyContent:"center"
          }}
         >
         
         <TouchableOpacity
            style={[styles.flipButton, styles.picButton, { flex: 0.3, alignSelf: 'flex-end' }]}
            onPress={this.takePhoto}
          >
            <Text style={styles.flipText}><Icon style={style_custom.take_photo}  name="camera"></Icon> </Text>
          </TouchableOpacity>
          
        </View>
        <FetchingIndicator isFetching={this.state.isFetching} />  
            </RNCamera>
          
       
       
     
      
       )

    

      return (
       <Container>
        { halaman }
       </Container> 
       
      );
    }
  }
  

const stackConfig = {
    ScanCamera : {
      screen:ScanCamera,
      navigationOptions:{
        header:null,
        
      }
    },HasilFoto : {
      screen:HasilFoto,
      navigationOptions:{
        header:null,
        
      }
    }
   }
   
   const AppNavigator  = createStackNavigator(stackConfig,{
     initialRouteName: 'ScanCamera',
   });
   
   const AppContainer = createAppContainer(AppNavigator);
   const landmarkSize = 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#000',
  },
  flipButton: {
    flex: 0.3,
    height: 40,
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipText: {
    color: 'white',
    fontSize: 15,
  },
  zoomText: {
    position: 'absolute',
    bottom: 70,
    zIndex: 2,
    left: 2,
  },
  picButton: {
    backgroundColor: 'transparent',
  },
  facesContainer: {
    position: 'absolute',
    
  },
  face: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    borderColor: '#FFD700',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  landmark: {
    width: landmarkSize,
    height: landmarkSize,
    position: 'absolute',
    backgroundColor: 'red',
  },
  faceText: {
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    backgroundColor: 'transparent',
  },
  text: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    borderColor: '#F00',
    justifyContent: 'center',
  },
  textBlock: {
    color: '#F00',
    position: 'absolute',
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
});


   export default AppContainer;