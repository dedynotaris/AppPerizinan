import { StyleSheet,Dimensions } from 'react-native';

export default StyleSheet.create({
    Txt_theme:{
        color:'#2f4f4f',
        textAlign:"center",
        paddingTop:20,
        fontSize:25 
        },
        bg_login:{
          width :276, height:240,marginTop:20
        },
        btn_login:{
        backgroundColor:"#2f4f4f",
        color:"#fff",
        marginTop:30  
        },
        indicator: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          height: 80
        },bg_header:{
            alignItems:"center",  
            color:'#fff',
            textAlign:"center",
            backgroundColor:'#2f4f4f',
            },
            text_color:{
            color:'#fff',
            justifyContent:"center"
            },  
            text_color2:{
            color:'#fff',
            justifyContent:"center",
            textAlign:'center',
          },
            bg_header2:{
            backgroundColor:"#66bcd4",
             
          },
          viewmodall:{
            backgroundColor:"#fff",
            width: 358,
            height: 600,
            marginTop :100,
            borderTopRightRadius:10 ,
            borderTopLeftRadius :10,
            borderStyle:"solid",
            borderColor:"#ccc",
            borderWidth:1
           
          },
          viewmodal2:{
            height:50,
             padding:5, borderTopRightRadius:10 , borderTopLeftRadius :10,
            backgroundColor :"#66bcd4"
          },
          headermodal:{
            color:'#fff',
            justifyContent:"center",
            textAlign:'center',
            
            
          },
          HeaderModalBody : {
            padding:5,
          }, 
          take_photo :{
            fontSize:30,
            color:"#fff",
            textAlign:"center"

          },
          container: {
            backgroundColor: 'black',
          },
          preview: {
            flexDirection : 'row',
            aspectRatio: 16/9,
          },
          topButtons: {
            flex: 1,
            width: Dimensions.get('window').width,
            alignItems: 'flex-start',
          },
          bottomButtons: {
            flex: 1,
            width: Dimensions.get('window').width,
            justifyContent: 'flex-end',
            alignItems: 'center',
          },
        
          flipButton: {
            flex: 1,
            right: 20,
            alignSelf: 'flex-end',
          },
          recordingButton: {
          },
          bg_data:{
            backgroundColor:"#66bcd4",
            margin:12,
            color:"#fff",
            borderTopRightRadius:2,
            borderTopLeftRadius:2
       },
         text_data :{
           justifyContent:"center",
           textAlign:"center",
           color:"#fff",
           fontSize:15
         },canvas: {
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        },


     });
