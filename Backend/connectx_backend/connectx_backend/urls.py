"""
URL configuration for connectx_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# from django.contrib import admin
# from django.urls import path, include



# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('api/', include('users.urls')),
#     path('api/', include('stock_requests.urls')),
#     path('api/', include('orders.urls')),
# ]
from django.contrib import admin
from django.http import HttpResponse
from django.urls import path, include
<<<<<<< HEAD
=======
def home(request):
    return HttpResponse("Welcome to ConnectX API")
>>>>>>> 6dd48a396774daf863f00cf52078df9c669d2664

urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/transactions/', include('transactions.urls')),

    path('api/', include('stock_requests.urls')),
    path('api/', include('orders.urls')),
]