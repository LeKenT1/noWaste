import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera, BarCodeType } from 'expo-camera';
import { useRouter } from 'expo-router';

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    // Navigate to the FoodName screen with the scanned data
    router.push({
      pathname: '/food-name',
      params: { scannedData: data }
    });
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeType.ean13],
        }}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.overlay}>
          <View style={styles.scanArea}>
            {/* Barcode scanning area */}
          </View>
          <View style={styles.cameraControls}>
            <View style={styles.cameraModesContainer}>
              <Text style={styles.cameraModeInactive}>AUTOMATIQUE</Text>
              <Text style={styles.cameraModeInactive}>VIDÉO</Text>
              <Text style={styles.cameraModeActive}>PHOTO</Text>
              <Text style={styles.cameraModeInactive}>PORTRAIT</Text>
              <Text style={styles.cameraModeInactive}>PANO</Text>
            </View>
            <View style={styles.shutterContainer}>
              <TouchableOpacity
                style={styles.shutterButton}
                onPress={() => setScanned(false)}
              >
                <View style={styles.shutterInner} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.flipButton}>
                <View style={styles.flipIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Camera>

      {scanned && (
        <TouchableOpacity
          style={styles.scanAgainButton}
          onPress={() => setScanned(false)}
        >
          <Text style={styles.scanAgainText}>Scan Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraControls: {
    height: 120,
    backgroundColor: 'black',
    width: '100%',
  },
  cameraModesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  cameraModeInactive: {
    color: '#888',
    fontSize: 12,
  },
  cameraModeActive: {
    color: '#FFD700',
    fontSize: 12,
  },
  shutterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  shutterButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterInner: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: 'white',
  },
  flipButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 30,
  },
  flipIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
  scanAgainButton: {
    position: 'absolute',
    bottom: 140,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  scanAgainText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
