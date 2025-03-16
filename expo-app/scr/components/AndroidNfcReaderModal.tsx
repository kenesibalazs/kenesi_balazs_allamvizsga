// import React, { useState, useEffect } from 'react';
// import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';

// // Initialize NFC Manager
// NfcManager.start();

// const AndroidNfcReaderModal = ({ visible, onClose }) => {
//     const [nfcMessage, setNfcMessage] = useState('Tap an NFC tag');


//     useEffect(() => {


//         const readNfcTag = async () => {
//             try {
//                 await NfcManager.requestTechnology(NfcTech.Ndef);

//                 const tag = await NfcManager.getTag();
//                 console.log("Full NFC Tag Data:", JSON.stringify(tag, null, 2));

//                 if (tag.ndefMessage) {
//                     let text = Ndef.text.decodePayload(new Uint8Array(tag.ndefMessage[0].payload));
//                     console.log("✅ NDEF Text Read:", text);
//                     alert("NFC Message: " + text);
//                 } else {
//                     console.log("⚠️ No NDEF Data Found");
//                 }
//             } catch (error) {
//                 console.error("🚨 NFC Read Error:", error);
//             } finally {
//                 await NfcManager.cancelTechnologyRequest();
//             }
//         };


//         if (visible) {
//             readNfcTag();
//         }

//         return () => {
//             NfcManager.cancelTechnologyRequest().catch(() => { });
//         };
//     }, [visible]);

//     const sendApduCommand = async () => {
//         try {
//             // 🔹 Example APDU Command (Get Tag Version)
//             const apduCommand = [0x00, 0xA4, 0x04, 0x00, 0x00]; // Select Application Command
//             let response = await NfcManager.transceive(apduCommand);
//             console.log("Raw APDU Response:", response);
//             return response.toString();
//         } catch (error) {
//             console.error("APDU Command Error:", error);
//             return "APDU Command Error";
//         }
//     };

//     return (
//         <Modal visible={visible} transparent animationType="slide">
//             <View style={styles.modalContainer}>
//                 <View style={styles.modalContent}>
//                     <Text style={styles.title}>NFC Reader</Text>
//                     <Text style={styles.message}>{nfcMessage}</Text>
//                     <TouchableOpacity style={styles.closeButton} onPress={onClose}>
//                         <Text style={styles.closeButtonText}>Close</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         </Modal>
//     );
// };

// const styles = StyleSheet.create({
//     modalContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0,0,0,0.5)',
//     },
//     modalContent: {
//         width: 300,
//         padding: 20,
//         backgroundColor: 'white',
//         borderRadius: 10,
//         alignItems: 'center',
//     },
//     title: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         marginBottom: 10,
//     },
//     message: {
//         fontSize: 16,
//         textAlign: 'center',
//         marginBottom: 20,
//     },
//     closeButton: {
//         backgroundColor: '#007bff',
//         paddingVertical: 10,
//         paddingHorizontal: 20,
//         borderRadius: 5,
//     },
//     closeButtonText: {
//         color: 'white',
//         fontSize: 16,
//     },
// });

// export default AndroidNfcReaderModal;
