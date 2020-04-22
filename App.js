import React, { useRef, useState } from "react"
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  Image, 
  Dimensions
} from "react-native"
// import ImgToBase64 from 'react-native-image-base64'
import DocumentScanner from "@woonivers/react-native-document-scanner"
import RNFetchBlob from 'rn-fetch-blob'
// import RNFetchBlob from 'react-native-fetch-blob'
const { width : screenWidth, height : screenHeight } = Dimensions.get('window');

export default function App() {
  const pdfScannerElement = useRef(null)
  const [data, setData] = useState({})
  const [invoiceSelected, setInvoiceSelected] = useState(true)
  const [receiptSelected, setReceiptSelected] = useState(false)
  const [result, setResult] = useState({})

  function handleBackToScan() {
  	setData({})
  	setResult({})
  }
  function handleOnPictureTaken(data){
  	setData(data);
  	console.log("data", data);
    console.log("at picture taken handler");
  	RNFetchBlob.fetch('POST', 'http://192.168.43.131:5000/classify', {'Content-Type' : 'application/octet-stream'}, 
    RNFetchBlob.wrap(data.croppedImage)).then(res=>res.json())
   .then(res=>{setResult(res["predictions"][0]);
   	console.log("predictions",res["predictions"][0])
     })
   .catch((err) => {
  	console.log("err",err)
   });
  }

  renderOverlayView = () => {
    const closeImageStyle = data.croppedImage ? styles.closeImage : { ...styles.closeImage, ...{ tintColor: '#3f3f3f' } };
    return <View style={styles.bottomOverlay}>
      <View style={styles.topOverlayContainer}>
        <TouchableOpacity onPress={() => {
          setInvoiceSelected(true)
          setReceiptSelected(false)
        }} style={{flex:1, height: 60, backgroundColor:invoiceSelected ? "grey" : "transparent"}}>
          <Text style={styles.textStyle}>{"Invoice"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          setInvoiceSelected(false)
          setReceiptSelected(true)
        }} style={{flex:1, height: 60, backgroundColor: receiptSelected ? "grey" : "transparent"}}>
          <Text style={styles.textStyle}>{"Receipt"}</Text>
        </TouchableOpacity>
        <Text style={{...styles.textStyle, ...{marginTop: 0}}}>{result.prob ? result.prob + "%" : ""}</Text>
      </View>
      <TouchableOpacity activeOpacity={data.croppedImage ? 0.5 : 1} onPress={() => {
        data.croppedImage && handleBackToScan()
      }}>
        <Image
          resizeMode='contain'
          source={require('./close.png')}
          style={closeImageStyle}
        />
    </TouchableOpacity>
    </View>
  }

  renderOverlayButton = () => {
    return <TouchableOpacity activeOpacity={result.prob > 70 ? 0.5 : 1} onPress={() => {
        result.prob > 70 && {}
      }} style={result.prob > 70 ? styles.overlayButton : {...styles.overlayButton, ...{backgroundColor: "#666666"}}} />
  }

  return (
    <React.Fragment>
    	{data.croppedImage ? <Image style={styles.imageview} source={{ uri: data.croppedImage}} /> :
      <DocumentScanner
      	useBase64={true}
        ref={pdfScannerElement}
        style={styles.scanner}
        onPictureTaken={data => handleOnPictureTaken(data)}
        overlayColor="rgba(255,130,0, 0.7)"
        enableTorch={false}
        quality={0.5}
        detectionCountBeforeCapture={5}
        detectionRefreshRateInMS={50}
      />
      }
      {this.renderOverlayView()}
      {this.renderOverlayButton()}
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  imageview: {
    flex: 1,
    marginBottom: 150,
    aspectRatio: undefined
  },
  scanner: {
    flex: 1,
    aspectRatio: undefined
  },
  bottomOverlay: {
    width: screenWidth,
    position: 'absolute',
    height: 150,
    bottom: 0,
    backgroundColor:"black",
    opacity: 0.5
  },
  overlayButton: {
    position: "absolute",
    bottom: 25,
    left: (screenWidth / 2) - 30,
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: "#e8a217"
  },
  topOverlayContainer: {
    flexDirection:"row", 
    paddingHorizontal: 10, 
    justifyContent:"space-around", 
    alignItems:"flex-start", 
    height: 60
  },
  textStyle: {
    flex:1, 
    color:"white", 
    marginTop: 20, 
    alignSelf:"center",
    textAlign: "center"
  },
  closeImage: {
    width: 35,
    height: 35,
    marginTop: 25,
    marginLeft: 10,
    tintColor: "white"
  },
  preview: {
    flex: 1,
    width: "100%",
    resizeMode: "cover",
  }
})