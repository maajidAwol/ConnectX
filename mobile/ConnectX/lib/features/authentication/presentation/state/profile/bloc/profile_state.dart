part of 'profile_bloc.dart';

@immutable
sealed class ProfileState {}

final class ProfileInitial extends ProfileState {}

final class ProfileLoading extends ProfileState {}

final class ProfileLoaded extends ProfileState {
  final User user;

  ProfileLoaded(this.user);
}

final class ProfileError extends ProfileState {
  final String message;
  ProfileError(this.message);
}

final class ProfileUpdating extends ProfileState {}

final class ProfileUpdated extends ProfileState {
  final User user;

  ProfileUpdated(this.user);
}

final class ProfileUpdateError extends ProfileState {
  final String message;

  ProfileUpdateError(this.message);
}
