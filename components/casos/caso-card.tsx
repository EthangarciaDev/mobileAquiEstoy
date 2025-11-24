import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Caso } from '@/types';

interface CasoCardProps {
  caso: Caso;
  onPress: () => void;
}

export function CasoCard({ caso, onPress }: CasoCardProps) {
  return (
    <View style={styles.productCard}>
      <Image 
        source={{ uri: caso.img }} 
        style={styles.productImage} 
        resizeMode='cover'
      />
      <View style={styles.productInfo}>
        <Text style={styles.cardTitle}>{caso.titulo}</Text>
        <Text style={styles.cardDetailText} numberOfLines={2}>
          {caso.descripcion}
        </Text>
        <Text style={styles.cardTextSmall}>📍 {caso.ubicacion}</Text>

        <TouchableOpacity
          style={styles.btnAction}
          onPress={onPress}
        >
          <Text style={styles.btnActionText}>🤝 Ver Detalle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  productCard: { 
    flexDirection: "row", 
    backgroundColor: "#fff", 
    borderRadius: 8, 
    marginBottom: 15, 
    padding: 10, 
    borderWidth: 1, 
    borderColor: "#BDC3C7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productImage: { 
    width: 100, 
    height: 100, 
    borderRadius: 6, 
    marginRight: 10,
  },
  productInfo: { 
    flex: 1, 
    justifyContent: "space-between", 
  },
  cardTitle: { 
    fontSize: 15, 
    fontWeight: "bold", 
    color: "#2C3E50",
    marginBottom: 2,
  },
  cardDetailText: { 
    fontSize: 12, 
    color: "#555",
    marginBottom: 4,
  },
  cardTextSmall: { 
    fontSize: 11, 
    color: "#777",
    marginBottom: 4,
  },
  btnAction: {
    marginTop: 5,
    backgroundColor: "#2ECC71",
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    alignSelf: 'flex-start', 
  },
  btnActionText: { 
    color: "#fff", 
    fontWeight: "600",
    fontSize: 13,
  },
});
