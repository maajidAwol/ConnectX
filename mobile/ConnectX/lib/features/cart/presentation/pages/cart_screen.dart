import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:korecha/features/cart/data/models/cod_order_request_model.dart';
import 'package:korecha/features/cart/domain/entities/order.dart';
import 'package:korecha/features/cart/domain/entities/payment_method.dart';
import 'package:korecha/features/cart/presentation/state/order/bloc/order_bloc.dart';
import 'package:korecha/features/cart/presentation/widgets/cart_button.dart';
import '../state/cart/bloc/cart_bloc.dart';
import '../../domain/entities/cart_item.dart';
import '../widgets/cart_item_card.dart';
import 'address_selection_screen.dart';
import 'delivery_method_screen.dart';
import 'payment_method_screen.dart';
import 'order_confirmation_screen.dart';
import 'package:korecha/features/cart/data/models/chapa_order_request_model.dart'
    as chapa;
import 'package:korecha/features/cart/data/models/cod_order_request_model.dart'
    as cod;
import '../widgets/cart_shimmer.dart';

class CartScreen extends StatefulWidget {
  const CartScreen({super.key});

  // Extracted app bar builder to be used by the parent widget.
  static PreferredSizeWidget buildCartAppBar(BuildContext context) {
    return AppBar(
      title: const Text('Cart'),
      actions: [
        BlocBuilder<CartBloc, CartState>(
          builder: (context, state) {
            if (state is CartLoaded && state.items.isNotEmpty) {
              return IconButton(
                icon: const Icon(Icons.delete_outline),
                onPressed: () {
                  showDialog(
                    context: context,
                    builder:
                        (context) => AlertDialog(
                          title: const Text('Clear Cart'),
                          content: const Text(
                            'Are you sure you want to clear your cart?',
                          ),
                          actions: [
                            TextButton(
                              child: const Text('Cancel'),
                              onPressed: () => Navigator.pop(context),
                            ),
                            TextButton(
                              child: const Text('Clear'),
                              onPressed: () {
                                context.read<CartBloc>().add(ClearCart());
                                Navigator.pop(context);
                              },
                            ),
                          ],
                        ),
                  );
                },
              );
            }
            return const SizedBox.shrink();
          },
        ),
      ],
    );
  }

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  Set<String> selectedItems = {};
  bool selectMode = true;

  @override
  void initState() {
    super.initState();
    context.read<CartBloc>().add(LoadCart());
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Select all items by default when cart is loaded
    final state = context.read<CartBloc>().state;
    if (state is CartLoaded) {
      setState(() {
        selectedItems = state.items.map((item) => item.id).toSet();
      });
    }
  }

  double _calculateSelectedTotal(List<CartItem> items) {
    return items
        .where((item) => selectedItems.contains(item.id))
        .fold(0, (sum, item) => sum + (item.price * item.quantity));
  }

  void _toggleItemSelection(String itemId) {
    setState(() {
      if (selectedItems.contains(itemId)) {
        selectedItems.remove(itemId);
        if (selectedItems.isEmpty) {
          selectMode = false;
        }
      } else {
        selectedItems.add(itemId);
        selectMode = true;
      }
    });
  }

  void _removeSelectedFromCart() {
    for (var itemId in selectedItems) {
      context.read<CartBloc>().add(RemoveFromCart(itemId));
    }
    selectedItems.clear();
    selectMode = false;
  }

