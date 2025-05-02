from rest_framework.pagination import PageNumberPagination

class CustomPagination(PageNumberPagination):
    page_size_query_param = 'size'   # allows ?size=20
    max_page_size = 100              # optional: limit max to prevent abuse
    page_size = 10                   # fallback default
