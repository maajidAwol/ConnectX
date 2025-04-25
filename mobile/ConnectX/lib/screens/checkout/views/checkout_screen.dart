import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '../../../constants.dart';
import '../../../components/cart_button.dart';

class CheckoutScreen extends StatefulWidget {
  const CheckoutScreen({super.key});

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  int selectedPaymentMethod = 0;
  int selectedShippingMethod = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Checkout'),
        centerTitle: true,
      ),
      bottomNavigationBar: CartButton(
        price: 269.40,
        title: "Place Order",
        subTitle: "Total price",
        press: () {
          // Handle order placement
        },
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(defaultPadding),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSectionTitle(context, "Shipping Address"),
            _buildAddressCard(context),
            const SizedBox(height: defaultPadding),
            _buildSectionTitle(context, "Payment Method"),
            _buildPaymentMethods(),
            const SizedBox(height: defaultPadding),
            _buildSectionTitle(context, "Shipping Method"),
            _buildShippingMethods(),
            const SizedBox(height: defaultPadding),
            _buildSectionTitle(context, "Order Summary"),
            _buildOrderSummary(context),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(BuildContext context, String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: defaultPadding),
      child: Text(
        title,
        style: Theme.of(context).textTheme.titleSmall,
      ),
    );
  }

  Widget _buildAddressCard(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(defaultPadding),
      decoration: BoxDecoration(
        border: Border.all(color: Theme.of(context).dividerColor),
        borderRadius: BorderRadius.circular(defaultBorderRadious),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text("John Doe"),
              TextButton(
                onPressed: () {},
                child: const Text("Change"),
              ),
            ],
          ),
          const Text("123 Main Street"),
          const Text("New York, NY 10001"),
          const Text("United States"),
          const Text("+1 234 567 8900"),
        ],
      ),
    );
  }

  Widget _buildPaymentMethods() {
    return Column(
      children: [
        _buildPaymentOption(
          0,
          "Credit Card",
          "assets/icons/CreditCard.svg",
          "**** **** **** 4567",
        ),
        const SizedBox(height: defaultPadding / 2),
        _buildPaymentOption(
          1,
          "PayPal",
          "assets/icons/Paypal.svg",
          "john.doe@email.com",
        ),
      ],
    );
  }

  Widget _buildPaymentOption(
      int index, String title, String icon, String subtitle) {
    return InkWell(
      onTap: () => setState(() => selectedPaymentMethod = index),
      child: Container(
        padding: const EdgeInsets.all(defaultPadding),
        decoration: BoxDecoration(
          border: Border.all(
            color: selectedPaymentMethod == index
                ? primaryColor
                : Theme.of(context).dividerColor,
          ),
          borderRadius: BorderRadius.circular(defaultBorderRadious),
        ),
        child: Row(
          children: [
            SvgPicture.asset(
              icon,
              height: 24,
              colorFilter: ColorFilter.mode(
                Theme.of(context).iconTheme.color!,
                BlendMode.srcIn,
              ),
            ),
            const SizedBox(width: defaultPadding),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title),
                  Text(
                    subtitle,
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
            ),
            Radio(
              value: index,
              groupValue: selectedPaymentMethod,
              onChanged: (value) =>
                  setState(() => selectedPaymentMethod = value!),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildShippingMethods() {
    return Column(
      children: [
        _buildShippingOption(
          0,
          "Standard Delivery",
          "3-5 Business Days",
          "Free",
        ),
        const SizedBox(height: defaultPadding / 2),
        _buildShippingOption(
          1,
          "Express Delivery",
          "1-2 Business Days",
          "\$15.00",
        ),
      ],
    );
  }

  Widget _buildShippingOption(
      int index, String title, String duration, String price) {
    return InkWell(
      onTap: () => setState(() => selectedShippingMethod = index),
      child: Container(
        padding: const EdgeInsets.all(defaultPadding),
        decoration: BoxDecoration(
          border: Border.all(
            color: selectedShippingMethod == index
                ? primaryColor
                : Theme.of(context).dividerColor,
          ),
          borderRadius: BorderRadius.circular(defaultBorderRadious),
        ),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title),
                  Text(
                    duration,
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
            ),
            Text(
              price,
              style: Theme.of(context).textTheme.titleSmall,
            ),
            Radio(
              value: index,
              groupValue: selectedShippingMethod,
              onChanged: (value) =>
                  setState(() => selectedShippingMethod = value!),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOrderSummary(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(defaultPadding),
      decoration: BoxDecoration(
        border: Border.all(color: Theme.of(context).dividerColor),
        borderRadius: BorderRadius.circular(defaultBorderRadious),
      ),
      child: Column(
        children: [
          _buildSummaryRow("Subtotal", "\$249.40"),
          _buildSummaryRow("Shipping", "\$15.00"),
          _buildSummaryRow("Tax", "\$5.00"),
          const Divider(),
          _buildSummaryRow("Total", "\$269.40", isTotal: true),
        ],
      ),
    );
  }

  Widget _buildSummaryRow(String label, String value, {bool isTotal = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: defaultPadding / 2),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: isTotal
                ? Theme.of(context).textTheme.titleSmall
                : Theme.of(context).textTheme.bodyMedium,
          ),
          Text(
            value,
            style: isTotal
                ? Theme.of(context).textTheme.titleSmall
                : Theme.of(context).textTheme.bodyMedium,
          ),
        ],
      ),
    );
  }
}
