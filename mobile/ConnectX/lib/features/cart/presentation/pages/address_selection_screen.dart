import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:korecha/features/authentication/domain/entities/address.dart';
import 'package:korecha/features/authentication/presentation/state/address/bloc/address_bloc.dart';
import 'package:korecha/constants.dart';
import 'package:korecha/features/authentication/presentation/widgets/address/address_selection_shimmer.dart';

class AddressSelectionScreen extends StatefulWidget {
  const AddressSelectionScreen({super.key});

  @override
  State<AddressSelectionScreen> createState() => _AddressSelectionScreenState();
}

class _AddressSelectionScreenState extends State<AddressSelectionScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';
  Address? selectedAddress;

  @override
  void initState() {
    super.initState();
    _loadAddresses();
  }

  void _loadAddresses() {
    context.read<AddressBloc>().add(LoadAddressesEvent());
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _showAddAddressDialog() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
          left: defaultPadding,
          right: defaultPadding,
          top: defaultPadding,
        ),
        child: _AddAddressForm(
          onAddressAdded: () {
            _loadAddresses();
          },
        ),
      ),
    );
  }

  List<Address> _filterAddresses(List<Address> addresses) {
    if (_searchQuery.isEmpty) return addresses;
    return addresses
        .where((address) => address.fullAddress
            .toLowerCase()
            .contains(_searchQuery.toLowerCase()))
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Select Address'),
      ),
      body: MultiBlocListener(
        listeners: [
          BlocListener<AddressBloc, AddressState>(
            listener: (context, state) {
              if (state is AddressError) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text(state.message)),
                );
              }
              if (state is AddressAdded) {
                _loadAddresses();
              }
            },
          ),
        ],
        child: Stack(
          children: [
            BlocBuilder<AddressBloc, AddressState>(
              builder: (context, state) {
                if (state is AddressLoading) {
                  return const AddressSelectionShimmer();
                }

                if (state is AddressError) {
                  return Center(child: Text(state.message));
                }

                if (state is AddressLoaded) {
                  final filteredAddresses = _filterAddresses(state.addresses);

                  return Column(
        children: [
          Padding(
                        padding: const EdgeInsets.all(defaultPadding),
            child: TextField(
                          controller: _searchController,
                          onChanged: (value) {
                            setState(() {
                              _searchQuery = value;
                            });
                          },
              decoration: InputDecoration(
                hintText: 'Find an address...',
                hintStyle: TextStyle(color: Colors.grey[400]),
                            prefixIcon:
                                Icon(Icons.search, color: Colors.grey[400]),
                filled: true,
                fillColor: Colors.grey[50],
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                            contentPadding:
                                const EdgeInsets.symmetric(horizontal: 16),
              ),
            ),
          ),
          InkWell(
                        onTap: _showAddAddressDialog,
            child: Container(
                          margin: const EdgeInsets.symmetric(
                              horizontal: defaultPadding),
                          padding: const EdgeInsets.all(defaultPadding),
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey[300]!),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  Icon(Icons.add_location_alt_outlined,
                      color: Theme.of(context).primaryColor),
                  const SizedBox(width: 12),
                  Text(
                    'Add new address',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                ],
              ),
            ),
          ),
                      const SizedBox(height: defaultPadding),
                      if (filteredAddresses.isEmpty && _searchQuery.isNotEmpty)
                        Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.search_off_outlined,
                                size: 100,
                                color: Colors.grey[400],
                              ),
                              const SizedBox(height: defaultPadding),
                              Text(
                                'No matching addresses found',
                                style: Theme.of(context).textTheme.titleLarge,
                              ),
                            ],
                          ),
                        )
                      else if (state.addresses.isEmpty)
                        Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.location_off_outlined,
                                size: 100,
                                color: Colors.grey[400],
                              ),
                              const SizedBox(height: defaultPadding),
                              Text(
                                'No addresses yet',
                                style: Theme.of(context).textTheme.titleLarge,
                              ),
                              const SizedBox(height: defaultPadding / 2),
                              Text(
                                'Add your first address',
                                style: Theme.of(context)
                                    .textTheme
                                    .bodyLarge
                                    ?.copyWith(
                                      color: Colors.grey[600],
                                    ),
                              ),
                              const SizedBox(height: defaultPadding * 1.5),
                              ElevatedButton.icon(
                                onPressed: _showAddAddressDialog,
                                icon: const Icon(Icons.add),
                                label: const Text('Add Address'),
                              ),
                            ],
                          ),
                        )
                      else
          Expanded(
                          child: Padding(
                            padding: const EdgeInsets.only(bottom: 80),
            child: ListView.builder(
                              padding: const EdgeInsets.all(defaultPadding),
                              itemCount: filteredAddresses.length,
              itemBuilder: (context, index) {
                                final address = filteredAddresses[index];
                return Container(
                                  margin: const EdgeInsets.only(
                                      bottom: defaultPadding),
                  decoration: BoxDecoration(
                    border: Border.all(
                                      color: (address.primary ||
                                              address == selectedAddress)
                          ? Theme.of(context).primaryColor
                          : Colors.grey[300]!,
                    ),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: InkWell(
                    onTap: () {
                                      setState(() {
                                        selectedAddress = address;
                                      });
                    },
                    borderRadius: BorderRadius.circular(12),
                    child: Padding(
                                      padding:
                                          const EdgeInsets.all(defaultPadding),
                      child: Row(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                                              color: (address.primary ||
                                                      address ==
                                                          selectedAddress)
                                  ? Theme.of(context)
                                      .primaryColor
                                      .withOpacity(0.1)
                                  : Colors.grey[100],
                              shape: BoxShape.circle,
                            ),
                            child: Icon(
                              Icons.home_outlined,
                                              color: (address.primary ||
                                                      address ==
                                                          selectedAddress)
                                                  ? Theme.of(context)
                                                      .primaryColor
                                  : Colors.grey[600],
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Text(
                                                      address.primary
                                                          ? 'Primary Address'
                                                          : 'Additional Address',
                                      style: Theme.of(context)
                                          .textTheme
                                          .titleMedium
                                          ?.copyWith(
                                                            fontWeight:
                                                                FontWeight.w600,
                                          ),
                                    ),
                                                    if (address.primary) ...[
                                      const SizedBox(width: 8),
                                      Container(
                                                        padding:
                                                            const EdgeInsets
                                                                .symmetric(
                                          horizontal: 8,
                                          vertical: 4,
                                        ),
                                                        decoration:
                                                            BoxDecoration(
                                                          color: Theme.of(
                                                                  context)
                                              .primaryColor
                                              .withOpacity(0.1),
                                          borderRadius:
                                                              BorderRadius
                                                                  .circular(12),
                                        ),
                                        child: Text(
                                          'Default',
                                          style: TextStyle(
                                                            color: Theme.of(
                                                                    context)
                                                                .primaryColor,
                                            fontSize: 12,
                                                            fontWeight:
                                                                FontWeight.w500,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ],
                                ),
                                const SizedBox(height: 8),
                                Text(
                                                  address.fullAddress,
                                  style: TextStyle(
                                    color: Colors.grey[600],
                                    height: 1.5,
                                  ),
                                ),
                                                if (address.phoneNumber
                                                    .isNotEmpty) ...[
                                const SizedBox(height: 4),
                                Text(
                                  address.phoneNumber,
                                  style: TextStyle(
                                    color: Colors.grey[600],
                                  ),
                                ),
                                                ],
                              ],
                            ),
                          ),
                                          if (address == selectedAddress)
                            Icon(
                              Icons.check_circle,
                                              color: Theme.of(context)
                                                  .primaryColor,
                            ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
                        ),
                    ],
                  );
                }

                return const SizedBox.shrink();
              },
            ),
            Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              child: Container(
                padding: const EdgeInsets.all(defaultPadding),
                decoration: BoxDecoration(
                  color: Colors.white,
                  boxShadow: [
                    BoxShadow(
                      offset: const Offset(0, -4),
                      blurRadius: 8,
                      color: Colors.black.withOpacity(0.1),
                    ),
                  ],
                ),
                child: SafeArea(
                  child: ElevatedButton(
                    onPressed: selectedAddress == null
                        ? null
                        : () => Navigator.pop(context, selectedAddress),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text(
                      'Next',
                      style: TextStyle(
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
      ),
    );
  }
}

class _AddAddressForm extends StatefulWidget {
  final VoidCallback onAddressAdded;

  const _AddAddressForm({
    required this.onAddressAdded,
  });

  @override
  State<_AddAddressForm> createState() => _AddAddressFormState();
}

class _AddAddressFormState extends State<_AddAddressForm> {
  final _formKey = GlobalKey<FormState>();
  final _addressController = TextEditingController();
  final _cityController = TextEditingController();
  final _stateController = TextEditingController();
  final _countryController = TextEditingController();
  final _phoneController = TextEditingController();

  @override
  void dispose() {
    _addressController.dispose();
    _cityController.dispose();
    _stateController.dispose();
    _countryController.dispose();
    // _phoneController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            'Add New Address',
            style: Theme.of(context).textTheme.titleLarge,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: defaultPadding),
          TextFormField(
            controller: _addressController,
            decoration: const InputDecoration(
              labelText: 'Street Address',
              hintText: 'Enter your street address',
              border: OutlineInputBorder(),
            ),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter street address';
              }
              return null;
            },
          ),
          const SizedBox(height: defaultPadding),
          TextFormField(
            controller: _cityController,
            decoration: const InputDecoration(
              labelText: 'City',
              hintText: 'Enter your city',
              border: OutlineInputBorder(),
            ),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter city';
              }
              return null;
            },
          ),
          const SizedBox(height: defaultPadding),
          TextFormField(
            controller: _stateController,
            decoration: const InputDecoration(
              labelText: 'State/Region',
              hintText: 'Enter your state or region',
              border: OutlineInputBorder(),
            ),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter state/region';
              }
              return null;
            },
          ),
          const SizedBox(height: defaultPadding),
          TextFormField(
            controller: _countryController,
            decoration: const InputDecoration(
              labelText: 'Country',
              hintText: 'Enter your country',
              border: OutlineInputBorder(),
            ),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter country';
              }
              return null;
            },
          ),
          // const SizedBox(height: defaultPadding),
          // TextFormField(
          //   controller: _phoneController,
          //   decoration: const InputDecoration(
          //     labelText: 'Phone Number',
          //     hintText: 'Enter your phone number',
          //     border: OutlineInputBorder(),
          //   ),
          //   keyboardType: TextInputType.phone,
          //   validator: (value) {
          //     if (value == null || value.isEmpty) {
          //       return 'Please enter phone number';
          //     }
          //     return null;
          //   },
          // ),
          const SizedBox(height: defaultPadding * 1.5),
          ElevatedButton(
            onPressed: () {
              if (_formKey.currentState!.validate()) {
                final fullAddress = [
                  _addressController.text.trim(),
                  _cityController.text.trim(),
                  _stateController.text.trim(),
                  _countryController.text.trim(),
                ].join(', ');

                final address = Address(
                  id: DateTime.now().toString(),
                  fullAddress: fullAddress,
                  primary: false,
                  phoneNumber: _phoneController.text.trim(),
                  addressType: 'home',
                );

                context
                    .read<AddressBloc>()
                    .add(AddAddressEvent(address: address));
                widget.onAddressAdded();
                Navigator.pop(context);
              }
            },
            child: const Text('Save Address'),
          ),
          const SizedBox(height: defaultPadding),
        ],
      ),
    );
  }
}
