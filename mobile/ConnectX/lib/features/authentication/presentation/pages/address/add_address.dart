import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:korecha/features/authentication/domain/entities/address.dart';
import 'package:korecha/features/authentication/presentation/state/address/bloc/address_bloc.dart';
import 'package:korecha/constants.dart';

class AddressScreen extends StatefulWidget {
  const AddressScreen({super.key});

  @override
  State<AddressScreen> createState() => _AddressScreenState();
}

class _AddressScreenState extends State<AddressScreen> {
  final _formKey = GlobalKey<FormState>();
  final _addressController = TextEditingController();
  final _cityController = TextEditingController();
  final _stateController = TextEditingController();
  final _countryController = TextEditingController();

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
    _addressController.dispose();
    _cityController.dispose();
    _stateController.dispose();
    _countryController.dispose();
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
        child: Form(
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
                  // fillColor: primaryMaterialColor[200],
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
              const SizedBox(height: defaultPadding * 1.5),
              ElevatedButton(
                onPressed: () async {
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
                      phoneNumber: '',
                      addressType: 'home',
                    );

                    // Add the new address
                    context
                        .read<AddressBloc>()
                        .add(AddAddressEvent(address: address));

                    // Clear form fields
                    _addressController.clear();
                    _cityController.clear();
                    _stateController.clear();
                    _countryController.clear();

                    Navigator.pop(context);
                  }
                },
                child: const Text('Save Address'),
              ),
              const SizedBox(height: defaultPadding),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Addresses'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: _showAddAddressDialog,
          ),
        ],
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
              // Reload addresses after successful addition
              if (state is AddressAdded) {
                _loadAddresses();
              }
            },
          ),
        ],
        child: Padding(
          padding: const EdgeInsets.all(defaultPadding),
          child: BlocBuilder<AddressBloc, AddressState>(
            builder: (context, state) {
              if (state is AddressLoading) {
                return const Center(child: CircularProgressIndicator());
              }
              if (state is AddressError) {
                return Center(child: Text(state.message));
              }
              if (state is AddressLoaded) {
                if (state.addresses.isEmpty) {
                  return Center(
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
                          style:
                              Theme.of(context).textTheme.bodyLarge?.copyWith(
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
                  );
                }

                return ListView.builder(
                  itemCount: state.addresses.length,
              itemBuilder: (context, index) {
                    final address = state.addresses[index];
                return Container(
                      margin: const EdgeInsets.only(bottom: defaultPadding),
                  decoration: BoxDecoration(
                    border: Border.all(
                          color: address.primary
                          ? Theme.of(context).primaryColor
                          : Colors.grey[300]!,
                    ),
                    borderRadius: BorderRadius.circular(12),
                  ),
                      child: ListTile(
                        leading: Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                            color: address.primary
                                  ? Theme.of(context)
                                      .primaryColor
                                      .withOpacity(0.1)
                                  : Colors.grey[100],
                              shape: BoxShape.circle,
                            ),
                            child: Icon(
                              Icons.home_outlined,
                            color: address.primary
                                  ? Theme.of(context).primaryColor
                                  : Colors.grey[600],
                            ),
                          ),
                        title: Text(
                          address.primary
                              ? 'Primary Address'
                              : 'Additional Address',
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        subtitle: Text(address.fullAddress),
                      ),
                    );
                  },
                );
              }
              return const SizedBox.shrink();
              },
            ),
          ),
      ),
    );
  }
}