  void _showSelectionWarning() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Please select at least one item to checkout'),
        duration: Duration(seconds: 2),
      ),
    );
  }

  void _handleCheckout(
    BuildContext context,
    List<CartItem> items,
    double total,
  ) {
    if (selectedItems.isEmpty) {
      _showSelectionWarning();
      return;
    }
    for (var item in items) {
    
    }

    final itemsToCheckout =
        items.where((item) => selectedItems.contains(item.id)).toList();

    // Start checkout flow
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const AddressSelectionScreen()),
    ).then((address) {
      if (address == null || !context.mounted) return;

      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => const DeliveryMethodScreen()),
      ).then((deliveryMethod) {
        if (deliveryMethod == null || !context.mounted) return;

        final selectedTotal = _calculateSelectedTotal(items);

        Navigator.push(
          context,
          MaterialPageRoute(
            builder:
                (context) => PaymentMethodScreen(
                  amount: selectedTotal,
                  items: itemsToCheckout,
                ),
          ),
        ).then((paymentMethod) {
          if (paymentMethod == null || !context.mounted) return;

          // Create order
          final order = chapa.ChapaOrderModel(
            payment: chapa.Payment(
              amount: selectedTotal,
              txRef: 'ORD${DateTime.now().millisecondsSinceEpoch}',
              transactionId: DateTime.now().millisecondsSinceEpoch.toString(),
            ),
            status: 'pending',
            amount: selectedTotal,
            currency: 'ETB',
            items:
                itemsToCheckout
                    .map(
                      (item) => chapa.Item(
                        id: item.id,
                        quantity: item.quantity,
                        price: item.price,
                        name: item.name,
                        coverUrl: item.coverUrl,
                      ),
                    )
                    .toList(),
            billing: chapa.Billing(
              name:
                  address.fullAddress.split(
                    ',',
                  )[0], // Use part of address as name
              email: "customer@example.com", // Default email
              phoneNumber: "N/A", // Default phone
              fullAddress: address.fullAddress,
              company: "",
              addressType: address.type,
            ),
            shipping: chapa.Shipping(
              address: address.fullAddress,
              phoneNumber: "N/A", // Default phone
              method: chapa.ShippingMethod(
                label: deliveryMethod.name,
                description: deliveryMethod.description,
                value: deliveryMethod.fee,
              ),
            ),
            delivery: chapa.Delivery(
              method: deliveryMethod.name,
              fee: deliveryMethod.fee,
            ),
            discount: 0.0,
            total: selectedTotal + deliveryMethod.fee,
            subtotal: selectedTotal,
          );
          final cashOnDeliveryOrder = cod.CashOnDeliveryOrder(
            items:
                itemsToCheckout
                    .map(
                      (item) => CodItem(
                        id: item.id,
                        quantity: item.quantity,
                        price: item.price,
                        name: item.name,
                        coverUrl: item.coverUrl,
                        sku: "item.sku",
                        vendorId: "item.vendorId",
                      ),
                    )
                    .toList(),
            status: "pending",
            total: selectedTotal + deliveryMethod.fee,
            subtotal: selectedTotal,
            billing: cod.CodBilling(
              name:
                  address.fullAddress.split(
                    ',',
                  )[0], // Use part of address as name
              email: "customer@example.com", // Default email
              phoneNumber: "N/A", // Default phone
              fullAddress: address.fullAddress,
            ),
            shipping: cod.CodShipping(
              address: address.fullAddress,
              method: cod.CodShippingMethod(
                id: deliveryMethod.id,
                label: deliveryMethod.name,
                description: deliveryMethod.description,
                value: deliveryMethod.fee,
              ),
            ),
            payment: cod.CodPayment(
              method: "cod",
              currency: "ETB",
              amount: selectedTotal,
            ),
            notes: "",
            source: "mobile",
          );

          // Create the actual order based on payment method
          final PaymentMethod selectedPaymentMethod =
              paymentMethod['method'] as PaymentMethod;
          if (selectedPaymentMethod.isChapa) {
            context.read<OrderBloc>().add(CreateChapaOrder(order));
          } else if (selectedPaymentMethod.isCashOnDelivery) {
            context.read<OrderBloc>().add(
              CreateCashOnDeliveryOrder(cashOnDeliveryOrder),
            );
          }

          // Remove checked out items from cart
          context.read<CartBloc>().add(ClearCart());

          // Navigate to order confirmation
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder:
                  (context) => OrderConfirmationScreen(
                    orderNumber: 'ORD${DateTime.now().millisecondsSinceEpoch}',
                    amount: order.amount,
                    email: 'john.davids@gmail.com',
                    order: Order_Model(
                      subtotal: selectedTotal,
                      paymentMethod: selectedPaymentMethod.name,
                      id: "1",
                      orderNumber: order.payment.txRef,
                      amount: order.amount,
                      date: DateTime.now(),
                      status: order.status,
                      items: itemsToCheckout,
                      deliveryMethod: deliveryMethod.name,
                      address: address.fullAddress,
                    ),
                  ),
            ),
          );
        });
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      bottomNavigationBar: BlocBuilder<CartBloc, CartState>(
        builder: (context, state) {
          if (state is CartLoaded && state.items.isNotEmpty) {
            final selectedTotal =
                selectedItems.isEmpty
                    ? 0.0
                    : _calculateSelectedTotal(state.items);
            return CartButton(
              price: selectedTotal,
              title: "Checkout Selected",
              subTitle:
                  selectedItems.isEmpty
                      ? "No items selected"
                      : "${selectedItems.length} items selected",
              press: () {
                if (selectedItems.isEmpty) {
                  _showSelectionWarning();
                } else {
                  _handleCheckout(context, state.items, selectedTotal);
                }
              },
            );
          }
          return const SizedBox.shrink();
        },
      ),
      body: BlocBuilder<CartBloc, CartState>(
        builder: (context, state) {
          if (state is CartLoading) {
            return const CartShimmer();
          }
          if (state is CartError) {
            return Center(child: Text(state.message));
          }
          if (state is CartLoaded) {
            if (state.items.isEmpty) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.shopping_cart_outlined,
                      size: 100,
                      color: Colors.grey[400],
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Your cart is empty',
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Add items to start shopping',
                      style: Theme.of(
                        context,
                      ).textTheme.bodyLarge?.copyWith(color: Colors.grey[600]),
                    ),
                  ],
                ),
              );
            }
            return Column(
              children: [
                if (state.items.length > 1)
                  Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 8,
                    ),
                    child: Container(
                      decoration: BoxDecoration(
                        color: Theme.of(context).primaryColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Material(
                        color: Colors.transparent,
                        child: InkWell(
                          borderRadius: BorderRadius.circular(8),
                          onTap: () {
                            setState(() {
                              if (selectedItems.length == state.items.length) {
                                selectedItems.clear();
                              } else {
                                selectedItems =
                                    state.items.map((item) => item.id).toSet();
                              }
                            });
                          },
                          child: Padding(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 8,
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  selectedItems.length == state.items.length
                                      ? Icons.check_circle
                                      : Icons.check_circle_outline,
                                  size: 20,
                                  color: Theme.of(context).primaryColor,
                                ),
                                const SizedBox(width: 8),
                                Text(
                                  selectedItems.length == state.items.length
                                      ? 'Deselect All'
                                      : 'Select All',
                                  style: TextStyle(
                                    color: Theme.of(context).primaryColor,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                Expanded(
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: state.items.length,
                    itemBuilder: (context, index) {
                      final item = state.items[index];
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 16),
                        child: Stack(
                          children: [
                            CartItemCard(
                              item: item,
                              onQuantityChanged: (quantity) {
                                if (quantity == 0) {
                                  context.read<CartBloc>().add(
                                    RemoveFromCart(item.id),
                                  );
                                  selectedItems.remove(item.id);
                                } else {
                                  context.read<CartBloc>().add(
                                    UpdateCartItem(
                                      item.copyWith(quantity: quantity),
                                    ),
                                  );
                                }
                              },
                              onRemove: () {
                                context.read<CartBloc>().add(
                                  RemoveFromCart(item.id),
                                );
                                selectedItems.remove(item.id);
                              },
                            ),
                            Positioned(
                              top: 8,
                              left: 8,
                              child: InkWell(
                                onTap: () => _toggleItemSelection(item.id),
                                child: Container(
                                  padding: const EdgeInsets.all(4),
                                  decoration: BoxDecoration(
                                    color:
                                        selectedItems.contains(item.id)
                                            ? Theme.of(context).primaryColor
                                            : Colors.grey[200],
                                    shape: BoxShape.circle,
                                  ),
                                  child: Icon(
                                    Icons.check,
                                    size: 16,
                                    color:
                                        selectedItems.contains(item.id)
                                            ? Colors.white
                                            : Colors.grey[400],
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
              ],
            );
          }
          return const SizedBox.shrink();
        },
      ),
    );
  }
}
