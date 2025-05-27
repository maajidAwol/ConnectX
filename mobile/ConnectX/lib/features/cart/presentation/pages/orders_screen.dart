import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:korecha/constants.dart';
import 'package:korecha/features/cart/data/models/my_orders_model.dart';
import 'package:korecha/features/cart/presentation/state/order/bloc/order_bloc.dart';
import 'package:korecha/features/cart/presentation/widgets/order_card.dart';
import 'package:korecha/features/cart/presentation/widgets/order_details_sheet_v2.dart';
import 'package:korecha/features/cart/presentation/widgets/orders_shimmer.dart';

// class Order {
//   final String id;
//   final String orderNumber;
//   final double amount;
//   final DateTime date;
//   final String status;
//   final List<CartItem> items;
//   final String deliveryMethod;
//   final String address;
//   final String? invoiceNumber;
//   final double? shippingFee;
//   final double? tax;
//   final double subtotal;
//   final String paymentMethod;
//   final String? txRef;

//   Order({
//     required this.id,
//     required this.orderNumber,
//     required this.amount,
//     required this.date,
//     required this.status,
//     required this.items,
//     required this.deliveryMethod,
//     required this.address,
//     this.invoiceNumber,
//     this.shippingFee,
//     this.tax,
//     this.subtotal = 0.0,
//     this.paymentMethod = 'unknown',
//     this.txRef,
//   });
// }

class OrdersScreen extends StatefulWidget {
  const OrdersScreen({super.key});

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> {
  @override
  void initState() {
    context.read<OrderBloc>().add(const LoadOrders());
    super.initState();
  }

  void _showOrderDetails(BuildContext context, OrderItemModel order) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => OrderDetailsSheetV2(orderId: order.id),
    );
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<OrderBloc, OrderState>(
      builder: (context, state) {
        // Handle different states while preserving orders list
        MyOrdersModel? myOrders;
        bool isLoading = false;
        String? errorMessage;

        if (state is OrderLoading) {
          isLoading = true;
        } else if (state is OrderFailure) {
          errorMessage = state.message;
        } else if (state is OrderLoaded) {
          myOrders = state.myOrders;
        } else if (state is OrderDetailsLoading) {
          myOrders = state.existingOrders;
        } else if (state is OrderDetailsLoaded) {
          myOrders = state.existingOrders;
        } else if (state is OrderDetailsFailure) {
          myOrders = state.existingOrders;
          // Don't show error for order details failure, just preserve the list
        }

        if (isLoading && myOrders == null) {
          return const Scaffold(body: OrdersShimmer());
        }

        if (errorMessage != null && myOrders == null) {
          return Scaffold(
            body: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.error_outline, size: 60, color: Colors.red[300]),
                  const SizedBox(height: 16),
                  Text(errorMessage),
                ],
              ),
            ),
          );
        }

        if (myOrders != null) {
          final orders = myOrders.orders;

          return Scaffold(
            appBar: AppBar(
              surfaceTintColor: Theme.of(context).scaffoldBackgroundColor,
              title: const Text('My Orders'),
              elevation: 0,
            ),
            body:
                orders.isEmpty
                    ? _buildEmptyState()
                    : ListView.builder(
                      padding: const EdgeInsets.all(defaultPadding),
                      itemCount: orders.length,
                      itemBuilder: (context, index) {
                        final order = orders[index];
                        return OrderCard(
                          order: order,
                          onTap: () => _showOrderDetails(context, order),
                        );
                      },
                    ),
          );
        }

        return const SizedBox.shrink();
      },
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.shopping_bag_outlined, size: 100, color: Colors.grey[400]),
          const SizedBox(height: defaultPadding),
          Text('No orders yet', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: defaultPadding / 2),
          Text(
            'Your order history will appear here',
            style: Theme.of(
              context,
            ).textTheme.bodyLarge?.copyWith(color: Colors.grey[600]),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusChip(String status) {
    final color = _getStatusColor(status);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withOpacity(0.5)),
      ),
      child: Text(
        status.toUpperCase(),
        style: TextStyle(
          color: color,
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return Colors.green;
      case 'in transit':
      case 'processing':
        return Colors.blue;
      case 'pending':
        return Colors.orange;
      case 'cancelled':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  String _formatDate(String dateStr) {
    try {
      final date = DateTime.parse(dateStr);
      return '${date.day}/${date.month}/${date.year}';
    } catch (e) {
      return dateStr;
    }
  }
}
