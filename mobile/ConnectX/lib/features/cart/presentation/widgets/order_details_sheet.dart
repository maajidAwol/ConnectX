import 'package:flutter/material.dart';
import 'package:korecha/components/network_image_with_loader.dart';
import 'package:korecha/constants.dart';
import 'package:korecha/features/cart/data/models/my_orders_model.dart';
import 'package:timeline_tile/timeline_tile.dart';

class OrderDetailsSheet extends StatelessWidget {
  final OrderItemModel order;

  const OrderDetailsSheet({super.key, required this.order});

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: 0.7,
      minChildSize: 0.5,
      maxChildSize: 0.9,
      builder:
          (_, controller) => Container(
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
            ),
            child: Column(
              children: [
                _buildHandle(),
                Expanded(
                  child: ListView(
                    controller: controller,
                    padding: const EdgeInsets.all(defaultPadding),
                    children: [
                      _buildHeader(context),
                      const SizedBox(height: defaultPadding),
                      _buildDeliveryInfo(context),
                      const SizedBox(height: defaultPadding),
                      _buildOrderTimeline(context),
                      const SizedBox(height: defaultPadding),
                      _buildItemsList(context),
                      const SizedBox(height: defaultPadding),
                      _buildPriceSummary(context),
                    ],
                  ),
                ),
              ],
            ),
          ),
    );
  }

  Widget _buildHandle() {
    return Container(
      height: 4,
      width: 40,
      margin: const EdgeInsets.symmetric(vertical: 8),
      decoration: BoxDecoration(
        color: Colors.grey[300],
        borderRadius: BorderRadius.circular(2),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Order Details',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            IconButton(
              onPressed: () => Navigator.pop(context),
              icon: const Icon(Icons.close),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Text(
          'Order #${order.orderNumber}',
          style: Theme.of(
            context,
          ).textTheme.titleMedium?.copyWith(color: Colors.grey[600]),
        ),
      ],
    );
  }

  Widget _buildDeliveryInfo(BuildContext context) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: Colors.grey.shade200),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Delivery Information',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 16),
            _buildInfoRow(
              icon: Icons.location_on_outlined,
              title: 'Delivery Address',
              value:
                  order.shippingAddress.fullAddress.isNotEmpty
                      ? order.shippingAddress.fullAddress
                      : 'Address information not available',
            ),
            const SizedBox(height: 12),
            _buildInfoRow(
              icon: Icons.phone_outlined,
              title: 'Phone Number',
              value:
                  order.shippingAddress.phoneNumber.isNotEmpty
                      ? order.shippingAddress.phoneNumber
                      : 'Phone information not available',
            ),
            if (order.delivery.trackingNumber.isNotEmpty) ...[
              const SizedBox(height: 12),
              _buildInfoRow(
                icon: Icons.local_shipping_outlined,
                title: 'Tracking Number',
                value: order.delivery.trackingNumber,
              ),
            ] else ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.blue[50],
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.blue[200]!),
                ),
                child: Row(
                  children: [
                    Icon(Icons.info_outline, color: Colors.blue[700], size: 20),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Tracking number will be provided once your order is shipped.',
                        style: TextStyle(color: Colors.blue[700], fontSize: 13),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow({
    required IconData icon,
    required String title,
    required String value,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 20, color: Colors.grey[600]),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: TextStyle(color: Colors.grey[600], fontSize: 13),
              ),
              const SizedBox(height: 4),
              Text(value, style: const TextStyle(fontWeight: FontWeight.w500)),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildOrderTimeline(BuildContext context) {
    // Create a basic timeline with order creation if no timeline data is available
    List<TimelineModel> timelineItems =
        order.history.timeline.isNotEmpty
            ? order.history.timeline
            : [TimelineModel(time: order.createdAt, title: "Order Placed")];

    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: Colors.grey.shade200),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Order Timeline',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 16),
            ...List.generate(
              timelineItems.length,
              (index) => TimelineTile(
                isFirst: index == 0,
                isLast: index == timelineItems.length - 1,
                indicatorStyle: IndicatorStyle(
                  width: 20,
                  color: Theme.of(context).primaryColor,
                  padding: const EdgeInsets.symmetric(vertical: 2),
                ),
                beforeLineStyle: LineStyle(
                  color: Theme.of(context).primaryColor.withOpacity(0.2),
                ),
                endChild: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        timelineItems[index].title,
                        style: const TextStyle(
                          fontWeight: FontWeight.w500,
                          fontSize: 15,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _formatDateTime(timelineItems[index].time),
                        style: TextStyle(color: Colors.grey[600], fontSize: 13),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            // Show info if timeline is limited
            if (order.history.timeline.isEmpty) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.green[50],
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.green[200]!),
                ),
                child: Row(
                  children: [
                    Icon(Icons.schedule, color: Colors.green[700], size: 20),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Order timeline updates will appear here as your order progresses.',
                        style: TextStyle(
                          color: Colors.green[700],
                          fontSize: 13,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildItemsList(BuildContext context) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: Colors.grey.shade200),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Order Items',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                Text(
                  '${order.itemsCount} products (${order.totalQuantity} items)',
                  style: TextStyle(color: Colors.grey[600], fontSize: 13),
                ),
              ],
            ),
            const SizedBox(height: 16),
            // Show the first item (available from API)
            Row(
              children: [
                SizedBox(
                  width: 60,
                  height: 60,
                  child: NetworkImageWithLoader(
                    order.firstItem.coverUrl,
                    fit: BoxFit.cover,
                    radius: 8,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        order.firstItem.productName,
                        style: const TextStyle(fontWeight: FontWeight.w500),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Product ID: ${order.firstItem.productId}',
                        style: TextStyle(color: Colors.grey[600], fontSize: 12),
                      ),
                    ],
                  ),
                ),
                Icon(
                  Icons.inventory_2_outlined,
                  color: Colors.grey[400],
                  size: 20,
                ),
              ],
            ),
            if (order.itemsCount > 1) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.orange[50],
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.orange[200]!),
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.inventory_outlined,
                      color: Colors.orange[700],
                      size: 20,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        '+ ${order.itemsCount - 1} more products are included in this order. Full order details are being processed.',
                        style: TextStyle(
                          color: Colors.orange[700],
                          fontSize: 13,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildPriceSummary(BuildContext context) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: Colors.grey.shade200),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Price Details',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 16),
            // Only show available data
            if (order.subtotal > 0) _buildPriceRow('Subtotal', order.subtotal),
            if (order.shipping > 0) ...[
              const SizedBox(height: 8),
              _buildPriceRow('Shipping', order.shipping),
            ],
            if (order.taxes > 0) ...[
              const SizedBox(height: 8),
              _buildPriceRow('Tax', order.taxes),
            ],
            if (order.discount > 0) ...[
              const SizedBox(height: 8),
              _buildPriceRow('Discount', -order.discount),
            ],
            // Always show total (this is available from API)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 12),
              child: Divider(),
            ),
            _buildPriceRow('Total', order.totalAmount, isTotal: true),

            // Info message if detailed breakdown is not available
            if (order.subtotal == 0 &&
                order.shipping == 0 &&
                order.taxes == 0) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.blue[50],
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.blue[200]!),
                ),
                child: Row(
                  children: [
                    Icon(Icons.info_outline, color: Colors.blue[700], size: 20),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Detailed price breakdown will be available once order processing is complete.',
                        style: TextStyle(color: Colors.blue[700], fontSize: 13),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildPriceRow(String label, double amount, {bool isTotal = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: isTotal ? 16 : 14,
            fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
            color: isTotal ? Colors.black : Colors.grey[600],
          ),
        ),
        Text(
          '${amount.toStringAsFixed(2)} Birr',
          style: TextStyle(
            fontSize: isTotal ? 16 : 14,
            fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
            color: isTotal ? Colors.black : Colors.grey[600],
          ),
        ),
      ],
    );
  }

  String _formatDateTime(String dateTimeStr) {
    final dateTime = DateTime.parse(dateTimeStr);
    return '${dateTime.day}/${dateTime.month}/${dateTime.year} ${dateTime.hour}:${dateTime.minute}';
  }
}
