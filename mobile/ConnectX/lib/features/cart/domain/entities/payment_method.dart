class PaymentMethod {
  final String id;
  final String name;
  final String icon;
  final bool isSelected;
  final String? cardNumber;
  final String? expiryDate;
  final double? availableCredit;
  final String? cardBackground;
  final bool isCashOnDelivery;
  final bool isChapa;
  final double? codFee;

  const PaymentMethod({
    required this.id,
    required this.name,
    required this.icon,
    this.isSelected = false,
    this.cardNumber,
    this.expiryDate,
    this.availableCredit,
    this.cardBackground,
    this.isCashOnDelivery = false,
    this.isChapa = false,
    this.codFee,
  });

  PaymentMethod copyWith({
    String? id,
    String? name,
    String? icon,
    bool? isSelected,
    String? cardNumber,
    String? expiryDate,
    double? availableCredit,
    String? cardBackground,
    bool? isCashOnDelivery,
    bool? isChapa,
    double? codFee,
  }) {
    return PaymentMethod(
      id: id ?? this.id,
      name: name ?? this.name,
      icon: icon ?? this.icon,
      isSelected: isSelected ?? this.isSelected,
      cardNumber: cardNumber ?? this.cardNumber,
      expiryDate: expiryDate ?? this.expiryDate,
      availableCredit: availableCredit ?? this.availableCredit,
      cardBackground: cardBackground ?? this.cardBackground,
      isCashOnDelivery: isCashOnDelivery ?? this.isCashOnDelivery,
      isChapa: isChapa ?? this.isChapa,
      codFee: codFee ?? this.codFee,
    );
  }
}
