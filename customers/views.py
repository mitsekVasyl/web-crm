from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage

from .models import Customer
from .serializers import CustomerSerializer


@api_view(['GET', 'POST'])
def customers_list(request):
    if request.method == 'GET':
        data = []
        next_page = 1
        previous_page = 1

        customers = Customer.objects.all()
        page_number = request.GET.get('page', 1)
        paginator = Paginator(customers, 10)
        try:
            data = paginator.page(page_number)
        except PageNotAnInteger:
            data = paginator.page(1)
        except EmptyPage:
            data = paginator.page(paginator.num_pages)

        serializer = CustomerSerializer(data, context={'request': request}, many=True)
        if data.has_next():
            next_page = data.next_page_number()
        if data.has_previous():
            previous_page = data.previous_page_number()

        return Response({'data': serializer.data,
                         'count': paginator.count,
                         'num_pages': paginator.num_pages,
                         'next_link': '/api/customers/?page=' + str(next_page),
                         'prev_link': '/api/customers/?page=' + str(previous_page)})

    elif request.method == 'POST':
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def customer_details(request, customer_id):
    request_method = request.method
    try:
        customer = Customer.objects.get(pk=customer_id)
    except Customer.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request_method == 'GET':
        serializer = CustomerSerializer(customer, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request_method == 'PUT':
        serializer = CustomerSerializer(customer, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request_method == 'DELETE':
        customer.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

