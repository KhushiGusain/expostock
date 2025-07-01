import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '@/constants/Colors';
import { FontFamily } from '@/constants/Fonts';
import { useWatchlist, Stock, Watchlist } from '@/contexts/WatchlistContext';

interface WatchlistModalProps {
  visible: boolean;
  onClose: () => void;
  stock: Stock;
}

export default function WatchlistModal({ visible, onClose, stock }: WatchlistModalProps) {
  const { watchlists, addWatchlist, addStockToWatchlist, removeStockFromWatchlist } = useWatchlist();
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState('');

  const handleCreateWatchlist = () => {
    if (newWatchlistName.trim()) {
      const newWatchlistId = addWatchlist(newWatchlistName.trim());
      addStockToWatchlist(newWatchlistId, stock);
      setNewWatchlistName('');
      setShowCreateNew(false);
      onClose();
    } else {
      Alert.alert('Error', 'Please enter a valid watchlist name');
    }
  };

  const handleSelectWatchlist = (watchlist: Watchlist) => {
    const isStockInWatchlist = watchlist.stocks.some(s => s.symbol === stock.symbol);
    
    if (isStockInWatchlist) {
      removeStockFromWatchlist(watchlist.id, stock.symbol);
    } else {
      addStockToWatchlist(watchlist.id, stock);
    }
    onClose();
  };

  const renderWatchlistItem = ({ item }: { item: Watchlist }) => {
    const isStockInWatchlist = item.stocks.some(s => s.symbol === stock.symbol);
    
    return (
      <TouchableOpacity
        style={[styles.watchlistItem, isStockInWatchlist && styles.watchlistItemSelected]}
        onPress={() => handleSelectWatchlist(item)}
      >
        <View style={styles.watchlistInfo}>
          <Text style={[styles.watchlistName, isStockInWatchlist && styles.watchlistNameSelected]}>
            {item.name}
          </Text>
          <Text style={[styles.stockCount, isStockInWatchlist && styles.stockCountSelected]}>
            {item.stocks.length} {item.stocks.length === 1 ? 'stock' : 'stocks'}
          </Text>
        </View>
        <View style={[styles.checkboxContainer, isStockInWatchlist && styles.checkboxSelected]}>
          {isStockInWatchlist && (
            <MaterialIcons name="check" size={16} color="white" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add to Watchlist</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color={Colors.light.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Stock Info */}
          <View style={styles.stockInfo}>
            <Text style={styles.stockSymbol}>{stock.symbol}</Text>
            <Text style={styles.stockName}>{stock.name}</Text>
          </View>

          {/* Create New Watchlist Section */}
          {showCreateNew ? (
            <View style={styles.createNewSection}>
              <Text style={styles.sectionTitle}>Create New Watchlist</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter watchlist name"
                value={newWatchlistName}
                onChangeText={setNewWatchlistName}
                autoFocus
              />
              <View style={styles.createButtonsContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowCreateNew(false);
                    setNewWatchlistName('');
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={handleCreateWatchlist}
                >
                  <Text style={styles.createButtonText}>Create & Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              {/* Existing Watchlists */}
              {watchlists.length > 0 && (
                <View style={styles.watchlistsSection}>
                  <Text style={styles.sectionTitle}>Select Watchlist</Text>
                  <FlatList
                    data={watchlists}
                    keyExtractor={(item) => item.id}
                    renderItem={renderWatchlistItem}
                    showsVerticalScrollIndicator={false}
                    style={styles.watchlistsList}
                  />
                </View>
              )}

              {/* Create New Button */}
              <TouchableOpacity
                style={styles.createNewButton}
                onPress={() => setShowCreateNew(true)}
              >
                <MaterialIcons name="add" size={20} color="#11B981" />
                <Text style={styles.createNewButtonText}>Create New Watchlist</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.light.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E6F4F8',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: FontFamily.bold,
    color: Colors.light.textPrimary,
  },
  stockInfo: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E6F4F8',
  },
  stockSymbol: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    color: Colors.light.textPrimary,
  },
  stockName: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    color: Colors.light.textPrimary,
    marginBottom: 12,
  },
  watchlistsSection: {
    paddingTop: 20,
    flex: 1,
  },
  watchlistsList: {
    maxHeight: 200,
  },
  watchlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#F8F9FA',
    marginBottom: 8,
  },
  watchlistItemSelected: {
    backgroundColor: 'rgba(17, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: '#11B981',
  },
  watchlistInfo: {
    flex: 1,
  },
  watchlistName: {
    fontSize: 16,
    fontFamily: FontFamily.regular,
    color: Colors.light.textPrimary,
  },
  watchlistNameSelected: {
    fontFamily: FontFamily.bold,
    color: '#11B981',
  },
  stockCount: {
    fontSize: 12,
    fontFamily: FontFamily.regular,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  stockCountSelected: {
    color: '#11B981',
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E6F4F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#11B981',
    borderColor: '#11B981',
  },
  createNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#11B981',
    borderStyle: 'dashed',
    marginTop: 16,
  },
  createNewButtonText: {
    fontSize: 16,
    fontFamily: FontFamily.regular,
    color: '#11B981',
    marginLeft: 8,
  },
  createNewSection: {
    paddingTop: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E6F4F8',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: FontFamily.regular,
    color: Colors.light.textPrimary,
    marginBottom: 16,
  },
  createButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E6F4F8',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: FontFamily.regular,
    color: Colors.light.textSecondary,
  },
  createButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#11B981',
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    color: 'white',
  },
}); 