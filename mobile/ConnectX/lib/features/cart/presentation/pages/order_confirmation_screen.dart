import 'package:flutter/material.dart';
import 'package:korecha/constants.dart';
import 'package:korecha/features/cart/domain/entities/order.dart';
import 'package:korecha/route/route_constants.dart';
import 'package:korecha/components/network_image_with_loader.dart';
import '../pages/orders_screen.dart';

class OrderConfirmationScreen extends StatelessWidget {
  final String orderNumber;
  final double amount;
  final String email;
  final Order_Model order;

  const OrderConfirmationScreen({
    super.key,
    required this.orderNumber,
    required this.amount,
    required this.email,
    required this.order,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(defaultPadding),
            child: Column(
              children: [
                const SizedBox(height: defaultPadding),
                Icon(
                  Icons.check_circle_outline,
                  size: 100,
                  color: Theme.of(context).primaryColor,
                ),
                const SizedBox(height: defaultPadding),
                Text(
                  'Order Confirmed!',
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    color: Theme.of(context).primaryColor,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: defaultPadding),
                Text(
                  'Your order #$orderNumber has been confirmed',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const SizedBox(height: defaultPadding / 2),
                Text(
                  'We\'ll send a confirmation email to $email\nwith the order details.',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.grey[600], height: 1.5),
                ),
                const SizedBox(height: defaultPadding * 2),
                Container(
                  padding: const EdgeInsets.all(defaultPadding),
                  decoration: BoxDecoration(
                    color: Colors.grey[100],
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    children: [
                      _buildInfoRow(
                        context,
                        'Order Number',
                        '#${order.orderNumber}',
                        Icons.receipt_outlined,
                      ),
                      const Divider(height: defaultPadding * 2),
                      _buildInfoRow(
                        context,
                        'Payment Method',
                        order.paymentMethod,
                        Icons.payment,
                      ),
                      const Divider(height: defaultPadding * 2),
                      _buildInfoRow(
                        context,
                        'Delivery Method',
                        order.deliveryMethod,
                        Icons.local_shipping_outlined,
                      ),
                      const Divider(height: defaultPadding * 2),
                      _buildInfoRow(
                        context,
                        'Delivery Address',
                        order.address,
                        Icons.location_on_outlined,
                      ),
                      const Divider(height: defaultPadding * 2),
                      _buildInfoRow(
                        context,
                        'Items',
                        '${order.items.length} items',
                        Icons.shopping_bag_outlined,
                      ),
                      if (order.items.isNotEmpty) ...[
                        const SizedBox(height: defaultPadding),
                        ...order.items.map(
                          (item) => Padding(
                            padding: const EdgeInsets.only(left: 32, bottom: 8),
                            child: Row(
                              children: [
                                SizedBox(
                                  width: 40,
                                  height: 40,
                                  child: NetworkImageWithLoader(
                                    item.coverUrl,
                                    fit: BoxFit.cover,
                                    radius: 8,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        item.name,
                                        style: const TextStyle(
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                      Text(
                                        '${item.quantity}x ${item.price.toStringAsFixed(2)} Birr',
                                        style: TextStyle(
                                          color: Colors.grey[600],
                                          fontSize: 13,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                      const Divider(height: defaultPadding * 2),
                      _buildInfoRow(
                        context,
                        'Total Amount',
                        '${amount.toStringAsFixed(2)} Birr',
                        Icons.payment_outlined,
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: defaultPadding * 2),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pushNamedAndRemoveUntil(
                        context,
                        entryPointScreenRoute,
                        (route) => false,
                        arguments: 2,
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text(
                      'View My Orders',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: defaultPadding),
                TextButton(
                  onPressed: () {
                    Navigator.of(context).pushNamedAndRemoveUntil(
                      entryPointScreenRoute,
                      (route) => false,
                    );
                  },
                  child: const Text('Continue Shopping'),
                ),
                const SizedBox(height: defaultPadding),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildInfoRow(
    BuildContext context,
    String label,
    String value,
    IconData icon,
  ) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Theme.of(context).primaryColor.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, size: 20, color: Theme.of(context).primaryColor),
        ),
        const SizedBox(width: defaultPadding),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: TextStyle(color: Colors.grey[600], fontSize: 12),
              ),
              const SizedBox(height: 4),
              Text(value, style: const TextStyle(fontWeight: FontWeight.w500)),
            ],
          ),
        ),
      ],
    );
  }
}
