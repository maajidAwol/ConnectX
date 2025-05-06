import 'dart:math';

import 'package:chapasdk/chapasdk.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:korecha/features/cart/data/models/cod_order_request_model.dart';
import 'package:korecha/features/cart/domain/entities/cart_item.dart';
import 'package:korecha/features/cart/domain/entities/order.dart';
import 'package:korecha/features/cart/presentation/pages/order_confirmation_screen.dart';
import 'package:korecha/features/cart/presentation/state/order/bloc/order_bloc.dart';
import '../../domain/entities/payment_method.dart';

class PaymentMethodScreen extends StatefulWidget {
  final double amount;
  final List<CartItem> items;

  const PaymentMethodScreen({
    super.key,
    required this.amount,
    required this.items,
  });

  @override
  State<PaymentMethodScreen> createState() => _PaymentMethodScreenState();
}

class _PaymentMethodScreenState extends State<PaymentMethodScreen> {
  final List<PaymentMethod> paymentMethods = [
    const PaymentMethod(
      id: '1',
      name: 'Pay with Chapa',
      icon: 'assets/icons/chapa.png',
      isChapa: true,
      isSelected: true,
    ),
    const PaymentMethod(
      id: '2',
      name: 'Cash on Delivery',
      icon: 'assets/icons/cash.png',
      isCashOnDelivery: true,
    ),
  ];

  PaymentMethod? selectedMethod;
  bool _isProcessing = false;

  @override
  void initState() {
    super.initState();
    selectedMethod = paymentMethods.first;
  }

