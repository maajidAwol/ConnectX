part of 'profile_bloc.dart';

@immutable
sealed class ProfileEvent {}

final class LoadProfile extends ProfileEvent {}

final class UpdateProfileEvent extends ProfileEvent {
  final String? name;
  final String? bio;
  final String? phoneNumber;
  final String? avatarPath;

  UpdateProfileEvent({this.name, this.bio, this.phoneNumber, this.avatarPath});
}
