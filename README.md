APIs
customers:
GET http://localhost:8000/customers
GET http://localhost:8000/customers/top-five
GET http://localhost:8000/customers/<any_id_from_previous_response>

invoices

GET http://localhost:8000/invoices
GET http://localhost:8000/invoices?page=1&limit=10
GET http://localhost:8000/invoices?status=Paid
GET http://localhost:8000/invoices?sortBy=amount&sortOrder=asc
GET http://localhost:8000/invoices?issueDateFrom=2024-01-01&issueDateTo=2024-06-01
GET http://localhost:8000/invoices/:id
POST http://localhost:8000/invoices
PATCH http://localhost:8000/invoices/:id
DELETE http://localhost:8000/invoices/:id
