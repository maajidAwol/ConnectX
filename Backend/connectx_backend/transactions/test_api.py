from django.test import TestCase

# Create your tests here.
import requests

# GET request
response = requests.get('http://127.0.0.1:8001/api/transactions/')
print('GET Response:', response.json())

# POST request with valid data
data = {
    "transaction_type": "sale", 
    "quantity": 10,
    "product": 0x7bf728d7c110  
}
post_response = requests.post('http://127.0.0.1:8001/api/transactions/', json=data)
print('POST Response:', post_response.json())