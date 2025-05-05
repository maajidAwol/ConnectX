import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import 'package:korecha/core/usecases/usecase.dart';
// import 'package:shop/features/authentication/data/datasources/auth_remote_data_source.dart';
import 'package:korecha/features/authentication/domain/entities/user.dart';
import 'package:korecha/features/authentication/domain/usecases/get_profile.dart';

part 'profile_event.dart';
part 'profile_state.dart';

class ProfileBloc extends Bloc<ProfileEvent, ProfileState> {
  final GetProfile getProfile;
  // final AuthRemoteDataSource remoteDataSource;

  ProfileBloc({required this.getProfile})
      : super(ProfileInitial()) {
    on<LoadProfile>(_loadProfile);
  } 

  Future<void> _loadProfile(ProfileEvent event, Emitter<ProfileState> emit) async {
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
}
