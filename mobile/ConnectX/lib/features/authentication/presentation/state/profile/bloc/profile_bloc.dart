import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import 'package:korecha/core/usecases/usecase.dart';
// import 'package:shop/features/authentication/data/datasources/auth_remote_data_source.dart';
import 'package:korecha/features/authentication/domain/entities/user.dart';
import 'package:korecha/features/authentication/domain/usecases/get_profile.dart';
import 'package:korecha/features/authentication/domain/usecases/update_profile.dart';

part 'profile_event.dart';
part 'profile_state.dart';

class ProfileBloc extends Bloc<ProfileEvent, ProfileState> {
  final GetProfile getProfile;
  final UpdateProfile updateProfile;
  // final AuthRemoteDataSource remoteDataSource;

  ProfileBloc({required this.getProfile, required this.updateProfile})
    : super(ProfileInitial()) {
    on<LoadProfile>(_loadProfile);
    on<UpdateProfileEvent>(_updateProfile);
  }

  Future<void> _loadProfile(
    ProfileEvent event,
    Emitter<ProfileState> emit,
  ) async {
    emit(ProfileLoading());
    try {
      final result = await getProfile(NoParams());
      result.fold(
        (failure) => emit(ProfileError(failure.toString())),
        (user) => emit(ProfileLoaded(user)),
      );
    } catch (e) {
      emit(ProfileError(e.toString()));
    }
  }

  Future<void> _updateProfile(
    UpdateProfileEvent event,
    Emitter<ProfileState> emit,
  ) async {
    emit(ProfileUpdating());
    try {
      final result = await updateProfile(
        UpdateProfileParams(
          name: event.name,
          bio: event.bio,
          phoneNumber: event.phoneNumber,
          avatarPath: event.avatarPath,
        ),
      );
      result.fold(
        (failure) => emit(ProfileUpdateError(failure.toString())),
        (user) => emit(ProfileUpdated(user)),
      );
    } catch (e) {
      emit(ProfileUpdateError(e.toString()));
    }
  }
}
