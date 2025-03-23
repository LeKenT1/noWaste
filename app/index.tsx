import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

export default function HomeScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    source={require('../assets/images/logogo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.buttonsContainer}>
                <Link href="/camera" asChild>
                    <TouchableOpacity style={styles.iconButton}>
                        <View style={styles.iconSquare}>
                            <Image
                                source={require('../assets/images/scan.png')}
                                style={styles.imgButton}
                                resizeMode="contain"
                            />
                        </View>
                    </TouchableOpacity>
                </Link>

                <Link href="/food-name" asChild>
                    <TouchableOpacity style={styles.iconButton}>
                        <View style={styles.iconSquare}>
                            <Image
                                source={require('../assets/images/pen.png')}
                                style={styles.imgButton}
                                resizeMode="contain"
                            />
                        </View>
                    </TouchableOpacity>
                </Link>

                <Link href="/list" asChild>
                    <TouchableOpacity style={styles.listButton}>
                        <View style={styles.littleIconSquare}>
                            <Image
                                source={require('../assets/images/list.png')}
                                style={styles.imgList}
                                resizeMode="contain"
                            />
                        </View>
                    </TouchableOpacity>
                </Link>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'white',
        paddingHorizontal: 20,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 300,
        height: 150,
        tintColor: '#4EBEB3',
    },
    logoText: {
        fontSize: 28,
        fontWeight: '500',
        color: '#4EBEB3',
        marginLeft: 10,
    },
    imgButton: {
        width: 320,
        height: 320,
        tintColor: 'white',
    },
    imgList: {
        width: 70,
        height: 70,
        tintColor: 'white',
    },
    buttonsContainer: {
        alignItems: 'center',
        width: '100%',
    },
    iconButton: {
        marginBottom: 30,
    },
    iconSquare: {
        width: 180,
        height: 180,
        backgroundColor: '#56b8b4',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    littleIconSquare: {
        width: 100,
        height: 100,
        backgroundColor: '#56b8b4',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanIcon: {
        width: 50,
        height: 50,
        position: 'relative',
    },
    scanCorner: {
        position: 'absolute',
        width: 15,
        height: 15,
        borderColor: 'white',
        borderTopWidth: 3,
        borderLeftWidth: 3,
        top: 0,
        left: 0,
    },
    topRight: {
        borderLeftWidth: 0,
        borderRightWidth: 3,
        right: 0,
        left: undefined,
    },
    bottomLeft: {
        borderTopWidth: 0,
        borderBottomWidth: 3,
        bottom: 0,
        top: undefined,
    },
    bottomRight: {
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 3,
        borderBottomWidth: 3,
        bottom: 0,
        right: 0,
        top: undefined,
        left: undefined,
    },
    scanMiddle: {
        position: 'absolute',
        width: 30,
        height: 3,
        backgroundColor: 'white',
        top: '50%',
        left: 10,
    },
    penIcon: {
        width: 40,
        height: 40,
        transform: [{ rotate: '45deg' }],
    },
    penBody: {
        width: 35,
        height: 8,
        backgroundColor: 'white',
        borderRadius: 4,
        position: 'absolute',
        top: 10,
        left: 0,
    },
    penTip: {
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderTopWidth: 8,
        borderRightWidth: 8,
        borderBottomWidth: 8,
        borderLeftWidth: 0,
        borderTopColor: 'transparent',
        borderRightColor: 'white',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
        position: 'absolute',
        left: -5,
        top: 10,
    },
    listButton: {
        marginTop: 20,
    },
    listIcon: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    listLine: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    listDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4EBEB3',
        marginRight: 5,
    },
    listBar: {
        width: 25,
        height: 2,
        backgroundColor: '#4EBEB3',
    },
});