import 'dart:math';

import 'package:chapasdk/chapasdk.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:korecha/components/network_image_with_loader.dart';
import 'package:korecha/features/authentication/domain/entities/address.dart';
import 'package:korecha/features/authentication/presentation/state/address/bloc/address_bloc.dart';
import 'package:korecha/features/cart/data/models/chapa_order_request_model.dart';
import 'package:korecha/features/cart/data/models/cod_order_request_model.dart';
import 'package:korecha/features/cart/domain/entities/cart_item.dart';
import 'package:korecha/features/cart/domain/entities/order.dart';
import 'package:korecha/features/cart/presentation/pages/order_confirmation_screen.dart';
import 'package:korecha/features/cart/presentation/state/order/bloc/order_bloc.dart';
import 'package:korecha/features/cart/presentation/state/cart/bloc/cart_bloc.dart';
import '../../domain/entities/payment_method.dart';

class PaymentMethodScreen extends StatefulWidget {
  final double amount;
  final List<CartItem> items;
  final Address? selectedAddress; // Address from checkout flow

  const PaymentMethodScreen({
    super.key,
    required this.amount,
    required this.items,
    this.selectedAddress, // Optional address from checkout
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
  bool _showPaymentProcessingOverlay = false;
  String? _currentTransactionRef;
  List<Address> _userAddresses = [];
  Address? _selectedAddress;

  @override
  void initState() {
    super.initState();
    selectedMethod = paymentMethods.first;

    // If address is passed from checkout flow, use it
    if (widget.selectedAddress != null) {
      _selectedAddress = widget.selectedAddress;
    } else {
      // Only load addresses if none provided (for standalone usage)
      context.read<AddressBloc>().add(LoadAddressesEvent());
    }
  }

  void _showPaymentProcessingScreen() {
    setState(() {
      _showPaymentProcessingOverlay = true;
    });
  }

  void _hidePaymentProcessingScreen() {
    setState(() {
      _showPaymentProcessingOverlay = false;
    });
  }

  void _clearOrderedItemsFromCart() {
    // Remove all ordered items from cart using batch removal
    final itemIds = widget.items.map((item) => item.id).toList();
    context.read<CartBloc>().add(RemoveMultipleFromCart(itemIds));
  }

  Widget _buildPaymentProcessingOverlay() {
    return Container(
      color: Colors.black.withOpacity(0.85),
      child: Center(
        child: Container(
          margin: const EdgeInsets.all(32),
          padding: const EdgeInsets.all(32),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: Theme.of(context).primaryColor.withOpacity(0.1),
                blurRadius: 20,
                spreadRadius: 5,
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Animated loading indicator with app colors
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Theme.of(context).primaryColor.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: CircularProgressIndicator(
                  strokeWidth: 3,
                  valueColor: AlwaysStoppedAnimation<Color>(
                    Theme.of(context).primaryColor,
                  ),
                ),
              ),
              const SizedBox(height: 24),
              Text(
                'Processing Your Order',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: Theme.of(context).primaryColor,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              Text(
                'Payment successful! We\'re creating your order...',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Colors.grey[600],
                  height: 1.4,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 20),
              // Success badge with app colors
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 10,
                ),
                decoration: BoxDecoration(
                  color: const Color(
                    0xFF2E7D32,
                  ).withOpacity(0.1), // successColor
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: const Color(0xFF2E7D32).withOpacity(0.3),
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      Icons.check_circle_rounded,
                      color: const Color(0xFF2E7D32),
                      size: 18,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'Payment Completed',
                      style: TextStyle(
                        color: const Color(0xFF2E7D32),
                        fontWeight: FontWeight.w600,
                        fontSize: 13,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              // Warning message with app colors
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 8,
                ),
                decoration: BoxDecoration(
                  color: Colors.amber.withOpacity(0.1), // warningColor
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      Icons.info_outline_rounded,
                      color: Colors.amber[700],
                      size: 16,
                    ),
                    const SizedBox(width: 8),
                    Flexible(
                      child: Text(
                        'Please wait, do not close this screen',
                        style: TextStyle(
                          color: Colors.amber[700],
                          fontWeight: FontWeight.w500,
                          fontSize: 12,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
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
    return WillPopScope(
      onWillPop: () async {
        // Prevent back navigation when processing payment
        return !_showPaymentProcessingOverlay;
      },
      child: Scaffold(
        appBar: AppBar(
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed:
                _showPaymentProcessingOverlay
                    ? null
                    : () => Navigator.pop(context),
          ),
          title: const Text('Payment method'),
        ),
        body: Stack(
          children: [
            Column(
              children: [
                // Payment Method Selection Tabs - Now at the top
                Container(
                  margin: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: Colors.grey[100],
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children:
                        paymentMethods.map((method) {
                          final isSelected = method.id == selectedMethod?.id;
                          return Expanded(
                            child: Container(
                              margin: const EdgeInsets.all(2),
                              child: Material(
                                color: Colors.transparent,
                                child: InkWell(
                                  borderRadius: BorderRadius.circular(10),
                                  onTap: () {
                                    setState(() {
                                      selectedMethod = method;
                                    });
                                  },
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 16,
                                      vertical: 12,
                                    ),
                                    decoration: BoxDecoration(
                                      color:
                                          isSelected
                                              ? Theme.of(context).primaryColor
                                              : Colors.transparent,
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    child: Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        Icon(
                                          method.isCashOnDelivery
                                              ? Icons.payments_outlined
                                              : Icons.payment,
                                          size: 18,
                                          color:
                                              isSelected
                                                  ? Colors.white
                                                  : Colors.grey[700],
                                        ),
                                        const SizedBox(width: 8),
                                        Flexible(
                                          child: Text(
                                            method.name,
                                            style: TextStyle(
                                              color:
                                                  isSelected
                                                      ? Colors.white
                                                      : Colors.grey[700],
                                              fontWeight: FontWeight.w500,
                                              fontSize: 13,
                                            ),
                                            textAlign: TextAlign.center,
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          );
                        }).toList(),
                  ),
                ),

                // Expanded content area
                Expanded(
                  child: SingleChildScrollView(
                    child: Column(
                      children: [
                        _buildOrderSummary(),

                        // Delivery Address Section
                        if (_selectedAddress != null)
                          Container(
                            margin: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 8,
                            ),
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: Colors.grey[50],
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: Colors.grey[200]!),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Icon(
                                      Icons.location_on,
                                      color: Theme.of(context).primaryColor,
                                      size: 20,
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      'Delivery Address',
                                      style: Theme.of(
                                        context,
                                      ).textTheme.titleMedium?.copyWith(
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  _selectedAddress!.label,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.w500,
                                    fontSize: 14,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  _selectedAddress!.fullAddress,
                                  style: TextStyle(
                                    color: Colors.grey[600],
                                    height: 1.4,
                                  ),
                                ),
                                if (_selectedAddress!
                                    .phoneNumber
                                    .isNotEmpty) ...[
                                  const SizedBox(height: 4),
                                  Text(
                                    _selectedAddress!.phoneNumber,
                                    style: TextStyle(
                                      color: Colors.grey[600],
                                      fontSize: 13,
                                    ),
                                  ),
                                ],
                              ],
                            ),
                          )
                        else if (widget.selectedAddress == null &&
                            _userAddresses.isEmpty &&
                            context.watch<AddressBloc>().state
                                is! AddressLoading)
                          Container(
                            margin: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 8,
                            ),
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: Colors.orange[50],
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: Colors.orange[200]!),
                            ),
                            child: Row(
                              children: [
                                Icon(
                                  Icons.warning_amber_rounded,
                                  color: Colors.orange[700],
                                  size: 20,
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    'No delivery address found. Please add an address to continue.',
                                    style: TextStyle(
                                      color: Colors.orange[700],
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),

                        // Payment Method Content
                        Container(
                          margin: const EdgeInsets.all(16),
                          child: Builder(
                            builder: (context) {
                              if (selectedMethod?.isChapa == true) {
                                return Column(
                                  children: [
                                    Image.asset(
                                      'assets/connectx/chapa.png',
                                      height: 120,
                                    ),
                                    const SizedBox(height: 16),
                                    Text(
                                      'Secure Payment with Chapa',
                                      style:
                                          Theme.of(
                                            context,
                                          ).textTheme.titleMedium,
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      'Pay securely using Telebirr, CBE Birr, or other payment methods',
                                      textAlign: TextAlign.center,
                                      style: TextStyle(
                                        color: Colors.grey[600],
                                        height: 1.5,
                                      ),
                                    ),
                                  ],
                                );
                              } else if (selectedMethod?.isCashOnDelivery ==
                                  true) {
                                return Column(
                                  children: [
                                    Image.asset(
                                      'assets/Illustration/PayWithCash_lightTheme.png',
                                      height: 120,
                                    ),
                                    const SizedBox(height: 16),
                                    Text(
                                      'Cash on Delivery',
                                      style:
                                          Theme.of(
                                            context,
                                          ).textTheme.titleMedium,
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      'Pay in cash when your order is delivered',
                                      textAlign: TextAlign.center,
                                      style: TextStyle(
                                        color: Colors.grey[600],
                                        height: 1.5,
                                      ),
                                    ),
                                  ],
                                );
                              }
                              return const SizedBox.shrink();
                            },
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                // Bottom Payment Button
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: SizedBox(
                    width: double.infinity,
                    child: MultiBlocListener(
                      listeners: [
                        BlocListener<AddressBloc, AddressState>(
                          listener: (context, state) {
                            if (state is AddressLoaded) {
                              setState(() {
                                _userAddresses = state.addresses;
                                // Select default address or first available
                                _selectedAddress =
                                    state.addresses.isNotEmpty
                                        ? state.addresses.firstWhere(
                                          (addr) => addr.isDefault,
                                          orElse: () => state.addresses.first,
                                        )
                                        : null;
                              });
                            } else if (state is AddressError) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(
                                    'Failed to load addresses: ${state.message}',
                                  ),
                                  backgroundColor: Colors.orange,
                                ),
                              );
                            }
                          },
                        ),
                        BlocListener<OrderBloc, OrderState>(
                          listener: (context, state) {
                            if (state is ChapaOrderCreated) {
                              // Order created successfully on backend, hide processing overlay and navigate to confirmation
                              _hidePaymentProcessingScreen();
                              setState(() {
                                _isProcessing = false;
                              });

                              // Clear ordered items from cart
                              _clearOrderedItemsFromCart();

                              final order = Order_Model(
                                id: _currentTransactionRef ?? 'chapa-order',
                                orderNumber:
                                    _currentTransactionRef ??
                                    'CHAPA-${DateTime.now().millisecondsSinceEpoch}',
                                amount: widget.amount,
                                subtotal: widget.amount,
                                date: DateTime.now(),
                                status: 'processing',
                                items: widget.items,
                                deliveryMethod: 'Standard Delivery',
                                address:
                                    _selectedAddress?.fullAddress ??
                                    'No address selected',
                                paymentMethod: 'Chapa',
                              );

                              Navigator.pushReplacement(
                                context,
                                MaterialPageRoute(
                                  builder:
                                      (context) => OrderConfirmationScreen(
                                        orderNumber:
                                            _currentTransactionRef ??
                                            'CHAPA-${DateTime.now().millisecondsSinceEpoch}',
                                        amount: widget.amount,
                                        email: 'customer@email.com',
                                        order: order,
                                      ),
                                ),
                              );
                            } else if (state is OrderFailure &&
                                (_isProcessing ||
                                    _showPaymentProcessingOverlay)) {
                              // Show error message for order creation failure
                              _hidePaymentProcessingScreen();
                              setState(() {
                                _isProcessing = false;
                              });
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(
                                    'Failed to create order: ${state.message}',
                                  ),
                                  backgroundColor: Colors.red,
                                  action: SnackBarAction(
                                    label: 'Retry',
                                    textColor: Colors.white,
                                    onPressed: () {
                                      // Retry order creation if we have the transaction reference
                                      if (_currentTransactionRef != null) {
                                        _showPaymentProcessingScreen();
                                        // Recreate the order with the same transaction reference
                                        final chapaOrder = ChapaOrderModel(
                                          payment: Payment(
                                            amount: widget.amount,
                                            txRef: _currentTransactionRef!,
                                            transactionId:
                                                _currentTransactionRef!,
                                          ),
                                          status: 'processing',
                                          amount: widget.amount,
                                          currency: 'ETB',
                                          items:
                                              widget.items
                                                  .map(
                                                    (item) => Item(
                                                      id: item.id,
                                                      quantity: item.quantity,
                                                      price: item.price,
                                                      name: item.name,
                                                      coverUrl: item.coverUrl,
                                                    ),
                                                  )
                                                  .toList(),
                                          billing: Billing(
                                            name: 'Customer Name',
                                            email: 'customer@email.com',
                                            phoneNumber:
                                                _selectedAddress!.phoneNumber,
                                            fullAddress:
                                                _selectedAddress!.fullAddress,
                                            company: '',
                                            addressType:
                                                _selectedAddress!.label,
                                          ),
                                          shipping: Shipping(
                                            address: _selectedAddress!.id,
                                            phoneNumber:
                                                _selectedAddress!.phoneNumber,
                                            method: ShippingMethod(
                                              label: 'Standard Delivery',
                                              description:
                                                  'Delivery in 3-5 business days',
                                              value: 0.0,
                                            ),
                                          ),
                                          delivery: Delivery(
                                            method: 'Standard Delivery',
                                            fee: 0.0,
                                          ),
                                          discount: 0.0,
                                          total: widget.amount,
                                          subtotal: widget.amount,
                                        );
                                        context.read<OrderBloc>().add(
                                          CreateChapaOrderEvent(chapaOrder),
                                        );
                                      }
                                    },
                                  ),
                                ),
                              );
                            } else if (state is CashOnDeliveryOrderCreated) {
                              // COD order created successfully
                              setState(() {
                                _isProcessing = false;
                              });

                              // Clear ordered items from cart
                              _clearOrderedItemsFromCart();

                              final order = Order_Model(
                                id:
                                    'cod-order-${DateTime.now().millisecondsSinceEpoch}',
                                orderNumber:
                                    'COD-${DateTime.now().millisecondsSinceEpoch}',
                                amount: widget.amount,
                                subtotal: widget.amount,
                                date: DateTime.now(),
                                status: 'pending',
                                items: widget.items,
                                deliveryMethod: 'Standard Delivery',
                                address:
                                    _selectedAddress?.fullAddress ??
                                    'No address selected',
                                paymentMethod: 'Cash on Delivery',
                              );

                              Navigator.pushReplacement(
                                context,
                                MaterialPageRoute(
                                  builder:
                                      (context) => OrderConfirmationScreen(
                                        orderNumber:
                                            'COD-${DateTime.now().millisecondsSinceEpoch}',
                                        amount: widget.amount,
                                        email: 'customer@example.com',
                                        order: order,
                                      ),
                                ),
                              );
                            }
                          },
                        ),
                      ],
                      child: ElevatedButton(
                        onPressed:
                            (_isProcessing || _showPaymentProcessingOverlay)
                                ? null
                                : () {
                                  // Check if user has addresses
                                  if (_selectedAddress == null) {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(
                                        content: Text(
                                          widget.selectedAddress == null
                                              ? 'Please add a delivery address first'
                                              : 'No delivery address selected',
                                        ),
                                        backgroundColor: Colors.orange,
                                        action:
                                            widget.selectedAddress == null
                                                ? SnackBarAction(
                                                  label: 'Add Address',
                                                  textColor: Colors.white,
                                                  onPressed: () {
                                                    // Navigate to address management
                                                    Navigator.pop(context);
                                                  },
                                                )
                                                : null,
                                      ),
                                    );
                                    return;
                                  }

                                  if (selectedMethod?.isChapa == true) {
                                    final transactionRef =
                                        'tx-${DateTime.now().millisecondsSinceEpoch}';
                                    _currentTransactionRef = transactionRef;

                                    Chapa.paymentParameters(
                                      phone: '0900123456',
                                      context: context,
                                      publicKey:
                                          'CHAPUBK_TEST-vPyKZqPxPWCT6EPYB1wPZ6QvPuJSpBrU',
                                      currency: 'ETB',
                                      amount: widget.amount.toString(),
                                      email: 'customer@email.com',
                                      firstName: 'Customer',
                                      lastName: 'Name',
                                      txRef: transactionRef,
                                      title: 'Order Payment',
                                      desc: 'Payment for order items',
                                      namedRouteFallBack: '',
                                      nativeCheckout: true,
                                      onPaymentFinished: (
                                        message,
                                        reference,
                                        amount,
                                      ) {
                                        // Payment successful, show processing overlay immediately
                                        _showPaymentProcessingScreen();

                                        final chapaOrder = ChapaOrderModel(
                                          payment: Payment(
                                            amount: widget.amount,
                                            txRef: reference,
                                            transactionId: reference,
                                          ),
                                          status:
                                              'processing', // Payment successful
                                          amount: widget.amount,
                                          currency: 'ETB',
                                          items:
                                              widget.items
                                                  .map(
                                                    (item) => Item(
                                                      id: item.id,
                                                      quantity: item.quantity,
                                                      price: item.price,
                                                      name: item.name,
                                                      coverUrl: item.coverUrl,
                                                    ),
                                                  )
                                                  .toList(),
                                          billing: Billing(
                                            name: 'Customer Name',
                                            email: 'customer@email.com',
                                            phoneNumber:
                                                _selectedAddress!.phoneNumber,
                                            fullAddress:
                                                _selectedAddress!.fullAddress,
                                            company: '',
                                            addressType:
                                                _selectedAddress!.label,
                                          ),
                                          shipping: Shipping(
                                            address:
                                                _selectedAddress!
                                                    .id, // Use actual address ID
                                            phoneNumber:
                                                _selectedAddress!.phoneNumber,
                                            method: ShippingMethod(
                                              label: 'Standard Delivery',
                                              description:
                                                  'Delivery in 3-5 business days',
                                              value: 0.0,
                                            ),
                                          ),
                                          delivery: Delivery(
                                            method: 'Standard Delivery',
                                            fee: 0.0,
                                          ),
                                          discount: 0.0,
                                          total: widget.amount,
                                          subtotal: widget.amount,
                                        );

                                        // Create order on backend
                                        context.read<OrderBloc>().add(
                                          CreateChapaOrderEvent(chapaOrder),
                                        );
                                      },
                                    );
                                  } else {
                                    // Cash on Delivery logic with real address
                                    final CashOnDeliveryOrder
                                    cashOnDeliveryOrder = CashOnDeliveryOrder(
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
                                        name: 'Customer Name',
                                        email: 'customer@example.com',
                                        phoneNumber:
                                            _selectedAddress!.phoneNumber,
                                        fullAddress:
                                            _selectedAddress!.fullAddress,
                                      ),
                                      shipping: CodShipping(
                                        address:
                                            _selectedAddress!
                                                .id, // Use actual address ID
                                        method: CodShippingMethod(
                                          id: 'standard',
                                          label: 'Standard Delivery',
                                          description:
                                              'Delivery in 3-5 business days',
                                          value: 0,
                                        ),
                                      ),
                                      payment: CodPayment(
                                        method: 'Cash on Delivery',
                                        currency: 'ETB',
                                        amount: widget.amount,
                                      ),
                                      notes:
                                          'Cash on Delivery order placed from mobile app',
                                      source: 'mobile',
                                    );

                                    context.read<OrderBloc>().add(
                                      CreateCashOnDeliveryOrderEvent(
                                        cashOnDeliveryOrder,
                                      ),
                                    );
                                    setState(() {
                                      _isProcessing = true;
                                    });
                                  }
                                },
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child:
                            (_isProcessing || _showPaymentProcessingOverlay)
                                ? const SizedBox(
                                  height: 20,
                                  width: 20,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    valueColor: AlwaysStoppedAnimation<Color>(
                                      Colors.white,
                                    ),
                                  ),
                                )
                                : Text(
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
                ),
              ],
            ),
            // Payment Processing Overlay
            if (_showPaymentProcessingOverlay) _buildPaymentProcessingOverlay(),
          ],
        ),
      ),
    );
  }
}
