part of 'profile_bloc.dart';

@immutable
sealed class ProfileEvent {}

final class LoadProfile extends ProfileEvent {}
