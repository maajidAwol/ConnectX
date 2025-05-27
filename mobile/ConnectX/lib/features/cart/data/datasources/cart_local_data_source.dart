import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/cart_item_model.dart';

abstract class CartLocalDataSource {
  Future<List<CartItemModel>> getCartItems();
  Future<void> addCartItem(CartItemModel item);
  Future<void> updateCartItem(CartItemModel item);
  Future<void> removeCartItem(String id);
  Future<void> clearCart();
  
}

const CACHED_CART_ITEMS = 'CACHED_CART_ITEMS';

class CartLocalDataSourceImpl implements CartLocalDataSource {
  final SharedPreferences sharedPreferences;

  CartLocalDataSourceImpl({required this.sharedPreferences});

  @override
  Future<List<CartItemModel>> getCartItems() async {
    final jsonString = sharedPreferences.getString(CACHED_CART_ITEMS);
    print('CACHED_CART_ITEMS');
    print(jsonString);
    try {
      if (jsonString != null) {
        final List<dynamic> jsonList = json.decode(jsonString);
        return jsonList.map((item) => CartItemModel.fromJson(item)).toList();
      }
    } catch (e) {
      print(e);
    }
    return [];
  }

  @override
  Future<void> addCartItem(CartItemModel item) async {
    final currentItems = await getCartItems();
    final existingItemIndex = currentItems.indexWhere((i) => i.id == item.id);

    if (existingItemIndex >= 0) {
      currentItems[existingItemIndex] = item;
    } else {
      currentItems.add(item);
    }

    await _saveCartItems(currentItems);
  }

  @override
  Future<void> updateCartItem(CartItemModel item) async {
    final currentItems = await getCartItems();
    final index = currentItems.indexWhere((i) => i.id == item.id);

    if (index >= 0) {
      currentItems[index] = item;
      await _saveCartItems(currentItems);
    }
  }

  @override
  Future<void> removeCartItem(String id) async {
    final currentItems = await getCartItems();
    currentItems.removeWhere((item) => item.id == id);
    await _saveCartItems(currentItems);
  }

  @override
  Future<void> clearCart() async {
    await sharedPreferences.remove(CACHED_CART_ITEMS);
  }

  Future<void> _saveCartItems(List<CartItemModel> items) async {
    final jsonString = json.encode(items.map((item) => item.toJson()).toList());
    await sharedPreferences.setString(CACHED_CART_ITEMS, jsonString);
  }
}
