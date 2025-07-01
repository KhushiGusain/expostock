import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  Modal
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '@/constants/Colors';
import { FontFamily } from '@/constants/Fonts';
import { useWatchlist, Watchlist } from '@/contexts/WatchlistContext';
import { router } from 'expo-router';

export default function WatchlistScreen() {
  const { watchlists, addWatchlist, removeWatchlist } = useWatchlist();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState('');


  const handleCreateWatchlist = () => {
    if (newWatchlistName.trim()) {
      addWatchlist(newWatchlistName.trim());
      setNewWatchlistName('');
      setCreateModalVisible(false);
    } else {
      Alert.alert('Error', 'Please enter a valid watchlist name');
    }
  };

  const handleDeleteWatchlist = (watchlistId: string, watchlistName: string) => {
    Alert.alert(
      'Delete Watchlist',
      `Are you sure you want to delete "${watchlistName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => removeWatchlist(watchlistId)
        }
      ]
    );
  };



  const navigateToWatchlist = (watchlist: Watchlist) => {
    router.push(`/watchlist-details?id=${watchlist.id}&name=${encodeURIComponent(watchlist.name)}`);
  };

  const renderWatchlist = ({ item: watchlist }: { item: Watchlist }) => {
    return (
      <TouchableOpacity 
        style={styles.watchlistCard}
        onPress={() => navigateToWatchlist(watchlist)}
        activeOpacity={0.7}
      >
        <View style={styles.watchlistHeader}>
          <View style={styles.watchlistIconContainer}>
            <MaterialIcons name="bookmark" size={24} color="#11B981" />
          </View>
          <View style={styles.watchlistTitleSection}>
            <Text style={styles.watchlistName}>{watchlist.name}</Text>
            <Text style={styles.stockCount}>
              {watchlist.stocks.length} {watchlist.stocks.length === 1 ? 'stock' : 'stocks'}
            </Text>
            <Text style={styles.createdDate}>
              Created {new Date(watchlist.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.watchlistActions}>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={(e) => {
                e.stopPropagation();
                handleDeleteWatchlist(watchlist.id, watchlist.name);
              }}
            >
              <MaterialIcons name="delete-outline" size={20} color={Colors.light.danger} />
            </TouchableOpacity>
            <MaterialIcons 
              name="chevron-right" 
              size={24} 
              color={Colors.light.textSecondary} 
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Watchlists</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setCreateModalVisible(true)}
        >
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {watchlists.length > 0 ? (
        <FlatList
          data={watchlists}
          keyExtractor={(item) => item.id}
          renderItem={renderWatchlist}
          style={styles.watchlistsList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        /* Empty State */
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <MaterialIcons name="bookmark-border" size={64} color={Colors.light.primary} />
          </View>
          <Text style={styles.emptyTitle}>No Watchlists Yet</Text>
          <Text style={styles.emptyDescription}>
            Create your first watchlist to start tracking your favorite stocks.
          </Text>
          <TouchableOpacity 
            style={styles.createFirstButton}
            onPress={() => setCreateModalVisible(true)}
          >
            <Text style={styles.createFirstButtonText}>Create Watchlist</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Create Watchlist Modal */}
      <Modal
        visible={createModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Watchlist</Text>
              <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={Colors.light.textPrimary} />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.textInput}
              placeholder="Enter watchlist name"
              value={newWatchlistName}
              onChangeText={setNewWatchlistName}
              autoFocus
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setCreateModalVisible(false);
                  setNewWatchlistName('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreateWatchlist}
              >
                <Text style={styles.createButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: Colors.light.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: '#E6F4F8',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: FontFamily.bold,
    color: Colors.light.textPrimary,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#11B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  watchlistsList: {
    flex: 1,
  },
  listContent: {
    padding: 20,
  },
  watchlistCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E6F4F8',
  },
  watchlistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  watchlistIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(17, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  watchlistTitleSection: {
    flex: 1,
  },
  watchlistName: {
    fontSize: 18,
    fontFamily: FontFamily.bold,
    color: Colors.light.textPrimary,
  },
  stockCount: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  createdDate: {
    fontSize: 12,
    fontFamily: FontFamily.regular,
    color: '#9CA3AF',
    marginTop: 2,
  },
  watchlistActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteButton: {
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: FontFamily.bold,
    color: Colors.light.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    fontFamily: FontFamily.regular,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  createFirstButton: {
    backgroundColor: '#11B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createFirstButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: FontFamily.bold,
  },
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
  textInput: {
    borderWidth: 1,
    borderColor: '#E6F4F8',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: FontFamily.regular,
    color: Colors.light.textPrimary,
    marginTop: 20,
    marginBottom: 20,
  },
  modalButtons: {
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
