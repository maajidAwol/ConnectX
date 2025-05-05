part of 'discover_bloc.dart';

sealed class DiscoverEvent extends Equatable {
  const DiscoverEvent();

  @override
  List<Object> get props => [];
}

class LoadDiscoverCategories extends DiscoverEvent {}
class LoadDiscoverProductsByCategory extends DiscoverEvent {}
class SearchProductByQuery extends DiscoverEvent {
  final String query;

  const SearchProductByQuery({required this.query});

 
}
