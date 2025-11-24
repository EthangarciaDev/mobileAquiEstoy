import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { SOCIAL_ICONS, CONTACT_EMAIL } from '@/constants/mockData';

export function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerLeft}>©️ Derechos reservados</Text>
      <View style={styles.footerRight}>
        <Image source={{ uri: SOCIAL_ICONS.facebook }} style={styles.icon} />
        <Image source={{ uri: SOCIAL_ICONS.instagram }} style={styles.icon} />
        <Image source={{ uri: SOCIAL_ICONS.twitter }} style={styles.icon} />
        <Text style={styles.email}>{CONTACT_EMAIL}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    height: 56,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ddd',
    backgroundColor: '#fafafa',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  footerLeft: { 
    fontSize: 12, 
    color: '#444' 
  },
  footerRight: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  icon: { 
    width: 22, 
    height: 22, 
    marginHorizontal: 6, 
    resizeMode: 'contain' 
  },
  email: { 
    marginLeft: 8, 
    fontSize: 12, 
    color: '#333' 
  },
});
