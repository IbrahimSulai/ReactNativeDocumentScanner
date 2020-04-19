/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StyleSheet,
  View
} from 'react-native';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';

import DocumentScanner from "@woonivers/react-native-document-scanner";

const handleOnPictureTaken = () => {

}

const App: () => React$Node = () => {
  return (
      <View style={styles.container}>
          <DocumentScanner
            style={styles.scanner}
            onPictureTaken={() => handleOnPictureTaken}
            overlayColor="rgba(255,130,0, 0.7)"
            enableTorch={false}
            quality={0.5}
            detectionCountBeforeCapture={5}
            detectionRefreshRateInMS={50}
          />
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1
  },
  scanner: {
    flex:1
  }
});

export default App;