  Widget _buildOrderSummary() {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Order Summary',
            style: Theme.of(
              context,
            ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          ...widget.items
              .map(
                (item) => Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Row(
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: Image.network(
                          item.coverUrl,
                          width: 40,
                          height: 40,
                          fit: BoxFit.cover,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              item.name,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
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
                      Text(
                        '${(item.price * item.quantity).toStringAsFixed(2)} Birr',
                        style: const TextStyle(fontWeight: FontWeight.w500),
                      ),
                    ],
                  ),
                ),
              )
              .toList(),
          const Divider(),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Total',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              Text(
                '${widget.amount.toStringAsFixed(2)} Birr',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: Theme.of(context).primaryColor,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Payment method'),
      ),
      body: Column(
        children: [
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              children:
                  paymentMethods.map((method) {
                final isSelected = method.id == selectedMethod?.id;
                return Container(
                  margin: const EdgeInsets.only(right: 12),
                  child: ChoiceChip(
                    label: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          method.isCashOnDelivery
                              ? Icons.payments_outlined
                              : Icons.payment,
                          size: 20,
                              color:
                                  isSelected ? Colors.white : Colors.grey[700],
                        ),
                        const SizedBox(width: 8),
                        Text(
                          method.name,
                          style: TextStyle(
                                color:
                                    isSelected
                                        ? Colors.white
                                        : Colors.grey[700],
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                    selected: isSelected,
                    onSelected: (bool selected) {
                      if (selected) {
                        setState(() {
                          selectedMethod = method;
                        });
                      }
                    },
                    selectedColor: Theme.of(context).primaryColor,
                    backgroundColor: Colors.grey[100],
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                  ),
                );
              }).toList(),
            ),
          ),

          _buildOrderSummary(),

          Expanded(
            child: Builder(
              builder: (context) {
                if (selectedMethod?.isChapa == true) {
                  return Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Image.asset('assets/connectx/chapa.png', height: 120),
                      const SizedBox(height: 16),
                      Text(
                        'Secure Payment with Chapa',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const SizedBox(height: 8),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 32),
                        child: Text(
                          'Pay securely using Telebirr, CBE Birr, or other payment methods',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            color: Colors.grey[600],
                            height: 1.5,
                          ),
                        ),
                      ),
                    ],
                  );
                } else if (selectedMethod?.isCashOnDelivery == true) {
                  return Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Image.asset(
                        'assets/Illustration/PayWithCash_lightTheme.png',
                        height: 120,
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Cash on Delivery',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const SizedBox(height: 8),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 32),
                        child: Text(
                          'Pay in cash when your order is delivered',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                color: Colors.grey[600],
                                height: 1.5,
                              ),
                        ),
                      ),
                    ],
                  );
                }
                return const SizedBox.shrink();
              },
            ),
          ),

          Padding(
            padding: const EdgeInsets.all(16),
            child: SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  if (selectedMethod?.isChapa == true) {
                    final transactionRef =
                        'tx-${DateTime.now().millisecondsSinceEpoch}';

                    Chapa.paymentParameters(
                      phone: '0900123456',
                      context: context,
                      publicKey:
                          'CHAPUBK_TEST-Z3Dt5ZOlmG8Fmm9SDjJTSn4ykGfIQ2ms',
                      currency: 'ETB',
                      amount: widget.amount.toString(),
                      email:
                          'customer@email.com', // Replace with actual customer email
                      firstName: 'Customer', // Replace with actual name
                      lastName: 'Name',
                      txRef: transactionRef,
                      title: 'Order Payment',
                      desc: 'Payment for order items',
                      namedRouteFallBack: '',
                      nativeCheckout: true,
                      onPaymentFinished: (message, reference, amount) {
                        final order = Order_Model(
                          id: reference,
                          orderNumber: reference,
                          amount: widget.amount,
                          subtotal: widget.amount,
                          date: DateTime.now(),
                          status: 'pending',
                          items: widget.items,
                          deliveryMethod:
                              'Standard Delivery', // Get this from previous screen
                          address:
                              'Customer Address', // Get this from previous screen
                          paymentMethod: 'Chapa',
                        );

                        Navigator.pushReplacement(
                          context,
                          MaterialPageRoute(
                            builder:
                                (context) => OrderConfirmationScreen(
                                  orderNumber: reference,
                                  amount: widget.amount,
                                  email:
                                      'customer@email.com', // Use actual customer email
                                  order: order,
                                ),
                          ),
                        );
                      },
                    );
                  } else {
                    final CashOnDeliveryOrder cashOnDeliveryOrder =
                        CashOnDeliveryOrder(
                          items:
                              widget.items
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
                      status: 'pending',
                      total: widget.amount,
                      subtotal: widget.amount,
                      billing: CodBilling(
                        name: 'Israel Goytom',
                        email: 'fetan@chapa.co',
                        phoneNumber: '0964001822',
                        fullAddress: '1234 Main St, Anytown, USA',
                      ),
                      shipping: CodShipping(
                        address: '1234 Main St, Anytown, USA',
                        method: CodShippingMethod(
                          id: 'cash',
                          label: 'Cash on Delivery',
                          description: 'Cash on Delivery',
                          value: 0,
                        ),
                      ),
                      payment: CodPayment(
                            method:
                                paymentMethods
                            .firstWhere(
                                      (element) =>
                                          element.isCashOnDelivery == true,
                                    )
                            .name,
                        currency: 'ETB',
                        amount: widget.amount,
                      ),
                      notes: 'Cash on Delivery',
                      source: 'mobile',
                    );
                    context.read<OrderBloc>().add(
                          CreateCashOnDeliveryOrder(cashOnDeliveryOrder),
                        );
                    final order = Order_Model(
                      id: DateTime.now().millisecondsSinceEpoch.toString(),
                      orderNumber:
                          DateTime.now().millisecondsSinceEpoch.toString(),
                      amount: widget.amount,
                      subtotal: widget.amount,
                      date: DateTime.now(),
                      status: 'pending',
                      items: widget.items,
                      deliveryMethod: cashOnDeliveryOrder.shipping.method.label,
                      address: cashOnDeliveryOrder.shipping.address,
                      paymentMethod: 'Cash on Delivery',
                    );
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(
                        builder:
                            (context) => OrderConfirmationScreen(
                              orderNumber: order.orderNumber,
                          amount: widget.amount,
                              email: cashOnDeliveryOrder.billing.email,
                              order: order,
                        ),
                      ),
                    );
                  }
                },
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: Text(
                  selectedMethod?.isChapa == true
                      ? 'Pay ${widget.amount.toStringAsFixed(2)} Birr'
                      : 'Confirm Order',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
